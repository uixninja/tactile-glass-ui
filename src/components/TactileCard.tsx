import React, { useRef, useEffect, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  CARD_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileCreditCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children?: React.ReactNode;
  cardNumber?: string;
  cardHolder?: string;
  validThru?: string;
  bankName?: string;
  tier?: string;
  showContactless?: boolean;
  radius?: number; // Corner radius in px, default 24
  className?: string;
  style?: React.CSSProperties;
  // Glass optics
  refraction?: number;          // 0..100, default 88
  thickness?: number;           // 0..100, default 88
  bevelWidth?: number;          // 0..30, default 8
  frost?: number;               // 0..100, default 24
  dispersion?: number;          // 0..100, default 96
  sheen?: number;               // 0..100, default 24
  lightAngle?: number;          // -180..180 deg, default 24
  darkness?: number;            // 0..100, default 8
  rim?: number;                 // 0..100, default 24
  // Fluid optics
  fluidBrightness?: number;     // 0..300, default 32
  fluidSpeed?: number;          // 0..300, default 88
  fluidScale?: number;          // 0..100, default 56
  fluidAuraWidth?: number;      // 0..96, default 28
  fluidCenter?: number;         // 0..100, default 0
  auroraFlow?: number;          // 0..100, default 100
  // Interactivity dynamics
  hoverBrightness?: number;     // 0..300, default 200
  trackCursorLight?: boolean;   // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;     // default: true
  shockwaveStrength?: number;   // 0..100, default 96
  tilt3d?: boolean;             // 3D tilt perspective on pointer hover, default: true
  maxTilt?: number;             // Maximum 3D tilt angle in degrees, default: 12
}

export type TactileCardProps = TactileCreditCardProps;

/**
 * TactileCreditCard (TactileCard)
 * Liquid Glass Credit Card Component (ISO/IEC 7810 ID-1 standard ratio ~1.586).
 * Features real-time WebGL2 Snell refraction, chromatic dispersion,
 * procedural fluid caustics, etched EMV microchip, and interactive cursor light tracking.
 * Pure DOM interaction hull with zero decorative CSS borders/shadows.
 */
export const TactileCreditCard: React.FC<TactileCreditCardProps> = ({
  children,
  cardNumber = "••••  ••••  ••••  8042",
  cardHolder = "ALEXANDER WRIGHT",
  validThru = "08 / 29",
  bankName = "TACTILE",
  tier = "",
  showContactless = true,
  radius,
  className = "",
  style,
  refraction = CARD_DEFAULT_PARAMS.refraction,
  thickness = CARD_DEFAULT_PARAMS.thickness,
  bevelWidth = CARD_DEFAULT_PARAMS.bevelWidth,
  frost = CARD_DEFAULT_PARAMS.frost,
  dispersion = CARD_DEFAULT_PARAMS.dispersion,
  sheen = CARD_DEFAULT_PARAMS.sheen,
  lightAngle = CARD_DEFAULT_PARAMS.lightAngle,
  darkness = CARD_DEFAULT_PARAMS.darkness,
  rim = CARD_DEFAULT_PARAMS.rim,
  fluidBrightness = CARD_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = CARD_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = CARD_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = CARD_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = CARD_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = CARD_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = CARD_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = CARD_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = CARD_DEFAULT_PARAMS.clickWave,
  tilt3d = true,
  maxTilt = 12,
  onClick,
  ...restProps
}) => {
  const instanceId = useId();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const paramsRef = useRef<TactileGlassParams>({
    radius: radius ?? 24,
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
    const cardEl = cardRef.current;
    const canvasEl = canvasRef.current;
    if (!cardEl || !canvasEl) return;

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
        const cssRad = radius !== undefined ? radius : (parseFloat(window.getComputedStyle(cardEl).borderRadius) || 24);
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
      const w = Math.round(cardEl.offsetWidth * dpr);
      const h = Math.round(cardEl.offsetHeight * dpr);
      if (canvasEl.width !== w || canvasEl.height !== h) {
        canvasEl.width = w;
        canvasEl.height = h;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(cardEl);

    // 3D Tilt physics state
    let tiltRaf: number | null = null;
    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let targetScale = 1;
    let curScale = 1;
    let isHovered = false;

    const updateTilt = () => {
      if (!tilt3d) return;
      const ease = isHovered ? 0.12 : 0.08;
      curRotX += (targetRotX - curRotX) * ease;
      curRotY += (targetRotY - curRotY) * ease;
      curScale += (targetScale - curScale) * ease;

      instance.tilt = { rotX: curRotX, rotY: curRotY, scale: curScale, focalLength: 1000 };
      cardEl.style.transform = `perspective(var(--perspective-3d)) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(${curScale.toFixed(3)}, ${curScale.toFixed(3)}, ${curScale.toFixed(3)})`;

      const isStillMoving =
        Math.abs(targetRotX - curRotX) > 0.01 ||
        Math.abs(targetRotY - curRotY) > 0.01 ||
        Math.abs(targetScale - curScale) > 0.001;

      if (isHovered || isStillMoving) {
        tiltRaf = requestAnimationFrame(updateTilt);
      } else {
        tiltRaf = null;
        instance.tilt = null;
        cardEl.style.transform = "";
      }
    };

    const handlePointerCoord = (e: PointerEvent) => {
      const r = cardEl.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;

      if (tilt3d) {
        const normX = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.5)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.5)));
        targetRotX = -normY * (maxTilt * 0.92);
        targetRotY = normX * (maxTilt * 1.08);
        targetScale = 1.03;
      }
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isHovered = true;
      instance.targetHover = 1.0;
      handlePointerCoord(e);
      if (tilt3d && !tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
    };

    const handlePointerMove = (e: PointerEvent) => {
      isHovered = true;
      instance.targetHover = 1.0;
      handlePointerCoord(e);
      if (tilt3d && !tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
    };

    const handlePointerLeave = () => {
      isHovered = false;
      instance.targetHover = 0.0;
      if (tilt3d) {
        targetRotX = 0;
        targetRotY = 0;
        targetScale = 1.0;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      handlePointerCoord(e);
      instance.clickPos = [instance.targetMouseX, instance.targetMouseY];
      instance.clickTime = engine.getTime();
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        handlePointerLeave();
      }
    };

    cardEl.addEventListener("pointerenter", handlePointerEnter);
    cardEl.addEventListener("pointermove", handlePointerMove);
    cardEl.addEventListener("pointerleave", handlePointerLeave);
    cardEl.addEventListener("pointercancel", handlePointerLeave);
    cardEl.addEventListener("pointerup", handlePointerUp);
    cardEl.addEventListener("pointerdown", handlePointerDown);

    engine.register(instance);

    return () => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      engine.unregister(instanceId);
      resizeObserver.disconnect();
      cardEl.removeEventListener("pointerenter", handlePointerEnter);
      cardEl.removeEventListener("pointermove", handlePointerMove);
      cardEl.removeEventListener("pointerleave", handlePointerLeave);
      cardEl.removeEventListener("pointercancel", handlePointerLeave);
      cardEl.removeEventListener("pointerup", handlePointerUp);
      cardEl.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [instanceId, radius, tilt3d, maxTilt]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`tactile-card tactile-credit-card ${className}`}
      style={{
        borderRadius: radius !== undefined ? `${radius}px` : "var(--card-radius)",
        transformStyle: "preserve-3d",
        willChange: "transform",
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
        className="credit-card-inner"
        style={{
          transform: "translateZ(var(--space-20))",
          transformStyle: "preserve-3d",
        }}
      >
        {children ? (
          children
        ) : (
          <>
            {/* Top Bar: Contactless + Bank Name */}
            <div className="credit-card-top">
              {showContactless ? (
                <svg
                  className="credit-card-contactless"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-label="Contactless payment"
                >
                  <path d="M7 7a7 7 0 0 1 0 10" />
                  <path d="M11 4a11 11 0 0 1 0 16" />
                  <path d="M15 1a15 15 0 0 1 0 22" />
                </svg>
              ) : (
                <span />
              )}

              <div className="credit-card-brand">
                <span className="credit-card-bank-name">{bankName}</span>
                {tier && <span className="credit-card-tier">{tier}</span>}
              </div>
            </div>

            {/* Middle: Card Number */}
            <div className="credit-card-number" aria-label={`Card number: ${cardNumber}`}>
              {cardNumber.includes(" ") ? (
                cardNumber.split(/\s+/).map((segment, idx) => (
                  <span key={idx}>{segment}</span>
                ))
              ) : (
                <span>{cardNumber}</span>
              )}
            </div>

            {/* Bottom Bar: Cardholder, Expiry, and Interlocking Glass Network Rings */}
            <div className="credit-card-bottom">
              <div className="credit-card-field">
                <span className="credit-card-value">{cardHolder}</span>
              </div>

              <div className="credit-card-field">
                <span className="credit-card-value">{validThru}</span>
              </div>

              <div className="credit-card-network" aria-label="Payment network emblem">
                <div className="network-circle network-circle-left"></div>
                <div className="network-circle network-circle-right"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const TactileCard = TactileCreditCard;
export default TactileCreditCard;
