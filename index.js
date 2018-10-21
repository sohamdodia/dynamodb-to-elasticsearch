// dependencies
const AWS = require('aws-sdk'),
  _ = require('lodash'),
  elasticsearch = require('elasticsearch'),
  http_aws_es = require('http-aws-es'),
  when = require('when');

exports.exec = function (table, region, es_endpoint, es_data = { id: 'sortKey', type: 'datatype' }, callback) {
  if (!es_data.indiceName) throw new Error('You should provide es_data.indiceName')
  const docClient = new AWS.DynamoDB.DocumentClient({region: region})

  // Promise - Describe the ES Domain in order to get the endpoint url
  when.promise(function (resolve) {
    resolve({
      domain: {
        Endpoint: es_endpoint
      }
    });
  }).then(function (result) {
    // Promise - Create the Index if needed - resolve if it is already there
    // or create and then resolve

    let promise = when.promise(function (resolve, reject) {
      let myCredentials = new AWS.EnvironmentCredentials('AWS');

      let es = elasticsearch.Client({
        hosts: result.domain.Endpoint,
        connectionClass: http_aws_es,
        amazonES: {
          region: region,
          credentials: myCredentials
        }
      });

      es.indices.exists({ // check whether the indices exists or not
        index: es_data.indiceName
      }, function (err, response, status) {
        if (status == 200) { // if indices found
          resolve({es: es, domain: result.domain})
        } else if (status == 404) { // if not found
          createIndex(es, es_data, function () { // create indices
            resolve({es: es, domain: result.domain});
          })
        } else {
          reject(err);
        }
      });
    });
    return promise
  }).then(function (result) {
    let scanningParameter = {
      TableName: table
    };

    docClient.scan(scanningParameter, function (err, records) { // scanning database for getting all the records
      if (!err) {
        var recordsList = _.map(records.Items, function (record) { // for every record found
          return when.promise(function (resolve, reject) {
            recordExists(result.es, es_data, record).then(function (exists) { // check if record exists or not
              return putRecord(result.es, es_data, record, exists)
            }).then(function (record) {
              resolve(record)
            }, function (reason) {
              reject(reason)
            });
          });
        });
        // return a promise array of all records
      }
      return when.all(recordsList);
    })
  }).done(function (records) {
    callback(null, {
      status: true,
      message: 'Processed all records.'
    });
  }, function (reason) {
    callback(reason, null);
  });
};

const createIndex = function (es, es_data, callback) {
    es.indices.create({ // create indices
      index: es_data.indiceName
    }, function (err) {
      if (err) { // if err return
        callback(err);
      } else { // index created
        callback(null);
      }
    })
  },
  recordExists = function (es, es_data, record) { // check if record exists in elasticsearch
    return when.promise(function (resolve, reject) {
      es.get({
        index: es_data.indiceName,
        id: record[es_data.id], // this is the primaryKey of record in elasticsearch from which we can check weather the record is exists or not
        type: '_all'
      }, function (err, response, status) {
        if (status == 200) { // record exist
          resolve(true);
        } else if (status == 404) { // record not exist
          resolve(false);
        } else { // something went wrong
          reject(err);
        }
      })
    })
  },
  putRecord = function (es, es_data, record, exists) { // insert record in elasticsearch
    return when.promise(function (resolve, reject) {
      var params = {
        index: es_data.indiceName,
        id: record[es_data.id], // this will be primaryKey of record in elasticsearch
        body: record,
        type: es_data.type
      };

      const handler = function (err, response, status) {
        if (status == 200 || status == 201) {
          resolve(record)
        } else {
          reject(err)
        }
      }

      if (exists) { // if record exists in elasticsearch then update it
        params.body = {
          doc: record
        };
        es.update(params, handler)
      } else { // if not exists then insert it into elasticsearch
        params.body = record
        es.create(params, handler)
      }
    });
  };