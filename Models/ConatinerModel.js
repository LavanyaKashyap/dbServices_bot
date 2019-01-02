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
// define the schema for storing Container data
var ContainerSchema = mongoose.Schema({
    Container_id: {type : String , required : true},
    Container_name: {type : String , required : true},
    createdOn : {type : Date, default: Date.now},
     user: {type : Schema.Types.ObjectId , ref : 'User', required: true}
});


ContainerSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdOn)
        this.createdOn = currentDate;
    next();
});
var containerInfoObject = mongoose.model('ConversationContainer', ContainerSchema);
module.exports.containerInfoObject = containerInfoObject;