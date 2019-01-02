"use strict"
// schema for workflow details
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkflowDetailSchema = Schema({
    // key: { type: String, required: true },
        url: { type: String, required: true },
        path: { type: String, required: true },
        method: { type: String, required: true },
        isActionable: { type: Boolean, required: true, default: false },
        requestParameter: { type: Schema.Types.Mixed },
        headers: { type: Schema.Types.Mixed },
        queryParameter: { type: Schema.Types.Mixed },
        responseModel: { type: Schema.Types.Mixed, required: true },
        expectedOutput: [{ type: String, required: true }]
});
var workflowModel = mongoose.model('WorkflowDetail', WorkflowDetailSchema);
module.exports.workflowModel = workflowModel;