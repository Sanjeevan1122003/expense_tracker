import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["Logo.png"], // file placed in public/
      manifest: {
        name: "Expense Tracker",
        short_name: "Expense Tracker",
        description: "Track your income & expenses easily.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true, // <--- IMPORTANT for local development
      },
    }),
  ],
});
