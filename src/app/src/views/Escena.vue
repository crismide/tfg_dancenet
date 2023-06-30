<template>
    <div class="main-div">
        <div @click="irProcesoCreativo">
            <BotonAtras/>
        </div>
            
        <h2 style="color: #FFC46B;">{{escena.name}}</h2>
        <div class="contenido_scroll">
            <!-- ***** APARTADO IDEAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ideas">
                    <h3>Ideas</h3>
                    <i v-if="!showIdeas" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showIdeas">
                    <BotonAnadirAlargado label="Añadir idea +" @mostrar-popup="interaccion_popup"/>
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
                        :where="'escena'"
                    />
                </div>
            </div>
            <!-- ***** APARTADO PAUTAS DE MOVIMIENTO *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_pautamovimiento">
                    <h3>Pautas de movimiento</h3>
                    <i v-if="!showPautaMovimiento" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showPautaMovimiento">
                    <div @click="irFormCrearPautaMovimiento">
                        <BotonAnadirAlargado label="Añadir pauta de movimiento +"/>
                    </div>
                    
                    <div>
                        <div class="elementos_horizontales">
                            <div class="cuadrado verde"></div>
                            Nivel bajo
                        </div>
                        <div class="elementos_horizontales">
                            <div class="cuadrado morado"></div>
                            Nivel medio
                        </div>
                        <div class="elementos_horizontales">
                            <div class="cuadrado rojo"></div>
                            Nivel alto
                        </div>
                    </div>

                    <div v-for="pautaMovimiento in pautasMovimiento">
                        <h5>{{ pautaMovimiento.name }}</h5>
                        <p> {{ pautaMovimiento.description }}</p>
                        <p> Nivel: {{ pautaMovimiento.level }}</p>
                    </div>

                </div>
            </div>
            <!-- ***** APARTADO RECORRIDO ESPACIAL *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_recorridoespacial">
                    <h3>Recorrido espacial</h3>
                    <i v-if="!showRecorridoEspacial" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showRecorridoEspacial">
                    <div @click="irFormCrearRecorridoEspacial">
                        <BotonAnadirAlargado label="Añadir recorrido espacial +"/>
                    </div>
                    <div class="display_individual">
                        <div v-for="recorridoEspacial in recorridosEspaciales">
                            <img :src="recorridoEspacial.image" alt="Imagen cargada" width="200"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ***** APARTADO PARTICIPANTES *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_participantes">
                    <h3>Participantes</h3>
                    <i v-if="!showParticipantes" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showParticipantes">
                    <BotonAnadirAlargado label="Añadir rol +"/>
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
                    <h3>Ensayos</h3>
                    <i v-if="!showEnsayos" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showEnsayos">
                    <v-calendar :attributes='attributes' @dayclick="interaccionCalendario" :value="null" color="yellow">
                    </v-calendar>
                </div>
            </div>
            <!-- ***** APARTADO OBJETOS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_objetos">
                    <h3>Objetos</h3>
                    <i v-if="!showObjetos" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado espaciado" v-if="showObjetos">
                    <div @click="irFormCrearObjeto">
                        <BotonAnadirAlargado label="Añadir objeto +"/><br><br>
                        <div v-for="objeto in objetos" class="apartado">
                            <img :src="objeto.image" alt="Imagen cargada" width="200"/><br><br>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BotonAtras from '../components/BotonAtras.vue';
import BotonAnadirAlargado from '../components/BotonAnadirAlargado.vue';
import Filtro from '../components/Filtro.vue';
import Idea from '../components/Idea.vue';
import Pestana_Participantes from '../components/Pestana_Participantes.vue';
import PopUpCrearIdea from '../components/PopUpCrearIdea.vue';
import Vue from 'vue'

export default{
    components: {BotonAtras,BotonAnadirAlargado,Filtro,Idea,Pestana_Participantes,PopUpCrearIdea},
    data() {
        return {
            showPopupIdeas: false,
            showIdeas:false,
            showPautaMovimiento:false,
            showRecorridoEspacial:false,
            showParticipantes:false,
            showEnsayos:false,
            showObjetos:false,
            escenaId: "",
            escena: {},
            ideas: [],
            pautasMovimiento: [],
            recorridosEspaciales: [],
            participantes: [],
            ensayos: [],
            objetos: [],
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
            value:'',
            userId:''
        }
    },
    computed: {
        dates() {
            return this.days.map(day => day.date);
        }
    },
    mounted(){
        this.escenaId = this.$route.params.escenaId;
        this.procesoCreativoId = this.$route.params.procesoCreativoId;
        this.userId = this.$route.query.userId;
        this.fetchEscenaData(this.escenaId);
    
    },
    methods:{
        interaccionCalendario(day){
            this.$router.push({
                path: `/formularioEnsayo/escena/${this.escenaId}/${day.id}`, 
                query: {procesoCreativoId: this.procesoCreativoId, userId: this.userId}
            })
        },
        irFormCrearPautaMovimiento(){
            this.$router.push({
                path: `/formularioPautaMov/${this.escenaId}`, 
                query: {procesoCreativoId: this.procesoCreativoId, userId: this.userId}
            })
        },
        irFormCrearObjeto(){
            this.$router.push({
                path: `/formularioObjeto/${this.escenaId}`, 
                query: {procesoCreativoId: this.procesoCreativoId, userId: this.userId}
            })
        },
        irFormCrearRecorridoEspacial(){
            this.$router.push({
                path: `/formularioRecorridoEspacial/${this.escenaId}`, 
                query: {procesoCreativoId: this.procesoCreativoId, userId: this.userId}
            })
        },
        irProcesoCreativo(){
            this.$router.push({
                path: `/procesoCreativo/${this.procesoCreativoId}`, 
                query: {userId: this.userId}
            })
        },
        interaccion_popup(){
            if(this.showPopupIdeas) this.showPopupIdeas = false
            else this.showPopupIdeas = true 
        },
        display_ideas(){
            if(!this.showIdeas) this.showIdeas = true
            else this.showIdeas = false
        },
        display_pautamovimiento(){
            if(!this.showPautaMovimiento) this.showPautaMovimiento = true
            else this.showPautaMovimiento = false
        },
        display_recorridoespacial(){
            if(!this.showRecorridoEspacial) this.showRecorridoEspacial = true
            else this.showRecorridoEspacial = false
        },
        display_participantes(){
            if(!this.showParticipantes) this.showParticipantes = true
            else this.showParticipantes = false
        },
        display_ensayos(){
            if(!this.showEnsayos) this.showEnsayos = true
            else this.showEnsayos = false
        },
        display_objetos(){
            if(!this.showObjetos) this.showObjetos = true
            else this.showObjetos = false
        },
        fetchEscenaData(escenaId) {
            const apiURL = `http://localhost:4000/escena/${escenaId}`;
            this.$http.get(apiURL)
                .then(response => {
                const escenaData = response.data.data;
                Vue.set(this.escena, 'name', escenaData.name);
                Vue.set(this.escena, 'id', escenaData._id);
                Vue.set(this.escena, 'ideas', [...escenaData.ideas]);
                Vue.set(this.escena, 'pautasMovimiento', [...escenaData.pautasMovimiento]);
                Vue.set(this.escena, 'recorridosEspaciales', [...escenaData.recorridosEspaciales]);
                Vue.set(this.escena, 'participantes', [...escenaData.participantes]);
                Vue.set(this.escena, 'ensayos', [...escenaData.ensayos]);
                Vue.set(this.escena, 'objetos', [...escenaData.objetos]);

                //RECOGER IDEAS DE ESCENA
                this.escena.ideas.forEach((idea) => {
                const apiURLgetIdea = `http://localhost:4000/idea/${idea}`;
                this.$http.get(apiURLgetIdea)
                    .then(response => {
                        const IdeaData = response.data.data
                        const elementosIdea = {};
                        Vue.set(elementosIdea, 'type', IdeaData.type)
                        Vue.set(elementosIdea, 'content', IdeaData.content)
                        Vue.set(elementosIdea, 'id', idea)
                        this.ideas.push(elementosIdea);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
                
                //RECOGER PAUTAS DE MOVIMIENTO DE ESCENA
                this.escena.pautasMovimiento.forEach((pautaMovimiento) => {
                    console.log("pautaMovimiento "+pautaMovimiento)
                const apiURLgetPautaMovimiento = `http://localhost:4000/pautaMovimiento/${pautaMovimiento}`;
                console.log("apiURL "+apiURLgetPautaMovimiento)
                this.$http.get(apiURLgetPautaMovimiento)
                    .then(response => {
                        const PautaMovimientoData = response.data.data
                        const elementosPautaMovimiento = {};
                        Vue.set(elementosPautaMovimiento, 'name', PautaMovimientoData.name)
                        Vue.set(elementosPautaMovimiento, 'description', PautaMovimientoData.description)
                        //Vue.set(elementosPautaMovimiento, 'inicialTime', PautaMovimientoData.inicialTime)
                        //Vue.set(elementosPautaMovimiento, 'finalTime', PautaMovimientoData.finalTime)
                        //Vue.set(elementosPautaMovimiento, 'participantes', [...PautaMovimientoData.participantes]);
                        Vue.set(elementosPautaMovimiento, 'level', PautaMovimientoData.level)
                        Vue.set(elementosPautaMovimiento, 'id', pautaMovimiento)
                        console.log(elementosPautaMovimiento)
                        this.pautasMovimiento.push(elementosPautaMovimiento);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
                
                //RECOGER RECORRIDO ESPACIAL DE ESCENA
                this.escena.recorridosEspaciales.forEach((recorridoEspacial) => {
                const apiURLgetRecorridoEspacial = `http://localhost:4000/recorridoEspacial/${recorridoEspacial}`;
                this.$http.get(apiURLgetRecorridoEspacial)
                    .then(response => {
                        const RecorridoEspacialData = response.data.data
                        const elementosRecorridoEspacial = {};
                        Vue.set(elementosRecorridoEspacial, 'image', RecorridoEspacialData.image)
                        Vue.set(elementosRecorridoEspacial, 'id', recorridoEspacial)
                        this.recorridosEspaciales.push(elementosRecorridoEspacial);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
                
                //RECOGER PARTICIPANTES DE ESCENA
                this.escena.participantes.forEach((participante)=>{
                    const apiURLgetParticipante = `http://localhost:4000/participante/${participante}`;
                    this.$http.get(apiURLgetParticipante)
                    .then(response => {
                        const ParticipanteData = response.data.data
                        const elementosParticipante = {};
                        Vue.set(elementosParticipante, 'userId', participante)
                        this.participantes.push(elementosParticipante)
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })

                //RECOGER ENSAYOS DE PROCESO CREATIVO
                this.escena.ensayos.forEach((ensayo)=>{
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

                //RECOGER OBJETOS DE ESCENA
                this.escena.objetos.forEach((objeto) => {
                const apiURLgetObjeto = `http://localhost:4000/objeto/${objeto}`;
                this.$http.get(apiURLgetObjeto)
                    .then(response => {
                        const ObjetoData = response.data.data
                        const elementosObjeto = {};
                        Vue.set(elementosObjeto, 'image', ObjetoData.image)
                        Vue.set(elementosObjeto, 'pautaMovimiento', ObjetoData.pautaMovimiento)
                        Vue.set(elementosObjeto, 'participantes', [...ObjetoData.participantes]);
                        Vue.set(elementosObjeto, 'responsable', ObjetoData.responsable)
                        Vue.set(elementosObjeto, 'id', objeto)
                        this.objetos.push(elementosObjeto);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                });
            })
        }
    }
}
</script>

<style>
#apartados_escena{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 25px;
    overflow-y: auto;
    overflow-x: hidden;
}

.espaciado{
    gap: 20px;
}

.cuadrado{
    width: 22px;
    height: 22px;
}

.cuadrado.rojo{
    background-color: #FF8282;
}

.cuadrado.morado{
    background-color: #868AF1;
}

.cuadrado.verde{
    background-color: #B4F186;
}

.display_individual{
    width: 200px;
    display:grid;
    grid-auto-flow:column dense; /* column flow with "dense" to fill all the cells */
    grid-template-rows:auto; /* 2 rows */
    grid-auto-columns:auto;
    overflow-x: scroll;
    gap: 10px;
}
</style>