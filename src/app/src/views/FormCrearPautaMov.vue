<template>
    <div class="main-div">
        <h3>Creando una pauta de movimiento</h3>
        <div class="contenido_scroll">
            <form @submit.prevent="handleSubmitForm" class="formulario" id="pautaForm">
            <label for="name">¿Cómo quieres llamarla?</label><br><br>
            <input type="text" placeholder="Nombre" v-model="pautaMovimiento.name"><br><br>
            
            <label for="name">¿Cómo la describirías?</label><br><br>
            <textarea placeholder="Aquí va la descripción de la pauta" 
                    form="pautaForm" 
                    class="textarea_peque"
                    v-model="pautaMovimiento.description">
            </textarea><br><br>

            <label>¿Cuándo se tiene que hacer?</label><br><br>
            <label>Duración  <input type="time"/></label><br><br>
            <label>Inicio  <input type="time"/></label><br><br>
            <label>Final  <input type="time"/></label><br><br><br>
            
            <label>¿Quién quieres que la haga?</label><br><br>
            <div class="grid_dos_filas">
                <Pestana_Participantes v-for="participante in participantes"
                    :key="participante.id"
                    :nombre="participante.name"
                    :id="participante.id"
                />
            </div><br><br><br>

            <label>¿En qué nivel se hace la pauta?</label>
            <select v-model="pautaMovimiento.level">
                <option>Nivel bajo</option>
                <option>Nivel medio</option>
                <option>Nivel alto</option>
            </select><br><br><br>

            <div class="frame_botones">
                <button type="button" class="button_crear gris" @click="atras">Cancelar</button>
                <button type="submit" class="button_crear morado">Crear</button>
            </div>
        </form>
        </div> 
    </div>
</template>

<script>
import router from '@/router';
import axios from "axios";
import Vue from 'vue'
import Pestana_Participantes from '../components/Pestana_Participantes.vue';

export default{
    components: {
        Pestana_Participantes
    },
    data() {
        return {
            escena: {},
            pautaMovimiento: {
                name:'',
                description:'',
                level: ''
            },
            participantes: []
        }
    },
    mounted(){
        const escenaId = this.$route.params.escenaId;
        this.escenaId = escenaId
        this.fetchEscenaData(escenaId);
    },
    methods:{
        atras(){
            router.go(-1);
        },
        fetchEscenaData(escenaId) {
            const apiURL = `http://localhost:4000/escena/${escenaId}`;
            axios.get(apiURL)
                .then(response => {
                const escenaData = response.data.data;
                Vue.set(this.escena, 'name', escenaData.name);
                Vue.set(this.escena, 'id', escenaData._id);
                Vue.set(this.escena, 'participantes', [...escenaData.participantes]);
                
                //RECOGER PARTICIPANTES DE ESCENA
                this.escena.participantes.forEach((participante)=>{
                    const apiURLgetParticipanteName = `http://localhost:4000/participante/${participante}/name`;
                    axios.get(apiURLgetParticipanteName)
                    .then(response => {
                        const ParticipanteData = response.data.data
                        const elementosParticipante = {};
                        Vue.set(elementosParticipante, 'id', participante)
                        Vue.set(elementosParticipante, 'name', ParticipanteData.name)
                        this.participantes.push(elementosParticipante)
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })

            })
        },
        handleSubmitForm() {
            
            let apiURLcrear = `http://localhost:4000/crear-pautaMovimiento`;
            let apiURLasignar = `http://localhost:4000/escena/asignar-pautaMovimiento/`;

            axios.post(apiURLcrear, this.pautaMovimiento)
                .then((response) => {
                console.log(response)
                const pautaMovimientoId = response.data.data._id; 
                const escenaId = this.$route.params.escenaId;
                const procesoCreativoId = this.$route.params.procesoCreativoId;
                apiURLasignar = apiURLasignar + escenaId + "/" + pautaMovimientoId;
                console.log("apiAsignar: "+apiURLasignar)
                axios.post(apiURLasignar)
                    .then(() => {
                    console.log("Pauta de Movimiento asignada a escena");
                    this.$router.push(`/procesoCreativo/${procesoCreativoId}/escena/${escenaId}`);
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
    .textarea_peque{
        width: 100%;
        border-radius: 5px;
        background: #F4F4F4;
        border: 0px;
        height: 25%;
        color: #7C7C7C;
        font-size: 14px;
        resize: none;
    }
    
    input[type="time"]{
        background-color: #F4F4F4;
        border: 0px;
        color: #7C7C7C;
    }
</style>