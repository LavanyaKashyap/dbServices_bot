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
var SessionSchema = mongoose.Schema({
    session_id : { type: String, required: true },
    messages : [{type : Schema.Types.ObjectId , ref : 'Message'}],
    //messages : [{message_id : String}],
    session_created_Date : {type : Date , default : Date.now},
    session_modified_Date : {type : Date , default : Date.now}
});
SessionSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.session_created_Date)
        this.session_created_Date = currentDate;
    next();
});
//SessionSchema.index({'messages' : 'text' });
var SessionObject = mongoose.model('Session', SessionSchema);
module.exports.SessionObject = SessionObject;
