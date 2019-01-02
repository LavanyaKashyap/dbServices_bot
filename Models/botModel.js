
"use strict";
var mongoose = require('mongoose');

// define the schema for storing Bot data
var BotSchema = mongoose.Schema({
    bot_name: {type : String , required : true},
    bot_access_token: {type : String , required : true},
    bot_status :{type : String , required : true},
    bot_email : {type : String , required : true}
});
var BotObject = mongoose.model('BOT', BotSchema);
module.exports.BotObject = BotObject;
