import React, { useRef, useEffect, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  BACKGROUND_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  radius?: number; // Corner radius in px, default 16
  className?: string;
  style?: React.CSSProperties;
  // Glass optics
  refraction?: number;          // 0..100, default 80
  thickness?: number;           // 0..100, default 88
  bevelWidth?: number;          // 0..30, default 0
  frost?: number;               // 0..100, default 0
  dispersion?: number;          // 0..100, default 96
  sheen?: number;               // 0..100, default 0
  lightAngle?: number;          // -180..180 deg, default 0
  darkness?: number;            // 0..100, default 0
  rim?: number;                 // 0..100, default 0
  // Fluid optics
  fluidBrightness?: number;     // 0..300, default 12
  fluidSpeed?: number;          // 0..300, default 40
  fluidScale?: number;          // 0..100, default 48
  fluidAuraWidth?: number;      // 0..96, default 64
  fluidCenter?: number;         // 0..100, default 12
  auroraFlow?: number;          // 0..100, default 100
  // Interactivity dynamics
  hoverBrightness?: number;     // 0..300, default 128
  trackCursorLight?: boolean;   // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;     // default: true
  shockwaveStrength?: number;   // 0..100, default 56
}

/**
 * TactileBackground
 * Full-section / Hero Optical Glass Panel Component.
 * Designed to sit beneath hero sections, feature blocks, or full-bleed containers
 * with physical Snell refraction, perimeter bevel dispersion, liquid caustic aura,
 * and interactive pointer ripples.
 */
export const TactileBackground: React.FC<TactileBackgroundProps> = ({
  children,
  radius,
  className = "",
  style,
  refraction = BACKGROUND_DEFAULT_PARAMS.refraction,
  thickness = BACKGROUND_DEFAULT_PARAMS.thickness,
  bevelWidth = BACKGROUND_DEFAULT_PARAMS.bevelWidth,
  frost = BACKGROUND_DEFAULT_PARAMS.frost,
  dispersion = BACKGROUND_DEFAULT_PARAMS.dispersion,
  sheen = BACKGROUND_DEFAULT_PARAMS.sheen,
  lightAngle = BACKGROUND_DEFAULT_PARAMS.lightAngle,
  darkness = BACKGROUND_DEFAULT_PARAMS.darkness,
  rim = BACKGROUND_DEFAULT_PARAMS.rim,
  fluidBrightness = BACKGROUND_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = BACKGROUND_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = BACKGROUND_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = BACKGROUND_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = BACKGROUND_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = BACKGROUND_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = BACKGROUND_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = BACKGROUND_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = BACKGROUND_DEFAULT_PARAMS.clickWave,
  ...restProps
}) => {
  const instanceId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const paramsRef = useRef<TactileGlassParams>({
    radius: radius ?? 16,
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
    const rootEl = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!rootEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d", { alpha: true });
    if (!ctx) return;

    const engine = getSharedCausticEngine();

    const instance: TactileGlassInstance = {
      id: instanceId,
      canvas: canvasEl,
      ctx,
      getParams: () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxRad = Math.min(canvasEl.width, canvasEl.height) * 0.5;
        const parsedBr = parseFloat(window.getComputedStyle(rootEl).borderRadius);
        const cssRad =
          radius !== undefined
            ? radius
            : Number.isFinite(parsedBr)
            ? parsedBr
            : 16;
        paramsRef.current.radius = Math.min(cssRad * dpr, maxRad);
        return paramsRef.current;
      },
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

    const updateDimensions = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rootEl.offsetWidth * dpr);
      const h = Math.round(rootEl.offsetHeight * dpr);
      if (canvasEl.width !== w || canvasEl.height !== h) {
        canvasEl.width = w;
        canvasEl.height = h;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(rootEl);

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        instance.visible = entry.isIntersecting;
      });
      intersectionObserver.observe(rootEl);
    }

    const handlePointerCoord = (e: { clientX: number; clientY: number }) => {
      const r = rootEl.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;
    };

    const isFromNestedGlassChild = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element) || target === rootEl) return false;
      const nested = target.closest(
        "button, a, [role='button'], [role='switch'], [role='tab'], .tactile-card, .tactile-prompt-box, .tactile-audio-player"
      );
      return Boolean(nested && rootEl.contains(nested));
    };

    const handlePointerEnter = (e: PointerEvent) => {
      handlePointerCoord(e);
      if (isFromNestedGlassChild(e.target)) {
        instance.targetHover = 0.0;
        return;
      }
      instance.targetHover = 1.0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      handlePointerCoord(e);
      if (isFromNestedGlassChild(e.target)) {
        instance.targetHover = 0.0;
        return;
      }
      instance.targetHover = 1.0;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      instance.targetHover = 0.0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isFromNestedGlassChild(e.target)) return;
      handlePointerCoord(e);
      instance.targetHover = 1.0;
      instance.clickPos = [instance.targetMouseX, instance.targetMouseY];
      instance.clickTime = engine.getTime();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      handlePointerCoord(t);
      if (isFromNestedGlassChild(e.target)) {
        instance.targetHover = 0.0;
        return;
      }
      instance.targetHover = 1.0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      handlePointerCoord(t);
      const hitEl = document.elementFromPoint(t.clientX, t.clientY);
      if (!hitEl || !rootEl.contains(hitEl) || isFromNestedGlassChild(hitEl)) {
        instance.targetHover = 0.0;
        return;
      }
      instance.targetHover = 1.0;
    };

    const handleTouchEnd = () => {
      instance.targetHover = 0.0;
    };

    rootEl.addEventListener("pointerenter", handlePointerEnter);
    rootEl.addEventListener("pointermove", handlePointerMove);
    rootEl.addEventListener("pointerleave", handlePointerLeave);
    rootEl.addEventListener("pointercancel", handlePointerLeave);
    rootEl.addEventListener("pointerdown", handlePointerDown);
    rootEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    rootEl.addEventListener("touchmove", handleTouchMove, { passive: true });
    rootEl.addEventListener("touchend", handleTouchEnd, { passive: true });
    rootEl.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    engine.register(instance);

    return () => {
      engine.unregister(instanceId);
      resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      rootEl.removeEventListener("pointerenter", handlePointerEnter);
      rootEl.removeEventListener("pointermove", handlePointerMove);
      rootEl.removeEventListener("pointerleave", handlePointerLeave);
      rootEl.removeEventListener("pointercancel", handlePointerLeave);
      rootEl.removeEventListener("pointerdown", handlePointerDown);
      rootEl.removeEventListener("touchstart", handleTouchStart);
      rootEl.removeEventListener("touchmove", handleTouchMove);
      rootEl.removeEventListener("touchend", handleTouchEnd);
      rootEl.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [instanceId, radius]);

  return (
    <div
      ref={rootRef}
      className={`tactile-background ${className}`.trim()}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "var(--bg-panel-min-h)",
        padding: "var(--bg-panel-pad)",
        borderRadius: radius !== undefined ? `${radius}px` : "var(--bg-panel-radius)",
        border: "none",
        background: "transparent",
        outline: "none",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...restProps}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "inherit",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TactileHeroBackground = TactileBackground;
export default TactileBackground;
