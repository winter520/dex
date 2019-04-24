<template>
  <div style="background:#fff">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{LANG.BTN.RECEIVE}} / {{LANG.BTN.SEND}}</h1>
      <div class="biticonSelect_box">
        <div class="logo">
          <img src="@etc/img/Fusion.svg">
        </div>
        <div class="arrow flex-c">
          <i class="i"></i>
        </div>
        <select class="select" v-model="selectVal">
          <option
            v-for="(item, index) in SetcoinAndUrl"
            :key="index"
            v-html="item.coin"
            :value="item.coin"
          ></option>
        </select>
      </div>
    </div>

    <div class="transferBtn_box">
      <div class="transferBtn_btn flex-sc">
        <router-link to="/Transfer/tranReceive" class="tranBtn flex-c" id="tabBtnFirst">
          {{LANG.BTN.RECEIVE}}
          <i class="arrow"></i>
        </router-link>
        <router-link to="/Transfer/tranSend" class="tranBtn flex-c">
          {{LANG.BTN.SEND}}
          <i class="arrow"></i>
        </router-link>
      </div>
    </div>

    <div class="transferCont_absolute">
      <div class="transferCont_box">
        <transition name="fade">
          <router-view :selectData="coinDataPage"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Transfer",
  data () {
    return {
      // selectData: "",
      selectVal: "",
      SetcoinAndUrl: this.$store.state.coinlist,
      coinDataPage: {}
    }
  },
  watch: {
    selectVal (cur, oold) {
      this.getCoinInfo(cur)
    }
  },
  mounted () {
    this.selectVal = this.$route.query.currency ? this.$route.query.currency : "FSN"
    this.getCoinInfo(this.selectVal)
  },
  methods: {
    getCoinInfo (coin) {
      for (let i = 0; i < this.SetcoinAndUrl.length; i++) {
        if (this.SetcoinAndUrl[i].coin === "FSN") {
          this.coinDataPage = {
            coin: coin,
            address: this.$store.state.address,
            limit: this.SetcoinAndUrl[i].limit,
            number: this.SetcoinAndUrl[i].number
          }
        } else {
          if (coin === this.SetcoinAndUrl[i].coin) {
            let get_dcrmGetAddr
            if (this.$store.state.wallet.safeMode) {
              get_dcrmGetAddr = ""
            } else {
              get_dcrmGetAddr = v_web3.lilo.dcrmGetAddr(this.$store.state.address, coin)
            }
            this.coinDataPage = {
              coin: coin,
              address: get_dcrmGetAddr,
              limit: this.SetcoinAndUrl[i].limit,
              number: this.SetcoinAndUrl[i].number
            }
          }
        }
      }
      console.log(this.coinDataPage)
    }
  }
}
</script>
