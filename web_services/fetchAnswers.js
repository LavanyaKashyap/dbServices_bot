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
var natural = require('natural');
var util = require('../routes/utility');
//others
var constant = require("../routes/constants");
var dialogAnswerRepo = require('../Models/DialogQuestionAnswerRepo');



/**
 * This function is used to establish the connection with db and fetch Answers from Mongo
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 * **/

// var getQuestionAndAnswersFromDialogFlowFromDB = function(req, callback) {
    var getQuestionAndAnswersFromDialogFlowFromDB = function(req, res) {

    console.log('INSIDE getQuestionAndAnswersFromDialogFlowDromDB');
    var outputJson = {};
    var probableTags = [];
    var answerRepo = dialogAnswerRepo.dialogQuestionAnsObject;
    var reqBody = req.body;
    // dumproute.dumpData(req);   //dumping question for refernece
    try {
        util.validateParams(res ,reqBody , function(flag){
            console.log('THE PARAMETERS ARE VALID');
            
            if (reqBody.score >= 0.6) {
                console.log('THE SCORE GIVEN BY USER IS MORE THAN 0.6');
                console.log('JSON IN FIND ' + reqBody.intent_name);
                answerRepo.findOne({ intent: reqBody.intent_name }).populate({path : 'workflow'}).exec((err, quesAnswerPair) => {
                    // answerRepo.findOne({ intent: reqBody.intent_name }).exec((err, quesAnswerPair) => {
    
                    console.log(quesAnswerPair);
                    if (err) {
                        console.log('QUEESTION AND ANSWER PAIR HAS A ERROR');
                        outputJson.message = err;
                        return res.status(constant.InternalServerError).send(outputJson);
                        // callback(outputJson, null);
                    } else {
                        if (quesAnswerPair === null || quesAnswerPair === undefined || quesAnswerPair === "") {
                            outputJson.message = 'Okay, I hear you, I am doing the best I can, but I was unable to find this in my knowledge. Can you provide me a feedback on this?😅';
                            return res.status(constant.OK).send(outputJson);
                            // callback(outputJson, null);
                        } else {
                            console.log('QUESTION AND ANSWER PAIR EXISTS');
                            console.log(quesAnswerPair);
                            // outputJson.answer = quesAnswerPair.answer;
                            
                            outputJson.workflow = quesAnswerPair.workflow;
                            
                            if(quesAnswerPair.answer[reqBody.baseLoc]){
                                //sending answer according to your location
                                outputJson.answer = quesAnswerPair.answer[reqBody.baseLoc];
                            }else{
                                //sending harcode answer for india as a default if your country key is npt in db
                                outputJson.answer = quesAnswerPair.answer['IN'];
                            }

                            // if (quesAnswerPair.Actionable === null || quesAnswerPair.Actionable === '' || quesAnswerPair.Actionable === undefined) {
                            //     console.log('NO ACTIONABLE ');
                            // } else {
                            //     outputJson.action = quesAnswerPair.Actionable;
                            // }
                            return res.status(constant.OK).send(outputJson);
                            // callback(null, outputJson);
                        }
                    }
                });
            } else {
                console.log('THE SCORE GIVEN BY USER IS NOT MORE THAN 0.6');
                // answerRepo.find({ $text: { $search: reqBody.question }, capability: reqBody.capability }, function(err, quesAnswerPair) {
                    answerRepo.find({ $text: { $search: reqBody.question } }, function(err, quesAnswerPair) {
    
                    console.log('THE $TEST IS : ');
                    console.log(quesAnswerPair);
                    console.log(err);
                    if (err) {
                        console.log('QUEESTION AND ANSWER PAIR HAS A ERROR');
                        outputJson.message = err;
                        return res.status(constant.InternalServerError).send(outputJson);
                        // callback(outputJson, null);
                    } else {
                        console.log('QUESTION AND ANSWER PAIR EXISTS');
                        console.log(quesAnswerPair.length);
                        quesAnswerPair.forEach(function(element) {
                            if (natural.JaroWinklerDistance(element.intent, reqBody.intent_name) > 0.85) {
                                console.log(element.question);
                                probableTags.push(element.intent);
                            }
                        });
                        if (probableTags.length === 0) {
                            outputJson.message = 'Sometimes I might not have the answer that you need, can you try giving me a feedback? 😐';
                            outputJson.status = constant.Accepted;
                            return res.status(constant.Accepted).send(outputJson);
                            // callback(null, outputJson);
                        } else {
                            outputJson.probableTags = probableTags;
                            outputJson.message = 'Sent Probable Tags';
                            return res.status(constant.OK).send(outputJson);
                            // callback(null, outputJson);
                        }
    
                    }
                });
    
    
    
    
            }
        } , 'score' , 'baseLoc' , 'question' , 'intent_name' );
    
        
    } catch (error) {
        outputJson = { message: error };
        return res.status(constant.BadRequest).send(outputJson);
        // callback(outputJson, null);
    }


};


module.exports.getQuestionAndAnswersFromDialogFlowFromDB = getQuestionAndAnswersFromDialogFlowFromDB;