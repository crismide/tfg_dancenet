<template>
    <div>
        <div class="nota frame" v-if="type=='text'">
            <h3 class="nota texto">{{content}}</h3>
        </div>
    </div>
</template>

<script>
export default{
    props: ['content','type']
}
</script>

<style>
.nota.frame{
    width: fit-content;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: auto;
    background: #FFFB97;
    word-wrap: break-word;
    padding: 10px 10px 10px 10px;
}
</style>