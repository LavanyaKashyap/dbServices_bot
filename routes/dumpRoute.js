var dumpModel = require('../Models/dumpModel');
var constant = require('./constants');
var dumpData = function (dumpModelToStore,callback) {
    console.log('INSIDE DUMP');
    var dumpObj = new dumpModel.dumpObject(dumpModelToStore);

    dumpObj.save(function (err, result) {
        if (err) {
            console.log('ERROR WHILE STORING DUMP' + err);
            callback(err,null);
        } else {
            console.log('NO ERROR .....DUMP IS STORED');
        }

    });

};

var dumpDataService = (req,res)=>{
console.log(`INSIDE DUMP SERVICE `);
var outputJson = {};
try {
    var reqBody = req.body;
    dumpData(reqBody);
} catch (error) {
    console.log(`ERROR INSIDE CATCH BLOCK ${error}`);
    outputJson.message = `ERROR IS CATCH ${error}`;
    return res.status(constant.InternalServerError).send(outputJson)
}
}

module.exports = {
    dumpData, 
    dumpDataService
}