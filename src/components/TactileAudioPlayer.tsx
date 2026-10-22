import React, { useRef, useEffect, useState, useId } from "react";
import {
  getSharedCausticEngine,
  TactileGlassParams,
  TactileGlassInstance,
  AUDIO_DEFAULT_PARAMS,
} from "../engine/TactileEngine";
import { getSharedAudioSynth } from "../engine/TactileAudioSynth";

export interface TactileAudioTrack {
  title: string;
  durationSec: number;
}

export const DEFAULT_AUDIO_TRACKS: TactileAudioTrack[] = [
  {
    title: "Solaris Phase",
    durationSec: 228,
  },
  {
    title: "Obsidian Bloom",
    durationSec: 256,
  },
  {
    title: "Caustic Horizon",
    durationSec: 192,
  },
];

export interface TactileAudioPlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tracks?: TactileAudioTrack[];
  defaultTrackIndex?: number;
  defaultPlaying?: boolean;
  radius?: number; // Corner radius in px, default 32
  className?: string;
  style?: React.CSSProperties;
  onPlayChange?: (playing: boolean) => void;
  onTrackChange?: (trackIndex: number, track: TactileAudioTrack) => void;
  // Glass optics
  refraction?: number;
  thickness?: number;
  bevelWidth?: number;
  frost?: number;
  dispersion?: number;
  sheen?: number;
  lightAngle?: number;
  darkness?: number;
  rim?: number;
  // Fluid optics
  fluidBrightness?: number;
  fluidSpeed?: number;
  fluidScale?: number;
  fluidAuraWidth?: number;
  fluidCenter?: number;
  auroraFlow?: number;
  // Interactivity dynamics
  hoverBrightness?: number;
  trackCursorLight?: boolean;
  lightTrackingStrength?: number;
  clickShockwave?: boolean;
  shockwaveStrength?: number;
  tilt3d?: boolean;
  maxTilt?: number;
}

function formatTimecode(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

/**
 * TactileAudioPlayer
 * Spatial Glass Audio Deck Component (480x304px, strict 4px grid).
 * Features real-time WebGL2 Snell refraction, chromatic dispersion,
 * procedural fluid caustics, Web Audio API synthesis, interactive 3D tilt,
 * track switching, and timeline scrubbing.
 */
export const TactileAudioPlayer: React.FC<TactileAudioPlayerProps> = ({
  tracks = DEFAULT_AUDIO_TRACKS,
  defaultTrackIndex = 0,
  defaultPlaying = false,
  radius,
  className = "",
  style,
  onPlayChange,
  onTrackChange,
  refraction = AUDIO_DEFAULT_PARAMS.refraction,
  thickness = AUDIO_DEFAULT_PARAMS.thickness,
  bevelWidth = AUDIO_DEFAULT_PARAMS.bevelWidth,
  frost = AUDIO_DEFAULT_PARAMS.frost,
  dispersion = AUDIO_DEFAULT_PARAMS.dispersion,
  sheen = AUDIO_DEFAULT_PARAMS.sheen,
  lightAngle = AUDIO_DEFAULT_PARAMS.lightAngle,
  darkness = AUDIO_DEFAULT_PARAMS.darkness,
  rim = AUDIO_DEFAULT_PARAMS.rim,
  fluidBrightness = AUDIO_DEFAULT_PARAMS.fluidBright,
  fluidSpeed = AUDIO_DEFAULT_PARAMS.fluidSpeed,
  fluidScale = AUDIO_DEFAULT_PARAMS.fluidScale,
  fluidAuraWidth = AUDIO_DEFAULT_PARAMS.fluidAuraWidth,
  fluidCenter = AUDIO_DEFAULT_PARAMS.fluidCenter,
  auroraFlow = AUDIO_DEFAULT_PARAMS.auroraFlow,
  hoverBrightness = AUDIO_DEFAULT_PARAMS.hoverBright,
  trackCursorLight = true,
  lightTrackingStrength = AUDIO_DEFAULT_PARAMS.lightTrack,
  clickShockwave = true,
  shockwaveStrength = AUDIO_DEFAULT_PARAMS.clickWave,
  tilt3d = true,
  maxTilt = 10,
  ...restProps
}) => {
  const instanceId = useId();
  const deckRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressHitRef = useRef<HTMLDivElement | null>(null);

  const [trackIdx, setTrackIdx] = useState(
    Math.max(0, Math.min(tracks.length - 1, defaultTrackIndex))
  );
  const [isPlaying, setIsPlaying] = useState(defaultPlaying);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeTrack = tracks[trackIdx] || DEFAULT_AUDIO_TRACKS[0];

  const paramsRef = useRef<TactileGlassParams>({
    radius: radius ?? 32,
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
    return () => {
      getSharedAudioSynth().setPlaying(false);
    };
  }, []);

  useEffect(() => {
    const specCanvas = spectrumCanvasRef.current;
    const deckEl = deckRef.current;
    if (!specCanvas || !deckEl) return;

    const fgCtx = specCanvas.getContext("2d");
    if (!fgCtx) return;

    const synth = getSharedAudioSynth();
    const engine = getSharedCausticEngine();
    const barCount = 70;
    const spectrumBars = new Float32Array(barCount);
    const idleWaveBars = new Float32Array(barCount);
    const idleGlowBars = new Float32Array(barCount);
    let rafId: number | null = null;

    const renderSpectrum = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = specCanvas.clientWidth || 480;
      const cssH = specCanvas.clientHeight || 304;
      const cardW = Math.round(cssW * dpr);
      const cardH = Math.round(cssH * dpr);
      if (specCanvas.width !== cardW || specCanvas.height !== cardH) {
        specCanvas.width = cardW;
        specCanvas.height = cardH;
      }

      const t = engine.getTime();
      synth.getSpectrumBars(barCount, spectrumBars, t);
      synth.getIdleWaveBars(barCount, idleWaveBars, t, idleGlowBars);

      fgCtx.clearRect(0, 0, cardW, cardH);
      const barW = Math.max(1, Math.round(1.5 * dpr));
      const stepPx = Math.max(2, Math.round(6 * (cssW / 480) * dpr));
      const totalSpan = (barCount - 1) * stepPx + barW;
      const startX = Math.round((cardW - totalSpan) * 0.5);
      const fgWaveCy = Math.round((146 / 304) * cardH);
      const scaleY = (cssH / 304) * dpr;
      const baseDotH = Math.max(2, Math.round(2 * scaleY));

      for (let i = 0; i < barCount; i++) {
        const x0 = startX + i * stepPx;
        const level = spectrumBars[i];
        const signedIdle = idleWaveBars[i];
        const glow = Math.min(1, Math.max(idleGlowBars[i], level * 2.5));
        const alpha = 0.16 + 0.76 * glow;

        const symExtraH = 130 * level * scaleY;
        const idleWavePx = signedIdle * 56 * scaleY;

        const upH = symExtraH * 0.5 + Math.max(0, idleWavePx);
        const downH = symExtraH * 0.5 + Math.max(0, -idleWavePx);
        const fullH = baseDotH + upH + downH;
        const topY = fgWaveCy - baseDotH * 0.5 - upH;

        fgCtx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        fgCtx.beginPath();
        fgCtx.roundRect(x0, topY, barW, fullH, barW * 0.5);
        fgCtx.fill();
      }

      rafId = requestAnimationFrame(renderSpectrum);
    };

    rafId = requestAnimationFrame(renderSpectrum);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let rafId: number | null = null;

    const stepPlayback = (now: number) => {
      const dt = (now - lastTime) * 0.001;
      lastTime = now;
      setProgress((prev) => {
        const next = prev + dt / Math.max(1, activeTrack.durationSec);
        if (next >= 1) {
          const synth = getSharedAudioSynth();
          synth.seek(0);
          if (!isLiked) {
            const nextIdx = (trackIdx + 1) % tracks.length;
            synth.setTrack(nextIdx);
            setTrackIdx(nextIdx);
            onTrackChange?.(nextIdx, tracks[nextIdx]);
          }
          return 0;
        }
        return next;
      });
      rafId = requestAnimationFrame(stepPlayback);
    };

    rafId = requestAnimationFrame(stepPlayback);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, activeTrack.durationSec, isLiked, trackIdx, tracks, onTrackChange]);

  useEffect(() => {
    const deckEl = deckRef.current;
    const canvasEl = canvasRef.current;
    if (!deckEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d", { alpha: true });
    if (!ctx) return;

    const engine = getSharedCausticEngine();

    let deckW = 0;
    let deckH = 0;
    let padBottom = 0;

    const instance: TactileGlassInstance = {
      id: instanceId,
      canvas: canvasEl,
      ctx,
      getParams: () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxRad = Math.min(deckW || canvasEl.width, deckH || canvasEl.height) * 0.5;
        const cssRad = radius !== undefined ? radius : (parseFloat(window.getComputedStyle(deckEl).borderRadius) || 32);
        paramsRef.current.radius = Math.min(cssRad * dpr, maxRad);
        return paramsRef.current;
      },
      getRect: () => [0, padBottom, deckW, deckH],
      curHover: 0,
      targetHover: 0,
      curMouseX: 0,
      curMouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      clickPos: [-999, -999],
      clickTime: -999,
      visible: true,
      isAudioDeck: true,
    };

    const updateDimensions = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = deckEl.offsetWidth || 480;
      const cssH = deckEl.offsetHeight || 304;
      const scale = Math.min(1, cssW / 480);
      deckEl.style.setProperty("--audio-scale", scale.toFixed(4));
      const bleedBottomCss = Math.ceil(48 * scale);
      canvasEl.style.bottom = `-${bleedBottomCss}px`;
      canvasEl.style.height = `calc(100% + ${bleedBottomCss}px)`;
      deckW = Math.round(cssW * dpr);
      deckH = Math.round(cssH * dpr);
      padBottom = Math.round(bleedBottomCss * dpr);
      const totalH = deckH + padBottom;
      if (canvasEl.width !== deckW || canvasEl.height !== totalH) {
        canvasEl.width = deckW;
        canvasEl.height = totalH;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(deckEl);

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
      const ease = isHovered ? 0.1 : 0.07;
      curRotX += (targetRotX - curRotX) * ease;
      curRotY += (targetRotY - curRotY) * ease;
      curScale += (targetScale - curScale) * ease;

      instance.tilt = { rotX: curRotX, rotY: curRotY, scale: curScale, focalLength: 1000 };
      deckEl.style.transform = `perspective(var(--perspective-3d)) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(${curScale.toFixed(3)}, ${curScale.toFixed(3)}, ${curScale.toFixed(3)})`;

      const isStillMoving =
        Math.abs(targetRotX - curRotX) > 0.01 ||
        Math.abs(targetRotY - curRotY) > 0.01 ||
        Math.abs(targetScale - curScale) > 0.001;

      if (isHovered || isStillMoving) {
        tiltRaf = requestAnimationFrame(updateTilt);
      } else {
        tiltRaf = null;
        instance.tilt = null;
        deckEl.style.transform = "";
      }
    };

    const handlePointerCoord = (e: PointerEvent) => {
      const r = deckEl.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      instance.targetMouseX = (e.clientX - cx) * dpr;
      instance.targetMouseY = (cy - e.clientY) * dpr;

      if (tilt3d) {
        if (
          e.target instanceof Element &&
          e.target.closest(".audio-controls-dock, .audio-timeline-group, .audio-like-btn")
        ) {
          targetRotX = 0;
          targetRotY = 0;
          targetScale = 1.0;
        } else {
          const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.5)));
          const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.5)));
          targetRotX = -ny * maxTilt;
          targetRotY = nx * maxTilt;
          targetScale = 1.025;
        }
        if (tiltRaf === null) {
          tiltRaf = requestAnimationFrame(updateTilt);
        }
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      isHovered = true;
      instance.targetHover = 1.0;
      handlePointerCoord(e);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isHovered) {
        instance.targetHover = 1.0;
        handlePointerCoord(e);
      }
    };

    const onPointerLeave = () => {
      isHovered = false;
      instance.targetHover = 0.0;
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1.0;
      if (tilt3d && tiltRaf === null) {
        tiltRaf = requestAnimationFrame(updateTilt);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      handlePointerCoord(e);
      instance.clickPos = [instance.targetMouseX, instance.targetMouseY];
      instance.clickTime = engine.getTime();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        onPointerLeave();
      }
    };

    deckEl.addEventListener("pointerenter", onPointerEnter);
    deckEl.addEventListener("pointermove", onPointerMove);
    deckEl.addEventListener("pointerleave", onPointerLeave);
    deckEl.addEventListener("pointercancel", onPointerLeave);
    deckEl.addEventListener("pointerup", onPointerUp);
    deckEl.addEventListener("pointerdown", onPointerDown);

    engine.register(instance);

    return () => {
      resizeObserver.disconnect();
      if (tiltRaf !== null) cancelAnimationFrame(tiltRaf);
      deckEl.removeEventListener("pointerenter", onPointerEnter);
      deckEl.removeEventListener("pointermove", onPointerMove);
      deckEl.removeEventListener("pointerleave", onPointerLeave);
      deckEl.removeEventListener("pointercancel", onPointerLeave);
      deckEl.removeEventListener("pointerup", onPointerUp);
      deckEl.removeEventListener("pointerdown", onPointerDown);
      engine.unregister(instanceId);
    };
  }, [instanceId, radius, tilt3d, maxTilt]);

  const handleTogglePlay = () => {
    const next = !isPlaying;
    const synth = getSharedAudioSynth();
    synth.setTrack(trackIdx);
    synth.seek(progress);
    synth.setPlaying(next);
    setIsPlaying(next);
    onPlayChange?.(next);
  };

  const handlePrevTrack = () => {
    const nextIdx = (trackIdx - 1 + tracks.length) % tracks.length;
    const synth = getSharedAudioSynth();
    synth.seek(0);
    synth.setTrack(nextIdx);
    synth.setPlaying(true);
    setTrackIdx(nextIdx);
    setProgress(0);
    setIsPlaying(true);
    onTrackChange?.(nextIdx, tracks[nextIdx]);
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIdx + 1) % tracks.length;
    const synth = getSharedAudioSynth();
    synth.seek(0);
    synth.setTrack(nextIdx);
    synth.setPlaying(true);
    setTrackIdx(nextIdx);
    setProgress(0);
    setIsPlaying(true);
    onTrackChange?.(nextIdx, tracks[nextIdx]);
  };

  const scrubToClientX = (clientX: number) => {
    const hitEl = progressHitRef.current;
    if (!hitEl) return;
    const r = hitEl.getBoundingClientRect();
    if (r.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    getSharedAudioSynth().seek(ratio);
    setProgress(ratio);
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    scrubToClientX(e.clientX);
  };

  const handleTimelinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId) || e.buttons === 1) {
      e.stopPropagation();
      scrubToClientX(e.clientX);
    }
  };

  const handleTimelinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  const curSec = progress * activeTrack.durationSec;
  const remSec = Math.max(0, activeTrack.durationSec - curSec);

  return (
    <div
      ref={deckRef}
      className={`tactile-audio-player ${className}`.trim()}
      style={{
        position: "relative",
        width: "min(100%, var(--audio-w))",
        aspectRatio: "480 / 304",
        height: "auto",
        padding: "var(--audio-pad-top) var(--audio-pad-h) var(--audio-pad-bottom)",
        borderRadius: radius !== undefined ? `${radius}px` : "var(--audio-radius)",
        border: "none",
        background: "transparent",
        outline: "none",
        boxSizing: "border-box",
        userSelect: "none",
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

      <canvas
        ref={spectrumCanvasRef}
        className="audio-spectrum-front"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div className="audio-player-inner">
        <div className="audio-top-row">
          <div className="audio-track-title">{activeTrack.title}</div>

          <button
            type="button"
            className="audio-like-btn"
            aria-label="Repeat track"
            aria-pressed={isLiked}
            onClick={() => setIsLiked((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m17 2 4 4-4 4" />
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
              <path d="m7 22-4-4 4-4" />
              <path d="M21 13v1a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        </div>

        <div className="audio-timeline-group">
          <div
            ref={progressHitRef}
            className="audio-progress-hit"
            role="slider"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onPointerDown={handleTimelinePointerDown}
            onPointerMove={handleTimelinePointerMove}
            onPointerUp={handleTimelinePointerUp}
            onPointerCancel={handleTimelinePointerUp}
            onClick={(e) => {
              e.stopPropagation();
              scrubToClientX(e.clientX);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = Math.max(0, progress - 0.05);
                getSharedAudioSynth().seek(next);
                setProgress(next);
              } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(1, progress + 0.05);
                getSharedAudioSynth().seek(next);
                setProgress(next);
              }
            }}
          >
            <div className="audio-progress-track">
              <div
                className="audio-progress-fill"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              />
            </div>
          </div>

          <div className="audio-time-row">
            <span>{formatTimecode(curSec)}</span>
            <span>-{formatTimecode(remSec)}</span>
          </div>
        </div>
      </div>

      <div className="audio-controls-dock">
        <button
          type="button"
          className="audio-transport-btn"
          aria-label="Previous track"
          onClick={handlePrevTrack}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" x2="5" y1="19" y2="5" />
          </svg>
        </button>
        <button
          type="button"
          className="audio-play-btn"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="14" y="4" width="4" height="16" rx="1" />
              <rect x="6" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="audio-transport-btn"
          aria-label="Next track"
          onClick={handleNextTrack}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" x2="19" y1="5" y2="19" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TactileAudioPlayer;
