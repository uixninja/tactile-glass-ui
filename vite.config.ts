import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isLibBuild = process.env.BUILD_TARGET === "lib";

function tactileCssAutoInjectPlugin(): Plugin {
  return {
    name: "tactile-css-auto-inject",
    apply: "build",
    writeBundle(options) {
      if (!isLibBuild) return;
      const outDir = options.dir || path.resolve(__dirname, "dist-lib");
      const tokensCss = fs.readFileSync(path.resolve(__dirname, "src/styles/tokens.css"), "utf8");
      const componentsCss = fs.readFileSync(path.resolve(__dirname, "src/styles/components.css"), "utf8");
      const combinedCss = `${tokensCss}\n${componentsCss}`;

      fs.writeFileSync(path.join(outDir, "tokens.css"), tokensCss, "utf8");
      fs.writeFileSync(path.join(outDir, "components.css"), componentsCss, "utf8");
      fs.writeFileSync(path.join(outDir, "styles.css"), combinedCss, "utf8");

      const injectSnippet = `if(typeof document!=="undefined"&&!document.getElementById("tactile-glass-ui-styles")){const s=document.createElement("style");s.id="tactile-glass-ui-styles";s.textContent=${JSON.stringify(combinedCss)};document.head.appendChild(s);}\n`;

      for (const file of ["index.js", "index.cjs"]) {
        const filePath = path.join(outDir, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf8");
          fs.writeFileSync(filePath, injectSnippet + content, "utf8");
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), ...(isLibBuild ? [tactileCssAutoInjectPlugin()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: isLibBuild
    ? {
        outDir: "dist-lib",
        emptyOutDir: true,
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "TactileGlassUI",
          formats: ["es", "cjs"],
          fileName: (format) => (format === "es" ? "index.js" : "index.cjs")
        },
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime"
            }
          }
        }
      }
    : {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, "index.html"),
            components: path.resolve(__dirname, "components.html")
          }
        }
      },
  server: {
    port: 3000,
    open: false
  }
});
