let Web3 = require('web3')
let web3
try {
  // web3 = new Web3(new Web3.providers.HttpProvider('https://10.192.32.92'))
  web3 = new Web3(new Web3.providers.HttpProvider('http://10.192.32.92:9901'))
} catch (error) {
  web3 = new Web3()
  console.log(error)
}
// console.log(web3)
web3._extend({
  property: 'lilo',
  methods: [
    new web3._extend.Method({
      name: 'dcrmReqAddr',
      call: 'lilo_dcrmReqAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmConfirmAddr',
      getter: 'lilo_dcrmConfirmAddr',
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmGetAddr',
      call: 'lilo_dcrmGetAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmLockin',
      call: 'lilo_dcrmLockin',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmGetBalance',
      call: 'lilo_dcrmGetBalance',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderCreate',
      call: 'lilo_xproOrderCreate',
      params: 6,
      inputFormatter: [null, null, null, null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderStatus',
      call: 'lilo_xproOrderStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderDealedInfo',
      call: 'lilo_xproOrderDealedInfo',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getPairList',
      call: 'lilo_getPairList',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    })
  ]
})

module.exports.web3 = web3
