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

// define the schema for storing Intelligence data
var IntelligenceEngineSchema = mongoose.Schema({
    // engine_id: {type : String , required : true},
    engine_name: { type: String, required: true },
    engine_acc_token: { type: String, required: true },
    // engine_status : {type : String , required : true},
    Project_ids: { type: String },
    private_key: { type: String },
    engine_url: { base_url: String, query_url: String },
    engine_develop_token: { type: String },
    engine_emailId : { type: String }
});
var IntelligenceEngineObject = mongoose.model('IntelligenceEngine', IntelligenceEngineSchema);
module.exports.IntelligenceEngineObject = IntelligenceEngineObject;