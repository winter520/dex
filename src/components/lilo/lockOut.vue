<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……">

        <el-form label-position="top" label-width="80px">
          <el-form-item :label="addressTitle + '：'">
            <el-input v-model="toAddress" @change="toaddresGas"></el-input>
          </el-form-item>
          <el-form-item :label="LANG.LABEL.AMOUNT + '：'">
            <el-input v-model="sendAmound" @keypress="keyPressBtn"></el-input>
            <span :class="Number(balanceNum) === 0 ? 'color_red' : 'color_99'">{{Number(balanceNum) === 0 ? "Not a valid amount" : "Account Balance: " + balanceNum}}</span>
          </el-form-item>
          <el-form-item label="Advanced(Nonce & Gas Price & Gas Limit & Data)">
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
          </div>
        </el-form>

        <!-- <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" v-model="toAddress" />
        </div>

        <h3 class="mt-20">{{LANG.LABEL.AMOUNT}}:</h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text amount keyPressBtn" v-model="sendAmound" id="amountShow" @keypress="keyPressBtn" />
          <label v-html="selectData.value" class="currency"></label>
        </div> -->

        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10" @click="privateSure">{{LANG.BTN.SEND}}</button>
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
                <span v-html="scope.row.statusFsn" :class="scope.row.statusFsn !== LANG.LABEL.SUCCESS ? 'red' : ''"></span>
              </template>
            </el-table-column>
            <el-table-column :label="LANG.THEAD.COIN" prop="coin" width="80"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.AMOUNT" prop="value" width="120"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.DATE" prop="date" width="180"></el-table-column>
            <el-table-column :label="LANG.THEAD.PUBLIC.INFORMATION" min-width="360">
              <template slot-scope="scope">
                <!-- <div class="moreInfo_box" @click="MoreContent">
                  <span v-html="scope.row.fsnhash" :title="scope.row.fsnhash" class="ellipsis moreInfo_hax"></span>
                  <ul class="list">
                    <li>{{LANG.LABEL.TXid}}：{{scope.row.fsnhash}}</li>
                    <li>{{LANG.LABEL.ADDRESS}}：{{scope.row.from}}</li>
                  </ul>
                  <i class="arrow"></i>
                </div> -->
                <el-collapse class="moreInfo_box" accordion v-model="activeNames">
                  <el-collapse-item :title="scope.row.fsnhash">
                    <ul class="list">
                      <li>{{LANG.LABEL.TXID}}：{{scope.row.fsnhash}}</li>
                      <li>{{LANG.LABEL.ADDRESS}}：{{scope.row.from}}</li>
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
      :title="LANG.TITLE.LOCKOUT"
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
            <span>{{dataPage.data}}</span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <button type="button" class="btn btn-default" @click="modalClick">{{LANG.BTN.GET_OUT}}</button>
        <button type="button" class="btn btn-primary" @click="sendAmoundInfo">{{LANG.BTN.YES_SURE}}</button>
      </span>
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
      toAddress: "",
      historyData: [],
      sendAmound: "",
      nonceNum: "",
      gasPriceNum: "",
      gasLimitNum: "",
      balanceNum: "",
      maxFee: "",
      netWorkInfo: "",
      dataPage: {},
      sendInfoVisible: false,
      privateSureVisible: false,
      activeNames: "",
      selfSet: false,
      sendData: "",
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
    if (this.selectData) {
      setTimeout(() => {
        this.getInitData()
      }, 100)
    }
    this.walletAddress = this.$store.state.address
    // this.sendAmound = this.$$.thousandBit("0")
  },
  methods: {
    keyPressBtn (e) {
      if (e.which === 13) {
        this.privateSure()
      }
    },
    toaddresGas() {
      try {
        this.gasLimitNum = v_web3.eth.estimateGas({to: this.toAddress})
      } catch (error) {
        this.$$.errTip(error)
        return
      }
    },
    getInitData () {
      this.titleChange(this.selectData.coin)
      this.coinAddress = this.selectData.address
      this.getDatabaseInfo()
      var batch = v_web3.createBatch()
      batch.add(v_web3.eth.getTransactionCount.request(this.$store.state.address, "pending"))
      batch.add(v_web3.lilo.dcrmGetBalance.request(this.$store.state.address, this.selectData.coin))
      // batch.add(v_web3.eth.gasPrice)
      batch.requests.push({method: "eth_gasPrice",params: []})
      batch.requestManager.sendBatch(batch.requests, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          // this.nonceNum = parseInt(results[0].result, 16)
          // this.balanceNum = v_web3.fromWei(results[1].result, "ether")
          // this.gasPriceNum = parseInt(results[2].result, 16)
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

      // try {
      //   this.gasPriceNum = v_web3.eth.gasPrice.toString(10)
      // } catch (error) {
      //   this.$$.errTip(error)
      //   return
      // }
      this.fullscreenLoading = false
    },
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO/lockOut")
      this.privateSureVisible = false
      this.sendInfoVisible = false
    },
    titleChange (bitType) {
      this.addressTitle = bitType + " Withdraw Address"
    },
    setBaseSendData () {
      this.maxFee = v_web3.fromWei(Number(this.gasLimitNum) * Number(this.gasPriceNum), "ether")
      try {
        this.netWorkInfo = v_web3.version.node
      } catch (error) {
        this.$$.errTip(error)
        return
      }
    },
    getSignData (data) {
      if (data) {
        this.serializedTx = data
        this.sendInfoVisible = true
      } else {
        this.sendInfoVisible = false
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_6)
      }
      this.privateSureVisible = false
    },
    privateSure () {
      if (!this.toAddress) {
        this.$$.errTip(this.selectData.coin + this.LANG.ERROR_TIP.TIP_11)
        return
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_4)
        return
      }
      if (this.selectData.coin !== "BTC" && this.toAddress.indexOf("0x") !== 0) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_5)
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
        to: "0x00000000000000000000000000000000000000dc",
        value: Number(0),//Number类型
        data: this.sendData ? this.sendData : "LOCKOUT:" + this.toAddress + ":" + to_value + ":" + this.selectData.coin,
        sendType: "LOCKOUT",
        coin: this.selectData.coin,
        to_value: to_value,
        to_address: this.toAddress,
        to_from: this.coinAddress
      }
      // this.$router.push("/pwdLockOut")
      this.privateSureVisible = true
    },
    pageRefresh () {
      if (this.selectData) {
        this.titleChange(this.selectData.coin)
      }
      if (location.href.indexOf("lockOut") !== -1) {
        document.getElementById("tabBtnFirst").classList.remove("router-link-active")
      }
    },
    sendAmoundInfo () {
      let dataBase = {
        date: this.dataPage.data,
        from: this.dataPage.to_from,
        gas: "",
        gasPrice: this.dataPage.gasPrice,
        fsnhash: "",
        nonce: this.dataPage.nonce,
        timeStamp: new Date(),
        to: this.dataPage.to_address,
        value: this.dataPage.to_value,
        statusFsn: "",
        coin: this.dataPage.coin,
        data: this.dataPage.data,
        tokenSymbol: this.dataPage.coin
      }
      v_web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
        if (!err) {
          dataBase.fsnhash = hash
          dataBase.statusFsn = this.LANG.LABEL.SUCCESS
          this.sendInfoVisible = false
          this.$$.successTip(this.LANG.SUCCESS_TIP.TIP_1 + hash)
          this.$store.commit("storeWalletLoadFlag", true)
        } else {
          console.log(err)
          dataBase.fsnhash = ""
          dataBase.statusFsn = this.LANG.LABEL.FAILURE
          this.$$.errTip(err)
        }
        this.createDatabaseInfo(dataBase)
        this.modalClick()
      })
    },
    createDatabaseInfo (data) {
      $ajax.post(
        this.$$.serverURL + "/lilo/create",
        Qs.stringify(data)
      ).then(res => {
        this.getDatabaseInfo()
      })
    },
    getDatabaseInfo () {
      $ajax.post(
        this.$$.serverURL + "/lilo/lockOutHistory",
        Qs.stringify({
          from: this.coinAddress,
          coin: this.selectData.coin
        })
      ).then(res => {
        res = res.data
        this.historyData = []
        if (res.msg === "success") {
          for (let i = 0; i < res.info.length; i++) {
            res.info[i].date = this.$$.timeChange({date: res.info[i].date, type:"yyyy-mm-dd hh:mm"})
            res.info[i].value = this.v_web3.fromWei(res.info[i].value, "ether")
            res.info[i].statusFsn = this.getStatus(res.info[i])
            this.historyData.push(res.info[i])
          }
        }
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
            statusFsn = this.LANG.LABEL.PENDING
          }
        } catch (error) {
          statusFsn = this.LANG.LABEL.FAILURE
        }
      } else {
        if (txhax.hash) {
          statusFsn = this.LANG.LABEL.FAILURE
        } else {
          statusFsn = this.LANG.LABEL.FAILURE
        }
      }
      return statusFsn
    },
  }
}
</script>
