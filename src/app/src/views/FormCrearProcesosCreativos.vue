<template>
    <div class="main-div">
        <h2>Creando un nuevo preoceso creativo</h2>
        <form class="formulario" @submit.prevent="handleSubmitForm">
            <label for="fname">¿Cómo quieres llamarlo?</label>
            <input type="text" id="fname" name="fname" v-model="procesoCreativo.nombre"><br><br><br>
            <label><input type="checkbox" id="cbox1" value="first_checkbox"> Aún no sé que nombre ponerle, ponle uno por defecto</label><br><br><br>
            <label>¿Con quién lo quieres compartir?</label><br><br>
            <select>
                <option>Con todo el mundo</option>
                <option>Con mis amistades</option>
                <option>Con nadie</option>
            </select>
            <BotonesCrear irAtras="/" irHacia="/procesoCreativo"/>
            
        </form>
    </div>
</template>

<script>
import BotonesCrear from '../components/BotonesCrear.vue';
import axios from "axios";

export default{
    name: "FormCrearProcesosCreativos",
    components: { 
        BotonesCrear 
    },
    data() {
        return {
            procesoCreativo: {
                nombre: ''
            }
        }
    },
    methods: {
        handleSubmitForm() {
            let apiURL = 'http://localhost:4000/api/crear-procesoCreativo';
            
            axios.post(apiURL, this.student).then(() => {
                this.$router.push('/')
                this.procesoCreativo = {
                    nombre: ''
                }
            }).catch(error => {
                console.log(error)
            });
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

</style>