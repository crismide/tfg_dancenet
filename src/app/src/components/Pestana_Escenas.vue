<template>
    <button type="button" class="pestana" @click="irEscena">
        <h4>{{ nombre_proceso }}</h4>
        <p>vkfndmvh</p>
    </button>
</template>

<script>
export default{
    props:["nombre_proceso","roles","route_to"],
    methods:{
        irEscena(){
            this.$router.push(this.route_to);
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