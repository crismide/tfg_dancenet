<template>
    <div class="frame_botones">
        <button type="button" class="button_crear gris" @click="atras">Cancelar</button>
        <button type="button" class="button_crear morado" @click="hacia">Crear</button>
        
    </div>
</template>

<script>
import router from '@/router';

export default{
    props:['irHacia'],
    methods:{
        atras(){
            router.go(-1);
        },
        hacia(){
            this.$router.push(this.irHacia);
        }
    }
}
</script>

<style>
    .frame_botones{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px;
        width: 100%;
        height: auto;
    }
    
    .button_crear{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 15px 56px;
        gap: 10px;
        border: 0px;
        width: 132px;
        height: 54px;
        
        border-radius: 25px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        color: #FFFFFF;
    }

    .button_crear.gris{
        background: #5B5B5B;
    }

    .button_crear.morado{
        background: #C286F1;
    }
</style>