<template>
    <button 
        type="button" 
        class="pestana" 
        @click="selectEscena"
        :class="{ selected: isSelected }">
        <h4>{{ nombre_escena }}</h4>
    </button>
</template>

<script>
export default{
    props:["nombre_escena","id","nombre_proceso","entrarDetalles","isSelected","userId"],
    methods:{
        selectEscena(){
            if(this.entrarDetalles){
                console.log(this.userId)
                this.$router.push({
                    path: `/procesoCreativo/${this.nombre_proceso}/escena/${this.id}`, 
                    query: {userId: this.userId}
                })
            }
            else this.$emit("escena-selected", { id: this.id, name: this.nombre_escena });
        }
    }}
</script>

<style>
.pestana{
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 0px;
    width: auto;
    height: auto;
    padding: 0px 25px;
    word-wrap: break-word;
    background: #D9D9D9;
    border-radius: 50px;
    border: none;
}

.pestana.selected{
    background: #858585;
    color: #FFF;
}
</style>