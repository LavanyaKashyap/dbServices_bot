var capabilityPoolModel = require('../Models/capabilityPool');
var capabilityMapperModel = require('../Models/CapabilityMapperModel');
var constant = require('../routes/constants');
var util = require('../routes/utility');
var engineRoute = require('../routes/IntelligenceEngineRoute');
var createNewCapabilityFromPool = function(req,res){

console.log('INSIDE createNewCapabilityFromPool');
var outputJson = {};
var saveObj = {};

try{
    util.validateParams(res,req.body ,function(flag){
        getRandomCapabilityFromPool(req.body,function(err,randomCapability){
            console.log(randomCapability);
            console.log('##############################################');

            if(err){
                console.log('error in getRandomCapabilityFromPool');
                outputJson.message = err;
                return res.status(constant.InternalServerError).send(outputJson);
            }else{
                console.log(randomCapability);
                randomCapability.capability_name = req.body.skillname;
                console.log('123456543212345432***********************************************');
                console.log(randomCapability);
                console.log('***********************************************');
                saveObj.capability_id = randomCapability.capability_id;
                saveObj.capability_name = randomCapability.capability_name;
                saveObj.bot = req.body.bot;
                saveObj.capability_group_emailid = req.body.capability_group_emailid;
                saveObj.engine_id = randomCapability.engine_id;
                var capability = new capabilityMapperModel.CapabilityObj(saveObj);
                capability.save(function(err,savedNewCapability){
                    if(err){
                        console.log('ERROR WHILE SAVING TO CAPABILITY');
                        outputJson.message = err;
                        return res.status(constant.InternalServerError).send(outputJson);
                    }else{
                        console.log('SAVED THE NEW CAPABILTY ');
                        engineRoute.getEngine({_id : randomCapability.engine_id }, function(err,result){
                           if(err){
                            console.log(err);
                            outputJson.message = err;
                            return res.status(constant.InternalServerError).send(outputJson);
                           }else{
                            outputJson.engineDetails = result.Project_ids;
                            outputJson.newskill = savedNewCapability;
                            return res.status(constant.OK).send(outputJson);
                           }
                           

                        });
                      
                    }
                });

            }
            
            });
    },'skillname' , 'bot' , 'capability_group_emailid');
  
}catch(error){
    console.log('error in catch'+error);
    outputJson.message = error;
    return res.status(constant.InternalServerError).send(outputJson);
}



}


var getRandomCapabilityFromPool = function(req,cb){
    console.log('INSIDE getRandomCapabilityFromPool');
    // var capabilityPool = new capabilityPoolModel.CapabilityPoolObj(req);
    var capabilityPool = capabilityPoolModel.CapabilityPoolObj;


// capabilityPool.save(req,function(err,result ){
// console.log(err);
// console.log(result);
// });
    var query =  capabilityPool.findOneAndRemove({}).select("-_id");
    // var query =  capabilityPool.findOne({}).select("-_id");

    query.exec(function(err,removedObject){
        if(err){
            console.log('GOT A ERROR IN getRandomCapabilityFromPool'+err);
            cb(err,null);
        }else{
            console.log('NO ERROR IN getRandomCapabilityFromPool and returning the object');
            console.log(removedObject);
            cb(null,removedObject);
        }

    });

};




module.exports.createNewCapabilityFromPool = createNewCapabilityFromPool;