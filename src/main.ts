import { createApp } from 'vue'
import App from './App.vue'
import vRipple from "@/directives/vRipple";
import './assets/main.css'

const app = createApp(App);

app.directive("ripple", vRipple);

app.mount("#app");
