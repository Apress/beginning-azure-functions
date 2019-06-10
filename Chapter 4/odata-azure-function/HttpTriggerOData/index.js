var azureOdata = require('azure-odata-sql');
var async = require('async');

var tableConfig = {
    name: 'Customer',
    schema: 'SalesLT',
    flavor: 'mssql',
};

var defaultPageSize = 30;

module.exports = function(context, req) {
    var module = require('./functions');
    var pageSizeToUse = req.query !== null && req.query.$pageSize !== null && typeof req.query.$pageSize !== "undefined" ? req.query.$pageSize : defaultPageSize
    var getSqlResult = module.getSqlResult;
    var query = {
        table: 'Customer',
        filters: req.query !== null && req.query.$filter !== null && typeof req.query.$filter !== "undefined" ? req.query.$filter : '',
        inlineCount: "allpages",
        resultLimit: pageSizeToUse,
        skip: req.query !== null && req.query.$page !== null && typeof req.query.$page !== "undefined" ? pageSizeToUse * (req.query.$page -1): '',
        take: pageSizeToUse,
        selections: req.query !== null && req.query.$select !== null && typeof req.query.$select !== "undefined" ? req.query.$select : '',
        ordering: req.query !== null && req.query.$orderby !== null && typeof req.query.$orderby !== "undefined" ? req.query.$orderby : 'CustomerID',
    };

    var statement = azureOdata.format(query, tableConfig);
    var calls = [];
    var data = [];
    async.series([
        function (callback) {
            getSqlResult(statement[0], (err, result) => {
                if (err)
                    throw err;

                data.push(result);
                callback(err, result);
            });
        },
        function (callback) {
            getSqlResult(statement[1], (err, result) => {
                if (err)
                    throw err;

                data.push(result);
                callback(err, result);
            });
        }
    ],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                var count = result[0].length;
                context.res = {
                    status: 200,
                    body: {
                    // '@odata.context': req.protocol + '://' + req.get('host') + '/api/$metadata#Product',
                    'value': result[0],
                    'total': result[1][0].count,
                    'count': count,
                    'page': req.query !== null && req.query.$page !== null ? req.query.$page : 1
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
            }

            context.done();
        });
}