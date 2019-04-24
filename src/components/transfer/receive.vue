<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <el-form label-position="top" label-width="80px">
          <el-form-item :label="addressTitle">
            <el-input v-model="walletAddress" id="walletAdressHide" class="font24"></el-input>
          </el-form-item>
        </el-form>
        <div class="receiveAddress_btn flex-c" id="receiveAddressBtn">
          <button class="btn blue flex-c" @click="qrcode(coinAddress)">
            <div class="icon">
              <img src="@etc/img/QRcode.svg">
            </div>
            {{LANG.BTN.SHOW_QR_CODE}}
          </button>
          <button
            class="btn cyan flex-c"
            @click="copyAddress('walletAdressHide', 'receiveAddressBtn')"
          >
            <div class="icon"><img src="@etc/img/copy.svg"></div>
            <el-popover
              trigger="hover"
              :content="LANG.BTN.COPY_CLIPBOARD">
              <div class="addreess" slot="reference">{{LANG.BTN.COPY_CLIPBOARD}}</div>
              <!-- <el-button slot="reference">hover 激活</el-button> -->
            </el-popover>
            <!-- {{LANG.BTN.COPY_CLIPBOARD}} -->
          </button>
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">{{LANG.TITLE.HISTORY}}:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive">
          <el-table
            :data="historyData"
            style="width: 100%"
            empty-text="Null"
          >
            <el-table-column
              :label="LANG.THEAD.PUBLIC.STATUS"
              width="80"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.status" :class="scope.row.status !== LANG.LABEL.SUCCESS ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="LANG.THEAD.COIN" prop="coin" width="80"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.AMOUNT" prop="value" width="120"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.DATE" prop="date" width="180"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.INFORMATION" min-width="360">
              <template slot-scope="scope">
                <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                  <el-collapse-item :title="scope.row.hash">
                    <ul class="list">
                      <li>{{LANG.LABEL.TXID}}：{{scope.row.hash}}</li>
                      <li>{{LANG.LABEL.ADDRESS}}：{{scope.row.from}}</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-dialog
        :visible.sync="codeViewVisible"
        width="380px"
        >
        <div class="qrcodeCont_box">
          <div id="qrcode" class="flex-c"></div>
          <div class="qrcodeCont_title">
            <h3>{{LANG.TITLE.YOUR_ADDREAA}}</h3>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: "receive",
  props: ["selectData"],
  data () {
    return {
      addressTitle: "",
      walletAddress: "",
      historyData: [],
      refreshHistory: null,
      coinAddress: "",
      codeViewVisible: false,
      activeNames: ""
      // count: 0
    }
  },
  watch: {
    selectData (cur, old) {
      if (cur.coin !== old.coin) {
        this.getInitData()
      }
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    this.pageRefresh()
    this.refreshHistory = setInterval(() => {
      this.getSendHistory()
    }, 30000)
    if (this.selectData.coin) {
      this.getInitData()
    }
  },
  methods: {
    getInitData () {
      this.titleChange(this.selectData.coin)
      this.coinAddress = this.selectData.address
      this.getSendHistory()
    },
    pageRefresh () {
      if (this.selectData.coin) {
        this.titleChange(this.selectData.coin)
      }
      if (location.href.indexOf("tranSend") === -1) {
        document.getElementById("tabBtnFirst").classList.add("router-link-active")
      }
    },
    titleChange (bitType) {
      this.addressTitle = bitType + " Receiving Address"
    },
    qrcode (cont) {
      this.codeViewVisible = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand("Copy")
      this.$message({
        message: this.LANG.SUCCESS_TIP.TIP_0,
        type: 'success'
      })
    },
    getSendHistory () {
      if (this.$store.state.wallet.safeMode) {
        return
      }
      if (!this.walletAddress || !this.selectData.coin) {
        return
      }
      $ajax.post(this.$$.serverURL + "/transfer/receiveHistory", Qs.stringify({
          to: this.walletAddress,
          coin: this.selectData.coin
        })
      ).then(res => {
        res = res.data
        this.historyData = []
        if (res.msg === "success" && res.info.length > 0) {
          for (let i = 0; i < res.info.length; i++) {
            if (res.info[i].coin === this.selectData.coin && res.info[i].hash) {
              res.info[i].date = this.$$.timeChange({date: res.info[i].timestamp, type:"yyyy-mm-dd hh:mm"})
              res.info[i].value = this.$$.thousandBit(res.info[i].value, "no")
              res.info[i].status = this.getStatus(res.info[i])
              this.historyData.push(res.info[i])
            }
          }
        }
      })
    },
    getStatus (txhax) {
      let statusFsn = ""
      if (txhax.hash) {
        let receipt = v_web3.eth.getTransactionReceipt(txhax.hash)
        if (receipt && receipt.status) {
          statusFsn = this.LANG.LABEL.SUCCESS
        } else {
          statusFsn = this.LANG.LABEL.PENDING
        }
      } else {
        statusFsn = this.LANG.LABEL.FAILURE
      }
      return statusFsn
    }
  },
  beforeDestroy () {
    clearInterval(this.refreshHistory)
    this.refreshHistory = null
  }
}
</script>
