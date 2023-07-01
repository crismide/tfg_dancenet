<template>
    <div class="main-div">
        <h3>Creando una nueva escena</h3>
        <form @submit.prevent="handleSubmitForm" class="formulario">
            <label for="name">¿Cómo quieres llamarla?</label><br><br>
            <input type="text" id="name" name="name" v-model="escena.name" placeholder="Nombre de la escena"><br><br>
            <label>
                <input type="checkbox" class="cbox" value="first_checkbox">
                Aún no sé que nombre ponerle, ponle uno por defecto
            </label><br><br>
            <div class="frame_botones">
                <button type="button" class="button_crear gris" @click="atras">Cancelar</button>
                <button type="submit" class="button_crear morado">Crear</button>
            </div>
        </form>
            
    </div>
</template>

<script>
import router from '@/router';
import Vue from 'vue'

export default{
    data() {
        return {
            escena: {
                name: ''
            },
            userId:'',
            participantes: []
        }
    },
    mounted(){
        this.userId = this.$route.query.userId
    },
    methods:{
        
        atras(){
            router.go(-1);
        },
        handleSubmitForm() {
            let apiURLcrear = `http://localhost:4000/crear-escena`;
            let apiURLasignar = `http://localhost:4000/procesoCreativo/asignar-escena/`;
            let apiURLgetParticipantes = `http://localhost:4000/procesoCreativo/encontrar-participantes/`
            let apiURLpostParticipantes = `http://localhost:4000/escena/asignar-participante/`

            this.$http.post(apiURLcrear, this.escena).then((response) => {
                const escenaId = response.data.data._id; // Access the created ProcesoCreativo ID
                const procesoCreativoId = this.$route.params.procesoCreativoId;

                apiURLasignar = apiURLasignar + procesoCreativoId + "/" + escenaId;
                apiURLgetParticipantes = apiURLgetParticipantes + procesoCreativoId + "/participantes"
                apiURLpostParticipantes = apiURLpostParticipantes +escenaId + "/"

                this.$http.post(apiURLasignar).then(() => {
                    this.$http.get(apiURLgetParticipantes).then((response) => {
                        const participantes = response.data.data;
                        participantes.forEach(participante => {
                            apiURLpostParticipantes = apiURLpostParticipantes + participante
                            this.$http.post(apiURLpostParticipantes).then(() => {
                                this.$router.push({
                                    path: `/procesoCreativo/${procesoCreativoId}/escena/${escenaId}`, 
                                    query: {userId: this.userId}
                                })
                            })
                        })
                        
                        
                    }).catch((error) => {console.log(error)})
                }).catch(error => {console.log(error);}
                );}).catch(error => {console.log(error);
            });
        }
    }
}

/*this.$router.push({
                                path: `/procesoCreativo/${procesoCreativoId}/escena/${escenaId}`, 
                                query: {userId: this.userId}
                            })*/
</script>

<style>
    input[type=text]{
        border:none;
        border-bottom: 1px solid #939393;
        width: 90%;
        color: #929292;
        font-size: 15px;
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    
    label{
        color: #000;
        font-size: 15px;
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    
</style>