
var agentModel = require('../Models/AgentModel');
var messageModel = require('../Models/MessageModel');
var sessionModel = require('../Models/SessionModel');


var searchAgentHistory = function(req,res){
    console.log('INSIDE searchAgentHistory');

    var message = messageModel.messageObject;
    var session = sessionModel.SessionObject;
    var agent = agentModel.AgentObj;
    var x = ["pranalig", "shabnamm"];
    // agent.find({agent_username : 'pranalig'}).select('emp_id -_id').populate({path : 'sessions'}).exec(function(err,result){
        agent.find({agent_username : 'pranalig'}).populate({path: 'sessions' , select: '' }).exec(function(err,result){

        console.log(result);
        if(err){
            console.log(err);
            return res.send(err);
        }else{
            console.log(result);
            return res.send(result);
        }
    });
   


};

module.exports.searchAgentHistory = searchAgentHistory;