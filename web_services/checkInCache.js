/**
 * This file defines the function for getting and setting the question answers from the mongodb cache.
 */
/*global
alert, confirm, console, prompt,require, module,const
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

const natural = require("natural");
var constants = require("../routes/constants");
var CacheModel = require("../Models/DialogQuestionAnswerRepo");

/**
 * This method gets the question from the cache. And return the answer if the answer is available and if not, then it returns an appriopriate response. 
 * @param {HTTPRequest} request,
 * @param {HTTPResponse} response
//  */
// function getQuestionFromCache(payload, callback) {
function getQuestionFromCache(req, res) {
    var payload = req.body;
    var user_question = payload.question;
    var location = payload.baseLoc;
    var cache = CacheModel.dialogQuestionAnsObject;
    var resp = {};
    console.log("question is: ");
    console.log(user_question);

    try {
        if (user_question === "" || user_question === undefined || user_question === null) {
            callback({ status: constants.BadRequest, message: "Oops, you forgot the question!" });
        }
        if (location === "" || location === undefined || location === null) {
            callback({ status: constants.BadRequest, message: "Oops, you forgot the flag!" });
        }

        cache.findOne({ intent: user_question }).populate({ path: 'workflow' }).exec(function (err, result) {
            if (err) {
                console.log("There is a problem");
                resp.message = 'Error to fetch records';
                return res.status(constants.InternalServerError).send(resp);
            }
            console.log("---result from check in mongo(tags) is-----");
            console.log(result);
            if (result !== null || result !== undefined || result !== '')  {
                console.log(result.answer[location]);
                
                resp = {
                    message: "Success",
                    answer: result.answer[location],
                    workflow: result.workflow
                    
                };
                console.log("result:");
                console.log(result);
                // callback({ response: resp, status: 200 });
                return res.status(constants.OK).send(resp);
            } else {
                // callback({ response: result.message, status: 204 });
                resp.message = 'No matching records';
                return res.status(constants.ServiceOK).send();

            }
        });


    } catch (error) {
        console.log("there is an error in getting the question from Mongodb...");
        console.log(error);
        // callback({ status: constants.InternalServerError, message: "Internal Server Error" });
        resp.message = error;
        return res.status(constants.InternalServerError).send(resp);

    }
}

module.exports.getQuestionFromCache = getQuestionFromCache;



