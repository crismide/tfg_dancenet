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
    height: 205px;
    width: 134px;
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
    height: 205px;
    width: 134px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;
    overflow: auto;
}

.boton_proceso_creativo{
  box-sizing: border-box;
  height: 40px;
  background-color: transparent;
  border: 1px solid #C286F1;
  border-radius: 25px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  align-items: center;
  color: #C286F1;
}

.boton_proceso_creativo:hover{
  box-sizing: border-box;
  height: 40px;
  background-color: #C286F1;
  border: 1px solid #C286F1;
  border-radius: 25px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  align-items: center;
  color: #ffffff;
}

</style>