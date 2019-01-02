var constant = require('../routes/constants');
var util = require('../routes/utility');
var workFlowModelPath = require('../Models/WorkFlowDetail');
var deleteWorkflowDetail = function(request, response) {
    var keyVal = request.body.key;
    var workFlow = workFlowModelPath.workflowModel;
    try {
        workFlow.remove({ key: keyVal }, function(err, result) {
            try {
                if (result === null || result === undefined || result === "") {
                    console.log("Result is : " + result);
                    return response.status(constant.BadRequest).send(util.noData);
                } else {
                    console.log('inside else');
                    console.log(typeof(result));
                    if (result.length == 0) {
                        console.log("Result is : " + result);
                        return response.status(constant.BadRequest).send(util.noData);
                    } else {
                        // outputJson = Object.assign({ workFlow: result }, util.success);
                        // console.log(outputJson);
                        // return response.status(constant.OK).send(outputJson);
                        return response.status(constant.OK).send(util.successfullyDeleted);

                    }
                }
            } catch (err) {
                console.log("Error -----" + err);
                outputJson = Object.assign({ ErrorCode: error }, util.error);
                return response.status(constant.BadRequest).send(outputJson);
            }
        });

    } catch (error) {
        console.log("there is an error: " + error);
        outputJson = Object.assign({ ErrorCode: error }, util.error);
        return response.status(constant.BadRequest).send(outputJson);
    }

}
module.exports.deleteWorkflowDetail = deleteWorkflowDetail;