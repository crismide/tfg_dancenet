<template>
    <button type="button" id="anadir_alargado" @click="irHacia">{{ label }}</button>
</template>

<script>
export default{
    props: ["label","route_to"],
    methods:{
        irHacia(){
            this.$router.push(this.route_to);
        }
    }
}
</script>

<style>
button#anadir_alargado{
    width: auto;
    height: 23px;
    border: 1px solid #828282;
    background-color: transparent;
    color: #ABABAB;
}
</style>