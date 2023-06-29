<template>
    <div class="main-div">
        <h4 v-if="isProcesoCreativo">Creando ensayo para proceso creativo</h4>
        <h4 v-if="!isProcesoCreativo">Creando ensayo para escena</h4>
        <div class="contenido_scroll">
            <form @submit.prevent="handleSubmitForm">
                <v-calendar :attributes='attributes' :value="null" color="yellow"></v-calendar><br><br>
                <input type="date" :value="diaId" disabled/><br><br>
                <input type="time" v-model="hour"/><br><br>
                <div v-if="isProcesoCreativo">
                    <label >Escenas que se van a ensayar</label><br><br>
                    <div class="elementos_horizontales carrusel">
                        <Pestana_Escenas v-for="escena in escenas" 
                                :key="escena.id" 
                                :id="escena.id" 
                                :nombre_escena="escena.name"
                                :nombre_proceso="procesoCreativoId"
                                :entrarDetalles= "false"
                                :isSelected="isEscenaSelected(escena)"
                                @escena-selected="toggleEscenaSeleccionada"
                            />
                    </div><br><br>
                </div>
                
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
import Pestana_Escenas from '../components/Pestana_Escenas.vue';
import Vue from 'vue'

export default{
    components: {Pestana_Escenas},
    data(){
        return{
            procesoCreativoId:'',
            escenaId:'',
            diaId: new Date(),
            escenas: [],
            procesoCreativo:{},
            escena:{},
            hour: '',
            escenasSeleccionadas: [],
            ensayo:{
                fecha: new Date(),
                escenas: []
            },
            attributes:[],
            isProcesoCreativo: true,
            ensayoId: ''
        }
    },
    mounted(){
        const diaId = this.$route.params.diaId;
        this.diaId = diaId

        const path = this.$route.path
        const trimmedPath = path.split("/").slice(0, 3).join("/");
        this.isProcesoCreativo = trimmedPath === '/formularioEnsayo/procesoCreativo';
        this.procesoCreativoId = this.$route.params.procesoCreativoId;

        if (this.isProcesoCreativo) this.fetchProcesoCreativoData(this.procesoCreativoId);

        else{
            this.escenaId = this.$route.params.escenaId;
            this.fetchEscenaData(this.escenaId);
        }
        
    },
    methods: {
        isEscenaSelected(escena) {
            return this.escenasSeleccionadas.includes(escena.id);
        },
        atras(){
            router.go(-1);
        },
        toggleEscenaSeleccionada(escena) {
            const index = this.escenasSeleccionadas.findIndex(
                item => item.id === escena.id
            );
            if (index !== -1) {
                this.escenasSeleccionadas.splice(index, 1); // Remove the escena
            } else {
                this.escenasSeleccionadas.push(escena.id); // Add the escena
            }
        },

        handleSubmitForm(){
            
            const [hours, minutes] = this.hour.split(":");
            this.ensayo.fecha = new Date(this.diaId);
            this.ensayo.fecha.setHours(hours, minutes);
            
            if(this.isProcesoCreativo){
                this.ensayo.escenas = this.escenasSeleccionadas
                
                let apiURLcrear = `http://localhost:4000/crear-ensayo`;
                let apiURLasignar = `http://localhost:4000/procesoCreativo/asignar-ensayo/`;
                let apiURLasignarEscena = `http://localhost:4000/escena/asignar-ensayo/`;

                this.$http.post(apiURLcrear, this.ensayo)
                    .then((response) => {
                    const ensayoId = response.data.data._id;
                    const procesoCreativoId = this.$route.params.procesoCreativoId;
                    apiURLasignar = apiURLasignar + procesoCreativoId + "/" + ensayoId;
                    this.$http.post(apiURLasignar)
                        .then(() => {
                            this.ensayo.escenas.forEach((escena)=>{
                                apiURLasignarEscena = apiURLasignarEscena + escena + "/" + ensayoId
                                console.log(apiURLasignarEscena)
                                this.$http.post(apiURLasignarEscena)
                                    .then(() => {
                                        console.log("Ensayo asignada a escena");
                                        this.$router.push(`/procesoCreativo/${procesoCreativoId}`);
                                    })
                                    .catch(error => {
                                    console.log(error);});})
                                    .catch(error => {
                                    console.log(error);
                            })
                        })
                        .catch(error => {
                        console.log(error);});})
                        .catch(error => {
                        console.log(error);
                });

                
            }
            else{
                this.ensayo.escenas.push(this.escenaId)
                
                let apiURLcrear = `http://localhost:4000/crear-ensayo`;
                let apiURLasignar = `http://localhost:4000/procesoCreativo/asignar-ensayo/`;
                let apiURLasignarEscena = `http://localhost:4000/escena/asignar-ensayo/${this.escenaId}/`;

                this.$http.post(apiURLcrear, this.ensayo)
                    .then((response) => {
                    const ensayoId = response.data.data._id;
                    apiURLasignar = apiURLasignar + this.procesoCreativoId + "/" + ensayoId;
                    apiURLasignarEscena = apiURLasignarEscena + ensayoId
                    this.$http.post(apiURLasignar)
                        .then(() => {
                            console.log("Ensayo asignada a proceso creativo");
                            this.$http.post(apiURLasignarEscena)
                                .then(() => {
                                    console.log("Ensayo asignada a escena");
                                    this.$router.push(`/procesoCreativo/${this.procesoCreativoId}/escena/${this.escenaId}`);
                                })
                                .catch(error => {
                                console.log(error);});})
                                .catch(error => {
                                console.log(error);
                            
                        })
                        .catch(error => {
                        console.log(error);});})
                        .catch(error => {
                        console.log(error);
                });
            }
            
        },
        addEscenaSeleccionada(escena) {
            this.escenasSeleccionadas.push(escena);
        },
        fetchProcesoCreativoData(procesoCreativoId) {
            const apiURL = `http://localhost:4000/procesoCreativo/${procesoCreativoId}`;
            this.$http.get(apiURL)
                .then(response => {
                const procesoCreativoData = response.data.data;
                Vue.set(this.procesoCreativo, 'escenas', [...procesoCreativoData.escenas]);
                Vue.set(this.procesoCreativo, 'ensayos', [...procesoCreativoData.ensayos]);

                //RECOGER ESCENAS DE PROCESO CREATIVO
                this.procesoCreativo.escenas.forEach((escena)=>{
                    const apiURLgetEscena = `http://localhost:4000/escena/${escena}`;
                    this.$http.get(apiURLgetEscena)
                    .then(response => {
                        const EscenaData = response.data.data
                        const elementosEscena = {};
                        Vue.set(elementosEscena, 'name', EscenaData.name)
                        Vue.set(elementosEscena, 'id', escena)
                        this.escenas.push(elementosEscena)
                    })
                })

                //RECOGER ENSAYOS DE PROCESO CREATIVO
                this.procesoCreativo.ensayos.forEach((ensayo)=>{
                    const apiURLgetEnsayo = `http://localhost:4000/ensayo/${ensayo}`;
                    this.$http.get(apiURLgetEnsayo)
                    .then(response => {
                        const EnsayoData = response.data.data
                        const elementosEnsayoAttr = {};
                        Vue.set(elementosEnsayoAttr, 'dates', new Date(EnsayoData.fecha))
                        Vue.set(elementosEnsayoAttr, 'content', "red")
                        Vue.set(elementosEnsayoAttr, 'highlight', true)
                        this.attributes.push(elementosEnsayoAttr)
                    })
                })

            })
                .catch(error => {
                console.log(error);
                });
    },
    fetchEscenaData(escenaId) {
            const apiURL = `http://localhost:4000/escena/${escenaId}`;
            console.log(apiURL)
            this.$http.get(apiURL)
                .then(response => {
                const EscenaData = response.data.data;
                Vue.set(this.escena, 'ensayos', [...EscenaData.ensayos]);

                //RECOGER ENSAYOS DE ESCENA
                this.escena.ensayos.forEach((ensayo)=>{
                    const apiURLgetEnsayo = `http://localhost:4000/ensayo/${ensayo}`;
                    this.$http.get(apiURLgetEnsayo)
                    .then(response => {
                        const EnsayoData = response.data.data
                        const elementosEnsayoAttr = {};
                        Vue.set(elementosEnsayoAttr, 'dates', new Date(EnsayoData.fecha))
                        Vue.set(elementosEnsayoAttr, 'content', "red")
                        Vue.set(elementosEnsayoAttr, 'highlight', true)
                        this.attributes.push(elementosEnsayoAttr)
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