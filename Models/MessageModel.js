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
// var mongoosastic = require('mongoosastic');
// define the schema for storing Message data
var MessageSchema = mongoose.Schema({
    message_id: { type: String, required: true },
    message: {
        text: {type : String },
        message_timestamp: { type: Date, default: Date.now } ,
        sentBy: { type: Schema.Types.ObjectId, ref: 'User' , required : true},
        Probable_Tags: {type : [String],default: undefined},
        gif: String,
        dynamicForm : {type : Schema.Types.Mixed},
        userType: {type : String ,required : true }
    }
});
MessageSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.message.message_timestamp)
        this.message.message_timestamp = currentDate;
    next();
});
// MessageSchema.plugin(mongoosastic);
//  //MessageSchema.index({'message.text' : 'text' , 'message.sentBy' : 'text'});
// //MessageSchema.index({ '$**': 'text' });
var messageObject = mongoose.model('Message', MessageSchema);
module.exports.messageObject = messageObject;
