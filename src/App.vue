<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'index',
  data () {
    return {
    }
  },
  updated () {
    document.getElementById('bgLoadingInit').style.display = 'none'
  },
}

</script>
