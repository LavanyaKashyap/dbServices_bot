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

// define the schema for storing Agent data
var AgentSchema = mongoose.Schema({
    emp_id: { type: String, required: true },
    agent_email: { type: String, required: true },
    agent_username: { type: String, required: true },
    name: { type: String, required: true },
    status: {
        type: String,
        enum: ['Available', 'Busy', 'Pending', 'Offline'],
        default: "Offline",
        description: "can only be one of the enum values and is required"
    },
    // room_id: { type: String },
    // sessions :[{ticketId : String , session : {type : Schema.Types.ObjectId , ref : 'Session'}}]
    sessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    skill: { type: String, required: true },
    last_UpdateStatus_at: { type: Date }
});

var AgentObj = mongoose.model('Agent', AgentSchema);
module.exports.AgentObj = AgentObj;