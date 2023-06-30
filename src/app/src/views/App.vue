<template>
    <div>
        <router-view/>
        <nav>
            <div id="barra_navegacion" pantalla_seleccionada="mi_perfil">
                    <router-link to="/">
                        <i class="material-icons" width="33px" height="33px">person</i>
                    </router-link>
                    
                    <i class="material-icons" width="33px" height="33px">search</i>
                    <i class="material-symbols-outlined" width="33px" height="33px">group</i>
                    <i class="material-icons" width="33px" height="33px">event</i>
            </div>
        </nav>
    </div>
</template>

<script>
export default{
    props: ['pantalla_seleccionada']
}
</script>

<style>
#barra_navegacion{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 18%;
  height: 25%;
  width: auto;
  height: 60px;
  background: #D9D9D9;
}
</style>