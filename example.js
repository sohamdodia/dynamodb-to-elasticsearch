const d2es = require('dynamo-to-elasticsearch'),
  table = 'table',
  region = 'region',
  es_endpoint = 'es_endpoint_value',
  es_data = { id: 'url', type: 'datatype', indiceName: 'candidates' };

exports.handler = function (event, context, callback) {
  d2es.exec(table, region, es_endpoint, es_data, (err, success) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, success);
    }
  });
}
