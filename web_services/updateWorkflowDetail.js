var util = require('../routes/utility');
var constant = require('../routes/constants');
var workFlowModelPath = require('../Models/WorkFlowDetail');
var updateWorkFlowDetail = function(request, response) {
    console.log('inside update service');
    var requestBody = request.body;
    var workFlow = workFlowModelPath.workflowModel;
    var outputJson = {};
    try {
        if (requestBody.method == 'GET') {
            if (requestBody.key === null || requestBody.key === undefined || requestBody.key === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.url === null || requestBody.url === undefined || requestBody.url === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.path === null || requestBody.path === undefined || requestBody.path === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.responseModel === null || requestBody.responseModel === undefined || requestBody.responseModel === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.expectedOutput === null || requestBody.expectedOutput === undefined || requestBody.expectedOutput === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
        } else if (requestBody.method == 'POST') {
            if (requestBody.key === null || requestBody.key === undefined || requestBody.key === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.url === null || requestBody.url === undefined || requestBody.url === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.path === null || requestBody.path === undefined || requestBody.path === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.requestParameter === null || requestBody.requestParameter === undefined || requestBody.requestParameter === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.responseModel === null || requestBody.responseModel === undefined || requestBody.responseModel === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
            if (requestBody.expectedOutput === null || requestBody.expectedOutput === undefined || requestBody.expectedOutput === "") {
                return response.status(constant.BadRequest).send(util.invalidData);
            }
        } else {
            return response.status(constant.BadRequest).send(util.invalidData);
        }
        // var query = workFlow.update({ $set: { requestBody } })
        var query = workFlow.updateOne({
            key: requestBody.key
        }, {
            $set: {
                url: requestBody.url,

            }
        }, function(errupdate, updatedObj) {
            // var query = workFlow.updateOne({ key: requestBody.key }, { $set: { url: requestBody.url } }, { new: true });
            console.log("UPDATES RECORD ::::" + updatedObj);
            if (errupdate) {
                console.log('ERROR IS :::::' + errupdate);
                outputJson.message = errupdate
                return response.status(constant.InternalServerError).send(outputJson);
            } else {
                console.log('NO ERROR :::::::');
                console.log(updatedObj);
                if (updatedObj.nModified > 0) {
                    return response.status(constant.OK).send(util.successfullyUpdated);
                } else {
                    return response.status(constant.OK).send(util.recordAlreadyExisted);
                }
            }

        })
    } catch (error) {
        console.log('error is :' + error);
        outputJson.error = error;
        return res.status(constant.InternalServerError).send(outputJson);
    }

}
module.exports.updateWorkFlowDetail = updateWorkFlowDetail;