<template>
  <div class="fullScreen rTabCont_box">
    <div class="rTabCont_top" id="rightUp">
      <div class="rTabCont_switch">
        <ul class="flex-sc" @click="tabClick">
          <li><div class="img" :class="tabType === 0 ? 'active-gray' : ''" data-index="0"><img data-index="0" src="@etc/img/red-green-D.svg"></div></li>
          <li><div class="img" :class="tabType === 1 ? 'active-gray' : ''" data-index="1"><img data-index="1" src="@etc/img/green-D.svg"></div></li>
          <li><div class="img" :class="tabType === 2 ? 'active-gray' : ''" data-index="2"><img data-index="2" src="@etc/img/red-D.svg"></div></li>
        </ul>
      </div>
      <div class="lTabTop_tableBox">
        <ul class="table_thead flex-bc">
          <li v-for="(item, index) in tableThead" :key="index" :style="'width:' + item.width"><p :class="item.class ? item.class : ''">{{item.th}}</p></li>
        </ul>
        <div class="table_scroll" v-if="tabType !== 1">
          <el-scrollbar style="height:100%;width: 100%;" ref="rightTopScrollbar">
            <ul class="table_tbody flex-bc" v-for="(items, indexs) in tableBuy" :key="indexs">
              <li v-for="(item, index) in tableThead" :key="index" :style="'width:' + item.width">
                <p :class="(item.param === 'price' ? 'red' : '') + (item.class ? item.class : '')">{{isNaN(items[item.param]) ? items[item.param] : $$.thousandBit(items[item.param], 6)}}</p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <div class="rTabCont_bottom" id="rightDown">
      <div class="rTabCont_price">
        <ul class="flex-sc">
          <li><p class="green">{{price}}<i class="el-icon-sort-up"></i></p></li>
          <li><p class="yellow">$ {{dollerPrice}}</p></li>
        </ul>
      </div>
      <div class="lTabTop_tableBox" v-if="tabType !== 2">
        <div class="table_scroll">
          <el-scrollbar style="height:100%;width: 100%;">
            <ul class="table_tbody flex-bc" v-for="(items, indexs) in tableSell" :key="indexs">
              <li v-for="(item, index) in tableThead" :key="index" :style="'width:' + item.width">
                <p :class="(item.param === 'price' ? 'color_green' : '') + (item.class ? item.class : '')">{{isNaN(items[item.param]) ? items[item.param] : $$.thousandBit(items[item.param], 6)}}</p>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>


<script>
export default {
  name: 'right',
  data () {
    return {
      radio: '1',
      tabType: 0,
      tableBuy: [],
      tableSell: [],
      tableThead: [
        {th: 'Price', width: '35%', param: 'price', class: ''},
        {th: 'Amount', width: '35%', param: 'value', class: ''},
        {th: 'Total', width: '30%', param: 'total', class: 'text-r'},
      ],
      price: 0,
      dollerPrice: 0
    }
  },
  watch: {
    coinChange (cur, old) {
      // console.log(cur)
      if (cur) {
        this.price = this.$$.thousandBit(cur.price, 6)
        for (let item of this.$store.state.coinlist) {
          // console.log(item)
          if (item.coin === cur.pair.split('/')[0]) {
            this.dollerPrice = this.$$.thousandBit(Number(item.price_usd) * (cur.price), 2)
            break
          }
        }
        this.getData()
      }
    },
    isOrderRefresh () {
      this.getData()
    },
  },
  computed: {
    coinChange () {
      return this.$store.state.exchange.pairInfo
    },
    isOrderRefresh () {
      return this.$store.state.exchange.isOrderRefresh
    }
  },
  methods: {
    tabClick (e) {
      // console.log(e.target.nodeName.toLowerCase())
      if (e.target.nodeName.toLowerCase() === 'img' || e.target.nodeName.toLowerCase() === 'div') {
        this.tabType = parseInt(e.target.dataset.index)
        this.initTable()
      }
    },
    getData () {
      this.getHistory({side: 'Buy'})
      this.getHistory({side: 'Sell'})
    },
    getHistory (data) {
      if (data.side === 'Buy') {
        this.tableBuy = []
      } else {
        this.tableSell = []
      }
      data.pair = this.coinChange.pair
      $ajax.post(
        this.$$.serverURL + '/order/getOrder',
        Qs.stringify(data)
      ).then(res => {
        // console.log(res.data)
        if (res && res.data && res.data.info.length > 0) {
          for (let item of res.data.info) {
            item.price = item.price ? Number(item.price) : 0
            if (item.value) {
              item.value = v_web3.fromWei(item.value, 'ether')
              item.total = Number(item.value) * item.price
              item.value = this.$$.thousandBit(item.value, 2)
            }
            item.hash = item.hash ? this.$$.cutOut(item.hash, 6, 5) : ''
            // this.table.push(item)
            if (data.side === 'Buy') {
              this.tableBuy.push(item)
            } else {
              this.tableSell.push(item)
            }
          }
        } else {
          if (data.side === 'Buy') {
            this.tableBuy = []
          } else {
            this.tableSell = []
          }
        }
        // console.log(this.table)
      })
    },
    initTable () {
      const _h = document.getElementsByClassName('rTabCont_box')[0].offsetHeight
      const _top = document.getElementById('rightUp')
      const _bottom = document.getElementById('rightDown')
      if (this.tabType === 0) {
        _top.style.height = '50%'
        _bottom.style.height = '50%'
      } else if (this.tabType === 1) {
        _top.style.height = 60 + 'px'
        _bottom.style.height = _h - 60 + 'px'
      } else if (this.tabType === 2) {
        _top.style.height = _h - 30 + 'px'
        _bottom.style.height = 30 + 'px'
      }
    },
    scrollDown() {
      this.$refs['rightTopScrollbar'].wrap.scrollTop = this.$refs['rightTopScrollbar'].wrap.scrollHeight
    }
  },
  mounted () {
    this.scrollDown()
    // console.log(this.coinChange)
    if (this.coinChange) {
      this.getData()
    }
  }
}
</script>
