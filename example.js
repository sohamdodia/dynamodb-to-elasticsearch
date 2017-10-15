const d2es = require('dynamodb-to-elasticsearch')
	table = 'table',
	indiceName = 'indiceName',
	region = 'region',
	es_domain = 'es_domain_value',
	es_endpoint = 'es_endpoint_value'

exports.handler = function(event, context, callback) {
	d2es.exec(table, indiceName, region, es_domain, es_endpoint, (err, success) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, success);
		}
	});
}
