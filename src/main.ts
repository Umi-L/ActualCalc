import './app.css'
import App from './App.svelte'
import {registerHotkeys} from "./Hotkeys";

const app = new App({
  target: document.getElementById('app')!,
})

registerHotkeys();

export default app
