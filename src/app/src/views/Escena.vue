<template>
    <div class="main-div">
            <BotonAtras route_to="/procesoCreativo"/>
        <h2>Nombre escena</h2>
        <BotonAnadirAlargado label="Añadir apartado +"/>
        <div class="contenido_scroll">
            <!-- ***** APARTADO IDEAS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_ideas">
                    <h3>Ideas</h3>
                    <i v-if="!showIdeas" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showIdeas">
                    <BotonAnadirAlargado label="Añadir idea +"/>
                    <Idea texto_idea="Lore Ipsumxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
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
                    <BotonAnadirAlargado label="Añadir pauta de movimiento +"/>
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
                    <BotonAnadirAlargado label="Añadir recorrido espacial +" route_to="/formularioRecorridoEspacial"/>
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
                    <BotonAnadirAlargado label="Añadir ensayo +"/>
                    <Calendario/>
                </div>
            </div>
            <!-- ***** APARTADO OBJETOS *****-->
            <div class="apartado">
                <div class="titulo_apartado" @click="display_objetos">
                    <h3>Objetos</h3>
                    <i v-if="!showObjetos" class="material-symbols-outlined dropdown">arrow_drop_down</i>
                    <i v-else class="material-symbols-outlined dropdown">arrow_drop_up</i>
                </div>
                <div class="contenido_apartado" v-if="showObjetos">
                    <BotonAnadirAlargado label="Añadir objeto +"/>
                    
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
import Calendario from '../components/Calendario.vue';

export default{
    components: {BotonAtras,BotonAnadirAlargado,Filtro,Idea,Pestana_Participantes,Calendario},
    data() {
        return {
            showIdeas:false,
            showPautaMovimiento:false,
            showRecorridoEspacial:false,
            showParticipantes:false,
            showEnsayos:false,
            showObjetos:false,
        }
    },
    methods:{
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


</style>