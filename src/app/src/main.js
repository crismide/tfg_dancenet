import Vue from 'vue'
import PantallaInicio from './views/PantallaInicio.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(PantallaInicio),
}).$mount('#app')
