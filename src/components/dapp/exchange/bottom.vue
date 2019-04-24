<template>
  <div class="fullScreen flex-bc bAllTabCont_box">
    <div class="blTabCont_box">
      <div class="blTabCont_thead">
        <div class="blTabCont_tab">
          <ul class="flex-sc history_tab" @click="tabClick">
            <li><p :class="tabType === 0 ? 'active-blue' : ''" data-index="0">Open Orders</p></li>
            <li><p :class="tabType === 1 ? 'active-blue' : ''" data-index="1">Order History</p></li>
            <li><p :class="tabType === 2 ? 'active-blue' : ''" data-index="2">Trade History</p></li>
            <li><p :class="tabType === 3 ? 'active-blue' : ''" data-index="3">Balances</p></li>
          </ul>
        </div>
        <div class="blTabCont_set">
          <el-scrollbar style="height:100%;width: 100%;">
            <div v-if="tabType !== 3" class="flex-bc blTabCont_setScroll">
              <div class="hide_other">
                <el-checkbox @change="hidePairs" v-model="hidePairsVal">Hide Other Pairs</el-checkbox>
              </div>
              <div class="flex-c more_select" v-if="tabType === 2">
                <p class="p1">Pair:</p>
                <el-select v-model="pairLeftVal" filterable no-match-text="Null" allow-create placeholder="">
                  <el-option
                    v-for="item in pairLeft"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <p class="p1">/</p>
                <el-select v-model="pairRightVal" no-match-text="Null" placeholder="">
                  <el-option v-for="(item, index) in pairRight" :key="index" :label="item" :value="item"> </el-option>
                </el-select>
                <p class="p1">Type:</p>
                <el-select v-model="selectPair" no-match-text="Null">
                  <el-option value="Buy & Sell" label='Buy & Sell'></el-option>
                  <el-option value="Buy" label='Buy'></el-option>
                  <el-option value="Sell" label='Sell'></el-option>
                </el-select>
              </div>
              <div class="select_date flex-ec" v-if="tabType === 1 || tabType === 2">
                <el-radio-group v-model="selectDate" size="mini">
                  <el-radio-button label="1 Day"></el-radio-button>
                  <el-radio-button label="1 Week"></el-radio-button>
                  <el-radio-button label="1 Month"></el-radio-button>
                  <el-radio-button label="3 Months"></el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div v-if="tabType === 3" class="total_amount">
              <p>Estimated Value: {{$$.thousandBit(totalBTC, 'no')}} BTC / ${{$$.thousandBit(totalDoller, 'no')}}</p>
            </div>

          </el-scrollbar>
        </div>
      </div>
      <div class="lTabTop_tableBox">
        <el-scrollbar style="height:100%;width: 100%;">
          <div class="tableBox">
            <ul class="table_thead flex-bc">
              <li v-for="(item, index) in openThead" :key="index" :style="'width:' + item.width"><p>{{item.th}}</p></li>
            </ul>
            <div class="table_scroll">
              <!-- <el-scrollbar> -->
                <div class="table_scroll_child">
                  <ul class="table_tbody flex-bc" v-for="(items, indexs) in table" :key="indexs">
                    <li v-for="(item, index) in openThead" :key="index" :style="'width:' + item.width">
                      <p :class="item.class">{{items[item.param]}}</p>
                    </li>
                  </ul>
                </div>
              <!-- </el-scrollbar> -->
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div class="brTabCont_box">
      <div class="brTabCont_cont">

        <div class="brTabCont_thead flex-bc">
          <p>Limit Order</p>
        </div>

        <div class="brTabCont_form flex-bc">
          <ul class="form">
            <li>
              <div class="flex-bc title">
                <p class="label">Price</p>
                <div class="set" @click="resetPrice('buyXPR')"> <span>Best Ask</span> </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c">
                <el-input-number v-model="buyXPR.price" :precision="numberPrecision" :step="numberStep" :min="numberStep" label="" @change="priceChange('buyXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="flex-bc title">
                <p class="label">Amount</p>
                <div class="set">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c input_text">
                <el-input-number v-model="buyXPR.amount" :precision="6" :step="6" :min="0" :controls="false" @change="amountChange('buyXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="flex-bc title">
                <p class="label">Total</p>
                <div class="set"> <p>0 USDT</p> </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c input_text">
                <el-input-number v-model="buyXPR.total" :precision="2" :step="2" :min="0" :controls="false" @change="totalChange('buyXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="set_btn">
                <el-button type="primary" size="mini" @click="buyXPRBtn">Buy XRP</el-button>
              </div>
            </li>
          </ul>
          <ul class="form">
            <li>
              <div class="flex-bc title">
                <p class="label">Price</p>
                <div class="set" @click="resetPrice('sellXPR')"> <span>Best Bid</span> </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c input_text">
                <el-input-number v-model="sellXPR.price" :precision="numberPrecision" :step="numberStep" :min="numberStep" label="" @change="priceChange('sellXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="flex-bc title">
                <p class="label">Amount</p>
                <div class="set">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c input_text">
                <!-- <el-input v-model="sellXPR.amount" placeholder=""></el-input> -->
                <el-input-number v-model="sellXPR.amount" :precision="6" :step="6" :min="0" :controls="false" @change="amountChange('sellXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="flex-bc title">
                <p class="label">Total</p>
                <div class="set"> <p>0 XRP.B</p> </div>
              </div>
            </li>
            <li>
              <div class="input_num flex-c input_text">
                <!-- <el-input v-model="sellXPR.total" placeholder=""></el-input> -->
                <el-input-number v-model="sellXPR.total" :precision="2" :step="2" :min="0" :controls="false" @change="totalChange('sellXPR')"></el-input-number>
              </div>
            </li>
            <li>
              <div class="set_btn">
                <el-button type="danger" size="mini" @click="sellXPRBtn">Sell XRP</el-button>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <el-dialog
      title="Send Ether & Tokens"
      :visible.sync="privateSureVisible"
      width="85%"
      :before-close="modalClick"
      >
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'bottom',
  data () {
    return {
      privateSureVisible: false,
      dataPage: {},
      tabType: 0,
      table: [],
      coinList: [
        {label: 'FSN', value: '0'},
        {label: 'ETC', value: '1'},
        {label: 'BNB', value: '2'}
      ],
      coin: '0',
      selectDate: '',
      selectPair: 'Buy & Sell',
      hideOtherPair: '',
      pairLeft: [],
      pairLeftVal: '',
      pairRight: [],
      pairRightVal: '',
      hidePairsVal: false,
      buyXPR: {
        price: '',
        amount: '',
        total: ''
      },
      sellXPR: {
        price: '',
        amount: '',
        total: ''
      },
      numberPrecision: 2,
      numberStep: 1e-2,
      openThead: [],
      totalBTC: 0,
      totalDoller: 0,
      getDataUrl: this.$$.serverURL + '/order/getOrder',
      orderState: 'Pending',
      address: this.$store.state.address
    }
  },
  watch: {
    coinChange (cur, old) {
      // console.log(cur)
      if (cur && cur.price && cur.price.toString().indexOf('.') !== -1) {
        this.buyXPR.price = this.sellXPR.price = this.$$.thousandBit(cur.price, 'no')
        this.numberPrecision = this.buyXPR.price.toString().split('.')[1].length
        this.numberStep = Math.pow(10,-Number(this.numberPrecision))
      }
      this.pairRightVal = cur.pair.split('/')[1]
      // console.log(this.pairRightVal)
    },
    isOrderRefresh () {
      this.changeTable()
    },
    selectDate (cur, old) {
      // console.log(cur)
      this.getHistory()
    },
    selectPair (cur, old) {
      // console.log(cur)
      this.getHistory()
    },
    pairLeftVal (cur, old) {
      // console.log(cur)
      if (this.pairLeftVal && this.pairRightVal) {
        this.hideOtherPair = this.pairLeftVal + '/' + this.pairRightVal
        this.getHistory()
      }
    },
    pairRightVal (cur, old) {
      // console.log(cur)
      if (this.pairLeftVal && this.pairRightVal) {
        this.hideOtherPair = this.pairLeftVal + '/' + this.pairRightVal
        this.getHistory()
      }
    }
  },
  computed: {
    coinChange () {
      return this.$store.state.exchange.pairInfo
    },
    isOrderRefresh () {
      return this.$store.state.exchange.isOrderRefresh
    }
  },
  mounted () {
    this.changeTable()
    this.getPair()
  },
  methods: {
    resetData () {
      this.pairLeftVal = ''
      this.pairRightVal = this.coinChange.pair ? this.coinChange.pair.split('/')[1] : ''
      this.hideOtherPair = ''
      this.hidePairsVal = false
      this.selectDate = ''
    },
    modalClick () {
      this.privateSureVisible = false
    },
    getElDialogView () {
      this.modalClick()
    },
    getSignData (data) {
      console.log(data)
      if (data.indexOf('0x') !== 0) {
        this.modalClick()
        return
      }
      // let cb = v_web3.lilo.xproOrderCreate(data)
      v_web3.eth.sendRawTransaction(data, (err, hash) => {
        if (err) {
          console.log(err)
        } else {
          this.$$.successTip(this.LANG.SUCCESS_TIP.TIP_1 + hash)
          this.dataPage.hash = hash
          this.dataPage.status = 'Pending'
          
          this.saveDatabase(this.dataPage)
          console.log(hash)
        }
        this.modalClick()
        this.$store.commit("storeIsOrderRefresh")
      })
    },
    hidePairs (val) {
      if (val) {
        this.hideOtherPair = this.coinChange.pair
      } else {
        this.hideOtherPair = ''
      }
      // console.log(2)
      this.getHistory()
    },
    saveDatabase (data) {
      $ajax.post(
        this.$$.serverURL + "/order/create",
        Qs.stringify(data)
      ).then(res => {
        console.log(res)
      })
    },
    getPair () {
      let pairData = v_web3.lilo.getPairList()
      let pairArr = [pairData]
      for (let pair of pairArr) {
        this.pairLeft.push(pair.split('/')[0])
        this.pairRight.push(pair.split('/')[1])
      }
    },
    getHistory (data) {
      this.table = []
      data = {
        pair: this.hideOtherPair,
        trade: this.hideOtherPair,
        side: this.selectPair !== 'Buy & Sell' ? this.selectPair : '',
        timestamp:  this.selectDate,
        status: this.orderState
      }
      $ajax.post(
        this.getDataUrl,
        Qs.stringify(data)
      ).then(res => {
        // console.log(res.data)
        if (res && res.data && res.data.info.length > 0) {
          for (let item of res.data.info) {
            if (item.timestamp) {
              // console.log(item.timestamp)
              item.timestamp = this.$$.timeChange({
                date: Number(item.timestamp),
                type: 'yyyy-mm-dd hh:mm:ss'
              })
            }
            if (item.value) {
              item.value = v_web3.fromWei(item.value, 'ether')
              item.value = this.$$.thousandBit(item.value, 2)
            }
            if (item.quantity) {
              item.total = Number(item.quantity) * item.price
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
    priceChange (type) {
      this.amountChange(type)
    },
    amountChange (type) {
      this[type].total = this[type].amount * this[type].price
    },
    totalChange (type) {
      this[type].amount = this[type].total / this[type].price
    },
    buyXPRBtn () {
      this.sendTransfer("Buy", "buyXPR")
    },
    sellXPRBtn () {
      this.sendTransfer("Sell", "sellXPR")
      // this.sendTransfer("ETH/BTC", "LimitOrder", "Sell", "10.123456", "1")
    },
    sendTransfer (type, mode) {
      if (!this.$store.state.address) {
        this.$message({
          showClose: true,
          message: this.LANG.ERROR_TIP.TIP_12,
          type: 'warning'
        })
        return
      }
      var batch = v_web3.createBatch()
      // this.address = '0x177b05bde6ba930244b7efcac141bd7c77fff73e'
      batch.add(v_web3.eth.getTransactionCount.request(this.address, "pending"))
      batch.add(v_web3.eth.estimateGas.request({to: this.address}))
      let [nonceNum, gasPriceNum, gasLimitNum] = []
      batch.requests.push({method: "eth_gasPrice",params: []})
      batch.requestManager.sendBatch(batch.requests, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          if (results[0].result || results[0].result === 0) {
            nonceNum = parseInt(results[0].result, 16)
          } else {
            nonceNum = 0
          }
          if (results[1].result || results[1].result === 0) {
            gasLimitNum = parseInt(results[1].result, 16)
          } else {
            gasLimitNum = 0
          }
          if (results[2].result || results[2].result === 0) {
            gasPriceNum = parseInt(results[2].result, 16)
          } else {
            gasPriceNum = 0
          }
          // console.log(this.coinChange)
          this.dataPage = {
            nonce: Number(nonceNum),
            gasPrice: Number(gasPriceNum),//Number类型 
            gasLimit: Number(gasLimitNum),
            from: this.address,
            to: '0x00000000000000000000000000000000000000ec',
            value: v_web3.toWei(Number(this[mode].amount), "ether"),//Number类型,
            data: 'ORDER:' + this.address + ':' + this.coinChange.pair + ':LimitOrder:' + type + ':' + this[mode].price + ':' + this[mode].amount + ':GTE',
            side: type,
            price: this[mode].price,
            pair: this.coinChange.pair,
            chainId: 40400
          }
          this.privateSureVisible = true
          console.log(this.dataPage)
        }
      })
    },
    resetPrice (type) {
      this[type].price = this.coinChange.price
      this.amountChange(type)
    },
    tabClick (e) {
      if (e.target.nodeName.toLowerCase() === 'p') {
        this.tabType = parseInt(e.target.dataset.index)
        this.changeTable()
      }
    },
    changeTable () {
      this.resetData()
      if (this.tabType === 0) {
        this.openThead = [
          {th: 'TxHash', width: '15%', param: 'hash', class: ''},
          {th: 'Date', width: '20%', param: 'timestamp', class: ''},
          {th: 'Pair', width: '10%', param: 'pair', class: ''},
          {th: 'Side', width: '8%', param: 'side', class: ''},
          {th: 'Price', width: '10%', param: 'price', class: ''},
          {th: 'Amount', width: '8%', param: 'value', class: ''},
          {th: 'Filled', width: '10%', param: 'quantity', class: ''},
          {th: 'Notional', width: '10%', param: 'left', class: ''}
        ]
        this.orderState = 'Pending'
        this.getDataUrl = this.$$.serverURL + "/order/getOrder"
      } else if (this.tabType === 1) {
        this.openThead = [
          {th: 'TxHash', width: '18%', param: 'hash', class: ''},
          {th: 'Date', width: '20%', param: 'timestamp', class: ''},
          {th: 'Pair', width: '10%', param: 'pair', class: ''},
          {th: 'Side', width: '8%', param: 'side', class: ''},
          {th: 'Price', width: '10%', param: 'price', class: ''},
          {th: 'Amount', width: '10%', param: 'value', class: ''},
          {th: 'Filled', width: '8%', param: 'quantity', class: ''},
          {th: 'Notional', width: '10%', param: '', class: ''},
          {th: 'Status', width: '8%', param: 'status', class: ''}
        ]
        // this.orderState = 'Success'
        this.orderState = ''
        this.getDataUrl = this.$$.serverURL + "/order/getOrder"
      } else if (this.tabType === 2) {
        this.openThead = [
          {th: 'BlockHeight', width: '10%', param: 'height', class: ''},
          {th: 'Pair', width: '10%', param: 'trade', class: ''},
          {th: 'Side', width: '8%', param: 'side', class: ''},
          {th: 'Price', width: '10%', param: 'price', class: ''},
          {th: 'Filled', width: '20%', param: 'quantity', class: ''},
          {th: 'Total', width: '12%', param: 'total', class: ''}
        ]
        this.getDataUrl = this.$$.serverURL + "/order/getTx"
      } else if (this.tabType === 3) {
        this.openThead = [
          {th: 'Asset', width: '10%', param: 'coin', class: ''},
          {th: 'Name', width: '20%', param: 'coinAll', class: ''},
          {th: 'Total Balance', width: '15%', param: 'balance', class: ''},
          {th: 'Available Balance', width: '20%', param: 'balance', class: ''},
          {th: 'Frozen', width: '10%', param: 'freeze', class: ''},
          {th: 'In order', width: '10%', param: '', class: ''},
          {th: 'BTC Value', width: '10%', param: 'BTCval', class: ''}
        ]
        this.table = this.$store.state.coinlist
        for (let i of this.table) {
          this.totalBTC += Number(i.BTCval)
          this.totalDoller += Number(i.balanceDollar)
        }
      }
      if (this.tabType !== 3) {
        // console.log(1)
        this.getHistory()
      }
    }
  }
}
</script>
