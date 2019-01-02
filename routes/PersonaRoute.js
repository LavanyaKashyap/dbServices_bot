/**
 * This file contains the functionality to store the conversational data into mongodb.
 */
/*global
alert, confirm, console, prompt,require, module,const,handleError,callback
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var PersonaModel = require('../Models/PersonaModel');
var constant = require("../routes/constants");
var util = require("../routes/utility");


var insertBulkParasonaData = function (req, res) {
    console.log('*****insertBulkParasonaData***');
    var ParasonaDataModel = PersonaModel.personaObj;
    var arrayOfDoc = req.body.docs;
    var outputJson = {};

    ParasonaDataModel.insertMany(arrayOfDoc, function (err, insertDocRes) {
        if (err) {
            console.log('ERROR : ' + err);
            return res.status(constant.InternalServerError).send(err);
        } else {
            console.log('insert persona record : ' + insertDocRes);
            outputJson.insertedDoc = insertDocRes;
            return res.status(constant.OK).send(insertDocRes);
        }
    });
};

//  "_id": "5c08dd49ec0da6162373454c",
//     "p_Id": "P663",
//     "location": "CAN",
//     "grade": "G5",
//     "age": "GY",
//     "gender": "O"


var getPersonaData = function (req, res) {
    var outputJson = {};
    var ParasonaDataModel = PersonaModel.personaObj;
    console.log('*****In get persona data*****');
    console.log('request parameter: ', req.body);

    util.validateParams(res, req.body, function (flag) {
        // var p_ID = req.body.p_ID;
        var location = req.body.location;
        var grade = req.body.grade;
        var age = req.body.age;
        var gender = req.body.gender;

        ParasonaDataModel.findOne({
            location: location,
            grade: grade,
            age: age,
            gender: gender
        }, function (err, personaObj) {
            console.log('INSIDE FINDONE');
            console.log("response", personaObj);
            if (err) {
                return res.status(constant.InternalServerError).send(err);
            } else {
                if (personaObj == undefined || personaObj == "" || personaObj == null) {
                    return res.status(constant.NotFound).send(util.noData);
                } else {
                    outputJson.p_Id = personaObj.p_Id;
                    //outputJson._id = personaObj._id;
                    outputJson.status = constant.OK;
                    outputJson.message = "Success";
                    return res.status(constant.OK).send(outputJson);
                }

            }
        });
    }, 'location', 'grade', 'age', 'gender');
};

//insert persona data
var insertPersonaData = function (personaDataReqObj, res) {
    console.log(personaDataReqObj.body);
    var ParasonaInfo = PersonaModel.personaObj(personaDataReqObj.body);
    //console.log('request parameter: ', personaDataReqObj.body);

    ParasonaInfo.save(function (err, savePersonaObj) {
        if (err) {
            console.log("Errrrrror*******" + err);
            console.log(err.message);
            // callback(err.message, null);
        } else {
            console.log("persona data to be insert:", personaDataReqObj);
            //callback(null, personaDataReqObj);
            return res.status(constant.OK).send(util.successfullyInserted);
        }
    });
};


/* //read personadata as per p_ID
var getPersonaData = function (req, res) {
    var ParasonaDataModel = PersonaModel.personaObj;
    console.log('*****In get persona data*****');

    util.validateParams(res, req.body, function (flag) {
        var p_ID = req.body.p_ID;
        console.log('request parameter: ', req.body.p_ID);
        ParasonaDataModel.findOne({
            p_Id: p_ID
        }, function (err, personaObj) {
            console.log('INSIDE FINDONE');
            if (err) {
                return res.status(constant.InternalServerError).send(err);
            } else {
                return res.status(constant.OK).send(personaObj);
            }
        });
    }, 'p_ID');
 };  */

//delete persona data on p_id 
var deletePersonaData = function (req, res) {
    var ParasonaDataModel = PersonaModel.personaObj;
    console.log('*****delete persona data*****');

    util.validateParams(res, req.body, function (flag) {
        var p_ID = req.body.p_ID;
        console.log('request parameter: ', req.body.p_ID);
        ParasonaDataModel.deleteOne({
            p_Id: p_ID
        }, function (err, personaObj) {
            console.log('INSIDE delete');
            if (err) {
                return res.status(constant.InternalServerError).send(err);
            } else {
                return res.status(constant.OK).send(util.successfullyDeleted);
            }
        });
    }, 'p_ID');
};

//update location of user as per p_id parameter
var updatePersonaData = function (req, res) {
    var ParasonaDataModel = PersonaModel.personaObj;
    console.log('*****update persona data*****');

    util.validateParams(res, req.body, function (flag) {
        var p_ID = req.body.p_ID;
         var location = req.body.location;
        console.log('request parameter: ', req.body.p_ID);
        ParasonaDataModel.update({
            p_Id: p_ID
        },{ location: location},
            function (err, personaObj) {
            console.log('INSIDE update service call');
            if (err) {
                return res.status(constant.InternalServerError).send(err);
            } else {
                 console.log('"Successfully Updated the record"');
                return res.status(constant.OK).send(util.successfullyUpdated);
            }
        });
    }, 'p_ID');
};


module.exports.insertBulkParasonaData = insertBulkParasonaData;
module.exports.getPersonaData = getPersonaData;
module.exports.deletePersonaData = deletePersonaData;
module.exports.insertPersonaData = insertPersonaData;
module.exports.updatePersonaData = updatePersonaData;