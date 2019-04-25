<template>
  <div>
    <div class="exchangeCont_box">
      <div class="top">
        <router-view></router-view>
      </div>
      <div class="left">
        <router-view name="right"></router-view>
      </div>
      <div class="right">
        <router-view name="left"></router-view>
      </div>
      <div class="bottom">
        <router-view name="bottom"></router-view>
      </div>
      <div class="middle">
        <router-view name="middle"></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// @import '@/assets/css/style.scss';
</style>

<script>
export default {
  name: 'exchange',
  data () {
    return {
      datetime: '',
      isLogin: false,
      address: '',
      parentData: ''
    }
  },
  created () {
    this.$$.setWeb3('https://10.192.32.92')
  },
  mounted () {
    // console.log(v_web3)
  },
  methods: {
  }
}
</script>
