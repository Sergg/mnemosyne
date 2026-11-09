import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

// No file watcher by default: it watched src-tauri/target and backend/.venv too (16k inotify
// watches) and ran out of them next to other projects. VITE_WATCH=1 turns it and hot reload back
// on, without the build and venv folders.
const watch = process.env.VITE_WATCH === "1";

// SvelteKit's config hook sets server.watch, and a merged null never wins, so this runs after it.
const noWatch: Plugin = {
  name: "mnemosyne-no-watch",
  configResolved(config) {
    if (!watch) config.server.watch = null;
  },
};

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), noWatch],
  server: {
    port: 5173,
    strictPort: true,
    // The Publish dialog renders its preview with the publication viewer's own component
    // (viewer/src/Meeting.svelte), outside SvelteKit's default allow list.
    fs: { allow: ["viewer"] },
    watch: {
      ignored: [
        "**/backend/**",
        "**/src-tauri/**",
        "**/link/**",
        "**/publish-host/**",
        "**/notes-core/**",
        "**/notes-wasm/target/**",
        "**/guest-wasm/target/**",
        "**/test-results/**",
        "**/playwright-report/**",
      ],
    },
  },
});
