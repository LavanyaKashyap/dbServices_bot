/**
 * This file contains the functionality to store the agent data into mongodb(agent model).
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
var constant = require("../routes/constants");
var util = require("../routes/utility");
var AgentModel = require("../Models/AgentModel");
var sessionRoute = require("../routes/SessionRoute");
var roomSessionMapper = require("../Models/SessionRoomMapperModel");
var UserModel = require("../routes/UserRoute");

/**
 * This function is used to post agent Details
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
function postAgentDetails(request, response) {
    ///THIS SERVICE IS HIT ALWAYS WHEN THE USER LOGS IN
    console.log('INSIDE postAgentDetails');
    var outputJson = {};
    var agent = AgentModel.AgentObj;
    try {
        var requestBody = request.body;
        console.log('************************');
        console.log(requestBody);
        console.log('************************');
        var AgentObj = new AgentModel.AgentObj(requestBody);
        console.log(AgentObj);
        if (requestBody.userName === null || requestBody.userName === undefined || requestBody.userName === "") {
            return response.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.skill === null || requestBody.skill === undefined || requestBody.skill === "") {
            return response.status(constant.BadRequest).send(util.invalidData);
        }
        var username = (requestBody.userName).toUpperCase();
        console.log('******************************************************************');
        console.log(username);
        console.log('******************************************************************');
        util.duplicaterecordsExists({ agent_username: username }, agent, function (isduplicate) {

            if (isduplicate === 'false') { //record doesnot exists
                console.log('IT IS FALSE ###########################');
                console.log('ASSIGN THE DATE to last_available_at: ' + Date.now);
                // AgentObj.last_UpdateStatus_at = Date.now();

                UserModel.postAgentAsUser(username, function (err, storedagent) { //first post the agent as user also
                    console.log('POSTING THE AGENT AS USER');
                    if (err) {
                        console.log('ERROR WHILE STORING AGENT AS USER');
                        outputJson.message = err;
                        return response.status(constant.InternalServerError).send(outputJson);
                    } else {
                        console.log('STORED USER IS ');
                        console.log('***********************');
                        console.log(storedagent);
                        console.log('***********************s');
                        AgentObj.name = storedagent.name;
                        AgentObj.agent_username = storedagent.user_name;
                        AgentObj.emp_id = storedagent.emp_id;
                        AgentObj.agent_email = storedagent.user_email;
                        console.log('AGENT TO BE CREATED IS ::');
                        console.log(AgentObj);
                        AgentObj.save(function(err, savedAgent) {
                            if (err) {
                                // util.error.message = err.message;
                                outputJson = Object.assign({ ErrorCode: err.message }, util.error);
                                return response.status(constant.InternalServerError).send(outputJson);
                            } else {
                                return response.status(constant.OK).send(util.successfullyInserted);
                            }
                        });
                        // outputJson.message = 'NEW AGENT CREATED FOR THE SKILL ::: ' + requestBody.skill;
                        // return response.status(constant.OK).send(outputJson);
                    }
                });

            } else if (isduplicate === 'true') {
                console.log('THIS IS A DUPLICATE RECORD'); //case of changing the status of the agent and updating time for last update
                // agent.findOneAndUpdate({ emp_id: requestBody.emp_id }, { $set: { status: requestBody.status, last_UpdateStatus_at: Date.now() } }, { new: true }, function(errupdate, updatedObj) {
                //     if (errupdate) {
                //         console.log('ERROR EXISTS' + errupdate);
                //         outputJson.message = errupdate;
                //         return response.status(constant.InternalServerError).send(outputJson);
                //     } else {
                //         console.log('UPDATED THE STATUS....AND SENDING RESPONSE');
                //         console.log(updatedObj);
                //         return response.status(constant.OK).send(util.successfullyUpdated);
                //     }
                // });
                outputJson.message = 'THE AGENT GIVWEN ALREADY EXISTS.HENCE NO RECORD INSERTED';
                return response.status(constant.OK).send(outputJson);

            } else {
                console.log('ERROR ');
                return response.status(constant.InternalServerError).send(util.error);
            }

        });
    } catch (error) {
        console.log("ERROR IN CATCH OF postAgentDetails:::: " + error);
        //util.error.message = error;
        outputJson.message = error;
        return response.status(constant.InternalServerError).send(outputJson);

    }
}
//SERVICE FOR SET STATUS OF THE AGENT AND IF THE STATUS IS BUSY THE SESSION IS ALSO MAPPED
/**
 * 
 * @param {HttpRequest} req
 * @param {HttpRsponse} res
 */
function setAgentStatus(req, res) {

    console.log('INSIDE SET AGENT STATUS');
    var agent = AgentModel.AgentObj;
    var requestBody = req.body;
    var outputJson = {};
    try {

        if (requestBody.emp_id === null || requestBody.emp_id === undefined || requestBody.emp_id === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.status === null || requestBody.status === undefined || requestBody.status === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        //session_id is not checked beacuse this service is used for multiple per
        util.duplicaterecordsExists({ emp_id: requestBody.emp_id }, agent, function (isduplicate, duplicaterecord) {
            if (isduplicate === 'true') {
                console.log('duplicate record exists isduplicate value is : ' + isduplicate);
                console.log('duplicate record is : ' + duplicaterecord);
                sessionRoute.getSessionInfoFromSessionId(requestBody.session_id, function (err, existingSession) {
                    console.log('ERROR IS : ' + err);
                    //console.log('existing Session Info' +existingSession);
                    if (err === null) {
                        console.log('existing session is :' + existingSession);
                        agent.update({ emp_id: duplicaterecord.emp_id }, {
                            status: requestBody.status,
                            last_UpdateStatus_at: Date.now(),
                            // "$addToSet": { "sessions": {"session" : existingSession._id , "ticketId" : requestBody.ticketId }}
                            "$addToSet": { "sessions": existingSession._id }
                        },
                            function (err, result) {

                                if (err) {
                                    console.log('Error is :');
                                    console.log(err);
                                    return res.status(constant.InternalServerError).send(util.error);
                                } else {
                                    console.log('Result is :');
                                    console.log(result);
                                    return res.status(constant.OK).send(util.successfullyUpdated);
                                }

                            });
                    } else {
                        console.log('SESSION DOESNOT EXIST IN setAgentStatus');

                        agent.update({ emp_id: duplicaterecord.emp_id }, { status: requestBody.status, last_UpdateStatus_at: Date.now() },
                            function (err, result) {

                                if (err) {
                                    console.log('Error is :');
                                    console.log(err);
                                    return res.status(constant.InternalServerError).send(util.error);
                                } else {
                                    console.log('Result is :');
                                    console.log(result);
                                    return res.status(constant.OK).send(util.successfullyUpdated);
                                }

                            });
                    }
                });

            } else if (isduplicate === 'false') {
                console.log('duplicate record exists isduplicate value is : ' + isduplicate);
                outputJson.message = "This agent doesnot exists";
                return res.status(constant.BadRequest).send(outputJson);

            } else {
                console.log('ERROR EXISTS');
                return res.status(constant.InternalServerError).send(util.error);
            }

        });

    } catch (error) {
        console.log('THE ERROR IS :' + error);
        return res.status(constant.InternalServerError).send(util.error);
    }
}
/**
 *SERVICE FOR GETTING AGENT BY STATUS 
 * @param {HttpRequest} req
 * @param {HttpRsponse} res
 */
var getAgentByStatus = function (req, res) {
    console.log('INSIDE getAgentByStatus');
    var jsonOutput = {};
    var agent = AgentModel.AgentObj;


    try {
        var requestBody = req.body;
        if (requestBody.status === null || requestBody.status === undefined || requestBody.status === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.skill === null || requestBody.skill === undefined || requestBody.skill === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }

        var query = agent.find({ status: requestBody.status, skill: requestBody.skill });

        query.find().sort({ last_UpdateStatus_at: 'ascending' }).exec(function (err, agentWithStatus) {
            console.log('AGENT WITH STATUS : ' + agentWithStatus);
            if (err) {
                console.log('ERROR :::' + err);
                jsonOutput.message = err;
                return res.status(constant.InternalServerError).send(jsonOutput);

            } else {
                //   if(agentWithStatus === null || agentWithStatus === undefined || agentWithStatus === "" ){
                if (agentWithStatus.length === 0) {
                    console.log('AGENT WITH THIS STATUS DOESNOT EXISTS');
                    jsonOutput.message = 'Agent with this status doesnot exists';
                    jsonOutput.status = constant.NotFound;
                    return res.status(constant.OK).send(jsonOutput);

                } else {
                    console.log(agentWithStatus);
                    //var random = Math.floor((Math.random() * agentWithStatus.length));
                    // console.log('RANDOM NUMBER IS : '+random);
                    // console.log('WE HAVE DETAILS OF THE AGENT ');
                    //jsonOutput.AgentInfo = agentWithStatus[random];
                    jsonOutput.AgentInfo = agentWithStatus[0];
                    jsonOutput.status = constant.OK;
                    return res.status(constant.OK).send(jsonOutput);
                }

            }


        });

    } catch (error) {
        console.log('THE ERROR IS : INSIDE CATCH ' + error);
        jsonOutput.message = "Error:  " + error;
        return res.status(constant.InternalServerError).send(jsonOutput);
    }


};

/**
 *SERVICE FOR GETTING AGENTS DETAILS 
 * @param {HttpRequest} req
 * @param {HttpRsponse} res
 */
var getAgentDetails = function (req, res) {
    console.log('INSIDE getAgentDetails');
    var jsonOutput = {};
    var reqBody = req.body;
    var agent = AgentModel.AgentObj;
    try {
        if (reqBody.agent_id === null || reqBody.agent_id === undefined || reqBody.agent_id === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        console.log('INSIDE TRY');
        agent.findOne({ emp_id: reqBody.agent_id }, function (err, agent) {
            if (err) {
                console.log('ERROR IN GETAGENTDETAILS');
                jsonOutput.message = err;
                return res.status(constant.InternalServerError).send(jsonOutput);
            } else {
                console.log('DETAILS ARE : ' + agent);
                jsonOutput.agentDetails = agent;
                return res.status(constant.OK).send(jsonOutput);
            }
        });



    } catch (error) {
        console.log('THE ERROR IS :' + error);
        jsonOutput.message = error;
        return res.status(constant.InternalServerError).send(jsonOutput);
    }
};
/**
 *GETTING HISTORY FOR AGENT 
 * @param {HttpRequest} req
 * @param {HttpRsponse} res
 */
var getHistoryForAgent = function (req, res) {
    console.log('INSIDE getHistoryForAgent');
    var outputJson = {};
    var agent = AgentModel.AgentObj;
    var roomsessionMapper = roomSessionMapper.RoomSessionMapperObject;
    try {
        var reqBody = req.body;

        if (reqBody.agent_id === null || reqBody.agent_id === undefined || reqBody.agent_id === '') {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (reqBody.lastRecordsShown === null || reqBody.lastRecordsShown === undefined || reqBody.lastRecordsShown === '') {
            return res.status(constant.BadRequest).send(util.invalidData);
        }

        console.log("AGENT ID IS :::" + reqBody.agent_id);

        // var query = agent.findById({emp_id :reqBody.agent_id}).populate()
        // agent.findOne({emp_id :reqBody.agent_id},function(error,agentDetails){
        var query = agent.findOne({emp_id: reqBody.agent_id }, 'emp_id sessions -_id').populate({
            path: 'sessions',
            select: 'session_id session_modified_Date -_id ',
            options: { sort: { '_id': -1 }, skip: reqBody.lastRecordsShown, limit: 8 },
            populate: {
                path: 'messages',
                select: 'message -_id',
                match: { 'message.userType': 'User' },
                populate: { path: 'message.sentBy', select: 'image_url name -_id' },
                options: { sort: { '_id': -1 }, limit: 1 }
            }
        });

        query.exec(function (error, agentDetails) {
            // console.log('THE NUMBER OF AGENTS DETAILS ARE ' + agentDetails.sessions.length);


            if (error) {
                console.log('ERROR : ' + error);
                outputJson.message = error;
                return res.status(constant.InternalServerError).send(outputJson);
            } else {
                console.log(agentDetails);
                if (agentDetails === null || agentDetails === undefined || agentDetails === '') {
                    console.log('Agent details is null');
                    outputJson.message = 'Agent details is null';
                    return res.status(constant.BadRequest).send(outputJson);

                } else {
                    console.log('###########################################');
                    // console.log(agentDetails.sessions[0].session_id);
                    //getImage of the user who chated with the agent
                    if (agentDetails.sessions.length > 0) {
                        console.log('Agent details are not null' + agentDetails);
                        //agentDetails.lastCount = reqBody.lastRecordsShown+agentDetails.sessions.length;
                        outputJson.agentDetails = agentDetails;
                        outputJson.lastCount = reqBody.lastRecordsShown + agentDetails.sessions.length;
                        return res.status(constant.OK).send(outputJson);
                    } else {
                        console.log('NO SESSION BELONGS NOW');
                        outputJson.message = 'No sessions exists';
                        outputJson.status = constant.NotFound;
                        return res.status(constant.OK).send(outputJson);
                    }

                }
            }

        });


    } catch (error) {
        console.log('THERE IS A ERROR IN CATCH ' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);


    }

};

/*internal function only in case when status of the agent
 needs to be changed to offline , online or pending(Only for case when no session id needs to be mapped)*/
/**
 *
 * @param {JsonObject} req
 * @param {function} callback
 */
var setAgentStats = function (req, callback) {
    console.log('INSIDE setAgentStats');
    var agent = AgentModel.AgentObj;
    var outputJson = {};

    agent.update({ emp_id: req.emp_id }, { status: req.status, last_UpdateStatus_at: Date.now() }, function (err, changedStatusDoc) {
        if (err) {
            console.log('ERROR IN THE UPDATING STATUS' + err);
            callback(err, null);
        } else {
            console.log('NOT PROBLEM IN UPDATING STATUS');
            outputJson.message = 'Agent Status Updated';
            callback(null, outputJson);

        }
    });

};

var getVerifiedAgents = function (req, res) {
    console.log('INSIDE getVerifiedAgents');
    var outputJson = {};
    var agent = AgentModel.AgentObj;

    try {
        var reqBody = req.body;
        util.validateParams(res, reqBody, function (flag) {
            console.log('FLAG VALUE IS :::' + flag);
            var username = (reqBody.username).toUpperCase();
            var query = agent.findOne({ agent_username: username });

            query.exec(function (err, agentObj) {
                if (err) {
                    console.log('THE ERROR IS :::' + err);
                    outputJson.message = err;
                    return res.status(util.InternalServerError).send(outputJson);
                } else {
                    console.log('inside else');
                    if (agentObj === null || agentObj === undefined || agentObj === '') {
                        console.log('NO AGENT AVAILABLE');
                        outputJson.message = 'GIVEN AGENT IS NOT PRESENT';
                        outputJson.status = constant.ServiceOK;
                        return res.status(constant.OK).send(outputJson);
                    } else {
                        console.log('AGENT IS AVAILABLE');
                        outputJson.message = 'AGENT IS PRESENT ';
                        outputJson.status = constant.OK;
                        return res.status(constant.OK).send(outputJson);

                    }
                }
            });

        }, 'username');

    } catch (err) {
        console.log('ERROR IN CATCH ...' + err);
        outputJson.message = err;
        return res.status(util.InternalServerError).send(outputJson);
    }
}



module.exports.postAgentDetails = postAgentDetails;
module.exports.setAgentStatus = setAgentStatus;
module.exports.getAgentByStatus = getAgentByStatus;
module.exports.getAgentDetails = getAgentDetails;
module.exports.getHistoryForAgent = getHistoryForAgent;
module.exports.setAgentStats = setAgentStats;
module.exports.getVerifiedAgents = getVerifiedAgents;