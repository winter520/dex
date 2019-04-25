const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Block = new Schema({
  number: {type: Number, index: {unique: true}},
  orders: {type: Number},
  price: {type: Number},
  timestamp: {type: Number},
  polumes: {type: Number}
})

const Transaction = new Schema({
  from: {type: String},
  height: {type: Number},
  hash: {type: String, index: {unique: true}},
  ordertype: {type: String},
  price: {type: Number},
  quantity: {type: Number},
  rule: {type: String},
  side: {type: String},
  timestamp: {type: Number},
  trade: {type: String}
})

const Order = new Schema({
  value: {type: Number},
  pair: {type: String},
  to: {type: String},
  from: {type: String},
  timestamp: {type: Number, index: {unique: true}},
  hash: {type: String},
  nonce: {type: Number},
  gasPrice: {type: Number},
  gasLimit: {type: Number},
  price: {type: Number},
  quantity: {type: Number},
  side: {type: String},
  data: {type: String},
  status: {type: String}
})

Block.index({Number: -1})
Transaction.index({timestamp: -1})
Order.index({timestamp: -1})

mongoose.model('Block', Block)
mongoose.model('Transaction', Transaction)
mongoose.model('Order', Order)

mongoose.connect('mongodb://localhost:27017/fusion', { useNewUrlParser: true })

module.exports = {
  Block: mongoose.model('Block'),
  Transaction: mongoose.model('Transaction'),
  Order: mongoose.model('Order')
}