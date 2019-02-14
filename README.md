# DynamoDB-to-ElasticSearch

A NPM module that will dump all DynamoDB data to AWS ElasticSearch indices.

## What this does

There's no blueprint in AWS Lambda that allows to dump DynamoDB data into ElasticSearch. This module will facilitate exactly that.

---

## Installation

```sh
$ npm install dynamodb-to-elasticsearch
```

## [Guide to configure AWS to use this blueprint](https://aws.amazon.com/blogs/compute/indexing-amazon-dynamodb-content-with-amazon-elasticsearch-service-using-aws-lambda)

## Documentation

`module.exec (table, region, es_endpoint, es_data = { id: 'sortKey', type: 'datatype', indiceName: ''})`

| Parameter | Type | Description
| ------ | ------ | ------ |
| table | string | Table name of dynamoDB whose data you want to dump in elastic-search.
| indiceName | string | indice name of elastic-search on which you can perform query.
| region | string | dynamodb table region
| es_endpoint | string | elastic-search endpoint
| es_data | object |
| es_data.id | object | The name of `primaryKey` field for DynamoDB table. It should be unique identifier for documents. By default it is set to `sortKey`. 
| es_data.type | object | Name of class of objects, which document represents. By default it is set to `datatype`.
| es_data.indiceName | object | Index name of elastic-search on which you can perform query.

### Working locally

When working on a Dynamodb running on localhost, make sure the `IS_OFFLINE` environment varible is set to `true`.
The default port will be `8000` but it can be overriden by `LOCAL_DYNAMODB_PORT` environment variable.

## Example

```javascript
const d2es = require('dynamodb-to-elasticsearch');

const table = 'table',
  region = 'region',
  es_endpoint = 'es_endpoint_value',
  es_data = { id: 'sortKey', type: 'data', indiceName: 'candidates' }};

exports.handler = function(event, context, callback) {
  d2es.exec(table, region, es_endpoint, es_data, (err, success) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, success);
    }
  });
}

```

License
----
MIT
