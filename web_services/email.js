/**
 * This file contains the functionality to store the conversational data into mongodb.
 */
/*global
alert, confirm, console, prompt,require, module,const
*/
"use strict";
//coremodules
var https = require('https');
//npm modules 
//others
var config = require("../routes/config.json");
var util = require('../routes/utility');
var constant = require('../routes/constants');
//Require files 
var capabilityMapper = require('../routes/CapabilityMapperRoute');
var dump = require('../routes/dumpRoute');

/**
 * This function sends an email to the names of people mentioned in "To" and "Cc" from a default mail id of "Gourav Patidar".
 * @param {Object} appliedleaveObject 
 */

var sendMailToAgentWhenNoActiveAgent = function(req, res) {
    console.log("INSIDE SEND MAIL");
    console.log('THE REQUEST OF sendMailToAgentWhenNoActiveAgent IS ');
    var outputJson = {};
    var dumpObj = {};
    try {
        var requestBody = req.body;
        // if(requestBody.capability === null || requestBody.capability === undefined || requestBody.capability === '' ){
        //     return res.status(constant.BadRequest).send(util.invalidData);
        // }
        // if(requestBody.userName === null || requestBody.userName === undefined || requestBody.userName === '' ){
        //     return res.status(constant.BadRequest).send(util.invalidData);
        // }
        // if(requestBody.unsatisifiedQuestion === null || requestBody.unsatisifiedQuestion === undefined || requestBody.unsatisifiedQuestion === '' ){
        //     return res.status(constant.BadRequest).send(util.invalidData);
        // }
        util.validateParams(res, requestBody, function(flag) {
            var userName = requestBody.userName;
            console.log('SESSION ID IS :');
            console.log(requestBody.session_id);
            var question = requestBody.unsatisifiedQuestion;
            var mailBody = `<html>
    <head>
    <meta name=viewport content=width=device-width />
    <meta http-equiv=X-UA-Compatible content=IE=10,IE=9,IE=8> 
    <meta http-equiv=Content-Type content=text/html; charset=UTF-8/>
    <title>Unsolved Query</title>
    </head>
    <body style=font-family:Segoe UI;>
    <table style=width:95%; border:1px solid #CCCCCC; cellpadding=0 cellspacing=0 border=0>
    <tr>
    <td align=left valign=top bgcolor=#0089cf>
    <img src=https://testabhayd.blob.core.windows.net/chatbot/bot5_circled.png width=50 height=50 alt=kloudee align="right">
    <img src=https://dmmimages.kpit.com/KGuest/kpit_logo_blue.png width=99 height=30 alt=Kguest>
    </td>
    </tr>
    <tr>
    <td height=5 bgcolor=#d7df23>
    <block type=spacer height=5px>
    </td>
    </tr>
    <tr>
    <td >
    <table width=100% border=0 cellpadding=7 cellspacing=0 style=font-size:1.25em;>
    <tr>
    <td style=line-height:19px;>Dear Team<br>
    <br>We need human assistance!<br>
    <br>` + userName.toUpperCase() + ` was using Kloudee and has enquired – <br><b>` + question + `</b><br><br>
    And was unsatisified with the answer. We would appreciate if you would take out your valuable time and answer the query 
    <br> 
    </td>
    </tr>
    <tr>
    <td>
    </td>
    </tr>
    <tr>
    <td>Thank you!
    <br>Best Regards,
    <br>Team Kloudee <br>
    <br>
    <br>
    <span style=font-size:12px; font-style:italic;>This is an auto generated mail, please do not reply.</span>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td style=background-color:#0095da>
    <img src=http://ecomm.kpit.com/KPITConnect2016/footer.gif width=601 height=21 />
    </td>
    </tr>
    </table>
    </body>
    </html>
    `;
            capabilityMapper.get_group_mailId(requestBody.capability, function(fetchgroupmailerr, group_mailId) {
                if (fetchgroupmailerr) {
                    console.log('ERROR ::::' + fetchgroupmailerr);
                    outputJson.message = 'No groupmail id mapped';
                    return res.status(constant.InternalServerError).send(outputJson);
                } else {
                    if (group_mailId === null || group_mailId === '' || group_mailId === undefined) {
                        outputJson.message = 'No groupmail id mapped';
                        return res.status(constant.InternalServerError).send(outputJson);
                    } else {
                        console.log('EMAIL IS IS :::::::' + group_mailId);
                        var payload = {
                            "from": 'CDO_Platform@kpit.com',
                            "to": group_mailId.capability_group_emailid,
                            "cc": requestBody.userMail,
                            "bcc": '',
                            "subject": 'Unresolved Query Ticket No' + requestBody.session_id,
                            "mailbody": mailBody,
                            "title": 'Unresolved Query Ticket No' + requestBody.session_id,
                            "emailType": 'html'

                        };
                        payload = JSON.stringify(payload);
                        console.log('#########################PAYLOAD IS ##################');
                        console.log(payload);
                        console.log(' ::::::::::::::::::::::::::::::::');
                        var options = {
                            host: config.emailHost,
                            path: config.emailEndPoint,
                            method: 'POST',
                            headers: config.emailHeaders
                        };
                        console.log('OPTIONS IS');
                        console.log(options);
                        var requestParam = https.request(options, function(resBody) {
                            resBody.setEncoding('utf-8');
                            console.log("STATUSCODE: " + resBody.statusCode);


                            resBody.on('data', function(data) {
                                console.log(data);
                                if (resBody.statusCode === 200) {
                                    console.log('GOT SUCCESS IN MAIL SENT');
                                    return res.status(resBody.statusCode).send(util.success_mailSent);

                                } else {
                                    console.log('GOT FAILURE IN MAIL SENT');
                                    return res.status(resBody.statusCode).send(util.failure_mailSent);
                                }

                            });



                        });
                        requestParam.write(payload);
                        requestParam.on('error', function(err) {
                            console.log('problem with request: ' + err.message);
                            outputJson.message = err.message;
                            return res.status(constant.InternalServerError).send(outputJson);
                        });
                        requestParam.end();

                    }
                }
            });


        }, 'session_id', 'userName', 'userMail', 'unsatisifiedQuestion', 'capability');

    } catch (error) {
        console.log(error);
        outputJson = Object.assign({ ErrorCode: error }, util.error);
        return res.status(constant.InternalServerError).send(outputJson);
    }

};


var sendMailToUserForTheAnswer = function (req, res) {
    console.log("!!!!!!!!!!!!!!!!!!");
    var outputJson = {};
    console.log("INSIDE sendMailToUserForTheAnswer");
    console.log('THE REQUEST OF sendMailToUserForTheAnswer IS ');
    console.log(req.body);
    // var feedbackURL = encodeURI('https://www.google.com');
    // var str = "Right Here!!!";
    // var result = str.link(feedbackURL);
    try {
        var requestBody = req.body;

        if (requestBody.unsatisifiedQuestion === null || requestBody.unsatisifiedQuestion === undefined || requestBody.unsatisifiedQuestion === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }

        if (requestBody.userMail === null || requestBody.userMail === undefined || requestBody.userMail === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.answer === null || requestBody.answer === undefined || requestBody.answer === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        if (requestBody.ticketNo === null || requestBody.ticketNo === undefined || requestBody.ticketNo === "") {
            return res.status(constant.BadRequest).send(util.invalidData);
        }
        var mailBody = `<html>
    <head>
    <meta name=viewport content=width=device-width />
    <meta http-equiv=X-UA-Compatible content=IE=10,IE=9,IE=8> 
    <meta http-equiv=Content-Type content=text/html; charset=UTF-8/>
    <title>Unsolved Query</title>
    </head>
    <body style=font-family:Segoe UI;>
    <table style=width:95%; border:1px solid #CCCCCC; cellpadding=0 cellspacing=0 border=0>
    <tr>
    <td align=left valign=top bgcolor=#0089cf>
    <img src=https://dmmimages.kpit.com/KGuest/kpit_logo_blue.png width=99 height=30 alt=Kguest>
    </td>
    </tr>
    <tr>
    <td height=5 bgcolor=#d7df23>
    <block type=spacer height=5px>
    </td>
    </tr>
    <tr>
    <td >
    <table width=100% border=0 cellpadding=7 cellspacing=0 style=font-size:1.25em;>
    <tr>
    <td style=line-height:19px;>Hi , <br>
    <br>You had enquired about " ` + requestBody.unsatisifiedQuestion.toUpperCase() + ` "<br>
    Here's an answer to your question<br><br><br> " ` + requestBody.answer + `"
    <br> 
    </td>
    </tr>
    <tr>
    <td>
    </td>
    </tr>
    <tr>
    <td>Thank you!
    <br>Best Regards,
    <br>Team Kloudee
    <br>
    <br>
    <span style=font-size:12px; font-style:italic;>This is an auto generated mail, please do not reply.</span>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td style=background-color:#0095da>
    <img src=http://ecomm.kpit.com/KPITConnect2016/footer.gif width=601 height=21 />
    </td>
    </tr>
    </table>
    </body>
    </html>
    `;
        var payload = {
            "from": 'CDO_Platform@kpit.com',
            "to": requestBody.userMail,
            "cc": 'HR_Group@kpit.com',
            "bcc": '',
            "subject": 'Answer for ' + requestBody.ticketNo,
            "mailbody": mailBody,
            "emailType": 'html',
            "title": 'Send user the answer'
            // "title" : "Title"
        };
        payload = JSON.stringify(payload);
        console.log('PAYLOAD IS');
        console.log(payload);
        var options = {
            host: config.emailHost,
            path: config.emailEndPoint,
            method: 'POST',
            headers: config.emailHeaders
        };
        console.log(options);
        var requestParam = https.request(options, function (resBody) {
            resBody.setEncoding('utf-8');
            var responseString = "";

            resBody.on('data', function (data) {
                console.log(data);
                // responseString += data
                // responseString = JSON.parse(responseString);
                // console.log(responseString);
                return res.status(constant.OK).send(util.success_mailSent);
            });
            resBody.on('end', function () {
                console.log("In End ");
            });

        });

        requestParam.write(payload);
        requestParam.on('error', function (err) {
            console.log('problem with request: ' + err.message);
        });
        requestParam.end();

    } catch (error) {
        console.log(error);
        outputJson = Object.assign({ ErrorCode: error }, util.error);
        return res.status(constant.InternalServerError).send(outputJson);

    }

};

var sendemailWhenUserDoesNotGiveFeedback = function (req, res) {
    console.log('INSIDE emailWhenUserDoesNotGiveFeedback');
    console.log('THE REQUEST OF emailWhenUserDoesNotGiveFeedback');
    var outputJson = {};


    try {
        console.log(req.body);
        var requestBody = req.body;
       if(requestBody.location_of_user === null ||requestBody.location_of_user === ''||requestBody.location_of_user === undefined){
            return res.status(constant.InvalidParameter).send(util.invalidData);
        }
        if(requestBody.agentId === null ||requestBody.agentId === ''||requestBody.agentId === undefined){
            return res.status(constant.InvalidParameter).send(util.invalidData);
        }
        if(requestBody.userName === null ||requestBody.userName === ''||requestBody.userName === undefined){
            return res.status(constant.InvalidParameter).send(util.invalidData);
        }
        if(requestBody.agentName === null ||requestBody.agentName === ''||requestBody.agentName === undefined){
            return res.status(constant.InvalidParameter).send(util.invalidData);
        }
        var feedbackURL = encodeURI('https://www.google.com/?agent=' + requestBody.agentId +
        '&location_of_user=' + requestBody.location_of_user);
    var str = "feedback";
    var result = str.link(feedbackURL);
        util.validateParams(res, requestBody, function (flag) {
            console.log('FLAG VALUE : ' + flag);
            var mailBody = `<html>
    <head>
    <meta name=viewport content=width=device-width />
    <meta http-equiv=X-UA-Compatible content=IE=10,IE=9,IE=8> 
    <meta http-equiv=Content-Type content=text/html; charset=UTF-8/>
    </head>
    <body style=font-family:Segoe UI;>
    <table style=width:95%; border:1px solid #CCCCCC; cellpadding=0 cellspacing=0 border=0>
    <tr>
    <td align=left valign=top bgcolor=#0089cf>
    <img src=https://dmmimages.kpit.com/KGuest/kpit_logo_blue.png width=99 height=30 alt=Kguest>
    </td>
    </tr>
    <tr>
    <td height=5 bgcolor=#d7df23>
    <block type=spacer height=5px>
    </td>
    </tr>
    <tr>
    <td >
    <table width=100% border=0 cellpadding=7 cellspacing=0 style=font-size:1em;>
    <tr>
    <td style=line-height:19px;>Hi ` + requestBody.userName + `, <br><br><br>
    You have missed giving feedback to the agent <b>` + requestBody.agentName + `</b>This helps us to serve you better.<br> 
    Please click here to give your valuable `+ result +
                `<br> <br>
    </td>
    </tr>
    <tr>
    <td>
    </td>
    </tr>
    <tr>
    <td>Thank you!
    <br>Best Regards,
    <br>Team Eva
    <br>
    <br>
    <span style=font-size:12px; font-style:italic;>This is an auto generated mail, please do not reply.</span>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td style=background-color:#0095da>
    <img src=http://ecomm.kpit.com/KPITConnect2016/footer.gif width=601 height=21 />
    </td>
    </tr>
    </table>
    </body>
    </html>
    `;
            var payload = {
                "from": 'CDO_Platform@kpit.com',
                "to": requestBody.to,
                // "to": 'pranali.gatfane@kpit.com' ,
                "cc": 'HR_Group@kpit.com',
                // "cc": '',
                "bcc": "",
                "subject": 'Agent Feedback Please!!!!',
                "mailbody": mailBody,
                "emailType": 'html',
                "title": 'User Didnt send feedback'
                // "title" : "Title"
            };
            payload = JSON.stringify(payload);
            console.log('PAYLOAD IS');
            console.log(payload);
            var options = {
                host: config.emailHost,
                path: config.emailEndPoint,
                method: 'POST',
                headers: config.emailHeaders
            };
            console.log(options);
            var requestParam = https.request(options, function (resBody) {
                resBody.setEncoding('utf-8');
                var responseString = "";
                console.log(resBody.statusCode);


                resBody.on('data', function (data) {
                    console.log(data);
                    return res.status(constant.OK).send(data);
                });
                resBody.on('end', function () {
                    console.log("In End ");
                });
            });

            requestParam.write(payload);
            requestParam.on('error', function (err) {
                console.log('problem with request: ' + err.message);
                outputJson.message = err.message;
                return res.status(constant.InternalServerError).send(outputJson);

            });
            requestParam.end();

        }, 'to', 'userName', 'agentName');
    } catch (error) {
        console.log("There is a problem in the sendemailWhenUserDoesNotGiveFeedback");
        outputJson.message = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }

};



module.exports.sendMailToAgentWhenNoActiveAgent = sendMailToAgentWhenNoActiveAgent;
module.exports.sendMailToUserForTheAnswer = sendMailToUserForTheAnswer;
module.exports.sendemailWhenUserDoesNotGiveFeedback = sendemailWhenUserDoesNotGiveFeedback;
