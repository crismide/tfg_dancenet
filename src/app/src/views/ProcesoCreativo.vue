<template>
    <div class="main-div">
        <BotonAtras route_to="/"/>
        <h1 style="color: #C286F1;">{{ procesoCreativo.title }}</h1>
        <div class="contenido_scroll">
            <!-- ***** APARTADO IDEAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ideas">
                    <h2>Ideas</h2>
                    <i v-if="!showIdeas" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showIdeas">
                    <BotonAnadirAlargado label="Añadir idea +" @mostrar-popup="interaccion_popup" />
                    <div class="elementos_horizontales carrusel">
                        <Filtro nombre_filtro="Ordenar"/>
                        <Filtro nombre_filtro="Etiquetas"/>
                        <Filtro nombre_filtro="Creadorx"/>
                    </div>
                    <Idea v-for="idea in ideas" 
                        :key="idea.id" 
                        :type="idea.type" 
                        :content="idea.content" 
                        />
                    <PopUpCrearIdea v-if="showPopupIdeas" 
                        @evento_salir_popup="interaccion_popup"
                        :where="'procesoCreativo'"
                    />
                </div>
            </div>

            <!-- ***** APARTADO ESCENAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_escena">
                    <h2>Escenas</h2>
                    <i v-if="!showEscenas" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showEscenas">
                    <div @click="irFormCrearEscena">
                        <BotonAnadirAlargado label="Añadir escena +"/>
                    </div>
                    
                    
                    <div class="elementos_horizontales carrusel">
                        <Pestana_Escenas v-for="escena in escenas" 
                            :key="escena.id" 
                            :id="escena.id" 
                            :nombre_escena="escena.name"
                            :nombre_proceso="procesoCreativoId"
                            :entrarDetalles="true"
                        />
                    </div>
                    
                </div>
            </div>

            <!-- ***** APARTADO PARTICIPANTES *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_participantes">
                    <h2>Participantes</h2>
                    <i v-if="!showParticipantes" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showParticipantes">
                    <div class="elementos_horizontales carrusel">
                        <Filtro nombre_filtro="Ordenar"/>
                        <Filtro nombre_filtro="Rol"/>
                    </div>
                    <BotonAnadirAlargado label="Añadir participante +"/>
                    <div class="grid_dos_filas">
                        <Pestana_Participantes nombre="Andrea" imagen="" roles=""/>
                        <Pestana_Participantes nombre="Andrea" imagen="" roles=""/>
                        <Pestana_Participantes nombre="Andrea" imagen="" roles=""/>
                    </div>
                </div>
            </div>

            <!-- ***** APARTADO ENSAYOS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ensayos">
                    <h2>Ensayos</h2>
                    <i v-if="!showEnsayos" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showEnsayos">
                    <v-calendar :attributes='attributes' @dayclick="interaccionCalendario" :value="null" color="yellow">
                    </v-calendar>
                </div>       
            </div>
        </div>
    </div>
</template>

<script>
import BotonAtras from '../components/BotonAtras.vue';
import Filtro from '../components/Filtro.vue';
import Idea from '../components/Idea.vue';
import BotonAnadirAlargado from '../components/BotonAnadirAlargado.vue';
import Pestana_Escenas from '../components/Pestana_Escenas.vue';
import Pestana_Participantes from '../components/Pestana_Participantes.vue';
import Calendario from '../components/Calendario.vue';
import PopUpCrearIdea from '../components/PopUpCrearIdea.vue';
import Vue from 'vue'


export default{
    name: "ProcesoCreativo",
    components: {
        BotonAtras,
        Filtro,
        Idea,
        BotonAnadirAlargado,
        Pestana_Escenas,
        Pestana_Participantes,
        Calendario,
        PopUpCrearIdea
    },
    data() {
        return {
            showPopupIdeas: false,
            showIdeas:false,
            showEscenas:false,
            showParticipantes:false,
            showEnsayos:false,
            procesoCreativo: {},
            procesoCreativoId: "",
            ideas: [],
            escenas: [],
            participantes: [],
            ensayos: [],
            days: [],
            attributes:[
                {
                    key: 'today',
                    highlight: {
                        color: 'purple',
                        fillMode: 'outline',
                    },
                    dates: new Date(),
                }
            ],
            value:''
        }
    },
    computed: {
        dates() {
            return this.days.map(day => day.date);
        }
    },
    mounted(){
        const procesoCreativoId = this.$route.params.procesoCreativoId;
        this.procesoCreativoId = procesoCreativoId
        this.fetchProcesoCreativoData(procesoCreativoId);
    },
    methods:{
        interaccionCalendario(day){
            this.$router.push(`/formularioEnsayo/procesoCreativo/${this.procesoCreativoId}/${day.id}`);
        },
        interaccion_popup(){
            if(this.showPopupIdeas) this.showPopupIdeas = false
            else this.showPopupIdeas = true 
        },
        display_ideas(){
            if(!this.showIdeas) this.showIdeas = true
            else this.showIdeas = false
        },
        display_escena(){
            if(!this.showEscenas) this.showEscenas = true
            else this.showEscenas = false
        },
        display_participantes(){
            if(!this.showParticipantes) this.showParticipantes = true
            else this.showParticipantes = false
        },
        display_ensayos(){
            if(!this.showEnsayos) this.showEnsayos = true
            else this.showEnsayos = false
        },
        irFormCrearEscena(){
            this.$router.push(`/formularioCrearEscena/${this.procesoCreativoId}`);
        },
        fetchProcesoCreativoData(procesoCreativoId) {
            const apiURL = `http://localhost:4000/procesoCreativo/${procesoCreativoId}`;
            this.$http.get(apiURL)
                .then(response => {
                const procesoCreativoData = response.data.data;
                Vue.set(this.procesoCreativo, 'title', procesoCreativoData.title);
                Vue.set(this.procesoCreativo, 'ideas', [...procesoCreativoData.ideas]);
                Vue.set(this.procesoCreativo, 'escenas', [...procesoCreativoData.escenas]);
                Vue.set(this.procesoCreativo, 'participantes', [...procesoCreativoData.participantes]);
                Vue.set(this.procesoCreativo, 'ensayos', [...procesoCreativoData.ensayos]);
                
                //RECOGER IDEAS DE PROCESO CREATIVO
                this.procesoCreativo.ideas.forEach((idea) => {
                const apiURLgetIdea = `http://localhost:4000/idea/${idea}`;
                this.$http.get(apiURLgetIdea)
                    .then(response => {
                        const IdeaData = response.data.data
                        const elementosIdea = {};
                        Vue.set(elementosIdea, 'type', IdeaData.type)
                        Vue.set(elementosIdea, 'content', IdeaData.content)
                        Vue.set(elementosIdea, 'id', idea)
                        this.$data.ideas.push(elementosIdea);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });

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

                //RECOGER PARTICIPANTES DE PROCESO CREATIVO
                this.procesoCreativo.participantes.forEach((participante)=>{
                    const apiURLgetParticipante = `http://localhost:4000/participante/${participante}`;
                    this.$http.get(apiURLgetParticipante)
                    .then(response => {
                        const ParticipanteData = response.data.data
                        const elementosParticipante = {};
                        Vue.set(elementosParticipante, 'userId', participante)
                        this.participantes.push(elementosParticipante)
                    })
                })

                //RECOGER ENSAYOS DE PROCESO CREATIVO
                this.procesoCreativo.ensayos.forEach((ensayo)=>{
                    const apiURLgetEnsayo = `http://localhost:4000/ensayo/${ensayo}`;
                    this.$http.get(apiURLgetEnsayo)
                    .then(response => {
                        const EnsayoData = response.data.data
                        const elementosEnsayo = {};
                        Vue.set(elementosEnsayo, 'fecha', ensayo)
                        this.ensayos.push(elementosEnsayo)

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

<style>
#apartado{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0px;
    gap: 30px;
    }

.contenido_scroll{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 35px;
    overflow-y: auto;
    overflow-x: hidden;
}

.titulos{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 32px;
}

.titulo_apartado{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 32px;
    }

.contenido_apartado{
    display: flex;
    width: 302px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0px;
    gap: 25px;
}

.carrusel.escenas{
    display: flex;
    flex-direction: row;
    gap: 14px;
    overflow-x: auto;
    width: auto;
}

.grid_dos_filas{
    width: 302px;
    display:grid;
    grid-auto-flow:column dense; /* column flow with "dense" to fill all the cells */
    grid-template-rows:auto auto; /* 2 rows */
    grid-auto-columns:auto;
    overflow-x: scroll;
    gap: 10px;
}

</style>