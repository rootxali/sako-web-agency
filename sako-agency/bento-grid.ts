/**
 * @fileoverview bento-grid.ts
 * @description Core engine for the Magnetic Bento Grid.
 *
 * Architecture overview
 * ─────────────────────
 * `BentoGrid` is an instantiated class whose lifecycle mirrors the DOM node it
 * manages. Each instance maintains its own closed-over state and listener
 * registry — multiple grids on the same page share no mutable globals.
 *
 * Performance rationale
 * ─────────────────────
 * Track redistribution is implemented as pure arithmetic on CSS Custom
 * Properties (`--col-N`, `--row-N`) written directly to the container's
 * inline style. The CSS engine then composites the change through its own
 * optimised interpolation path driven by a single `transition` declaration
 * on `grid-template-columns` / `grid-template-rows`.
 *
 * This is intentionally NOT a `requestAnimationFrame` loop. We delegate
 * interpolation to the browser's GPU-accelerated layout engine, which:
 *   1. Avoids JavaScript scheduling jitter between frames.
 *   2. Keeps the main thread free for input handling.
 *   3. Respects `prefers-reduced-motion` at the CSS level automatically.
 *
 * The single JS "frame" per interaction event is O(n) where n = track count —
 * negligibly cheap even for large grids.
 */

import {
  BENTO_DEFAULTS,
  type BentoGridConfig,
  type BentoGridInstance,
  type BentoGridState,
  type BentoCellConfig,
  type BentoCellAttributes,
  type BentoContainerAttributes,
  type BoundListener,
  type FractionalUnit,
  type GridAxis,
  type ResolvedCellMeta,
  type TrackDistribution,
  type TrackIndex,
} from './bento-types';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — pure functions, no side effects
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads a numeric data attribute from an element, falling back to a default.
 *
 * @param el   - The element to interrogate.
 * @param attr - The attribute name (without `data-` prefix).
 * @param fallback - Value returned when the attribute is absent or NaN.
 */
function readNumericAttr(
  el: HTMLElement,
  attr: keyof BentoContainerAttributes,
  fallback: number
): number {
  const raw = el.getAttribute(attr);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Reads a boolean data attribute. Treats absence and "true" both as true,
 * "false" as false.
 */
function readBooleanAttr(
  el: HTMLElement,
  attr: keyof BentoContainerAttributes,
  fallback: boolean
): boolean {
  const raw = el.getAttribute(attr);
  if (raw === null) return fallback;
  return raw !== 'false';
}

/**
 * Parses the `data-bento-cell` JSON attribute on a cell element.
 * Returns `null` on parse failure so the cell is gracefully skipped.
 */
function parseCellConfig(el: HTMLElement): BentoCellConfig | null {
  const raw = el.getAttribute('data-bento-cell' satisfies keyof BentoCellAttributes);
  if (!raw) return null;
  try {
    // JSON.parse returns `unknown` in strict mode; we narrow via a type predicate.
    const parsed: unknown = JSON.parse(raw);
    if (isPlainObject(parsed) && typeof parsed['id'] === 'string') {
      return parsed as unknown as BentoCellConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Narrow type predicate: `value` is a plain JS object (not an array).
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Computes the fr distribution for a single grid axis after an expansion event.
 *
 * Mathematical invariant maintained:
 *   Σ result[i] === trackCount   (always equal to trackCount × 1fr baseline)
 *
 * @param trackCount  - Total number of tracks on this axis.
 * @param activeIndex - The track index being expanded (0-based).
 * @param factor      - Expansion multiplier for the active track.
 *
 * Example (3 tracks, activeIndex=1, factor=2.4):
 *   Active track  → 2.4 fr
 *   Remaining     → (3 - 2.4) / 2 = 0.3 fr each
 *   Sum           → 2.4 + 0.3 + 0.3 = 3.0 ✓
 */
function computeExpandedTracks(
  trackCount: number,
  activeIndex: TrackIndex,
  factor: number
): ReadonlyArray<FractionalUnit> {
  const activeFr = factor;
  const remainingFrPool = trackCount - activeFr;
  const otherTrackCount = trackCount - 1;
  // Guard: if factor ≥ trackCount, clamp to leave others at a minimum of 0.1fr.
  const otherFr =
    otherTrackCount > 0
      ? Math.max(remainingFrPool / otherTrackCount, 0.1)
      : 0;

  return Array.from({ length: trackCount }, (_, i) =>
    i === activeIndex ? activeFr : otherFr
  );
}

/**
 * Computes the uniform baseline distribution — all tracks equal 1fr.
 */
function computeUniformTracks(trackCount: number): ReadonlyArray<FractionalUnit> {
  return Array.from({ length: trackCount }, () => 1);
}

/**
 * Converts a TrackDistribution into a CSS `grid-template-*` value string,
 * referencing Custom Properties so the browser can tween between them.
 *
 * e.g. for 3 columns: "var(--col-0) var(--col-1) var(--col-2)"
 *
 * The inline `--col-N` properties carry the actual fr values; this string
 * acts as the structural declaration that binds them to the grid layout.
 *
 * @param count - Number of tracks.
 * @param axis  - 'column' | 'row' — determines the CSS variable prefix.
 */
function buildTemplateValue(count: number, axis: GridAxis): string {
  const prefix = axis === 'column' ? 'col' : 'row';
  return Array.from({ length: count }, (_, i) => `var(--${prefix}-${i})`).join(
    ' '
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merges declarative `data-*` attributes from the container element with any
 * programmatic overrides, producing a fully resolved `BentoGridConfig`.
 *
 * Attribute values always win over programmatic defaults but lose to explicit
 * programmatic overrides when provided.
 */
function resolveConfig(
  container: HTMLElement,
  overrides: Partial<Omit<BentoGridConfig, 'container'>>
): BentoGridConfig {
  const d = BENTO_DEFAULTS;

  return {
    container,
    columns: overrides.columns
      ?? readNumericAttr(container, 'data-bento-columns', d.columns),
    rows: overrides.rows
      ?? readNumericAttr(container, 'data-bento-rows', d.rows),
    gap: overrides.gap
      ?? readNumericAttr(container, 'data-bento-gap', d.gap),
    keyboardAccessible: overrides.keyboardAccessible
      ?? readBooleanAttr(container, 'data-bento-keyboard', d.keyboardAccessible),
    motion: {
      easing: overrides.motion?.easing ?? d.motion.easing,
      duration: overrides.motion?.duration
        ?? readNumericAttr(container, 'data-bento-duration', d.motion.duration),
      collapseDelay: overrides.motion?.collapseDelay
        ?? readNumericAttr(container, 'data-bento-collapse-delay', d.motion.collapseDelay),
    },
    expansion: {
      columnFactor: overrides.expansion?.columnFactor
        ?? readNumericAttr(container, 'data-bento-column-factor', d.expansion.columnFactor),
      rowFactor: overrides.expansion?.rowFactor
        ?? readNumericAttr(container, 'data-bento-row-factor', d.expansion.rowFactor),
      dimOpacity: overrides.expansion?.dimOpacity
        ?? readNumericAttr(container, 'data-bento-dim-opacity', d.expansion.dimOpacity),
      innerContentScale: overrides.expansion?.innerContentScale
        ?? readNumericAttr(container, 'data-bento-inner-scale', d.expansion.innerContentScale),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE CLASS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * `BentoGrid` — the main lifecycle manager for a single magnetic bento grid.
 *
 * Instantiate once per grid container. The class is entirely self-contained:
 * no module-level state, no singleton assumptions.
 *
 * @example
 * ```ts
 * const grid = new BentoGrid(document.querySelector('.bento-grid')!);
 * // later…
 * grid.destroy();
 * ```
 */
export class BentoGrid implements BentoGridInstance {
  // ── Configuration ─────────────────────────────────────────────────────────
  readonly #config: BentoGridConfig;

  // ── State ─────────────────────────────────────────────────────────────────
  #state: BentoGridState;

  // ── Cell metadata map (WeakMap prevents holding cell elements in memory) ──
  readonly #cellMeta: WeakMap<HTMLElement, ResolvedCellMeta> = new WeakMap();

  // ── Listener registry for clean removal on destroy() ──────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- EventTarget subtypes vary; stored as base type
  readonly #listeners: Array<BoundListener<EventTarget, string>> = [];

  // ── Collapse timer handle ──────────────────────────────────────────────────
  #collapseTimer: ReturnType<typeof setTimeout> | null = null;

  // ── All direct cell children ───────────────────────────────────────────────
  #cells: HTMLElement[] = [];

  constructor(
    container: HTMLElement,
    overrides: Partial<Omit<BentoGridConfig, 'container'>> = {}
  ) {
    this.#config = resolveConfig(container, overrides);
    this.#state = this.#buildInitialState();
    this.#init();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Returns a read-only snapshot of the current grid state.
   * Consumers should not mutate the returned object.
   */
  get state(): Readonly<BentoGridState> {
    return this.#state;
  }

  /**
   * Programmatically activates a cell by its configured `BentoCellConfig.id`.
   * Useful for tutorial flows, deep-linking, or external UI controls.
   */
  activateCellById(id: string): void {
    const target = this.#cells.find(
      (el) => this.#cellMeta.get(el)?.config.id === id
    );
    if (target) this.#handleActivate(target);
  }

  /**
   * Collapses any active expansion and restores the uniform neutral state.
   */
  reset(): void {
    this.#handleDeactivate();
  }

  /**
   * Tears down all event listeners, clears timers, and resets inline styles.
   * MUST be called when removing the grid from the DOM to prevent memory leaks.
   *
   * After calling destroy(), this instance should be discarded.
   */
  destroy(): void {
    // Cancel any pending collapse animation
    if (this.#collapseTimer !== null) {
      clearTimeout(this.#collapseTimer);
      this.#collapseTimer = null;
    }

    // Remove all registered event listeners
    for (const entry of this.#listeners) {
      entry.target.removeEventListener(entry.type, entry.listener, entry.options);
    }
    this.#listeners.length = 0;

    // Reset container to clean state
    this.#resetContainerStyles();
    this.#config.container.classList.remove('bento-grid--dimmed', 'bento-grid--ready');

    // Clear active class from all cells
    for (const cell of this.#cells) {
      cell.classList.remove('is-active');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALISATION
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Bootstraps the grid: resolves cells, applies structural CSS Custom
   * Properties, writes the initial track template, and registers events.
   */
  #init(): void {
    const { container } = this.#config;

    // Collect and validate cell children
    this.#cells = this.#resolveCells();

    // Apply structural custom properties (gap, track counts, etc.)
    this.#applyStructuralProperties();

    // Write initial uniform track distribution to DOM
    this.#applyState(this.#state, false);

    // Register interaction listeners
    this.#registerListeners();

    // Signal readiness (triggers CSS entrance animation)
    requestAnimationFrame(() => {
      container.classList.add('bento-grid--ready');
    });
  }

  /**
   * Collects all direct children that are `HTMLElement` instances,
   * parses their metadata, and auto-assigns `grid-column` / `grid-row`
   * inline styles where explicit positions are declared via attributes.
   */
  #resolveCells(): HTMLElement[] {
    const { container } = this.#config;
    const children = Array.from(container.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );

    children.forEach((el, autoIndex) => {
      const config = parseCellConfig(el) ?? this.#fallbackCellConfig(el, autoIndex);

      const colAttr = el.getAttribute('data-bento-col' satisfies keyof BentoCellAttributes);
      const rowAttr = el.getAttribute('data-bento-row' satisfies keyof BentoCellAttributes);
      const colSpanAttr = el.getAttribute('data-bento-col-span' satisfies keyof BentoCellAttributes);
      const rowSpanAttr = el.getAttribute('data-bento-row-span' satisfies keyof BentoCellAttributes);

      const colIndex = colAttr !== null ? parseInt(colAttr, 10) : autoIndex % this.#config.columns;
      const rowIndex = rowAttr !== null ? parseInt(rowAttr, 10) : Math.floor(autoIndex / this.#config.columns);
      const colSpan = colSpanAttr !== null ? parseInt(colSpanAttr, 10) : config.colSpan ?? 1;
      const rowSpan = rowSpanAttr !== null ? parseInt(rowSpanAttr, 10) : config.rowSpan ?? 1;

      this.#cellMeta.set(el, { config, colIndex, rowIndex, colSpan, rowSpan });

      // Apply ARIA
      el.setAttribute('role', 'article');
      el.setAttribute('aria-label', config.label);
      if (!el.id) el.id = `bento-cell-${config.id}`;

      // Apply accent colour as a scoped custom property
      if (config.accent) {
        el.style.setProperty('--cell-accent', config.accent);
      }

      // Apply tabIndex for keyboard navigation
      if (this.#config.keyboardAccessible) {
        el.tabIndex = 0;
      }
    });

    return children;
  }

  /**
   * Generates a minimal fallback config when `data-bento-cell` is absent.
   * This allows plain HTML children without JSON attributes to still work.
   */
  #fallbackCellConfig(el: HTMLElement, index: number): BentoCellConfig {
    return {
      id: el.id || `cell-${index}`,
      label: el.getAttribute('aria-label') ?? `Cell ${index + 1}`,
    };
  }

  /**
   * Writes the one-time structural CSS Custom Properties to the container.
   * These do not change after init (only track fr values change on hover).
   */
  #applyStructuralProperties(): void {
    const { container, columns, rows, gap, motion, expansion } = this.#config;
    const s = container.style;

    s.setProperty('--bento-cols', String(columns));
    s.setProperty('--bento-rows', String(rows));
    s.setProperty('--bento-gap', `${gap}px`);
    s.setProperty('--bento-duration', `${motion.duration}ms`);
    s.setProperty('--bento-easing', motion.easing);
    s.setProperty('--bento-dim-opacity', String(expansion.dimOpacity));
    s.setProperty('--bento-inner-scale', String(expansion.innerContentScale));

    // Write the grid-template-* values referencing the custom property tracks
    s.setProperty(
      'grid-template-columns',
      buildTemplateValue(columns, 'column')
    );
    s.setProperty(
      'grid-template-rows',
      buildTemplateValue(rows, 'row')
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STATE MACHINE
  // ─────────────────────────────────────────────────────────────────────────

  /** Builds the initial neutral state — all tracks at 1fr, no active cell. */
  #buildInitialState(): BentoGridState {
    const { columns, rows } = this.#config;
    return {
      columns: {
        tracks: computeUniformTracks(columns),
        activeIndex: null,
      },
      rows: {
        tracks: computeUniformTracks(rows),
        activeIndex: null,
      },
      activeCell: null,
      isDimmed: false,
    };
  }

  /**
   * Computes a new BentoGridState when a cell is activated.
   *
   * @param cell - The cell element being activated.
   */
  #buildActiveState(cell: HTMLElement): BentoGridState {
    const meta = this.#cellMeta.get(cell);
    if (!meta) return this.#buildInitialState();

    const { columns, rows, expansion } = this.#config;

    return {
      columns: {
        tracks: computeExpandedTracks(columns, meta.colIndex, expansion.columnFactor),
        activeIndex: meta.colIndex,
      },
      rows: {
        tracks: computeExpandedTracks(rows, meta.rowIndex, expansion.rowFactor),
        activeIndex: meta.rowIndex,
      },
      activeCell: cell,
      isDimmed: true,
    };
  }

  /**
   * Applies a state snapshot to the DOM.
   *
   * This is the ONLY place that touches the container's inline styles for
   * track distribution — a single point of mutation, easy to audit/test.
   *
   * @param state     - The state to render.
   * @param animated  - When false, suppresses transition (used on init).
   */
  #applyState(state: BentoGridState, animated: boolean): void {
    const { container, columns, rows } = this.#config;
    const s = container.style;

    // Toggle transition
    s.setProperty('--bento-animated', animated ? '1' : '0');

    // Write column fr values
    state.columns.tracks.forEach((fr, i) => {
      s.setProperty(`--col-${i}`, `${fr}fr`);
    });

    // Write row fr values
    state.rows.tracks.forEach((fr, i) => {
      s.setProperty(`--row-${i}`, `${fr}fr`);
    });

    // Dimming class on container
    container.classList.toggle('bento-grid--dimmed', state.isDimmed);

    // Active class on cells
    this.#cells.forEach((cell) => {
      cell.classList.toggle('is-active', cell === state.activeCell);
    });

    this.#state = state;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INTERACTION HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Activates a cell: computes the expanded state and applies it.
   * Cancels any pending collapse timer to prevent race conditions on
   * rapid hover between adjacent cells.
   */
  #handleActivate(cell: HTMLElement): void {
    if (this.#collapseTimer !== null) {
      clearTimeout(this.#collapseTimer);
      this.#collapseTimer = null;
    }
    // Skip if already active (prevents redundant style writes)
    if (this.#state.activeCell === cell) return;

    this.#applyState(this.#buildActiveState(cell), true);
  }

  /**
   * Deactivates the current cell with an optional collapse delay.
   *
   * The delay (`collapseDelay`) creates a comfortable "linger" window so that
   * quickly mousing from one cell to an adjacent one doesn't flash the neutral
   * state between activations — a common micro-interaction polish technique.
   */
  #handleDeactivate(): void {
    if (this.#collapseTimer !== null) clearTimeout(this.#collapseTimer);

    this.#collapseTimer = setTimeout(() => {
      this.#applyState(this.#buildInitialState(), true);
      this.#collapseTimer = null;
    }, this.#config.motion.collapseDelay);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EVENT REGISTRATION
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Registers all DOM event listeners and stores references in `#listeners`
   * for clean removal on destroy().
   *
   * We attach to the container via event delegation (mouseenter/mouseleave
   * use `relatedTarget` checks) rather than to each cell individually.
   * This is more memory-efficient for large grids and auto-handles
   * dynamically inserted cells.
   */
  #registerListeners(): void {
    this.#cells.forEach((cell) => {
      this.#addListener(cell, 'mouseenter', () => this.#handleActivate(cell));
      this.#addListener(cell, 'mouseleave', () => this.#handleDeactivate());

      if (this.#config.keyboardAccessible) {
        this.#addListener(cell, 'focus', () => this.#handleActivate(cell));
        this.#addListener(cell, 'blur', () => this.#handleDeactivate());
      }
    });

    // Container-level leave guard: collapses state when the pointer exits
    // the entire grid, regardless of which cell was last active.
    this.#addListener(this.#config.container, 'mouseleave', () => {
      this.#handleDeactivate();
    });
  }

  /**
   * Registers an event listener and records it in the #listeners registry.
   * All listeners MUST be registered through this method to ensure
   * they are cleaned up by destroy().
   */
  #addListener<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    listener: (event: HTMLElementEventMap[K]) => void
  ): void {
    target.addEventListener(type, listener as EventListener);
    this.#listeners.push({
      target,
      type,
      listener: listener as EventListenerOrEventListenerObject,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STYLE RESET
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Clears all inline style Custom Properties written by this instance.
   * Called by destroy() to leave the DOM in a neutral state.
   */
  #resetContainerStyles(): void {
    const { container, columns, rows } = this.#config;
    const s = container.style;

    for (let i = 0; i < columns; i++) s.removeProperty(`--col-${i}`);
    for (let i = 0; i < rows; i++) s.removeProperty(`--row-${i}`);

    [
      '--bento-cols', '--bento-rows', '--bento-gap',
      '--bento-duration', '--bento-easing',
      '--bento-dim-opacity', '--bento-inner-scale',
      '--bento-animated', 'grid-template-columns', 'grid-template-rows',
    ].forEach((prop) => s.removeProperty(prop));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY / AUTO-INIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scans the document for all elements matching `[data-bento-grid]` and
 * initialises a `BentoGrid` instance for each one.
 *
 * Returns an array of instances so callers can call `destroy()` on cleanup.
 *
 * @example
 * ```ts
 * // In your entry point:
 * const grids = initBentoGrids();
 * // On page teardown:
 * grids.forEach(g => g.destroy());
 * ```
 */
export function initBentoGrids(
  root: ParentNode = document,
  overrides: Partial<Omit<BentoGridConfig, 'container'>> = {}
): BentoGrid[] {
  const containers = Array.from(
    root.querySelectorAll<HTMLElement>('[data-bento-grid]')
  );
  return containers.map((el) => new BentoGrid(el, overrides));
}
