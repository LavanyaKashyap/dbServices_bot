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
//others---------------------require files
var util = require('../routes/utility');
var ContainerModel = require('../Models/ConatinerModel');
var constant = require('../routes/constants');
var messageRoute = require('../routes/MessageRoute');
var sessionRoute = require('../routes/SessionRoute');
var sessionRoomMapper = require('../routes/RoomSessionMapper');

/**
 * This function is used to establish the connection with db and post convo 
 * @param {HttpRequest} req
 * @param {HttpRsponse} res

 **/
var postConvo = function (req, res) {

    console.log('INSIDE POST CONVO');
    console.log('THE REQUEST OF postConvo IS ');
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(req.body);
    var container = ContainerModel.containerInfoObject;
    var outputJson = {};


    try {

        if (req.body.room_id === null || req.body.room_id === undefined || req.body.room_id === '') {
            return res.status(constant.BadRequest).send({ message: "Please provide a vaild room id" });
        }
        if (req.body.sessionId === null || req.body.sessionId === undefined || req.body.sessionId === '') {
            return res.status(constant.BadRequest).send({ message: "Please provide a vaild sessionId" });
        }
        if (req.body.message === null || req.body.message === undefined || req.body.message === '') {
            return res.status(constant.BadRequest).send({ message: "Please provide a vaild message block" });
        }
        // if (req.body.message.text === null || req.body.message.text === undefined || req.body.message.text === '') {
        //     return res.status(constant.BadRequest).send({ message: "Please provide text of the message" });
        // }
        if (req.body.message.sentBy === null || req.body.message.sentBy === undefined || req.body.message.sentBy === '') {
            return res.status(constant.BadRequest).send({ message: "Please provide a vaild sentBy" });
        }
        if (req.body.message.userType === null || req.body.message.userType === undefined || req.body.message.userType === '') {
            return res.status(constant.BadRequest).send({ message: "Please provide a vaild usertype" });
        }
        var container_id = req.body.room_id;
        var session_id = req.body.sessionId;


        console.log('SESSION ID IS : ' + session_id);

        util.duplicaterecordsExists({ Container_id: container_id }, container,
            function (isduplicateRecord, duplicateRecord) {
                console.log('VALUES OF IS DUPLICATE RECORD');
                console.log(isduplicateRecord);


                // try {
                if (isduplicateRecord === 'true') {

                    messageRoute.createMessage(req.body.message, function (errCreateMessage, createdMessage) {
                        if (!errCreateMessage) {
                            console.log('MESSAGE IS CREATED');
                            sessionRoute.getSessionInfoFromSessionId(session_id, function (err, existingSession) {
                                console.log('err' + err);
                                console.log('existingsession' + existingSession);
                                if (existingSession === null) { //new sessions
                                    console.log('NEW SESSIONSSSSS');
                                    //creating a new session
                                    console.log("SESSION IS : " + session_id);
                                    sessionRoute.createSession({ session_id: session_id, messages: createdMessage._id },
                                        function (err, createdSession) {
                                            if (!err) { //no error while creating session
                                                console.log('SUCCESSFULLY CREATED A SESSION ,AND DETAILS ARE');
                                                console.log('NOW GOING TO MAP SESSION WITH ROOM');
                                                //create a room and session mapper
                                                sessionRoomMapper.createMapperRoomSession({
                                                    container_obj_id: duplicateRecord._id,
                                                    session_obj_id: createdSession._id
                                                }, function (errCreateMapper, savedRoomSessionMapper) {
                                                    if (errCreateMapper) {
                                                        console.log('ERROR WHILE CREATING MAPPER');
                                                        outputJson.message = errCreateMapper;
                                                        return res.status(constant.InternalServerError).send(outputJson);
                                                    } else {
                                                        console.log('NO ERROR WHILE CREATING MAPPER');
                                                        console.log('sending response');
                                                        return res.status(constant.OK).send(util.successfullyInserted);
                                                    }
                                                });
                                            } else { // error while creating session
                                                console.log('ISSUES WHILE CREATING SESSION. try again later');
                                                outputJson.message = err;
                                                return res.status(constant.InternalServerError).send(outputJson);
                                            }
                                        });
                                } else { //old sessions


                                    console.log('Old SESSIONSSSSS');
                                    sessionRoute.UpdateSession({
                                        session_id: existingSession.session_id,
                                        message_Obj_id: createdMessage._id
                                    }, function (errUpdateSession, updatedSession) {
                                        if (errUpdateSession) {
                                            console.log('ERROR WHILE UPDATING SESSION');
                                            outputJson.message = errUpdateSession;
                                            return res.status(constant.InternalServerError).send(outputJson);

                                        } else {
                                            console.log('NOT ERROR EHILE UPDATING SESSION');
                                            console.log(updatedSession);
                                            return res.status(constant.OK).send(util.successfullyUpdated);
                                        }
                                    });

                                }
                            });
                        } else {
                            console.log('MESSAGE IS NOT CREATED');
                            console.log('WAS A ERROR WHILE CREATING MESSAGE: ' + errCreateMessage);
                            outputJson.message = errCreateMessage;
                            return res.status(constant.InternalServerError).send(outputJson);
                        }
                    });

                } else {
                    outputJson.message = 'Room Desnot exits';
                    return res.status(constant.BadRequest).send(outputJson);
                }
                // } catch (error) {
                //     console.log("INSIDE CATCH OF CONVO.JS...");
                //     console.log(error);
                // }

            });
    } catch (error) {
        console.log('ERROR IN CATCH : ' + error);
        outputJson.message = error;
        return res.status(constant.BadRequest).send(outputJson);
    }




};

module.exports.postConvo = postConvo;