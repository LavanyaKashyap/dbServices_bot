
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
var ContainerModel = require("../Models/ConatinerModel");
var constant = require("../routes/constants");
var util = require('../routes/utility');
/**
 * This service is used to establish the connection with db and store the user conversations like qusetions and answers with the user.
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 */
function postConatinerInfo(containerObj, callback) { //conatinerObj is the whole object to store in container
    console.log("INSIDE POST CONATINER INFO ");
    var container = ContainerModel.containerInfoObject;
    var containerInfo = ContainerModel.containerInfoObject(containerObj);
 util.duplicaterecordsExists({Container_id : containerObj.Container_id}, container , function(isduplicaterecord){
            if (isduplicaterecord == "true"){
                console.log('YOU ARE TRYING TO INSERT A DUPLICATE CONTAINER');
                //return response.send(util.recordAlreadyExisted);
                callback(util.recordAlreadyExisted,null);
            }else {
                console.log('GOING TO STORE CONTAINER INFO');
                containerInfo.save(function(err, savedContainerObj) {
                    if (err) {
                        console.log("Errrrrror*******" + err);
                        console.log(err.message);
                        //util.error.message = err.message;
                       // outputJson = Object.assign({ErrorCode : err.message} ,util.error );
                       // return response.send(outputJson);
                       callback(err.message,null);
                    } else {
                        console.log("SUCCESSSFUL SAVING OF USER DATA");
                        //outputJson = Object.assign({Container_Details : savedContainerObj} , util.successfullyInserted);
                        //util.successfullyInserted.Container_Details = savedObj;
                       // return response.status(constant.OK).send(outputJson);
                       callback(null,savedContainerObj);
                        }
                });
            }
        });
}






 module.exports.postConatinerInfo = postConatinerInfo;
