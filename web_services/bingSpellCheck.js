var utils = require('../routes/utility');
var factory = require('../factory/factory');

/**

* 

* @param {HTTPRequest} request

* @param {HTTPResponse} response

*/

module.exports.checkSpelling = function(request, response) {

    var userMessage = request.body.message;
    
    var responseString = "";
    console.log('INSIDE checkSpelling');
    console.log(request.body);
    
    utils.validateParams(response, request.body, function(flag) {
    
    if (flag) {
    
    const payload = { text: userMessage };
    
    factory.bingSpellCheck(payload, (bingSpellCheckResp) => {
    console.log('RESPONSE FROM BING IS :::');
    
        console.log(bingSpellCheckResp);
    var flaggedTokens = bingSpellCheckResp.flaggedTokens;
    
    try {
    
    if (flaggedTokens.length > 0) {
    
    flaggedTokens.forEach(function(element, index) {
    
    var token = element.token;
    
    const suggestions = element.suggestions;
    
    var max = Math.max.apply(Math, suggestions.map(function(o) {
    
    return o.score;
    
    }));
    
    var ind;
    
    suggestions.map(function(o, index) {
    
    max === o.score ? ind = index : '';
    
    });
    
    var obj = suggestions[ind];
    
    userMessage = userMessage.replace(token, obj.suggestion);
    
    });
    
    console.log("Correct sentence: " + userMessage);
    
    return response.status(200).send({ "correctSentence": userMessage, status: 200 });
    
    } else {
    
    return response.status(200).send({ "correctSentence": userMessage, status: 200 });
    
    }
    
    } catch (error) {
    
    console.log("IN THE CATCH OF BING SPELL CHECK.....");
    
    console.log(error);
    
    return response.status(500).send({ status: 0, message: "Oops, there might be something wrong with the internal system." });
    
    }
    
    });
    
    }
    
    }, 'message');
    
    };
    
    
    