import Vue from 'vue'
import VueRouter from 'vue-router'
import PantallaInicio from './views/PantallaInicio.vue'
import LogIn from './views/LogIn.vue'
import FormCrearProcesosCreativos from './views/FormCrearProcesosCreativos.vue'
import FormCrearEscena from './views/FormCrearEscena.vue'
import FormRecorridoEspacial from './views/FormRecorridoEspacial.vue'
import FormCrearPautaMov from './views/FormCrearPautaMov.vue'
import FormObjeto from './views/FormObjeto.vue'
import FormCrearEnsayo from './views/FormCrearEnsayo.vue'
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
    component: PantallaInicio,
    name: PantallaInicio
  },
  {
    path: '/formularioCrearPC/:userId',
    component: FormCrearProcesosCreativos
  },
  {
    path: '/formularioCrearEscena/:procesoCreativoId',
    component: FormCrearEscena
  },
  {
    path: '/formularioPautaMov/:escenaId',
    component: FormCrearPautaMov
  },
  {
    path: '/formularioRecorridoEspacial/:escenaId',
    component: FormRecorridoEspacial
  },
  {
    path: '/formularioEnsayo/procesoCreativo/:procesoCreativoId/:diaId',
    component: FormCrearEnsayo
  },
  {
    path: '/formularioEnsayo/escena/:escenaId/:diaId',
    component: FormCrearEnsayo
  },
  {
    path: '/formularioObjeto/:escenaId',
    component: FormObjeto
  },
  {
    path: '/procesoCreativo/:procesoCreativoId',
    component: ProcesoCreativo,
    name: "Proceso Creativo",
    params: true
  },
  {
    path: '/procesoCreativo/:procesoCreativoId/escena/:escenaId',
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

