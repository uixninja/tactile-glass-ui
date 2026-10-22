/// <reference types="vite/client" />
import {
  getSharedCausticEngine,
  TactileGlassInstance,
  TactileGlassStage,
  TactileGlassParams,
  StageTargetInfo,
  BUTTON_DEFAULT_PARAMS,
  SWITCH_OFF_DEFAULT_PARAMS,
  SWITCH_ON_DEFAULT_PARAMS,
  TABS_DEFAULT_PARAMS,
  PROMPT_DEFAULT_PARAMS,
  HEADING_DEFAULT_PARAMS,
  CARD_DEFAULT_PARAMS,
  AUDIO_DEFAULT_PARAMS,
  BACKGROUND_DEFAULT_PARAMS
} from "../engine/TactileEngine";
import { getSharedAudioSynth } from "../engine/TactileAudioSynth";
import {
  createIcons,
  Activity,
  ToggleRight,
  Layers,
  Bot,
  ArrowRight,
  ChartPie,
  ChevronDown,
  ArrowUp,
  Plus,
  Heading,
  CreditCard,
  Disc3,
  Maximize2,
  Repeat,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Copy,
  Check,
  Download
} from "lucide";
import skillMarkdown from "../../SKILL.md?raw";

const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
const lensBtn = document.getElementById("lens-btn") as HTMLElement;
const lensBtnCircle = document.getElementById("lens-btn-circle") as HTMLElement;

let stage: TactileGlassStage | null = null;

function toStageParams(def: Omit<TactileGlassParams, "radius">): TactileGlassParams {
  return {
    refraction: def.refraction,
    thickness: def.thickness,
    bevelWidth: def.bevelWidth,
    frost: def.frost,
    dispersion: def.dispersion,
    sheen: def.sheen,
    angle: def.lightAngle ?? def.angle ?? 24,
    darkness: def.darkness,
    rim: def.rim,
    fluidBright: def.fluidBright,
    fluidSpeed: def.fluidSpeed,
    fluidScale: def.fluidScale,
    fluidAuraWidth: def.fluidAuraWidth,
    fluidCenter: def.fluidCenter,
    auroraFlow: def.auroraFlow,
    hoverBright: def.hoverBright,
    lightTrack: def.lightTrack,
    clickWave: def.clickWave
  };
}

// Component Default & Mutable Configurations (Single Source of Truth from TactileEngine)
const defaultConfigs: Record<string, TactileGlassParams> = {
  button: toStageParams(BUTTON_DEFAULT_PARAMS),
  switch_off: toStageParams(SWITCH_OFF_DEFAULT_PARAMS),
  switch_on: toStageParams(SWITCH_ON_DEFAULT_PARAMS),
  tabs: toStageParams(TABS_DEFAULT_PARAMS),
  prompt: toStageParams(PROMPT_DEFAULT_PARAMS),
  heading: toStageParams(HEADING_DEFAULT_PARAMS),
  card: toStageParams(CARD_DEFAULT_PARAMS),
  audio: toStageParams(AUDIO_DEFAULT_PARAMS),
  background: toStageParams(BACKGROUND_DEFAULT_PARAMS)
};

const componentConfigs: Record<string, TactileGlassParams> = {
  button: { ...defaultConfigs.button },
  switch_off: { ...defaultConfigs.switch_off },
  switch_on: { ...defaultConfigs.switch_on },
  tabs: { ...defaultConfigs.tabs },
  prompt: { ...defaultConfigs.prompt },
  heading: { ...defaultConfigs.heading },
  card: { ...defaultConfigs.card },
  audio: { ...defaultConfigs.audio },
  background: { ...defaultConfigs.background }
};

let activeComponent = "button";
try {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTab = urlParams.get("tab");
  if (urlTab && ["button", "switch", "tabs", "prompt", "heading", "card", "audio", "background"].includes(urlTab)) {
    activeComponent = urlTab;
  } else {
    const storedComp = localStorage.getItem("tactile_active_tab");
    if (
      storedComp === "button" ||
      storedComp === "switch" ||
      storedComp === "tabs" ||
      storedComp === "prompt" ||
      storedComp === "heading" ||
      storedComp === "card" ||
      storedComp === "audio" ||
      storedComp === "background"
    ) {
      activeComponent = storedComp;
    }
  }
  const urlDisp = urlParams.get("disp");
  if (urlDisp !== null && !isNaN(Number(urlDisp))) {
    const dVal = Math.max(0, Math.min(100, Number(urlDisp)));
    const key =
      activeComponent === "button"
        ? "button"
        : activeComponent === "prompt"
        ? "prompt"
        : activeComponent === "tabs"
        ? "tabs"
        : activeComponent === "heading"
        ? "heading"
        : activeComponent === "card"
        ? "card"
        : activeComponent === "audio"
        ? "audio"
        : activeComponent === "background"
        ? "background"
        : "switch_on";
    componentConfigs[key].dispersion = dVal;
  }
} catch {
  // localStorage/URL parsing fallback
}

let currentSwitchState = true;

function getActiveConfigKey(): string {
  if (activeComponent === "button") return "button";
  if (activeComponent === "tabs") return "tabs";
  if (activeComponent === "prompt") return "prompt";
  if (activeComponent === "heading") return "heading";
  if (activeComponent === "card") return "card";
  if (activeComponent === "audio") return "audio";
  if (activeComponent === "background") return "background";
  return currentSwitchState ? "switch_on" : "switch_off";
}

interface ControlDef {
  idSlider: string;
  idVal: string;
  key: keyof TactileGlassParams;
  suffix: string;
}

const controls: ControlDef[] = [
  { idSlider: "sl-refraction", idVal: "val-refraction", key: "refraction", suffix: "" },
  { idSlider: "sl-thickness", idVal: "val-thickness", key: "thickness", suffix: "" },
  { idSlider: "sl-bevel", idVal: "val-bevel", key: "bevelWidth", suffix: "" },
  { idSlider: "sl-frost", idVal: "val-frost", key: "frost", suffix: "" },
  { idSlider: "sl-dispersion", idVal: "val-dispersion", key: "dispersion", suffix: "" },
  { idSlider: "sl-sheen", idVal: "val-sheen", key: "sheen", suffix: "" },
  { idSlider: "sl-angle", idVal: "val-angle", key: "angle", suffix: "°" },
  { idSlider: "sl-darkness", idVal: "val-darkness", key: "darkness", suffix: "" },
  { idSlider: "sl-rim", idVal: "val-rim", key: "rim", suffix: "" },
  { idSlider: "sl-fluid-bright", idVal: "val-fluid-bright", key: "fluidBright", suffix: "" },
  { idSlider: "sl-fluid-speed", idVal: "val-fluid-speed", key: "fluidSpeed", suffix: "%" },
  { idSlider: "sl-fluid-scale", idVal: "val-fluid-scale", key: "fluidScale", suffix: "%" },
  { idSlider: "sl-fluid-aura-width", idVal: "val-fluid-aura-width", key: "fluidAuraWidth", suffix: "px" },
  { idSlider: "sl-fluid-center", idVal: "val-fluid-center", key: "fluidCenter", suffix: "%" },
  { idSlider: "sl-aurora-flow", idVal: "val-aurora-flow", key: "auroraFlow", suffix: "%" },
  { idSlider: "sl-hover-bright", idVal: "val-hover-bright", key: "hoverBright", suffix: "" },
  { idSlider: "sl-light-track", idVal: "val-light-track", key: "lightTrack", suffix: "%" },
  { idSlider: "sl-click-wave", idVal: "val-click-wave", key: "clickWave", suffix: "%" }
];

function updateSwitchStateUI(isOn: boolean) {
  const btnOff = document.getElementById("btn-state-off");
  const btnOn = document.getElementById("btn-state-on");
  if (btnOff && btnOn) {
    btnOff.classList.toggle("active", !isOn);
    btnOn.classList.toggle("active", isOn);
  }
}

const OPTICAL_PROP_MAP: Array<{ key: keyof TactileGlassParams; prop: string }> = [
  { key: "refraction", prop: "refraction" },
  { key: "thickness", prop: "thickness" },
  { key: "bevelWidth", prop: "bevelWidth" },
  { key: "frost", prop: "frost" },
  { key: "dispersion", prop: "dispersion" },
  { key: "sheen", prop: "sheen" },
  { key: "angle", prop: "lightAngle" },
  { key: "darkness", prop: "darkness" },
  { key: "rim", prop: "rim" },
  { key: "fluidBright", prop: "fluidBrightness" },
  { key: "fluidSpeed", prop: "fluidSpeed" },
  { key: "fluidScale", prop: "fluidScale" },
  { key: "fluidAuraWidth", prop: "fluidAuraWidth" },
  { key: "fluidCenter", prop: "fluidCenter" },
  { key: "auroraFlow", prop: "auroraFlow" },
  { key: "hoverBright", prop: "hoverBrightness" },
  { key: "lightTrack", prop: "lightTrackingStrength" },
  { key: "clickWave", prop: "shockwaveStrength" }
];

function getChangedOpticalProps(cfg: TactileGlassParams, def: TactileGlassParams): string[] {
  const changed: string[] = [];
  for (const { key, prop } of OPTICAL_PROP_MAP) {
    if (cfg[key] !== def[key]) {
      changed.push(`${prop}={${cfg[key]}}`);
    }
  }
  return changed;
}

function formatTagWithProps(tagName: string, props: string[], children?: string): string {
  if (!children) {
    if (props.length === 0) return `<${tagName} />`;
    const inline = `<${tagName} ${props.join(" ")} />`;
    if (props.length <= 3 && inline.length <= 68) return inline;
    return [`<${tagName}`, ...props.map((p) => `  ${p}`), `/>`].join("\n");
  }
  if (props.length === 0) {
    return [`<${tagName}>`, `  ${children}`, `</${tagName}>`].join("\n");
  }
  const openInline = `<${tagName} ${props.join(" ")}>`;
  if (props.length <= 3 && openInline.length <= 68) {
    return [openInline, `  ${children}`, `</${tagName}>`].join("\n");
  }
  return [`<${tagName}`, ...props.map((p) => `  ${p}`), `>`, `  ${children}`, `</${tagName}>`].join("\n");
}

function buildComponentExport(comp: string): {
  filename: string;
  title: string;
  importName: string;
  code: string;
  wrapperCode: string;
  prompt: string;
} {
  let filename = "TactileButton.tsx";
  let title = "Tactile Button";
  let importName = "TactileButton";
  let code = "";

  if (comp === "button") {
    filename = "TactileButton.tsx";
    title = "Tactile Button";
    importName = "TactileButton";
    const changed = getChangedOpticalProps(componentConfigs.button, defaultConfigs.button);
    code = formatTagWithProps("TactileButton", changed, "Launch Interface");
  } else if (comp === "switch") {
    filename = "TactileSwitch.tsx";
    title = "Tactile Switch";
    importName = "TactileSwitch";
    const onCfg = componentConfigs.switch_on;
    const offCfg = componentConfigs.switch_off;
    const defOn = defaultConfigs.switch_on;
    const defOff = defaultConfigs.switch_off;
    const props: string[] = [`defaultChecked={${currentSwitchState}}`];
    for (const { key, prop } of OPTICAL_PROP_MAP) {
      if (onCfg[key] !== defOn[key]) {
        props.push(`${prop}={${onCfg[key]}}`);
      }
      if (key !== "angle" && offCfg[key] !== defOff[key]) {
        props.push(`${prop}Off={${offCfg[key]}}`);
      }
    }
    code = formatTagWithProps("TactileSwitch", props);
  } else if (comp === "tabs") {
    filename = "TactileTabs.tsx";
    title = "Tactile Tabs";
    importName = "TactileTabs";
    const changed = getChangedOpticalProps(componentConfigs.tabs, defaultConfigs.tabs);
    code = formatTagWithProps("TactileTabs", [
      `items={['Code', 'Review', 'Chat']}`,
      `defaultValue="Code"`,
      ...changed
    ]);
  } else if (comp === "prompt") {
    filename = "TactilePromptInput.tsx";
    title = "Tactile Prompt Input";
    importName = "TactilePromptInput";
    const changed = getChangedOpticalProps(componentConfigs.prompt, defaultConfigs.prompt);
    code = formatTagWithProps("TactilePromptInput", [
      `placeholder="Ask anything, @ to mention, / for actions"`,
      `agentLabel="Agent"`,
      ...changed
    ]);
  } else if (comp === "heading") {
    filename = "TactileHeading.tsx";
    title = "Tactile Heading";
    importName = "TactileHeading";
    const cfg = componentConfigs.heading;
    const def = defaultConfigs.heading;
    const changedEntries: string[] = [];
    for (const { key, prop } of OPTICAL_PROP_MAP) {
      if (cfg[key] !== def[key]) {
        changedEntries.push(`${prop}: ${cfg[key]}`);
      }
    }
    const baseProps = [
      `title="Built for Fluid Surfaces"`,
      `highlight="Fluid"`
    ];
    if (changedEntries.length > 0) {
      baseProps.push(`wordProps={{ ${changedEntries.join(", ")} }}`);
    }
    code = formatTagWithProps("TactileHeading", baseProps);
  } else if (comp === "card") {
    filename = "TactileCard.tsx";
    title = "Tactile Credit Card";
    importName = "TactileCreditCard";
    const changed = getChangedOpticalProps(componentConfigs.card, defaultConfigs.card);
    code = formatTagWithProps("TactileCreditCard", [
      `bankName="TACTILE"`,
      `cardNumber="4829 8102 9412 8042"`,
      `cardHolder="ALEXANDER WRIGHT"`,
      `validThru="08 / 29"`,
      ...changed
    ]);
  } else if (comp === "audio") {
    filename = "TactileAudioPlayer.tsx";
    title = "Tactile Spatial Audio Player";
    importName = "TactileAudioPlayer";
    const changed = getChangedOpticalProps(componentConfigs.audio, defaultConfigs.audio);
    code = formatTagWithProps("TactileAudioPlayer", [
      `defaultTrackIndex={0}`,
      ...changed
    ]);
  } else {
    filename = "TactileBackground.tsx";
    title = "Tactile Background";
    importName = "TactileBackground";
    const changed = getChangedOpticalProps(componentConfigs.background, defaultConfigs.background);
    code = formatTagWithProps("TactileBackground", changed, "<HeroContent />");
  }

  let promptUsageCode = code;
  let componentPropsDoc: string[] = [];

  if (comp === "button") {
    const changed = getChangedOpticalProps(componentConfigs.button, defaultConfigs.button);
    const circleCode = formatTagWithProps(
      "TactileButton",
      [`shape="circle"`, `aria-label="Next"`, ...changed],
      "<ArrowRightIcon />"
    );
    promptUsageCode = `${code}\n\n${circleCode}`;
    componentPropsDoc = [
      `- shape: "pill" | "circle" (default: "pill")`,
      `- onClick, disabled, className, plus all 18 optical & fluid props`
    ];
  } else if (comp === "switch") {
    componentPropsDoc = [
      `- checked, defaultChecked, onChange: (checked: boolean) => void`,
      `- disabled, className, plus all 18 optical props (and *Off counterparts for unchecked state)`
    ];
  } else if (comp === "tabs") {
    componentPropsDoc = [
      `- items: Array<string | { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>`,
      `- value, defaultValue, onChange: (value: string) => void, plus all 18 optical props`
    ];
  } else if (comp === "prompt") {
    componentPropsDoc = [
      `- value, defaultValue, placeholder, onChange: (value: string) => void, onSubmit: (value: string) => void`,
      `- agentLabel, modeLabel, onMentionClick, onAgentClick, onModeClick, plus all 18 optical props`
    ];
  } else if (comp === "heading") {
    const changed = getChangedOpticalProps(componentConfigs.heading, defaultConfigs.heading);
    const wordCode = formatTagWithProps("TactileGlassWord", changed, "Fluid");
    promptUsageCode = `${code}\n\n// Or inline inside an existing heading:\n<h1>\n  Built for ${wordCode} Surfaces\n</h1>`;
    componentPropsDoc = [
      `- title: string, highlight?: string | string[], highlightCycle?: string[], subtitle?: ReactNode`,
      `- level?: "h1" | "h2" | "h3" | "h4" | "div", size?: "sm" | "md" | "lg" | "xl" | "hero", align?: "left" | "center" | "right"`,
      `- wordProps?: Partial<TactileGlassWordProps> (or use <TactileGlassWord> directly with all 18 optical props)`
    ];
  } else if (comp === "card") {
    componentPropsDoc = [
      `- bankName, cardNumber, cardHolder, validThru, tier, showContactless`,
      `- radius (default: 24), tilt3d (default: true), maxTilt (default: 12), plus all 18 optical props`
    ];
  } else if (comp === "audio") {
    componentPropsDoc = [
      `- tracks?: Array<{ title: string; durationSec: number }>`,
      `- defaultTrackIndex, defaultPlaying, onPlayChange, onTrackChange`,
      `- radius (default: 32), tilt3d (default: true), maxTilt (default: 10), plus all 18 optical props`
    ];
  } else {
    componentPropsDoc = [
      `- children?: ReactNode, radius?: number (default: 16), className, style`,
      `- Accepts all 18 optical & fluid props for full-section / hero glass panels`
    ];
  }

  const activeCfgKey = getActiveConfigKey();
  const activeCfg = componentConfigs[activeCfgKey] || componentConfigs.button;
  const activeDef = defaultConfigs[activeCfgKey] || defaultConfigs.button;
  const changedForWrapper = getChangedOpticalProps(activeCfg, activeDef);
  const wrapperCode = formatTagWithProps("TactileGlassFx", changedForWrapper, "<YourComponent />");
  const promptWrapperCode = wrapperCode;
  const promptImports = comp === "heading" ? "TactileHeading, TactileGlassWord" : importName;

  const prompt = [
    `Add the ${title} (${importName}) component from tactile-glass-ui to my React app.`,
    ``,
    `1. Install:`,
    `npm install tactile-glass-ui`,
    ``,
    `2. Usage:`,
    ``,
    `\`\`\`tsx`,
    `import { ${promptImports} } from 'tactile-glass-ui';`,
    ``,
    promptUsageCode,
    `\`\`\``,
    ``,
    `3. Custom surface wrapper (<TactileGlassFx>):`,
    ``,
    `\`\`\`tsx`,
    `import { TactileGlassFx } from 'tactile-glass-ui';`,
    ``,
    promptWrapperCode,
    `\`\`\``,
    ``,
    `4. Props (${importName}):`,
    ...componentPropsDoc,
    ``,
    `5. Integration rules for AI agents (see SKILL.md):`,
    `- Keep all optical prop values exactly as specified above.`,
    `- In Next.js App Router or SSR frameworks, place inside a "use client" component.`,
    `- Never apply CSS border, box-shadow, outline, or opaque background fills to the WebGL glass hull — all refraction, bevels, and chromatic dispersion are rendered by the shared WebGL2 singleton engine.`,
    `- Ensure borderRadius > bevelWidth on rounded containers so inner bevel isolines stay smooth.`,
    `- Design system CSS tokens are bundled automatically when importing from 'tactile-glass-ui'.`
  ].join("\n");

  return { filename, title, importName, code, wrapperCode, prompt };
}

const COMPONENT_META: Record<string, { title: string; subtitle: string }> = {
  button: {
    title: "Tactile Button",
    subtitle:
      "Real-time WebGL2 optical glass capsule and icon button — physical bevel refraction, chromatic dispersion, liquid caustic aura, and interactive cursor shockwaves."
  },
  switch: {
    title: "Tactile Switch",
    subtitle:
      "Dual-state optical glass toggle switch — separate refractive presets for resting and active states with a conformal glowing thumb and fluid surface ripples."
  },
  tabs: {
    title: "Tactile Tabs",
    subtitle:
      "Segmented optical glass navigation bar — smooth spring-driven capsule indicator gliding beneath a continuous refractive glass lens."
  },
  prompt: {
    title: "Prompt Input",
    subtitle:
      "AI agent composer wrapped in a full-surface WebGL2 glass hull — auto-expanding multiline input, mode pills, and perimeter caustic beam."
  },
  heading: {
    title: "Tactile Heading",
    subtitle:
      "Per-glyph 3D optical glass typography — real-time signed distance field (SDF) dome normals, prismatic edge dispersion, and interactive light tracking."
  },
  card: {
    title: "Credit Card",
    subtitle:
      "Interactive 3D perspective glass card — raycast surface tilt projection, frosted backdrop blur, and real-time refraction over a dynamic shimmer background."
  },
  audio: {
    title: "Audio Player",
    subtitle:
      "Spatial glass audio deck with molded transport domes — live Web Audio API synthesis, 70-band frequency spectrum, and interactive timeline scrubbing."
  },
  background: {
    title: "Background",
    subtitle:
      "Full-section optical glass backdrop panel — wide-span perimeter bevel refraction, glowing liquid caustic aura, and interactive cursor ripples for hero sections."
  }
};

function syncCodePanelUI() {
  const { importName, code, wrapperCode } = buildComponentExport(activeComponent);
  const tagNameEl = document.getElementById("component-tag-name");
  if (tagNameEl) {
    tagNameEl.textContent = `<${importName}>`;
  }
  const contentEl = document.getElementById("code-panel-content");
  if (contentEl) {
    contentEl.textContent = code;
  }
  const wrapperEl = document.getElementById("wrapper-panel-content");
  if (wrapperEl) {
    wrapperEl.textContent = wrapperCode;
  }
}

function syncControlsUI() {
  const cfgKey = getActiveConfigKey();
  const cfg = componentConfigs[cfgKey];
  if (!cfg) return;
  controls.forEach((ctrl) => {
    const sl = document.getElementById(ctrl.idSlider) as HTMLInputElement | null;
    const vl = document.getElementById(ctrl.idVal);
    const val = cfg[ctrl.key];
    if (sl && vl && typeof val === "number") {
      sl.value = String(val);
      vl.textContent = val + ctrl.suffix;
    }
  });
  const meta = COMPONENT_META[activeComponent] || COMPONENT_META.button;
  const stageTitleEl = document.getElementById("stage-title");
  const stageSubtitleEl = document.getElementById("stage-subtitle");
  if (stageTitleEl) stageTitleEl.textContent = meta.title;
  if (stageSubtitleEl) stageSubtitleEl.textContent = meta.subtitle;

  const rowSwitchState = document.getElementById("row-switch-state");
  if (rowSwitchState) {
    rowSwitchState.style.display = activeComponent === "switch" ? "flex" : "none";
  }
  if (activeComponent === "switch") {
    updateSwitchStateUI(currentSwitchState);
  }
  syncCodePanelUI();
}

function setSwitchState(isOn: boolean) {
  currentSwitchState = isOn;
  const switches = document.querySelectorAll("#view-switch .tactile-switch");
  switches.forEach((sw) => {
    sw.setAttribute("aria-checked", String(isOn));
    sw.classList.toggle("active", isOn);
  });
  updateSwitchStateUI(isOn);
  syncControlsUI();
}

controls.forEach((ctrl) => {
  const sl = document.getElementById(ctrl.idSlider) as HTMLInputElement | null;
  const vl = document.getElementById(ctrl.idVal);
  if (sl && vl) {
    sl.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const val = parseFloat(target.value);
      const cfgKey = getActiveConfigKey();
      (componentConfigs[cfgKey] as any)[ctrl.key] = val;
      vl.textContent = target.value + ctrl.suffix;
      syncCodePanelUI();
    });
  }
});

// Collapsible Right-Sidebar Settings Panels
const panelHeaders = document.querySelectorAll(".settings-panel .panel-header");
panelHeaders.forEach((headerBtn) => {
  headerBtn.addEventListener("click", () => {
    const panel = headerBtn.closest(".settings-panel");
    if (!panel) return;
    const isCollapsed = panel.getAttribute("data-collapsed") === "true";
    const nextCollapsed = !isCollapsed;
    if (nextCollapsed) {
      panel.setAttribute("data-collapsed", "true");
    } else {
      panel.removeAttribute("data-collapsed");
    }
    headerBtn.setAttribute("aria-expanded", String(!nextCollapsed));
  });
});

function triggerCopyFeedback(
  btn: HTMLElement | null,
  iconCopyId: string,
  iconCheckId: string,
  labelId: string | null,
  defaultText: string,
  copiedText: string,
  timerRef: { id: number | undefined }
) {
  const iconCopy = document.getElementById(iconCopyId);
  const iconCheck = document.getElementById(iconCheckId);
  const label = labelId ? document.getElementById(labelId) : null;
  if (btn) btn.setAttribute("data-copied", "true");
  if (iconCopy) iconCopy.style.display = "none";
  if (iconCheck) iconCheck.style.display = "inline-flex";
  if (label) label.textContent = copiedText;
  if (timerRef.id !== undefined) window.clearTimeout(timerRef.id);
  timerRef.id = window.setTimeout(() => {
    if (btn) btn.removeAttribute("data-copied");
    if (iconCopy) iconCopy.style.display = "inline-flex";
    if (iconCheck) iconCheck.style.display = "none";
    if (label) label.textContent = defaultText;
  }, 1600);
}

const copyPromptTimer = { id: undefined as number | undefined };
const btnCopyPrompt = document.getElementById("btn-copy-prompt");
if (btnCopyPrompt) {
  btnCopyPrompt.addEventListener("click", () => {
    const { prompt } = buildComponentExport(activeComponent);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prompt).catch(() => {});
    }
    triggerCopyFeedback(
      btnCopyPrompt,
      "copy-prompt-icon-copy",
      "copy-prompt-icon-check",
      "copy-prompt-label",
      "Copy Prompt",
      "Copied!",
      copyPromptTimer
    );
  });
}

const copyInstallTimer = { id: undefined as number | undefined };
const btnCopyInstall = document.getElementById("btn-copy-install");
if (btnCopyInstall) {
  btnCopyInstall.addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("npm install tactile-glass-ui").catch(() => {});
    }
    triggerCopyFeedback(
      btnCopyInstall,
      "copy-install-icon-copy",
      "copy-install-icon-check",
      null,
      "",
      "",
      copyInstallTimer
    );
  });
}

const copyCodeTimer = { id: undefined as number | undefined };
const btnCopyCode = document.getElementById("btn-copy-code");
if (btnCopyCode) {
  btnCopyCode.addEventListener("click", () => {
    const { code } = buildComponentExport(activeComponent);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    triggerCopyFeedback(
      btnCopyCode,
      "copy-code-icon-copy",
      "copy-code-icon-check",
      null,
      "",
      "",
      copyCodeTimer
    );
  });
}

const copyWrapperTimer = { id: undefined as number | undefined };
const btnCopyWrapper = document.getElementById("btn-copy-wrapper");
if (btnCopyWrapper) {
  btnCopyWrapper.addEventListener("click", () => {
    const { wrapperCode } = buildComponentExport(activeComponent);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wrapperCode).catch(() => {});
    }
    triggerCopyFeedback(
      btnCopyWrapper,
      "copy-wrapper-icon-copy",
      "copy-wrapper-icon-check",
      null,
      "",
      "",
      copyWrapperTimer
    );
  });
}

const btnDownloadSkill = document.getElementById("btn-download-skill");
if (btnDownloadSkill) {
  btnDownloadSkill.addEventListener("click", () => {
    const blob = new Blob([skillMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SKILL.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// Reset Glass for active component state
const btnResetGlass = document.getElementById("btn-reset-glass");
if (btnResetGlass) {
  btnResetGlass.addEventListener("click", () => {
    const cfgKey = getActiveConfigKey();
    const def = defaultConfigs[cfgKey];
    const cur = componentConfigs[cfgKey];
    const glassKeys: (keyof TactileGlassParams)[] = [
      "refraction",
      "thickness",
      "bevelWidth",
      "frost",
      "dispersion",
      "sheen",
      "angle",
      "darkness",
      "rim"
    ];
    glassKeys.forEach((k) => {
      (cur as any)[k] = def[k];
    });
    syncControlsUI();
  });
}

// Reset Fluid for active component state
const btnResetFluid = document.getElementById("btn-reset-fluid");
if (btnResetFluid) {
  btnResetFluid.addEventListener("click", () => {
    const cfgKey = getActiveConfigKey();
    const def = defaultConfigs[cfgKey];
    const cur = componentConfigs[cfgKey];
    const fluidKeys: (keyof TactileGlassParams)[] = [
      "fluidBright",
      "fluidSpeed",
      "fluidScale",
      "fluidAuraWidth",
      "fluidCenter",
      "auroraFlow"
    ];
    fluidKeys.forEach((k) => {
      (cur as any)[k] = def[k];
    });
    syncControlsUI();
  });
}

// Reset Interactivity for active component state
const btnResetInteract = document.getElementById("btn-reset-interact");
if (btnResetInteract) {
  btnResetInteract.addEventListener("click", () => {
    const cfgKey = getActiveConfigKey();
    const def = defaultConfigs[cfgKey];
    const cur = componentConfigs[cfgKey];
    const interactKeys: (keyof TactileGlassParams)[] = ["hoverBright", "lightTrack", "clickWave"];
    interactKeys.forEach((k) => {
      (cur as any)[k] = def[k];
    });
    syncControlsUI();
  });
}

syncControlsUI();

// View Switching & Component Navigation
const viewButton = document.getElementById("view-button");
const viewSwitch = document.getElementById("view-switch");
const viewTabs = document.getElementById("view-tabs");
const navItems = document.querySelectorAll("#component-nav .nav-item");

function updateTabsIndicator() {
  const container = document.getElementById("lens-tabs");
  const indicator = document.getElementById("tabs-indicator");
  const activeTab = container ? (container.querySelector(".tab-item.active") as HTMLElement | null) : null;
  if (!container || !indicator || !activeTab) return;
  if (activeTab.offsetWidth === 0) return;

  const left = activeTab.offsetLeft;
  const width = activeTab.offsetWidth;
  indicator.style.transform = `translateX(${left}px)`;
  indicator.style.width = `${width}px`;
}

// Interactive 3D Card Tilt Physics State
let cardTiltTarget = { rotX: 0, rotY: 0, scale: 1 };
let cardTiltCurrent = { rotX: 0, rotY: 0, scale: 1 };
let isCardHovered = false;

let cardRestCenter = { cx: 0, cy: 0 };
let cardTextMaskCanvas: HTMLCanvasElement | null = null;
let cardTextMaskCtx: CanvasRenderingContext2D | null = null;
let cardWaveFrameCanvas: HTMLCanvasElement | null = null;
let cardWaveFrameCtx: CanvasRenderingContext2D | null = null;

let cardTextActualWidth = 0;

// Interactive 3D Spatial Audio Player State
let audioTiltTarget = { rotX: 0, rotY: 0, scale: 1 };
let audioTiltCurrent = { rotX: 0, rotY: 0, scale: 1 };
let isAudioHovered = false;
let audioRestCenter = { cx: 0, cy: 0 };

interface AudioTrackItem {
  title: string;
  durationSec: number;
  liked: boolean;
}

const AUDIO_TRACKS: AudioTrackItem[] = [
  {
    title: "Solaris Phase",
    durationSec: 228,
    liked: true
  },
  {
    title: "Obsidian Bloom",
    durationSec: 256,
    liked: false
  },
  {
    title: "Caustic Horizon",
    durationSec: 192,
    liked: true
  }
];

const audioSynth = getSharedAudioSynth();
const audioSpectrumBars = new Float32Array(70);
const audioIdleWaveBars = new Float32Array(70);
const audioIdleGlowBars = new Float32Array(70);

let audioTrackIdx = 0;
let isAudioPlaying = false;
let audioProgress = 0;
let audioLastFrameTime = 0;
let isScrubbingAudio = false;

function formatTimecode(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

function updateAudioRestState(dpr: number) {
  const audioEl = document.getElementById("lens-audio");
  if (!audioEl || !canvas) return;
  const cRect = canvas.getBoundingClientRect();
  const prevTransform = audioEl.style.transform;
  audioEl.style.transform = "none";
  const r = audioEl.getBoundingClientRect();
  audioEl.style.transform = prevTransform;
  if (r.width > 0 && r.height > 0) {
    audioRestCenter = {
      cx: Math.round((r.left - cRect.left + r.width * 0.5) * dpr),
      cy: Math.round((r.top - cRect.top + r.height * 0.5) * dpr)
    };
    const scale = Math.min(1, r.width / 480);
    audioEl.style.setProperty("--audio-scale", scale.toFixed(4));
  }
}

function syncAudioDOM() {
  const tr = AUDIO_TRACKS[audioTrackIdx];
  const titleEl = document.getElementById("audio-track-title");
  const likeBtn = document.getElementById("audio-btn-like");
  const iconPause = document.getElementById("audio-icon-pause");
  const iconPlay = document.getElementById("audio-icon-play");
  const playBtn = document.getElementById("audio-btn-play");
  const fillEl = document.getElementById("audio-progress-fill");
  const hitEl = document.getElementById("audio-progress-hit");
  const curTimeEl = document.getElementById("audio-time-current");
  const totTimeEl = document.getElementById("audio-time-total");

  if (titleEl) titleEl.textContent = tr.title;
  if (likeBtn) {
    likeBtn.setAttribute("aria-pressed", String(tr.liked));
  }
  if (iconPause) iconPause.style.display = isAudioPlaying ? "inline-flex" : "none";
  if (iconPlay) iconPlay.style.display = isAudioPlaying ? "none" : "inline-flex";
  if (playBtn) playBtn.setAttribute("aria-label", isAudioPlaying ? "Pause playback" : "Start playback");

  const pct = `${(audioProgress * 100).toFixed(1)}%`;
  if (fillEl) fillEl.style.width = pct;
  if (hitEl) hitEl.setAttribute("aria-valuenow", String(Math.round(audioProgress * 100)));
  const elapsed = audioProgress * tr.durationSec;
  const remaining = Math.max(0, tr.durationSec - elapsed);
  if (curTimeEl) curTimeEl.textContent = formatTimecode(elapsed);
  if (totTimeEl) totTimeEl.textContent = `-${formatTimecode(remaining)}`;
}

function updateCardRestState(dpr: number) {
  const cardEl = document.getElementById("lens-card");
  if (!cardEl || !canvas) return;
  const cRect = canvas.getBoundingClientRect();
  const prevTransform = cardEl.style.transform;
  cardEl.style.transform = "none";
  const r = cardEl.getBoundingClientRect();
  cardEl.style.transform = prevTransform;
  const cardScale = r.width > 0 ? Math.min(1, r.width / 444) : 1;
  if (canvas.width > 0 && canvas.height > 0) {
    cardRestCenter = {
      cx: Math.round(canvas.width * 0.5),
      cy: Math.round(canvas.height * 0.5)
    };
  } else if (r.width > 0 && r.height > 0) {
    cardRestCenter = {
      cx: Math.round((r.left - cRect.left + r.width * 0.5) * dpr),
      cy: Math.round((r.top - cRect.top + r.height * 0.5) * dpr)
    };
  }

  // Pre-render static text mask once with generous margins (rock-solid, zero subpixel jitter, zero clipping)
  const patchW = Math.ceil(1100 * dpr);
  const patchH = Math.ceil(380 * dpr);

  if (!cardTextMaskCanvas) {
    cardTextMaskCanvas = document.createElement("canvas");
    cardTextMaskCtx = cardTextMaskCanvas.getContext("2d");
  }
  cardTextMaskCanvas.width = patchW;
  cardTextMaskCanvas.height = patchH;

  const mCtx = cardTextMaskCtx;
  if (mCtx) {
    mCtx.clearRect(0, 0, patchW, patchH);
    mCtx.save();
    mCtx.textAlign = "left";
    mCtx.textBaseline = "alphabetic";

    const fontSize = Math.round(260 * cardScale * dpr);
    mCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif`;
    if ("letterSpacing" in mCtx) {
      mCtx.letterSpacing = "-0.07em";
    }

    const metrics = mCtx.measureText("LIQUID");
    const left = metrics.actualBoundingBoxLeft ?? 0;
    const right = metrics.actualBoundingBoxRight ?? metrics.width;
    const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.72;
    const descent = metrics.actualBoundingBoxDescent ?? 0;

    cardTextActualWidth = left + right;

    const drawX = Math.round(patchW * 0.5 - (right - left) * 0.5);
    const drawY = Math.round(patchH * 0.5 + (ascent - descent) * 0.5);

    mCtx.fillStyle = "#ffffff";
    mCtx.fillText("LIQUID", drawX, drawY);
    mCtx.restore();
  }
}

function switchComponent(comp: string) {
  activeComponent = comp;
  try {
    localStorage.setItem("tactile_active_tab", comp);
  } catch {
    // ignore
  }

  if (comp !== "card") {
    isCardHovered = false;
    cardTiltTarget = { rotX: 0, rotY: 0, scale: 1 };
    cardTiltCurrent = { rotX: 0, rotY: 0, scale: 1 };
    const card = document.getElementById("lens-card");
    if (card) card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  if (comp !== "audio") {
    isAudioHovered = false;
    isScrubbingAudio = false;
    audioTiltTarget = { rotX: 0, rotY: 0, scale: 1 };
    audioTiltCurrent = { rotX: 0, rotY: 0, scale: 1 };
    const audioEl = document.getElementById("lens-audio");
    if (audioEl) audioEl.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    if (isAudioPlaying) {
      isAudioPlaying = false;
      audioSynth.setPlaying(false);
      syncAudioDOM();
    }
  }

  navItems.forEach((btn) => {
    if (btn.getAttribute("data-component") === comp) {
      btn.classList.add("active");
      if (window.innerWidth <= 900 && "scrollIntoView" in btn) {
        (btn as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    } else {
      btn.classList.remove("active");
    }
  });

  const viewPrompt = document.getElementById("view-prompt");
  const viewHeading = document.getElementById("view-heading");
  const viewCard = document.getElementById("view-card");
  const viewAudio = document.getElementById("view-audio");
  const viewBackground = document.getElementById("view-background");
  if (viewButton) viewButton.classList.toggle("active", comp === "button");
  if (viewSwitch) viewSwitch.classList.toggle("active", comp === "switch");
  if (viewTabs) viewTabs.classList.toggle("active", comp === "tabs");
  if (viewPrompt) viewPrompt.classList.toggle("active", comp === "prompt");
  if (viewHeading) viewHeading.classList.toggle("active", comp === "heading");
  if (viewCard) viewCard.classList.toggle("active", comp === "card");
  if (viewAudio) viewAudio.classList.toggle("active", comp === "audio");
  if (viewBackground) viewBackground.classList.toggle("active", comp === "background");

  if (stage) {
    stage.resetPointer();
    stage.resize();
  }
  if (comp === "tabs") {
    requestAnimationFrame(updateTabsIndicator);
  }
  if (comp === "card") {
    updateCardRestState(Math.min(window.devicePixelRatio || 1, 2));
  }
  if (comp === "audio") {
    updateAudioRestState(Math.min(window.devicePixelRatio || 1, 2));
    syncAudioDOM();
  }
  syncControlsUI();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const comp = item.getAttribute("data-component");
    if (comp) switchComponent(comp);
  });
});

const tabButtons = document.querySelectorAll("#lens-tabs .tab-item");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    updateTabsIndicator();
  });
});

if (typeof ResizeObserver !== "undefined") {
  const tabsRo = new ResizeObserver(() => {
    updateTabsIndicator();
  });
  const tabsEl = document.getElementById("lens-tabs");
  if (tabsEl) {
    tabsRo.observe(tabsEl);
    tabButtons.forEach((btn) => tabsRo.observe(btn));
  }
}


// Initialize with saved tab or default to button
switchComponent(activeComponent);

// Tactile Switch Toggling
const btnStateOff = document.getElementById("btn-state-off");
const btnStateOn = document.getElementById("btn-state-on");
if (btnStateOff) {
  btnStateOff.addEventListener("click", () => setSwitchState(false));
}
if (btnStateOn) {
  btnStateOn.addEventListener("click", () => setSwitchState(true));
}

function setupSwitchToggle(switchId: string) {
  const sw = document.getElementById(switchId);
  if (!sw) return;

  function toggle() {
    const isChecked = sw?.getAttribute("aria-checked") === "true";
    setSwitchState(!isChecked);
  }

  sw.addEventListener("click", toggle);
  sw.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  });
}

setupSwitchToggle("switch-xl");

// Prompt Input Interactivity
const promptInput = document.getElementById("prompt-input") as HTMLTextAreaElement | null;
if (promptInput) {
  promptInput.addEventListener("input", () => {
    promptInput.style.height = "auto";
    promptInput.style.height = `${promptInput.scrollHeight}px`;
  });
  promptInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const submitBtn = document.getElementById("prompt-submit-btn");
      if (submitBtn) submitBtn.click();
    }
  });
}

const promptSubmitBtn = document.getElementById("prompt-submit-btn");
if (promptSubmitBtn) {
  promptSubmitBtn.addEventListener("click", () => {
    if (!promptInput || !promptInput.value.trim()) return;
    promptInput.value = "";
    promptInput.style.height = "auto";
  });
}

const promptMentionBtn = document.getElementById("prompt-mention-btn");
if (promptMentionBtn && promptInput) {
  promptMentionBtn.addEventListener("click", () => {
    promptInput.focus();
  });
}

const agentPill = document.getElementById("prompt-agent-pill");
if (agentPill) {
  const agentModes = [
    { label: "Agent", placeholder: "Ask anything, @ to mention, / for actions" },
    { label: "Plan", placeholder: "Plan architecture, @ to mention, / for actions" },
    { label: "Ask", placeholder: "Ask a question, @ to mention, / for actions" }
  ];
  let agentIdx = 0;
  agentPill.addEventListener("click", () => {
    agentIdx = (agentIdx + 1) % agentModes.length;
    const next = agentModes[agentIdx];
    const label = agentPill.querySelector(".prompt-pill-label");
    if (label) label.textContent = next.label;
    if (promptInput) promptInput.placeholder = next.placeholder;
  });
}

// Tactile Fluid Glass Typography Word
const headingWordEl = document.getElementById("lens-heading-word");
if (headingWordEl) {
  const cycleWords = ["Fluid", "Liquid", "Adaptive", "Tactile"];
  const initialText = headingWordEl.textContent?.trim() || "";
  const initialIdx = cycleWords.indexOf(initialText);
  let wordIdx = initialIdx >= 0 ? initialIdx : 0;
  headingWordEl.addEventListener("click", () => {
    wordIdx = (wordIdx + 1) % cycleWords.length;
    headingWordEl.textContent = cycleWords[wordIdx];
  });
}

// Tactile Spatial Audio Player Transport & Timeline Interactivity
const audioBtnPlay = document.getElementById("audio-btn-play");
const audioBtnPrev = document.getElementById("audio-btn-prev");
const audioBtnNext = document.getElementById("audio-btn-next");
const audioBtnLike = document.getElementById("audio-btn-like");
const audioProgressHit = document.getElementById("audio-progress-hit");

if (audioBtnLike) {
  audioBtnLike.addEventListener("click", () => {
    AUDIO_TRACKS[audioTrackIdx].liked = !AUDIO_TRACKS[audioTrackIdx].liked;
    syncAudioDOM();
  });
}

if (audioBtnPlay) {
  audioBtnPlay.addEventListener("click", () => {
    isAudioPlaying = !isAudioPlaying;
    audioSynth.setTrack(audioTrackIdx);
    audioSynth.seek(audioProgress);
    audioSynth.setPlaying(isAudioPlaying);
    syncAudioDOM();
  });
}

if (audioBtnPrev) {
  audioBtnPrev.addEventListener("click", () => {
    audioTrackIdx = (audioTrackIdx - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    audioProgress = 0;
    isAudioPlaying = true;
    audioSynth.seek(audioProgress);
    audioSynth.setTrack(audioTrackIdx);
    audioSynth.setPlaying(true);
    syncAudioDOM();
  });
}

if (audioBtnNext) {
  audioBtnNext.addEventListener("click", () => {
    audioTrackIdx = (audioTrackIdx + 1) % AUDIO_TRACKS.length;
    audioProgress = 0;
    isAudioPlaying = true;
    audioSynth.seek(audioProgress);
    audioSynth.setTrack(audioTrackIdx);
    audioSynth.setPlaying(true);
    syncAudioDOM();
  });
}

if (audioProgressHit) {
  const scrubToClientX = (clientX: number) => {
    const r = audioProgressHit.getBoundingClientRect();
    if (r.width <= 0) return;
    audioProgress = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    audioSynth.seek(audioProgress);
    syncAudioDOM();
  };

  audioProgressHit.addEventListener("pointerdown", (e: PointerEvent) => {
    e.stopPropagation();
    isScrubbingAudio = true;
    audioTiltTarget.rotX = 0;
    audioTiltTarget.rotY = 0;
    audioTiltTarget.scale = 1.0;
    try {
      audioProgressHit.setPointerCapture(e.pointerId);
    } catch {
      // ignore synthetic events without active pointerId
    }
    scrubToClientX(e.clientX);
  });

  audioProgressHit.addEventListener("pointermove", (e: PointerEvent) => {
    if (isScrubbingAudio) {
      e.stopPropagation();
      scrubToClientX(e.clientX);
    }
  });

  const endScrub = (e: PointerEvent) => {
    if (isScrubbingAudio) {
      isScrubbingAudio = false;
      try {
        if (audioProgressHit.hasPointerCapture(e.pointerId)) {
          audioProgressHit.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
  };

  audioProgressHit.addEventListener("pointerup", endScrub);
  audioProgressHit.addEventListener("pointercancel", endScrub);
  audioProgressHit.addEventListener("lostpointercapture", () => {
    isScrubbingAudio = false;
  });

  audioProgressHit.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    scrubToClientX(e.clientX);
  });

  audioProgressHit.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      audioProgress = Math.max(0, audioProgress - 0.05);
      audioSynth.seek(audioProgress);
      syncAudioDOM();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      audioProgress = Math.min(1, audioProgress + 0.05);
      audioSynth.seek(audioProgress);
      syncAudioDOM();
    }
  });
}

// Initialize Tactile Glass Engine Stage from source TypeScript module
stage = new TactileGlassStage(canvas, {
  getTargets: (): (StageTargetInfo | null | undefined)[] => {
    if (activeComponent === "button") {
      return [
        { element: lensBtn, params: componentConfigs.button },
        { element: lensBtnCircle, isCircle: true, params: componentConfigs.button }
      ];
    } else if (activeComponent === "switch") {
      const switches = Array.from(document.querySelectorAll("#view-switch .tactile-switch")) as HTMLElement[];
      return switches.map((sw) => {
        const isSwOn = sw.getAttribute("aria-checked") === "true";
        return {
          element: sw,
          params: isSwOn ? componentConfigs.switch_on : componentConfigs.switch_off
        };
      });
    } else if (activeComponent === "tabs") {
      const tabsEl = document.getElementById("lens-tabs");
      return tabsEl
        ? [
            {
              element: tabsEl,
              params: componentConfigs.tabs
            }
          ]
        : [];
    } else if (activeComponent === "prompt") {
      const promptEl = document.getElementById("lens-prompt");
      return promptEl
        ? [
            {
              element: promptEl,
              params: componentConfigs.prompt
            }
          ]
        : [];
    } else if (activeComponent === "heading") {
      const wordEl = document.getElementById("lens-heading-word");
      return wordEl
        ? [
            {
              element: wordEl,
              isText: true,
              params: componentConfigs.heading
            }
          ]
        : [];
    } else if (activeComponent === "card") {
      const cardEl = document.getElementById("lens-card");
      return cardEl
        ? [
            {
              element: cardEl,
              params: componentConfigs.card,
              tilt: {
                rotX: cardTiltCurrent.rotX,
                rotY: cardTiltCurrent.rotY,
                scale: cardTiltCurrent.scale,
                focalLength: 1000
              }
            }
          ]
        : [];
    } else if (activeComponent === "audio") {
      const audioEl = document.getElementById("lens-audio");
      return audioEl
        ? [
            {
              element: audioEl,
              isAudioDeck: true,
              params: componentConfigs.audio,
              tilt: {
                rotX: audioTiltCurrent.rotX,
                rotY: audioTiltCurrent.rotY,
                scale: audioTiltCurrent.scale,
                focalLength: 1000
              }
            }
          ]
        : [];
    } else if (activeComponent === "background") {
      const bgEl = document.getElementById("lens-background");
      return bgEl
        ? [
            {
              element: bgEl,
              params: componentConfigs.background
            }
          ]
        : [];
    }
    return [];
  },
  onResize: () => {
    updateTabsIndicator();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    updateCardRestState(dpr);
    updateAudioRestState(dpr);
  },
  getBackgroundDirtyRect: () => {
    if (!canvas) return null;
    if (activeComponent !== "card" && activeComponent !== "audio") return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxW = canvas.width || Math.round(window.innerWidth * dpr);
    const maxH = canvas.height || Math.round(window.innerHeight * dpr);

    if (activeComponent === "audio") {
      if (audioRestCenter.cx === 0 && audioRestCenter.cy === 0) {
        updateAudioRestState(dpr);
      }
      const patchW = Math.ceil(560 * dpr);
      const patchH = Math.ceil(420 * dpr);
      const left = Math.floor(audioRestCenter.cx - patchW * 0.5);
      const top = Math.floor(audioRestCenter.cy - patchH * 0.5);
      const right = left + patchW;
      const bottom = top + patchH;
      const clampedLeft = Math.max(0, left);
      const clampedTop = Math.max(0, top);
      const clampedRight = Math.min(maxW, right);
      const clampedBottom = Math.min(maxH, bottom);
      return {
        x: clampedLeft,
        y: clampedTop,
        width: Math.max(0, clampedRight - clampedLeft),
        height: Math.max(0, clampedBottom - clampedTop)
      };
    }

    if (cardRestCenter.cx === 0 && cardRestCenter.cy === 0) {
      updateCardRestState(dpr);
    }
    const textWidth = Math.ceil(1100 * dpr);
    const textHeight = Math.ceil(380 * dpr);
    const left = Math.floor(cardRestCenter.cx - textWidth * 0.5);
    const top = Math.floor(cardRestCenter.cy - textHeight * 0.5);
    const right = left + textWidth;
    const bottom = top + textHeight;
    const clampedLeft = Math.max(0, left);
    const clampedTop = Math.max(0, top);
    const clampedRight = Math.min(maxW, right);
    const clampedBottom = Math.min(maxH, bottom);
    const width = Math.max(0, clampedRight - clampedLeft);
    const height = Math.max(0, clampedBottom - clampedTop);
    return { x: clampedLeft, y: clampedTop, width, height };
  },
  isBackgroundDynamic: () => {
    return activeComponent === "card" || activeComponent === "audio";
  },
  drawBackground: (bgCtx, width, height, dpr, time = 0, offsetX = 0, offsetY = 0) => {
    if (activeComponent === "audio") {
      if (audioRestCenter.cx === 0 && audioRestCenter.cy === 0) {
        updateAudioRestState(dpr);
      }

      const dt = audioLastFrameTime > 0 ? Math.max(0, Math.min(0.1, time - audioLastFrameTime)) : 1 / 60;
      audioLastFrameTime = time;

      if (isAudioPlaying && !isScrubbingAudio) {
        const tr = AUDIO_TRACKS[audioTrackIdx];
        audioProgress += dt / Math.max(1, tr.durationSec);
        if (audioProgress >= 1) {
          audioProgress = 0;
          audioSynth.seek(0);
          if (!tr.liked) {
            audioTrackIdx = (audioTrackIdx + 1) % AUDIO_TRACKS.length;
            audioSynth.setTrack(audioTrackIdx);
          }
          syncAudioDOM();
        } else {
          const fillEl = document.getElementById("audio-progress-fill");
          const curTimeEl = document.getElementById("audio-time-current");
          const totTimeEl = document.getElementById("audio-time-total");
          const pct = `${(audioProgress * 100).toFixed(1)}%`;
          if (fillEl) fillEl.style.width = pct;
          const elapsed = audioProgress * tr.durationSec;
          const remaining = Math.max(0, tr.durationSec - elapsed);
          if (curTimeEl) curTimeEl.textContent = formatTimecode(elapsed);
          if (totTimeEl) totTimeEl.textContent = `-${formatTimecode(remaining)}`;
        }
      }

      // Symmetrical Thin Vertical White Spectrum Lines spanning full inner content width (416px)
      // 70 bars = 69 intervals * 6px exact step = 414px + 2px bar = 416px (100% uniform integer pixel step & gap)
      const barCount = 70;
      const barW = Math.max(1, Math.round(1.5 * dpr));

      audioSynth.getSpectrumBars(barCount, audioSpectrumBars, time);
      audioSynth.getIdleWaveBars(barCount, audioIdleWaveBars, time, audioIdleGlowBars);

      const frontCanvas = document.getElementById("audio-spectrum-front") as HTMLCanvasElement | null;
      if (frontCanvas) {
        const cssW = frontCanvas.clientWidth || 480;
        const cssH = frontCanvas.clientHeight || 304;
        const cardW = Math.round(cssW * dpr);
        const cardH = Math.round(cssH * dpr);
        if (frontCanvas.width !== cardW || frontCanvas.height !== cardH) {
          frontCanvas.width = cardW;
          frontCanvas.height = cardH;
        }
        const fgCtx = frontCanvas.getContext("2d");
        if (fgCtx) {
          fgCtx.clearRect(0, 0, cardW, cardH);
          const stepPx = Math.max(2, Math.round(6 * (cssW / 480) * dpr));
          const totalSpan = (barCount - 1) * stepPx + barW;
          const startX = Math.round((cardW - totalSpan) * 0.5);
          const fgWaveCy = Math.round((146 / 304) * cardH);
          const scaleY = (cssH / 304) * dpr;
          const baseDotH = Math.max(2, Math.round(2 * scaleY));

          for (let i = 0; i < barCount; i++) {
            const x0 = startX + i * stepPx;
            const level = audioSpectrumBars[i];
            const signedIdle = audioIdleWaveBars[i];
            const glow = Math.min(1, Math.max(audioIdleGlowBars[i], level * 2.5));
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
        }
      }

      return;
    }

    if (activeComponent === "card") {
      if ((cardRestCenter.cx === 0 && cardRestCenter.cy === 0) || !cardTextMaskCanvas) {
        updateCardRestState(dpr);
      }
      if (!cardTextMaskCanvas) return;

      if (!cardWaveFrameCanvas) {
        cardWaveFrameCanvas = document.createElement("canvas");
        cardWaveFrameCtx = cardWaveFrameCanvas.getContext("2d");
      }
      if (cardWaveFrameCanvas.width !== width || cardWaveFrameCanvas.height !== height) {
        cardWaveFrameCanvas.width = width;
        cardWaveFrameCanvas.height = height;
      }
      const wCtx = cardWaveFrameCtx;
      if (!wCtx) return;

      wCtx.clearRect(0, 0, width, height);

      // 1. Draw static text mask at 100% frozen location (never moves with card tilt)
      const textMaskLeft = Math.floor(cardRestCenter.cx - cardTextMaskCanvas.width * 0.5);
      const textMaskTop = Math.floor(cardRestCenter.cy - cardTextMaskCanvas.height * 0.5);
      const destX = textMaskLeft - offsetX;
      const destY = textMaskTop - offsetY;

      wCtx.drawImage(cardTextMaskCanvas, destX, destY);

      // 2. Composite shimmer gradient strictly into text mask
      wCtx.save();
      wCtx.globalCompositeOperation = "source-in";

      const textW = cardTextActualWidth || (cardTextMaskCanvas.width * 0.82);
      const textCenterX = destX + cardTextMaskCanvas.width * 0.5;
      const textLeft = textCenterX - textW * 0.5;
      const textCenterY = destY + cardTextMaskCanvas.height * 0.5;

      const duration = 2.0;
      const progress = ((time % duration) + duration) % duration / duration;

      const bandWidth = 4.0 * textW;
      const bgOffset = -3.0 * textW * (1.0 - progress);
      const gradStart = textLeft + bgOffset;
      const gradEnd = gradStart + bandWidth;

      const grad = wCtx.createLinearGradient(gradStart, textCenterY, gradEnd, textCenterY);
      const baseColor = "rgba(255, 255, 255, 0.12)";
      const highlightColor = "rgba(255, 255, 255, 0.96)";

      grad.addColorStop(0.0, baseColor);
      grad.addColorStop(0.40, baseColor);
      grad.addColorStop(0.50, highlightColor);
      grad.addColorStop(0.60, baseColor);
      grad.addColorStop(1.0, baseColor);

      wCtx.fillStyle = grad;
      wCtx.fillRect(0, 0, width, height);
      wCtx.restore();

      // 3. Render into target background context
      bgCtx.drawImage(cardWaveFrameCanvas, 0, 0);
      return;
    }

    if (activeComponent === "background") {
      bgCtx.save();
      const fontSize = Math.round(Math.min(112 * dpr, width * 0.14));
      bgCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", sans-serif`;
      if ("letterSpacing" in bgCtx) {
        bgCtx.letterSpacing = "-0.03em";
      }
      bgCtx.textAlign = "left";
      bgCtx.textBaseline = "alphabetic";
      const metrics = bgCtx.measureText("Background");
      const left = metrics.actualBoundingBoxLeft ?? 0;
      const right = metrics.actualBoundingBoxRight ?? metrics.width;
      const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.72;
      const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.18;
      const drawX = Math.round(width * 0.5 - (right - left) * 0.5 - offsetX);
      const drawY = Math.round(height * 0.5 + (ascent - descent) * 0.5 - offsetY);
      bgCtx.fillStyle = "rgba(255, 255, 255, 0.92)";
      bgCtx.fillText("Background", drawX, drawY);
      bgCtx.restore();
    }
  }
});

if (stage) {
  stage.attachPointer(lensBtn);
  if (lensBtnCircle) stage.attachPointer(lensBtnCircle);
  ["switch-xl"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) stage?.attachPointer(el);
  });
  const lensTabs = document.getElementById("lens-tabs");
  if (lensTabs) stage.attachPointer(lensTabs);
  const lensPrompt = document.getElementById("lens-prompt");
  if (lensPrompt) stage.attachPointer(lensPrompt);
  if (headingWordEl) stage.attachPointer(headingWordEl);
  const lensCard = document.getElementById("lens-card");
  if (lensCard) stage.attachPointer(lensCard);
  const lensAudio = document.getElementById("lens-audio");
  if (lensAudio) stage.attachPointer(lensAudio);
  const lensBackground = document.getElementById("lens-background");
  if (lensBackground) stage.attachPointer(lensBackground);
}

// 3D Perspective Tilt on Hover for Credit Card
const lensCardEl = document.getElementById("lens-card");
const viewCardEl = document.getElementById("view-card");

if (lensCardEl && viewCardEl) {
  let cardRestBounds = { cx: 0, cy: 0, w: 444, h: 280 };
  let cardTiltRaf: number | null = null;

  function updateCardRestBounds() {
    if (!viewCardEl || !lensCardEl) return;
    const pr = viewCardEl.getBoundingClientRect();
    cardRestBounds.cx = pr.left + pr.width * 0.5;
    cardRestBounds.cy = pr.top + pr.height * 0.5;
    cardRestBounds.w = lensCardEl.offsetWidth || 444;
    cardRestBounds.h = lensCardEl.offsetHeight || 280;
  }

  window.addEventListener("resize", updateCardRestBounds);
  updateCardRestBounds();

  function startCardTiltLoop() {
    if (cardTiltRaf === null) {
      cardTiltRaf = requestAnimationFrame(updateCardTiltLoop);
    }
  }

  function handleCardPointer(e: PointerEvent) {
    updateCardRestBounds();
    const halfW = cardRestBounds.w * 0.5;
    const halfH = cardRestBounds.h * 0.5;
    const px = Math.max(-1, Math.min(1, (e.clientX - cardRestBounds.cx) / halfW));
    const py = Math.max(-1, Math.min(1, (e.clientY - cardRestBounds.cy) / halfH));

    const maxTilt = 10; // degrees
    cardTiltTarget.rotX = -py * maxTilt;
    cardTiltTarget.rotY = px * maxTilt;
    cardTiltTarget.scale = 1.025;
    startCardTiltLoop();
  }

  function releaseCardTilt() {
    isCardHovered = false;
    cardTiltTarget.rotX = 0;
    cardTiltTarget.rotY = 0;
    cardTiltTarget.scale = 1.0;
    startCardTiltLoop();
  }

  lensCardEl.addEventListener("pointerenter", (e: PointerEvent) => {
    updateCardRestBounds();
    isCardHovered = true;
    handleCardPointer(e);
  });

  lensCardEl.addEventListener("pointermove", (e: PointerEvent) => {
    if (isCardHovered) {
      handleCardPointer(e);
    }
  });

  lensCardEl.addEventListener("pointerleave", releaseCardTilt);
  lensCardEl.addEventListener("pointercancel", releaseCardTilt);
  lensCardEl.addEventListener("pointerup", (e: PointerEvent) => {
    if (e.pointerType === "touch") {
      releaseCardTilt();
    }
  });

  function updateCardTiltLoop() {
    // Ultra-smooth damping: 0.1 on hover, 0.07 on release for a gentle glide to rest
    const lerp = isCardHovered ? 0.1 : 0.07;
    cardTiltCurrent.rotX += (cardTiltTarget.rotX - cardTiltCurrent.rotX) * lerp;
    cardTiltCurrent.rotY += (cardTiltTarget.rotY - cardTiltCurrent.rotY) * lerp;
    cardTiltCurrent.scale += (cardTiltTarget.scale - cardTiltCurrent.scale) * lerp;

    const isStillMoving =
      Math.abs(cardTiltTarget.rotX - cardTiltCurrent.rotX) > 0.002 ||
      Math.abs(cardTiltTarget.rotY - cardTiltCurrent.rotY) > 0.002 ||
      Math.abs(cardTiltTarget.scale - cardTiltCurrent.scale) > 0.0005;

    if (lensCardEl) {
      if (
        Math.abs(cardTiltCurrent.rotX) > 0.002 ||
        Math.abs(cardTiltCurrent.rotY) > 0.002 ||
        Math.abs(cardTiltCurrent.scale - 1) > 0.0005
      ) {
        lensCardEl.style.transform = `rotateX(${cardTiltCurrent.rotX.toFixed(3)}deg) rotateY(${cardTiltCurrent.rotY.toFixed(3)}deg) scale3d(${cardTiltCurrent.scale.toFixed(4)}, ${cardTiltCurrent.scale.toFixed(4)}, ${cardTiltCurrent.scale.toFixed(4)})`;
      } else {
        cardTiltCurrent.rotX = 0;
        cardTiltCurrent.rotY = 0;
        cardTiltCurrent.scale = 1;
        lensCardEl.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
    }

    if (isCardHovered || isStillMoving) {
      cardTiltRaf = requestAnimationFrame(updateCardTiltLoop);
    } else {
      cardTiltRaf = null;
    }
  }
}

// 3D Perspective Tilt on Hover for Spatial Audio Player
const lensAudioEl = document.getElementById("lens-audio");
const viewAudioEl = document.getElementById("view-audio");

if (lensAudioEl && viewAudioEl) {
  let audioRestBounds = { cx: 0, cy: 0, w: 480, h: 304 };
  let audioTiltRaf: number | null = null;

  function updateAudioRestBounds() {
    if (!viewAudioEl || !lensAudioEl) return;
    const pr = viewAudioEl.getBoundingClientRect();
    audioRestBounds.cx = pr.left + pr.width * 0.5;
    audioRestBounds.cy = pr.top + pr.height * 0.5;
    audioRestBounds.w = lensAudioEl.offsetWidth || 480;
    audioRestBounds.h = lensAudioEl.offsetHeight || 304;
  }

  window.addEventListener("resize", updateAudioRestBounds);
  updateAudioRestBounds();

  function startAudioTiltLoop() {
    if (audioTiltRaf === null) {
      audioTiltRaf = requestAnimationFrame(updateAudioTiltLoop);
    }
  }

  function handleAudioPointer(e: PointerEvent) {
    if (
      isScrubbingAudio ||
      (e.target instanceof Element &&
        e.target.closest(".audio-controls-dock, .audio-timeline-group, .audio-like-btn"))
    ) {
      audioTiltTarget.rotX = 0;
      audioTiltTarget.rotY = 0;
      audioTiltTarget.scale = 1.0;
      startAudioTiltLoop();
      return;
    }
    updateAudioRestBounds();
    const halfW = audioRestBounds.w * 0.5;
    const halfH = audioRestBounds.h * 0.5;
    const px = Math.max(-1, Math.min(1, (e.clientX - audioRestBounds.cx) / halfW));
    const py = Math.max(-1, Math.min(1, (e.clientY - audioRestBounds.cy) / halfH));

    const maxTilt = 10; // degrees
    audioTiltTarget.rotX = -py * maxTilt;
    audioTiltTarget.rotY = px * maxTilt;
    audioTiltTarget.scale = 1.025;
    startAudioTiltLoop();
  }

  function releaseAudioTilt() {
    isAudioHovered = false;
    audioTiltTarget.rotX = 0;
    audioTiltTarget.rotY = 0;
    audioTiltTarget.scale = 1.0;
    startAudioTiltLoop();
  }

  lensAudioEl.addEventListener("pointerenter", (e: PointerEvent) => {
    updateAudioRestBounds();
    isAudioHovered = true;
    handleAudioPointer(e);
  });

  lensAudioEl.addEventListener("pointermove", (e: PointerEvent) => {
    if (isAudioHovered) {
      handleAudioPointer(e);
    }
  });

  lensAudioEl.addEventListener("pointerleave", releaseAudioTilt);
  lensAudioEl.addEventListener("pointercancel", releaseAudioTilt);
  lensAudioEl.addEventListener("pointerup", (e: PointerEvent) => {
    if (e.pointerType === "touch") {
      releaseAudioTilt();
    }
  });

  function updateAudioTiltLoop() {
    const lerp = isAudioHovered ? 0.1 : 0.07;
    audioTiltCurrent.rotX += (audioTiltTarget.rotX - audioTiltCurrent.rotX) * lerp;
    audioTiltCurrent.rotY += (audioTiltTarget.rotY - audioTiltCurrent.rotY) * lerp;
    audioTiltCurrent.scale += (audioTiltTarget.scale - audioTiltCurrent.scale) * lerp;

    const isStillMoving =
      Math.abs(audioTiltTarget.rotX - audioTiltCurrent.rotX) > 0.002 ||
      Math.abs(audioTiltTarget.rotY - audioTiltCurrent.rotY) > 0.002 ||
      Math.abs(audioTiltTarget.scale - audioTiltCurrent.scale) > 0.0005;

    if (lensAudioEl) {
      if (
        Math.abs(audioTiltCurrent.rotX) > 0.002 ||
        Math.abs(audioTiltCurrent.rotY) > 0.002 ||
        Math.abs(audioTiltCurrent.scale - 1) > 0.0005
      ) {
        lensAudioEl.style.transform = `perspective(1000px) rotateX(${audioTiltCurrent.rotX.toFixed(3)}deg) rotateY(${audioTiltCurrent.rotY.toFixed(3)}deg) scale3d(${audioTiltCurrent.scale.toFixed(4)}, ${audioTiltCurrent.scale.toFixed(4)}, ${audioTiltCurrent.scale.toFixed(4)})`;
      } else {
        audioTiltCurrent.rotX = 0;
        audioTiltCurrent.rotY = 0;
        audioTiltCurrent.scale = 1;
        lensAudioEl.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
    }

    if (isAudioHovered || isStillMoving) {
      audioTiltRaf = requestAnimationFrame(updateAudioTiltLoop);
    } else {
      audioTiltRaf = null;
    }
  }
}

// Header Brand Badge WebGL Glass Hull
const brandBadgeEl = document.querySelector(".brand-badge") as HTMLElement | null;
if (brandBadgeEl) {
  const engine = getSharedCausticEngine();
  if (engine) {
    const badgeCanvas = document.createElement("canvas");
    badgeCanvas.setAttribute("aria-hidden", "true");
    badgeCanvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;z-index:-1;";
    brandBadgeEl.prepend(badgeCanvas);
    const ctx = badgeCanvas.getContext("2d");
    const r0 = brandBadgeEl.getBoundingClientRect();
    const dpr0 = Math.min(window.devicePixelRatio || 1, 2);
    badgeCanvas.width = Math.max(1, Math.round(r0.width * dpr0));
    badgeCanvas.height = Math.max(1, Math.round(r0.height * dpr0));
    if (ctx) {
      const badgeParams: TactileGlassParams = {
        ...toStageParams(BUTTON_DEFAULT_PARAMS),
        radius: Math.round(r0.height * 0.5),
        frost: 8,
        fluidBright: 40,
        fluidScale: 4,
        fluidAuraWidth: 32,
        fluidCenter: 0
      };
      const inst: TactileGlassInstance = {
        id: "showcase-brand-badge",
        canvas: badgeCanvas,
        ctx,
        visible: true,
        getParams: () => badgeParams,
        targetMouseX: 0,
        targetMouseY: 0,
        curMouseX: 0,
        curMouseY: 0,
        targetHover: 0,
        curHover: 0,
        clickPos: [-999, -999],
        clickTime: -999
      };
      const updateBadgeCoord = (e: PointerEvent) => {
        const r = brandBadgeEl.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        inst.targetMouseX = (e.clientX - (r.left + r.width * 0.5)) * dpr;
        inst.targetMouseY = ((r.top + r.height * 0.5) - e.clientY) * dpr;
      };
      brandBadgeEl.addEventListener("pointerenter", (e) => {
        updateBadgeCoord(e);
        inst.targetHover = 1.0;
      });
      brandBadgeEl.addEventListener("pointermove", (e) => {
        updateBadgeCoord(e);
        inst.targetHover = 1.0;
      });
      brandBadgeEl.addEventListener("pointerleave", () => {
        inst.targetHover = 0.0;
      });
      brandBadgeEl.addEventListener("pointerdown", (e) => {
        updateBadgeCoord(e);
        inst.clickPos = [inst.targetMouseX, inst.targetMouseY];
        inst.clickTime = engine.getTime();
      });
      engine.register(inst);
    }
  }
}

// Initialize Lucide Icons
createIcons({
  icons: {
    Activity,
    ToggleRight,
    Layers,
    Bot,
    ArrowRight,
    ChartPie,
    ChevronDown,
    ArrowUp,
    Plus,
    Heading,
    CreditCard,
    Disc3,
    Maximize2,
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Repeat,
    Copy,
    Check,
    Download
  }
});
