const { WebsocketClient, DefaultLogger } = require('binance');

const API_KEY = process.env.binanceApiKey;
const API_SECRET = process.env.binanceSecretKey;

// optionally override the logger
const logger = {
  ...DefaultLogger,
  silly: (...params) => {},
};

const wsClient = new WebsocketClient(
  {
    api_key: API_KEY,
    api_secret: API_SECRET,
    beautify: true,
    // Disable ping/pong ws heartbeat mechanism (not recommended)
    // disableHeartbeat: true
  },
  logger,
);

// receive raw events
wsClient.on('message', (data) => {
  console.log('raw message received ', JSON.stringify(data, null, 2));
});

// notification when a connection is opened
wsClient.on('open', (data) => {
  console.log('connection opened open:', data.wsKey, data.ws.target.url);
});

// receive formatted events with beautified keys. Any "known" floats stored in strings as parsed as floats.
wsClient.on('formattedMessage', (data) => {
  console.log('formattedMessage: ', data);
});

// read response to command sent via WS stream (e.g LIST_SUBSCRIPTIONS)
wsClient.on('reply', (data) => {
  console.log('log reply: ', JSON.stringify(data, null, 2));
});

// receive notification when a ws connection is reconnecting automatically
wsClient.on('reconnecting', (data) => {
  console.log('ws automatically reconnecting.... ', data?.wsKey);
});

// receive notification that a reconnection completed successfully (e.g use REST to check for missing data)
wsClient.on('reconnected', (data) => {
  console.log('ws has reconnected ', data?.wsKey);
});

// Recommended: receive error events (e.g. first reconnection failed)
wsClient.on('error', (data) => {
  console.log('ws saw error ', data?.wsKey);
});

// Call methods to subcribe to as many websockets as you want.
// Each method spawns a new connection, unless a websocket already exists for that particular request topic.
// wsClient.subscribeSpotAggregateTrades(market);
// wsClient.subscribeSpotTrades(market);
// wsClient.subscribeSpotKline(market, interval);
wsClient.subscribeSpotKline('bnbusdt', '1m');
// wsClient.subscribeSpotSymbolMini24hrTicker(market);
// wsClient.subscribeSpotAllMini24hrTickers();
// wsClient.subscribeSpotSymbol24hrTicker(market);
// wsClient.subscribeSpotAll24hrTickers();
// wsClient.subscribeSpotSymbolBookTicker(market);
// wsClient.subscribeSpotAllBookTickers();
// wsClient.subscribeSpotPartialBookDepth(market, 5);
// wsClient.subscribeSpotDiffBookDepth(market);

// wsClient.subscribeSpotUserDataStream();
// wsClient.subscribeMarginUserDataStream();
// wsClient.subscribeIsolatedMarginUserDataStream('BTCUSDT');

// wsClient.subscribeUsdFuturesUserDataStream();

// each method also restores the WebSocket object, which can be interacted with for more control
// const ws1 = wsClient.subscribeSpotSymbolBookTicker(market);
// const ws2 = wsClient.subscribeSpotAllBookTickers();
// const ws3 = wsClient.subscribeSpotUserDataStream(listenKey);

// optionally directly open a connection to a URL. Not recommended for production use.
// const ws4 = wsClient.connectToWsUrl(`wss://stream.binance.com:9443/ws/${listenKey}`, 'customDirectWsConnection1');