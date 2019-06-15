const mongoose = require('mongoose');
var arangojs = require('arangojs');
require('./user.model');

// Connection to ArangoDB
db = new arangojs.Database({
    url: `http://${process.env.arangohost}:${process.env.arangoport}`,
    databaseName: process.env.arangodatabasename
});
db.useDatabase(process.env.arangodatabasename);
module.exports = db.useBasicAuth(process.env.arangousername, process.env.arangopassword);

