<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
        <h3 class="title">{{LANG.IMPORT_WALLET}}</h3>
      </div>

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
                v-once
              >
              <label class="flex-sc labelStyle" :for="'aria' + index">
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
              <p id="testid"></p>
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
            </div>
            <div class="selectType_contTip" v-if="isMetamaskShowTip">
              {{LANG.METAMASK_TIP}}
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

      <div class="createInfo_tip pb-20">
        <h3
          class="h3"
          v-html="LANG.IMPORT_WALLET_TIP"
        >
        </h3>
      </div>

      <el-dialog
        title="Please select the address you would like to interact with."
        :visible.sync="addrViewVisible"
        width="60%"
        :before-close="reservePath"
      >
        <el-radio-group v-model="HDPath" size="small" @change="HDPathChange(HDPath, selectTypeVal)">
          <el-radio 
            v-for="(item, index) in HDPathArr" 
            :key="index"
            :label="item.path" 
          >
            {{item.path}}
          </el-radio>
          <el-radio label="0">
            <el-input v-model="HDPath_self" size="mini" @change="HDPathInputChange(selectTypeVal)"></el-input>
          </el-radio>
        </el-radio-group>
        <div class="selectAddr_type flex-ai-c">
          <ul v-if="moreAddr.length > 0">
            <li v-for="(item, index) in moreAddr" :key="index">
              <input type="radio" name="moreAddr" :id="'add' + index" class="input">
              <label class="flex-sc labelStyle" :for="'add' + index" @click="setSelectAddr(item.addr, item.path)">
                <div class="radioBox flex-c"> <i class="radio"></i> </div>
                <p class="p">{{item.addr}}</p>
              </label>
            </li>
          </ul>
          <div v-else class="flex-c" style="width:100%;color:#999;font-size:18px;">loading……</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" size="small" @click="reservePath">{{LANG.BTN.CANCEL}}</el-button>
          <el-button type="primary" size="small" @click="goBackupWallet">{{LANG.BTN.UNLOCK_WALLET}}</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: "createWallet",
  data () {
    return {
      password: "",
      fileJSON: "",
      showPwd: false,
      showPwdBtn: false,
      fileData: "",
      privateKey: "",
      publicKey: "",
      checkAddress: "",
      downloadURL: "",
      downloadName: "",
      isShowTip: true,
      isMetamaskShowTip: true,
      ledger: "",
      moreAddr: [],
      addrViewVisible: false,
      selectTypeVal: 'keystore',
      selectTypeArr: this.$store.state.wallet.loginType,
      HDPath: this.$$.bipPath,
      HDPathVal: this.$$.bipPath,
      HDPath_self: this.$$.bipPath,
      HDPathArr: [
        {path: "m/44'/1'/0'/0", name: "Network: Testnets"},
        {path: "m/44'/60'/0'/0", name: "Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox"},
        {path: "m/44'/60'/0'", name: "Ledger (ETH)"},
      ],
      HandWare_pub: "",
      HandWare_chainCode: "",
      HandWare_type: "",
      mnemonicPhrase: "",
      mnemonicPwd: ""
    }
  },
  mounted () {
    this.$store.commit("storeWalletLoadFlag", true)
    if (!this.$route.query.isBackup) {
      // console.log(123)
      this.$store.commit('storeAddress', '')
    }
    // console.log(this.$store.state.address)
    if (location.protocol === 'https:' && navigator.userAgent.indexOf('Chrome') !== -1) {
      this.isShowTip = false
    }
    if (location.protocol === 'https:') {
      this.isMetamaskShowTip = false
    }
    // this.selectTypeArr = [
    //   {name: 'MetaMask / Mist', dataShow: 'MetaMask', checked: true},
    //   {name: 'Ledger Wallet', dataShow: 'LEDGER', checked: false},
    //   {name: this.LANG.IMPORT_TYPE.TREZOR, dataShow: 'TREZOR', checked: false},
    //   {name: this.LANG.IMPORT_TYPE.KEYSTORE, dataShow: 'keystore', checked: false},
    //   {name: this.LANG.IMPORT_TYPE.PRIVATE_KEY, dataShow: 'private', checked: false},
    //   // {name: 'Mnemonic Phrase', dataShow: 'Mnemonic', checked: false} //后期使用
    // ]
    // this.selectTypeArr = this.$store.state.wallet.loginType
    // this.$store.commit("storeLoginType", this.selectTypeArr)
    // console.log(this.LANG)
  },
  methods: {
    MnemonicBtn () {
      let hdks = hd.HDKey.fromMasterSeed(hd.bip39.mnemonicToSeed(this.mnemonicPhrase.trim(), this.mnemonicPwd))
      this.moreAddr = []
      let wallets = []
      // console.log(this.HDPathVal)
      for (let i = 0; i < 5; i++) {
        wallets.push(new wallet(hdks.derive(this.HDPathVal + "/" + i)._privateKey))
        // console.log(wallets[i].getPrivateKeyString())
        this.moreAddr.push({addr: wallets[i].getChecksumAddressString(), path: this.HDPathVal + "/" + i})
      }
      this.addrViewVisible = true
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
        let showID = this.selectTypeVal = e.target.dataset.type
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
        this.publicKey = ""
        this.checkAddress = ""
        this.downloadName = ""
        this.downloadURL = ""
        document.getElementById("fileName").innerHTML = this.LANG.BTN.SELECT_WALLET_FILE
      }
    },
    goBackupWallet () {
      if (this.$route.query.isBackup && this.$store.state.address.toLowerCase() !== this.checkAddress.toLowerCase()) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
        return
      }
      this.setStore()
      // this.sendInfoToParent()
      if (this.$route.query.isBackup) {
        this.$router.push("/backupWallet")
      } else if (this.$route.query.isExchange) {
        this.$router.push("/exchangeEnter")
      } else {
        this.$router.push("/MyAssets")
      }
    },
    inputFileBtn () {
      let walletData
      // console.log(wallet)
      try{
        walletData = wallet.getWalletFromPrivKeyFile(
          this.fileData,
          this.password
        )
        this.inputAfter(walletData, 'file')
      } catch (e) {
        this.$$.errTip(e)
      }
    },
    inputPwdBtn () {
      let walletData
      try {
        walletData = new wallet(new Buffer(this.$$.fixPkey(this.privateKey), "hex"))
        this.inputAfter(walletData, 'private')
      } catch (e) {
        this.$$.errTip(e)
      }
    },
    reservePath () {
      this.HDPath = this.HDPathVal = this.$$.bipPath
      this.addrViewVisible = false
    },
    HDPathChange (value, type) {
      this.moreAddr = []
      if (Number(value) === 0) {
        this.HDPathVal = this.HDPath_self
      } else {
        this.HDPathVal = value
      }
      if (type === "LEDGER") {
        this.inputLEDGERBtn()
      } else {
        this.inputTREZORBtn()
      }
      // this.walletCreate(this.HandWare_pub, this.HandWare_chainCode, this.HandWare_type, this.HDPathVal)
    },
    HDPathInputChange (type) {
      if (this.HDPath !== 0) {
        return
      }
      this.HDPathVal = this.HDPath_self
      if (type === "LEDGER") {
        this.inputLEDGERBtn()
      } else {
        this.inputTREZORBtn()
      }
    },
    inputTREZORBtn () {
      let trezorConnect = require("trezor-connect").default
      let params = this.HDPathVal
      this.$store.commit("storeTrezor", trezorConnect)
      trezorConnect.getPublicKey({ path: params }).then(res => {
        console.log(res)
        if (!res.success) {
          this.addrViewVisible = true
          this.moreAddr = []
        } else {
          this.HandWare_pub = res.payload.publicKey
          this.HandWare_chainCode = res.payload.chainCode
          this.HandWare_type = 'trezor'
          this.walletCreate(this.HandWare_pub, this.HandWare_chainCode, this.HandWare_type, params)
        }
      })
    },
    inputLEDGERBtn () {
      // let params = "m/44'/288'/0'/0"
      let params = this.HDPathVal
      console.log(params)
      let Ledger3 = require("@etc/js/ledger3")
      let LedgerEth = require("@etc/js/ledger-eth")
      this.ledger = new Ledger3("w0w")
      var app = new LedgerEth(this.ledger)
      // console.log(v_web3.version)
      this.$store.commit("storeLedger", app)
      app.getAddress(params, (res, err) => {
        if (err) {
          console.log(err)
          this.$$.errTip(err)
        } else {
          this.HandWare_pub = res["publicKey"]
          this.HandWare_chainCode = res["chainCode"]
          this.HandWare_type = 'ledger'
          this.walletCreate(this.HandWare_pub, this.HandWare_chainCode, this.HandWare_type, params)
          // this.walletCreate(res["publicKey"], res["chainCode"], "ledger", params)
        }
      }, false, true)
    },
    walletCreate (publicKey, chainCode, walletType, path) {
      let wallets = []
      
      hdk.publicKey = new Buffer(publicKey, "hex")
      hdk.chainCode = new Buffer(chainCode, "hex")
      this.moreAddr = []
      for (let i = 0; i < 5; i++) {
        var derivedKey = hdk.derive("m/" + i)
        if (walletType === 'ledger') {
          wallets.push(new wallet(undefined, derivedKey.publicKey, path + "/" + i, walletType, this.ledger))
        } else {
          wallets.push(new wallet(undefined, derivedKey.publicKey, path + "/" + i, walletType))
        }
        this.moreAddr.push({addr: wallets[i].getChecksumAddressString(), path: path + "/" + i})
      }
      if (this.moreAddr.length <= 0) return
      this.addrViewVisible = true
    },
    inputMETAMASKBtn () {
      if (location.protocol !== 'https:') {
        this.$$.errTip('Non-Ethereum browser detected. You should consider trying MetaMask!')
        return
      }
      // return 
      // web3 = new Web3(new Web3.providers.HttpProvider(this.$$.baseUrl))
      // console.log(web3.eth.coinbase)
      try {
        if (!web3) {//用来判断你是否安装了metamask
          window.alert('Please install MetaMask first.')//如果没有会去提示你先去安装
          return
        }
      } catch (error) {
        window.alert('Please install MetaMask first.')//如果没有会去提示你先去安装
        return
      }
      if (!web3.eth.coinbase) {//这个是判断你有没有登录，coinbase是你此时选择的账号
        window.alert('Please activate MetaMask first.')
        return
      }
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        console.log(web3.eth.coinbase)
        // if (this.$store.state.address && this.$store.state.address.toLowerCase() !== web3.eth.coinbase.toLowerCase()) {
        //   this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
        //   return
        // }
        this.checkAddress = web3.eth.coinbase
        this.goBackupWallet()
      }
    },
    inputAfter (walletData, type) {
      // console.log(walletData)
      this.checkAddress = walletData.getChecksumAddressString()
      if (this.$route.query.isBackup && this.$store.state.address) {
        if (this.checkAddress.toLowerCase() !== this.$store.state.address.toLowerCase()) {
          this.$$.errTip(this.LANG.ERROR_TIP.TIP_7)
          return
        }
        this.privateKey = walletData.getPrivateKeyString()
        this.$store.commit("storePrivateKey", this.privateKey)
      } else {
        this.privateKey = ""
      }

      if (type === 'private') {
        this.downloadURL = ""
        this.downloadName = ""
      } else {
        this.downloadURL = this.$$.getBlob('text/json;charset=UTF-8', this.fileData)
        this.downloadName = walletData.getV3Filename()
      }
      this.goBackupWallet()
    },
    setSelectAddr (addr, path) {
      this.checkAddress = addr
      this.$store.commit("storeHDpath", path)
      // this.$store.commit("storeHDpathInit", this.HDPathVal)
    },
    // setAddress () {
    //   this.goBackupWallet()
    // },
    setStore () {
      // console.log(this.checkAddress)
      // console.log(this.downloadURL)
      // console.log(this.downloadName)
      this.$store.commit("storeAddress", this.checkAddress)
      this.$store.commit("storeKeystoreURL", this.downloadURL)
      this.$store.commit("storeDownload", this.downloadName)
    },
    changePrv (e) {
      this.showPwdBtn = true
      if (e.which === 13) {
        this.inputPwdBtn()
      }
    },
    changePwd (e) {
      this.showPwdBtn = true
      if (e.which === 13) {
        this.inputFileBtn()
      }
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
