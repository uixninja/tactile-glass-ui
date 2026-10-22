import React, { useRef, useEffect, useState, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  HEADING_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileGlassWordProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** Optional array of words to cycle through on click */
  cycleWords?: string[];
  className?: string;
  style?: React.CSSProperties;
  // Glass optics
  refraction?: number;          // 0..100, default 80
  thickness?: number;           // 0..100, default 48
  bevelWidth?: number;          // 0..30, default 2
  frost?: number;               // 0..100, default 40
  dispersion?: number;          // 0..100, default 80
  sheen?: number;               // 0..100, default 24
  lightAngle?: number;          // -180..180 deg, default 24
  darkness?: number;            // 0..100, default 0
  rim?: number;                 // 0..100, default 16
  // Fluid optics
  fluidBrightness?: number;     // 0..300, default 80
  fluidSpeed?: number;          // 0..300, default 80
  fluidScale?: number;          // 0..100, default 8
  fluidAuraWidth?: number;      // 0..96, default 2
  fluidCenter?: number;         // 0..100, default 8
  auroraFlow?: number;          // 0..100, default 0
  // Interactivity dynamics
  hoverBrightness?: number;     // 0..300, default 96
  trackCursorLight?: boolean;   // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;     // default: true
  shockwaveStrength?: number;   // 0..100, default 96
}

/**
 * TactileGlassWord
 * Fluid Glass Typography Component.
 * The letter glyphs themselves are filled with real-time WebGL2 fluid caustics,
 * polar aurora flow, chromatic dispersion and interactive ripple wave dynamics.
 * Zero background plate/capsule — pure typographic liquid glass.
 */
export const TactileGlassWord: React.FC<TactileGlassWordProps> = ({
  children,
  cycleWords,
  className = "",
  style,
  onClick,
  refraction = HEADING_DEFAULT_PARAMS.refraction,
  thickness = HEADING_DEFAULT_PARAMS.thickness,
  bevelWidth = HEADING_DEFAULT_PARAMS.bevelWidth,
  frost = HEADING_DEFAULT_PARAMS.frost,
  dispersion = HEADING_DEFAULT_PARAMS.dispersion,
  sheen = HEADING_DEFAULT_PARAMS.sheen,
  lightAngle = HEADING_DEFAULT_PARAMS.lightAngle,
  darkness = HEADING_DEFAULT_PARAMS.darkness,
  rim = HEADING_DEFAULT_PARAMS.rim,
  fluidBrightness = HEADING_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = HEADING_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = HEADING_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = HEADING_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = HEADING_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = HEADING_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = HEADING_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = HEADING_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = HEADING_DEFAULT_PARAMS.clickWave,
  ...props
}) => {
  const instanceId = useId();
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [cycleIndex, setCycleIndex] = useState(0);

  const displayedContent = cycleWords && cycleWords.length > 0
    ? cycleWords[cycleIndex % cycleWords.length]
    : children;

  const displayedText = typeof displayedContent === "string"
    ? displayedContent
    : String(displayedContent ?? "");

  const paramsRef = useRef<TactileGlassParams>({
    radius: 0,
    refraction,
    thickness,
    bevelWidth,
    frost,
    dispersion,
    sheen,
    lightAngle,
    darkness,
    rim,
    fluidBright: fluidBrightness,
    fluidSpeed,
    fluidScale,
    fluidAuraWidth,
    fluidCenter,
    auroraFlow,
    hoverBright: hoverBrightness,
    lightTrack: trackCursorLight ? lightTrackingStrength : 0,
    clickWave: clickShockwave ? shockwaveStrength : 0,
  });

  const instanceRef = useRef<TactileGlassInstance | null>(null);

  useEffect(() => {
    paramsRef.current = {
      ...paramsRef.current,
      refraction,
      thickness,
      bevelWidth,
      frost,
      dispersion,
      sheen,
      lightAngle,
      darkness,
      rim,
      fluidBright: fluidBrightness,
      fluidSpeed,
      fluidScale,
      fluidAuraWidth,
      fluidCenter,
      auroraFlow,
      hoverBright: hoverBrightness,
      lightTrack: trackCursorLight ? lightTrackingStrength : 0,
      clickWave: clickShockwave ? shockwaveStrength : 0,
    };
  }, [
    refraction,
    thickness,
    bevelWidth,
    frost,
    dispersion,
    sheen,
    lightAngle,
    darkness,
    rim,
    fluidBrightness,
    fluidSpeed,
    fluidScale,
    fluidAuraWidth,
    fluidCenter,
    auroraFlow,
    hoverBrightness,
    trackCursorLight,
    lightTrackingStrength,
    clickShockwave,
    shockwaveStrength,
  ]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const engine = getSharedCausticEngine();

    const instance: TactileGlassInstance = {
      id: instanceId,
      canvas,
      ctx,
      textMask: displayedText,
      getParams: () => paramsRef.current,
      curHover: 0,
      targetHover: 0,
      curMouseX: 0,
      curMouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      clickPos: [-999, -999],
      clickTime: -999,
      visible: true,
    };

    instanceRef.current = instance;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pad = 16;
      const w = Math.round((root.offsetWidth + pad * 2) * dpr);
      const h = Math.round((root.offsetHeight + pad * 2) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const comp = window.getComputedStyle(root);
      const fs = parseFloat(comp.fontSize) * dpr;
      instance.textFont = `${comp.fontWeight} ${fs}px ${comp.fontFamily}`;
      instance.textLetterSpacing = comp.letterSpacing || "normal";
      instance.textMask = displayedText;
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(root);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        instance.visible = entry.isIntersecting;
      });
      intersectionObserver.observe(root);
    }

    const handlePointerCoord = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;
    };

    const onPointerEnter = (e: PointerEvent) => {
      instance.targetHover = 1.0;
      handlePointerCoord(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      instance.targetHover = 1.0;
      handlePointerCoord(e);
    };

    const onPointerLeave = () => {
      instance.targetHover = 0.0;
    };

    const onPointerDown = (e: PointerEvent) => {
      handlePointerCoord(e);
      instance.clickPos = [instance.targetMouseX, instance.targetMouseY];
      instance.clickTime = engine.getTime();
    };

    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("pointerdown", onPointerDown);

    engine.register(instance);

    return () => {
      engine.unregister(instanceId);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
    };
  }, [instanceId, displayedText]);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (cycleWords && cycleWords.length > 1) {
      setCycleIndex((prev) => prev + 1);
    }
    if (onClick) onClick(e);
  };

  const isClickable = Boolean(cycleWords && cycleWords.length > 1) || Boolean(onClick);

  return (
    <span
      ref={rootRef}
      className={`tactile-glass-word ${className}`.trim()}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "baseline",
        justifyContent: "center",
        verticalAlign: "baseline",
        margin: 0,
        padding: 0,
        lineHeight: "inherit",
        border: "none",
        background: "transparent",
        userSelect: "none",
        cursor: isClickable ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      onClick={handleClick}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "calc(var(--space-16) * -1)",
          width: "calc(100% + var(--space-32))",
          height: "calc(100% + var(--space-32))",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <span
        style={{
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none",
          fontWeight: "inherit",
          letterSpacing: "inherit",
        }}
      >
        {displayedContent}
      </span>
    </span>
  );
};

export default TactileGlassWord;
