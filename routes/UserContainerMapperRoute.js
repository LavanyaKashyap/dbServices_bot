

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
var util = require('../routes/utility');
//var constant = require('../routes/constants');
var userContainerMapperModel = require('../Models/UserContainerMapperModel');


var createUserContainerMapper = function(user_Container_obj,callback){
 var outputJson = {};
console.log('INSIDE USER ROOM  MAPPER');
console.log(user_Container_obj);
var mapperObj = userContainerMapperModel.UserContainerMapperObject;

util.duplicaterecordsExists({user :user_Container_obj.user },mapperObj,function(isduplicate,records){
console.log('DUPLICATE VALUE IS :'+isduplicate);
    if(isduplicate === 'true'){
        console.log('THE MAPPING OF USER AND CONAtiner already exists');
        outputJson.messgae = 'Mapping already exists for user. Try Again in sometime or conatct the admin with the details';
        //outputJson.alreadyExistingMapping = records;
        // res.status(constant.InternalServerError).send(outputJson);
        callback(outputJson,null);
    }else{
        console.log('MAKING A NEW MAPPING OF USER AND CONTAINER');
        storeUserContainerMapperInfo(user_Container_obj,function(err,savedUserContainerObj){

            if(err){
                outputJson.messgae = 'Error occured while storing records';
                // res.status(constant.InternalServerError).send(outputJson);
                callback(outputJson,null);
            }else{
                console.log('DETAILS ARE STORED SUCCESSFULLY');
                outputJson.messgae = 'DETAILS ARE STORED SUCCESSFULLY';
                console.log(savedUserContainerObj);
                // res.status(constant.OK).send(outputJson); 
                callback(null,outputJson);
            }
        });
        }
});
};

var storeUserContainerMapperInfo = function(room_user_mapper,callback){

    var User_Container_mapper = userContainerMapperModel.UserContainerMapperObject(room_user_mapper);

    User_Container_mapper.save(function(err,savedUserContainerMapper){
        if(err){
            console.log('ERROR WHILE SAVING MAPPING OF ROOM AND SESSION');
            callback(err,null);
        }else{
            console.log('MAPPING OF ROOM AND SESSION');
            console.log('SENDING.....');
            callback(null,savedUserContainerMapper);
        }
    });
};


module.exports.createUserContainerMapper = createUserContainerMapper;