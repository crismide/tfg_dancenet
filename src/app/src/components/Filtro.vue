<template>
    <button type="button" class="filtro_procesos">{{ nombre_filtro }}</button>
</template>

<script>
export default {
  props: ['nombre_filtro']
}
</script>

<style>
button.filtro_procesos{
    height: 30px;
    width: 100px;
    background: #D9D9D9;
    border-radius: 6px;
    font-weight: 700;
    font-size: 14px;
    align-items: center;
    color: #000000;
    border: none;
}
</style>