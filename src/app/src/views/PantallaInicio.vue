<template>
  <div class="main-div">
    <div id="frame_contenido_mis_procesos">
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
                <!--
                  <button class="anadir" @click="$emit('goToFormularioCrear')">
                    <i class="material-symbols-outlined icono_anadir" width="88px" height="88px">visibility</i>
                  </button>
                -->
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
    </div> 
  </div>
</template>

<script>
import PreviewProcesoCreativo from '../components/PreviewProcesoCreativo.vue'
import Filtro from '../components/Filtro.vue'
import BotonAnadir from '../components/BotonAnadir.vue'
import PopupCrear from '../components/PopupCrear.vue'
import eventBus from '../eventBus';

export default {
  name: 'PantallaInicio',
  components: {
    PreviewProcesoCreativo,
    Filtro,
    BotonAnadir,
    PopupCrear
  },

  mounted(){
    eventBus.$on('goToFormularioCrear', () => {
      this.$router.push({ name: 'formularioCrearPC' });
    });
  },
  data() {
    return {
      showPopupCrear:false
    }
  },
  methods:{
    popup_crear(){
      this.showPopupCrear = true
    },
    popup_salir(){
      this.showPopupCrear = false
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
  padding: 27px;
  height: 553px;
}

#misprocesosymisideas{
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.foto{
  
  background-size: cover;
  border-radius: 50%;
}

.foto.perfil{
  background-image: url("../assets/foto_persona.jpeg");
  width: 48px;
  height: 48px;
}

#frame_titulo_mis_procesos{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 21px;
  width: 100%;
  height: 48px;
}

#frame_contenido{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
}

.carrusel{
  display: flex;
  flex-direction: row;
  gap: 14px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  width: 100%;
}

#frame_scroll{
  display: flex;
  flex-direction: row;
  gap: 30px;
  height: 225px;
  width: auto;
  overflow-y: scroll;
}

#frame_anadir{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 206px;
}

button#ayuda{
  width: 37px;
  height: 37px;
  border-radius: 50%;
  background: #4B4B4B;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #FFFFFF;
}

#frame_mis_ideas{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 20px;

  width: 307px;
  height: 38px;
}

.dialog {
    left: 50%;
    top: 75%;
    transform: translate(-50%, -50%);
    position: fixed;
    width: 100%;
  }

  .dialog-content {
    background: #CAC8CA;
    height: 245px;
    border-radius: 12px 12px 0px 0px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 0px;
    gap: 70px;
  }

  .dialog-fade-transition {
    transition: opacity .3s linear;
  }

  .dialog-fade-enter,
  .dialog-fade-leave {
    opacity: 0;
  }

  button.anadir{
    width: 100%;
    height: 100%;
    background: transparent;
    border: 4px solid #FFFFFF;
    border-radius: 25px;
  }

  
  #dialog-backgorund{
    background: rgba(44, 44, 44, 0.79);
    left: 50%;
    top: 0%;
    bottom: -20%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 100%;
  }
  
  #frame_botones{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 12px;
    width: 88px;
    height: 138px;
  }

  .material-symbols-outlined.icono_anadir{
    color: #FFFFFF;
  }
</style>


<!--<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />-->