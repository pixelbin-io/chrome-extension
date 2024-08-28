import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: "public/manifest.json",
					dest: ".",
				},
				{
					src: "public/pixb_logo.png",
					dest: ".",
				},
				{
					src: "public/pixb_logo_64.png",
					dest: ".",
				},
				{
					src: "src/contextMenu/popup.html",
					dest: "src/contextMenu",
				},
				{
					src: "src/contextMenu/popup.js",
					dest: "src/contextMenu",
				},
				{
					src: "src/mediaLibrary/popup.html",
					dest: "src/mediaLibrary",
				},
				{
					src: "src/mediaLibrary/setup.js",
					dest: "src/mediaLibrary",
				},
				{
					src: "node_modules/xyzWidget/dist/bundle.js",
					dest: "node_modules/xyzWidget/dist",
				},
				{
					src: "src/content/assets",
					dest: ".",
				},
				{
					src: "src/content/style.css",
					dest: ".",
					rename: "content.css",
				},
			],
		}),
	],
	css: {
		preprocessorOptions: {
			css: {
				additionalData: '@import "./src/content/style.css";',
			},
		},
	},
	build: {
		rollupOptions: {
			input: {
				background: "src/background/index.js",
				content: "src/content/index.jsx",
			},
			output: {
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
	},
});
