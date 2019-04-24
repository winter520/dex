let exchange = {
  state: {
    coinInfo: {},
    pairInfo: {},
    isOrderRefresh: 0
  },
  mutations: {
    storeCoininfo (state, data) {
      state.coinInfo = data
    },
    storePairinfo (state, data) {
      state.pairInfo = data
    },
    storeIsOrderRefresh (state) {
      state.isOrderRefresh ++
    }
  }
}

export default exchange
