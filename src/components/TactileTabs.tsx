import React, { useRef, useEffect, useState, useId, useMemo, useCallback } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  TABS_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactileTabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TactileTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: Array<TactileTabItem | string>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "xl";
  className?: string;
  // Base container glass optics overrides
  refraction?: number;          // 0..100, default 2
  thickness?: number;           // 0..100, default 8
  bevelWidth?: number;          // 0..30, default 2
  frost?: number;               // 0..100, default 8
  dispersion?: number;          // 0..100, default 80
  sheen?: number;               // 0..100, default 24
  lightAngle?: number;          // -180..180 deg, default 24
  darkness?: number;            // 0..100, default 0
  rim?: number;                 // 0..100, default 48
  // Fluid caustic overrides
  fluidBrightness?: number;     // 0..300, default 40
  fluidSpeed?: number;          // 0..300, default 80
  fluidScale?: number;          // 0..100, default 8
  fluidAuraWidth?: number;      // 0..96, default 12
  fluidCenter?: number;         // 0..100, default 0
  auroraFlow?: number;          // 0..100, default 64
  // Interactivity dynamics
  hoverBrightness?: number;     // 0..300, default 256
  trackCursorLight?: boolean;   // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;     // default: true
  shockwaveStrength?: number;   // 0..100, default 96
}

/**
 * TactileTabs (Segmented Control)
 * Pure React + TypeScript + Design System CSS Tokens.
 * Features a sliding optical glass pill indicator powered by the shared WebGL2 singleton engine.
 */
export const TactileTabs: React.FC<TactileTabsProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  size = "xl",
  className = "",
  refraction = TABS_DEFAULT_PARAMS.refraction,
  thickness = TABS_DEFAULT_PARAMS.thickness,
  bevelWidth = TABS_DEFAULT_PARAMS.bevelWidth,
  frost = TABS_DEFAULT_PARAMS.frost,
  dispersion = TABS_DEFAULT_PARAMS.dispersion,
  sheen = TABS_DEFAULT_PARAMS.sheen,
  lightAngle = TABS_DEFAULT_PARAMS.lightAngle,
  darkness = TABS_DEFAULT_PARAMS.darkness,
  rim = TABS_DEFAULT_PARAMS.rim,
  fluidBrightness = TABS_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = TABS_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = TABS_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = TABS_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = TABS_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = TABS_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = TABS_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = TABS_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = TABS_DEFAULT_PARAMS.clickWave,
  ...props
}) => {
  const instanceId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Normalize items to TactileTabItem array
  const normalizedItems: TactileTabItem[] = useMemo(() => {
    return items.map((item) => {
      if (typeof item === "string") {
        return { value: item, label: item };
      }
      return item;
    });
  }, [items]);

  const initialVal = defaultValue ?? normalizedItems[0]?.value ?? "";
  const [internalValue, setInternalValue] = useState<string>(initialVal);
  const activeValue = controlledValue !== undefined ? controlledValue : internalValue;

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const paramsRef = useRef<TactileGlassParams>({
    radius: 16,
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

  // Update sliding indicator position based on active tab element
  const updateIndicatorPosition = useCallback(() => {
    const activeTab = tabsRef.current.get(activeValue);
    if (!activeTab) return;

    setIndicatorStyle({
      left: activeTab.offsetLeft,
      width: activeTab.offsetWidth,
      ready: true,
    });
  }, [activeValue]);

  useEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition, normalizedItems]);

  // Register in shared WebGL2 singleton engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

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
        const ind = indicatorRef.current;
        if (!ind || !root) return null;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const br = root.getBoundingClientRect();
        const tr = ind.getBoundingClientRect();
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

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(root.offsetWidth * dpr);
      const h = Math.round(root.offsetHeight * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    updateCanvasSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateIndicatorPosition();
        updateCanvasSize();
      });
      resizeObserver.observe(root);
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
      if (resizeObserver) resizeObserver.disconnect();
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
    };
  }, [instanceId, updateIndicatorPosition]);

  const handleSelect = (val: string, disabled?: boolean) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  // Keyboard accessibility (ArrowLeft / ArrowRight)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledItems = normalizedItems.filter((i) => !i.disabled);
    if (enabledItems.length <= 1) return;

    const currentIndex = enabledItems.findIndex((i) => i.value === activeValue);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = enabledItems[(currentIndex + 1) % enabledItems.length];
      handleSelect(next.value);
      tabsRef.current.get(next.value)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length];
      handleSelect(prev.value);
      tabsRef.current.get(prev.value)?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      role="tablist"
      aria-label={props["aria-label"] || "Tabs"}
      onKeyDown={handleKeyDown}
      className={`tactile-tabs ${className}`.trim()}
      {...props}
    >
      {/* Full container WebGL glass canvas (renders both base capsule and localized sliding tab pill) */}
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

      {/* Sliding Pill Indicator (Molded WebGL Optical Glass Capsule) */}
      <span
        ref={indicatorRef}
        data-tabs-indicator
        aria-hidden="true"
        className="tabs-indicator"
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.ready ? 1 : 0,
        }}
      />

      {/* Tab Buttons */}
      {normalizedItems.map((item) => {
        const isSelected = item.value === activeValue;
        return (
          <button
            key={item.value}
            ref={(el) => {
              if (el) tabsRef.current.set(item.value, el);
              else tabsRef.current.delete(item.value);
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={item.disabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleSelect(item.value, item.disabled)}
            className={`tab-item ${isSelected ? "active" : ""}`.trim()}
          >
            {item.icon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TactileSegmented = TactileTabs;
export default TactileTabs;
