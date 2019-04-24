<template>
  <div class="supCoinView_container">
    <div class="walletBtn_box">
      <ul>
        <li>
          <router-link to="/createWallet" class="btnStyle btnBlue flex-c">
          <div class="icon">
            <img src="@etc/img/pageWhite.svg">
            </div>{{LANG.BTN.CREATE_WALLET}}
          </router-link>
        </li>
        <li>
          <router-link to="/importWallet" class="btnStyle btnWhite flex-c">
          <div class="icon">
            <img src="@etc/img/Importwallet-blue.svg">
            </div>{{LANG.IMPORT_WALLET}}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="supCoinView_box">
      <hgroup class="supCoinView_title">
        <h3 class="title">{{LANG.TITLE.COIN_SUPPORTED}}</h3>
      </hgroup>
      <div class="supCoinView_list">

        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" v-for="item in iconData" :key="item.index" class="item">
            <div class="iconImg">
              <img :src="item.icon">
            </div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: "",
  data () {
    return {
      iconData: []
    }
  },
  mounted () {
    // let toPath = location.href.toUpperCase()
    // if (toPath.lastIndexOf("/") === (toPath.length - 1)) {
    //   this.$store.commit("storeAddress", "")
    // }
    for (let i = 0; i < this.$store.state.coinlist.length; i++) {
      this.iconData.push({
        icon: this.$store.state.coinlist[i].logo,
        title: this.$store.state.coinlist[i].title
      })
    }
    this.$store.commit('storeAddress', '')
  }
}
</script>
