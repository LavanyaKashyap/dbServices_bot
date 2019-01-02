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
var constant = require('../routes/constants');
var util = require('../routes/utility');
var agentModel = require('../Models/AgentModel');
var agentFeedbackModel = require('../Models/AgentFeedbackModel');

/**
 * This function is used to post agent Feedback
 * @param {HttpRequest} req
 * @param {HttpRsponse} res
 */
var postagentFeedback = function(req,res){

    console.log('INSIDE postagentFeedback');
    console.log('THE REQUEST OF postagentFeedback IS ');
    console.log(req.body);
    var agent = agentModel.AgentObj;
    var jsonOutput = {};
    try{
        var reqBody = req.body;
        if(reqBody.agent === undefined || reqBody.agent === null ||reqBody.agent === ''){
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        util.duplicaterecordsExists({emp_id :reqBody.agent },agent,function(isduplicate , duplicateRecord){
            if(isduplicate === 'true'){ // the agent for which feedback is coming is present 
                console.log('THE AGENT FOR WHICH FEEDBACK IS COMING IS PRESENT');
                reqBody.agent = duplicateRecord._id;
                reqBody.skill_of_agent = duplicateRecord.skill;
                console.log('THE DTA TO BE STORED IS :');
                console.log(reqBody);
                storeAgentFeedback(reqBody,function(errToStoreFeedback,storedFeedback){
                    if(errToStoreFeedback === null){
                        console.log('ERROR IS NULL');
                        return res.status(constant.OK).send(util.successfullyInserted);
                        
                    }else{
                        console.log('ERROR IS PRESNET : '+errToStoreFeedback);
                        jsonOutput.message = errToStoreFeedback;
                        return res.status(constant.OK).send(jsonOutput);
                        
                    }

                });

            }else if(isduplicate === 'false'){ //the agent doesnot exists
                console.log('THE AGENT FOR WHICH THE FEEDBACK IS COMING DOESNOT EXISTS HENCE CANNOT POST THE FEEDBACK');
                jsonOutput.message = 'Cannot post the feedback as the agent record doesnot exists';
                return res.status(constant.NotFound).send(util.noData);

            }else{
                console.log('ERROR WHILE FINDING THE RECORD');
                return res.status(constant.InternalServerError).send(util.errorToFetchDuplicateRecords);
            }
        });
    }catch(error){
        console.log('ERROR IN THE CATCH'+error);
        jsonOutput = 'ERROR : '+error;
        return res.status(constant.InternalServerError).send(jsonOutput);

    }

};
//function for storing agent feedback 
/**
 * This function is used to storing agent Feedback
 * @param {JsonObject} agentFeedbackreq
 * @param {function} callback
 */
var storeAgentFeedback = function(agentFeedbackreq,callback){
    console.log('INSIDE storeAgentFeedback');
    var agentFeedback = agentFeedbackModel.AgentFeedbackObj(agentFeedbackreq);
    agentFeedback.save(function(err,storeAgentFeedback){
        if(err){
            console.log('ERROR : '+err);
            callback(err,null);
        }else{
            console.log('THE RESULTS ARE PRESENT : '+storeAgentFeedback);
            callback(null,storeAgentFeedback);
        }

    });
    

};

module.exports.postagentFeedback = postagentFeedback;
