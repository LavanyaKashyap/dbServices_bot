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
// define the schema for storing Bot data
var DumpBacupkLogSchema = mongoose.Schema({
    // updatedOn : {type: Date , default: Date.now},
    // lastCount : {type: number , }
});

//SessionSchema.index({'messages' : 'text' });
var LogObject = mongoose.model('DumpBackuplog', DumpBacupkLogSchema);
module.exports.LogObject = LogObject;
