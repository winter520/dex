<template>
  <div>
    <div class="pwdSure_box">

      <!-- <div class="newWallet_title flex-c">
        <h3 class="title">Import wallet</h3>
      </div> -->

      <div class="flex-bc selectType_box">
        <!-- <div class="navViewBtn_box" @click="navViewSet">
          <i class="el-icon-more"></i>
        </div> -->
        <div class="selectType_type flex-ai-c selectType" id="navViewVisible">
          <ul @click="handleClick">
            <li v-for="(item, index) in selectTypeArr" :key="index">
              <input
                type="radio"
                name="selectType"
                :id="'aria' + index"
                class="input"
                :data-type="item.dataShow"
                :checked="item.checked"
              >
              <label class="flex-sc labelStyle" :for="'aria' + index" :data-show="item.dataShow">
                <div class="radioBox flex-c">
                  <i class="radio"></i>
                </div>
                <p class="p">{{item.name}}</p>
              </label>
            </li>
          </ul>
        </div>

        <div class="selectType_content">
          <div class="selectType_keystore" id="keystore" data-view="keystore">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.TITLE.SELECT_WALLET_FILE}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_KSbtn">
                <p class="p" id="fileName">{{LANG.BTN.SELECT_WALLET_FILE}}</p>
                <input
                  type="file"
                  class="file"
                  id="fileUpload"
                  @change="fileUpChange"
                >
              </div>
              <div class="selectType_contTnput" v-if="showPwd">
                <input
                  type="password"
                  :placeholder="LANG.PLACEHOLDER.ENTER_PASSWORD"
                  class="input-text input"
                  v-model="password"
                  @keyup="changePwd"
                >
              </div>

              <div class="createInfo_btn flex-c" v-if="showPwdBtn">
                <button class="btn" @click="inputFileBtn" id="UnlockBtn">{{LANG.BTN.UNLOCK}}</button>
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="private" data-view="private">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.TITLE.PASTE_PRIVATE_KEY}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_contTnput">
                <input
                  type="password"
                  :placeholder="LANG.PLACEHOLDER.ENTER_PRIVATE_KEY"
                  class="input-text input pwdChange"
                  v-model="privateKey"
                  @keyup="changePrv"
                >
              </div>

              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputPwdBtn" v-if="showPwdBtn">{{LANG.BTN.UNLOCK}}</button>
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="TREZOR" data-view="TREZOR">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.TITLE.TREZOR_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputTREZORBtn" v-if="!$store.state.safeMode">{{LANG.BTN.CONNECT_TO_TREZOR}}</button>
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="LEDGER" data-view="LEDGER">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.TITLE.LEDGER_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputLEDGERBtn" v-if="!$store.state.safeMode">{{LANG.BTN.CONNECT_TO_LEDGER}}</button>
              </div>
            </div>
            <div class="selectType_contTip" v-if="isShowTip">
              {{LANG.LEDGER_TIP}}
            </div>
          </div>

          <div class="selectType_keystore" id="MetaMask" data-view="MetaMask" style="display:block">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.TITLE.METAMASK_WALLET}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputMETAMASKBtn" v-if="!$store.state.safeMode">{{LANG.BTN.CONNECT_TO_METAMASK}}</button>
              </div>
              <div class="selectType_contTip" v-if="isMetamaskShowTip">
                {{LANG.METAMASK_TIP}}
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="Mnemonic" data-view="Mnemonic">
            <hgroup class="selectType_contTitle">
              <h3 class="title">{{LANG.IMPORT_TYPE.Mnemonic}}</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <el-form label-position="top" label-width="80px">
                <el-form-item>
                  <el-input type="textarea" :rows="4" placeholder="Mnemonic Phrase" v-model="mnemonicPhrase"></el-input>
                </el-form-item>
                <el-form-item label="Password">
                  <el-input v-model="mnemonicPwd" placeholder="Password"></el-input>
                </el-form-item>
              </el-form>
              <div class="createInfo_btn flex-c">
                <button class="btn" @click="MnemonicBtn">{{LANG.BTN.UNLOCK}}</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- <div class="createInfo_tip pb-20">
        <h3 class="h3">Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, reset passwords,<br/>nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.</h3>
      </div> -->

    </div>
  </div>
</template>

<style>

</style>

<script>
let ethFuncs = require('@/assets/js/ethFuncs')
export default {
  name: "createWallet",
  props: ["sendDataPage"],
  data () {
    return {
      password: "",
      fileJSON: "",
      showPwd: false,
      showPwdBtn: false,
      fileData: "",
      privateKey: "",
      checkAddress: "",
      dcrmAddress: "",
      isShowTip: true,
      isMetamaskShowTip: true,
      ledger: "",
      selectTypeArr: this.$store.state.wallet.loginType,
      mnemonicPhrase: "",
      mnemonicPwd: ""
    }
  },
  mounted () {
    if (location.protocol === 'https:' && navigator.userAgent.indexOf('Chrome') !== -1) {
      this.isShowTip = false
    }
    if (location.protocol === 'https:') {
      this.isMetamaskShowTip = false
    }
  },
  methods: {
    MnemonicBtn () {
      let hdks = hd.HDKey.fromMasterSeed(hd.bip39.mnemonicToSeed(this.mnemonicPhrase.trim(), this.mnemonicPwd))
      // console.log(this.$store.state.wallet.HDpathInit)
      let wallets = new wallet(hdks.derive(this.$store.state.wallet.HDpath)._privateKey)
      this.inputAfter(wallets)
    },
    fileUpChange (event) {
      let reader = new FileReader()
      let fileNameID = document.getElementById("fileName")
      this.password = ""
      let fileName = event.target.files[0].name
      reader.onload = onLoadEvent => {
        this.fileData = onLoadEvent.currentTarget.result
        this.showPwd = this.$$.walletRequirePass(this.fileData)
        if (this.showPwd) {
          fileNameID.innerHTML = fileName
        } else {
          fileNameID.innerHTML = this.LANG.BTN.SELECT_WALLET_FILE
        }
      }
      reader.readAsText(event.target.files[0])
    },
    handleClick (e) {
      if (e.target.nodeName.toLowerCase() === 'input') {
        let showID = e.target.dataset.type
        for (let i = 0; i < document.querySelectorAll("[data-view]").length; i++) {
          if (document.querySelectorAll("[data-view]")[i].dataset.view === showID) {
            document.querySelectorAll("[data-view]")[i].style.display = "block"
          } else {
            document.querySelectorAll("[data-view]")[i].style.display = "none"
          }
        }
        this.showPwd = false
        this.showPwdBtn = false
        this.password = ""
        document.getElementById("fileUpload").value = ""
        this.privateKey = ""
        this.checkAddress = ""
        document.getElementById("fileName").innerHTML = this.LANG.BTN.SELECT_WALLET_FILE
      }
    },
    inputFileBtn () {
      let walletData
      try{
        walletData = wallet.getWalletFromPrivKeyFile(this.fileData, this.password)
        this.inputAfter(walletData)
      } catch (e) {
        this.$$.errTip(e)
      }
    },
    inputPwdBtn () {
      let walletData
      try {
        walletData = new wallet(
          new Buffer(this.$$.fixPkey(this.privateKey), "hex")
        )
        this.inputAfter(walletData)
      } catch (e) {
        console.log(e)
        this.$$.errTip(e)
      }
    },
    inputAfter (walletData) {
      this.privateKey = walletData.getPrivateKeyString()
      this.checkAddress = walletData.getChecksumAddressString()
      // console.log(this.privateKey)
      // console.log(this.checkAddress)
      if (this.checkAddress.toLowerCase() !== this.sendDataPage.from.toLowerCase()) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
        return
      }
      this.sendType('INPUT')
    },
    inputTREZORBtn () {
      if (!this.$store.state.wallet.trezor) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_3)
        return
      }
      this.checkAddress = this.$store.state.address
      this.sendType('TREZOR')
    },
    trezorStx (rawTx, stxData) {
      let params = this.$store.state.wallet.HDpath
      console.log(rawTx)
      rawTx.value = ethFuncs.sanitizeHex(rawTx.value.toString(16))
      rawTx.data = rawTx.data ? this.$$.strToHexCharCode(rawTx.data) : ''
      rawTx.gasLimit = ethFuncs.sanitizeHex(rawTx.gasLimit.toString(16))
      rawTx.gasPrice = ethFuncs.sanitizeHex(rawTx.gasPrice.toString(16))
      rawTx.nonce = ethFuncs.sanitizeHex(rawTx.nonce.toString(16))
      console.log(rawTx)
      let TrezorConnect = this.$store.state.wallet.trezor
      TrezorConnect.ethereumSignTransaction({
        path: params,
        transaction:  rawTx
      }).then((res) => {
        console.log(res)
        console.log(rawTx)
        if (!res.success) {
          return
        }
        let resPayload = res.payload,
          v = resPayload.v,
          r = resPayload.r,
          s = resPayload.s;

        // check the returned signature_v and recalc signature_v if it needed
        // see also https://github.com/trezor/trezor-mcu/pull/399
        if (v <= 1) {
          console.log(v)
          // for larger chainId, only signature_v returned. simply recalc signature_v
          v += 2 * rawTx.chainId + 35
        }
        // v = parseInt(v, 16)
        // v = v.toString(16)
        console.log(v)
        rawTx.v = ethFuncs.sanitizeHex(v)
        rawTx.r = ethFuncs.sanitizeHex(r)
        rawTx.s = ethFuncs.sanitizeHex(s)
        // console.log(rawTx)
        var eTx = new ethUtil.Tx(rawTx)
        console.log(eTx)
        rawTx.rawTx = JSON.stringify(rawTx)
        rawTx.signedTx = ethFuncs.sanitizeHex(eTx.serialize().toString("hex"))
        rawTx.isError = false
        if (stxData) {
          stxData.serializedTx = rawTx.signedTx
        } else {
          stxData = rawTx.signedTx
        }
        console.log(rawTx)
        this.sendSignData(stxData)
      })
    },
    inputLEDGERBtn () {
      // console.log(this.$store.state.wallet.ledger)
      if (!this.$store.state.wallet.ledger) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_3)
        return
      }
      this.checkAddress = this.$store.state.address
      this.sendType('LEDGER')
    },
    ledgerStx (txData, stxData) {
      var app = this.$store.state.wallet.ledger
      txData.path = this.$store.state.wallet.HDpath
      txData.data = txData.data ? this.$$.strToHexCharCode(txData.data) : ''
      var rawTx = {
        nonce: Number(txData.nonce),
        // gasPrice: txData.isOffline ? ethFuncs.sanitizeHex(txData.gasPrice) : ethFuncs.sanitizeHex(ethFuncs.addTinyMoreToGas(txData.gasPrice)),
        gasPrice: Number(txData.gasPrice),
        // gasLimit: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(txData.gasLimit)),
        gasLimit: Number(txData.gasLimit),
        to: ethFuncs.sanitizeHex(txData.to),
        // from: ethFuncs.sanitizeHex(txData.from),
        // value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(txData.value, txData.unit))),
        value: Number(txData.value),
        data: ethFuncs.sanitizeHex(txData.data)
      }
      rawTx.chainId = txData.chainId
      var eTx = new ethUtil.Tx(txData)
      var EIP155Supported = false
      var localCallback = (result, error) => {
        console.log(result)
        console.log(error)
        if (typeof error != "undefined") {
          this.$$.errTip(error)
          return
        }
        var splitVersion = result['version'].split('.');
        if (parseInt(splitVersion[0]) > 1) {
            EIP155Supported = true;
        } else if (parseInt(splitVersion[1]) > 0) {
            EIP155Supported = true;
        } else if (parseInt(splitVersion[2]) > 2) {
            EIP155Supported = true;
        }
        this.signTxLedger(app, eTx, rawTx, txData, !EIP155Supported, stxData);
      }
      app.getAppConfiguration(localCallback)
    },
    signTxLedger (app, eTx, rawTx, txData, old, stxData) {
      eTx.raw[6] = rawTx.chainId
      eTx.raw[7] = eTx.raw[8] = 0
      var toHash = old ? eTx.raw.slice(0, 6) : eTx.raw
      // var toHash = eTx.raw
      var txToSign = ethUtil.rlp.encode(toHash)
      var localCallback = (result, error) => {
        console.log(result)
        console.log(error)
        if (typeof error != "undefined") {
          error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error
          this.$$.errTip(error)
          return
        }
        var v = result['v'].toString(16);
        if (!old) {
          // EIP155 support. check/recalc signature v value.
          var rv = parseInt(v, 16)
          var cv = rawTx.chainId * 2 + 35
          if (rv !== cv && (rv & cv) !== rv) {
              cv += 1 // add signature v bit.
              // console.log(cv)
          }
          v = cv.toString(16);
        }
        rawTx.v = "0x" + v;
        rawTx.r = "0x" + result['r'];
        rawTx.s = "0x" + result['s'];
        eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        console.log(rawTx)
        if (stxData) {
          stxData.serializedTx = rawTx.signedTx
        } else {
          stxData = rawTx.signedTx
        }
        this.sendSignData(stxData)
      }
      app.signTransaction(txData.path, txToSign.toString('hex'), localCallback);
    },
    inputMETAMASKBtn () {
      if (!web3) {//用来判断你是否安装了metamask
        window.alert('Please install MetaMask first.')//如果没有会去提示你先去安装
        return
      }
      if (!web3.eth.coinbase) {//这个是判断你有没有登录，coinbase是你此时选择的账号
        window.alert('Please activate MetaMask first.')
        return
      }
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // console.log(web3.eth.coinbase)
        this.checkAddress = web3.eth.coinbase
        if (this.checkAddress.toLowerCase() !== this.sendDataPage.from.toLowerCase()) {
          this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
          return
        }
        this.sendType('METAMASK')
      }
    },
    metamaskStx (rawTx, stxData) {
      console.log(rawTx)
      // rawTx.data = rawTx.data ? rawTx.data : "0x"
      rawTx.nonce = "0x" + rawTx.nonce.toString(16)
      rawTx.gasPrice = "0x" + rawTx.gasPrice.toString(16)
      rawTx.gas = rawTx.gasLimit = "0x" + rawTx.gasLimit.toString(16)
      rawTx.value = "0x" + rawTx.value.toString(16)
      console.log(rawTx)
      // rawTx = {"from":"0x177b05bde6ba930244b7efcac141bd7c77fff73e","gas":"0x7918","nonce":"0x00","gasPrice":"0x098bca5a00","gasLimit":"0x7918","to":"0xB774A3920021Ecf202651DC926e07B27Db42B20f","value":"0x038d7ea4c68000","data":"0x","chainId":1}
      web3.eth.sendTransaction(rawTx, (err, res) => {
        if (err) {
          console.log(err)
          this.$$.errTip(err)
          this.sendSignData({txhax: "",status: this.LANG.LABEL.FAILURE, type: "METAMASK"})
        } else {
          console.log(res)
          this.$$.successTip(this.LANG.ERROR_TIP.TIP_10.FIRST + res + this.LANG.ERROR_TIP.TIP_10.LAST)
          this.sendSignData({txhax: res,status: this.LANG.LABEL.SUCCESS, type: "METAMASK"})
        }
        this.elDialogView()
      })
    },
    sendType (type) {
      console.log(this.sendDataPage.sendType)
      if (type === "INPUT") {
        if (this.sendDataPage.sendType === "LOCKOUT" || this.sendDataPage.sendType === "LOCKIN" || this.sendDataPage.sendType === "SENDDCRM") {
          this.getDcrmAddress()
        } else if (this.sendDataPage.sendType === "MYWALLET") {
          this.getDecrAddress(this.privateKey)
        }else {
          this.signSendData()
        }
      } else {
        if (this.sendDataPage.sendType === "LOCKOUT" || this.sendDataPage.sendType === "LOCKIN" || this.sendDataPage.sendType === "SENDDCRM") {
          this.getDcrmAddress(type)
        } else if (this.sendDataPage.sendType === "MYWALLET") {
          this.getDecrAddress('', type)
        }else {
          this.signSendData(type)
        }
      }
    },
    getDcrmAddress (type) {
      this.dcrmAddress = v_web3.lilo.dcrmGetAddr(this.$store.state.address, this.sendDataPage.coin)
      // console.log(this.dcrmAddress)
      // console.log(JSON.parse(this.dcrmAddress))
      this.signSendData(type)
    },
    getDecrAddress (pwd, type) {
      let gasPriceNum = v_web3.eth.gasPrice.toString(10)
      let getGasLimit = v_web3.eth.estimateGas({to: this.toAddress})
      let get_dcrmReqAddr
      try {
        get_dcrmReqAddr = v_web3.lilo.dcrmReqAddr(this.sendDataPage.from, this.sendDataPage.coin)
        get_dcrmReqAddr = JSON.parse(get_dcrmReqAddr).DcrmAddr
      } catch (error) {
        console.log(error)
        get_dcrmReqAddr = get_dcrmReqAddr
      }
      // console.log(get_dcrmReqAddr)
      let rawTx = {
        nonce: Number(this.sendDataPage.nonce),
        gasPrice: Number(gasPriceNum),
        gasLimit: Number(getGasLimit),
        // gasLimit: 21000,
        from: this.sendDataPage.from,
        to: "0x00000000000000000000000000000000000000dc",
        value: 0,
        data: ""
      }
      let sendBack = {
        coin: this.sendDataPage.coin,
        serializedTx: "",
        nowFlag: false,
        dcrmAddress: ""
      }

      let dcrmAddressVal
      console.log(get_dcrmReqAddr.toLowerCase())
      if (get_dcrmReqAddr.toLowerCase().indexOf(':') !== -1) {
        if (get_dcrmReqAddr && get_dcrmReqAddr.indexOf("the account has request dcrm address already.the dcrm address is") === 0) {
          dcrmAddressVal = get_dcrmReqAddr.split(":")[1]
          sendBack.nowFlag = false
          console.log(1, dcrmAddressVal)
        } else if (get_dcrmReqAddr.error && get_dcrmReqAddr.error.message.indexOf("the account has request dcrm address already.the dcrm address is") === 0) {
          dcrmAddressVal = get_dcrmReqAddr.error.message.split(":")[1]
          sendBack.nowFlag = false
          console.log(2, dcrmAddressVal)
        } else if (get_dcrmReqAddr && get_dcrmReqAddr.indexOf("the account has confirm dcrm address already.the dcrm address is") === 0) {
          this.$$.successTip(this.LANG.ERROR_TIP.TIP_8 + get_dcrmReqAddr.split(":")[1])
          console.log(3, dcrmAddressVal)
          this.elDialogView()
          return
        } else {
          // console.log(4, dcrmAddressVal)
          this.$$.errTip(get_dcrmReqAddr)
          return
        }
      } else {
        dcrmAddressVal = get_dcrmReqAddr
        sendBack.nowFlag = true
      }
      sendBack.dcrmAddress = dcrmAddressVal
      rawTx.data = "DCRMCONFIRMADDR:" + dcrmAddressVal + ":" + this.sendDataPage.coin
      rawTx.chainId = Number(this.$store.state.wallet.network.chainId)
      if (type === 'METAMASK') {
        this.metamaskStx(rawTx, sendBack)
      } else if (type === "TREZOR") {
        this.trezorStx(rawTx, sendBack)
      } else if (type === "LEDGER") {
        this.ledgerStx(rawTx, sendBack)
      } else {
        pwd = pwd.indexOf("0x") === 0 ? pwd.substr(2) : pwd
        let privateKey = new Buffer(pwd, "hex")
        this.signSendDataPub(privateKey, rawTx, sendBack)
      }

    },
    signSendDataPub (pwd, rawTx, sendBack) {
      let Tx = require("ethereumjs-tx")
      let tx = new Tx(rawTx)
      tx.sign(pwd)
      let serializedTx = tx.serialize()
      let serializedTxString = serializedTx.toString("hex")
      serializedTxString = serializedTxString.indexOf("0x") === 0 ? serializedTxString : ("0x" + serializedTxString)
      console.log(serializedTxString)
      if (sendBack) {
        sendBack.serializedTx = serializedTxString
      } else {
        sendBack = serializedTxString
      }
      this.sendSignData(sendBack)
    },
    signSendData (type) {
      if (this.checkAddress.toLowerCase() === this.sendDataPage.from.toLowerCase()) {
        let rawTx = {
          // nonce: Number(this.sendDataPage.nonce) === 0 ? 1 : Number(this.sendDataPage.nonce),
          nonce: Number(this.sendDataPage.nonce),
          gasPrice: Number(this.sendDataPage.gasPrice),//Number类型 
          gasLimit: Number(this.sendDataPage.gasLimit),
          from: this.sendDataPage.from,
          to: this.sendDataPage.to,
          value: Number(this.sendDataPage.value),//Number类型
          data: this.sendDataPage.data
        }
        console.log(rawTx)
        let serializedTxString
        rawTx.chainId = this.sendDataPage.chainId ? this.sendDataPage.chainId : Number(this.$store.state.wallet.network.chainId)
        if (type === 'METAMASK') {
          this.metamaskStx(rawTx)
        } else if (type === "TREZOR") {
          this.trezorStx(rawTx)
        } else if (type === "LEDGER") {
          this.ledgerStx(rawTx)
        } else {
          let privateKey = new Buffer(this.$$.fixPkey(this.privateKey), "hex")
          this.signSendDataPub(privateKey, rawTx)
        }
      } else {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
        return
      }
    },
    sendSignData (data) {
      this.$emit("sendSignData", data)
      this.password = ""
      document.getElementById("fileUpload").value = ""
      this.privateKey = ""
      this.checkAddress = ""
      this.showPwdBtn = false
    },
    elDialogView () {
      this.$emit("elDialogView")
    },
    changePrv (e) {
      this.showPwdBtn = true
      if (e.which === 13) {
        this.inputPwdBtn()
      }
    },
    changePwd (e) {
      if (e.which === 13) {
        this.inputFileBtn()
      }
      this.showPwdBtn = true
    },
    navViewSet () {
      let navVisible = document.getElementById('navViewVisible').style.display
      console.log(navVisible)
      if (navVisible === 'block') {
        document.getElementById('navViewVisible').style.display = 'none'
      } else {
        document.getElementById('navViewVisible').style.display = 'block'
      }
    }
  }
}
</script>
