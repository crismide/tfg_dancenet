<template>
    <div class="main-div">
      <form @submit.prevent="handleSubmitForm">
        <h3>Creando recorrido espacial</h3>
        <div class="canvas">
          <vue-drawing-canvas
            ref="myCanvas"
            :color="color"
            width="260"
            height="172"
            :backgroundColor="'#E1E1E1'"
            :image.sync="recorridoEspacial.image"
          />
        </div>
        <h4>¿De qué color quieres el trazo?</h4>
        <div class="color-picker">
          <input type="color" id="colorpicker" v-model="color" />
          <label>{{ color }}</label>
        </div><br /><br />
  
        <div class="frame_botones">
          <button type="button" class="button_crear gris" @click="atras">Cancelar</button>
          <button type="submit" class="button_crear morado">Crear</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import BotonesCrear from '../components/BotonesCrear.vue';
  import VueDrawingCanvas from 'vue-drawing-canvas';
  import router from '@/router';
  import axios from "axios";
  import Vue from 'vue'
  
  export default {
    components: {
      BotonesCrear,
      VueDrawingCanvas
    },
    data() {
      return {
        color: "#0000ff",
        x: 0,
        y: 0,
        isDrawing: false,
        lines: [],
        canvas: null,
        context: null,
        recorridoEspacial: {
            image:''
        }
      };
    },
    /*mounted() {
      this.canvas = this.$refs.myCanvas.$refs.canvas; // Access the underlying canvas element
      this.context = this.canvas.getContext("2d");
      this.redraw(); // Redraw the existing lines on mount
    }*,*/
    methods: {
      /*startDrawing(event) {
        this.isDrawing = true;
        this.currentPath = [];
        this.currentPath.push({
          x: event.clientX - this.canvas.offsetLeft,
          y: event.clientY - this.canvas.offsetTop
        });
      },
      draw(event) {
        if (!this.isDrawing) return;
        this.currentPath.push({
          x: event.clientX - this.canvas.offsetLeft,
          y: event.clientY - this.canvas.offsetTop
        });
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redraw();
      },
      stopDrawing() {
        this.isDrawing = false;
        this.lines.push([...this.currentPath]);
      },
      redraw() {
        this.lines.forEach((path) => {
          this.context.beginPath();
          path.forEach((point, index) => {
            if (index === 0) {
              this.context.moveTo(point.x, point.y);
            } else {
              this.context.lineTo(point.x, point.y);
            }
          });
          this.context.strokeStyle = this.color;
          this.context.lineWidth = 2;
          this.context.stroke();
        });
      },*/
      atras() {
        router.go(-1);
      },
      handleSubmitForm() {
            console.log(this.recorridoEspacial.image)    

            let apiURLcrear = `http://localhost:4000/crear-recorridoEspacial`;
            let apiURLasignar = `http://localhost:4000/escena/asignar-recorridoEspacial/`;

            axios.post(apiURLcrear, this.recorridoEspacial)
                .then((response) => {
                console.log(response)
                const recorridoEspacialId = response.data.data._id; 
                const escenaId = this.$route.params.escenaId;
                const procesoCreativoId = this.$route.params.procesoCreativoId;
                apiURLasignar = apiURLasignar + escenaId + "/" + recorridoEspacialId;
                console.log("apiAsignar: "+apiURLasignar)
                axios.post(apiURLasignar)
                    .then(() => {
                    console.log("Recorrido Espacial asignado a escena");
                    this.$router.push(`/procesoCreativo/${procesoCreativoId}/escena/${escenaId}`);
                    })
                    .catch(error => {
                    console.log(error);});})
                    .catch(error => {
                    console.log(error);
            });
    },
  }}
  </script>
  
  <style>
  .centrado {
    justify-content: center;
    align-items: center;
  }
  
  input[type="color"] {
    width: 37px;
    height: 37px;
    border: none;
  }
  
  .color-picker {
    display: flex;
    flex-direction: row;
    width: 214px;
    height: 53px;
    background-color: #f0f0f0;
    color: #6a6868;
    align-items: center;
    gap: 20px;
    padding: 10px;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }
  </style>
  