<template>
    <div class="pestana" @click="changeColors">
        <div class="dos_columnas">
            <div class="foto participante"></div>
            <h4>{{ nombre }}</h4>
        </div>
        
    </div>
</template>

<script>
export default{
    props:["nombre","imagen","roles"],
    methods: {
        changeColors() {
        this.$el.classList.toggle("active");
        }
    }
}
</script>

<style>
.pestana.active {
  background: #858585;
  color: #fff;
}

.dos_columnas{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 18px 32px;
    gap: 37px;
}

.foto.participante{
    width: 64px;
    height: 64px;
    background-image: url("../assets/default_proceso.png");
}
</style>