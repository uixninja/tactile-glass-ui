import React, { useRef, useEffect, useState, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  PROMPT_DEFAULT_PARAMS,
} from "../engine/TactileEngine";

export interface TactilePromptInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onMentionClick?: () => void;
  agentLabel?: string;
  modeLabel?: string;
  onAgentClick?: () => void;
  onModeClick?: () => void;
  className?: string;
  // Glass optics
  refraction?: number;          // 0..100, default 88
  thickness?: number;           // 0..100, default 72
  bevelWidth?: number;          // 0..30, default 3
  frost?: number;               // 0..100, default 4
  dispersion?: number;          // 0..100, default 96
  sheen?: number;               // 0..100, default 12
  lightAngle?: number;          // -180..180 deg, default 24
  darkness?: number;            // 0..100, default 0
  rim?: number;                 // 0..100, default 16
  // Fluid optics
  fluidBrightness?: number;     // 0..300, default 24
  fluidSpeed?: number;          // 0..300, default 64
  fluidScale?: number;          // 0..100, default 16
  fluidAuraWidth?: number;      // 0..96, default 16
  fluidCenter?: number;         // 0..100, default 0
  auroraFlow?: number;          // 0..100, default 100
  // Interactivity dynamics
  hoverBrightness?: number;     // 0..300, default 200
  trackCursorLight?: boolean;   // default: true
  lightTrackingStrength?: number; // 0..100, default 100
  clickShockwave?: boolean;     // default: true
  shockwaveStrength?: number;   // 0..100, default 96
}

export const TactilePromptInput: React.FC<TactilePromptInputProps> = ({
  value,
  defaultValue = "",
  placeholder = "Ask anything, @ to mention, / for actions",
  onChange,
  onSubmit,
  onMentionClick,
  agentLabel = "Agent",
  modeLabel,
  onAgentClick,
  onModeClick,
  className = "",
  refraction = PROMPT_DEFAULT_PARAMS.refraction,
  thickness = PROMPT_DEFAULT_PARAMS.thickness,
  bevelWidth = PROMPT_DEFAULT_PARAMS.bevelWidth,
  frost = PROMPT_DEFAULT_PARAMS.frost,
  dispersion = PROMPT_DEFAULT_PARAMS.dispersion,
  sheen = PROMPT_DEFAULT_PARAMS.sheen,
  lightAngle = PROMPT_DEFAULT_PARAMS.lightAngle,
  darkness = PROMPT_DEFAULT_PARAMS.darkness,
  rim = PROMPT_DEFAULT_PARAMS.rim,
  fluidBrightness = PROMPT_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = PROMPT_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = PROMPT_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = PROMPT_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = PROMPT_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = PROMPT_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = PROMPT_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = PROMPT_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = PROMPT_DEFAULT_PARAMS.clickWave,
}) => {
  const instanceId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  const paramsRef = useRef<TactileGlassParams>({
    radius: 24,
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
      getParams: () => paramsRef.current,
      curMouseX: 0,
      curMouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      curHover: 0,
      targetHover: 0,
      clickPos: [-999, -999],
      clickTime: -999,
      visible: true,
    };

    const updateBounds = () => {
      if (!root || !canvas) return;
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      paramsRef.current.radius = Math.min(24 * dpr, Math.min(w, h) * 0.5);
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(root);

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

    const handlePointerCoord = (e: PointerEvent) => {
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;
    };

    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("pointerdown", handlePointerDown);

    engine.register(instance);

    return () => {
      engine.unregister(instanceId);
      resizeObserver.disconnect();
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [instanceId]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxH = parseFloat(window.getComputedStyle(textarea).maxHeight) || 160;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxH)}px`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    if (value === undefined) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const [modeIdx, setModeIdx] = useState(0);
  const modes = [
    { label: agentLabel, placeholder },
    { label: "Plan", placeholder: "Plan architecture, @ to mention, / for actions" },
    { label: "Ask", placeholder: "Ask a question, @ to mention, / for actions" },
  ];
  const activeMode = modes[modeIdx % modes.length];

  const handleMentionPress = () => {
    if (onMentionClick) {
      onMentionClick();
      return;
    }
    textareaRef.current?.focus();
  };

  const handleAgentPress = () => {
    if (onAgentClick) {
      onAgentClick();
      return;
    }
    setModeIdx((prev) => (prev + 1) % modes.length);
  };

  const handleSubmit = () => {
    if (!currentValue.trim()) return;
    onSubmit?.(currentValue);
    if (value === undefined) {
      setInternalValue("");
      requestAnimationFrame(() => adjustTextareaHeight());
    }
  };

  return (
    <div
      ref={rootRef}
      className={`tactile-prompt-box ${className}`.trim()}
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

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-16)",
          width: "100%",
        }}
      >
        {/* Top: Expanding Prompt Textarea */}
        <div className="prompt-body">
          <textarea
            ref={textareaRef}
            value={currentValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={activeMode.placeholder}
            rows={1}
            className="prompt-textarea"
          />
        </div>

        {/* Bottom Bar: Add Context + Mode Pill & Submit Button */}
        <div className="prompt-bottom-bar">
          <div className="prompt-pills-row">
            <button
              type="button"
              onClick={handleMentionPress}
              aria-label="Add context"
              className="prompt-mention-btn"
            >
              <svg
                className="prompt-submit-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleAgentPress}
              className="prompt-pill"
            >
              <span className="prompt-pill-label">{activeMode.label}</span>
            </button>

            {modeLabel && (
              <button
                type="button"
                onClick={onModeClick}
                className="prompt-pill"
              >
                <span className="prompt-pill-label">{modeLabel}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Submit prompt"
            disabled={!currentValue.trim()}
            className="prompt-submit-btn"
          >
            <svg
              className="prompt-submit-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const TactileAgentInput = TactilePromptInput;
export default TactilePromptInput;
