<template>
  <div class="fullScreen" id="leftHeight">
    <div class="lTabTop_box">
      <div class="lTabTop_tabCoin">
        <ul class="coin_list flex-bc">
          <li @click="tabClick(0, 'FSN')"><p :class="tabType === 0 ? 'active-blue' : ''">FSN</p></li>
          <li @click="tabClick(1, 'BTC')"><p :class="tabType === 1 ? 'active-blue' : ''">BTC</p></li>
          <li @click="tabClick(2, 'ETH')"><p :class="tabType === 2 ? 'active-blue' : ''">ETH</p></li>
          <li @click="tabClick(3, 'USDT')"><p :class="tabType === 3 ? 'active-blue' : ''">USDT</p></li>
        </ul>
        <ul class="search_select flex-bc">
          <li>
            <el-input placeholder="Search...">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </li>
          <li class="flex-sc">
            <el-radio-group v-model="radio" @change="changeVolume()" class="flex-sc">
              <el-radio :label="1">Change</el-radio>
              <el-radio :label="2">Volume</el-radio>
            </el-radio-group>
          </li>
        </ul>
      </div>
      <div class="lTabTop_tableBox">
        <ul class="table_thead flex-bc">
          <li v-for="(item, index) in tableThead" :key="index" :style="item.style">
            <p>{{item.th}}</p>
          </li>
        </ul>
        <div class="table_scroll">
          <el-scrollbar style="height:100%;width: 100%;">
            <ul class="table_tbody flex-bc" v-for="(items, indexs) in pairData" :key="indexs" @click="sendCoin(items)">
              <!-- <li v-for="(item, index) in tableThead" :key="index" :style="'width:' + item.width">
                <p :class="item.class">{{items[item.param]}}</p>
              </li> -->
              <li style="width:40%"> <p>{{items.pair}}</p> </li>
              <li style="width:40%"> <p>{{$$.thousandBit(items.price, 'no')}}</p> </li>
              <li style="width:20%;text-align:right;" v-if="radio === 1">
                <p :class="items.volume >= 0 ? 'green' : 'red'">{{$$.thousandBit(items.change, 2)}}%</p>
              </li>
              <li style="width:20%;text-align:right;" v-else>
                <p :class="items.volume >= 0 ? 'green' : 'red'">{{items.volume}}</p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <div class="lTabBottom_box">
      <div class="lTabBottom_cont">
        <div class="lTabBottom_title">
          <h3>Trade History</h3>
          <div class="arrow" @click="switchHistory">
            <i class="up" :style="isTable ? 'opacity: 0' : 'opacity: 1'"></i>
            <p class="line"></p>
            <i class="down" :style="isTable ? 'opacity: 1' : 'opacity: 0'"></i>
          </div>
        </div>
        <div class="lTabTop_tableBox" v-show="isTable" id="historyTable">
          <ul class="table_thead flex-bc">
            <li v-for="(item, index) in tradeThead" :key="index" :style="item.style"><p>{{item.th}}</p></li>
          </ul>
          <div class="table_scroll">
            <el-scrollbar style="height:100%;width: 100%;">
              <ul class="table_tbody flex-bc" v-for="(items, indexs) in table" :key="indexs">
                <li v-for="(item, index) in tradeThead" :key="index" :style="item.style">
                  <p :class="item.class">{{isNaN(items[item.param]) ? items[item.param] : $$.thousandBit(items[item.param], 6)}}</p>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'left',
  data () {
    return {
      radio: 1,
      tabType: 0,
      cointype: 'FSN',
      table: [],
      coinlist: [],
      tableThead: [],
      tradeThead: [
        {th: 'Price', style: 'width:30%;', param: 'price', class: ''},
        {th: 'Amount', style: 'width:30%;', param: 'quantity', class: ''},
        {th: 'Time', style: 'width:40%;text-align:right;', param: 'timestamp', class: 'color_gray'}
      ],
      tradeData: [],
      pairData: [],
      isTable: true,
      walletAddress: '',
      fsnBalance: 0
    }
  },
  mounted () {
    this.initTable()
    this.walletAddress = this.$store.state.address
    // this.walletAddress = '0x177b05bde6ba930244b7efcac141bd7c77fff73e'
    this.getBalanceData()
    this.getPair()
    this.getHistory()
    // let _block = '0x' + Number(165).toString(16)
    // let test = v_web3.lilo.xproOrderDealedInfo(_block,"ETH/BTC")
    // console.log(test)
    // console.log(JSON.parse(test))
    // console.log(this.$store.state.coinlist)
  },
  methods: {
    tabClick (type, coin) {
      this.tabType = parseInt(type)
      this.cointype = coin
    },
    async getPair () {
      this.pairData = []
      $ajax.post(
        this.$$.serverURL + '/order/getPairs',
        Qs.stringify({})
      ).then(res => {
        // console.log(res.data)
        if (res && res.data && res.data.info.length > 0) {
          this.pairData = res.data.info
        } else {
          this.pairData = []
        }
        this.$store.commit("storePairinfo", this.pairData[0])
      })
    },
    async getHistory (data) {
      this.table = []
      $ajax.post(
        this.$$.serverURL + '/order/getTx',
        Qs.stringify(data)
      ).then(res => {
        // console.log(res.data)
        if (res && res.data && res.data.info.length > 0) {
          for (let item of res.data.info) {
            if (item.timestamp) {
              item.timestamp = this.$$.timeChange({
                date: Number(item.timestamp),
                type: 'yyyy-mm-dd hh:mm:ss'
              })
            }
            item.hash = item.hash ? this.$$.cutOut(item.hash, 6, 5) : ''
            this.table.push(item)
          }
        } else {
          this.table = []
        }
        // console.log(this.table)
      })
    },
    sendCoin (coin) {
      console.log(coin)
      // coin.price = price
      this.getHistory()
      this.$store.commit("storePairinfo", coin)
    },
    switchHistory () {
      if (this.isTable) {
        document.querySelector('#historyTable').style.height = '0'
        document.querySelector('.lTabBottom_box').style.height = '0'
        document.querySelector('.lTabTop_box').style.height = document.getElementById('leftHeight').offsetHeight - 40 + 'px'
        this.isTable = false
      } else {
        document.querySelector('#historyTable').style.height = '100%'
        document.querySelector('.lTabBottom_box').style.height = '50%'
        document.querySelector('.lTabTop_box').style.height = '50%'
        this.isTable = true
      }
    },
    changeVolume () {
      // console.log(this.radio)
      this.initTable()
    },
    initTable () {
      if (this.radio === 1) {
        this.tableThead = [
          {th: 'Pair', style: 'width:40%;', param: 'pair', class: ''},
          {th: 'Price', style: 'width:40%;', param: 'price', class: ''},
          {th: 'Change', style: 'width:20%;text-align:right;', param: 'change', class: 'red'}
        ]
      } else if (this.radio === 2) {
        this.tableThead = [
          {th: 'Pair', style: 'width:40%;', param: 'pair', class: ''},
          {th: 'Price', style: 'width:40%;', param: 'price', class: ''},
          {th: 'Volume', style: 'width:20%;text-align:right;', param: 'volume', class: 'red'}
        ]
      }
      // this.getHistory()
    },
    getBalanceData () {
      if (typeof v_web3 === 'undefined') return
      let coinlist = this.$store.state.coinlist
      if (!this.walletAddress || !v_web3.isConnected()) {
        for (let i = 0; i < coinlist.length; i++) {
          this.setBalance(coinlist[i].dollarURL, coinlist[i].coin, '', 0)
        }
        return
      }
      // this.myAssetsTotal = 0
      var batch = v_web3.createBatch()
      for (let i = 0; i < coinlist.length; i++) {
        let coin = coinlist[i].coin
        if (coin === "FSN") {
          batch.add(v_web3.eth.getBalance.request(this.walletAddress))
        } else {
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
    },
    getDoller (url, balance, coin, flag) {
      $ajax.get(url).then(res => {
        res = res.data
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
        let storeData = {
          balance: balance,
          balanceDollar: usd_val * balance,
          flag: flag,
          percent_change_1h: percent_1h,
          percent_change_7d: percent_7d,
          percent_change_24h: percent_24h,
          BTCval: btc_val * balance,
          price_btc: price_btc,
          price_usd: price_usd,
          coin: coin
        }
        this.$store.commit("storeCoinlist", storeData)
        if (this.$store.state.coinlist.length === 9) {
          this.coinlist = []
          for (let i of this.$store.state.coinlist) {
            if (i.coin === 'FSN') {
              this.fsnBalance = i.price_usd
            } else {
              this.coinlist.push(i)
            }
          }
        }
        // this.
      })
    }
  }
}
</script>
