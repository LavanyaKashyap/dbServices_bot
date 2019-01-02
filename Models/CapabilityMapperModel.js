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
var Schema = mongoose.Schema;

// define the schema for storing Capability Mapper data
var CapabilityMapperSchemna = mongoose.Schema({
    engine_id: {type : Schema.Types.ObjectId , ref  : "IntelligenceEngine" , required : true},
    capability_id:  {type : String , required : true},
    capability_name : {type : String , required : true},
    bot : {type : Schema.Types.ObjectId , ref : 'BOT' , required : true},
    capability_group_emailid : {type : String , required : true},
    // capability_Discussion : {type : String },
    capability_text : {type : String, required : true}

    
});
var CapabilityObj = mongoose.model('Capability', CapabilityMapperSchemna);
module.exports.CapabilityObj = CapabilityObj;