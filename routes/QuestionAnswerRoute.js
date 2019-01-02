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
var constant = require("../routes/constants");

var util = require("../routes/utility");

var questionRepoModel = require('../Models/DialogQuestionAnswerRepo');



function postQuestionIntoDB(request, response) {
    var outputJson = {};

    try {

        var requestBody = request.body;

        var QuesAnsObj = new questionRepoModel.dialogQuestionAnsObject(requestBody);


        if (requestBody.action !== undefined && requestBody.action !== '' || requestBody.action !== null) {
            actionRoute.postActionable(requestBody.action, function (err, storedAction) {
                if (err) {
                    console.log('ERROR WHILE POSTING ACTIONABLE');
                    outputJson.message = err;
                    return response.status(constant.InternalServerError).send(outputJson);
                } else {
                    QuesAnsObj.isActionable = true;
                    QuesAnsObj.Actionable = storedAction._id;
                    QuesAnsObj.save(function (err, savedObj) {
                        if (err) {
                            util.error.message = err.message;
                            return response.status(constant.BadRequest).send(util.error);
                        } else {
                            // var cacheData = new cacheModel.CacheObject(requestBody); //storing in cache simultanesouly
                            // cacheData.save();
                            util.successfullyInserted.Question_Object = savedObj;
                            return response.status(constant.OK).send(util.successfullyInserted);
                        }

                    });
                }
            });

        } else {
            QuesAnsObj.save(function (err, savedObj) {
                if (err) {
                    console.log('save function')
                    util.error.message = err.message;
                    return response.status(constant.BadRequest).send(util.error);
                } else {
                    // var cacheData = new cacheModel.CacheObject(requestBody); //storing in cache simultanesouly
                    // cacheData.save();
                    util.successfullyInserted.Question_Object = savedObj;
                    return response.status(constant.OK).send(util.successfullyInserted);
                }

            });
        }
    } catch (error) {

        console.log("there is an error: " + error);

        util.error.message = error;

        return response.status(constant.BadRequest).send(util.error);

    }

}

var insertBulkQuesAns = function (req, res) {
    console.log('INSIDE insertBulkIntent');
    var quesAnsModel = questionRepoModel.dialogQuestionAnsObject;
    var arrayOfDoc = req.body.docs;
    var outputJson = {};
    quesAnsModel.insertMany(arrayOfDoc, function (err, insertDocRes) {
        if (err) {
            console.log('ERROR : ' + err);
            return res.status(constant.InternalServerError).send(err);
        } else {
            console.log('insertDocRes : ' + insertDocRes);
            outputJson.insertedDoc = insertDocRes;
            return res.status(constant.OK).send(insertDocRes);
        }
    });
};

var mapcababilitytointent = function (req, res) {
    console.log('INSIDE mapcababilitytointent');
    var outputJson = {};
    var intentModel = questionRepoModel.dialogQuestionAnsObject;
    try {
        var reqBody = req.body;
        util.validateParams(res, reqBody, function (flag) {
            console.log('VALID PARAMS ');

            var query = intentModel.updateMany({
                intent: {
                    $in: reqBody.intents
                }
            }, {
                $set: {
                    capability: reqBody.capability
                }
            })

            // var query = intentModel.find({intent : {$in : reqBody.intents}})
            query.exec(function (errToUpdate, changedRecords) {
                console.log('ERROR : ' + errToUpdate);
                console.log('RECORDS CHANGED ARE : ');
                console.log(changedRecords);
                if (errToUpdate) {
                    console.log('ERROR IS :::::' + errToUpdate);
                    outputJson.message = errToUpdate
                    return res.status(constant.InternalServerError).send(outputJson);
                } else {
                    console.log('NO ERROR ' + changedRecords);
                    outputJson.message = changedRecords;
                    return res.status(constant.OK).send(outputJson);
                }
            });
        }, 'intents', 'capability');

    } catch (err) {
        console.log("there is an error: " + err);
        outputJson.message = err;
        return res.status(constant.BadRequest).send(outputJson);

    }

}

//single purpose function
var updateAnswerWithLoc = function (req, res) {
    console.log('INSIDE updateAnswerWithLoc ');
    var outputJson = {};
    var outputArray = [];
    try {
        var dialogFlowQuesAnswerModel = questionRepoModel.dialogQuestionAnsObject;
        var reqBody = req.body;
        var index;
        util.validateParams(res, reqBody, function (flag) {
            console.log('VALID PARAMETERS');
            var intentAnsArray = reqBody.intentAndAnswerArray;
            console.log('INTENTANSARRAY is :: ');
            console.log(intentAnsArray);

            for (index = 0; index <= intentAnsArray.length; index++) {

                //              dialogFlowQuesAnswerModel.findOne({ intent: intentAnsArray[index].intent }).exec(function (err, reqDoc) {
                //                  console.log(err);
                // if (err) {
                //     console('THERE IS AN ERROR IN FINDING THE DOC  ' + err);
                //     outputJson.message = err;
                //     outputJson.intent = intentAnsArray[index].intent;
                //     outputArray.push(outputJson);
                //     // return res.status(constant.InternalServerError).send(outputJson);
                // } else {

                // if (reqDoc === null || reqDoc === undefined || reqDoc === " ") {
                //     console.log('NO DOC IS FETCHED FOR THE INTENT ::::' + intentAnsArray[index].intent)
                //     outputJson.message = 'NO DOC IS FETCHED FOR THE INTENT';
                //     outputJson.intent = intentAnsArray[index].intent;
                //     outputArray.push(outputJson);
                // } else {
                var Newanswer = {
                    "IN": intentAnsArray[index].answer,
                    "US": intentAnsArray[index].answer,
                    "GB": intentAnsArray[index].answer,
                    "IN": intentAnsArray[index].answer,
                    "DE": intentAnsArray[index].answer,
                    "CN": intentAnsArray[index].answer,
                    "JP": intentAnsArray[index].answer,
                    "AU": intentAnsArray[index].answer,
                    "SG": intentAnsArray[index].answer,
                    "ZA": intentAnsArray[index].answer,
                    "AE": intentAnsArray[index].answer,
                    "KR": intentAnsArray[index].answer,
                    "QA": intentAnsArray[index].answer,
                    "SE": intentAnsArray[index].answer,
                    "NL": intentAnsArray[index].answer,
                    "FR": intentAnsArray[index].answer,
                    "CA": intentAnsArray[index].answer,
                    "IT": intentAnsArray[index].answer
                }
                // console.log(Newanswer);
                console.log('THE INTENT VALUE IN THIS ROUND IS :::: ' + index);
                console.log(intentAnsArray[index].intent);
                dialogFlowQuesAnswerModel.updateMany({
                        intent: intentAnsArray[index].intent
                    }, {
                        answer: Newanswer
                    },
                    function (err, result) {
                        if (err) {
                            console.log('ERROR OCCURED FOR INTENT : ' + err + ' at ' + intentAnsArray[index].intent);
                            outputJson.message = 'ERROR OCCURED FOR INTENT : ' + err;
                            // outputJson.intent = intentAnsArray[index].intent;
                            outputArray.push(outputJson);
                        } else {
                            console.log('VALUE INSERTED FOR INTENT ::');
                            outputJson.message = result;
                            // outputJson.intent = intentAnsArray[index].intent;
                            outputArray.push(outputJson);

                        }
                    })

                //  }

                //     }

                // });

            }
            if (index === intentAnsArray.length) {
                return res.status(constant.OK).send(outputArray);
            }
        }, 'intentAndAnswerArray');

    } catch (error) {
        console.log(error);
        outputJson.message = error;
        outputJson.status = constant.InternalServerError;
        return res.status(constant.InternalServerError).send(outputJson);
    }

}

//map workflow on intent 
var mapSearchLinksWorkflow = function (req, res) {
    var outputJson = {};
    var outputArray = [];
    try {
        var dialogFlowQuesAnswerModel = questionRepoModel.dialogQuestionAnsObject;
        var reqBody = req.body;
        //console.log('req body  is -- ',req);
        console.log('req body  is ', reqBody);
        var index;
        //   util.validateParams(res, reqBody, function (flag) {
        console.log('In VALID PARAMETERS');

        var intentWorkflowArray = reqBody.intentWorkflowArray;

        console.log('INTENTANSARRAY is :: ');
        console.log(intentWorkflowArray);

        for (index = 0; index <= intentWorkflowArray.length; index++) {
            console.log('THE INTENT VALUE IN THIS ROUND IS : ' + index);

            console.log("intent :",intentWorkflowArray[index].intent);
            console.log("work flow array:", intentWorkflowArray[index].workflow);
            dialogFlowQuesAnswerModel.updateMany({
                    intent: intentWorkflowArray[index].intent
                }, {
                    workflow: intentWorkflowArray[index].workflow
                },
                function (err, result) {
                    console.log('ERROR IS '+err);
                    console.log("RESULT FROM UPDATE : "+result);
                    if (err) {
                        // console.log('ERROR OCCURED FOR INTENT : ' + err + ' at ' + intentWorkflowArray[index].intent);
                        // outputJson.message = 'ERROR OCCURED FOR INTENT : ' + err;
                        // outputArray.push({message : 'ERROR OCCURED FOR INTENT : ' + err + ' at ' + intentWorkflowArray[index].intent});
                        // outputJson.intent = intentAnsArray[index].intent;
                       // outputArray.push(outputJson);
                        //return res.status(constant.InternalServerError).send(util.error);
                    } else {
                        // console.log('ValueSucessfully inserted : '+ intentWorkflowArray[index].intent);
                        // outputArray.push({message : 'ValueSucessfully inserted : '+ intentWorkflowArray[index].intent});

                        // return res.status(constant.OK).send(util.successfullyInserted);
                    }
                });
        }
        if (index === intentWorkflowArray.length) {
            console.log('index and array same');
            return res.status(constant.OK).send(outputArray);
        }

    } catch (error) {
        console.log(error);
        outputJson.message = error;
        outputJson.status = constant.InternalServerError;
        return res.status(constant.InternalServerError).send(outputJson);
    }
}


module.exports.updateAnswerWithLoc = updateAnswerWithLoc;
module.exports.insertBulkQuesAns = insertBulkQuesAns;
module.exports.postQuestionIntoDB = postQuestionIntoDB;
module.exports.mapcababilitytointent = mapcababilitytointent;
module.exports.mapSearchLinksWorkflow = mapSearchLinksWorkflow;
