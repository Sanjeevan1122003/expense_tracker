import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Lets PWA work in dev mode too
      },
      includeAssets: ["Logo.png"],
      manifest: {
        name: "Expense Tracker",
        short_name: "Expenses Tracker",
        description: "Track your income & expenses easily.",
        theme_color: "#24c2ee",
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
    }),
  ],

  // IMPORTANT: Now @ works properly
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
