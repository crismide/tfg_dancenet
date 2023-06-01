<template>
  <div>
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
  </template>  

<script>
import eventBus from '../eventBus';

export default {
  evento_salir_popup() {
    this.$emit('evento_salir_popup')
  },
  irFormularioProcesosCreativos() {
      eventBus.$emit('goToFormularioCrear');
  }
}
</script>

<style>
  
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

<!--

<div class="dialog" transition="dialog-fade">
  <div id="frame_salir_dialogo" @click="$emit('evento_salir_popup')"></div>
  <div class="dialog-content">
    <div id="frame_botones">
        <button class="anadir">
            <i class="material-symbols-outlined icono_anadir" width="88px" height="88px">visibility</i>
        </button>
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
-->