<template>
    <div class="main-div">
        <h3>Creando una nueva escena</h3>
        <label for="fname">¿Cómo quieres llamarla?</label><br>
        <input type="text" id="fname" name="fname" placeholder="Nombre de la escena"><br><br>
        <label>
            <input type="checkbox" class="cbox" value="first_checkbox">
            Aún no sé que nombre ponerle, ponle uno por defecto
        </label><br><br>
        <BotonesCrear irAtras="/procesoCreativo" irHacia="/procesoCreativo/Escena"/>
    </div>
</template>

<script>
import BotonesCrear from '../components/BotonesCrear.vue';
export default{
    components: { 
        BotonesCrear 
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