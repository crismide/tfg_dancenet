<template>
  <div class="main-div">
      <div class="elementos_horizontales">
        <h2>Mis procesos</h2>
        <div class="foto perfil"></div>
      </div>
      <div class="elementos_horizontales">
        <i class="material-symbols-outlined" id="bombilla">lightbulb</i>
        <h3>Mis ideas</h3>
      </div>
      <div class="elementos_horizontales izq">
        <i class="material-icons">list</i>
      </div>
      
      <div class="wrapper">
        <PreviewProcesoCreativo :userId="userId"
          v-for="proceso in this.procesosCreativos"
          :key="proceso.id"
          :id="proceso.id"
          :nombre_proceso="proceso.title"
        />
      </div>
    
      
      <div class="elementos_horizontales separados" @evento_anadir="interaccion_popup">
        <BotonAyuda/>
        <BotonAnadir @evento_anadir="interaccion_popup"/>
      </div>
     
      <PopupCrear v-if="showPopupCrear" @evento_salir_popup="interaccion_popup"/>

  </div>
</template>

<script>
import PreviewProcesoCreativo from '../components/PreviewProcesoCreativo.vue'
import Filtro from '../components/Filtro.vue'
import BotonAnadir from '../components/BotonAnadir.vue'
import PopupCrear from '../components/PopupCrear.vue'
import BotonAyuda from '../components/BotonAyuda.vue';
import Vue from 'vue'

export default {
  name: 'PantallaInicio',
  components: {
    PreviewProcesoCreativo,
    Filtro,
    BotonAnadir,
    PopupCrear,
    BotonAyuda
  },

  data() {
    return {
      showPopupCrear:false,
      user: {},
      userId: "",
      procesosCreativos: []
    }
  },
  mounted() {
    this.userId = this.$route.params.userId;
    this.fetchUserData(this.userId);
    this.procesosCreativos = this.procesosCreativos
  },
  methods:{
    interaccion_popup(){
      if(this.showPopupCrear) this.showPopupCrear = false
      else this.showPopupCrear = true 
    },
    fetchUserData(userId) {
      const apiURL = `http://localhost:4000/user/${userId}`;
      this.$http.get(apiURL)
        .then(response => {
          const userData = response.data.data;
          Vue.set(this.user, 'name', userData.name);
          Vue.set(this.user, 'password', userData.password);
          Vue.set(this.user, 'email', userData.email);
          Vue.set(this.user, 'procesoCreativos', [...userData.procesoCreativos]);
          Vue.set(this.user, 'ideas', [...userData.ideas]);
          this.user.procesoCreativos.forEach((procesoCreativo)=>{
            const apiURLgetPC = `http://localhost:4000/procesoCreativo/${procesoCreativo}`;
            this.$http.get(apiURLgetPC)
              .then(response => {
                const procesoCreativoData = response.data.data
                const elementosProceso = {};
                Vue.set(elementosProceso, 'title', procesoCreativoData.title)
                Vue.set(elementosProceso, 'id', procesoCreativo)
                this.procesosCreativos.push(elementosProceso)
              })
          })
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}


</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}

body{
  font-family: 'Helvetica Neue';
  font-style: normal;
  margin: 0; 
  height: 100%; 
}

.main-div{
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 27px;
  height: 553px;
  width: 305px;
  overflow: hidden;
}

.elementos_horizontales{
  display: flex;
  flex-direction: row;
  gap: 21px;
  align-items: center;
}

.izq{
  justify-content: flex-end;
}

.separados{
  gap: 65%;
}

.carrusel{
  width: 305px;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 10%;
}

.wrapper{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(230px, auto);
  overflow-y: scroll;
}

.foto{
  background-size: cover;
  border-radius: 50%;
}

.foto.perfil{
  background-image: url("../assets/default_proceso.png");
  width: 48px;
  height: 48px;
}
</style>


<!--<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />-->



 <!--
 <div id="misprocesosymisideas">
         <div id="frame_titulo_mis_procesos">
          <h1 id="titulo_mis_procesos" font-weight="600" font-size="24px">Mis procesos</h1>
          <div class="foto perfil"></div>
        </div>
        <div id="frame_mis_ideas">
          <i class="material-symbols-outlined" id="bombilla">lightbulb</i>
          <h2>Mis ideas</h2>
        </div>
      </div>
    <i class="material-icons">list</i>
    <div id="frame_contenido">
      <div id="frame_filtros_ext">
        <h3>Filtros</h3>
        <div class="carrusel">
          <Filtro nombre_filtro="Ordenar"/>
          <Filtro nombre_filtro="Etiquetas"/>
          <Filtro nombre_filtro="Creadorx"/>
        </div>
      </div>
      <div id="frame_scroll">
        <router-link to="/procesoCreativo">
          <PreviewProcesoCreativo nombre_proceso="A des tiempo" />
        </router-link>
        
        <PreviewProcesoCreativo nombre_proceso="Otra cosa" />
      </div>
      <div id="frame_anadir">
      <button type="button" id="ayuda">?</button>
      <BotonAnadir @evento_anadir="popup_crear"/>
      <div v-if="showPopupCrear" @click="popup_salir">
        <div id="dialog-backgorund" @click="$emit('evento_salir_popup')"></div>
          <div class="dialog" transition="dialog-fade">
          <div class="dialog-content">
            <div id="frame_botones">
                
                  <button class="anadir" @click="$emit('goToFormularioCrear')">
                    <i class="material-symbols-outlined icono_anadir" width="88px" height="88px">visibility</i>
                  </button>
                
                <router-link to="/formularioCrearPC" class="nav-link">
                  <i class="material-symbols-outlined icono_anadir" width="88px" height="88px">visibility</i>
                </router-link>
                <h3>Proceso creativo</h3>
            </div>
            <div id="frame_botones">
                <button class="anadir">
                    <i class="material-symbols-outlined icono_anadir" width="88px" height="88px">lightbulb</i>
                </button>
                <h3>Idea</h3>
            </div>
          </div>
        </div>
      
      </div>
    </div>
    </div>

 -->