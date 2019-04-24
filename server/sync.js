require('./db.js')
const web3 = require('./web3.js').web3
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Block = mongoose.model('Block')
const Order = mongoose.model('Order')
const Transaction = mongoose.model('Transaction')

const async = require('async')

let newBlocks

let writeBlock = (data, callback) => {
  let block = new Block({
    number: data.number ? data.number : '',
    orders: data.Orders ? data.Orders : '',
    price: data.Price ? data.Price : '',
    volumes: data.Volumes ? data.Volumes : '',
    timestamp: data.timestamp ? (data.timestamp.length > 10 ? data.timestamp : Number(data.timestamp) * 1000) : '',
  })
  block.save((err, res) => {
    if (err) {
      console.log('writeblock err')
      console.log(err)
      callback(err)
    } else {
      console.log('writeblock success')
      callback(null, data)
    }
  })
}

let writeTransaction = (data, callback) => {
  let txs = data.Done && data.Done.length > 0 ? data.Done : ''
  // console.log('-----------------------writeTransaction-----------------------')
  // console.log(txs)
  // console.log(data)
  // console.log(data.Done)
  if (txs) {
    async.eachSeries(txs, (tx, cb1) => {
      async.waterfall([
        (cb2) => {
          if (isNaN(tx.Timestamp)) {
            tx.Timestamp = Date.now()
          }
          let transaction = new Transaction({
            from: tx.From ? tx.From.toLowerCase() : '',
            height: tx.Height ? tx.Height : data.number,
            hash: tx.Id ? tx.Id.toLowerCase() : '',
            ordertype: tx.Ordertype ? tx.Ordertype : '',
            price: tx.Price ? tx.Price : '',
            quantity: tx.Quantity ? tx.Quantity : '',
            rule: tx.Rule ? tx.Rule : '',
            side: tx.Side ? tx.Side : '',
            timestamp: tx.Timestamp ? (tx.Timestamp.length > 10 ? tx.Timestamp : Number(tx.Timestamp) * 1000) : '',
            trade: tx.Trade ? tx.Trade : '',
          })
          transaction.save((err, res) => {
            if (err) {
              cb1(err)
            } else {
              cb1(null, tx)
            }
          })
        },
        (tx, cb2) => {
          Order.update({
            'Hash': tx.Id.toLowerCase()
          }, {
            'status': 'Success',
            'quantity': tx.Quantity ? tx.Quantity : 0,
          }).exec((err, res) => {
            if (err) {
              cb2(err)
            } else {
              cb2(null, 'Update order statue success')
            }
          })
        }
      ])
    }, (err, res) => {
      console.log('transaction end')
      if (err) {
        console.log('transaction data error')
        console.log(err)
      } else {
        console.log('transaction data success')
        console.log(res)
      }
      callback(null, res)
    })
  } else {
    callback(null, 'No transaction')
  }
}

let listenBlocks = () => {
  if (web3.eth.syncing) {
    console.log('Info: waiting until syncing finished... (currentBlock is #' + web3.eth.syncing.currentBlock + ')');
    newBlocks = null
    setTimeout(function () {
      listenBlocks()
    }, 10000)
    return
  }
  try {
    newBlocks = web3.eth.filter('latest')
    newBlocks.watch((err, latestBlock) => {
      if (err) {
        newBlocks = null
        setTimeout (listenBlocks, 10000)
      } else if (latestBlock === null) {
        console.log('Warning: null block hash')
      } else {
        if (web3.isConnected()) {
          web3.eth.getBlock(latestBlock, true, (err, blockData) => {
            if (err) {
              console.log('Warning: error on getting block with hash/number: ' +   latestBlock + ': ' + error)
            } else if (blockData === null) {
              console.log('Warning: null block data received from the block with hash/number: ' + latestBlock)
            } else {
              // let pairData = web3.lilo.getPairList()
              getBlockData('', blockData.number)
            }
          })
          
        } else {
          console.log('Error: Web3 connection time out trying to get block ' + latestBlock + ' retrying connection now');
          newBlocks = null
          listenBlocks(config)
        }
      }
    })
  } catch (e) {
    console.log('watch error:')
    console.log(e)
    setTimeout (listenBlocks, 10000)
  }
}

let getBlockData = (startBlock, endBlock, arr) => {
  let blocks = []
  console.log('block:', startBlock, endBlock)
  if (startBlock || startBlock === 0) {
    if (startBlock !== 0) {
      startBlock = startBlock + 1
    }
    for (let i = startBlock; i <= endBlock; i++) {
      blocks.push(i)
    }
  } else if (arr && arr.length > 0) {
    blocks = arr
  } else {
    blocks.push(endBlock)
  }
  console.log(blocks)
  async.eachSeries(blocks, (block, cb) => {
    async.waterfall([
      (callback) => {
        console.log('getBlock')
        console.log(block)
        let pairData = web3.lilo.getPairList()
        let pairArr = [pairData]
        console.log(pairArr)
        let orderInfo = {
          Done:[],
          Orders: 0,
          Price: 0,
          Volumes: 0
        }
        for (let pair of pairArr) {
          let _order = web3.lilo.xproOrderDealedInfo('0x' + block.toString(16), pair)
          if (_order) {
            _order = JSON.parse(_order)
          }
          // console.log("_order")
          // console.log(_order)
          // console.log(_order.Done && _order.Done.length > 0)
          if (_order.Done && _order.Done.length > 0) {
            // console.log('look txns:')
            orderInfo.Done.push(..._order.Done)
            // console.log(orderInfo.Done)
          }
          orderInfo.Orders += _order.Orders ? Number(_order.Orders) : 0
          orderInfo.Price += _order.Price ? Number(_order.Price) : 0
          orderInfo.Volumes += _order.Volumes ? Number(_order.Volumes) : 0
        }
        // console.log(orderInfo)
        // let orderInfo = web3.lilo.xproOrderDealedInfo('0x' + block.toString(16), pair)
        let blockInfo = web3.eth.getBlock(block, (err, res) => {
          if (err) {
            console.log('block err')
            console.log(err)
            callback(err)
          } else {
            Object.assign(orderInfo, res)
            callback(null, orderInfo)
          }
        })
      },
      writeBlock,
      writeTransaction
    ], (err, res) => {
      console.log('waterfall end')
      if (err) {
        console.log('Insert data error')
        console.log(err)
      } else {
        console.log('Insert data success')
      }
      cb(null, res)
    })
  }, (err, res) => {
    console.log('eachSeries end')
    if (err) {
      console.log(err)
      console.log('ForEach data error')
    } else {
      console.log('ForEach data success')
    }
  })
}

let syncChain = () => {
  if (web3.isConnected) {
    if (web3.eth.syncing) {
      console.log('Info: waiting until syncing finished... (currentBlock is #' + web3.eth.syncing.currentBlock + ')');
      setTimeout(function() { syncChain(); }, 10000);
      return;
    }
  }
  let currentBlock = web3.eth.getBlock('latest').number
  Block.find({}).sort({'number': -1}).limit(1).exec((err, res) => {
    if (err) {
      console.log(err)
    } else {
      if (res.length > 0) {
        getBlockData(res[0].number, currentBlock)
      } else {
        getBlockData(0, currentBlock)
      }
    }
  })
}

let volidBlock = () => {

  async.waterfall([
    (cb) => {
      Block.find({}).countDocuments((err, res) => {
        if (err) {
          console.log('volid block number error')
          console.log(err)
          cb(err)
        } else {
          if (isNaN(res)) {
            cb('No Data')
          } else {
            cb(null, res)
          }
        }
      })
    },
    (num, cb) => {
      Block.find({}).sort({'number': -1}).limit(1).exec((err, res) => {
        if (err) {
          console.log('volid block new error')
          console.log(err)
          cb(err)
        } else {
          if (res.length > 0) {
            if (Number(res[0].number) !== (num - 1)) {
              cb(null, res[0].number)
            } else {
              cb('No Data')
            }
          } else {
            cb(null)
          }
        }
      })
    },
    (num, cb) => {
      console.log('highest block number:')
      console.log(num)
      let arr = []
      for (let i = 0; i <= num; i++) {
        arr.push(i)
      }
      Block.find({}).distinct('number').exec((err, res) => {
        if (err) {
          console.log('Number volid')
        } else {
          let arr2 = new Set(res)
          let arr3 = []
          for (let item of arr) {
            if (!arr2.has(item) && item !== null) {
              console.log('volid block number:')
              arr3.push(item)
            }
          }
          console.log(arr3)
          getBlockData('', '', arr3)
          cb(null)
        }
      })
    }
  ], (err, res) => {
    if (err) {
      console.log('volidBlock error')
    } else {
      console.log('volidBlock success')
    }
  })
}


syncChain()

setTimeout(() => {
  listenBlocks()
}, 3000)

function intervalVolid() {
  volidBlock()
  setTimeout(intervalVolid, 1000 * 60 * 60)
}
intervalVolid()