/**
 * This file contains the functionality to store the Engine data (agents in different engines) into mongodb.
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
var IntelligenceEngineModel = require("../Models/IntelligenceEngineModel");
var capabilityModel = require("../Models/CapabilityMapperModel");
//insert into mongo db
/**
 * This service is used to establish the connection with db and store the user conversations like qusetions and answers with the user.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
//  */
// function postIntelligenceEngineDetails(request, response) {
//     var IntelligenceEngine = IntelligenceEngineModel.IntelligenceEngineObject;
//     try {

//         var requestBody = request.body;
//         var IntelligenceEngineObj = new IntelligenceEngineModel.IntelligenceEngineObject(requestBody);
//         console.log(IntelligenceEngineObj);

//         if (requestBody.Project_ids === undefined || requestBody.Project_ids === null || requestBody.Project_ids === "") {
//             return response.status(constant.BadRequest).send(util.invalidData);
//         }


//         util.duplicaterecordsExists({ Project_ids: requestBody.Project_ids }, IntelligenceEngine, function(isduplicateRecord) {
//             if (isduplicateRecord === "true") {
//                 return response.status(constant.BadRequest).send(util.recordAlreadyExisted);

//             } else if (isduplicateRecord === "false") {
//                 IntelligenceEngineObj.save(function(err, savedObj) {
//                     if (err) {
//                         console.log("Errrrrror*******" + err);
//                         console.log(err.message);
//                         util.error.message = err;
//                         return response.status(constant.InternalServerError).send(util.error);
//                     } else {
//                         util.successfullyInserted.IntelligenceEngine_Info = savedObj;
//                         return response.status(constant.OK).send(util.successfullyInserted);
//                     }
//                 });

//             } else {
//                 return response.status(constant.InternalServerError).send(util.error);
//             }
//         });

//     } catch (error) {
//         console.log("there is an error: " + error);
//         util.error.message = error;
//         return response.status(constant.InternalServerError).send(util.error);
//     }
// }
/**
 * This function is used to establish the connection with db and store the user conversations like qusetions and answers with the user.
 * @param {HttpRequest} requestBody
 * @param {function} callback
 */

var getIntelligenceEngineForCapability = function (request,response){
// var getIntelligenceEngineForCapability = function(requestBody, callback) {
    var outputJson = {};
    console.log('INSIDE getIntelligenceEngineForCapability');
    console.log(request.body);
    var IntelligenceEngine = IntelligenceEngineModel.IntelligenceEngineObject;
    var capability = capabilityModel.CapabilityObj;
    console.log(request.body);
    try {
        var requestBody = request.body;
        var capability_name = requestBody.capability_name;
        if (capability_name === null || capability_name === undefined || capability_name == "") {
            return response.status(constant.NotFound).send(util.invalidData);
            // callback(util.invalidData, null);
        }

        capability.findOne({ capability_name: capability_name }).
        select('capability_name engine_id -_id').
        populate({path: 'engine_id' , select: 'engine_url Project_ids engine_name engine_acc_token engine_emailId private_key -_id' }).exec((err, capability) => {
            console.log('CAPABILITY FINDING ');
            
        // capability.findOne({capability_name: capability_name}, {engine_id: 1 }, function(err, capability) {


            console.log("error is : " + err);
            // console.log("Capability is : " + capability);
            if (err) {
                console.log("Error is : " + err);private_key
                util.error.message = err;
                outputJson = Object.assign({ ErrorCode: err }, util.error);
                return response.status(constant.InternalServerError).send(outputJson);
                // callback(outputJson, null);

            } else {
                console.log(capability);
                outputJson.intelligence_engine_details = capability;
                outputJson.message = 'Success';
                return response.status(constant.OK).send(outputJson);
                // if (capability === null || capability === undefined || capability === "") {
                //     return response.status(constant.BadRequest).send(util.noData);
                    // callback(util.noData, null);
                // } else {
                //     IntelligenceEngine.findOne({ _id: capability.engine_id }).exec((err, intelligenceEngine) => {
                //         console.log('ERROR AND INTELLIGENCE ENGINE IS ::::');
                //         console.log(err);
                //         console.log(intelligenceEngine);
                //         if (err) {
                //             util.error.message = err;
                //             outputJson = Object.assign({ ErrorCode: err }, util.error);
                //             return response.status(constant.BadGateway).send(outputJson);
                //             // callback(outputJson, null);

                //         } else {
                //             outputJson = Object.assign({ intelligence_engine_details: intelligenceEngine }, util.success);
                //             util.success.intelligence_engine_details = intelligenceEngine;
                //             return response.status(constant.OK).send(outputJson);
                //             // callback(null, outputJson);
                //         }

                //     });
                // }

           // }

        }
    });

    } catch (error) {
        console.log("there is an error: " + error);
        outputJson = Object.assign({ErrorCode: error}, util.error);
        return response.status(constant.BadGateway).send(outputJson);
        // callback(outputJson, null);
    }

};

var getEngine = function(searchhModel, callback) {

    var engine = IntelligenceEngineModel.IntelligenceEngineObject;
    console.log('SERACH MODEL : ');
    console.log(searchhModel);
    engine.findOne(searchhModel, function(err, engine) {
        console.log('Error is :' + err);
        console.log('Engine is : ' + engine);
        if (err) {
            callback(err, null);
        } else {
            callback(null, engine);
        }
    });
};




//module.exports.postIntelligenceEngineDetails = postIntelligenceEngineDetails;
module.exports.getEngine = getEngine;
module.exports.getIntelligenceEngineForCapability = getIntelligenceEngineForCapability;