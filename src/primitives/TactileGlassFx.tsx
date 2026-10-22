import React, { useRef, useEffect, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  BUTTON_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

/**
 * Achromatic Tactile Glass FX Smart Wrapper
 * Zero Runtime Dependencies: Pure React, TypeScript, WebGL2 and Canvas 2D.
 * Utilizes a shared singleton WebGL2 engine with lightweight Canvas 2D blitting.
 */

export interface TactileGlassFxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  // Glass optics overrides
  refraction?: number;
  thickness?: number;
  bevelWidth?: number;
  frost?: number;
  dispersion?: number;
  sheen?: number;
  lightAngle?: number;
  darkness?: number;
  rim?: number;
  // Fluid / Caustic dynamics overrides
  fluidBrightness?: number;
  fluidSpeed?: number;
  fluidScale?: number;
  fluidAuraWidth?: number;
  fluidCenter?: number;
  auroraFlow?: number;
  causticBrightness?: number;
  causticSpeed?: number;
  causticScale?: number;
  hoverBrightness?: number;
  trackCursorLight?: boolean;
  lightTrackingStrength?: number;
  clickShockwave?: boolean;
  shockwaveStrength?: number;
  overlayZIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * TactileGlassFx: Smart Wrapper Component
 * Wraps any native element (button, switch, card, pill, container) with liquid caustic glass optics.
 * Renders via a lightweight 2D canvas backed by the shared singleton WebGL2 engine.
 */
export const TactileGlassFx: React.FC<TactileGlassFxProps> = ({
  children,
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
  causticBrightness,
  causticSpeed,
  causticScale,
  hoverBrightness,
  trackCursorLight = true,
  lightTrackingStrength,
  clickShockwave = true,
  shockwaveStrength,
  overlayZIndex = 2,
  className = "",
  style,
  ...props
}) => {
  const instanceId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseDefaults = BUTTON_DEFAULT_PARAMS;

  const paramsRef = useRef<TactileGlassParams>({
    radius: 20,
    refraction: refraction ?? baseDefaults.refraction,
    thickness: thickness ?? baseDefaults.thickness,
    bevelWidth: bevelWidth ?? baseDefaults.bevelWidth,
    frost: frost ?? baseDefaults.frost,
    dispersion: dispersion ?? baseDefaults.dispersion,
    sheen: sheen ?? baseDefaults.sheen,
    lightAngle: lightAngle ?? baseDefaults.lightAngle,
    darkness: darkness ?? baseDefaults.darkness,
    rim: rim ?? baseDefaults.rim,
    fluidBright: fluidBrightness ?? baseDefaults.fluidBright,
    fluidSpeed: fluidSpeed ?? baseDefaults.fluidSpeed,
    fluidScale: fluidScale ?? baseDefaults.fluidScale,
    fluidAuraWidth: fluidAuraWidth ?? baseDefaults.fluidAuraWidth,
    fluidCenter: fluidCenter ?? baseDefaults.fluidCenter,
    auroraFlow: auroraFlow ?? baseDefaults.auroraFlow,
    hoverBright: hoverBrightness ?? baseDefaults.hoverBright,
    lightTrack: trackCursorLight ? (lightTrackingStrength ?? baseDefaults.lightTrack) : 0,
    clickWave: clickShockwave ? (shockwaveStrength ?? baseDefaults.clickWave) : 0,
  });

  useEffect(() => {
    paramsRef.current = {
      ...paramsRef.current,
      refraction: refraction ?? baseDefaults.refraction,
      thickness: thickness ?? baseDefaults.thickness,
      bevelWidth: bevelWidth ?? baseDefaults.bevelWidth,
      frost: frost ?? baseDefaults.frost,
      dispersion: dispersion ?? baseDefaults.dispersion,
      sheen: sheen ?? baseDefaults.sheen,
      lightAngle: lightAngle ?? baseDefaults.lightAngle,
      darkness: darkness ?? baseDefaults.darkness,
      rim: rim ?? baseDefaults.rim,
      fluidBright: causticBrightness ?? fluidBrightness ?? baseDefaults.fluidBright,
      fluidSpeed: causticSpeed ?? fluidSpeed ?? baseDefaults.fluidSpeed,
      fluidScale: causticScale ?? fluidScale ?? baseDefaults.fluidScale,
      fluidAuraWidth: fluidAuraWidth ?? baseDefaults.fluidAuraWidth,
      fluidCenter: fluidCenter ?? baseDefaults.fluidCenter,
      auroraFlow: auroraFlow ?? baseDefaults.auroraFlow,
      causticBright: causticBrightness ?? fluidBrightness ?? baseDefaults.fluidBright,
      causticSpeed: causticSpeed ?? fluidSpeed ?? baseDefaults.fluidSpeed,
      causticScale: causticScale ?? fluidScale ?? baseDefaults.fluidScale,
      hoverBright: hoverBrightness ?? baseDefaults.hoverBright,
      lightTrack: trackCursorLight ? (lightTrackingStrength ?? baseDefaults.lightTrack) : 0,
      clickWave: clickShockwave ? (shockwaveStrength ?? baseDefaults.clickWave) : 0,
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
      getParams: () => {
        if (!root) return paramsRef.current;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const comp = window.getComputedStyle(root);
        const br = parseFloat(comp.borderRadius);
        const maxRad = Math.min(root.offsetWidth, root.offsetHeight) * 0.5 * dpr;
        const brVal = (!isNaN(br) && br >= 0) ? br * dpr : maxRad;
        paramsRef.current.radius = Math.min(brVal, maxRad);
        return paramsRef.current;
      },
      getSwitchThumb: () => {
        if (!root) return null;
        const thumb = root.querySelector(
          ".switch-thumb, [data-switch-thumb], .tabs-indicator, [data-tabs-indicator]"
        ) as HTMLElement | null;
        if (!thumb) return null;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const br = root.getBoundingClientRect();
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

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(root.offsetWidth * dpr);
      const h = Math.round(root.offsetHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
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
  }, [instanceId]);

  return (
    <div
      ref={rootRef}
      className={`tactile-glass-fx ${className}`.trim()}
      style={{
        position: "relative",
        display: "inline-flex",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
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
          zIndex: overlayZIndex,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: overlayZIndex + 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TactileGlassFx;
