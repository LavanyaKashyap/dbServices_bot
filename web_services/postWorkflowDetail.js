var response = require('response');
var workflowDetail = require('../Models/WorkFlowDetail');
var constant = require('../routes/constants');
var util = require('../routes/utility');
// var mongoose = require('mongoose');
var mongoose = require('mongoose');

function postWorkflowDetails(request, response) {
    var outputJson = {};
    var flowDetail = workflowDetail.workflowModel;
    var workflowObj = {};
    try {
        var requestBody = request.body;
        console.log(requestBody);
        // var workFlowObj = new flowDetail(requestBody);
        if (requestBody.method === 'GET') {
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
        } else if (requestBody.method === 'POST') {
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
        workflowObj = requestBody;
        // mongoose.Types.ObjectId(stringId);
        var workFlowObj = new flowDetail(workflowObj);
        console.log('*************************************');
        console.log(mongoose.Types.ObjectId() );
        console.log('*************************************');
        // util.duplicaterecordsExists({ _id: requestBody.key }, flowDetail, function(isduplicateRecord) {
        //     if (isduplicateRecord === "true") {
        //         console.log('DUPLICATE RECORDS EXISTS FOR WORKFLOW DETAIL KEY');
        //         return response.status(constant.BadRequest).send(util.recordAlreadyExisted);
        //     } else if (isduplicateRecord === "false") {
        //         workFlowObj.save((workFlowErr, workflowSuccess) => {
        //             if (workFlowErr) {
        //                 outputJson = Object.assign({ ErrorCode: err.message }, util.error);
        //                 return response.status(constant.InternalServerError).send(outputJson);
        //             } else {
        //                 return response.status(constant.OK).send(util.successfullyInserted);
        //             }
        //         });
        //     } else {
        //         return response.status(constant.InternalServerError).send(util.error);
        //     }
        // })
    } catch (error) {
        console.log("ERROR IN CATCH OF postWorkflowDetails " + error);
        outputJson.message = error;
        return response.status(constant.InternalServerError).send(outputJson);

    }
}
module.exports.postWorkflowDetails = postWorkflowDetails;