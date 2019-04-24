<template>
  <div style="background:#fff;min-height:100%"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{LANG.NAV.MY_WALLET}}</h1>
      <h2 class="contentHeader_title">$ {{myAssetsTotal}}</h2>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="FSN" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="@etc/img/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box">
      <el-table
        :data="bitIconTypeSearch"
        style="width: 100%"
        :height="tableH"
        empty-text="Null"
      >
        <el-table-column :label="LANG.THEAD.COIN" width="190">
          <template slot-scope="scope">
            <div class="flex-sc">
              <div class="logo"><img :src="scope.row.logo"></div>
              <div class="title">
                <h2 class="span" v-html="scope.row.nameSimplicity"></h2>
                <h3 class="p" v-html="scope.row.nameFull"></h3>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.AVAILABLE_BALANCE" prop="availbleBalance" width="200"></el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.FREEZE" prop="freeze" width="120"></el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.TOTAL_BALANCE" min-width="180">
          <template slot-scope="scope">
            <span class="span" v-html="scope.row.totalBalance"></span>
            <p class="p">$ {{scope.row.totalBalanceDoller}}</p>
          </template>
        </el-table-column>
        <el-table-column :label="LANG.THEAD.ACTIONS" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <router-link :to="{path:'/Transfer/tranReceive', query: {currency: scope.row.currency}}" class="setBtn" v-if="scope.row.btnView === 2">{{LANG.BTN.RECEIVE}}</router-link>
              <router-link :to="{path:'/Transfer/tranSend', query: {currency: scope.row.currency}}" class="setBtn" v-if="scope.row.btnView === 2">{{LANG.BTN.SEND}}</router-link>
              <a class="setBtn" v-if="scope.row.btnView === 0 && !$store.state.safeMode" @click="privateSure(scope.row.currency, scope.row.btnView)">{{LANG.BTN.REQUEST}}</a>
              <a class="setBtn" v-if="scope.row.btnView === 1 && !$store.state.safeMode" @click="privateSure(scope.row.currency, scope.row.btnView)" style="opacity:0.5">{{LANG.BTN.PENDING}}</a>
              <a class="setBtn" v-if="scope.row.btnView === 0 && $store.state.safeMode" style="opacity:0.5">{{LANG.BTN.REQUEST}}</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="LANG.BTN.UNLOCK"
      :visible.sync="privateSureVisible"
      width="75%"
      :before-close="modalClick"
    >
      <!-- <router-view @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView"></router-view> -->
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

    <el-dialog
      :title="LANG.TITLE.REQUEST_CONFIRM"
      :visible.sync="confirmDcrmVisible"
      width="60%"
      :before-close="modalClick"
    >
      <div class="">
        {{LANG.WARNING_TIP.TIP_1}}
      </div>
      <span slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-default" @click="modalClick">{{LANG.BTN.GET_OUT}}</button>
        <button type="button" class="btn btn-primary" @click="sendRawTransion(confirmData)">{{LANG.BTN.YES_SURE}}</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "myAssets",
  data () {
    return {
      myAssetsTotal: "",
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAddress: "",
      dataPage: {},
      selectOption: [],
      searchContent: "",
      refreshBalance: "",
      confirmData: "",
      privateSureVisible: false,
      confirmDcrmVisible: false,
      fullscreenLoading: true,
      count: 0,
      tableH: 0
    }
  },
  watch: {
    myAssetsTotal (cur) {
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    // console.log(this.$store.state.address)
    this.getInitData()
    
    if (this.$store.state.wallet.walletLoadFlag && !this.$store.state.wallet.safeMode) {
      this.getBalanceData()
    } else {
      this.fullscreenLoading = false
    }
    this.refreshBalance = setInterval(() => {
      if (!this.$store.state.wallet.safeMode) {
        this.getBalanceData()
      }
    }, 250000)
    setTimeout(() => {
      this.tableHeight()
    }, 100)
    window.onresize = () => {
      this.tableHeight()
    }
  },
  methods: {
    getElDialogView () {
      this.modalClick()
    },
    tableHeight () {
      let headerH= '',
      countH= '',
      searchH= '',
      footH= '',
      bodyH = ''
      try {
        headerH= document.querySelector('.headerTop_box').clientHeight
        countH= document.querySelector('.contentHeader_box').clientHeight
        searchH= document.querySelector('.myAssetsSear_box').clientHeight
        footH= document.querySelector('.footerBottom_box').clientHeight
        bodyH = document.body.clientHeight
      } catch (error) {
        // console.log(error)
      }
      this.tableH = bodyH - (headerH + countH + searchH + footH) - 70
    },
    modalClick () {
      this.$router.push("/MyAssets")
      this.privateSureVisible = false
      this.confirmDcrmVisible = false
    },
    myAssetsTotalBalance () {
      this.myAssetsTotal = 0
      for (let i = 0; i < this.bitIconTypeData.length; i++) {
        this.myAssetsTotal += this.$$.thousandToNum(this.bitIconTypeData[i].totalBalance)
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal)
    },
    searchInput () {
      this.bitIconTypeSearch = []
      let searchTxt = this.searchContent ? this.searchContent : this.searchContent.toLowerCase()
      this.myAssetsTotal = 0
      this.bitIconTypeSearch = this.bitIconTypeData.filter(item => {
        if (searchTxt === "") {
          this.myAssetsTotal += Number(this.$$.thousandToNum(item.totalBalanceDoller))
          return item
        } else {
          if (!isNaN(searchTxt)) {
            searchTxt = this.$$.thousandBit(searchTxt, "no")
          }
          if (
               item.nameSimplicity.toLowerCase().indexOf(searchTxt) !== -1 
            || item.nameFull.toLowerCase().indexOf(searchTxt) !== -1 
            || item.availbleBalance.indexOf(searchTxt) !== -1 
            || item.freeze.indexOf(searchTxt) !== -1 
            || item.totalBalance.indexOf(searchTxt) !== -1 
            || item.totalBalanceDoller.indexOf(searchTxt) !== -1
          ) {
            this.myAssetsTotal += Number(this.$$.thousandToNum(item.totalBalanceDoller))
            return item
          }
        }
      })
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
    },
    getInitData () {
      let coinlist = this.$store.state.coinlist
      let bitCoinInfo = []
      for (let i = 0;i < coinlist.length; i++) {
        let balance = Number(coinlist[i].balance) === 0 ? "0.00" : this.$$.thousandBit(coinlist[i].balance, "no")
        let balanceDollar = Number(coinlist[i].balanceDollar) === 0 ? "0.00" : this.$$.thousandBit(coinlist[i].balanceDollar, 2)
        bitCoinInfo.push({
          logo: coinlist[i].logo,
          nameSimplicity: coinlist[i].coin,
          nameFull: coinlist[i].coinAll,
          availbleBalance: balance,
          freeze: Number(coinlist[i].freeze) === 0 ? "0.00" : this.$$.thousandBit(coinlist[i].freeze, "no"),
          totalBalance: balance,
          totalBalanceDoller: balanceDollar,
          currency: coinlist[i].coin,
          receive: "",
          send: "",
          btnView: coinlist[i].flag
        })
        this.myAssetsTotal = Number(this.myAssetsTotal) + Number(coinlist[i].balanceDollar)
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
      this.bitIconTypeSearch = this.bitIconTypeData = bitCoinInfo
    },
    privateSure (data, flag) {
      if (flag === 1) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_9)
        return
      }
      this.dataPage = {
        coin: data,
        sendType: "MYWALLET",
        from: this.walletAddress,
        nonce: "",
      }
      try {
        this.dataPage.nonce = v_web3.eth.getTransactionCount(this.walletAddress, "pending")
      } catch (error) {
        this.$$.errTip(error)
        return
      }
      console.log(this.dataPage)
      // this.$router.push("/pwdMyAssets")
      this.privateSureVisible = true
    },
    getSignData (data) {
      console.log(data)
      if (data) {
        if (data.nowFlag) {
          this.sendRawTransion(data)
        } else {
          this.confirmData = data
          this.confirmDcrmVisible = true
        }
      } else {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_6)
      }
      this.privateSureVisible = false
    },
    sendRawTransion (data) {
      v_web3.eth.sendRawTransaction(data.serializedTx, (err, hash) => {
        if (err) {
          console.log(err)
          this.$$.errTip(err)
        } else {
          for (let i = 0; i < this.bitIconTypeData.length; i++) {
            if (data.coin === this.bitIconTypeData[i].currency) {
              this.bitIconTypeData[i].btnView = 1
            }
          }
          let storeData = {
            balance: 0,
            balanceDollar: 0,
            flag: 1,
            coin: data.coin
          }
          this.$store.commit("storeCoinlist", storeData)
          this.modalClick()
          this.$$.successTip(this.LANG.ERROR_TIP.TIP_10.FIRST + hash + this.LANG.ERROR_TIP.TIP_10.LAST)
        }
      })
    },
    getBalanceData () {
      if (!this.walletAddress) {
        return
      }
      // let get_walletAddress = this.$store.state.address
      let coinlist = this.$store.state.coinlist
      this.myAssetsTotal = 0

      var batch = v_web3.createBatch()
      for (let i = 0; i < coinlist.length; i++) {
        let coin = coinlist[i].coin
        if (coin === "FSN") {
          // let balanceWei = v_web3.eth.getBalance(this.walletAddress)
          // this.setBalance(coin, balanceWei, 2)
          batch.add(v_web3.eth.getBalance.request(this.walletAddress))
        } else {
          // this.setBalance(coin, v_web3.lilo.dcrmGetBalance(this.walletAddress, coin), 2)
          batch.add(v_web3.lilo.dcrmGetBalance.request(this.walletAddress, coin))
        }
      }
      batch.requestManager.sendBatch(batch.requests, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          for (let i = 0; i < results.length; i++) {
            if (results[i].result || results[i].result === 0) {
              this.setBalance(coinlist[i].dollarURL, coinlist[i].coin, results[i].result, 2)
            } else {
              this.setBalance(coinlist[i].dollarURL, coinlist[i].coin, "", 0)
            }
          }
          this.$store.commit("storeWalletLoadFlag", false)
        }
      })
    },
    setBalance (url, coin, balance, flag) {
      this.count ++
      // console.log(this.count)
      let balanceWei = balance
      let balanceGwei = 0
      if (coin === "BTC") {
        balanceGwei = this.$$.fromWei(balanceWei, "btc")
      } else {
        balanceGwei = v_web3.fromWei(balanceWei, "ether").toString()
      }
      if (isNaN(balance)) {
        return 0
      } else {
        this.getDoller(url, balanceGwei, coin, flag)
      }
      if (this.count === this.$store.state.coinlist.length) {
        this.fullscreenLoading = false
        this.count = 0
      }
    },
    getDoller (url, balance, coin, flag) {
      $ajax.get(url).then(res => {
        res = res.data
        // let callbackData = 0
        let usd_val = 0,
            btc_val = 0,
            percent_1h = 0,
            percent_7d = 0,
            percent_24h = 0,
            price_btc = 0,
            price_usd = 0
        if (res.length > 0) {
          usd_val = res[0].price_usd
          btc_val = res[0].price_btc
          percent_1h = res[0].percent_change_1h
          percent_7d = res[0].percent_change_7d
          percent_24h = res[0].percent_change_24h
          price_btc = res[0].price_btc
          price_usd = res[0].price_usd
        }
        let balanceUSD = usd_val * balance
        let balanceGwei = balance
        let storeData = {
          balance: balanceGwei,
          balanceDollar: balanceUSD,
          flag: flag,
          percent_change_1h: percent_1h,
          percent_change_7d: percent_7d,
          percent_change_24h: percent_24h,
          price_btc: price_btc,
          price_usd: price_usd,
          BTCval: btc_val * balance,
          coin: coin
        }
        this.myAssetsTotal = Number(this.myAssetsTotal) + Number(balanceUSD)
        balanceGwei = Number(balanceGwei) === 0 ? "0.00" : this.$$.thousandBit(balanceGwei, "no")
        balanceUSD = Number(balanceUSD) === 0 ? "0.00" : this.$$.thousandBit(balanceUSD, 2)
        for (let j = 0; j < this.bitIconTypeData.length; j++) {
          if (this.bitIconTypeData[j].currency === coin) {
            this.bitIconTypeData[j].availbleBalance = balanceGwei
            this.bitIconTypeData[j].totalBalance = balanceGwei
            this.bitIconTypeData[j].totalBalanceDoller = balanceUSD
            this.bitIconTypeData[j].btnView = flag
            break
          }
        }
        this.$store.commit("storeCoinlist", storeData)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.refreshBalance)
    this.refreshBalance = null
  }
}
</script>
