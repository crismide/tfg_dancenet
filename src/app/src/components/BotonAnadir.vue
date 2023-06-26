<template>
    <div>
        <button type="button" id="anadir" @click="$emit('evento_anadir')">+</button>
    </div>
</template>

<script>
export default {
    methods: {
    evento_anadir() {
      this.$emit('evento_anadir')
    }
  }
}
</script>

<style>
#anadir{
  width: 64px;
  height: 64px;
  border-radius: 12px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 200;
  font-size: 48px;
  color: #C8C8C8;
  background: #7B7474;
  border: none;
}
</style>