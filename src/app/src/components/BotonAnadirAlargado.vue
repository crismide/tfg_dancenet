<template>
    <button type="button" id="anadir_alargado" @click="$emit('mostrar-popup')">{{ label }}</button>
</template>

<script>
export default{
    props: ["label"],
    methods:{
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