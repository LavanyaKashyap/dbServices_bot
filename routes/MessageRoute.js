
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

var MessageModel = require('../Models/MessageModel');
var userRoute = require('../routes/UserRoute');
var constant = require('../routes/constants');
var util = require('../routes/utility');
var roomSessionMapperModel = require('../Models/SessionRoomMapperModel');

var createMessage = function (messageObject, callback) {

    console.log('CREATE MESSAGE : HENCE THE MESSAGE OBJECT IS');
    if (messageObject.sentBy === '' || messageObject.sentBy === undefined || messageObject.sentBy === null) {
        callback('Please specify the user who has sent the message', null);
    }
    userRoute.getUserObjectFromUserMail(messageObject.sentBy, function (errToFetchUser, userObj) {

        if (errToFetchUser) {
            console.log('ERROR WHILE STORING THE MESSAGE ');
            callback(errToFetchUser, null);
        } else {
            messageObject.sentBy = userObj;
            console.log(messageObject);
            var messageInfo = {
                message_id: Math.random(),
                message: messageObject

            };//create the object to be stored
            var message = MessageModel.messageObject(messageInfo); //convert to model

            //save Message
            message.save(function (err, savedMessage) {

                if (err) {
                    console.log('ERROR WHILE STORING THE MESSAGE');
                    callback(err, null);
                } else {
                    console.log('NO ERROR WHILE STORING MESSAGE');
                    console.log('SENDING ......');
                    console.log(savedMessage);
                    callback(null, savedMessage);
                }

            });
        }


    });


};

var getMessageDetailsFromMessageObjectId = function (message_ob_id, callback) {
    console.log('INSIDE GETMESSAGE DETAILS  getMessageDetailsFromMessageObjectId');
    var message = MessageModel.messageObject;

    message.findById({ _id: message_ob_id }, function (err, messageDetails) {
        if (err) {
            console.log('ERROR WHILE GETTING DETAILS OF THE MESSAGE' + err);
            callback(err, null);
        } else {
            console.log('NOT ERROR WHILE GETTING DETAILS OF THE MESSAGE' + messageDetails);
            callback(null, messageDetails);
        }
    });

};

var getAllMessagesFromContainer = function (req, res) {
    console.log(' inside getAllMessagesFromContainer ');
    var outputJson = {};
    var roomSessionMapper = roomSessionMapperModel.RoomSessionMapperObject;
    try {
        var reqBody = req.body;
        var limit = 2; //give 2 sessions at a time
        util.validateParams(res, reqBody, function (flag) {
            var query = roomSessionMapper.find({ Container_id: reqBody.container }).select('sessions -_id').skip(reqBody.lastRecordsShown).limit(limit);
            // var query = roomSessionMapper.find({Container_id: reqBody.container }).select('sessions -_id');

            // query.exec(function (error, mappedSession) {

            query.populate({
                path: 'sessions', select: 'messages -_id',
                populate: {
                    path: 'messages', select: 'message.text message.sentBy message.userType-_id',
                    populate: { path: 'message.sentBy', select: 'user_name -_id'}
                }
            }).exec(function (error, mappedSession) {

                if (error) {
                    console.log('ERROR WHILE FINDING SESSION IN getAllMessagesFromContainer' + error);
                    outputJson.message = error;
                    return res.status(constant.InternalServerError).send(outputJson);
                } else {

                    console.log('INFORMATION ON mappedSession');
                    console.log(mappedSession);
                    if(mappedSession.length <= 0){
                        outputJson.message = 'No more sessions are available';
                        return res.status(constant.OK).send(outputJson);
                    }else{
                        outputJson.sessionInfo = mappedSession;
                        outputJson.previousCount = (reqBody.lastRecordsShown) - limit;
                        outputJson.lastRecordsShown = reqBody.lastRecordsShown + mappedSession.length;
                        return res.status(constant.OK).send(outputJson);
                    } 
                }
            });
        }, 'container', 'lastRecordsShown');
    } catch (err) {
        console.log('ERROR In CATCH  : ' + err);
        return res.status(constant.InternalServerError).send(err);


    }
};

module.exports.createMessage = createMessage;
module.exports.getMessageDetailsFromMessageObjectId = getMessageDetailsFromMessageObjectId;
module.exports.getAllMessagesFromContainer = getAllMessagesFromContainer;
