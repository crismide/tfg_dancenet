import Vue from 'vue'
import VueRouter from 'vue-router'
import PantallaInicio from './views/PantallaInicio.vue'
import FormCrearProcesosCreativos from './views/FormCrearProcesosCreativos.vue'
import ProcesoCreativo from './views/ProcesoCreativo.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    component: PantallaInicio 
  },
  {
    path: '/formularioCrearPC',
    component: FormCrearProcesosCreativos
  },
  {
    path: '/procesoCreativo',
    component: ProcesoCreativo
  }
]

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;

