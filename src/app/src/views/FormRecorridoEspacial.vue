<template>
    <div class="main-div centrado">
        
        <h3>Creando recorrido espacial</h3>
        <div class="canvas">
            <vue-drawing-canvas
                width= "260px"
                height= "172px"
            />
        </div>
        <h4>¿De qué color quieres el trazo?</h4>
        <div class="color-picker">
            <input type="color" id="colorpicker" v-model="color"> 
            <label>{{ color }}</label>
        </div>
        
        <BotonesCrear irAtras="/procesoCreativo/escena" irHacia="/procesoCreativo/escena"/>
    </div>
</template>

<script>
import BotonesCrear from '../components/BotonesCrear.vue';
import VueDrawingCanvas from 'vue-drawing-canvas';

export default{
    components:{
        BotonesCrear,VueDrawingCanvas
    },
    data() {
        return {
            color:"#0000ff",
            canvas: null,
            ctx:null,
            x: 0,
            y: 0,
            isDrawing: false
        }
    },
    computed: {
        selectedColor() {
            return this.color.toUpperCase();
        }
    },
    mounted() {
        this.canvas = this.$refs.myCanvas;
        this.ctx = this.canvas.getContext('2d');
    },
    methods:{
        showCoordinates(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
        }
    }
}
</script>

<style>
.centrado{
    justify-content: center;
    align-items: center;
}

input[type="color"]{
    width: 37px;
    height: 37px;
    border: none;
}

.canvas{
    width: 260px;
    height: 172px;
    background-color: #E1E1E1;
}

.color-picker{
    display: flex;
    flex-direction: row;
    width: 214px;
    height: 53px;   
    background-color: #F0F0F0;
    color: #6A6868;
    align-items: center;
    gap: 20px;
    padding: 10px;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
}

</style>