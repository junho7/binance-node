const { Console } = require('console')
const { WebsocketStream } = require('@binance/connector')
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })
 
// define callbacks for different events
const callbacks = {
  open: () => logger.debug('Connected with Websocket server'),
  close: () => logger.debug('Disconnected with Websocket server'),
  message: data => logger.info(data)
}
 
const websocketStreamClient = new WebsocketStream({ logger, callbacks })
// subscribe ticker stream
websocketStreamClient.ticker('bnbusdt')
// close websocket stream
setTimeout(() => websocketStreamClient.disconnect(), 6000)