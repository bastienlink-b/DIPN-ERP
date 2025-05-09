/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOTION_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}