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
var util = require("../routes/utility");
var constant = require("../routes/constants");
var CapabilityMapperModel = require("../Models/CapabilityMapperModel");
var engineModel = require("../Models/IntelligenceEngineModel");
var engineRoute = require("../routes/IntelligenceEngineRoute");
//insert into mongo db
/**
 * This function is used to establish the connection with db and store the  capability mapper into mongodb.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
function postCapabilityDetails(request, response) {
    console.log('INSIDE postCapabilityDetails');
    var capability = CapabilityMapperModel.CapabilityObj;
    var engine = engineModel.IntelligenceEngineObject;
    var outputJson;
    try {
        var requestBody = request.body;
        var CapabilityObj = new CapabilityMapperModel.CapabilityObj(requestBody);
        console.log(CapabilityObj);

        if (requestBody.capability_id === undefined || requestBody.capability_id === "" || requestBody.capability_id === null) {
            return response.status(constant.BadRequest).send(util.noData);
        }
        if (requestBody.sub_capability_id === undefined || requestBody.sub_capability_id === "" || requestBody.sub_capability_id === null) {
            return response.status(constant.BadRequest).send(util.noData);
        }
        if (requestBody.engine_Id === undefined || requestBody.engine_Id === "" || requestBody.engine_Id === null) {
            return response.status(constant.BadRequest).send(util.noData);
        }
        util.duplicaterecordsExists({ capability_id: requestBody.capability_id, sub_capability_id: requestBody.sub_capability_id }, capability, function(isduplicateRecord) {
            console.log('isduplicateRecord is ' + isduplicateRecord);
            if (isduplicateRecord === "true") { //capability exists
                console.log('DUPLICATE RECORDS EXISTS IN POST POST CAPABILITY');
                return response.status(constant.BadRequest).send(util.recordAlreadyExisted);

            } else if (isduplicateRecord === "false") { //capability doesnot exists
                console.log(' RECORDS doesnot EXISTS IN POST POST CAPABILITY');
                engineRoute.getEngine({ engine_id: requestBody.engine_Id }, function(err, engineInfo) {
                    if (err) {
                        //util.error.message = err;
                        outputJson = Object.assign({ ErrorCode: err }, util.error);
                        return response.status(constant.InternalServerError).send(outputJson);
                    } else {

                        console.log(engineInfo);
                        CapabilityObj.engine_id = engineInfo._id;
                        CapabilityObj.save(function(err, savedObj) {
                            if (err) {
                                //util.error.message = err;
                                outputJson = Object.assign({ ErrorCode: err }, util.error);
                                return response.status(constant.InternalServerError).send(outputJson);

                            } else {
                                // util.successfullyInserted.Capabilityinfo = savedObj;
                                outputJson = Object.assign({ Capabilityinfo: savedObj }, util.successfullyInserted);
                                return response.status(constant.OK).send(outputJson);
                            }
                        });
                    }
                });


            } else { //error to get capability
                return response.status(constant.InternalServerError).send(util.error);
            }
        });
    } catch (error) {
        console.log("there is an error: " + error);
        //util.error.message = error;
        outputJson = Object.assign({ ErrorCode: error }, util.error);
        return response.status(constant.InternalServerError).send(outputJson);
    }
}
/**
 * This function is used to establish the connection with db and get array of Capabilities from mongodb.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
var getCapability = function(req, res) {
    var capability = CapabilityMapperModel.CapabilityObj;
    var outputJson = {};
    try {
        var reqBody = req.body;
        util.validateParams(res, reqBody, function(flag) {
            capability.find({ bot: reqBody.bot }).select('capability_name capability_text capability_Discussion -_id').populate({ path: 'engine_id', select: 'Project_ids -_id' }).exec(function(err, capabilityInfo) {

                //  capability.find({bot:reqBody.bot}).distinct('capability_name' , function(err,capabilityInfo){
                if (err) {
                    console.log();
                    outputJson.message = err;
                    return res.status(constant.InternalServerError).send(outputJson);
                } else {
                    console.log('LENGTH OF CAPABILITY ::::' + capabilityInfo.length);
                    if (capabilityInfo.length > 0) { //capabilty of the bot is existing 
                        capabilityInfo = capabilityInfo.filter(function(item) { //filter out small capabiltiy as smalltalk is default
                            return item.capability_name !== 'SMALLTALK';
                            // return item !== 'SMALLTALK';

                        });
                        outputJson = Object.assign({ capability_Info: capabilityInfo }, util.success);
                        return res.status(constant.OK).send(outputJson);
                    } else { //no capability of the bot 
                        outputJson.message = 'NO CAPABILITY FOR THE BOT';
                        return res.status(constant.OK).send(outputJson);
                    }
                }
            });
        }, 'bot');
    } catch (error) {
        console.log('ERROR IN CATCH IS :' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson)
    }
};

/**
 * This function is used to establish the connection with db and get array of sub Capabilities from mongodb.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
// var getSubCapability = function(req,res){
// var requestBody = req.body;
// var capability = CapabilityMapperModel.CapabilityObj;
// var outputJson = {};

// try{
//     if(requestBody.capability_Name === null || requestBody.capability_Name  === undefined || requestBody.capability_Name === ""){
//         return res.status(constant.BadRequest).send(util.invalidData);
//     }
//     capability.find({capability_name:requestBody.capability_Name},{sub_capability_name: 1}).exec(function(err,capabilityOBJ){
//         if (err){
//             console.log(err);
//             //util.error.message = err;
//             outputJson = Object.assign({ErrorCode : err} , util.error);
//             return res.status(constant.BadGateway).send(outputJson);


//         }else{
//             console.log("Util . success ka output : ");
//             console.log(util.success);
//             if (capabilityOBJ[0]){
//                 outputJson = Object.assign({sub_capability : capabilityOBJ} , util.success);
//                 console.log(outputJson);
//                 return res.status(constant.OK).send(outputJson);
//             }else{
//                 return res.status(constant.ServiceOK).send();
//             }

//         }

//     });


// }catch(error){
//     outputJson = Object.assign({ErrorCode : error} , util.error);
//     return res.status(constant.BadGateway).send(outputJson);
// }

// };
/**
 * This service is used to establish the connection with db and get array of sub Capabilities details from mongodb.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
var getSubCapabilitiesDetails  = function(req,res){
    console.log('INSIDE getSubCapabilitiesDetails');
    var capability = CapabilityMapperModel.CapabilityObj;
var requestBody = req.body;
console.log(requestBody);
var outputJson = {};
try{
    console.log('INSIDE TRY');
    if (requestBody.capability_name === null || requestBody.capability_name === " " || requestBody.capability_name === undefined){
        return  res.status(constant.BadRequest).send(util.invalidData);
     }

     console.log('THE REQUEST IS OK');
     capability.find({capability_name : requestBody.capability_name})
    .populate('engine_id').exec(function (err, capabilities){
        console.log('ERROR IS :'+err);
        console.log('CAPABILITIES ARE :'+capabilities);
        if (err){
            console.log('ERROR WHILE POPULATING'+err);
            outputJson.message =err;
            return res.status(constant.InternalServerError).send(outputJson);
        }else{
            // console.log('CAPABILITIES ARE :'+capabilities);
            outputJson.capabilities = capabilities;
            return res.status(constant.OK).send(outputJson);
        }
    });
}
catch(error){
    console.log('Inside catch');
    console.log(error);
    outputJson.message = error;
    return res.status(constant.InternalServerError).send(outputJson);
}
};

var get_group_mailId = function(reqQuery, callback) {
    console.log('INSIDE get_group_mail');
    // var capability = reqQuery.capability;
    var outputJson = {};
    var capabilityObj = CapabilityMapperModel.CapabilityObj;

    capabilityObj.findOne({ capability_name: reqQuery }).select('capability_group_emailid').exec(function(err, capability_group_emai_id) {
        console.log(capability_group_emai_id);
        if (err) {
            console.log('ERROR :::' + err);
            callback(err, null);
        } else {
            if (capability_group_emai_id === '' || capability_group_emai_id === undefined || capability_group_emai_id === null) {
                outputJson.message = 'capability_group_emai_id is either empty or undefined';
                console.log('capability_group_emai_id is either empty or undefined');
                callback(outputJson, null);
            } else {
                callback(null, capability_group_emai_id);
            }
        }

    });
};


module.exports.postCapabilityDetails = postCapabilityDetails;
//module.exports.getSubCapability = getSubCapability;
module.exports.getCapability = getCapability;
module.exports.get_group_mailId = get_group_mailId;
//module.exports.getSubCapabilitiesDetails =getSubCapabilitiesDetails;