if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const t=e=>n(e,o),d={module:{uri:o},exports:c,require:t};i[o]=Promise.all(s.map((e=>d[e]||t(e)))).then((e=>(r(...e),c)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-B02w7Af2.css",revision:null},{url:"assets/index-DjdqBa0s.js",revision:null},{url:"index.html",revision:"ec8640b6313161f954a497a3c4490393"},{url:"registerSW.js",revision:"b7d4cdaca6109fb31d0e13f3058e334d"},{url:"favicon.ico",revision:"b8407efe0002ef8344cc990b832939a6"},{url:"pwa-64x64.png",revision:"ebbf1e8291789866a3eec1b6a0b9e047"},{url:"pwa-192x192.png",revision:"6cf89ad7ed25681bd73b549086eac5f6"},{url:"pwa-512x512.png",revision:"5fe87e770158744f24a81d75e5023de3"},{url:"maskable-icon-512x512.png",revision:"eab304e204dc42b04cc215a4f6ec6021"},{url:"manifest.webmanifest",revision:"6ff973b44bdc7f041263d7c08bd19b29"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
