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

var UserSchema = mongoose.Schema({
    emp_id: {type: String, required: true},
    user_name: {type: String, required: true, index: true},
    name: {type: String, required: true, index: true},
    user_email: {type: String, required: true},
    image_url: {type: String, required: true},
    country_key: {type: String},
    subarea: {type: String}
    // room_id : {type : String , required : true}
});
//UserSchema.index({'user_name' : 'text' , 'name' : 'text' , 'user_email' : 'text' ,'emp_id' : 'text' });
//  UserSchema.index({ _id: 1 }, { sparse: true });
//UserSchema.index({ '$**': 'text' });
var UserInfoObject = mongoose.model('User', UserSchema);
module.exports.UserInfoObject = UserInfoObject;