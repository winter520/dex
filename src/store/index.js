import Vue from 'vue'
import Vuex from 'vuex'
let langEn = require('@/assets/js/language/en')
// import wallet from './store-wallet.js'
import exchange from './store-exchange.js'
// const exchange = require('./store-exhange').default
// const wallet = require('./store-wallet').default
// console.log(wallet)
// console.log(exchange)
// console.log(wallet)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    address: '',
    coinlist: require('@etc/js/config/coinIfno').coininfo,
    loginType: [
      {name: 'MetaMask / Mist', dataShow: 'MetaMask', checked: true},
      {name: 'Ledger Wallet', dataShow: 'LEDGER', checked: false},
      {name: langEn.IMPORT_TYPE.TREZOR, dataShow: 'TREZOR', checked: false},
      {name: langEn.IMPORT_TYPE.KEYSTORE, dataShow: 'keystore', checked: false},
      {name: langEn.IMPORT_TYPE.PRIVATE_KEY, dataShow: 'private', checked: false},
      // {name: 'Mnemonic Phrase', dataShow: 'Mnemonic', checked: false} //后期使用
    ]
  },
  mutations: {
    storeAddress (state, address) {
      state.address = address
    },
    storeCoinlist (state, data) {
      for (let i = 0; i < state.coinlist.length; i++) {
        if (data.coin === state.coinlist[i].coin) {
          state.coinlist[i].balance = data.balance ? data.balance : 0
          state.coinlist[i].balanceDollar = data.balanceDollar ? data.balanceDollar : 0
          state.coinlist[i].flag = data.flag
          state.coinlist[i].BTCval = data.BTCval ? data.BTCval : 0
          state.coinlist[i].percent_change_1h = data.percent_change_1h ? data.percent_change_1h : 0
          state.coinlist[i].percent_change_7d = data.percent_change_7d ? data.percent_change_7d : 0
          state.coinlist[i].percent_change_24h = data.percent_change_24h ? data.percent_change_24h : 0
          state.coinlist[i].price_btc = data.price_btc ? data.price_btc : 0
          state.coinlist[i].price_usd = data.price_usd ? data.price_usd : 0
        }
      }
    },
  },
  modules: {
    // wallet,
    exchange
  }
  // state: {
  //   loginType: [],
  //   keystoreURL: '',
  //   address: '',
  //   downloadName: '',
  //   coinInfo: require('@etc/js/config/coinIfno').coininfo,
  //   walletLoadFlag: true,
  //   ledger: '',
  //   trezor: '',
  //   HDpath: '',
  //   network: {},
  //   safeMode: false,
  //   privateKey: ''
  // },
  // mutations: {
  //   storeLoginType (state, data) {
  //     state.loginType = data
  //   },
  //   storeKeystoreURL (state, url) {
  //     state.keystoreURL = url
  //   },
  //   storeAddress (state, address) {
  //     state.address = address
  //   },
  //   storeDownload (state, address) {
  //     state.downloadName = address
  //   },
  //   storeCoinInfo (state, data) {
  //     for (let i = 0; i < state.coinInfo.length; i++) {
  //       if (data.coin === state.coinInfo[i].coin) {
  //         state.coinInfo[i].balance = data.balance
  //         state.coinInfo[i].balanceDollar = data.balanceDollar
  //         state.coinInfo[i].flag = data.flag
  //       }
  //     }
  //   },
  //   storeWalletLoadFlag (state, data) {
  //     state.walletLoadFlag = data
  //   },
  //   storeLedger (state, data) {
  //     state.ledger = data
  //   },
  //   storeTrezor (state, data) {
  //     state.trezor = data
  //   },
  //   storeHDpath (state, data) {
  //     state.HDpath = data
  //   },
  //   storeNetwork (state, data) {
  //     state.network = data
  //   },
  //   storeSafeMode (state, data) {
  //     state.safeMode = data
  //   },
  //   storePrivateKey (state, data) {
  //     state.privateKey = data
  //   }
  // }
})

export default store
