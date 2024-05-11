const BigQuery = require('@google-cloud/bigquery');

const handleError = (err) => {
  if (err && err.name === 'PartialFailureError') {
    if (err.errors && err.errors.length > 0) {
      console.log('Insert errors:');
      err.errors.forEach(error => console.error(error));
    }
  } else {
    console.error('ERROR:', err);
  }
};

module.exports = {
  createTable: ({ client: bigquery, datasetId, tableId, schema }) => {
    const options = { schema };

    return new Promise((resolve, reject) => {
      resolve();
      bigquery
        .dataset(datasetId)
        .createTable(tableId, options)
        .then(results => resolve(results[0]))
        .catch(err => {
          handleError(err);
          reject(err);
        });
    });
  },

  deleteTable: ({ client: bigquery, datasetId, tableId }) => {
    return new Promise((resolve, reject) => {
      bigquery.dataset(datasetId).table(tableId).exists()
        .then(
          exists => {
            if (exists[0]) {
              bigquery.dataset(datasetId).table(tableId).delete()
                .then(result => resolve(result));
            } else {
              resolve('The table does not exists');
            }
          }
        )
        .catch(err => {
          handleError(err);
          reject(err);
        });
    });
  }

};