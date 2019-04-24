<template>
  <div>
    <div class="receiveContent_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……">
      <div class="receiveAddress_box">


        <el-form label-position="top" label-width="80px">
          <el-form-item :label="addressTitle + '：'">
            <el-input v-model="toAddress" @change="toaddresGas"></el-input>
          </el-form-item>
          <el-form-item :label="LANG.LABEL.AMOUNT + '：'">
            <el-input v-model="sendAmound" @keypress="keyPressBtn"></el-input>
            <span :class="Number(balanceNum) === 0 ? 'color_red' : 'color_99'">{{Number(balanceNum) === 0 ? "Not a valid amount" : "Account Balance: " + balanceNum}}</span>
          </el-form-item>
          <el-form-item label="Advanced(Nonce & Gas Price & Gas Limit & Data):">
            <el-switch
              v-model="selfSet"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
          <div v-if="selfSet">
            <el-form-item label="Nonce：">
              <el-input v-model="nonceNum"></el-input>
            </el-form-item>
            <el-form-item label="Gas Price：">
              <el-input v-model="gasPriceNum"></el-input>
            </el-form-item>
            <el-form-item label="Gas Limit：">
              <el-input v-model="gasLimitNum"></el-input>
            </el-form-item>
            <el-form-item label="Hex Data：">
              <el-input v-model="sendData" placeholder="0x"></el-input>
            </el-form-item>
            <el-form-item label="Signed Transaction：" v-if="serializedTxView">
              <el-col :span="13">
                <el-input type="textarea" v-model="serializedTxVal" placeholder="0x" :rows="12" style="margin-top:8px"></el-input>
              </el-col>
              <el-col class="line" :span="2"></el-col>
              <el-col :span="11">
                <div class="flex-ec">
                  <div id="qrcode"></div>
                </div>
              </el-col>
            </el-form-item>
          </div>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10" @click="privateSure">{{$store.state.safeMode ? LANG.BTN.GENERATE_INFORMATION : LANG.BTN.SEND}}</button>
          <!-- <button class="btn blue flex-c W240 mt-10" @click="privateSure" v-if="$store.state.safeMode">{{LANG.BTN.GENERATE_INFORMATION}}</button> -->
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
                      <li>{{LANG.LABEL.ADDRESS}}：{{scope.row.to}}</li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog
      title="Send Ether & Tokens"
      :visible.sync="privateSureVisible"
      width="85%"
      :before-close="modalClick"
      >
      <!-- <router-view @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView"></router-view> -->
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>

    <el-dialog
      :title="LANG.TITLE.TO_SEND"
      :visible.sync="sendInfoVisible"
      width="60%"
      :before-close="modalClick"
      >
      <div class="sendInfo_box">
        <ul>
          <li>
            <h3>To Address:</h3>
            <span>{{toAddress}}</span>
          </li>
          <li>
            <h3>From Address:</h3>
            <span>{{walletAddress}}</span>
          </li>
          <li>
            <h3>Amount to Send:</h3>
            <span>{{sendAmound}}</span>
          </li>
          <li>
            <h3>Account Balance:</h3>
            <span>{{Number(balanceNum)}} {{selectData.coin}}</span>
          </li>
          <li>
            <h3>Coin:</h3>
            <span>{{selectData.coin}}</span>
          </li>
          <li>
            <h3>Network:</h3>
            <span>{{netWorkInfo}}</span>
          </li>
          <li>
            <h3>Gas Limit:</h3>
            <span>{{gasLimitNum}}</span>
          </li>
          <li>
            <h3>Gas Price:</h3>
            <span>{{gasPriceNum}}</span>
          </li>
          <li>
            <h3>Max TX Fee:</h3>
            <span>{{maxFee}}</span>
          </li>
          <li>
            <h3>Nonce:</h3>
            <span>{{nonceNum}}</span>
          </li>
          <li>
            <h3>Data:</h3>
            <span>{{dataPage.data || "(none)"}}</span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="modalClick">{{LANG.BTN.GET_OUT}}</el-button>
        <el-button type="primary" size="small" @click="sendAmoundInfo">{{LANG.BTN.YES_SURE}}</el-button>
        <!-- <button type="button" class="btn btn-default" @click="modalClick">{{LANG.BTN.GET_OUT}}</button>
        <button type="button" class="btn btn-primary" @click="sendAmoundInfo">{{LANG.BTN.YES_SURE}}</button> -->
      </span>
    </el-dialog>

  </div>
</template>

<style>
/* .receiveAddress_box .el-form--label-top .el-form-item__label{padding:0;line-height: 24px;} */
</style>


<script>
export default {
  name: "receive",
  props: ["selectData"],
  data () {
    return {
      addressTitle: "",
      coinAddress: "",
      toAddress: "",
      historyData: [],
      walletAddress: "",
      sendAmound: "",
      gasPriceNum: "",
      gasLimitNum: "",
      balanceNum: "",
      nonceNum: "",
      dataPage: "",
      serializedTx: "",
      maxFee: "",
      netWorkInfo: "",
      refreshHistory: null,
      sendInfoVisible: false,
      privateSureVisible: false,
      activeNames: "",
      selfSet: false,
      sendData: "0x",
      fullscreenLoading: true,
      serializedTxView: false,
      serializedTxVal: ""
    }
  },
  watch: {
    selectData (cur, old) {
      // console.log(this)
      // console.log(getInitData)
      // console.log(this.getInitData)
      if (cur.coin !== old.coin) {
        this.getInitData()
      }
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.address
    this.pageRefresh()
    if (this.selectData.coin) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
    this.refreshHistory = setInterval(() => {
      if (!this.$store.state.safeMode) {
        this.getSendHistory()
      }
    }, 20000)
    if (this.$store.state.wallet.safeMode) {
      this.selfSet = this.$store.state.wallet.safeMode
    }
  },
  computed: {
    titleChange: function () {
      // this.addressTitle = bitType + " Send Address"
      return this.selectData.coin + " Send Address"
    },
  },
  methods: {
    getElDialogView () {
      this.modalClick()
    },
    keyPressBtn (e) {
      if (e.which === 13) {
        this.privateSure()
      }
    },
    toaddresGas() {
      if (this.$store.state.wallet.safeMode) {
        return
      }
      try {
        this.gasLimitNum = v_web3.eth.estimateGas({to: this.toAddress})
      } catch (error) {
        this.$$.errTip(error)
        return
      }
    },
    getInitData () {
      this.coinAddress = this.selectData.address
      // this.titleChange(this.selectData.coin)
      this.addressTitle = this.titleChange
      if (this.$store.state.wallet.safeMode) {
        this.fullscreenLoading = false
        return
      }
      this.getSendHistory()
      var batch = v_web3.createBatch()
      batch.add(v_web3.eth.getTransactionCount.request(this.$store.state.address, "pending"))
      // batch.add(v_web3.eth.gasPrice.request(this.$store.state.wallet.address))
      if (this.selectData.coin === "FSN") {
        batch.add(v_web3.eth.getBalance.request(this.coinAddress))
      } else {
        batch.add(v_web3.lilo.dcrmGetBalance.request(this.$store.state.address, this.selectData.coin))
      }
      console.log(batch)
      batch.requests.push({method: "eth_gasPrice",params: []})
      batch.requestManager.sendBatch(batch.requests, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          if (results[0].result || results[0].result === 0) {
            this.nonceNum = parseInt(results[0].result, 16)
          } else {
            this.nonceNum = 0
          }
          if (results[1].result || results[1].result === 0) {
            this.balanceNum = v_web3.fromWei(results[1].result, "ether")
          } else {
            this.balanceNum = 0
          }
          if (results[2].result || results[2].result === 0) {
            this.gasPriceNum = parseInt(results[2].result, 16)
          } else {
            this.gasPriceNum = 0
          }
        }
        console.log(results)
      })
      this.fullscreenLoading = false
    },
    modalClick () {
      // this.$router.push("/Transfer/tranSend")
      this.privateSureVisible = false
      this.sendInfoVisible = false
    },
    privateSure () {
      if (!this.toAddress) {
        this.$$.errTip(this.selectData.coin + this.LANG.ERROR_TIP.TIP_2)
        return
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$$.errTip(this.selectData.coin + this.LANG.ERROR_TIP.TIP_4)
        return
      }
      if (this.selectData.coin !== "BTC" && this.toAddress.indexOf("0x") !== 0) {
        this.$$.errTip(this.selectData.coin + this.LANG.ERROR_TIP.TIP_5)
        return
      }
      let getAmountTip = this.$$.limitCoin(this.sendAmound, this.selectData.limit, this.selectData.number)
      if (getAmountTip.flag) {
        this.$$.errTip(getAmountTip.msg)
        return
      }
      this.setBaseSendData()
      let to_value = v_web3.toWei(this.sendAmound, "ether")
      if (this.selectData.coin === "BTC") {
        to_value = this.$$.toWei(this.sendAmound, "btc")
      }
      this.dataPage = {
        nonce: this.nonceNum,
        gasPrice: Number(this.gasPriceNum),//Number类型 
        gasLimit: Number(this.gasLimitNum),
        from: this.walletAddress,
        to: this.toAddress,
        value: Number(to_value),//Number类型,
        coin: this.selectData.coin
      }
      if (this.selectData.coin !== "FSN") {
        this.dataPage.data = this.sendData ? this.sendData : "TRANSACTION:" + this.toAddress + ":" + to_value + ":" + this.selectData.coin
        this.dataPage.sendType = "SENDDCRM"
        this.dataPage.to = "0x00000000000000000000000000000000000000dc"
        this.dataPage.value = "0"
      }
      this.privateSureVisible = true
      // this.$router.push("/pwdSend")
    },
    getSignData (data) {
      if (data) {
        if (data.type && data.type === "METAMASK" && !this.$store.state.wallet.safeMode) {
          this.sendDatabase(data)
        } else if (this.$store.state.wallet.safeMode) {
          this.serializedTxVal = data.serializedTx ? data.serializedTx : data
          this.serializedTxView = true
          this.sendInfoVisible = false
          this.qrcode(this.serializedTxVal)
        } else {
          this.serializedTx = data
          this.sendInfoVisible = true
        }
      } else {
        this.sendInfoVisible = false
        this.$$.errTip(this.selectData.coin + this.LANG.ERROR_TIP.TIP_6)
      }
      this.privateSureVisible = false
    },
    qrcode (cont) {
      this.serializedTxView = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    // titleChange (bitType) {
    //   this.addressTitle = bitType + " Send Address"
    // },
    pageRefresh () {
      if (location.href.indexOf("tranSend") !== -1) {
        document.getElementById("tabBtnFirst").classList.remove("router-link-active")
      }
    },
    changeAmount () {
      this.sendAmound = this.$$.thousandChange(this.sendAmound, 18)
    },
    setBaseSendData () {
      let to_value = v_web3.toWei(this.sendAmound, "ether")
      this.maxFee = v_web3.fromWei(Number(this.gasLimitNum) * Number(this.gasPriceNum), "ether")
      try {
        this.netWorkInfo = v_web3.version.node
      } catch (error) {
        this.$$.errTip(error)
        return
      }
    },
    sendAmoundInfo () {
      let dataBase = {
        txhax: "",
        status: ""
      }
      v_web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
        if (!err) {
          dataBase.txhax = hash
          dataBase.status = this.LANG.LABEL.SUCCESS
          this.sendInfoVisible = false
          this.$$.successTip(this.LANG.SUCCESS_TIP.TIP_1 + hash)
          this.$store.commit("storeWalletLoadFlag", true)
        } else {
          console.log(err)
          dataBase.txhax = ""
          dataBase.status = this.LANG.LABEL.FAILURE
          this.$$.errTip(err)
        }
        this.sendDatabase(dataBase)
        this.modalClick()
      })
    },
    sendDatabase (data) {
      $ajax.post(
        this.$$.serverURL + "/transfer/create",
        Qs.stringify({
          value: Number(this.$$.thousandToNum(this.sendAmound)),
          coin: this.selectData.coin,
          to: this.toAddress,
          from: this.walletAddress,
          timestamp: Date.now(),
          hash: data.txhax,
          nonce: this.dataPage.nonce,
          gasPrice: this.dataPage.gasPrice,
          gasLimit: this.dataPage.gasLimit,
          status: data.status
        })
      ).then(res => {
        res = res.data
        if (res.msg === "success") {
          this.getSendHistory()
        }
      })
    },
    getSendHistory () {
      if (this.$store.state.wallet.safeMode) {
        return
      }
      if (!this.walletAddress || !this.selectData.coin) {
        return
      }
      $ajax.post(this.$$.serverURL + "/transfer/history", Qs.stringify({
          from: this.walletAddress,
          coin: this.selectData.coin
        })
      ).then(res => {
        // console.log(res)
        res = res.data
        this.historyData = []
        if (res.msg === "success" && res.info.length > 0) {
          for (let i = 0; i < res.info.length; i++) {
            res.info[i].date = this.$$.timeChange({date: res.info[i].timestamp, type:"yyyy-mm-dd hh:mm"})
            res.info[i].value = this.$$.thousandBit(res.info[i].value, "no")
            res.info[i].status = this.getStatus(res.info[i])
          }
          this.historyData = res.info
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
