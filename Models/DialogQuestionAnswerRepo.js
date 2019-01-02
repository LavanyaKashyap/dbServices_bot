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

// define the schema for storing Answers data

var QuestionAnswerSchema = mongoose.Schema({

    question_id: { type: String, required: true, default: mongoose.Types.ObjectId },

    question: { type: String, text: true, required: true },

    answer: {type: Schema.Types.Mixed},

    intent_id: { type: String, required: true, default: mongoose.Types.ObjectId },

    intent: { type: String, required: true },

    capability: { type: String, required: true },

    workflow: [{ type: Schema.Types.ObjectId, ref: 'WorkflowDetail' , default: null}]

});


var dialogQuestionAnsObject = mongoose.model('dialogflow_question_answer_repo', QuestionAnswerSchema);

module.exports.dialogQuestionAnsObject = dialogQuestionAnsObject;