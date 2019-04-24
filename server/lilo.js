require('./db.js')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// import {Lilo} from './db'
const Lilo = mongoose.model('Lilo')
// console.log(Lilo)

// return
// const pub = require('./public')
// const mongoose = pub.mongoose
// const Schema = mongoose.Schema
// console.log(pub)
// mongoose.connect('mongodb://localhost:27017/fsn')
// mongoose.connect('mongodb://localhost:27017/fsn', { useNewUrlParser: true })
// const liloSchema = new Schema({
//   blockHash: {type: String},
//   blockNumber: {type: String},
//   confirmations: {type: String},
//   contractAddress: {type: String},
//   cumulativeGasUsed: {type: String},
//   date: {type: Date},
//   from: {type: String},
//   data: {type: String},
//   gas: {type: String},
//   gasPrice: {type: String},
//   gasUsed: {type: String},
//   hash: {type: String},
//   fsnhash: {type: String},
//   input: {type: String},
//   isError: {type: String},
//   nonce: {type: String},
//   timestamp: {type: String},
//   to: {type: String},
//   transactionIndex: {type: String},
//   txreceipt_status: {type: String},
//   value: {type: String},
//   statusFsn: {type: String},
//   coin: {type: String},
//   tokenSymbol: {type: String}
// })

// const Lilo = mongoose.model('lilo', liloSchema)

router.post('/create', function (req, res) {
  let send = new Lilo({
    blockHash: req.body.blockHash ? req.body.blockHash : '',
    blockNumber: req.body.blockNumber ? req.body.blockNumber : '',
    confirmations: req.body.confirmations ? req.body.confirmations : '',
    contractAddress: req.body.contractAddress ? req.body.contractAddress : '',
    cumulativeGasUsed: req.body.cumulativeGasUsed ? req.body.cumulativeGasUsed : '',
    // date: new Date(),
    data: req.body.data ? req.body.data : '',
    from: req.body.from ? req.body.from.toLowerCase() : '',
    gas: req.body.gas ? req.body.gas : '',
    gasPrice: req.body.gasPrice ? req.body.gasPrice : '',
    gasUsed: req.body.gasUsed ? req.body.gasUsed : '',
    hash: req.body.hash ? req.body.hash.toLowerCase() : '',
    fsnhash: req.body.fsnhash ? req.body.fsnhash.toLowerCase() : '',
    input: req.body.input ? req.body.input : '',
    isError: req.body.isError ? req.body.isError : '',
    nonce: req.body.nonce ? req.body.nonce : '',
    timestamp: req.body.timestamp ? (req.body.timestamp > 10 ? req.body.timestamp : req.body.timestamp * 1000) : Date.now(),
    // updatetime: Date.now(),
    to: req.body.to ? req.body.to.toLowerCase() : '',
    transactionIndex: req.body.transactionIndex ? req.body.transactionIndex : '',
    txreceipt_status: req.body.txreceipt_status ? req.body.txreceipt_status : '',
    value: req.body.value ? req.body.value : '',
    statusFsn: req.body.statusFsn ? req.body.statusFsn : '',
    coin: req.body.coin ? req.body.coin : '',
    tokenSymbol: req.body.tokenSymbol ? req.body.tokenSymbol : ''
  })
  let data = {
    msg: 'error',
    info: ''
  }
  send.save(function (err, result) {
    if (err) {
      // console.log(1)
      console.log(err)
      data.msg = 'errpr'
      data.info = err
    } else {
      // console.log(2)
      // console.log(result)
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/lockInHistory', function (req, res) {
  let data = {
    msg: 'error',
    info: ''
  }
  let toAddress = req.body.to ? req.body.to.toLowerCase() : ''
  // Lilo.find({to: toAddress}, function (err, result) {
  Lilo.find({to: toAddress}).sort({'timestamp': -1}).exec((err, result) => {
    if (err) {
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/lockInChangeState', function (req, res) {
  let data = {
    msg: 'error',
    info: ''
  }
  // let toAddress = req.body.to ? req.body.to.toLowerCase() : ''
  // console.log(req.body)
  // Lilo.find({hash: req.body.hash}, function (err, result) {
  Lilo.find({hash: req.body.hash}).sort({'timestamp': -1}).exec((err, result) => {
    if (err) {
      data.msg = 'errpr'
      data.info = err
    } else {
      let updateData = result[0]
      console.log(updateData)
      updateData.fsnhash = req.body.fsnhash
      updateData.statusFsn = req.body.statusFsn
      // updateData.updatetime = Date.now()
      updateData.save()
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/lockOutHistory', function (req, res) {
  let data = {
    msg: 'error',
    info: ''
  }
  let fromAddress = req.body.from ? req.body.from.toLowerCase() : ''
  // Lilo.find({from: fromAddress, coin: req.body.coin}, function (err, result) {
  Lilo.find({from: fromAddress, coin: req.body.coin}).sort({'timestamp': -1}).exec((err, result) => {
    if (err) {
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
      // let compare = function compare (property) {
      //   return function (a, b) {
      //     let value1 = a[property]
      //     let value2 = b[property]
      //     if (Date.parse(value1) > Date.parse(value2)) {
      //       return -1
      //     } else if (value1 < value2) {
      //       return 1
      //     } else {
      //       return 0
      //     }
      //     // return Date.parse(value1) - Date.parse(value2)
      //   }
      // }
      // result.sort(compare('date'))
      data.info = result
      res.json(data)
    }
  })
})

module.exports = router
