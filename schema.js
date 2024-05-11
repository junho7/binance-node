exports.SchemaKline = [
  { name: "ticker", type: "STRING", mode: "REQUIRED", description: "Ticker" },
  {
    name: "starttime",
    type: "INTEGER",
    mode: "REQUIRED",
    description: "starttime unixtime",
  },
  { name: "o", type: "NUMERIC", mode: "REQUIRED", precision: "16", scale: "8" },
  { name: "h", type: "NUMERIC", mode: "REQUIRED", precision: "16", scale: "8" },
  { name: "l", type: "NUMERIC", mode: "REQUIRED", precision: "16", scale: "8" },
  { name: "c", type: "NUMERIC", mode: "REQUIRED", precision: "16", scale: "8" },
  { name: "v", type: "NUMERIC", mode: "REQUIRED", precision: "16", scale: "8" }
];