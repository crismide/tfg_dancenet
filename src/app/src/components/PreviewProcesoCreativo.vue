<template>
  <div id="frame_proceso_creativo">
    <div id="imagen_proceso"  @click="entrarEnProceso"></div>
    <h3 font-weight="700" font-size="20px" line-height="24px">{{ nombre_proceso }}</h3>
  </div>
</template>

<script>
export default {
  props: ['nombre_proceso','id','userId'],
  methods:{
    entrarEnProceso(){
      this.$router.push({
        path: `/procesoCreativo/${this.id}`, 
        query: {userId: this.userId}
      })
    }
  }
}
</script>

<style>
#frame_proceso_creativo{
    width: 134px;
    height: 205px;
    flex-direction: column;
    word-wrap: break-word;
}

#imagen_proceso{
  background-image: url("../assets/default_proceso.png");
  width: 134px;
  height: 136px;
  background-size: cover;
}

#frame_etiquetas{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;
    overflow: auto;
}

.boton_proceso_creativo{
  width: fit-content;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border: 2px solid #C286F1;
  border-radius: 25px;
  background: transparent;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;

  color: #C286F1;
  }


</style>