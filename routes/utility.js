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
var randomatic = require("randomatic");
var constant = require('../routes/constants');

var utility = {};

utility.successfullyInserted = { "status": constant.OK, "message": "Record inserted successfully!!!" };
utility.failure_mailSent = { "status": constant.InvalidParameter, "message": "MailNotsent" };
utility.success_mailSent = { "status": constant.OK, "message": "Mail sent successfully" };
utility.invalidData = { "status": constant.BadRequest, "message": "Invalid Request Parameter" };
utility.error = { "status": constant.InternalServerError, "message": "Internal Server Error" };
utility.success = { "status": constant.OK, "message": "Success" };
utility.noData = { "status": constant.NotFound, "message": "No Data Found" };
utility.recordAlreadyExisted = { "status": constant.OK, "message": "Record you are trying to insert already exists" };
utility.errorToFetchDuplicateRecords = { "status": constant.BadRequest, "message": "Error to fetch Dulpicate records.Please try again later" };
utility.error = { "status": constant.InternalServerErrors, "message": "Error" };
utility.insertingDuplicateRecordsForContainer = { "status": constant.BadRequest, "message": "Error to insert Dulpicate records" };
utility.successfullyUpdated = { "status": constant.OK, "message": "Successfully Updated the record" };
utility.successfullyDeleted = { "status": constant.OK, "message": "Successfully deleted record" };

var duplicaterecordsExists = function(searchModel, collection, callback) {
    console.log("THE REQUEST IS : ");
    console.log(searchModel);

    var result = " ";
    //console.log(collection);
    collection.findOne(searchModel, function(err, record) {
        console.log("RESULT IS ***************");
        console.log(record);
        console.log(err);
        if (err) {
            result = "error";
            callback(result);
        } else {
            console.log("SO THE RECORD IS : : : : : : : : : ");
            console.log(record);
            try {
                if (record === null || record === undefined || record === "") {
                    console.log("Inside try ,but the result length is zero");
                    result = "false";
                    callback(result);
                } else {
                    console.log("Inside try ,sending true ");
                    result = "true";
                    console.log('DUPLICATE RECORD IS :::' + record);
                    callback(result, record);
                }
            } catch (error) {
                console.log("Inside catch and sending error in ****duplicaterecordsExists**** :  " + error);
                result = "error";
                callback(result);
            }
        }


    }); //to make the search case insensitive
};


var generateRamdomId = function(whatType) {
    console.log('INSIDE generateRamdomId');

    if (whatType === "room_id") {
        var room_id = randomatic('Aa0', 70);
        console.log('SENDING THE ROOM_ID' + room_id);
        return room_id;
    }


};

function getRandomArbitrary(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

function validateParams(response, object, callback, ...args) {
    console.log('INSIDE validateParams');
    console.log(object);
    console.log(args);
    var flag = true;
    var element;
    for (var index = 0; index < args.length; index++) {
        element = args[index];
        if (!object.hasOwnProperty(element)) {
            flag = false;
            utility.invalidData.message = "Oops, you forgot : " + element;
            return response.status(constant.BadRequest).send(utility.invalidData);
        } else if (flag == true && index == args.length - 1) {
            callback(flag);
        }
    }
}


module.exports = utility;
module.exports.duplicaterecordsExists = duplicaterecordsExists;
module.exports.generateRamdomId = generateRamdomId;
module.exports.getRandomArbitrary = getRandomArbitrary;
module.exports.validateParams = validateParams;