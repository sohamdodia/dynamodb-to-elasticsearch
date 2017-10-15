# DynamoDB-to-ElasticSearch

A NPM module that will dump all DynamoDB data to ElasticSearch indices.

## What this does

There's no blueprint in AWS Lambda that allows to dump DynamoDB data into ElasticSearch. This module will facilitate exactly that.

Module will take DynamoDB `sortKey` as the `primaryKey` of ElasticSearch indices.

---

### Installation

```sh
$ npm install dynamodb-to-elasticsearch
```

## [Guide to configure AWS to use this blueprint](https://aws.amazon.com/blogs/compute/indexing-amazon-dynamodb-content-with-amazon-elasticsearch-service-using-aws-lambda)

### Documentation

`module.exec (table, indiceName, region, es_domain, es_string)`

| Parameter | Type | Description
| ------ | ------ | ------ |
| table | string | Table name of dynamoDB whose data you want to dump in elastic-search.
| indiceName | string | indice name of elastic-search on which you can perform query.
| region | string | dynamodb table region
| es_domain | string | elastic-search domain name
| es_endpoint | string | elastic-search endpoint

### Example

```javascript
const d2es = require('dynamodb-to-elasticsearch');

const table = 'table',
	indiceName = 'indiceName',
	region = 'region',
	es_domain = 'es_domain_value',
	es_endpoint = 'es_endpoint_value';

exports.handler = function(event, context, callback) {
	d2es.exec(table, indiceName, region, es_domain, es_endpoint, (err, success) => {
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
