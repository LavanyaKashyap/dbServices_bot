/*global
alert, confirm, console, prompt,require, module,const
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//coremodules npm modules
var mongoose = require('mongoose');
// define the schema for storing Bot data
var dumpSchema = mongoose.Schema({
    question: { type: String },
    intent: { type: String },
    score: { type: String },
    userName: { type: String },
    capability: { type: String },
    flag: { type: String, default: 'DEFAULT_STORAGE' },
    submittedOn: { type: String, default: Date.now }
});

var dumpDataObject = mongoose.model('dump', dumpSchema);
module.exports.dumpObject = dumpDataObject;