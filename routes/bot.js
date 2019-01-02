/**
 * This file contains the functionality of the bot Details into mongodb.
 */

var BotModel = require("../Models/botModel");
var constant = require("../routes/constants");
var util = require("../routes/utility");
//insert into mongo db
/**
 * This function is used to establish the connection with db get the bot details
 * @param {HttpRequest} request
 * @param {HttpRsponse} response
 * **/
var getActiveBotDetails = function(request, response) {
    console.log('INSIDE getActiveBotDetails');
    console.log(request.body);
    var requestBody = request.body;
    var bot = BotModel.BotObject;
    var outputJson;
    try {
        bot.find({ bot_status: 'Active' }, { bot_name: 1 }).exec(function(err, result) {
            console.log('Active bot for platform we have found to be : ' + result);
            console.log('There was an error while getting Active for a specific platform bot ' + err);
            try {
                if (result === null || result === undefined || result === "") {
                    console.log("Result is : " + result);
                    return response.status(constant.BadRequest).send(util.noData);
                } else { //bot exists
                    console.log('BOT EXISTS AND SENDING RESPONSE FOR IT:');
                    outputJson = Object.assign({ ActiveBots: result }, util.success);
                    console.log(outputJson);
                    return response.status(constant.OK).send(outputJson);
                }
            } catch (error) {
                console.log("Error -----" + error);
                //util.error.message = error;
                outputJson = Object.assign({ ErrorCode: error }, util.error);
                return response.status(constant.BadRequest).send(outputJson);
            }

        });

    } catch (error) {
        console.log("there is an error: " + error);
        //util.error.message = error;
        outputJson = Object.assign({ ErrorCode: error }, util.error);
        return response.status(constant.BadRequest).send(outputJson);

    }

};


module.exports.getActiveBotDetails = getActiveBotDetails;