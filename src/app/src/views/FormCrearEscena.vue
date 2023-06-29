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


export default{
    data() {
        return {
            escena: {
                name: ''
            },
            procesoCreativo: {}
        }
    },
    methods:{
        atras(){
            router.go(-1);
        },
        handleSubmitForm() {
            let apiURLcrear = `http://localhost:4000/crear-escena`;
            let apiURLasignar = `http://localhost:4000/procesoCreativo/asignar-escena/`;

            this.$http.post(apiURLcrear, this.escena)
                .then((response) => {
                const escenaId = response.data.data._id; // Access the created ProcesoCreativo ID
                const procesoCreativoId = this.$route.params.procesoCreativoId;
                apiURLasignar = apiURLasignar + procesoCreativoId + "/" + escenaId;
                console.log("apiAsignar: "+apiURLasignar)
                this.$http.post(apiURLasignar)
                    .then(() => {
                    console.log("Escena asignada a proceso creativo");
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

<style>
    input[type=text]{
        border:none;
        border-bottom: 1px solid #939393;
        width: 100%;
    }
    /* Style the custom checkbox */
    input[type="checkbox"].cbox + label {
        position: relative;
        padding-left: 40px;
    }

    /* Create the checkbox appearance */
    input[type="checkbox"].cbox + label::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 0;
        width: 34px;
        height: 34px;
        border: 0px;
        background-color: #D9D9D9;
    }
    
    
</style>