<template>
    <button type="button" id="boton_atras" @click="irAtras">
        <i class="material-symbols-outlined" width="88px" height="88px" id="icono_flecha">arrow_back_ios_new</i>
    </button>
    
</template>

<script>
import router from '@/router';

export default{
    props:['id','route'],
    methods:{
        irAtras(){
            this.$router.push(this.route + this.id)
        }
    }
}
</script>

<style>
#boton_atras{
    width: 10%;
    background-color: transparent;
    border: 0px;
}

#icono_flecha{
    color: #B5B5B5;
}
</style>
