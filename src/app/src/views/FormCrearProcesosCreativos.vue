<template>
    <div class="main-div">
        <h2>Creando un nuevo preoceso creativo</h2>
        <form class="formulario" @submit.prevent="handleSubmitForm">
            <label for="title">¿Cómo quieres llamarlo?</label><br><br>
            <input type="text" id="title" name="title" v-model="procesoCreativo.title"><br><br><br>
            <label><input type="checkbox" id="cbox1" value="first_checkbox"> Aún no sé que nombre ponerle, ponle uno por defecto</label><br><br><br>
            <label>¿Con quién lo quieres compartir?</label><br><br>
            <select>
                <option>Con todo el mundo</option>
                <option>Con mis amistades</option>
                <option>Con nadie</option>
            </select><br><br><br>
            <div class="frame_botones">
                <button type="button" class="button_crear gris" @click="goToPreviousView">Cancelar</button>
                <button type="submit" class="button_crear morado">Crear</button>
            </div>
            
        </form>
    </div>
</template>

<script>

import router from '@/router';
import Vue from 'vue'

export default{
    name: "FormCrearProcesosCreativos",
    data() {
        return {
            procesoCreativo: {
                title: '',
                completed: false
            },
            participante: {
                userId: '',
                name:''
            },
            userId:'',
            procesoCreativoId:'',
            participanteId:''
        }
    },
    mounted(){
        this.userId = this.$route.params.userId;
        this.participante.userId = this.userId;
        this.getUserName(this.userId)
    },
    methods: {
        handleSubmitForm() {
            let apiURLcrear = `http://localhost:4000/crear-procesoCreativo`;
            let apiURLasignarUser = `http://localhost:4000/user/asignar-procesoCreativo/`;
            let apiURLcrearParticipante = `http://localhost:4000/crear-participante`;
            let apiURLasignarParticipante = `/procesoCreativo/asignar-participante/`

            this.$http.post(apiURLcrear, this.procesoCreativo).then((response) => {
                this.procesoCreativoId = response.data.data._id
                apiURLasignarUser = apiURLasignarUser + this.userId + "/" + this.procesoCreativoId
                this.$http.post(apiURLasignarUser).then(() => {
                    this.$http.post(apiURLcrearParticipante,this.participante).then((response) => {
                        this.participanteId = response.data.data._id
                        apiURLasignarParticipante = apiURLasignarParticipante + this.procesoCreativoId + "/" + this.participanteId
                        this.$http.post(apiURLasignarParticipante).then(() => {
                            this.$router.push({
                                path: `/procesoCreativo/${this.procesoCreativoId}`, 
                                query: {userId: this.userId}
                            })
                        }).catch((error) => {console.log(error)})
                    }).catch((error) => {console.log(error)})
                }).catch((error) => {console.log(error)})
            }).catch((error) => {console.log(error)})

            /*
                .then((response) => {
                    const procesoCreativoId = response.data.data._id; // Access the created ProcesoCreativo ID
                    apiURLasignarUser = apiURLasignarUser + this.userId + "/" + procesoCreativoId;
                    this.$http.post(apiURLasignar)
                        .then(() => {
                            this.$router.push({
                                path: `/procesoCreativo/${procesoCreativoId}`, 
                                query: {userId: this.userId}
                            })
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    })
                    .catch(error => {
                        console.log(error);
                });
            */
        },
        goToPreviousView() {
            router.go(-1);
        },

        getUserName(userId){
            const URLgetName = `http://localhost:4000/user/${userId}`
            this.$http.get(URLgetName).then((response) => {
                this.participante.name = response.data.data.name
            }).catch(error => { console.log(error); })
        }
}
}

</script>

<style>
.formulario{
    justify-content: center;
    align-items: flex-start;
    gap: 22px;
}

.form-control{
  font-family: 'Helvetica Neue';
  font-style: normal;
  margin: 0; 
  height: 100%; 
}

select{
    background-color: #ECECEC;
    border: none;
    width: 227px;
    height: 45px;
}

input[type=text]:focus{
    border-color:none;
    box-shadow: 0px 0px 0px 0px;
    border-bottom: 4px solid #939393;
    width: 90%;
    color: #929292;
}

</style>