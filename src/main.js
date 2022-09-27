import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vuelidate from './plugins/vuelidate'
import WebFont from 'webfontloader'
import VueCookies from "vue-cookies"
Vue.use(VueCookies)

Vue.config.productionTip = false

WebFont.load({ google: { families: ["Roboto"] } });

Vue.config.devtools = true;

new Vue({
  router,
  store,
  vuetify,
  vuelidate,
  render: h => h(App)
}).$mount('#app')
