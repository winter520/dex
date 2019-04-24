let langEn = require('@/assets/js/language/en')
// console.log(langEn)
let wallet = {
  state: {
    loginType: [
      {name: 'MetaMask / Mist', dataShow: 'MetaMask', checked: true},
      {name: 'Ledger Wallet', dataShow: 'LEDGER', checked: false},
      {name: langEn.IMPORT_TYPE.TREZOR, dataShow: 'TREZOR', checked: false},
      {name: langEn.IMPORT_TYPE.KEYSTORE, dataShow: 'keystore', checked: false},
      {name: langEn.IMPORT_TYPE.PRIVATE_KEY, dataShow: 'private', checked: false},
      // {name: 'Mnemonic Phrase', dataShow: 'Mnemonic', checked: false} //后期使用
    ],
    keystoreURL: '',
    downloadName: '',
    walletLoadFlag: true,
    ledger: '',
    trezor: '',
    HDpath: '',
    network: {},
    safeMode: false,
    privateKey: ''
  },
  mutations: {
    // storeLoginType (state, data) {
    //   state.loginType = data
    // },
    storeKeystoreURL (state, url) {
      state.keystoreURL = url
    },
    storeDownload (state, address) {
      state.downloadName = address
    },
    storeWalletLoadFlag (state, data) {
      state.walletLoadFlag = data
    },
    storeLedger (state, data) {
      state.ledger = data
    },
    storeTrezor (state, data) {
      state.trezor = data
    },
    storeHDpath (state, data) {
      state.HDpath = data
    },
    storeNetwork (state, data) {
      state.network = data
    },
    storeSafeMode (state, data) {
      state.safeMode = data
    },
    storePrivateKey (state, data) {
      state.privateKey = data
    }
  }
}

export default wallet
