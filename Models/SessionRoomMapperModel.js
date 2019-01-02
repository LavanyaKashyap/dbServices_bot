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
var RoomSessionMapperSchema = mongoose.Schema({
    Container_id : {type : Schema.Types.ObjectId , ref : 'ConversationContainer'},
    sessions : {type : Schema.Types.ObjectId , ref : 'Session', required: true}
});

var RoomSessionMapperObject = mongoose.model('RoomSessionMapper', RoomSessionMapperSchema);
module.exports.RoomSessionMapperObject = RoomSessionMapperObject;
