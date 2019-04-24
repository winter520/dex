const http = require('http')
const https = require('https')
const express = require('express')
const app = express()
const fs = require('fs')
const net = require('net')
const bodyParser = require('body-parser')

const httpsPort =  8086
const httpPort =  8087

const privateKey = fs.readFileSync('./server/keys/privkey.pem', 'utf-8')
const cretificats = fs.readFileSync('./server/keys/cert.pem', 'utf-8')
const credentials = {key: privateKey, cert: cretificats}

app.use(express.static(require('path').join(__dirname, 'public')))

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

let transferInfo = require('./server/transferInfo')
let lilo = require('./server/lilo')
let order = require('./server/order')

app.use('/transfer', transferInfo)
app.use('/lilo', lilo)
app.use('/order', order)

const httpsServer = https.createServer(credentials, app)
httpsServer.listen(httpsPort)

const httpserver = http.createServer(app).listen(httpPort)

net.createServer(function (socket) {
  socket.once('data', function (buf) {
    // console.log(buf[0])
    var address = buf[0] === 22 ? httpsPort : httpPort
    var proxy = net.createConnection(address, function() {
    proxy.write(buf)
    socket.pipe(proxy).pipe(socket); })
    proxy.on('error', function(err) {
      console.log(err)
    })
  })
  socket.on('error', function(err) {
    console.log(err)
  })
  console.log('success')
}, app).listen(8085)

// console.log('success')