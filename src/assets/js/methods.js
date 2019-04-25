let $$ = {}

window.wallet = require('./wallet').default
window.etherUnits = require('@/assets/js/etherUnits').default
window.hd = {
  HDKey: require('hdkey'),
  bip39: require('bip39')
}
window.hdk = new window.hd.HDKey()
// $$.baseUrl = 'http://54.169.254.177:40415'
// $$.baseUrl = 'http://54.164.7.63:40415'
// $$.baseUrl = window.location.protocol + '//54.164.7.63:40445'
// $$.baseUrl = window.location.protocol + '//api.dcrm.network'
if (process.env.NODE_ENV === 'development') {
  $$.baseUrl = '/api'
} else {
  $$.baseUrl = window.location.protocol + '//api.dcrm.network'
}
// console.log(process.env.NODE_ENV)

// $$.bipPath = "m/44'/1'/0'/0"
$$.bipPath = "m/44'/1'/0'/0"
// import wallet from "@/assets/js/wallet"
// $$.baseUrl = 'http://54.183.185.30:8018'
$$.baseUrl = 'https://api.nodes.run'

// $$.baseUrl = 'http://104.210.49.28:40445'
// $$.baseUrl = window.location.protocol + '//104.210.49.28:40445'
// $$.baseUrl = 'http://10.192.32.92:40445'
// $$.baseUrl = 'http://47.92.255.230:40415/'
// $$.baseUrl = 'http://47.92.255.230:8111'

// $$.serverURL = 'http://localhost:8087'
$$.serverURL = 'http://localhost:8095'
// $$.serverURL = 'https://localhost:8085'
// $$.serverURL = 'http://54.164.7.63:8087'
// $$.serverURL = 'https://wallet.dcrm.network:8085'
// $$.serverURL = window.location.protocol + '//wallet.dcrm.network:8087'
// $$.serverURL = window.location.protocol + '//wallet.dcrm.network:8085'

$$.promptSvg = require('@etc/img/Prompt.svg')

$$.color = {
  Success: '#67C23A',
  Warning: '#E6A23C',
  Danger: '#F56C6C',
  Info: '#909399'
}

$$.thousandBit = (num, dec = 2) => {
  num = Number(num)
  if (isNaN(num)) {
    num = 0
    num = num.toFixed(dec)
  } else {
    if (isNaN(dec)) {
      // console.log(num)
      if (num.toString().indexOf('.') === -1) {
        num = num.toLocaleString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
      } else {
        let numSplit = num.toString().split('.')
        numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
        // console.log(numSplit)
        num = numSplit[0].toLocaleString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
        num = num + '.' + numSplit[1]
      }
    } else {
      num = num.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    }
  }
  return num
}

$$.thousandChange = function (num, dec) {
  num = this.thousandToNum(num)
  return this.thousandBit(num, dec)
}

$$.thousandToNum = (num) => {
  // console.log(num)
  return num.toString().replace(/,/g, '')
}

$$.bigNumber = (num) => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

$$.timeChange = (data) => {
  let time = data.date ? new Date(data.date) : new Date()
  let formatType = data.format ? data.format : '/'
  let Y = time.getFullYear()
  let M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
  let D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
  let h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()
  let m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
  let s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()
  // console.log(Date.parse(data.date))
  // console.log(new Date(Date.parse(data.date)).getDate())
  if (data.type === 'yyyy-mm-dd') {
    time = Y + formatType + M + formatType + D
  } else if (data.type === 'yyyy-mm-dd hh:mm') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  } else if (data.type === 'yyyy-mm-dd hh:mm:ss') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
  } else if (data.type === 'yyyy-mm-dd hh') {
    time = Y + formatType + M + formatType + D + ' ' + h
  } else if (data.type === 'yyyy-mm') {
    time = Y + formatType + M
  } else if (data.type === 'yyyy') {
    time = Y
  }
  return time
}

// 提示弹框
$$.layerMsg = (layer) => {
  if (document.getElementById('layer-tip')) {
    document.body.removeChild(document.getElementById('layer-tip'))
  }
  let data = {
    tip: layer.tip,
    time: layer.time ? layer.time : 3000,
    bgColor: layer.bgColor ? layer.bgColor : 'rgba(0,0,0,.8)',
    icon: layer.icon ? layer.icon : ''
  }
  // console.log(layer)
  // console.log((typeof layer).toLowerCase())
  if ((typeof layer).toLowerCase() !== 'object'.toLowerCase()) {
    data = {
      tip: layer,
      time: 3000,
      bgColor: 'rgba(0,0,0,.8)',
      icon: ''
    }
  }
  let _div = document.createElement('div')
  let _span = document.createElement('span')
  let _i = document.createElement('i')
  _div.id = 'layer-tip'
  _div.style.position = 'fixed'
  _div.style.bottom = '0'
  _div.style.left = '0'
  _div.style.width = document.body.clientWidth + 'px'
  // _div.style.height = document.body.clientHeight + 'px'
  _div.style.display = 'flex'
  _div.style.justifyContent = 'center'
  _div.style.alignItems = 'flex-end'
  _div.style.zIndex = '99999'

  if (data.icon) {
    _span.innerHTML = '<img src="' + data.icon + '" width=16 height=16 style="margin-right:10px">' + data.tip
  } else {
    _span.innerHTML = data.tip
  }
  _span.display = 'block'
  // _span.style.padding = '10px 15px'
  _span.style.backgroundColor = data.bgColor
  _span.style.color = '#fff'
  // _span.style.maxWidth = '90%'
  _span.style.width = '100%'
  // _span.style.height = '55px'
  _span.style.lineHeight = '22px'
  _span.style.display = 'flex'
  _span.style.justifyContent = 'center'
  _span.style.alignItems = 'center'
  _span.style.position = 'relative'
  // _span.style.paddingRight = '144px'
  _span.style.padding = '18px 144px 18px 15px'
  _span.style.fontSize = '16px'
  _span.style.wordBreak = 'break-all'

  _i.innerHTML = '<img src="' + require('@etc/img/Close.svg') + '" width=15 height=15>'
  _i.style.width = '144px'
  _i.style.height = '100%'
  _i.style.position = 'absolute'
  _i.style.top = '0'
  _i.style.right = '0'
  _i.style.display = 'flex'
  _i.style.justifyContent = 'center'
  _i.style.alignItems = 'center'
  _i.style.borderLeft = '1px solid rgba(255,255,255,.7)'
  _i.style.cursor = 'pointer'
  _i.onclick = () => {
    document.body.removeChild(_div)
  }
  _span.appendChild(_i)
  _div.appendChild(_span)

  window.onresize = function () {
    _div.style.width = document.body.clientWidth + 'px'
    _div.style.height = document.body.clientHeight + 'px'
  }
  document.body.appendChild(_div)
  setTimeout(function () {
    var hideCount = 10
    var hideOpcity = setInterval(function () {
      hideCount--
      _div.style.opacity = hideCount / 10
      if (hideCount < 0) {
        window.clearInterval(hideOpcity)
        // document.querySelectorAll('layer-tip')
        // console.log(document.getElementById('layer-tip'))
        if (document.getElementById('layer-tip')) {
          document.body.removeChild(document.getElementById('layer-tip'))
        }
      }
    }, 10)
  }, data.time)
}

$$.errTip = (e) => {
  $$.layerMsg({
    tip: e,
    time: 5000,
    bgColor: $$.color.Danger,
    icon: $$.promptSvg
  })
}

$$.successTip = (e) => {
  $$.layerMsg({
    tip: e,
    time: 8000,
    bgColor: $$.color.Success,
    icon: $$.promptSvg
  })
}

$$.getBlob = (mime, str) => {
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
    return typeof obj
  } : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
  }
  var str1 = (typeof str === 'undefined' ? 'undefined' : _typeof(str)) === 'object' ? JSON.stringify(str) : str
  if (str1 == null) return ''

  let blob
  try {
    blob = new Blob([str1], {type: mime})
  } catch (e) {
    // TypeError old chrome and FF
    let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
    if (e.name === 'TypeError' && window.BlobBuilder) {
      blob = new BlobBuilder()
      blob.append([str1.buffer])
      blob = blob.getBlob(mime)
    } else {
      let tip = 'Browser does not support'
      alert(tip)
      throw tip
    }
  }
  return window.URL.createObjectURL(blob)
}

$$.loadingStart = (data) => {
  let initData = {
    img: require('@etc/img/wait.svg'),
    color: '#999',
    txt: data !== undefined ? data : 'Loading……'
  }

  if ((typeof data).toLowerCase() === 'object') {
    initData = {
      img: data.img ? data.img : require('@etc/img/wait.svg'),
      color: data.color ? data.color : '#999',
      txt: data.img ? data.txt : 'Loading……'
    }
  }

  let _div = document.createElement('div')
  _div.className = 'OnLodaing'
  _div.style.width = '100vw'
  _div.style.height = '100vh'
  _div.style.position = 'fixed'
  _div.style.top = '0'
  _div.style.left = '0'
  _div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
  _div.style.zIndex = '99999'
  _div.style.display = 'flex'
  _div.style.justifyContent = 'center'
  _div.style.alignItems = 'center'

  let _Load = document.createElement('div')
  _Load.innerHTML = '<div class="rotateLoad"><img src="' + initData.img + '" /></div><p style="margin-top:15px;font-size:16px;font-weight:bold;color:#333;padding-left:12px;' + initData.color + '">' + initData.txt + '</p>'
  _Load.style.textAlign = 'center'
  // let _img = ''

  _div.appendChild(_Load)
  document.body.appendChild(_div)
}

$$.limitCoin = function (num, limit, type) {
  let callback = {
    flag: true,
    msg: ''
  }
  if (num < limit) {
    callback = {
      flag: true,
      msg: 'The amount cannot be less than ' + limit
    }
  } else if (type && type === 'INT' && Number(num).toString().indexOf('.') !== -1) {
    callback = {
      flag: true,
      msg: 'Please enter an integer'
    }
  } else {
    callback = {
      flag: false,
      msg: ''
    }
  }
  return callback
}

$$.setWeb3 = function (url) {
  let Web3 = require('web3')
  let web3
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(url))
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
        params: 1,
        inputFormatter: [null],
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
  window.v_web3 = web3
}

$$.coinExchange = function (coin) {
  coin = coin.toLowerCase()
  if (coin === 'btc') {
    return 8
  }
}

$$.toWei = function (num, coin) {
  let that = this
  let e = that.coinExchange(coin)
  num = isNaN(num) ? 0 : num
  // console.log(num)
  num = that.thousandBit(Number(num) * Math.pow(10, e), 'no')
  // console.log(num)
  num = that.thousandToNum(num)
  // console.log(num)
  return Number(num)
}

$$.fromWei = function (num, coin) {
  let that = this
  let e = that.coinExchange(coin)
  num = isNaN(num) ? 0 : num
  return Number(num) * Math.pow(10, -e)
}

$$.walletRequirePass = (ethjson) => {
  let jsonArr
  try {
    jsonArr = JSON.parse(ethjson)
  } catch (err) {
    let errtxt1 = 'This is not a valid wallet file. '
    throw errtxt1
  }
  if (jsonArr.encseed != null) {
    return true
  } else if (jsonArr.Crypto != null || jsonArr.crypto != null) {
    return true
  } else if (jsonArr.hash != null && jsonArr.locked) {
    return true
  } else if (jsonArr.hash != null && !jsonArr.locked) {
    return false
  } else if (jsonArr.publisher === 'MyEtherWallet' && !jsonArr.encrypted) {
    return false
  } else {
    let errtxt2 = 'Sorry! We don\'t recognize this type of wallet file. '
    throw errtxt2
  }
}

$$.fixPkey = (key) => {
  if (key.indexOf('0x') === 0) {
    return key.slice(2)
  }
  return key
}

$$.strToHexCharCode = (str) => {
  if (!str) return ''
  var hexCharCode = []
  hexCharCode.push('0x')
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16))
  }
  return hexCharCode.join('')
}

$$.qrCode = (cont, id) => {
  let QRCode = require('qrcodejs2')
  document.getElementById(id).innerHTML = ''
  let qrcodeInit = new QRCode(id, {
    width: 270,
    height: 270, // 高度
    text: cont // 二维码内容
    // render: "canvas" // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
    // background: "#f0f"
    // foreground: "#ff0"
  })
  // console.log(qrcodeInit)
  // qrcodeInit = null
}

$$.cutOut = (str, start, end) => {
  if (!str) return ''
  var str1 = str.substr(0, start)
  var str2 = str.substr(str.length - end)
  return str = str1 + '…' + str2
}

export default $$
