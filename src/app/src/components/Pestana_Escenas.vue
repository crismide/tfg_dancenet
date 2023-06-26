<template>
    <button type="button" class="pestana" @click="irEscena">
        <h4>{{ nombre_escena }}</h4>
    </button>
</template>

<script>
export default{
    props:["nombre_escena","id","nombre_proceso"],
    methods:{
        irEscena(){
            this.$router.push(`/procesoCreativo/${this.nombre_proceso}/escena/${this.id}`);
        }
    }}
</script>

<style>
.pestana{
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 0px;
    width: auto;
    height: auto;
    padding: 0px 25px;
    word-wrap: break-word;
    background: #D9D9D9;
    border-radius: 50px;
    border: none;
}
</style>