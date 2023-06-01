<template>
    <div class="main-div">
        <h2>Creando un nuevo preoceso creativo</h2>
        <form>
            <label for="fname">¿Cómo quieres llamarlo?</label><br><br>
            <input type="text" id="fname" name="fname"><br><br>
            <label><input type="checkbox" id="cbox1" value="first_checkbox"> Aún no sé que nombre ponerle, ponle uno por defecto</label><br><br>
            <label>¿Con quién lo quieres compartir?</label>
            <select>
                <option>Con todo el mundo</option>
                <option>Con mis amistades</option>
                <option>Con nadie</option>
            </select>
            <BotonesCrear/>
            
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
.form-control{
  font-family: 'Helvetica Neue';
  font-style: normal;
  margin: 0; 
  height: 100%; 
}


</style>