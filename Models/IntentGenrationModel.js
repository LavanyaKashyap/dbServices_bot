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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var intentGenrationSchema = mongoose.Schema({

    intent_id : {type : Schema.type.ObjectId , ref : 'dialogflow_question_answer_repo' , required : true },
    persona_id : {type : Schema.type.ObjectId , ref : 'persona' , required : true},

    approvedWorkFlow: [{ type: Schema.Types.ObjectId, ref: "WorkflowDetail", required: true }], //gif //sentense 
    isGifImage :{ type: Boolean,required: true, default: true },
    genration:{ type:String,required: true},
    pre_fix :{ type: String,required: true },
    post_fix :{ type:String,required: true }
});


var intentGenrationObj = mongoose.model("intentGenration", intentGenrationSchema);
module.exports.personaObj = intentGenrationObj;
