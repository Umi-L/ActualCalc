import './app.css'
import App from './App.svelte'
import {registerHotkeys} from "./Hotkeys";
import {writable} from "svelte/store";

export let historyMenuOpen = writable(false);

const app = new App({
  target: document.getElementById('app')!,
})

registerHotkeys();

export default app
