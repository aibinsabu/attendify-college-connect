
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Mode:', mode);
  console.log('Environment variables loaded:');
  console.log('VITE_USE_MOCK_DB:', env.VITE_USE_MOCK_DB);
  console.log('VITE_MONGODB_URI:', env.VITE_MONGODB_URI);
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define env variables to be exposed to the client
    define: {
      'import.meta.env.VITE_MONGODB_URI': JSON.stringify(env.VITE_MONGODB_URI || ''),
      'import.meta.env.VITE_MONGODB_USER': JSON.stringify(env.VITE_MONGODB_USER || ''),
      'import.meta.env.VITE_MONGODB_PASSWORD': JSON.stringify(env.VITE_MONGODB_PASSWORD || ''),
      'import.meta.env.VITE_USE_MOCK_DB': JSON.stringify(env.VITE_USE_MOCK_DB || 'true'),
    },
  };
});
