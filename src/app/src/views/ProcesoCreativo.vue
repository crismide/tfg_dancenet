<template>
    <div class="main-div">
        <BotonAtras route_to="/"/>
        <h1>Nombre proceso</h1>
        <div class="contenido_scroll">
            <!-- ***** APARTADO IDEAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ideas">
                    <h2>Ideas</h2>
                    <i v-if="!showIdeas" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showIdeas">
                    <router-link to="/procesoCreativo/escena">
                        <BotonAnadirAlargado label="Añadir idea +"/>
                    </router-link>
                    <div class="elementos_horizontales carrusel">
                        <Filtro nombre_filtro="Ordenar"/>
                        <Filtro nombre_filtro="Etiquetas"/>
                        <Filtro nombre_filtro="Creadorx"/>
                    </div>
                    <Idea texto_idea="Lore Ipsumxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
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
                    <router-link to="/procesoCreativo/escena">
                        <BotonAnadirAlargado label="Añadir escena +"/>
                    </router-link>
                    
                    <div class="elementos_horizontales carrusel">
                        <Pestana_Escenas nombre_proceso="Lore ipsum" escenas="12"/>
                        <Pestana_Escenas nombre_proceso="Lore ipsum" escenas="12"/>
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
                    <Calendario/>
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

export default{
    name: "ProcesoCreativo",
    components: {
        BotonAtras,
        Filtro,
        Idea,
        BotonAnadirAlargado,
        Pestana_Escenas,
        Pestana_Participantes,
        Calendario
    },
    data() {
        return {
            showIdeas:false,
            showEscenas:false,
            showParticipantes:false,
            showEnsayos:false
        }
    },
    methods:{
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