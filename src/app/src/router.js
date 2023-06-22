import Vue from 'vue'
import VueRouter from 'vue-router'
import PantallaInicio from './views/PantallaInicio.vue'
import LogIn from './views/LogIn.vue'
import FormCrearProcesosCreativos from './views/FormCrearProcesosCreativos.vue'
import FormCrearEscena from './views/FormCrearEscena.vue'
import FormRecorridoEspacial from './views/FormRecorridoEspacial.vue'
import ProcesoCreativo from './views/ProcesoCreativo.vue'
import Escena from './views/Escena.vue'
import Ayuda from './views/Ayuda.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    component: LogIn 
  },
  { 
    path: '/inicio/:userId',
    component: PantallaInicio
  },
  {
    path: '/formularioCrearPC/:userId',
    component: FormCrearProcesosCreativos
  },
  {
    path: '/formularioCrearEscena',
    component: FormCrearEscena
  },
  {
    path: '/formularioRecorridoEspacial',
    component: FormRecorridoEspacial
  },
  {
    path: '/procesoCreativo/:procesoCreativoId',
    component: ProcesoCreativo
  },
  {
    path: '/procesoCreativo/escena',
    component: Escena
  },
  {
    path: '/ayuda',
    component: Ayuda
  }
]

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;

