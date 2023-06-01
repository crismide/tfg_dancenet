<template>
    <div class="main-div">
        <BotonAtras/>
        <h1>Nombre proceso</h1>
        <div id="apartados_proceso_creativo">
            <!-- ***** APARTADO IDEAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ideas">
                    <h2>Ideas</h2>
                    <i class="material-symbols-outlined dropdown">arrow_drop_down</i>
                </div>
                <div class="contenido_apartado" v-if="showIdeas">
                    <div class="carrusel">
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
                    <i class="material-symbols-outlined dropdown">arrow_drop_down</i>
                </div>
                <div class="contenido_apartado" v-if="showEscenas">
                    <BotonAnadirAlargado label="Añadir escena +"/>
                    <div class="carrusel">
                        <Pestana_Escenas nombre_proceso="Lore ipsum" escenas="12"/>
                        <Pestana_Escenas nombre_proceso="Lore ipsum" escenas="12"/>
                    </div>
                    
                </div>
            </div>

            <!-- ***** APARTADO PARTICIPANTES *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_participantes">
                    <h2>Participantes</h2>
                    <i class="material-symbols-outlined dropdown">arrow_drop_down</i>
                </div>
                <div class="contenido_apartado" v-if="showParticipantes">
                    <div class="carrusel">
                        <Filtro nombre_filtro="Ordenar"/>
                        <Filtro nombre_filtro="Rol"/>
                    </div>
                    <BotonAnadirAlargado label="Añadir participante +"/>
                    <div class="carrusel">
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
                    <i class="material-symbols-outlined dropdown">arrow_drop_down</i>
                </div>
                <div class="contenido_apartado" v-if="showEnsayos">
                    <p>placeholder</p>
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

#apartados_proceso_creativo{
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

</style>