import 'core-js';
import 'regenerator-runtime';
import Vue from 'vue'
import 'bulma-fluent/bulma.sass'
import axios from 'axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'

window.axios = axios.create();
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
})
