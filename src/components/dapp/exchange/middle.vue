<template>
  <div class="fullScreen">
    <div class="tradingview-widget-container fullScreen">
      <div id="tradingview_view" class="fullScreen"></div>
      <!-- <div class="tradingview-widget-copyright"><a href="https://cn.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL图表</span></a>由TradingView提供</div> -->
    </div>
  </div>
</template>

<style>

</style>


<script>
export default {
  name: 'middle',
  data () {
    return {
      coinCode: 'BITFINEX:FSNUSD',
      chart: null,
      last_price:1234.2365,
      bars: [
        {
          time:1508313600000,
          close:42.1,
          open:41.0,
          high:43.0,
          low:40.4,
          volume:12000
        }, {
          time:1508317200000,
          close:43.4,
          open:42.9,
          high:44.1,
          low:42.1,
          volume:18500
        }, {
          time:1508320800000,
          close:44.3,
          open:43.7,
          high:44.8,
          low:42.8,
          volume:24000
        }, {
          time:1508324400000,
          close:42.8,
          open:44.5,
          high:44.5,
          low:42.3,
          volume:45000
        }
      ]
    }
  },
  watch: {
    coinChange (cur, old) {
      this.coinCode = cur.cryptoCode
      this.changeCharts()
    }
  },
  computed: {
    coinChange () {
      return this.$store.state.exchange.coinInfo
    }
  },
  mounted () {
    this.changeCharts()
  },
  methods: {
    changeCharts () {
      // console.log(require('@etc/custom_scripts/chart_main/'))
      TradingView.onready(configurationData => {
        this.chart = new TradingView.widget({
          fullscreen: false,//显示图表是否占用窗口中所有可用的空间
          autosize: true,
          symbol: this.coinCode,//商品名称
          container_id: "tradingview_view",//k线div容器id
          datafeed: this.createFeed(),//调用datafeed初始化函数
          library_path: "static/custom_scripts/chart_main/",//static文件夹的路径
          locale: "en",//语言
          timezone: 'Etc/UTC', //todo: ustawianie timezone'a po strefie usera
          charts_storage_api_version: "1.1",
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          debug: true,
          //loading_screen:{ backgroundColor: "#000000",foregroundColor: "#000000", }//todo:do it
          interval: '60',//默认显示时间分辨率15分钟
          // timeframe:'',//todo: na koncu
          toolbar_bg: "#20334d",
          // saved_data: this.savedData,
          allow_symbol_change: true,
          time_frames: [
            {text: "1y", resolution: "1W"},
            {text: "6m", resolution: "3D"},
            {text: "3m", resolution: "1D"},
            {text: "1m", resolution: "1D"},
            {text: "1w", resolution: "30"},
            {text: "3d", resolution: "30"},
            {text: "1d", resolution: "30"},
            {text: "6h", resolution: "15"},
            {text: "1h", resolution: "1"}],
          drawings_access: {
            type: 'black',
            // tools: [{name: "Regression Trend"}]//todo: moje
            tools: [{name: "Trend Line", grayed: true}, {name: "Trend Angle", grayed: true}] //todo: bb
          },
          disabled_features: [//禁用图表某个功能,参考:https://tradingview.gitee.io/featuresets/
            "header_symbol_search",//隐藏搜索框
            "header_interval_dialog_button",//隐藏设置周期按钮
          ],
          custom_css_url: 'chart.css'
        })
      })

      // new TradingView.widget({
      //   "fullscreen": true, //全屏
      //   "autosize": true,
      //   "symbol": this.coinCode,
      //   "interval": "D",
      //   "timezone": "Etc/UTC",
      //   "theme": "Dark",
      //   // "theme": "Light",
      //   "style": "2",
      //   "datafeed": {},
      //   // "locale": "en",
      //   "locale": "zh_CN",
      //   "toolbar_bg": "#f1f3f6",
      //   "enable_publishing": false,
      //   "withdateranges": true,
      //   "hide_side_toolbar": false,
      //   "allow_symbol_change": true,
      //   "watchlist": [ //自选列表
      //     "BITFINEX:FSNUSD"
      //   ],
      //   "details": true, // 是否显示详细资料
      //   "hotlist": true, // 是否显示热股榜
      //   "calendar": true, // 是否显示日历
      //   "news": [
      //     "stocktwits", // 是否显示StockTwits
      //     "headlines" // 是否显示新闻提要
      //   ],
      //   "container_id": "tradingview_view"
      // })
      // console.log(TradingView)
    },
    createFeed () {
      let this_vue = this;
      let Datafeed = {};

      Datafeed.DataPulseUpdater = function(datafeed, updateFrequency) {
        this._datafeed = datafeed;
        this._subscribers = {};
        this._requestsPending = 0;
        var that = this;
        var update = () => {
          if (that._requestsPending > 0) {
            return
          }
          for (var listenerGUID in that._subscribers) {
            var subscriptionRecord = that._subscribers[listenerGUID]
            var resolution = subscriptionRecord.resolution
            var datesRangeRight = parseInt((new Date().valueOf()) / 1000)
            //	注意：请注意，我们确实需要两个酒吧，而不是最后一个。
            //	请参阅下面的解释。` 10`是“足够大”的值
            var datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 10)
            that._requestsPending ++
            ((_subscriptionRecord) => { // eslint-disable-line
              that._datafeed.getBars(
                _subscriptionRecord.symbolInfo,
                resolution,
                datesRangeLeft,
                datesRangeRight,
                bars => {
                  that._requestsPending--
                  //	表示在等待数据时取消订阅
                  if (!that._subscribers.hasOwnProperty(listenerGUID)) {
                    return
                  }
                  if (bars.length === 0) {
                    return
                  }
                  var lastBar = bars[bars.length - 1]
                  if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
                    return
                  }
                  var subscribers = _subscriptionRecord.listeners
                  //	当心：当第一次更新出现时，这个更新不起作用，而这个更新会生成一个新的条。在这种情况下
                  //	_subscriptionRecord.lastBarTime = NaN
                  var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime

                  //	脉冲更新可能会错过一些交易数据（即，如果脉冲周期=10秒，并且在最后一次更新后5秒后启动新的交易条，则旧交易条的最后5秒交易将丢失）。因此，首先，我们应该在旧的酒吧准备好时广播更新。
                  if (isNewBar) {
                    if (bars.length < 2) {
                      throw new Error('Not enough bars in history for proper pulse update. Need at least 2.')
                    }
                    var previousBar = bars[bars.length - 2]
                    for (var i = 0; i < subscribers.length; ++i) {
                      subscribers[i](previousBar)
                    }
                  }
                  _subscriptionRecord.lastBarTime = lastBar.time;

                  for (var i = 0; i < subscribers.length; ++i) {
                    subscribers[i](lastBar);
                  }
                },
                //	on error
                () => {
                  that._requestsPending--
                }
              )
            })(subscriptionRecord)
          }
        }

        if (typeof updateFrequency != 'undefined' && updateFrequency > 0) {
          setInterval(update, updateFrequency);
        }
      }

      Datafeed.DataPulseUpdater.prototype.periodLengthSeconds = function(resolution, requiredPeriodsCount) {
        var daysCount = 0;
        if (resolution === 'D') {
          daysCount = requiredPeriodsCount;
        } else if (resolution === 'M') {
          daysCount = 31 * requiredPeriodsCount;
        } else if (resolution === 'W') {
          daysCount = 7 * requiredPeriodsCount;
        } else {
          daysCount = requiredPeriodsCount * resolution / (24 * 60);
        }
        return daysCount * 24 * 60 * 60;
      }

      Datafeed.DataPulseUpdater.prototype.subscribeDataListener = function(symbolInfo, resolution, newDataCallback, listenerGUID) {
        this._datafeed._logMessage('Subscribing ' + listenerGUID);
        if (!this._subscribers.hasOwnProperty(listenerGUID)) {
          this._subscribers[listenerGUID] = {
            symbolInfo: symbolInfo,
            resolution: resolution,
            lastBarTime: NaN,
            listeners: []
          };
        }
        this._subscribers[listenerGUID].listeners.push(newDataCallback);
      }

      Datafeed.DataPulseUpdater.prototype.unsubscribeDataListener = function(listenerGUID) {
        this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
        delete this._subscribers[listenerGUID];
      }

      Datafeed.Container = function(updateFrequency){
        this._configuration = {
          supports_search: false,
          supports_group_request: false,
          supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '3D', '1W', '1M'],
          supports_marks: true,
          supports_timescale_marks: true,
          exchanges: ['myExchange']
        }
        this._barsPulseUpdater = new Datafeed.DataPulseUpdater(this, updateFrequency || 10 * 1000);
        // this._quotesPulseUpdater = new Datafeed.QuotesPulseUpdater(this);
        this._enableLogging = true;
        this._callbacks = {};
        this._initializationFinished = true;
        this._fireEvent('initialized');
        this._fireEvent('configuration_ready');
      };

      Datafeed.Container.prototype._fireEvent = function(event, argument) {
        if (this._callbacks.hasOwnProperty(event)) {
          var callbacksChain = this._callbacks[event];
          for (var i = 0; i < callbacksChain.length; ++i) {
            callbacksChain[i](argument);
          }
          this._callbacks[event] = [];
        }
      };

      Datafeed.Container.prototype._logMessage = function(message) {
        if (this._enableLogging) {
          var now = new Date();
          console.log("CHART LOGS: "+now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
        }
      };

      Datafeed.Container.prototype.on = function(event, callback) {
        if (!this._callbacks.hasOwnProperty(event)) {
          this._callbacks[event] = [];
        }
        this._callbacks[event].push(callback);
        return this;
      };

      Datafeed.Container.prototype.onReady = function(callback) {
        let that = this;
        if (this._configuration) {
          setTimeout(function() {
            callback(that._configuration);
          }, 0);
        }
        else {
          this.on('configuration_ready', function() {
            callback(that._configuration);
          });
        }
      };

      Datafeed.Container.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        this._logMessage("GOWNO :: resolve symbol "+ symbolName);
        Promise.resolve().then(() => {
          function adjustScale(){
            if(this_vue.last_price>1000)
              return 100;
            else
              return 100000000;
          }
          this._logMessage("GOWNO :: onResultReady inject "+this_vue.currency1 + ":"+ this_vue.currency2);
          onSymbolResolvedCallback({
            "name": this_vue.currency1 + ":"+ this_vue.currency2,
            "timezone": "Europe/Warsaw",
            "pricescale": adjustScale(),
            "minmov": 1,
            "minmov2": 0,
            "ticker": this_vue.currency1 + ":"+ this_vue.currency2,
            "description": "",
            "session": "24x7",
            "type": "bitcoin",
            "exchange-traded": "myExchange",
            "exchange-listed": "myExchange",
            "has_intraday": true,
            "intraday_multipliers": ['60'], //它是一个数组，包含数据馈送希望自己生成的日内分辨率（以分钟为单位）。例如，如果数据馈送报告他支持分辨率[“1”、“5”、“15”]，但实际上符号X只有1分钟的条，则应将日内乘数设置为x=[1]。这将使图表库自行构建5和15个分辨率。
            "has_weekly_and_monthly": false,
            "has_no_volume": false,
            "regular_session": "24x7"
          });
        })
      };

      Datafeed.Container.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
        if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
          throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
        }
        onDataCallback([], { noData: true });
        //onDataCallback(bars, { noData: true , nextTime: data.nb || data.nextTime });
      };

      Datafeed.Container.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
        this_vue.bars.forEach(function (bar) { // in subscribeBars
          onRealtimeCallback(bar)
        });
        this.on('pair_change', function() {
          onResetCacheNeededCallback();
        });
        //this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
      };

      Datafeed.Container.prototype.unsubscribeBars = function(listenerGUID) {
        this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
      };
      return new Datafeed.Container;
    }
  }
}
</script>
