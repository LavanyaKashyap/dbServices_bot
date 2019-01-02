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
//others
var cacheModel = require('../Models/CacheModel');
var dialogflowRepoModel = require('../Models/DialogQuestionAnswerRepo');

/*
 * This function is used to update cache
 */
var updateCache = function() {
    console.log('CACHE IS HIT ' + Date.now());
    var dialogflowRepo = dialogflowRepoModel.dialogQuestionAnsObject;
    var cache = cacheModel.CacheObject;
    //drop the collection
    cache.remove({}, function(err) {
        console.log('collection removed');
    });
    dialogflowRepo.find({}, function(err, records) {
        if (err) {
            console.log('CANNOT PERFORM UPDATE');
        } else {
            console.log('records are ');
            console.log(records.length);
            //var arr = [{ answer: 'Star Wars' }, { answer: 'The Empire Strikes Back' }];
            cache.insertMany(records, function(errInsert, recordsInsert) {
                if (errInsert) {
                    console.log('ERROR INSERT:' + errInsert);
                } else {
                    console.log('RECORDS ARE' + recordsInsert);
                }
            });
        }
    });
};

module.exports.updateCache = updateCache;