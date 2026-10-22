import React, { useRef, useEffect, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  BUTTON_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "pill" | "switch";
  shape?: "pill" | "circle";
  size?: "xl";
  className?: string;
  // Glass optics
  refraction?: number;     // 0..100, default 4
  thickness?: number;      // 0..100, default 8
  bevelWidth?: number;     // 0..30, default 2
  frost?: number;          // 0..100, default 2
  dispersion?: number;     // 0..100, default 88
  sheen?: number;          // 0..100, default 12
  lightAngle?: number;     // -180..180 deg, default 24
  darkness?: number;       // 0..100, default 0
  rim?: number;            // 0..100, default 16
  // Fluid / Caustic dynamics
  fluidBrightness?: number; // 0..300, default 36
  fluidSpeed?: number;      // 0..300, default 80
  fluidScale?: number;      // 0..100, default 24
  fluidAuraWidth?: number;  // 0..96, default 8
  fluidCenter?: number;     // 0..100, default 32
  auroraFlow?: number;      // 0..100, default 100
  causticBrightness?: number;
  causticSpeed?: number;
  causticScale?: number;
  fluidDispersion?: number; // legacy alias for dispersion
  // Interactivity dynamics
  hoverBrightness?: number;       // 0..300, default 264
  trackCursorLight?: boolean;     // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;       // default: true
  shockwaveStrength?: number;     // 0..100, default 100
}

export const TactileGlassButton: React.FC<TactileGlassButtonProps> = ({
  children,
  size = "xl",
  shape = "pill",
  className = "",
  refraction = BUTTON_DEFAULT_PARAMS.refraction,
  thickness = BUTTON_DEFAULT_PARAMS.thickness,
  bevelWidth = BUTTON_DEFAULT_PARAMS.bevelWidth,
  frost = BUTTON_DEFAULT_PARAMS.frost,
  dispersion = BUTTON_DEFAULT_PARAMS.dispersion,
  sheen = BUTTON_DEFAULT_PARAMS.sheen,
  lightAngle = BUTTON_DEFAULT_PARAMS.lightAngle,
  darkness = BUTTON_DEFAULT_PARAMS.darkness,
  rim = BUTTON_DEFAULT_PARAMS.rim,
  fluidBrightness = BUTTON_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = BUTTON_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = BUTTON_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = BUTTON_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = BUTTON_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = BUTTON_DEFAULT_PARAMS.auroraFlow,
  causticBrightness,
  causticSpeed,
  causticScale,
  fluidDispersion,
  hoverBrightness = BUTTON_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = BUTTON_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = BUTTON_DEFAULT_PARAMS.clickWave,
  onClick,
  ...props
}) => {
  const instanceId = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeDispersion = fluidDispersion !== undefined ? fluidDispersion : dispersion;

  const paramsRef = useRef<TactileGlassParams>({
    radius: 20,
    refraction,
    thickness,
    bevelWidth,
    frost,
    dispersion: activeDispersion,
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
      dispersion: activeDispersion,
      sheen,
      lightAngle,
      darkness,
      rim,
      fluidBright: causticBrightness ?? fluidBrightness,
      fluidSpeed: causticSpeed ?? fluidSpeed,
      fluidScale: causticScale ?? fluidScale,
      fluidAuraWidth,
      fluidCenter,
      auroraFlow,
      causticBright: causticBrightness ?? fluidBrightness,
      causticSpeed: causticSpeed ?? fluidSpeed,
      causticScale: causticScale ?? fluidScale,
      hoverBright: hoverBrightness,
      lightTrack: trackCursorLight ? lightTrackingStrength : 0,
      clickWave: clickShockwave ? shockwaveStrength : 0,
    };
  }, [
    refraction,
    thickness,
    bevelWidth,
    frost,
    activeDispersion,
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
    causticBrightness,
    causticSpeed,
    causticScale,
    hoverBrightness,
    trackCursorLight,
    lightTrackingStrength,
    clickShockwave,
    shockwaveStrength,
  ]);

  useEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const engine = getSharedCausticEngine();

    const instance: TactileGlassInstance = {
      id: instanceId,
      canvas,
      ctx,
      getParams: () => {
        const h = canvas.height;
        paramsRef.current.radius = h * 0.5;
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
      const w = Math.round(btn.offsetWidth * dpr);
      const h = Math.round(btn.offsetHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(btn);

    const handlePointerCoord = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;
    };

    const handlePointerEnter = (e: PointerEvent) => {
      instance.targetHover = 1.0;
      handlePointerCoord(e);
    };

    const handlePointerMove = (e: PointerEvent) => {
      instance.targetHover = 1.0;
      handlePointerCoord(e);
    };

    const handlePointerLeave = () => {
      instance.targetHover = 0.0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      handlePointerCoord(e);
      instance.clickPos = [instance.targetMouseX, instance.targetMouseY];
      instance.clickTime = engine.getTime();
    };

    btn.addEventListener("pointerenter", handlePointerEnter);
    btn.addEventListener("pointermove", handlePointerMove);
    btn.addEventListener("pointerleave", handlePointerLeave);
    btn.addEventListener("pointerdown", handlePointerDown);

    engine.register(instance);

    return () => {
      engine.unregister(instanceId);
      resizeObserver.disconnect();
      btn.removeEventListener("pointerenter", handlePointerEnter);
      btn.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
      btn.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [instanceId]);

  const isCircle = shape === "circle";

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className={`tactile-btn ${isCircle ? "btn-circle" : ""} ${className}`.trim()}
      {...props}
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
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />
      <span
        className="btn-label"
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: isCircle ? 0 : "var(--space-12)",
        }}
      >
        {children}
      </span>
    </button>
  );
};

export const TactileButton = TactileGlassButton;
export const FluidCausticButton = TactileGlassButton;
export default TactileGlassButton;
