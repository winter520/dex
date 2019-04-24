<template>
  <div style="background:#fff">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{LANG.TITLE.LOCKIN}} / {{LANG.TITLE.LOCKOUT}}</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="@etc/img/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal" id="selectValData">
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
        <router-link to="/LILO/lockIn" class="tranBtn flex-c" id="tabBtnFirst">
          {{LANG.BTN.DEPOSIT}}
          <i class="arrow"></i>
        </router-link>
        <router-link to="/LILO/lockOut" class="tranBtn flex-c">
          {{LANG.BTN.WITHDRAW}}
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
      selectVal: "",
      SetcoinAndUrl: [],
      walletAddress: "",
      coinDataPage: ""
    }
  },
  watch: {
    selectVal (cur, old) {
      if (cur !== old) {
        // console.log(1)
        // console.log(cur)
        // console.log(old)
        setTimeout(() => {
          this.getCoinInfo(cur)
        }, 100)
      }
    }
  },
  mounted () {
    this.selectVal = this.$route.query.currency
      ? this.$route.query.currency
      : "ETH"
    this.walletAddress = this.$store.state.address
    for (let i = 0; i < this.$store.state.coinlist.length; i++) {
      if (this.$store.state.coinlist[i].coin !== "FSN") {
        this.SetcoinAndUrl.push(this.$store.state.coinlist[i])
      }
    }
    if (!this.selectVal) {
      // console.log(2)
      // console.log(this.selectVal)
      setTimeout(() => {
        this.getCoinInfo(this.selectVal)
      }, 100)
    }
  },
  methods: {
    getCoinInfo (coin) {

      // let address_count = 0
      // let address_setInterval = setInterval(() => {
      //   if (coin === this.SetcoinAndUrl[address_count].coin) {
      //     console.log(address_count)
      //     // if (address_count >= this.SetcoinAndUrl.length) {
      //       //   this.$store.commit("storeDcrmAddress", get_address)
      //     //   address_count = 0
      //     //   return
      //     // }
      //     let get_address = v_web3.lilo.dcrmGetAddr(this.walletAddress, coin)
      //     this.coinDataPage = {
      //       coin: coin,
      //       address: get_address,
      //       limit: this.SetcoinAndUrl[address_count].limit,
      //       number: this.SetcoinAndUrl[address_count].number,
      //       token: this.SetcoinAndUrl[address_count].token
      //     }
      //     this.$store.commit("storeDcrmAddress", get_address)
      //     address_count = 0
      //     clearInterval(address_setInterval)
      //     return
      //   }
      //   console.log(address_count)
      //   address_count ++
      // }, 80)
      for (let i = 0; i < this.SetcoinAndUrl.length; i++) {
        if (coin === this.SetcoinAndUrl[i].coin) {
          let get_address = v_web3.lilo.dcrmGetAddr(this.walletAddress, coin)
          this.coinDataPage = {
            coin: coin,
            address: get_address,
            limit: this.SetcoinAndUrl[i].limit,
            number: this.SetcoinAndUrl[i].number,
            token: this.SetcoinAndUrl[i].token
          }
          // this.$store.commit("storeDcrmAddress", get_address)
        }
      }
    }
  }
}
</script>
