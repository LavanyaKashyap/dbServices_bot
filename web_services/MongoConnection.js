/**
 * This file contains the functionality to store the conversational data into mongodb.
 */
/*global
alert, confirm, console, prompt,require, module,const
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//coremodules
//npm modules 
var mongoose = require('mongoose');
//others
var config = require('../routes/config');

var options = {
    keepAlive: 1,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    reconnectTries: 100000,
    connectTimeoutMS: 30000
};
//Connect to Mongoose

var buildConnectionWithMongoDb = function() {
    console.log(config.mongoConnectionDev);
    mongoose.connect(config.mongoConnectionDev, options);

    mongoose.connection.on('connected', function() {
        console.log('Mongoose default connection ');
    });

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected');
    });
};


module.exports.buildConnectionWithMongoDb = buildConnectionWithMongoDb;