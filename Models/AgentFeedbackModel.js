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

var Schema = mongoose.Schema;
var AgentFeedbackSchema = mongoose.Schema({
   agent : {type : Schema.Types.ObjectId , ref : 'Agent', required : true},
   feedbackScore : {type : Number , required : true},
   timeStamp : {type : Date, default: Date.now} ,
   feedback_reason : {type : String},
   skill_of_agent : {type : String , required : true},
   location_of_user : {type : String}
});

var AgentFeedbackObj = mongoose.model('AgentFeedback', AgentFeedbackSchema);
module.exports.AgentFeedbackObj = AgentFeedbackObj;
