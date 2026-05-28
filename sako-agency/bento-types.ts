/**
 * @fileoverview bento-types.ts
 * @description Complete TypeScript contract surface for the Magnetic Bento Grid system.
 * All configuration, state, DOM attribute, and event shapes are declared here.
 * Zero use of `any` or unguarded `unknown` — every boundary is explicitly typed.
 *
 * Architecture rationale: centralising contracts in a single module allows both the
 * core engine (bento-grid.ts) and any future consumer (React wrapper, Web Component,
 * SSR adapter) to import from one canonical source of truth.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIMITIVE ALIASES
// ─────────────────────────────────────────────────────────────────────────────

/** Zero-based track index within the grid's column or row axis. */
export type TrackIndex = number;

/** Fractional unit value for a CSS grid track (must be > 0). */
export type FractionalUnit = number;

/** CSS Custom Property name including leading `--`, e.g. `--col-0`. */
export type CSSCustomProperty = `--${string}`;

/** A valid CSS easing function string. */
export type CSSEasingFunction = string;

/** Milliseconds duration for a CSS transition. */
export type DurationMs = number;

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONFIGURATION CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configures a single cell's visual content and spanning behaviour.
 * Consumed from `data-bento-cell` JSON attribute on child elements.
 */
export interface BentoCellConfig {
  /** Unique identifier for the cell; used for ARIA and internal keying. */
  id: string;
  /** Human-readable label rendered as the card's primary heading. */
  label: string;
  /** Optional secondary descriptor rendered below the label. */
  sublabel?: string;
  /** Emoji or single character icon rendered as large decorative text. */
  icon?: string;
  /**
   * Accent colour token — must resolve to a CSS colour value.
   * Applied to `--cell-accent` custom property on the cell element.
   */
  accent?: string;
  /** Number of grid columns this cell spans. Defaults to 1. */
  colSpan?: number;
  /** Number of grid rows this cell spans. Defaults to 1. */
  rowSpan?: number;
  /** Tag string used to render a small pill badge on the card. */
  tag?: string;
}

/**
 * Motion configuration controlling the physics of track expansion.
 * All values are applied to CSS transitions on the grid container.
 */
export interface BentoMotionConfig {
  /**
   * CSS cubic-bezier or named easing applied to grid track transitions.
   * Default: `cubic-bezier(0.25, 1, 0.5, 1)` — a spring-like ease-out
   * that feels physically weighted without requiring a JS animation loop.
   */
  easing: CSSEasingFunction;
  /** Total transition duration in milliseconds. Default: 450. */
  duration: DurationMs;
  /**
   * Milliseconds of additional delay before the collapse transition begins
   * after mouse-leave. Creates a comfortable "linger" feel. Default: 80.
   */
  collapseDelay: DurationMs;
}

/**
 * Controls how aggressively the hovered track expands and how neighbouring
 * tracks are redistributed to compensate.
 *
 * Mathematical invariant:
 *   sum(all column fr values) === columns * 1fr  (always)
 *   sum(all row fr values)    === rows * 1fr      (always)
 *
 * This guarantee prevents container overflow under any expansion factor.
 */
export interface BentoExpansionConfig {
  /**
   * Multiplier applied to the hovered column track's base `1fr`.
   * A value of 2.4 means the hovered column becomes 2.4× its natural width.
   * Remaining columns split the deficit proportionally.
   * Default: 2.4
   */
  columnFactor: number;
  /**
   * Multiplier applied to the hovered row track's base `1fr`.
   * Default: 1.8
   */
  rowFactor: number;
  /**
   * Opacity applied to non-active cells when any cell is focused.
   * Range: 0–1. Default: 0.35
   */
  dimOpacity: number;
  /**
   * CSS transform scale applied to the micro-content *inside* the active cell.
   * Applied to the `.bento-cell__inner` child via CSS class toggle.
   * Default: 1.04
   */
  innerContentScale: number;
}

/**
 * Top-level configuration object passed to `BentoGrid` constructor.
 * All fields have sensible defaults; only the container element is required.
 */
export interface BentoGridConfig {
  /** The grid wrapper element — must already exist in the DOM. */
  container: HTMLElement;
  /**
   * Number of explicit column tracks. Rows are inferred from child count
   * unless `rows` is also provided. Default: 3
   */
  columns: number;
  /**
   * Number of explicit row tracks. If omitted, the grid auto-places rows.
   * When provided, `rows * columns` should equal or exceed the child count.
   * Default: 3
   */
  rows: number;
  /** Gap between cells in pixels; applied as `--bento-gap` custom property. Default: 12 */
  gap: number;
  /** Motion timing configuration. */
  motion: BentoMotionConfig;
  /** Expansion factor and dimming configuration. */
  expansion: BentoExpansionConfig;
  /**
   * When true, keyboard focus (Tab) triggers the same expansion as hover.
   * Default: true
   */
  keyboardAccessible: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STATE CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents the computed fractional unit distribution for a single axis
 * (columns or rows) at a given point in time.
 *
 * `tracks[i]` is the fr value for track index `i`.
 * Invariant: tracks.reduce((s, v) => s + v, 0) === tracks.length
 */
export interface TrackDistribution {
  tracks: ReadonlyArray<FractionalUnit>;
  /** Which track index is currently expanded, or null if none. */
  activeIndex: TrackIndex | null;
}

/**
 * Full grid state snapshot. The style engine converts this into inline
 * CSS Custom Properties on the container element each frame.
 */
export interface BentoGridState {
  columns: TrackDistribution;
  rows: TrackDistribution;
  /**
   * The currently hovered/focused cell element, or null.
   * Used to apply `.is-active` and manage dimming of siblings.
   */
  activeCell: HTMLElement | null;
  /**
   * Whether any cell is currently active. Used to toggle the
   * `.bento-grid--dimmed` class on the container.
   */
  isDimmed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DOM DATA-ATTRIBUTE CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strongly typed map of every `data-*` attribute the grid engine reads
 * from the container element.
 *
 * HTML usage example:
 * ```html
 * <div
 *   data-bento-columns="3"
 *   data-bento-rows="3"
 *   data-bento-gap="12"
 *   data-bento-column-factor="2.4"
 *   data-bento-row-factor="1.8"
 *   data-bento-duration="450"
 *   data-bento-dim-opacity="0.35"
 * >
 * ```
 */
export interface BentoContainerAttributes {
  'data-bento-columns'?: string;
  'data-bento-rows'?: string;
  'data-bento-gap'?: string;
  'data-bento-column-factor'?: string;
  'data-bento-row-factor'?: string;
  'data-bento-duration'?: string;
  'data-bento-collapse-delay'?: string;
  'data-bento-dim-opacity'?: string;
  'data-bento-inner-scale'?: string;
  'data-bento-keyboard'?: 'true' | 'false';
}

/**
 * Strongly typed map of every `data-*` attribute the grid engine reads
 * from individual cell elements.
 *
 * HTML usage example:
 * ```html
 * <article
 *   data-bento-cell='{"id":"cell-1","label":"Analytics","icon":"📊","accent":"#6366f1"}'
 *   data-bento-col="0"
 *   data-bento-row="0"
 *   data-bento-col-span="2"
 *   data-bento-row-span="1"
 * >
 * ```
 */
export interface BentoCellAttributes {
  'data-bento-cell'?: string; // JSON-encoded BentoCellConfig
  'data-bento-col'?: string;  // zero-based column index (auto-placed if omitted)
  'data-bento-row'?: string;  // zero-based row index  (auto-placed if omitted)
  'data-bento-col-span'?: string;
  'data-bento-row-span'?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. INTERNAL ENGINE TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Metadata resolved for each cell element after DOM parsing.
 * Stored in a WeakMap keyed by the element to avoid memory leaks.
 */
export interface ResolvedCellMeta {
  config: BentoCellConfig;
  /** Zero-based column index of the cell's top-left corner. */
  colIndex: TrackIndex;
  /** Zero-based row index of the cell's top-left corner. */
  rowIndex: TrackIndex;
  colSpan: number;
  rowSpan: number;
}

/**
 * Bound event listener pair stored for clean removal during destroy().
 * Generic over the EventTarget subtype and event type for full type safety.
 */
export interface BoundListener<
  T extends EventTarget,
  K extends string
> {
  target: T;
  type: K;
  listener: EventListenerOrEventListenerObject;
  options?: AddEventListenerOptions;
}

/**
 * The public API surface exposed by a BentoGrid instance.
 */
export interface BentoGridInstance {
  /** Tear down all event listeners and reset the grid to its default state. */
  destroy(): void;
  /** Programmatically activate a cell by its configured id. */
  activateCellById(id: string): void;
  /** Collapse any active expansion and return to the neutral state. */
  reset(): void;
  /** Read-only snapshot of the current grid state. */
  readonly state: Readonly<BentoGridState>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. UTILITY / HELPER TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Computes a union of CSS Custom Property names for a given axis.
 * e.g. ColCustomProperty<3> resolves to '--col-0' | '--col-1' | '--col-2'
 *
 * Note: TypeScript's template-literal types cannot iterate over numeric ranges
 * directly — this type serves as a documentation alias for the pattern.
 */
export type AxisCustomProperty = `--col-${number}` | `--row-${number}`;

/** Axis discriminator used in shared track-calculation functions. */
export type GridAxis = 'column' | 'row';

/**
 * Default configuration values — exported so consumers can spread/override
 * without duplicating magic numbers.
 */
export const BENTO_DEFAULTS = {
  columns: 3,
  rows: 3,
  gap: 12,
  motion: {
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    duration: 450,
    collapseDelay: 80,
  } satisfies BentoMotionConfig,
  expansion: {
    columnFactor: 2.4,
    rowFactor: 1.8,
    dimOpacity: 0.35,
    innerContentScale: 1.04,
  } satisfies BentoExpansionConfig,
  keyboardAccessible: true,
} as const satisfies Omit<BentoGridConfig, 'container'>;
