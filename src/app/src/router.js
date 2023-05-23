import Vue from 'vue'
import VueRouter from 'vue-router'
import PantallaInicio from './views/PantallaInicio.vue'


Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    component: PantallaInicio 
  }
]

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;

