const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Lilo = new Schema({
  blockHash: {type: String},
  blockNumber: {type: String},
  confirmations: {type: String},
  contractAddress: {type: String},
  cumulativeGasUsed: {type: String},
  from: {type: String},
  data: {type: String},
  gas: {type: String},
  gasPrice: {type: String},
  gasUsed: {type: String},
  hash: {type: String},
  fsnhash: {type: String},
  input: {type: String},
  isError: {type: String},
  nonce: {type: String},
  timestamp: {type: String, index: {unique: true}},
  to: {type: String},
  transactionIndex: {type: String},
  txreceipt_status: {type: String},
  value: {type: String},
  statusFsn: {type: String},
  coin: {type: String},
  tokenSymbol: {type: String}
})

const Transfer = new Schema({
  value: {type: Number},
  coin: {type: String},
  to: {type: String},
  from: {type: String},
  timestamp: {type: Number, index: {unique: true}},
  hash: {type: String},
  nonce: {type: Number},
  gasPrice: {type: Number},
  gasLimit: {type: Number},
  status: {type: String}
})

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

Lilo.index({timestamp: -1})
Transfer.index({timestamp: -1})
Block.index({Number: -1})
Transaction.index({timestamp: -1})
Order.index({timestamp: -1})

mongoose.model('Lilo', Lilo)
mongoose.model('Transfer', Transfer)
mongoose.model('Block', Block)
mongoose.model('Transaction', Transaction)
mongoose.model('Order', Order)

mongoose.connect('mongodb://localhost:27017/fsn', { useNewUrlParser: true })

module.exports = {
  Lilo: mongoose.model('Lilo'),
  Transfer: mongoose.model('Transfer'),
  Block: mongoose.model('Block'),
  Transaction: mongoose.model('Transaction'),
  Order: mongoose.model('Order')
}