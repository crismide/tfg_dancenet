<template>
  <div id="main-div">
    <div id="frame_contenido_mis_procesos">
      <div id="misprocesosymisideas">
         <div id="frame_titulo_mis_procesos">
          <h1 id="titulo_mis_procesos" font-weight="600" font-size="24px">Mis procesos</h1>
          <div id="foto_perfil"></div>
          <!--<img id="foto_perfil" src="../assets/foto_persona.jpeg" width="48px" height="48px">-->
        </div>
        <div id="frame_mis_ideas">
          <i class="material-icons">emoji_objects</i>
          <h2>Mis ideas</h2>
        </div>
      </div>
    <i class="material-icons">list</i>
    <div id="frame_contenido">
      <div id="frame_filtros_ext">
        <h3>Filtros</h3>
        <div id="frame_filtros_int">
          <Filtro nombre_filtro="Ordenar"/>
          <Filtro nombre_filtro="Etiquetas"/>
          <Filtro nombre_filtro="Creadorx"/>
        </div>
      </div>
      <div id="frame_scroll">
        <PreviewProcesoCreativo nombre_proceso="A des tiempo" />
        <PreviewProcesoCreativo nombre_proceso="Bolero" />
      </div>
      <div id="frame_anadir">
      <button type="button" id="ayuda">?</button>
      <button type="button" id="anadir">+</button>
    </div>
    </div>
    </div> 

    <div id="barra_navegacion">
      <i class="material-icons" width="33px" height="33px">person</i>
      <i class="material-icons" width="33px" height="33px">search</i>
      <i class="material-symbols-outlined" width="33px" height="33px">group</i>
      <i class="material-icons" width="33px" height="33px">event</i>
    </div>
  </div>
</template>

<script>
import PreviewProcesoCreativo from '../components/PreviewProcesoCreativo.vue'
import Filtro from '../components/Filtro.vue'
export default {
  components: {
    PreviewProcesoCreativo,
    Filtro
  },
  name: 'PantallaInicio',
  methods:{
    iniciar_sesion(){
      this.$router.push('login');
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
  overflow: hidden
}

i{
  width: 38px;
  height: 38px; 
}

#main-div{
  display: flex;
  flex-direction: column;
}

#frame_contenido_mis_procesos{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 27px;
  gap: 0px;
}

#misprocesosymisideas{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 0px;
  gap: 15px;
}

#foto_perfil{
  border-radius: 50%;
  background-image: url("../assets/foto_persona.jpeg");
  width: 48px;
  height: 48px;
  background-size: cover;
}

#frame_titulo_mis_procesos{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 21px;
  width: 307px;
  height: 48px;
}

#frame_contenido{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 45px;
}

#frame_filtros_int{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 14px;
  position: absolute;
  overflow-x: scroll;
  width: 325px;
  height: 32px;

}

#frame_scroll{
  display: flex;
  flex-direction: row;
  gap: 30px;
  overflow-y: scroll;
}

#frame_anadir{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 206px;
}

button#anadir{
  width: 64px;
  height: 64px;
  border-radius: 12px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 200;
  font-size: 48px;
  color: #C8C8C8;
  border: none;
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

#barra_navegacion{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 29px;
  gap: 50px;

  height: 50px;
  left: 0px;
  top: 0px;

  background: #D9D9D9;
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
</style>


<!--<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />-->