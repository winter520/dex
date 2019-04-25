<template>
  <div>
    <input type="text" v-model="address" id="addressCopy" class="fixedHide">
    <div class="exchangeTop_box flex-bc">
      <router-link to="/" class="exchangeTop_logo flex-jc-fs">
        <!-- <img src="@etc/img/logo.svg"> -->
        <img src="@etc/img/logo2.svg">
        <p class="p1">{{datetime}}</p>
      </router-link>
      <div class="exchangeTop_nav">
        <el-menu default-active="1" class="el-menu-demo exchangeTop_nav" mode="horizontal">
          <el-menu-item index="1">Exchange</el-menu-item>
          <el-menu-item index="8">Explorer</el-menu-item>
          <el-menu-item index="2" v-if="!isLogin"><router-link to="/createWallet" class="item">Create New Wallet</router-link></el-menu-item>
          <el-menu-item index="3" v-if="!isLogin"><a @click="toUrl('/importWallet', { isExchange: true })" class="item cursorP">Unlock Wallet</a></el-menu-item>
          <el-submenu index="4" v-if="isLogin">
            <template slot="title">Orders</template>
            <el-menu-item index="4-1">Open Orders</el-menu-item>
            <el-menu-item index="4-2">Order History</el-menu-item>
            <el-menu-item index="4-3">Trade History</el-menu-item>
            <el-menu-item index="4-4">Fee History</el-menu-item>
          </el-submenu>
          
          <el-menu-item index="5" v-if="isLogin" @click="toUrl('/MyAssets')">Transactions</el-menu-item>
          <el-menu-item index="6" v-if="isLogin" @click="toUrl('/MyAssets')">Balances</el-menu-item>
          <el-submenu index="7" v-if="isLogin">
            <template slot="title">Orders</template>
            <el-menu-item index="7-1">
              <div class="flex-bc nav_addres">
                <span :title="address">{{cutOut(address)}}</span>
                <span class="icon flex-c" @click="copyAddress('addressCopy')"><img src="@etc/img/copy2.svg"></span>
                <!-- <span class="icon flex-c"><img src="@etc/img/copy2.svg"></span> -->
              </div>
            </el-menu-item>
            <el-menu-item index="7-2"><span @click="toUrl('/importWallet')">Change Wallet</span></el-menu-item>
            <el-menu-item index="7-3"><span @click="toUrl('/createWallet')">Create New Wallet</span></el-menu-item>
            <el-menu-item index="7-4"><span @click="toUrl('/importWallet', { isBackup: true })">Export Keystore File</span></el-menu-item>
            <el-menu-item index="7-5"><span @click="closeWallet">Close Wallet</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'top',
  data () {
    return {
      datetime: '',
      isLogin: false,
      address: ''
    }
  },
  watch: {
    getAddress (cur, old) {
      if (cur) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
      // console.log(this.isLogin)
    }
  },
  computed: {
    getAddress () {
      return this.$store.state.address
    }
  },
  methods: {
    toUrl (url, params) {
      if (params) {
        this.$router.push({ path: url, query: params })
      } else {
        this.$router.push(url)
      }
    },
    closeWallet () {
      history.go(0)
    },
    toImport () {
      this.$router.push({ path: '/importWallet', query: { isExchange: true } })
    },
    tobackupWallet () {
      this.$router.push({ path: '/importWallet', query: { isBackup: true } })
    },
    cutOut (str) {
      var str1 = str.substr(0, 6)
      var str2 = str.substr(str.length - 5)
      return str = str1 + '…' + str2
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand('Copy')
      this.$message({
        message: this.LANG.SUCCESS_TIP.TIP_0,
        type: 'success'
      })
    },
  },
  created () {
    this.address = this.$store.state.address
    // console.log(this.address)
    if (this.address) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    setInterval(() => {
      this.datetime = this.$$.timeChange({type: 'yyyy-mm-dd hh:mm:ss', format: '-'})
    }, 10)
  },
  mounted () {

  }
}
</script>

