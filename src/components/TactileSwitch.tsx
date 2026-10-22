import React, { useRef, useEffect, useState, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  SWITCH_ON_DEFAULT_PARAMS,
  SWITCH_OFF_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "xl";
  className?: string;
  disabled?: boolean;
  // Glass optics (State-aware: ON / OFF)
  refraction?: number;        // 0..100, default 2 (ON) / 72 (OFF)
  refractionOff?: number;     // 0..100, default 72 (OFF)
  thickness?: number;         // 0..100, default 8 (ON) / 16 (OFF)
  thicknessOff?: number;      // 0..100, default 16 (OFF)
  bevelWidth?: number;        // 0..30, default 2 (ON) / 4 (OFF)
  bevelWidthOff?: number;     // 0..30, default 4 (OFF)
  frost?: number;             // 0..100, default 16 (ON) / 80 (OFF)
  frostOff?: number;          // 0..100, default 80 (OFF)
  dispersion?: number;        // 0..100, default 80 (ON) / 0 (OFF)
  dispersionOff?: number;     // 0..100, default 0 (OFF)
  sheen?: number;             // 0..100, default 40 (ON) / 16 (OFF)
  sheenOff?: number;          // 0..100, default 16 (OFF)
  lightAngle?: number;        // -180..180 deg, default 24
  darkness?: number;          // 0..100, default 0 (ON) / 24 (OFF)
  darknessOff?: number;       // 0..100, default 24 (OFF)
  rim?: number;               // 0..100, default 48 (ON) / 40 (OFF)
  rimOff?: number;            // 0..100, default 40 (OFF)
  // Fluid optics
  fluidBrightness?: number;    // 0..300, default 48 (ON) / 32 (OFF)
  fluidBrightnessOff?: number; // 0..300, default 32 (OFF)
  fluidSpeed?: number;         // 0..300, default 80 (ON) / 0 (OFF)
  fluidSpeedOff?: number;      // 0..300, default 0 (OFF)
  fluidScale?: number;         // 0..100, default 16 (ON) / 4 (OFF)
  fluidScaleOff?: number;      // 0..100, default 4 (OFF)
  fluidAuraWidth?: number;     // 0..96, default 12 (ON) / 32 (OFF)
  fluidAuraWidthOff?: number;  // 0..96, default 32 (OFF)
  fluidCenter?: number;        // 0..100, default 0 (ON) / 96 (OFF)
  fluidCenterOff?: number;     // 0..100, default 96 (OFF)
  auroraFlow?: number;         // 0..100, default 0 (ON) / 0 (OFF)
  auroraFlowOff?: number;      // 0..100, default 0 (OFF)
  // Interactivity dynamics
  hoverBrightness?: number;    // 0..300, default 256 (ON) / 144 (OFF)
  hoverBrightnessOff?: number; // 0..300, default 144 (OFF)
  trackCursorLight?: boolean;  // default: true
  lightTrackingStrength?: number;    // 0..100, default 100
  lightTrackingStrengthOff?: number; // 0..100, default 100
  clickShockwave?: boolean;    // default: true
  shockwaveStrength?: number;        // 0..100, default 96
  shockwaveStrengthOff?: number;     // 0..100, default 96
}

export const TactileSwitch: React.FC<TactileSwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  size = "xl",
  className = "",
  disabled = false,
  refraction = SWITCH_ON_DEFAULT_PARAMS.refraction,
  refractionOff = SWITCH_OFF_DEFAULT_PARAMS.refraction,
  thickness = SWITCH_ON_DEFAULT_PARAMS.thickness,
  thicknessOff = SWITCH_OFF_DEFAULT_PARAMS.thickness,
  bevelWidth = SWITCH_ON_DEFAULT_PARAMS.bevelWidth,
  bevelWidthOff = SWITCH_OFF_DEFAULT_PARAMS.bevelWidth,
  frost = SWITCH_ON_DEFAULT_PARAMS.frost,
  frostOff = SWITCH_OFF_DEFAULT_PARAMS.frost,
  dispersion = SWITCH_ON_DEFAULT_PARAMS.dispersion,
  dispersionOff = SWITCH_OFF_DEFAULT_PARAMS.dispersion,
  sheen = SWITCH_ON_DEFAULT_PARAMS.sheen,
  sheenOff = SWITCH_OFF_DEFAULT_PARAMS.sheen,
  lightAngle = SWITCH_ON_DEFAULT_PARAMS.lightAngle,
  darkness = SWITCH_ON_DEFAULT_PARAMS.darkness,
  darknessOff = SWITCH_OFF_DEFAULT_PARAMS.darkness,
  rim = SWITCH_ON_DEFAULT_PARAMS.rim,
  rimOff = SWITCH_OFF_DEFAULT_PARAMS.rim,
  fluidBrightness = SWITCH_ON_DEFAULT_PARAMS.fluidBright,
  fluidBrightnessOff = SWITCH_OFF_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = SWITCH_ON_DEFAULT_PARAMS.fluidSpeed,
  fluidSpeedOff = SWITCH_OFF_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = SWITCH_ON_DEFAULT_PARAMS.fluidScale,
  fluidScaleOff = SWITCH_OFF_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = SWITCH_ON_DEFAULT_PARAMS.fluidAuraWidth,
  fluidAuraWidthOff = SWITCH_OFF_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = SWITCH_ON_DEFAULT_PARAMS.fluidCenter,
  fluidCenterOff = SWITCH_OFF_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = SWITCH_ON_DEFAULT_PARAMS.auroraFlow,
  auroraFlowOff = SWITCH_OFF_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = SWITCH_ON_DEFAULT_PARAMS.hoverBright,
  hoverBrightnessOff = SWITCH_OFF_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = SWITCH_ON_DEFAULT_PARAMS.lightTrack,
  lightTrackingStrengthOff = SWITCH_OFF_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = SWITCH_ON_DEFAULT_PARAMS.clickWave,
  shockwaveStrengthOff = SWITCH_OFF_DEFAULT_PARAMS.clickWave,
  ...props
}) => {
  const instanceId = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement | null>(null);

  const paramsRef = useRef<TactileGlassParams>({
    radius: 16,
    refraction: isChecked ? refraction : refractionOff,
    thickness: isChecked ? thickness : thicknessOff,
    bevelWidth: isChecked ? bevelWidth : bevelWidthOff,
    frost: isChecked ? frost : frostOff,
    dispersion: isChecked ? dispersion : dispersionOff,
    sheen: isChecked ? sheen : sheenOff,
    lightAngle,
    darkness: isChecked ? darkness : darknessOff,
    rim: isChecked ? rim : rimOff,
    fluidBright: isChecked ? fluidBrightness : fluidBrightnessOff,
    fluidSpeed: isChecked ? fluidSpeed : fluidSpeedOff,
    fluidScale: isChecked ? fluidScale : fluidScaleOff,
    fluidAuraWidth: isChecked ? fluidAuraWidth : fluidAuraWidthOff,
    fluidCenter: isChecked ? fluidCenter : fluidCenterOff,
    auroraFlow: isChecked ? auroraFlow : auroraFlowOff,
    hoverBright: isChecked ? hoverBrightness : hoverBrightnessOff,
    lightTrack: trackCursorLight ? (isChecked ? lightTrackingStrength : lightTrackingStrengthOff) : 0,
    clickWave: clickShockwave ? (isChecked ? shockwaveStrength : shockwaveStrengthOff) : 0,
  });

  useEffect(() => {
    paramsRef.current = {
      ...paramsRef.current,
      refraction: isChecked ? refraction : refractionOff,
      thickness: isChecked ? thickness : thicknessOff,
      bevelWidth: isChecked ? bevelWidth : bevelWidthOff,
      frost: isChecked ? frost : frostOff,
      dispersion: isChecked ? dispersion : dispersionOff,
      sheen: isChecked ? sheen : sheenOff,
      lightAngle,
      darkness: isChecked ? darkness : darknessOff,
      rim: isChecked ? rim : rimOff,
      fluidBright: isChecked ? fluidBrightness : fluidBrightnessOff,
      fluidSpeed: isChecked ? fluidSpeed : fluidSpeedOff,
      fluidScale: isChecked ? fluidScale : fluidScaleOff,
      fluidAuraWidth: isChecked ? fluidAuraWidth : fluidAuraWidthOff,
      fluidCenter: isChecked ? fluidCenter : fluidCenterOff,
      auroraFlow: isChecked ? auroraFlow : auroraFlowOff,
      hoverBright: isChecked ? hoverBrightness : hoverBrightnessOff,
      lightTrack: trackCursorLight ? (isChecked ? lightTrackingStrength : lightTrackingStrengthOff) : 0,
      clickWave: clickShockwave ? (isChecked ? shockwaveStrength : shockwaveStrengthOff) : 0,
    };
  }, [
    isChecked,
    refraction,
    refractionOff,
    thickness,
    thicknessOff,
    bevelWidth,
    bevelWidthOff,
    frost,
    frostOff,
    dispersion,
    dispersionOff,
    sheen,
    sheenOff,
    lightAngle,
    darkness,
    darknessOff,
    rim,
    rimOff,
    fluidBrightness,
    fluidBrightnessOff,
    fluidSpeed,
    fluidSpeedOff,
    fluidScale,
    fluidScaleOff,
    fluidAuraWidth,
    fluidAuraWidthOff,
    fluidCenter,
    fluidCenterOff,
    auroraFlow,
    auroraFlowOff,
    hoverBrightness,
    hoverBrightnessOff,
    trackCursorLight,
    lightTrackingStrength,
    lightTrackingStrengthOff,
    clickShockwave,
    shockwaveStrength,
    shockwaveStrengthOff,
  ]);

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const btn = buttonRef.current;
    if (!canvas || !btn) return;

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
      getSwitchThumb: () => {
        const thumb = thumbRef.current;
        if (!thumb || !btn) return null;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const br = btn.getBoundingClientRect();
        const tr = thumb.getBoundingClientRect();
        if (tr.width <= 0 || tr.height <= 0) return null;
        const tx = ((tr.left + tr.width * 0.5) - (br.left + br.width * 0.5)) * dpr;
        const ty = ((br.top + br.height * 0.5) - (tr.top + tr.height * 0.5)) * dpr;
        const halfW = tr.width * 0.5 * dpr;
        const halfH = tr.height * 0.5 * dpr;
        return [tx, ty, halfW, halfH];
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

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`tactile-switch ${isChecked ? "active" : ""} ${className}`.trim()}
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
        ref={thumbRef}
        className="switch-thumb"
      />
    </button>
  );
};

export default TactileSwitch;
