const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const http = require()

app.use(express.static(require('path').join(__dirname,'public')))

app.all('*',function(req,res,next){
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'X-Requested-With')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.header('X-Powered-By', '3.2.1')
	res.header('Content-Type', 'application/json;charset=utf-8')
	next()
})

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))

let transferInfo = require('./server/transferInfo')
let lilo = require('./server/lilo')

app.use('/transfer', transferInfo)
app.use('/lilo', lilo)

let server = app.listen(8087, function () {
  console.log('success')
})
