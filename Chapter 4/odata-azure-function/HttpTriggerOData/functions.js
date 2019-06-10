// TEDIOUS
var ConnectionPool = require('tedious-connection-pool');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Pool Connection Config
var poolConfig = {
    min: 1,
    max: 10,
    log: true
};

//Connection Config
var config = {
    userName: process.env.databaseUser,
    password: process.env.databasePassword,
    server: process.env.databaseUrl,
    options: {
        database: process.env.databaseName,
        encrypt: true,
        requestTimeout: 0,
    }
};

//create the pool
var pool = new ConnectionPool(poolConfig, config);

pool.on('error', function (err) {
    console.error(err);
});

function getSqlResult(sqlObject, callback) {
    var result = []
    pool.acquire(function (err, connection) {
        if (err) {
            callback(err, null);
        }

        var request = new Request(sqlObject.sql, function (err, data) {
            if (err) {
                callback(err, null);
            }

            console.log(data);
            connection.release();
            callback(null, result);
        });

        sqlObject.parameters.forEach(element => {
            request.addParameter(`${element.name}`, TYPES.NVarChar, `${element.value}`);
        });

        request.on('row', (columns) => {
            var rowdata = new Object();
            columns.forEach((column) => {
                rowdata[column.metadata.colName] = column.value;
            });

            result.push(rowdata);
        });

        connection.execSql(request);
    });
}

module.exports = {
    getSqlResult: getSqlResult,
}