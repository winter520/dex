require('./db.js')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const Transaction = mongoose.model('Transaction')
const web3 = require('./web3.js').web3
const async = require('async')

let getBeforeDate = (n) => {
  // let n = n
  let s
  let d = new Date()
  let year = d.getFullYear()
  let mon = d.getMonth() + 1
  let day = d.getDate()
  if(day <= n) {
    if(mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day)
  return s
}

router.post('/create', (req, res) => {
  console.log(req.body)
  let order = new Order({
    value: req.body.value,
    pair: req.body.pair,
    to: req.body.to,
    from: req.body.from,
    timestamp: Date.now(),
    hash: req.body.hash,
    nonce: req.body.nonce,
    gasPrice: req.body.gasPrice,
    gasLimit: req.body.gasLimit,
    price: req.body.price,
    side: req.body.side,
    data: req.body.data,
    status: req.body.status
  })
  let data = {
    msg: 'error',
    info: ''
  }
  order.save(function (err, result) {
    if (err) {
      console.log(err)
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/getOrder', (req, res) => {
  let _limit = req.body.pageSize ? req.body.pageSize : 20
  let _skip = req.body.pageNum ? (Number(req.body.pageNum - 1) * Number(_limit)) : 0
  let params = {}
  let data = {
    msg: 'error',
    info: ''
  }
  if (req.body.side) {
    params.side = req.body.side
  }
  if (req.body.pair) {
    params.pair = req.body.pair
  }
  if (req.body.status) {
    params.status = req.body.status
  }
  if (req.body.timestamp) {
    if (req.body.timestamp === '1 Day') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24
      }
    } else if (req.body.timestamp === '1 Week') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 7
      }
    } else if (req.body.timestamp === '1 Month') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 30
      }
    } else if (req.body.timestamp === '3 Months') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 30 * 3
      }
    }
  }
  // console.log(params)
  Order.find(params).sort({'timestamp': -1}).skip(Number(_skip)).limit(Number(_limit)).exec((err, result) => {
    if (err) {
      console.log(err)
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/getTx', (req, res) => {
  let _limit = req.body.pageSize ? req.body.pageSize : 20
  let _skip = req.body.pageNum ? (Number(req.body.pageNum - 1) * Number(_limit)) : 0
  let params = {}
  let data = {
    msg: 'error',
    info: ''
  }
  if (req.body.side) {
    params.side = req.body.side
  }
  if (req.body.trade) {
    params.trade = req.body.trade
  }
  if (req.body.timestamp) {
    if (req.body.timestamp === '1 Day') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24
      }
    } else if (req.body.timestamp === '1 Week') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 7
      }
    } else if (req.body.timestamp === '1 Month') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 30
      }
    } else if (req.body.timestamp === '3 Months') {
      params.timestamp = {
        '$gte': Date.now() - 1000 * 60 * 60 * 24 * 30 * 3
      }
    }
  }
  // console.log(params)
  Transaction.find(params).sort({'timestamp': -1}).skip(Number(_skip)).limit(Number(_limit)).exec((err, result) => {
    if (err) {
      console.log(err)
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/getPairs', (req, res) => {
  let days = [Date.parse(getBeforeDate(1) + ' 00:00:00'), Date.parse(getBeforeDate(0) + ' 00:00:00'), Date.now()]
  let pairData = web3.lilo.getPairList()
  let pairArr = [pairData]
  let $data = {
    msg: 'error',
    info: []
  }
  // console.log(days)
  async.eachSeries(pairArr, (pair, cb) => {
    async.waterfall([
      (callback) => {
        Transaction.find( {'trade': pair, 'timestamp': {'$lt': days[1]} } ).sort({'timestamp': -1}).limit(1).exec((err, result) => {
          if (err) {
            console.log(err)
          } else {
            let pricePrev = 0
            if (result.length > 0) {
              pricePrev = result[0].price ? Number(result[0].price) : 0
            }
            callback(null, pricePrev)
          }
        })
      },
      (data, callback) => {
        let block = web3.eth.getBlock('latest').number
        let _order = web3.lilo.xproOrderDealedInfo('0x' + block.toString(16), pair)
        if (_order) {
          _order = JSON.parse(_order)
        }
        let priceNow = _order.price ? Number(_order.price) : 0
        let pecent = 0
        if (priceNow === 0) {
          pecent = 0
        }else if (data === 0) {
          pecent = priceNow
        } else {
          pecent = priceNow / data
        }
        callback(null, pecent)
      },
      (data, callback) => {
        Transaction.find({'timestamp': {'$gte': days[1]}, 'trade': pair }).countDocuments((err, result) => {
          if (err) {
            console.log(err)
          } else {
            callback(null, {
              change: data,
              volume: result
            })
          }
        })
      },
      (data, callback) => {
        Transaction.find({'trade': pair}).sort({'timestamp': -1}).limit(1).exec((err, result) => {
          if (err) {
            console.log(err)
          } else {
            $data.info.push({
              change: data.change ? data.change : 0,
              volume: data.volume ? data.volume : 0,
              price: result.length > 0 ? result[0].price : 0,
              pair: pair
            })
          }
          callback(null, pair + ' get success')
        })
      }
    ], (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
      }
      cb(null, result)
    })
  }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      $data.msg = 'Success'
    }
    res.json($data)
  })
})

module.exports = router