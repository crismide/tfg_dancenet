<template>
  <div id="frame_proceso_creativo">
    <!--<img src="../assets/imagen_bolero.png" width="134px" height="136px">-->
    <div id="imagen_proceso"></div>
    <h3 font-weight="700" font-size="20px" line-height="24px">{{ nombre_proceso }}</h3>
    <div id="frame_etiquetas">
        <button class="boton_proceso_creativo">#danza_contemporánea</button>
        <button class="boton_proceso_creativo">#bolero_ravel</button>
        <button class="boton_proceso_creativo">#csdvnd</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['nombre_proceso']
}
</script>

<style>
#frame_proceso_creativo{
    width: 134px;
    height: 205px;
    flex-direction: column;
    align-items: flex-start;
    gap: -5px;
    font-family: 'Inter';
    font-style: normal;
}

#imagen_proceso{
  background-image: url("../assets/imagen_bolero.png");
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