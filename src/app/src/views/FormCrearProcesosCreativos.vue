<template>
    <div class="main-div">
        <h2>Creando un nuevo preoceso creativo</h2>
        <form class="formulario">
            <label for="fname">¿Cómo quieres llamarlo?</label>
            <input type="text" id="fname" name="fname"><br><br><br>
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
export default{
    name: "FormCrearProcesosCreativos",
    components: { 
        BotonesCrear 
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