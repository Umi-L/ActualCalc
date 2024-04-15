import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png, mask-icon.svg'],
        manifest: {
            name: 'ActualCalc',
            id: 'com.umi-l.ActualCalc',
            display: 'standalone',
            lang: "en",
            orientation: "any",
            dir: "ltr",
            scope: "https://umi-l.github.io/ActualCalc/",
            categories: ['utilities', 'productivity'],
            screenshots: [
                {
                    src: 'screenshot (1).PNG',
                    sizes: '2266x1488',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (2).PNG',
                    sizes: '1488x2266',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (3).PNG',
                    sizes: '1488x2266',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (4).PNG',
                    sizes: '2266x1488',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (5).PNG',
                    sizes: '2266x1488',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (6).PNG',
                    sizes: '2266x1488',
                    type: 'image/png'
                },
                {
                    src: 'screenshot (7).PNG',
                    sizes: '2266x1488',
                    type: 'image/png'
                },
            ],
            short_name: 'ActualCalc',
            description: 'A calculator that actually works.',
            theme_color: '#191820',
            background_color: '#191820',
            icons: [
                {
                    src: 'pwa-64x64.png',
                    sizes: '64x64',
                    type: 'image/png'
                },
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: 'maskable-icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ],
        }
    })],
    base: '/ActualCalc/',
})
