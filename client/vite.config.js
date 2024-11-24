import path from "path";
import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Allows external access
    port: 5173, // Ensure it matches the EXPOSE in Dockerfile
  },
};
