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
            userId:''
        }
    },
    mounted(){
        this.userId = this.$route.params.userId;
        
    },
    methods: {
        handleSubmitForm() {
            let apiURLcrear = `http://localhost:4000/crear-procesoCreativo`;
            let apiURLasignar = `http://localhost:4000/user/asignar-procesoCreativo/`;

            this.$http.post(apiURLcrear, this.procesoCreativo)
                .then((response) => {
                const procesoCreativoId = response.data.data._id; // Access the created ProcesoCreativo ID
                apiURLasignar = apiURLasignar + this.userId + "/" + procesoCreativoId;
                console.log("apiAsignar: "+apiURLasignar)
                this.$http.post(apiURLasignar)
                    .then(() => {
                    console.log("Proceso creativo asignado a usuario");
                    //`/procesoCreativo/${procesoCreativoId}`
                    this.$router.push({
                        path: `/procesoCreativo/${procesoCreativoId}`, 
                        query: {userId: this.userId}
                    })
                    this.procesoCreativo = {
                        title: ''
                        };
                    })
                    .catch(error => {
                    console.log(error);});})
                    .catch(error => {
                    console.log(error);
            });
        },
        goToPreviousView() {
            router.go(-1);
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