/**
 * This file contains the factory calls for all the third party API consumption.
 */
/*global
alert, confirm, console, prompt,require, module,const
*/
"use strict";
//coremodules
var https = require('https');
//npm modules 
//others
var config = require('../routes/config');
var constant = require('../routes/constants');
var util = require('../routes/utility');
var https = require('https');
var http = require('http');
var constants = require('../routes/constants');
const TokenCache = require('google-oauth-jwt').TokenCache;
let tokens = new TokenCache();


// var getUserDetails = function(emailId, callback) {
var getUserDetails = function(userName, callback) {
console.log('INSIDE getUserDetails'+userName);
    try {
        var payload = {
            "data": {
                "userName": userName
            }
        };
        payload = JSON.stringify(payload);
        console.log('PAYLOAD IS ::::::::');
        console.log(payload);
        var options = {
            host: config.PRODhost,
            path: config.UserInfoServiceEndpoint,
            method: 'POST',
            headers: config.emailHeaders
        };
        // var header = config.emailHeaders;
        // header.tokenId = tokenId;
        // header.appKey = appKey;
        // header.userName = userName;
        // var options = {
        //     host: config.preprodHost,
        //     path: config.UserInfoServiceEndpoint,
        //     method: 'GET',
        //     headers: config.emailHeaders
        // };
        console.log('OPTIONS IS');
        console.log(options);
        var requestParam = https.request(options, function(resBody) {
            // var requestParam = http.request(options, function(resBody) {

            resBody.setEncoding('utf-8');
            var responseString = '';
            var jsonOutput = {};
            var jsonO = {};
            console.log("STATUSCODE: " + resBody.statusCode);


            resBody.on('data', function(data) {
                responseString += data;
                console.log('############@@@@@@@@@@@@@@@@@#################');
                console.log(data);
                console.log('#############################');


            });
            resBody.on('end', function() {
                jsonO = JSON.parse(responseString);
                if (jsonO.statuscode === constant.OK) {
                    console.log('INSIDE STATUS')
                    if (jsonO.data.Details === null || jsonO.data.Details === undefined || jsonO.data.Details === "") {
                        jsonOutput.message = 'Details of the user Doesnot exists';
                        callback(jsonOutput, null);
                    } else {
                        jsonOutput.emp_id = jsonO.data.Details[0].emp_id;
                        jsonOutput.user_name = (userName).toUpperCase();
                        jsonOutput.user_email = (jsonO.data.Details[0].official_email).toUpperCase();
                        jsonOutput.name = (jsonO.data.Details[0].complete_name).toUpperCase();
                        jsonOutput.image_url = jsonO.data.Details[0].image_url;
                        jsonOutput.country_key = jsonO.data.Details[0].country_key;
                        jsonOutput.subarea = jsonO.data.Details[0].personal_subarea_text;
                        callback(null, jsonOutput);
                    }

                } else {
                    jsonOutput.message = responseString;
                    callback(jsonOutput, null);
                }




            });
        });
        requestParam.on('error', function(err) {
            console.log('problem with request: ' + err.message);
            callback(err.message, null);
        });
        requestParam.write(payload); //REMOVE THE PAYLOAD IN GET REQUEST
        requestParam.end();
    } catch (error) {
        console.log('ERROR IS ' + error);
        callback(error, null);
    }


};


var getIntentUtternaces = function(req, res) {
    console.log('INSIDE GET UTTERNACES : ');
    var outputJson = {};
    var uttereances = [];
    var utterance = '';

    try {
        console.log('INSIDE TRY');
        var reqBody = req.body;
        console.log(reqBody);
        if (reqBody.intentId === '' || reqBody.intentId === undefined || reqBody.intentId === null) {
            console.log('NOT intent ID');
            return res.status(constant.BadRequest).send(util.BadRequest);
        }
        if (reqBody.authKey === '' || reqBody.authKey === undefined || reqBody.authKey === null) {
            console.log('NOT AUTH KEY');
            console.log(reqBody.authKey);
            return res.status(constant.BadRequest).send(util.BadRequest);
        }
        console.log('NOT INVALID REQUEST');
        config.emailHeaders.Authorization = 'Bearer ' + reqBody.authKey;
        console.log(config.emailHeaders);

        var options = {
            host: config.apiHost,
            path: config.getUtternacesEndpoint + reqBody.intentId,
            method: 'GET',
            headers: config.emailHeaders
        };
        console.log(options);

        var requestParam = https.request(options, function(resBody) {
            resBody.setEncoding('utf-8');
            var responseString = '';
            resBody.on('data', function(data) {
                responseString += data;
            });
            resBody.on('end', function() {
                console.log("In End ");
                var response = JSON.parse(responseString);
                var userSays = response.userSays;
                for (var i = 0; i < userSays.length; i++) {
                    if (userSays[i].data.length > 1) {
                        for (var j = 0; j < userSays[i].data.length; j++) {
                            utterance = utterance + userSays[i].data[j].text;
                        }
                        console.log('INSERTING UTTERANCES');
                        uttereances.push(utterance);
                        utterance = '';
                    } else if (userSays[i].data.length === 1) {
                        console.log('INSERTING USERSAY DATA');
                        uttereances.push(userSays[i].data[0].text);
                    } else {
                        console.log('DO NOTHING ');
                    }
                }
                console.log('utterances are');
                console.log(uttereances);

                outputJson.utterances = uttereances;
                return res.status(constant.OK).send(outputJson);
            });
        });
        requestParam.on('error', function(err) {
            console.log('problem with request: ' + err.message);
            outputJson.error = err.message;
            return res.statusCode(constant.InternalServerError).send(outputJson);
        });
        requestParam.end();
    } catch (error) {
        console.log('ERROR IS ' + error);
        outputJson.error = error;
        return res.statusCode(constant.InternalServerError).send(outputJson);
    }
};

var UploadIntentIntoDialogFlowServiceCall = function(payload, cb) { //payload : {trainingPrases : [],intent : 'intent', 'project_id' : 'project_id' ,'authToken' : 'authToken'  }
    console.log('INSIDE UploadIntentIntoDialogFlowServiceCall');
    try {
        var sendingpayload = {
            "displayName": payload.intent,
            "webhookState": "WEBHOOK_STATE_UNSPECIFIED",
            "trainingPhrases": payload.trainingPhrases
        };
        console.log('!@#$%^&*()(*&^%$#@!@#$%^&*(*&^%$#@!@#$%^&*&^%$#@!@#$%^&*(');
        console.log(sendingpayload);
        console.log('***********************************');
        console.log(JSON.stringify(sendingpayload));
        console.log('***********************************');
        console.log(JSON.parse(JSON.stringify(sendingpayload)));

        var options = {
            host: config.UploadIntentIntoDialogFlowServiceCallHOST,
            path: (config.UploadIntentIntoDialogFlowServiceCallPATH).replace('*project*', payload.project_id),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + payload.authToken
            },
            method: "POST"
        };
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(options);
        const requestParam = https.request(options, function(resBody) {
            resBody.setEncoding('utf-8');
            var responseString = '';
            console.log("STATUSCODE: " + resBody.statusCode);
            console.log(resBody.statusMessage);
            resBody.on('data', function(data) {
                responseString += data;
                cb(null, responseString);
            });
            resBody.on('end', function() {
                console.log("In End ");

            });
        });
        requestParam.on('error', function(err) {
            console.log('problem with request: ' + err.message);
            cb(err.message, null);
        });
        requestParam.write(JSON.stringify(sendingpayload));
        requestParam.end();
    } catch (error) {
        console.log('ERROR :::::' + error);
        cb(error, null);
    }
};


var searchAppsFromES = function(req, res) {
    console.log('INSIDE searchAppsFromES');
    var outputJson = {};
    var outputArray = [];
    try {
        var reqBody = req.body;
        util.validateParams(res, reqBody, function(flag) {
            var searchAppsheaders = config.emailHeaders;
            searchAppsheaders.tokenId = reqBody.tokenId;
            searchAppsheaders.appKey = reqBody.appKey;
            searchAppsheaders.username = reqBody.username;
            searchAppsheaders.query = reqBody.query;
            var options = {
                host: config.PRODsearchAppsFromESHost,
                path: config.searchAppsFromESEndpoint,
                method: 'GET',
                headers: searchAppsheaders
            };
            console.log('OPTIONS IS');
            console.log(options);
            var requestParam = https.request(options, function(resBody) {

                // var requestParam = http.request(options, function(resBody) {
                resBody.setEncoding('utf-8');
                var responseString = '';
                resBody.on('data', function(data) {
                    responseString += data;
                });
                resBody.on('end', function() {
                    console.log("In End ");
                    var response = JSON.parse(responseString);
                    console.log(response);
                    if (response.statuscode === constant.OK) {
                        if (response.data.linksSearchResult) {
                            console.log('INSIDE IF')
                            for (var i = 0; i < response.data.linksSearchResult.length; i++) {
                                outputArray.push({ "app_name": response.data.linksSearchResult[i].app_name, "links": response.data.linksSearchResult[i].app_url });
                                console.log('THE ARRAY IS :' + outputArray);
                            }

                            if (response.data.linksSearchResult.length === outputArray.length) {
                                outputJson.searchLinks = outputArray;
                                return res.status(constant.OK).send(outputJson);
                            } else {
                                console.log('ARRAY LENGTH DIDNOT MATCH WHILE SENDING THE ARRAY');
                                return res.status(constant.ServiceOK).send();
                            }
                        } else {
                            return res.status(constant.ServiceOK).send();
                        }

                    } else {
                        outputJson.message = response
                        return res.status(constant.OK).send(outputJson);
                    }
                });
            });
            requestParam.on('error', function(err) {
                console.log('problem with request: ' + err.message);
                outputJson.error = err.message;
                return res.statusCode(constant.InternalServerError).send(outputJson);
            });
            requestParam.end();
        }, 'tokenId', 'appKey', 'username', 'query')
    } catch (error) {
        console.log('ERROR :::::' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }
};


var baseUrl = "uat-chatbot-services-prod.appuat.kpit.com";


/**
 * This method takes in the engine details, question and fires the query to the engine and gets the reposnse from the engine.
 * @param {Object} object,
 * @param {String} question,
 * @param {Function} callback
 */
function getResponseApi(object, question, callback) {

    if (object === undefined) {
        callback({ "status": constants.InternalServerError, "Message": "Oops, did not get the engine details" });
    }
    const options = {
        host: object.engine_url.base_url,
        path: object.engine_url.query_url,
        method: "POST",
        headers: {
            "Authorization": "Bearer " + object.engine_acc_token,
            "Content-Type": "application/json"
        },
        port: 443
    };
    var payload = {
        "lang": "en",
        "query": question,
        "sessionId": "123"
    };
    var responseString = "";
    const httpReq = https.request(options, function(res) {
        try {
            if (res.statusCode === 200) {
                res.on('data', function(params) {
                    responseString += params;
                });
                res.on('end', function() {
                    console.log("==========responseString from api.ai=========");
                    var data = JSON.parse(responseString);
                    var speech = data.result.fulfillment.speech;
                    console.log("speech: " + speech);
                    callback({ status: 200, message: "Success", data: data });
                });
            } else {
                console.log("There is an issue in getting the response from api.ai");
                callback({ status: res.statusCode, message: res.statusMessage });
            }
        } catch (error) {
            console.log("INSIDE CATCH OF getResponseApi......");
            console.log(error);
            callback({ status: res.statusCode, message: res.statusMessage });
        }

    });
    httpReq.on('error', function(e) {
        console.log("There is an issue in getting the response from api.ai");
        callback({ "status": constants.InternalServerError, "Message": e });
    });
    httpReq.write(JSON.stringify(payload));
    httpReq.end();
}


function getSearchLink(payload, callback) {
    console.log("PAYLOAD FOR getSearchLink");
    console.log(payload);


    var responseString = "";
    const options = {
        host: baseUrl,
        path: "/searchAppsFromES",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        port: 443
    };
    console.log("OPTIONS FOR getSearchLink");
    console.log(options);
    try {
        const httpReq = https.request(options, function(res) {
            res.on('data', function(resp) {
                res.setEncoding('utf-8');
                console.log('3############################');
                responseString += resp;
                console.log('3############################');

            });
            res.on('end', function() {
                try {
                    console.log('Data from /searchAppsFromES is::: ');
                    console.log(responseString);
                    if (res.statusCode === 204) {
                        return callback({ status: 204 });
                    } else {
                        return callback({ status: 200, response: JSON.parse(responseString) });
                    }
                } catch (error) {
                    console.log("IN CATCH OF getSearchLink");
                    console.log(error);
                }
            });
        });
        httpReq.write(JSON.stringify(payload));
        httpReq.end();
        httpReq.on('error', function(error) {
            console.log("THERE IS AN ERROR IN THE /searchAppsFromES METHOD");
            console.log(error);
            callback({ status: 0, message: "Uh-oh, there is an issue while getting answer to your question. Could you please try again in some time?" });
        });
    } catch (error) {
        console.log("IN THE CATCH OF THE /searchAppsFromES METHOD");
        console.log(error);
        callback({ status: 0, message: "Uh-oh, there is an issue while getting answer to your question. Could you please try again in some time?" });
    }
}

function getBizHrInfo(payload, callback) {
    var responseString = "";
    var bizHRarr = [];
    var bizHrs = [];
    var getBizHRHeader = config.emailHeaders;
    getBizHRHeader.tokenId = payload.tokenId;
    getBizHRHeader.appKey = payload.appKey;
    getBizHRHeader.username = payload.username;
    const options = {
        host: config.PREPRODHost,
        path: "/getMyBizManagerDetails",
        method: "GET",
        headers: getBizHRHeader,
        port: 443
    };
    console.log("OPTIONS FOR GET BIZ HR DETAILS.......");
    console.log(options);
    try {
        const httpReq = https.request(options, function(res) {
            res.on('data', function(resp) {
                responseString += resp;
            });
            res.on('end', function() {
                try {
                    console.log('Data from /getMyBizManagerDetails is::: ');
                    console.log(responseString);
                    var obj = JSON.parse(responseString);
                    bizHRarr = obj.data;
                    bizHRarr.forEach(element => {
                        bizHrs.push(element.complete_name + " (" + element.official_email + ")")
                    });
                    callback(bizHrs);
                } catch (error) {
                    console.log("IN CATCH OF getSearchLink");
                    console.log(error);
                    callback({ status: 0, message: "Uh-oh, there is an issue while getting answer to your question. Could you please try again in some time?" });

                }
            });
        });
        httpReq.write(JSON.stringify(payload));
        httpReq.end();
        httpReq.on('error', function(error) {
            console.log("THERE IS AN ERROR IN THE /searchAppsFromES METHOD");
            console.log(error);
            callback({ status: 0, message: "Uh-oh, there is an issue while getting answer to your question. Could you please try again in some time?" });
        });
    } catch (error) {
        console.log("IN THE CATCH OF THE /getBizHrInfo METHOD");
        console.log(error);
        callback({ status: 0, message: "Uh-oh, there is an issue while getting answer to your question. Could you please try again in some time?" });
    }
}



/**
 * This method takes in the engine details, question and fires the query to the engine and gets the reposnse from the engine.
 * @param {Object} object,
 * @param {String} question,
 * @param {String} private_key,
 * @param {Function} callback
 */
function getResponseApiV2(object, callback) {
    var responseObj = {};
    getAuthToken(object.Project_ids, object.private_key, object.email, function(res) {
        console.log('response from service');
        console.log(res);
        if (object === undefined) {
            callback({ "status": constants.InternalServerError, "Message": "Oops, did not get the engine details" });
        }
        const options = {
            host: "dialogflow.googleapis.com",
            path: "/v2/projects/" + object.Project_ids + "/agent/sessions/123456789:detectIntent",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + res,
                "Content-Type": "application/json"
            },
            port: 443
        };
        var payload = {
            "query_input": {
                "text": {
                    "text": object.question,
                    "language_code": "en"
                }
            }
        };
        var responseString = "";
        const httpReq = https.request(options, function(res) {
            if (res.statusCode === 200) {
                res.on('data', function(params) {
                    responseString += params;
                });
                res.on('end', function() {
                    console.log("==========response from api.ai detcetIntent=========");
                    var data = JSON.parse(responseString);
                    if (data.queryResult.intent) {
                        responseObj.intentName = data.queryResult.intent.displayName;
                        responseObj.score = data.queryResult.intentDetectionConfidence;
                        callback({ status: 200, message: "Success", data: responseObj });
                    } else {
                        console.log("Intent not found!");
                        callback({ status: 204, message: "Intent not found!", data: responseObj });
                    }

                });
            } else {
                console.log("There is an issue in getting the response from api.ai");
                callback({ status: res.statusCode, message: res.statusMessage });
            }
        });
        httpReq.on('error', function(e) {
            console.log("There is an issue in getting the response from api.ai");
            callback({ "status": constants.InternalServerError, "Message": e });
        });
        httpReq.write(JSON.stringify(payload));
        httpReq.end();
    });
}

// token service for dialogflow
var getAuthToken = function(project_id, private_key, service_email, callback) {
    try {
        console.log("enter into get auth token function");
        console.log(project_id);
        console.log('Email:   ' + service_email);
        var projectId = project_id;
        return new Promise((resolve, reject) => {  
                tokens.get({
                    email: service_email,
                    key: private_key,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                },     (err, token) => {  
                    if (err) {
                        var err_json = {
                            "status": "401",
                            "message": err
                        }
                        console.log(err_json);
                        reject(err);
                        callback(err_json);
                        // response.send(err);
                    }  
                    console.log("token is");
                    console.log(token); 
                    var json_out = {
                        "status": "200",
                        "message": "Success",
                        "access_token": token
                    }
                    resolve(token); 
                    callback(token);
                    // response.send(json_out);
                     
                })
            })
            // .then((state) => {
            //     assert(state.action === 'DONE', 'should change state');
            // })
            .catch((error) => {
                console.log("error !!!!!!");
                console.log(error);
            });
    } catch (error) {
        console.log('ERROR');
        console.log(error);
    }
}



module.exports.bingSpellCheck = function(payload, callback) {

    const endpoint = encodeURI(config.BingSpellCheckEndpoint + "?mode=" + config.BingSpellCheckMode + "&text=" + payload.text);
    console.log("******************");
    
    console.log(endpoint);
    console.log("******************");
    
    var responseStr = "";
    
    const options = {
    
    host: config.BingSpellCheckHost,
    
    path: endpoint,
    
    method: "GET",
    
    headers: config.BingSpellCheckHeaders
    
    };
    
    try {
        console.log('inside try');
        console.log(options);
    const httpReq = https.request(options, (httpResponse) => {
    console.log(httpResponse);
        httpResponse.on('data', (data) => {
        
        responseStr += data;
        
        });
        
        httpResponse.on('end', () => {
        
        console.log("Response from the bing spellcheck Api is: ");
        
        console.log(responseStr);
        
        callback(JSON.parse(responseStr));
        
        });
        
        });
        httpReq.on('error', (err) => {
            console.log("(((((((((((");
            
            console.log(err);
            
        });
        httpReq.end();
    } catch (error) {
        console.log(error)
        callback(error);
    }
    
    // httpReq.write(JSON.stringify(payload));

    
    };




module.exports.getResponseApi = getResponseApi;
module.exports.getSearchLink = getSearchLink;
module.exports.UploadIntentIntoDialogFlowServiceCall = UploadIntentIntoDialogFlowServiceCall;
module.exports.searchAppsFromES = searchAppsFromES;
module.exports.getUserDetails = getUserDetails;
module.exports.getIntentUtternaces = getIntentUtternaces;
module.exports.getBizHrInfo = getBizHrInfo;
module.exports.getResponseApiV2 = getResponseApiV2;