/*global
alert, confirm, console, prompt,require, module,const,process,__dirname
jslint devel: true
esversion: 6
*/
/*jslint node: true */
/*jshint esversion: 6 */

"use strict";
//coremodules
var express = require('express');
var http = require('http');
var path = require('path');
var cors = require('cors');
//npm modules 
var bodyParser = require('body-parser');
//others
var constant = require("./routes/constants");
var mongo_connection = require("./web_services/MongoConnection");
//GET ROUTES
var UserRoute = require("./routes/UserRoute");

var convo = require('./web_services/Convo');
var email = require('./web_services/email');
var CapabilityRoute = require("./routes/CapabilityMapperRoute");
var sessionRoute = require('./routes/SessionRoute');
var botRoute = require("./routes/bot");
// var bot = require("./skills/listen");

// var AnswerRoute = require("./routes/AnswerRoute");
// var IntentRoute = require("./routes/IntentRoute");
var IntelligenceEngineRoute = require("./routes/IntelligenceEngineRoute");
var AgentRoute = require("./routes/AgentRoute");
var fetchAnswer = require("./web_services/fetchAnswers");

var questionRoute = require('./routes/QuestionAnswerRoute');
var factory = require('./factory/factory');
// var cahceRoute = require('./routes/CacheRoute');
// var dialogFlow = require('./web_services/DialogFlowServices');  //not used
// var dialogflowWrapper = require('./web_services/DialogFlowWrapperServices');
// var branchingRoute = require('./routes/brandingRoute');
// var searchHistory = require('./web_services/SearchHistory'); //not used
var agentFeedbackRoute = require('./routes/agentFeedbackRoute');
var capabilityPoolRoute = require('./routes/capabilityPoolRoute');
var uploadIntentOntoDialogflow = require('./web_services/uploadIntent-admin');
var messageRoute = require('./routes/MessageRoute');
var searchAgentHistory = require('./web_services/searchAgentHistroy');
var bingSpellCheck = require('./web_services/bingSpellCheck');
var dump = require('./routes/dumpRoute');
var mongoCache = require('./web_services/checkInCache');

var parsonaRoute = require('./routes/PersonaRoute');


// all environments
// var apm = require('elastic-apm-node').start({



//     // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
//     serviceName: 'Chatbot',

//     // Use if APM Server requires a token

//     secretToken: '',

//     // Set custom APM Server URL (default: http://hjcdoelk.kpit.com:8200 <http://hjcdoelk.kpit.com:8200/> )

//     serverUrl: 'http://10.10.188.150:8200'

// });
var app = express();


app.use(cors());

app.set('port', process.env.PORT || 6002);
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());


//------------------For Invalid json 
app.use(function(err, req, res, next) {
    if (err) {
        console.log('*********Invalid Request data****** '+ err);
        console.log(req.body);
        return res.status(constant.BadRequest).send({ "status": constant.BadRequest, "message": 'Invalid Request Json' });
    } else {
        next();
    }
});


//------------GET SERVICES
app.get('/getActiveBot', botRoute.getActiveBotDetails);
app.get('/' , (req,res)=>{
    res.send('Hello');
})
//-----POST services
app.post("/getCapabilities", CapabilityRoute.getCapability);
app.post("/getRoomAvailabilityForUser", UserRoute.getRoomAvailabilityForUser);
app.post('/postConvo', convo.postConvo);
app.post('/getSessionInfo', sessionRoute.getSessionFromSessionId);
app.post('/doesSessionExists', sessionRoute.doesSessionExists);
app.post('/sendMailToHRWhenNoActiveAgent', email.sendMailToAgentWhenNoActiveAgent);
app.post('/mapCapabilityIntents', questionRoute.mapcababilitytointent);
app.post('/searchAppsFromES', factory.searchAppsFromES);
app.post('/createNewSkill', capabilityPoolRoute.createNewCapabilityFromPool);//not done (Admin)
app.post('/uploadIntentOntoDialogflow', uploadIntentOntoDialogflow.uploadIntentToDialogFlow); //not done(Admin)
app.post('/insertBulkQuesAns', questionRoute.insertBulkQuesAns);
var workflowDetails = require('./web_services/postWorkflowDetail');
var getDetailWorkflow = require('./web_services/getWorkflowDetails');
var deleteWorkflow = require('./web_services/deleteWorkflowDetail');
var updateData = require('./web_services/updateWorkflowDetail');
app.post('/insertData', workflowDetails.postWorkflowDetails);
app.get('/getWorkflowDetail/:key', getDetailWorkflow.getWorkflowDetail);
app.post('/deleteWorkFlow', deleteWorkflow.deleteWorkflowDetail);
app.post('/updateData', updateData.updateWorkFlowDetail);
app.post("/checkInMongo", mongoCache.getQuestionFromCache);


//------------GET SERVICES
// app.get("/getIntent", IntentRoute.getIntent);
// app.get('/getAllBrandingCompanies', branchingRoute.getAllBrandingCompanies);

//-----POST services
// app.get('/updateCache' , cahceRoute.updateCache);  //not done
// app.post("/postIntelligenceEngineInfo", IntelligenceEngineRoute.postIntelligenceEngineDetails);  //not done
app.post("/getIntelligenceEngineInfo", IntelligenceEngineRoute.getIntelligenceEngineForCapability);
// app.post("/getAccessToken", UserRoute.getAccessToken);  //not done
app.post("/fetchAnswers", fetchAnswer.getQuestionAndAnswersFromDialogFlowFromDB);
// app.post("/postTagsForQuestionId", AnswerRoute.addTags);   //not done
app.post("/postAgentDetails", AgentRoute.postAgentDetails);
app.post("/setAgentStatus", AgentRoute.setAgentStatus);
app.post("/getAgentByStatus", AgentRoute.getAgentByStatus);
app.post("/getAgentDetails", AgentRoute.getAgentDetails);
app.post("/getVerifiedAgents", AgentRoute.getVerifiedAgents);
// app.post("/searchThroughAgentHistory", searchHistory.searchHistory);  //not done
// app.post("/getSubcapability", CapabilityRoute.getSubCapability);  //not done
app.post("/postCapabilityDetails", CapabilityRoute.postCapabilityDetails); //not done
// app.post("/getSubCapabilitiesDetails", CapabilityRoute.getSubCapabilitiesDetails); //not reqd
app.post('/getHistoryForAgent', AgentRoute.getHistoryForAgent);
app.post('/sendMailToUserWithTheAnswer', email.sendMailToUserForTheAnswer);
app.post('/sendemailWhenUserDoesNotGiveFeedback', email.sendemailWhenUserDoesNotGiveFeedback); //not done
app.post("/postQuestionIntoDB", questionRoute.postQuestionIntoDB); //not done
app.post('/getUtterances', factory.getIntentUtternaces); //not done
// app.post('/updateDialogFlowIntent', dialogflowWrapper.updateDialogFlowIntent); //not done
// app.post('/getBrandingDetails', branchingRoute.getbrandingDetails); //not done
// app.post('/postBrandingDetails', branchingRoute.postbrandingDetails);  //not done
app.post('/postAgentFeedback', agentFeedbackRoute.postagentFeedback);//not done
app.post('/uploadIntentOntoDialogflow', uploadIntentOntoDialogflow.uploadIntentToDialogFlow); //not done

//=============================
app.post('/getAllMessagesFromContainer', messageRoute.getAllMessagesFromContainer);
// app.post('/searchAgentHistory', searchAgentHistory.searchAgentHistory);

app.post('/spellcheck' , bingSpellCheck.checkSpelling);
app.post('/updateLoc' , questionRoute.updateAnswerWithLoc);
app.post('/dumpData' , dump.dumpDataService);



//----------------------Vishakha------------------------
app.post('/insertBulkParasonaData',parsonaRoute.insertBulkParasonaData);
app.post('/getPersonaData',parsonaRoute.getPersonaData);
app.post('/deletePersonaData',parsonaRoute.deletePersonaData);
app.post('/insertPersonaData',parsonaRoute.insertPersonaData);

app.post('/updatePersonaData',parsonaRoute.updatePersonaData);


app.post('/mapSearchLinksWorkflow',questionRoute.mapSearchLinksWorkflow);









//----------------------------------------------


//===========================================Ruchira changes
//---------POST SERVICES
// app.post("/getResponseForQuestion", intentProvider.getResponseForQuestion);
// app.get("/getIntents", dialogFlow.getIntents);
// app.post("/postIntents", dialogFlow.postIntent);
// app.post("/updateIntent", dialogFlow.updateIntent);
// app.post("/bingSpellCheck", bingSpellCheck.checkSpelling);


//----Start listening for requests.
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    //------------Mongoose setup
    mongo_connection.buildConnectionWithMongoDb();
});

