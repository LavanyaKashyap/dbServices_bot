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
var UserModelObject = require("../Models/UserModel");
var containerroute = require("../routes/ContainerRoute");
var constant = require("../routes/constants");
var util = require("../routes/utility");
var factory = require("../factory/factory");
// var config = require("../routes/config");
var ContainerModelObject = require('../Models/ConatinerModel');
/**
 * This function is used to establish the connection with db get Room availability for a specific user
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
var getRoomAvailabilityForUser = function (req, res) {
    console.log('INSIDE getRoomAvailabilityForUser');
    var outputJson = {};

    var user = UserModelObject.UserInfoObject;
    var container = ContainerModelObject.containerInfoObject;
    try {
        var requestBody = req.body;
        if (requestBody.EmpUsername === null || requestBody.EmpUsername === "" || requestBody.EmpUsername === undefined) {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.tokenId === null || requestBody.tokenId === "" || requestBody.tokenId === undefined) {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.appKey === null || requestBody.appKey === "" || requestBody.appKey === undefined) {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        var username = requestBody.EmpUsername;
        var tokenId = requestBody.tokenId;
        var appKey = requestBody.appKey;
        util.duplicaterecordsExists({ user_name: username.toUpperCase() }, user, function (isduplicate, duplicateRecord) {
            console.log(duplicateRecord);
            console.log('isduplicate value : ' + isduplicate);
            if (isduplicate === 'true') {
                console.log('THIS USER IS ALREADY PRESENT');
                container.findOne({ user: duplicateRecord._id }, function (err, containerInfo) {
                    if (err) {
                        console.log('ERROR TO FETCH DETAILS OF THE CONTAINER');
                        outputJson.message = err;
                        return res.status(constant.InternalServerError).send(outputJson);
                    } else {
                        console.log('the container info is : ' + containerInfo);
                        outputJson.Container_id = containerInfo.Container_id;
                        outputJson.container = containerInfo._id;
                        outputJson.Container_name = containerInfo.Container_name;
                        outputJson.createdOn = containerInfo.createdOn;
                        return res.status(constant.OK).send(outputJson);
                    }
                });

            } else {
                console.log('NO USER IS PRESENT IN THE DB');
                var room_id = util.generateRamdomId("room_id");
                console.log('ROOM ID IS GENERATED FOR  ' + requestBody.EmpUsername + ' IS ' + room_id);
                // createUserDetails(requestBody.EmpUsername, tokenId, appKey,
                    createUserDetails(requestBody.EmpUsername,
                    function (errStoringUser, storedUser) {
                        console.log('GOT VALUES FROM ' + createUserDetails);
                        console.log('ERROR IS : ' + errStoringUser);
                        console.log('STORED USER IS : ' + storedUser);
                        if (errStoringUser) {
                            //error to store userdata
                            console.log('ERROR STORING USER DETAILS');
                            return res.status(constant.InternalServerError).send(util.error);
                        } else {
                            console.log('NO ERROR TO STORE DATA');
                            var container = {

                                Container_id: room_id,
                                Container_name: storedUser.name + ' ROOM',
                                user: storedUser._id
                            };
                            containerroute.postConatinerInfo(container, function (errstoringContainer, storedContainer) {
                                console.log('RETURNED WITH CALLBACK');
                                console.log('ERROR IS : ' + errstoringContainer);
                                console.log('STORED USER IS : ' + storedContainer);
                                if (errstoringContainer) {
                                    //error to store container data
                                    console.log('ERROR STORING CONTAINER  DETAILS');
                                    return res.status(constant.InternalServerError).send(util.error);
                                } else {
                                    console.log('NO ERROR TO STORE CONTAINER RECORD...GOING TO SHOW STORED CONTAINER');
                                    console.log(storedContainer);
                                    outputJson.Container_id = storedContainer.Container_id;
                                    outputJson.Container_name = storedContainer.Container_name;
                                    outputJson.createdOn = storedContainer.createdOn;
                                    outputJson.container = storedContainer._id;

                                    return res.status(constant.OK).send(outputJson);
                                }

                            });
                        }

                    });

            }

        });

    } catch (error) {
        console.log('there is an error: ' + error);
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }
};



/**
 * This function is used to establish the connection with db and get access token for a user
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
//  */
// var getAccessToken = function(request, response) {
//     var reqBody = request.body;
//     var userObj = UserModelObject.UserInfoObject;
//     var outputJson = {};

//     try {

//         if (reqBody.emp_id == null || reqBody.emp_id == " " || reqBody.emp_id == undefined) {
//             return response.status(constant.BadRequest).send(util.invalidData);
//         }

//         userObj.find({ emp_id: reqBody.emp_id }, function(err, result) {
//             console.log(result);
//             console.log(err);

//             try {
//                 if (result[0] === null || result[0] === undefined || result[0] === "") {
//                     outputJson = { message: "BadRequest", status: constant.BadRequest };
//                     return response.send(outputJson);
//                 } else {
//                     outputJson = { message: "Success", status: constant.OK, access_token: result[0].user_acc_tok };
//                     return response.send(outputJson);
//                 }
//             } catch (error) {
//                 outputJson = { message: error, status: constant.BadRequest };
//                 return response.send(outputJson);
//             }
//         });


//     } catch (error) {
//         // util.error.message = error;
//         outputJson = { message: error, status: constant.InternalServerError };
//         return response.status(constant.InternalServerError).send(util.error);
//     }


// };




/**
 * This function is used to establish the connection with db and post user Details
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
// var createUserDetails = function (username, tokenId, appKey, callback) {
var createUserDetails = function (username, callback) {

    console.log('INSIDE createUserDetails FUNCTION WITH username : ' + username);
    var userInfo = UserModelObject.UserInfoObject;
    try {

        util.duplicaterecordsExists({user_name: username}, userInfo, function (isduplicate, duplicateRecord) {
            console.log('DOES DUPLICATE RECORDS EXISTS' + isduplicate);
            console.log('THE DUPLICATE RECORD IS ::::' + duplicateRecord);
            if (isduplicate === 'true') { // the agent is present
                console.log('THE AGENT ENTRY IS ALREADY DONE IN USER PAGE ....THE DUPLICATE RECORD IS ' + duplicateRecord);
                callback(null, duplicateRecord);
            } else if (isduplicate === 'false') {
                factory.getUserDetails(username, function (err, userDetails) {
                    if (err) {
                        console.log('error EXISTS :');
                        console.log(err);
                        callback(err, null);
                    } else {
                        console.log('error DOESNOT EXISTS :');
                        // var username = userDetails.user_name;
                        // userDetails.image_url = config.image_URLs + username.toLowerCase() + '.jpg';
                        console.log(userDetails);
                        var newUser = new userInfo(userDetails);

                        newUser.save((inserUserErr, newUser) => {
                            if (inserUserErr) {
                                console.log('error is ' + inserUserErr);
                                //return res.status(constant.InternalServerError).send(inserUserErr);
                                callback(inserUserErr, null);
                            } else {
                                console.log('NEW USERER CREATED');
                                console.log(newUser);
                                callback(null, newUser);


                            }

                        });

                    }

                });
            } else {
                console.log('ERROR WHILE FINDING THE RECORD AGENT');
                callback(util.errorToFetchDuplicateRecords, null)
            }


        })
    } catch (err) {
        console.log('ERROR IN CATCH OF createUserDetails' + err);
        callback('ERROR IN CATCH OF createUserDetails', null);


    }


};
// var refresh_user_token = function(req, res) {
//     var outputJson;
//     var requestBody = req.body;
//     var user = UserModelObject.UserInfoObject;

//     try {

//         if (requestBody.emp_id === null || requestBody.emp_id === undefined || requestBody.emp_id === "") {
//             return res.status(constant.BadRequest).send(util.invalidData);
//         }
//         if (requestBody.new_user_token === null || requestBody.new_user_token === undefined || requestBody.new_user_token === "") {
//             return res.status(constant.BadRequest).send(util.invalidData);
//         }

//         user.findOneAndUpdate({ emp_id: requestBody.emp_id }, { $set: { user_acc_tok: requestBody.new_user_token } }, { new: true }, function(err, updatedRecord) {

//             if (err) {
//                 outputJson = util.error;
//                 outputJson.message = err;
//                 return res.status(constant.InternalServerError).send(outputJson);
//             } else {
//                 if (updatedRecord === null || updatedRecord === undefined || updatedRecord === "") {
//                     outputJson = util.noData;
//                     return res.status(constant.NotFound).send(outputJson);
//                 }
//                 outputJson = util.successfullyUpdated;
//                 outputJson.updated_record = updatedRecord;
//                 return res.status(constant.OK).send(outputJson);
//             }

//         });

//     } catch (error) {
//         outputJson = util.error;
//         outputJson.message = error;
//         return res.status(constant.InternalServerError).send(outputJson);
//     }



// };

var getUserObjectFromUserMail = function (user_email, callback) {
    console.log('INSIDE getUserObjectFromUserMail');
    var user = UserModelObject.UserInfoObject;
    var outputJson = {};
    // console.log((user_email).toUpperCase());
    util.duplicaterecordsExists({ user_email: (user_email).toUpperCase() }, user, function (result, record) {
        if (record) {
            console.log('RECORD FOR THIS USER ' + (user_email).toUpperCase() + ' EXISTS');
            console.log(record);
            callback(null, record._id);

        } else {
            console.log('RECORD FOR THIS USER DOESNOT EXISTS IN DB');
            outputJson.message = 'RECORD FOR THIS USER DOESNOT EXISTS IN DB';
            // console.log(util.noData, null);
            callback(outputJson, null);
        }

    });



};


var postAgentAsUser = function (username, cb) { //storing the agent as a user into users collection
    console.log('INSIDE postAgentAsUser FUNCTION and username is' + username);
    var outputJson = {};
    try {
        createUserDetails(username, function (err, storedUser) { //create user details
            if (err) {
                console.log('ERROR INSIDE postAgentAsUser');
                outputJson.message = err;
                // return res.status(constant.InternalServerError).send(outputJson);
                cb(err, null);
            } else {
                console.log('NO ERROR TO CREATE USER DETAILS');
                // return res.status(constant.OK).send(util.successfullyInserted);
                cb(null, storedUser);
            }

        });
    } catch (error) {
        console.log('ERROR IN CATCH postAgentAsUser ::::' + error);
        outputJson.message = 'ERROR IN CATCH : ' + error;
        // return res.status(constant.InternalServerError).send(outputJson);
        cb(error, null);

    }



};

module.exports.getRoomAvailabilityForUser = getRoomAvailabilityForUser;
// module.exports.getAccessToken = getAccessToken;
module.exports.createUserDetails = createUserDetails;
// module.exports.refresh_user_token = refresh_user_token;
module.exports.getUserObjectFromUserMail = getUserObjectFromUserMail;
module.exports.postAgentAsUser = postAgentAsUser;