<template>
  <div>
    <div id="dialog-backgorund" @click="$emit('evento_salir_popup')"></div>
    <div class="dialog">
      <div class="dialog-content">
        <div class="elementos_verticales">
          <button @click="crearProceso" class="buttonPopUp">
            <i class="material-symbols-outlined icono_anadir">visibility</i>
          </button>
          Proceso Creativo
        </div>
        <div class="elementos_verticales">
          <button class="buttonPopUp">
            <i class="material-symbols-outlined icono_anadir">lightbulb</i>
          </button>
          Idea
        </div>
      </div>
    </div>    
  </div>
</template>  

<script>
import eventBus from '../eventBus';

export default {
  methods:{
    crearProceso(){
      this.$router.push('/formularioCrearPC');
    }
  }
}
</script>

<style>
  
  .dialog {
    left: 50%;
    top: 69%;
    transform: translate(-50%, -50%);
    position: fixed;
    width: 100%;
  }

  
  .dialog-content {
    background: #CAC8CA;
    height: 245px;
    border-radius: 12px 12px 0px 0px;
    padding: 60px 0px 0px 0px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 70px;
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

  .elementos_verticales{
    display: flex;
    flex-direction: column;
    gap: 21px;
    align-items: center;
    word-wrap: break-word;
  }

  .buttonPopUp{
    width: 88px;
    height: 88px;

    border: 4px solid #FFFFFF;
    border-radius: 25px;
    background-color: transparent;
  }

  .material-symbols-outlined.icono_anadir{
    color: #FFFFFF;
  }
</style> 