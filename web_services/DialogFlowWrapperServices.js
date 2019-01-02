
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
var constant = require('../routes/constants');
var util = require('../routes/utility');
var factory = require('../factory/factory');
var config = require('../routes/config');
var dialogFlow = require('../web_services/DialogFlowServices');

var updateDialogFlowIntent = function(req,res){
    console.log('INSIDE updateDialogFlowIntent');
    var requestBody = req.body;
    var outputJson = {};
    var getUtterancestJson = {};
    console.log('UPDATE INTENT  updateDialogFlowIntent');

    try{
        if (requestBody.intentId === ''|| requestBody.intentId === undefined || requestBody.intentId === null){
            return res.status(constant.BadRequest).send(util.BadRequest);
        }
        if (requestBody.authKey === ''|| requestBody.authKey === undefined || requestBody.authKey === null){
            return res.status(constant.BadRequest).send(util.BadRequest);
        }
        if (requestBody.UpdateThisUtterance === ''|| requestBody.UpdateThisUtterance === undefined || requestBody.UpdateThisUtterance === null){
            return res.status(constant.BadRequest).send(util.BadRequest);
        }
        getUtterancestJson.intentId =  requestBody.intentId;
        getUtterancestJson.authKey = requestBody.authKey;

       dialogFlow.getUtternaces(getUtterancestJson,function(err,getUtternacesObj){
           if(err){
            console.log('ERROR FR4OM GET UTTERANCES IS :::::'+err);
            return res.status(constant.InternalServerError).send(err);
           }else{
               if(getUtternacesObj.userSays === null ||getUtternacesObj.userSays === '' || getUtternacesObj.userSays === undefined){
                outputJson.error = 'Cannot get the utterances';
                return res.status(constant.InternalServerError).send(outputJson);
               }else{
                console.log('WE HAVE THE GET UTTERNACES OBJECT');
                console.log(getUtternacesObj);
                var newUtternace = {"data" : [{"text" : requestBody.UpdateThisUtterance}]};
                getUtternacesObj.userSays.push(newUtternace);
                getUtternacesObj.authKey = requestBody.authKey;
                dialogFlow.updateUtternaces(getUtternacesObj,function(updateErr, updateRes){
                    if(err){
                     console.log('ERROR FROM UPDATE UTTERANCES IS :::::'+err);
                     return res.status(constant.InternalServerError).send(err);
                    }else{
                        console.log('THE INTENT IS UPDATED');
                     return res.status(constant.OK).send(updateRes);
                    }
                });
               }
               
               //return res.status(constant.InternalServerError).send(getUtternacesObj);
               
           }
       });

    }catch(error){
        console.log('ERROR IS '+error);
        outputJson.error = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }

};

module.exports.updateDialogFlowIntent = updateDialogFlowIntent;