<template>
  <div>
    <div class="receiveContent_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……">
      <div class="receiveAddress_box">
        <!-- <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input
            type="text"
            class="input-text input"
            v-model="coinAddress"
            readonly="readonly"
            id="walletAdressHide"
          />
        </div> -->
        <el-form label-position="top" label-width="80px">
          <el-form-item :label="addressTitle">
            <el-input v-model="coinAddress" id="walletAdressHide" class="font24"></el-input>
          </el-form-item>
        </el-form>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(coinAddress)"><div class="icon"><img src="@etc/img/QRcode.svg"></div>{{LANG.BTN.SHOW_QR_CODE}}</button>
          <button class="btn cyan flex-c" @click="copyAddress('walletAdressHide')">
            <!-- <div class="icon"><img src="@etc/img/copy.svg"></div>{{LANG.BTN.COPY_CLIPBOARD}} -->
            <div class="icon"><img src="@etc/img/copy.svg"></div>
            <el-popover
              trigger="hover"
              :content="LANG.BTN.COPY_CLIPBOARD">
              <div class="addreess" slot="reference">{{LANG.BTN.COPY_CLIPBOARD}}</div>
              <!-- <el-button slot="reference">hover 激活</el-button> -->
            </el-popover>
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
            empty-text="Null"
            style="width: 100%">
            <el-table-column
              :label="LANG.THEAD.PUBLIC.STATUS"
              width="80"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.statusFsn" :class="scope.row.statusFsn !== LANG.LABEL.SUCCESS ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="LANG.THEAD.COIN" prop="coin" width="80"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.AMOUNT" prop="value2" width="120"></el-table-column>
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
            <el-table-column :label="LANG.THEAD.ACTIONS" width="100">
              <template slot-scope="scope">
                <el-button type="info" size="small" v-if="scope.row.statusFsn === 'New'" @click="privateSure({
                  nonce: scope.row.nonce,
                  gasPrice: scope.row.gasPrice,
                  gas: scope.row.gas,
                  value: scope.row.value2,
                  hash: scope.row.hash
                })">
                  {{LANG.TITLE.LOCKIN}}
                </el-button>
                <!-- <button class="btn" v-if="scope.row.statusFsn === 'New'" @click="privateSure({
                  nonce: scope.row.nonce,
                  gasPrice: scope.row.gasPrice,
                  gas: scope.row.gas,
                  value: scope.row.value2,
                  hash: scope.row.hash
                })">
                  {{LANG.TITLE.LOCKIN}}
                </button> -->
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

    <el-dialog
      :title="LANG.TITLE.LOCKIN"
      :visible.sync="privateSureVisible"
      width="85%"
      :before-close="modalClick"
      >
      <!-- <router-view @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView"></router-view> -->
      <pwdSure @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView" v-if="privateSureVisible"></pwdSure>
    </el-dialog>


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
      coinAddress: "",
      historyData: [],
      dataPage: {},
      serializedTx: "",
      dcrmAddress: "",
      codeViewVisible: false,
      privateSureVisible: false,
      activeNames: "",
      fullscreenLoading: true
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
    this.pageRefresh()
    this.walletAddress = this.$store.state.address
    if (this.selectData) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
    // this.getTRONhistory()
  },
  methods: {
    getInitData () {
      this.titleChange(this.selectData.coin)
      this.dcrmAddress = this.coinAddress = this.selectData.address
      this.getDatabaseInfo()
      this.fullscreenLoading = false
    },
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO/lockIn")
      this.privateSureVisible = false
    },
    titleChange (bitType) {
      this.addressTitle = bitType + " Deposit Address"
    },
    getSignData (data) {
      if (data) {
        this.serializedTx = data
        this.sendAmoundInfo()
      } else {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_6)
      }
      this.privateSureVisible = false
    },
    sendAmoundInfo () {
      v_web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
        if (!err) {
          this.$$.successTip(this.LANG.SUCCESS_TIP.TIP_1 + hash)
          this.updateDatabaseInfo({
            hash: this.dataPage.hash,
            fsnhash: hash
          })
          this.$store.commit("storeWalletLoadFlag", true)
        } else {
          console.log(err)
          this.$$.errTip(err)
        }
      })
    },
    privateSure (data) {
      data.gasPrice = data.gasPrice ? data.gasPrice : v_web3.eth.gasPrice.toString(10)
      data.gas = data.gas ? data.gas : v_web3.eth.estimateGas({to: this.toAddress})
      let to_value
      if (this.selectData.coin === "BTC") {
        to_value = this.$$.toWei(data.value, "btc")
      } else {
        to_value = v_web3.toWei(data.value, "ether")
      }
      this.dataPage = {
        nonce: v_web3.eth.getTransactionCount(this.walletAddress),
        gasPrice: Number(data.gasPrice),//Number类型 
        gasLimit: Number(data.gas) * 6,
        from: this.walletAddress,
        to: "0x00000000000000000000000000000000000000dc",
        value: Number(0),//Number类型
        data: "LOCKIN:" + data.hash + ":" + to_value + ":" + this.selectData.coin,
        sendType: "LOCKIN",
        coin: this.selectData.coin,
        hash: data.hash
      }
      console.log(this.dataPage)
      // this.$router.push("/pwdLockIn")
      this.privateSureVisible = true
    },
    qrcode (cont) {
      this.codeViewVisible = true
			this.$nextTick(() => {
        this.$$.qrCode(cont, "qrcode")
			})
    },
    copyAddress (id) {
      document.getElementById(id).select()
      document.execCommand("Copy")
      this.$message({
        message: this.LANG.SUCCESS_TIP.TIP_0,
        type: 'success'
      })
    },
    pageRefresh () {
      if (this.selectData) {
        this.titleChange(this.selectData.coin)
      }
      if (location.href.indexOf("lockOut") === -1) {
        document.getElementById("tabBtnFirst").classList.add("router-link-active")
      }
    },
    getHistory (data) {
      $ajax.post("https://api-rinkeby.etherscan.io/api?module=account&action=" + this.selectData.token + "&address=" + this.coinAddress, Qs.stringify(data)
      ).then(res => {
        res = res.data
        if (res.result && res.result.length > 0 && (typeof res.result).toLowerCase() === "object") {
          res.result = res.result
        } else {
          res.result = []
        }
        this.delRepeat(data, res.result)
      })
    },
    getStatus (txhax) {
      let statusFsn = ""
      if (txhax.fsnhash) {
        try {
          let receipt = v_web3.eth.getTransactionReceipt(txhax.fsnhash)
          if (receipt && receipt.status) {
            statusFsn = this.LANG.LABEL.SUCCESS
          } else {
            statusFsn = this.LANG.LABEL.FAILURE
          }
        } catch (error) {
          statusFsn = this.LANG.LABEL.FAILURE
        }
      } else {
        if (txhax.hash) {
          statusFsn = this.LANG.LABEL.NEW
        } else {
          statusFsn = this.LANG.LABEL.FAILURE
        }
      }
      return statusFsn
    },
    delRepeat (data, urldata) {
      this.historyData = []
      let arrObj = []
      let newArr = []
      let objArr = {}
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          arrObj.push(data[i])
        }
      }
      if (urldata && urldata.length > 0 && (typeof urldata).toLowerCase() === "object") {
        for (let i = 0; i < urldata.length; i++) {
          if (this.selectData.coin === "ETH" && urldata[i].to.toLowerCase() === this.coinAddress.toLowerCase()) {
              arrObj.push(urldata[i])
          } else if (this.selectData.coin === "BTC"){
            arrObj.push(urldata[i])
          } else {
            if  (urldata[i].to.toLowerCase() === this.coinAddress.toLowerCase() && urldata[i].tokenSymbol === this.selectData.coin) {
              arrObj.push(urldata[i])
            }
          }
        }
      }
      for (let i = 0; i < arrObj.length; i++) {
        if (!objArr[arrObj[i].hash]) {
          newArr.push(arrObj[i])
          objArr[arrObj[i].hash] = true
        }
      }
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].statusFsn = this.getStatus(newArr[i])
        if (newArr[i].timestamp) {
          newArr[i].timestamp = newArr[i].timestamp.length > 10 ? newArr[i].timestamp : newArr[i].timestamp * 1000
        } else {
          newArr[i].timestamp = newArr[i].timeStamp.length > 10 ? newArr[i].timeStamp : newArr[i].timeStamp * 1000
        }
        newArr[i].date = this.$$.timeChange({date: Number(newArr[i].timestamp), type:"yyyy-mm-dd hh:mm"})
        if (newArr[i].dataType !== "DATABASE") {
          newArr[i].coin = newArr[i].tokenSymbol ? newArr[i].tokenSymbol : this.selectData.coin
          this.createDatabaseInfo(newArr[i])
        }
        if (newArr[i].fsnhash) {
          newArr[i].hash = newArr[i].fsnhash
        } else {
          newArr[i].hash = newArr[i].hash.indexOf("0xx") === 0 ? newArr[i].fsnhash : newArr[i].hash
        }
        if (this.selectData.coin === "BTC") {
          newArr[i].value2 = this.$$.fromWei(newArr[i].value, "btc")
        } else {
          newArr[i].value2 = v_web3.fromWei(newArr[i].value, "ether")
        }
        this.historyData.push(newArr[i])
      }
      let compare = function compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (Date.parse(value1) > Date.parse(value2)) {
            return -1
          } else if (value1 < value2) {
            return 1
          } else {
            return 0
          }
        }
      }
      this.historyData.sort(compare("date"))
    },
    getBTChistory (data) {
      $ajax.get("https://api.blockcypher.com/v1/btc/test3/addrs/" + this.coinAddress).then(res => {
        res = res.data
        let result = []
        if (res && res.txrefs && res.txrefs.length > 0) {
          for (let i = 0; i < res.txrefs.length; i++) {
            result.push({
              to: res.address,
              value: res.txrefs[i].value,
              hash: res.txrefs[i].tx_hash,
              time: res.txrefs[i].confirmed
            })
          }
        }
        this.delRepeat(data, result)
      })
    },
    getTRONhistory (data) {
      data = data ? data : []
      let params = {"value" : "713c2cf6db2e35e8f25dcff932f1614228c24bef3583a4d01b3782a0c2f7fc27"}
      $ajax.post(
        "https://api.shasta.trongrid.io/walletsolidity/gettransactionbyid",
        Qs.stringify(params)
      ).then(res => {
        res = res.data
        let result = []
        if (res && res.txrefs && res.txrefs.length > 0) {
          for (let i = 0; i < res.txrefs.length; i++) {
            result.push({
              to: res.address,
              value: res.txrefs[i].value,
              hash: res.txrefs[i].tx_hash,
              time: res.txrefs[i].confirmed
            })
          }
        }
        this.delRepeat(data, result)
      })
    },
    createDatabaseInfo (data) {
      $ajax.post(this.$$.serverURL + "/lilo/create", Qs.stringify(data)
      ).then(res => {

      })
    },
    getDatabaseInfo () {
      if (!this.coinAddress) {
        return
      }
      $ajax.post(
        this.$$.serverURL + "/lilo/lockInHistory",
        Qs.stringify({to: this.coinAddress})
      ).then(res => {
        res = res.data
        for (let i = 0; i < res.info.length; i++) {
          if (res.info[i].hash === "" || res.info[i].hash === undefined) {
            res.info[i].hash = "0xx" + i
          }
          res.info[i].dataType = "DATABASE"
        }
        if (this.selectData.coin === "BTC") {
          this.getBTChistory(res.info)
        } else if (this.selectData.coin === "TRON") {
          this.getTRONhistory(res.info)
        } else {
          this.getHistory(res.info)
        }
      }).catch(err => {
        this.getHistory([])
      })
    },
    updateDatabaseInfo (data) {
      data.to = this.coinAddress
      $ajax.post(
        this.$$.serverURL + "/lilo/lockInChangeState",
        Qs.stringify(data)
      ).then(res => {
        this.getDatabaseInfo()
      })
    }
  }
}
</script>
