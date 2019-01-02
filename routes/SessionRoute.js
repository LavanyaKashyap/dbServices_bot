
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
"use strict";
//coremodules
//npm modules 
//others
var util = require('../routes/utility');
var constant = require('./constants');
var sessionModel = require('../Models/SessionModel');
// var messageRoute = require('./MessageRoute');
// var sessionRoomMapper = require('../routes/RoomSessionMapper');
var getSessionInfoFromSessionId = function (session_id, callback) {
    console.log('GET SESSION FROM SESSION ID');
    var sessions = sessionModel.SessionObject;

    util.duplicaterecordsExists({ session_id: session_id }, sessions,
        function (isduplicate, existingSession) {
            console.log('isduplicate' + isduplicate);
            console.log('existing session' + existingSession);
            if (isduplicate === "true") {
                console.log('SESSION ALREADY EXISTS');
                callback(null, existingSession);
            } else if (isduplicate === "false") {
                console.log('SESSION DOESNOT EXISTS');
                callback('session Doesnot exists', null);
            } else {
                console.log('GOT A ERROR FROM GET DUPLICATE RECORDS FOR GET SESSION ID');
                callback('Error to fetch duplicate records for session', null);
            }
        });



};


var createSession = function (sessionInfo, callback) {  //{session_id : '123' , message_obj_id : '1425}
    console.log('INSIDE CREATE SESSION ');
    console.log('SESSION INFO IS ::::');
    console.log(sessionInfo);
    var session = sessionModel.SessionObject(sessionInfo);
    //save session info
    session.save(function (err, savedSession) {
        console.log('ERROR IS WHILE SAVING SESSION INFO' + err);
        console.log('SAVING SESSION INFO' + savedSession);
        if (err) {
            console.log('ERROR WHILE STORING THE SESSION INFO');
            callback(err, null);
        } else {
            console.log('NO ERROR WHILE STORING session');
            console.log('SENDING ......');
            console.log(savedSession);
            callback(null, savedSession);
        }
    });
};


var UpdateSession = function (sessionInfo, callback) {      //{session_obj : '123' , message_Obj_id : '234' , timestamp : 'date}
    console.log('INSIDE UPDATE SESSION');
    console.log(sessionInfo);
    var session = sessionModel.SessionObject;
    //     //save session info

    session.update({ session_id: sessionInfo.session_id }, {
        "$push": { "messages": sessionInfo.message_Obj_id },
         session_modified_Date: Date.now()
    },
        function (err, updatedSession) {
            if (err) {
                console.log('INSIDE ERROR WHILE STORING SESSION DETAILS');
                callback(err, null);
            } else {
                console.log('INSIDE result FOR SESSION ');
                console.log(updatedSession);
                callback(null, updatedSession);

            }

        });

};

var getSessionFromSessionId = function (req, res) {
    console.log('GET SESSION FOR getSessionSessionObjectId');
    console.log(req.body);
    var session = sessionModel.SessionObject;
    var outputJson = {};
    try {

        if (req.body.session_id === null || req.body.session_id === undefined || req.body.session_id === '') {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        console.log('REQUEST IS OKAY FOR GETTING SESSION');


        session.findOne({ session_id: req.body.session_id } ,
             ' session_id messages session_created_Date session_modified_Date -_id')
             .populate({path : 'messages' , select : 'message -_id' , 
             populate: { path: 'message.sentBy' , select : 'name user_email image_url -_id'}}).exec(function (err, sessionInfo) {
            console.log('ERROR IS :' + err);
            console.log('MESSAges are :' + sessionInfo);
            if (err) {
                console.log('ERROR WHILE GETTING THE SESSION' + err);
                outputJson.message = err;
                return res.status(constant.InternalServerError).send(outputJson);
            } else {
                if (sessionInfo === undefined || sessionInfo === null || sessionInfo === "") {
                    console.log('THE SESSION INFO IS EMPTY');
                    outputJson.message = 'No message exists for this session';
                    return res.status(constant.OK).send(outputJson);
                } else {
                            return res.status(constant.OK).send(sessionInfo);

                }
            }
        });


    } catch (error) {
        console.log('THERE IS A ERROR IN CATCH' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }
};

var doesSessionExists = function (req, res) {
    console.log('session exists');
    var outputJson = {};
    var session = sessionModel.SessionObject;

    try {
        if (req.body.session_id === null || req.body.session_id === undefined || req.body.session_id === '') {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        util.duplicaterecordsExists({ session_id: req.body.session_id }, session, function (isduplicate) {
            if (isduplicate === "true") {
                console.log('ISDUPLCATE VALUE TRUE :  ' + isduplicate);
                outputJson.message = 'This session Id exists';
                return res.status(constant.Accepted).send(outputJson);

            } else if (isduplicate === "false") {
                console.log('ISDUPLCATE VALUE FALSE :  ' + isduplicate);
                outputJson.message = 'This session Id doesnot already exists';
                return res.status(constant.OK).send(outputJson);

            } else {
                console.log('ISDUPLICAte VALUE IS : ' + isduplicate);
                outputJson.message = 'Internal server error';
                return res.status(constant.InternalServerError).send(outputJson);
            }

        });


    } catch (error) {
        console.log('THERE IS A ERROR IN CATCH' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }

};

module.exports.getSessionInfoFromSessionId = getSessionInfoFromSessionId;
module.exports.createSession = createSession;
module.exports.UpdateSession = UpdateSession;
module.exports.doesSessionExists = doesSessionExists;
module.exports.getSessionFromSessionId = getSessionFromSessionId;

