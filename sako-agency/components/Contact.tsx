"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import ScrollFloat from "./ScrollFloat";
import "./ContactButton.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const services = ["Web Design & Dev", "UI / UX Design", "SEO & Growth", "Brand & Graphics", "Conversion Strategy", "AI Integration", "Full Studio Retainer"];
const budgets = ["$5k \u2013 $15k", "$15k \u2013 $30k", "$30k \u2013 $75k", "$75k+"];

type AnimState = "idle" | "compressing" | "loading" | "truck-enter" | "doors-open" | "package-slide" | "doors-close" | "security" | "truck-leave" | "complete" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", budget: "", message: "", _hp: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [btnAnim, setBtnAnim] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const packageRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const doorsRef = useRef<SVGGElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setAnimState("compressing");
    setBtnAnim(true);

    const tl = gsap.timeline();
    tlRef.current = tl;
    const formEl = formRef.current;
    const stage = stageRef.current;
    const pkg = packageRef.current;
    const truck = truckRef.current;
    const doors = doorsRef.current;
    const security = securityRef.current;
    const success = successRef.current;
    const smoke = smokeRef.current;
    const progress = progressRef.current;

    if (!formEl || !stage || !pkg || !truck || !doors || !security || !success || !smoke || !progress) {
      setSending(false);
      return;
    }

    const stageW = stage.offsetWidth;
    const isMobile = stageW < 480;
    const truckW = Math.min(200, stageW * 0.55);
    const packageW = isMobile ? 70 : 100;
    const packageH = isMobile ? 50 : 70;

    const xEnter = Math.round(stageW * 1.1);
    const xTarget = Math.round(stageW * 0.5 - truckW * 0.35);
    const xLeave = -Math.round(stageW * 0.9);
    const packageSlideX = Math.round(xTarget + truckW * 0.2);
    const packageSlideY = Math.round(stageW * -0.02);
    const packageScale = isMobile ? 0.35 : 0.4;
    const smokeBottom = isMobile ? "25%" : "30%";

    gsap.set(pkg, { opacity: 0, display: "none", width: packageW, height: packageH });
    gsap.set(truck, { opacity: 0, display: "none", left: xEnter });
    gsap.set(doors, { scaleY: 1, transformOrigin: "top center" });
    gsap.set(security, { opacity: 0, display: "none", scale: 0 });
    gsap.set(success, { opacity: 0, display: "none", y: 30 });
    gsap.set(smoke, { opacity: 0, display: "none", bottom: smokeBottom });

    tl.to(formEl, {
      scale: 0.85, opacity: 0.6, duration: 0.4, ease: "power3.in",
      onStart: () => setAnimState("loading"),
    })
    .to(formEl, {
      scale: 0, opacity: 0, duration: 0.3, ease: "power3.in",
    }, "-=0.1")

    .set(pkg, { display: "block", opacity: 0, scale: 0.3, x: 0, y: 0 })
    .to(pkg, {
      opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)",
      onStart: () => setAnimState("package-slide"),
    })

    .to(progress, { width: "35%", duration: 0.4, ease: "power2.out" })

    .set(truck, { display: "block" })
    .to(truck, {
      left: xTarget, opacity: 1, duration: 1.2, ease: "power3.out",
      onStart: () => {
        setAnimState("truck-enter");
        gsap.set(smoke, { display: "flex" });
        gsap.to(smoke, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
      },
      onComplete: () => {
        setAnimState("doors-open");
      },
    })

    .to(doors, {
      scaleY: 0, duration: 0.4, ease: "back.inOut(1.7)", transformOrigin: "top center",
    })

    .to(progress, { width: "60%", duration: 0.3, ease: "power2.out" })

    .to(pkg, {
      x: packageSlideX,
      y: packageSlideY,
      scale: packageScale,
      duration: 0.7,
      ease: "power3.inOut",
      onStart: () => setAnimState("package-slide"),
    })

    .to(doors, {
      scaleY: 1, duration: 0.35, ease: "back.out(2)", transformOrigin: "top center",
      onStart: () => setAnimState("doors-close"),
    })

    .to(progress, { width: "85%", duration: 0.25, ease: "power2.out" })

    .set(security, { display: "block" })
    .to(security, {
      opacity: 1, scale: 1, duration: 0.25, ease: "power2.out",
      onStart: () => setAnimState("security"),
    })
    .to(security, {
      opacity: 0, scale: 1.4, duration: 0.4, ease: "power3.out", delay: 0.5,
    })

    .to(progress, { width: "100%", duration: 0.2, ease: "power2.out" })

    .to(truck, {
      left: xLeave, opacity: 0, duration: 1.3, ease: "power3.in",
      onStart: () => {
        setAnimState("truck-leave");
        gsap.to(smoke, { opacity: 0, x: -60, duration: 1, ease: "power3.out" });
      },
    })

    .to(pkg, { opacity: 0, duration: 0.2 }, "-=0.3");

    // At this point the "delivery" animation completed — wait for API result

    let ok = false;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      ok = res.ok;
      if (!ok) throw new Error("API error");
    } catch (err) {
      console.error(err);
      setAnimState("error");

      // brief error feedback then revert to form
      try {
        const stage = stageRef.current;
        if (stage) gsap.fromTo(stage, { y: 0 }, { y: -8, duration: 0.06, yoyo: true, repeat: 5, ease: "power1.inOut" });
        // hide animated elements
        gsap.killTweensOf([pkg, truck, progress, security, smoke]);
        gsap.set([pkg, truck, security, smoke, progress], { clearProps: "all", display: "none", opacity: 0 });
        // bring back form
        if (formEl) gsap.to(formEl, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out", delay: 0.35, onComplete: () => setAnimState("idle") });
      } catch (e) {
        console.error(e);
      }
    } finally {
      setSending(false);
      if (ok) {
        // show final success UI
        try {
          gsap.set(success, { display: "block", opacity: 0, y: 30 });
          gsap.to(success, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", onStart: () => setAnimState("complete") });
          setSent(true);
          // keep button animation long enough for visual feedback, then reset
          setTimeout(() => setBtnAnim(false), 3200);
        } catch (e) {
          console.error(e);
          setAnimState("error");
          setBtnAnim(false);
        }
      } else {
        setBtnAnim(false);
      }
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".contact-anim-target");
      if (cards) {
        gsap.fromTo(cards,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.15,
            scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
          }
        );
      }
    }, sectionRef);
    const handleResize = () => {
      // if an animation is running, kill it so measurements can be recalculated on next submit
      if (tlRef.current) {
        try { tlRef.current.kill(); } catch (e) { /* ignore */ }
        tlRef.current = null;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
      if (tlRef.current) {
        try { tlRef.current.kill(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  const inputBase: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "8px", padding: "20px 24px", color: "var(--cream)", fontSize: "15px",
    fontFamily: "'DM Sans',sans-serif", fontWeight: 300, outline: "none",
    transition: "border-color 0.3s, background 0.3s",
  };

  return (
    <section ref={sectionRef} id="contact" className="grain" style={{ position: "relative", background: "var(--black-2)", overflow: "hidden", width: "100%" }}>
      <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "30vh", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", filter: "blur(6vw)", pointerEvents: "none" }} />

      <div className="container section-pad">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "8vh" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "3vh" }}>— Let's Build Something</span>
          <div style={{ width: "min(94vw, 980px)", margin: "0 auto" }}>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="mb-0"
              textClassName="font-display text-[clamp(2.2rem,8.4vw,5.5rem)] font-light leading-[1.05] tracking-[-0.02em]"
            >
              Ready to evolve your business?
            </ScrollFloat>
          </div>
          <p style={{ width: "min(92vw, 760px)", margin: "3vh auto 0", fontSize: "clamp(0.95rem, 1.1vw, 1.25rem)", color: "var(--cream-dim)", lineHeight: 1.8 }}>
            We take on 4–6 new projects per quarter. Tell us about yours — we respond within 24 hours.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "clamp(6px, 0.8vw, 12px)", marginTop: "3vh", border: "1px solid rgba(76,201,126,0.25)", background: "rgba(76,201,126,0.05)", padding: "clamp(8px, 1vh, 12px) clamp(14px, 2vw, 24px)", borderRadius: "100vw" }}>
            <div style={{ width: "0.5vw", height: "0.5vw", minWidth: "6px", minHeight: "6px", borderRadius: "50%", background: "#4cc97e" }} className="animate-pulse-gold" />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(10px, 0.7vw, 18px)", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4cc97e" }}>2 Spots Open — Q3 2026</span>
          </div>
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(24px, 5vw, 64px)", alignItems: "start" }}>
          <div className="contact-anim-target">
            <div style={{ marginBottom: "6vh" }}>
              <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(28px, 2.5vw, 48px)", fontWeight: 400, marginBottom: "2vh" }}>Start the Conversation</h3>
              <p style={{ fontSize: "clamp(14px, 0.9vw, 24px)", color: "var(--cream-dim)", lineHeight: 1.8 }}>
                Whether you&apos;re a startup ready to make noise, or an established brand that needs reinvention — we&apos;re built for this.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh", marginBottom: "6vh" }}>
              {[
                { icon: Mail, label: "Email", value: "hello@sako.agency" },
                { icon: MapPin, label: "Location", value: "Lahore, Pakistan · Remote Worldwide" },
                { icon: Clock, label: "Response", value: "Within 24 hours" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "1.2vw" }}>
                  <div style={{ width: "3vw", height: "3vw", minWidth: "35px", minHeight: "35px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={15} color="var(--gold)" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 16px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.2vh" }}>{item.label}</div>
                    <div style={{ fontSize: "clamp(13px, 0.8vw, 22px)", color: "var(--cream-dim)" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="mt-auto"
              textClassName="font-display text-[rgba(201,168,76,0.15)] tracking-[-0.03em] select-none uppercase !font-light text-[clamp(5rem,10vw,9rem)] leading-[0.9]"
            >
              SAKO
            </ScrollFloat>
          </div>

          <div className="contact-anim-target" style={{ position: "relative" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "10vh 4vw", border: "1px solid rgba(76,201,126,0.2)", borderRadius: "12px", background: "rgba(76,201,126,0.03)" }}>
                <div className="contact-success-pulse" style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(76,201,126,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 3vh" }}>
                  <CheckCircle size={30} color="#4cc97e" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(28px, 2.5vw, 48px)", fontWeight: 400, marginBottom: "2vh" }}>Message received.</h3>
                <p style={{ fontSize: "clamp(14px, 0.9vw, 18px)", color: "var(--cream-dim)", lineHeight: 1.8 }}>We&apos;ll review your project and respond within 24 hours. Get excited.</p>
              </div>
            ) : (
              <div ref={stageRef} style={{ position: "relative", minHeight: "clamp(420px, 60vh, 560px)" }}>
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2vh",
                    position: "relative",
                    zIndex: 1,
                    opacity: animState !== "complete" ? 1 : 0,
                    pointerEvents: animState !== "idle" ? "none" : "auto",
                    transition: "opacity 0.4s ease",
                  }}
                  aria-busy={sending}
                  aria-live="polite"
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(12px, 1vw, 18px)" }}>
                    {(["name", "company"] as const).map(f => (
                      <div key={f}>
                        <label style={{ display: "block", fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 16px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1vh" }}>
                          {f === "name" ? "Full Name *" : "Company"}
                        </label>
                        <input
                          name={f} value={form[f]} onChange={handleChange}
                          required={f === "name"} placeholder={f === "name" ? "Your name" : "Company name"}
                          style={{ ...inputBase, padding: "clamp(14px, 2.5vh, 20px) clamp(12px, 1.5vw, 16px)" }}
                          onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; e.target.style.background = "rgba(201,168,76,0.03)"; }}
                          onBlur={e => { e.target.style.borderColor = "rgba(201,168,76,0.15)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 16px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1vh" }}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={{ ...inputBase, padding: "clamp(14px, 2.5vh, 20px) clamp(12px, 1.5vw, 16px)" }}
                      onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; e.target.style.background = "rgba(201,168,76,0.03)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(201,168,76,0.15)"; e.target.style.background = "rgba(255,255,255,0.03)"; }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(12px, 1vw, 18px)" }}>
                    {([
                      { name: "service", label: "Service *", options: services, placeholder: "Select service" },
                      { name: "budget", label: "Budget", options: budgets, placeholder: "Select budget" },
                    ] as const).map(f => (
                      <div key={f.name}>
                        <label style={{ display: "block", fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 16px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1vh" }}>{f.label}</label>
                        <select name={f.name} value={form[f.name as "service" | "budget"]} onChange={handleChange}
                          required={f.name === "service"}
                          style={{ ...inputBase, padding: "clamp(14px, 2.5vh, 20px) clamp(12px, 1.5vw, 16px)", cursor: "pointer", appearance: "none" }}
                          onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; }}
                          onBlur={e => { e.target.style.borderColor = "rgba(201,168,76,0.15)"; }}>
                          <option value="" disabled style={{ background: "var(--black-2)" }}>{f.placeholder}</option>
                          {f.options.map(o => <option key={o} value={o} style={{ background: "var(--black-2)" }}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
                    <label htmlFor="_hp">Leave this empty</label>
                    <input id="_hp" name="_hp" type="text" value={form._hp} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Syne',sans-serif", fontSize: "clamp(9px, 0.6vw, 16px)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: "1vh" }}>Tell us about your project *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                      placeholder="What are you building? What's the goal? Any challenges?"
                      style={{ ...inputBase, padding: "clamp(14px, 2.5vh, 20px) clamp(12px, 1.5vw, 16px)", resize: "vertical", minHeight: "15vh" }}
                      onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.5)"; e.target.style.background = "rgba(201,168,76,0.03)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(201,168,76,0.15)"; e.target.style.background = "rgba(255,255,255,0.03)"; }} />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    onClick={createRipple}
                    data-cursor="magnetic"
                    className={`order-btn ${btnAnim ? 'animate' : ''}`}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.8vw",
                      background: sending ? "rgba(201,168,76,0.5)" : "var(--gold)",
                      color: "var(--black)", fontFamily: "'Syne',sans-serif", fontWeight: 700,
                      fontSize: "clamp(11px, 0.7vw, 18px)", letterSpacing: "0.15em",
                      textTransform: "uppercase", padding: "2.5vh 3vw",
                      borderRadius: "8px", border: "none", cursor: "pointer",
                      position: "relative", overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s, background 0.3s", marginTop: "1vh",
                    }}
                    aria-disabled={sending}
                    onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 50px -10px rgba(201,168,76,0.4)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <span className="default">
                      {sending ? (<><Loader2 size={15} className="animate-spin" /> Sending...</>) : (<>Send Project Brief</>)}
                    </span>
                    <span className="success">Brief Delivered<svg viewBox="0 0 12 10"><polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span>
                    <div className="box" />
                    <div className="truck">
                      <svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="15" width="120" height="55" rx="6" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <line x1="16" y1="22" x2="124" y2="22" stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                        <rect x="12" y="25" width="116" height="35" rx="3" fill="rgba(201,168,76,0.03)" />
                        <g>
                          <line x1="65" y1="25" x2="65" y2="60" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                          <rect x="16" y="25" width="48" height="35" rx="2" fill="rgba(201,168,76,0.02)" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
                          <rect x="66" y="25" width="48" height="35" rx="2" fill="rgba(201,168,76,0.02)" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
                        </g>
                        <circle cx="130" cy="42" r="4" fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
                        <path d="M130 20 L130 70 L165 70 L180 50 L180 20 Z" fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <path d="M135 24 L135 40 L162 40 L172 28 L172 24 Z" fill="rgba(201,168,76,0.05)" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
                        <circle cx="40" cy="72" r="10" fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="40" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="100" cy="72" r="10" fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="100" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="155" cy="72" r="10" fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="155" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="178" cy="38" r="3" fill="rgba(201,168,76,0.3)" />
                      </svg>
                    </div>
                    <div className="lines" />
                  </button>

                  <p style={{ textAlign: "center", fontSize: "clamp(11px, 0.7vw, 18px)", color: "rgba(245,240,232,0.25)", marginTop: "1vh" }}>
                    No spam. No pressure. Just a conversation.
                  </p>
                </form>

                {/* Animation Stage */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  zIndex: 10, pointerEvents: "none", overflow: "hidden", borderRadius: "8px",
                }}>
                  <div ref={progressRef} style={{
                    position: "absolute", top: 0, left: 0, height: "3px", width: "0%",
                    background: "linear-gradient(90deg, #c9a84c, #e8c56a)",
                    borderRadius: "4px 4px 0 0", zIndex: 20,
                    opacity: animState !== "idle" ? 1 : 0, transition: "opacity 0.3s",
                  }} />

                  <div ref={packageRef} className="contact-package" style={{
                    position: "absolute", zIndex: 15,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "clamp(18px, 3vw, 24px)", height: "clamp(18px, 3vw, 24px)" }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                    <span style={{ fontSize: "clamp(6px, 0.8vw, 7px)", color: "rgba(201,168,76,0.7)", fontFamily: "'Syne',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Brief</span>
                  </div>

                  <div ref={truckRef} style={{
                    position: "absolute", bottom: "clamp(25%, 5vh, 35%)", zIndex: 15,
                  }}>
                    <div className="contact-truck">
                      <svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "clamp(140px, 30vw, 200px)", height: "auto" }}>
                        <rect x="10" y="15" width="120" height="55" rx="6"
                          fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <line x1="16" y1="22" x2="124" y2="22"
                          stroke="rgba(201,168,76,0.15)" strokeWidth="1" />
                        <rect x="12" y="25" width="116" height="35" rx="3"
                          fill="rgba(201,168,76,0.03)" />
                        <g ref={doorsRef}>
                          <line x1="65" y1="25" x2="65" y2="60"
                            stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
                          <rect x="16" y="25" width="48" height="35" rx="2"
                            fill="rgba(201,168,76,0.02)" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
                          <rect x="66" y="25" width="48" height="35" rx="2"
                            fill="rgba(201,168,76,0.02)" stroke="rgba(201,168,76,0.1)" strokeWidth="0.5" />
                        </g>
                        <circle cx="130" cy="42" r="4"
                          fill="rgba(201,168,76,0.15)" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
                        <path d="M130 20 L130 70 L165 70 L180 50 L180 20 Z"
                          fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <path d="M135 24 L135 40 L162 40 L172 28 L172 24 Z"
                          fill="rgba(201,168,76,0.05)" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
                        <circle cx="40" cy="72" r="10"
                          fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="40" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="100" cy="72" r="10"
                          fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="100" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="155" cy="72" r="10"
                          fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" />
                        <circle cx="155" cy="72" r="4" fill="rgba(201,168,76,0.2)" />
                        <circle cx="178" cy="38" r="3" fill="rgba(201,168,76,0.3)" />
                      </svg>
                    </div>
                  </div>

                  <div ref={securityRef} className="contact-security-glow" style={{
                    position: "absolute", zIndex: 14, borderRadius: "12px",
                    border: "2px solid rgba(76,201,126,0.5)",
                    boxShadow: "0 0 30px rgba(76,201,126,0.2), inset 0 0 20px rgba(76,201,126,0.05)",
                    width: "clamp(120px, 20vw, 160px)", height: "clamp(50px, 10vh, 70px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckCircle size={20} color="#4cc97e" />
                  </div>

                  <div ref={smokeRef} style={{
                    position: "absolute", zIndex: 5, display: "flex", gap: "6px",
                  }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="contact-smoke-particle" style={{
                        width: `${10 + i * 6}px`, height: `${10 + i * 6}px`,
                        animationDelay: `${i * 0.15}s`,
                      }} />
                    ))}
                  </div>

                  <div ref={successRef} style={{
                    position: "relative", zIndex: 20, textAlign: "center",
                    padding: "clamp(4vh, 6vh, 8vh) clamp(3vw, 4vw, 5vw)",
                    border: "1px solid rgba(76,201,126,0.2)", borderRadius: "12px",
                    background: "rgba(76,201,126,0.03)",
                    maxWidth: "400px", width: "90%",
                  }}>
                    <div className="contact-success-pulse" style={{
                      width: "clamp(44px, 6vw, 56px)", height: "clamp(44px, 6vw, 56px)",
                      borderRadius: "50%", background: "rgba(76,201,126,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 2.5vh",
                    }}>
                      <CheckCircle size={28} color="#4cc97e" />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant',serif", fontSize: "clamp(22px, 2.5vw, 34px)", fontWeight: 400, marginBottom: "1.5vh", color: "var(--cream)" }}>
                      Brief Delivered.
                    </h3>
                    <p style={{ fontSize: "clamp(12px, 0.8vw, 15px)", color: "var(--cream-dim)", lineHeight: 1.7 }}>
                      Your project request is secure. Our team will review it within 24 hours and reach out.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
