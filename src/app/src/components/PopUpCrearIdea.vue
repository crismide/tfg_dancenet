<template>
    <div>
      <div id="dialog-backgorund" @click="$emit('evento_salir_popup')"></div>
      <div class="dialog" v-if="!showPopUpNota">
        <div class="dialog-content" >
          <div class="elementos_verticales">
            <button class="buttonPopUp" @click="interaccion_popUp_nota">
              <i class="material-symbols-outlined icono_anadir">edit</i>
            </button>
            Escribir nota
          </div>
          <div class="elementos_verticales">
            <button class="buttonPopUp">
              <i class="material-symbols-outlined icono_anadir">gallery_thumbnail</i>
            </button>
            Subir desde galería
          </div>
        </div>
      </div>
      <div class="dialog" v-if="showPopUpNota">
        <div class="dialog-content" >
          <div class="elementos_verticales">
            <form @submit.prevent="handleSubmitForm" id="notaForm">
                <h3>Escribe aquí la idea que tienes en mente</h3>
                <textarea placeholder="Aquí va tu idea" form="notaForm" v-model="idea.content" class="textarea_grande"></textarea><br><br>
                <button type="submit" class="button_crear morado">Crear</button>
            </form>
          </div>
        </div>
      </div>        
    </div>
  </template>  

<script>
import axios from "axios";
import router from '@/router';

export default {
  props: {
    where: {
      type: String,
      required: true
    }
  },
    data() {
        return {
            showPopUpNota: false,
            idea: {
                type: 'text',
                content: ''
            },
            procesoCreativo: {}
        };
    },
  methods:{
    interaccion_popUp_nota(){
        if(this.showPopUpNota) this.showPopUpNota=false
        else this.showPopUpNota=true
    },
    handleSubmitForm() {
        console.log(this.idea)
        let apiURLcrear = `http://localhost:4000/crear-idea`;
        let apiURLasignar = `http://localhost:4000/${this.where}/asignar-idea/`;

        axios.post(apiURLcrear, this.idea)
            .then((response) => {
                console.log(response.data)
                const ideaId = response.data.data._id; // Access the created ProcesoCreativo ID
                var procesoCreativoId=""
                if(this.where=="procesoCreativo") procesoCreativoId = this.$route.params.procesoCreativoId;
                else procesoCreativoId = this.$route.params.escenaId;
                console.log("apiURLasignar "+apiURLasignar)
                apiURLasignar = apiURLasignar + procesoCreativoId + "/" + ideaId;
                console.log("apiAsignar: "+apiURLasignar)
                axios.post(apiURLasignar)
                    .then(() => {
                    window.location.reload();
                    })
                    .catch(error => {
                    console.log(error);});})
                    .catch(error => {
                    console.log(error);
            });
    }
  }
}
</script>

<style>
.text_dialog{
    left: 50%;
    top: 69%;
    transform: translate(-50%, -50%);
    position: fixed;
    width: 100%;
}

.textarea_grande{
    border: 0px;
    background-color: #e9e6e9;
    width: 100%;
    color: #000;
    font-size: 16px;
    font-family: Inter;
    font-weight: 500;
}
</style>