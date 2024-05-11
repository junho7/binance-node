const { Console } = require("console");
const { WebsocketStream, Spot } = require("@binance/connector");
const logger = new Console({ stdout: process.stdout, stderr: process.stderr });
const { BigQuery } = require("@google-cloud/bigquery");
const credentials = require("./key.json");
const { deleteTable, createTable } = require("./bigquery");
const { SchemaKline } = require("./schema");
const cron = require("node-cron");

// Create a BigQuery client instance
const bigqueryClient = new BigQuery({
  projectId: "binance-marketstream",
  credentials,
});

const datasetId = "binance";
const tableId = "kline_1m";

// define callbacks for different events
const callbacks = {
  open: () => logger.debug("Connected with Websocket server"),
  close: () => logger.debug("Disconnected with Websocket server"),
  message: (data) => {
    // logger.info(data);
    data = JSON.parse(data);
    if (data?.e === "kline" && data?.k?.x === true) {
      insertData(data);
    }
  },
};
const websocketStreamClient = new WebsocketStream({
  logger,
  callbacks,
  wsURL: "wss://stream.binance.us:9443",
});


const insertData = (data) => {
  // console.log('data: ', data)
  // console.log('type: ', typeof JSON.parse(data))

  // console.log(data?.k)
  // console.log(data?.k?.x == false)
  // console.log(data?.k?.x === false)
  console.log("data: ", data);
  // Insert the data into the BigQuery table
  const insertData = {
    ticker: data.s,
    starttime: data.k.t,
    o: parseFloat(data?.k?.o),
    h: parseFloat(data?.k?.h),
    l: parseFloat(data?.k?.l),
    c: parseFloat(data?.k?.c),
    v: data?.k?.v,
  };
  bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert([insertData])
    .then(() => {
      console.log("Data inserted successfully");
    })
    .catch((err) => {
      if (err.name === "PartialFailureError") {
        err.errors.forEach((error) => {
          console.error("Error inserting row:", error.row);
          console.error("Error details:", error.errors);
        });
      } else {
        console.error("Error inserting data:", err);
      }
    });
};

const recreateTable = () =>
  deleteTable({
    client: bigqueryClient,
    datasetId,
    tableId,
  })
    .then(
      createTable({
        client: bigqueryClient,
        datasetId,
        tableId,
        schema: SchemaKline,
      })
    )
    .then(StreamStart());

cron.schedule("0 0 * * *", () => {
  console.log("recreating table");
  websocketStreamClient.disconnect();
  recreateTable();
});

const StreamStart = () => {

  websocketStreamClient.kline("btcusdt", "1m");
  // A single connection to stream.binance.us is only valid for 24-hours; expect to be disconnected at the 24 hour mark
  // @binance/connector: If there is a close event not initiated by the user, the reconnection mechanism will be triggered in 5 secs.
};

StreamStart();

// {
//   "e": "kline",     // Event type
//   "E": 1638747660000,   // Event time
//   "s": "BTCUSDT",    // Symbol
//   "k": {
//     "t": 1638747660000, // Kline start time
//     "T": 1638747719999, // Kline close time
//     "s": "BTCUSDT",  // Symbol
//     "i": "1m",      // Interval
//     "f": 100,       // First trade ID
//     "L": 200,       // Last trade ID
//     "o": "0.0010",  // Open price
//     "c": "0.0020",  // Close price
//     "h": "0.0025",  // High price
//     "l": "0.0015",  // Low price
//     "v": "1000",    // Base asset volume
//     "n": 100,       // Number of trades
//     "x": false,     // Is this kline closed?
//     "q": "1.0000",  // Quote asset volume
//     "V": "500",     // Taker buy base asset volume
//     "Q": "0.500",   // Taker buy quote asset volume
//     "B": "123456"   // Ignore
//   }
// }
// close websocket stream
// setTimeout(() => websocketStreamClient.disconnect(), 6000)s
