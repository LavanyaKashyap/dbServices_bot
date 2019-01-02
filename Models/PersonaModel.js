"use strict";

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

var mongoose = require('mongoose');

var personaSchema = mongoose.Schema({
    p_Id: { type: String,required: true,unique: true},
    location: { type: String,required: true },
    grade: { type: String,required: true },
    age: { type: String,required: true },
    gender: { type: String,required: true },
});

var personaObj = mongoose.model("persona", personaSchema);
module.exports.personaObj = personaObj;