import Vue from 'vue'
import App from './views/App.vue'
import router from './router.js'
import VCalendar from 'v-calendar';
import axios from 'axios'

Vue.use(VCalendar);

Vue.prototype.$http=axios

axios.defaults.baseURL = 'https://7a7f-83-49-188-65.ngrok-free.app'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
