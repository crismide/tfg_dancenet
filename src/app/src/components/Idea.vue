<template>
    <div>
        <div class="nota frame">
            <h3 class="nota texto">{{texto_idea}}</h3>
        </div>
    </div>
</template>

<script>
export default{
    props: ['texto_idea']
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
}
</style>