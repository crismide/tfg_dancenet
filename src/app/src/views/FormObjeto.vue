<template>
    <div class="main-div">
        <h3>Añadiendo objeto</h3>
        <div class="contenido_scroll">
            <form @submit.prevent="handleSubmitForm">
                <label>¿Qué objeto es?</label><br><br>
                <input type="file" @change="handleFileChange"/><br><br>
                <div>
                    <label>Imagen cargada:</label><br>
                    <img :src="objeto.image" alt="Imagen cargada" width="200"/>
                </div><br><br>
                <label>¿Con qué pauta está asociada?</label><br><br>
                <select>
                    <option v-for="pautaMovimiento in pautasMovimiento"
                        :key="pautaMovimiento.id"
                        :name="pautaMovimiento.name"
                        :id="pautaMovimiento.id"
                    > {{ pautaMovimiento.name }} </option>
                </select><br><br>
                <label>¿Quién interactúa con este objeto?</label><br><br>
                <label><input type="checkbox"/>Nadie</label><br><br>
                <div class="grid_dos_filas">
                    <Pestana_Participantes v-for="participante in participantes"
                        :key="participante.id"
                        :nombre="participante.name"
                        :id="participante.id"
                    />
                </div><br><br>
                <label>¿Quién es responsable de este objeto?</label>
                <select>
                    <option v-for="participante in participantes"
                        :key="participante.id"
                        :name="participante.name"
                        :id="participante.id"
                    > {{ participante.name }}</option>
                </select><br><br>

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
import lzString from 'lz-string';

    export default{
        components: {
            Pestana_Participantes
        },
        data(){
            return{
                objeto:{
                    image:'',
                    participantes: [],
                    pautaMovimiento: '',
                    resposable: ''
                },
                escena:{
                    name: '',
                    id: '',
                    participantes: [],
                    pautasMovimiento: []
                },
                pautasMovimiento: [],
                participantes: []
            }
        },
        mounted(){
            const escenaId = this.$route.params.escenaId;
            this.escenaId = escenaId
            this.fetchEscenaData(escenaId);
        },
        methods:{
            handleFileChange(event) {
                const file = event.target.files[0];
                this.encode(file);
            },
            encode(file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    const compressedImage = lzString.compressToBase64(base64Image);
                    this.$set(this.objeto, 'image', compressedImage.replace(/^data:image\/[a-z]+;base64,/, ''));
                };
                reader.readAsDataURL(file);
            },
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
                    Vue.set(this.escena, 'pautasMovimiento', [...escenaData.pautasMovimiento]);
                    
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

                    //RECOGER PAUTAS DE MOVIMIENTO DE ESCENA
                    this.escena.pautasMovimiento.forEach((pautaMovimiento)=>{
                        const apiURLgetPautaMovimiento = `http://localhost:4000/pautaMovimiento/${pautaMovimiento}`;
                        axios.get(apiURLgetPautaMovimiento)
                        .then(response => {
                            const PautaMovimientoData = response.data.data
                            const elementosPautaMovimiento = {};
                            Vue.set(elementosPautaMovimiento, 'id', pautaMovimiento)
                            Vue.set(elementosPautaMovimiento, 'name', PautaMovimientoData.name)
                            this.pautasMovimiento.push(elementosPautaMovimiento)
                        })
                        console.log(this.pautasMovimiento)
                        .catch(error => {
                            console.log(error);
                        });
                    })

                })
            },
            handleSubmitForm(){
                let apiURLcrear = `http://localhost:4000/crear-objeto`;
                let apiURLasignar = `http://localhost:4000/escena/asignar-objeto/`;

                axios.post(apiURLcrear, this.objeto)
                    .then((response) => {
                    console.log(response)
                    const objetoId = response.data.data._id; 
                    const escenaId = this.$route.params.escenaId;
                    const procesoCreativoId = this.$route.params.procesoCreativoId;
                    console.log("escenaId "+escenaId)
                    console.log("objetoId "+objetoId)

                    apiURLasignar = apiURLasignar + escenaId + "/" + objetoId;
                    console.log("apiAsignar: "+apiURLasignar)
                    axios.post(apiURLasignar)
                        .then(() => {
                        console.log("Objeto asignada a escena");
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