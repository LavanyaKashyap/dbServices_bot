var utility = require('../routes/utility');
var constant = require('../routes/constants');
var factory = require('../factory/factory');
var uploadIntentToDialogFlow = function(req,res){

    console.log('INSIDE uploadIntentToDialogFlow');
    var reqBody = req.body;
    var outputJson = {};
    utility.validateParams(res,reqBody,function(flag){
      //dont need to cheek the flag value since when the json doesnot have a specific element then 
    console.log(reqBody.utterances); 
    var utterances = reqBody.utterances;
    var arrOfUtternace = utterances.split(',');
    console.log(arrOfUtternace);
    formPayloadForIntentInsertion({utternaces : arrOfUtternace},function(err,result){
        if(err){
            console.log('ERROR IN formPayloadForIntentInsertion CALLBACK'+err);
            return res.status(constant.InternalServerError).send(err);
        }else{
            factory.UploadIntentIntoDialogFlowServiceCall({trainingPhrases : result , intent :reqBody.intent, project_id : reqBody.project_id , authToken : reqBody.authToken } , function(err,uploadRes){
                if(err){
                    console.log('@@@@@@@@@@@@@@@@@@@@@');
                    return res.status(constant.InternalServerError).send(err);
                }else{
                    console.log('****************');
                    outputJson.message = 'Intent Inserted successfully';
                    return res.status(constant.OK).send(outputJson);
                }
            });
        }
    });
    },'intent' , 'utterances' , 'project_id' , 'authToken');
};

var formPayloadForIntentInsertion = function(payload,cb){  //{"intent" : "Rest Room Keys" , "utterances": [How can I get the parking clearance, about parking clearance]}

try{
    console.log('INSIDE formPayloadForIntentInsertion');
    var trainingPhrases = [];
    var utternacesArr = payload.utternaces;
    console.log('#$######################');
    console.log(utternacesArr);
    utternacesArr.forEach(element => {
      var insertJosn =  {
            "type": "EXAMPLE",
            "parts": [
              {
                "text": element
              }
            ]
          };
    trainingPhrases.push(insertJosn);
    });
    if(trainingPhrases.length === utternacesArr.length){
        cb(null , trainingPhrases);
    }else{

        cb('Length of training phrases and utterances is not equal' , null);
    }

}catch(error){
    console.log('ERROR :::'+error);
    cb(error,null);

}

    
} ;

module.exports.uploadIntentToDialogFlow = uploadIntentToDialogFlow
