/**
 * Created by Phani on 9/18/2016.
 */
import {Random} from "meteor/random";
import * as Comments from "./comments.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChart} from "/imports/api/charts/methods.js";
import * as Graphs from "/imports/api/graphs/graphs.js";

/**
 * Finds a comment by ID in a chart or a child node.
 * @type {ValidatedMethod}
 */
export const getComment = new ValidatedMethod({
    name: "comments.getComment",
    validate: function () {
        // Nothing to validate
    },
    run({chartId, commentId}){
        let comment = getChartComment(chartId, commentId);
        if (!comment) {
            // Not a chart document, maybe it's a node document
            comment = getNodeComment(chartId, commentId);
        }

        return comment;
    }
});

function getNodeComment(chartId, commentId) {
    let selector = {};
    let proj     = {};

    selector[Graphs.GRAPH_ID]                     = getChart.call(chartId)[Charts.GRAPH_ID];
    selector[Graphs.NODES.concat(".").concat(Graphs.NODE_COMMENTS)
        .concat(".").concat(Comments.COMMENT_ID)] = commentId;

    proj[Graphs.NODES.concat(".").concat(Graphs.NODE_COMMENTS).concat(".$")] = 1;

    let result = Graphs.Graphs.findOne(selector, {fields: proj});
    if (result) {
        // Found the node, find the comment now
        let comments = result[Graphs.NODES][0][Graphs.NODE_COMMENTS];
        comments     = _.filter(comments, function (cmnt) {
            return cmnt[Comments.COMMENT_ID] == commentId;
        });
        return comments[0];
    }
    return null;
}

function getChartComment(chartId, commentId) {
    let selector                                                      = {};
    let proj                                                          = {};
    selector[Charts.CHART_ID]                                         = chartId;
    selector[Charts.COMMENTS.concat(".").concat(Comments.COMMENT_ID)] = commentId;
    proj[Charts.COMMENTS.concat(".$")]                                = 1;

    let result = Charts.Charts.findOne(selector, {fields: proj});
    if (result) {
        // Pick out the comment
        return result[Charts.COMMENTS][0];
    }
    return null;
}

export const deleteComment = new ValidatedMethod({
    name: "comments.deleteComment",
    validate: new SimpleSchema({
        chartId: {
            type: SimpleSchema.RegEx.Id
        },
        commentId: {
            type: SimpleSchema.RegEx.Id
        }
    }).validator(),
    run({chartId:chartId, commentId:commentId}){
        if (!getChart.call(chartId)) {
            return false;
        }
        let comment = getComment.call({chartId, commentId});
        if (!comment) {
            return false;
        }
        if (!deleteChartComment(chartId, commentId)) {
            return deleteNodeComment(chartId, commentId);
        }
        return true;
    }
});

function deleteNodeComment(chartId, commentId) {
    // Couldn't get the $pull modifier to work,
    // so just update all of the nodes ;(

    let chart = getChart.call(chartId);
    if (!chart) {
        return false;
    }

    let graphId  = chart[Charts.GRAPH_ID];
    let selector = {};
    let fields   = {};

    selector[Graphs.GRAPH_ID]         = graphId;
    selector[Graphs.NODES.concat(".")
        .concat(Graphs.NODE_COMMENTS).concat(".")
        .concat(Comments.COMMENT_ID)] = commentId;
    fields[Graphs.NODES.concat(".$")] = 1;

    let limitedGraph = Graphs.Graphs.findOne(selector, {fields: fields});
    if (limitedGraph) {
        let node        = limitedGraph[Graphs.NODES][0];
        let newComments = _.reject(node[Graphs.NODE_COMMENTS], function (cmnt) {
            return cmnt[Comments.COMMENT_ID] == commentId;
        });

        let set                                                      = {};
        set[Graphs.NODES.concat(".$.").concat(Graphs.NODE_COMMENTS)] = newComments;

        Graphs.Graphs.update(selector, {
            $set: set
        });
        return true;
    }
    return false;
}

function deleteChartComment(chartId, commentId) {
    // Couldn't get the $pull modifier to work so
    // the whole chart object is just updated ;(

    let chart = getChart.call(chartId);
    if (!chart) {
        return null;
    }
    let newComments = _.reject(chart[Charts.COMMENTS], function (cmnt) {
        return cmnt[Comments.COMMENT_ID] == commentId;
    });
    if (newComments.length != chart[Charts.COMMENTS].length) {
        // Something removed
        let set              = {};
        set[Charts.COMMENTS] = newComments;
        Charts.Charts.update({_id: chartId}, {
            $set: set
        });
        return true;
    }
    return false;
}

/**
 * Inserts a comment into a chart or node. If nodeId is not defined,
 * then the comment is posted to the chart. Returns the id of the new
 * comment on success and null on failure.
 *
 * @param comment The comment object containing text, attachment (optional), and owner
 * @param chartId the ID of the chart to comment on
 * @param nodeId If defined, the node in the graph to comment on.
 *
 * @type {ValidatedMethod}
 */
export const insertComment = new ValidatedMethod({
    name: "comments.insertComment",
    validate: function ({comment:cmnt, chartId:chartId, nodeId:nodeId}) {
        Comments.Comments.schema.clean(cmnt);
        Comments.Comments.schema.validate(cmnt);

        new SimpleSchema({
            chartId: {
                type: SimpleSchema.RegEx.Id
            },
            nodeId: {
                type: SimpleSchema.RegEx.Id,
                optional: true
            }
        }).validate({
            chartId: chartId,
            nodeId: nodeId
        })
    },
    run({comment:cmnt, chartId:chartId, nodeId:nodeId}) {
        Comments.Comments.schema.clean(cmnt);
        if (!getChart.call(chartId)) {
            return null;
        }
        if (nodeId) {
            return insertNodeComment(cmnt, chartId, nodeId);
        }
        else {
            return insertChartComment(cmnt, chartId)
        }
    }
});

function insertNodeComment(cmnt, chartId, nodeId) {
    let graphId  = getChart.call(chartId)[Charts.GRAPH_ID];
    let selector = {};
    let push     = {};

    selector[Graphs.GRAPH_ID]                                     = graphId;
    selector[Graphs.NODES.concat(".").concat(Graphs.NODE_ID)]     = nodeId;
    push[Graphs.NODES.concat(".$.").concat(Graphs.NODE_COMMENTS)] = cmnt;

    let ret = Graphs.Graphs.update(selector, {
        $push: push
    });
    if (ret > 0) {
        return cmnt[Comments.COMMENT_ID];
    }
    return null;
}

function insertChartComment(cmnt, chartId) {
    let push              = {};
    push[Charts.COMMENTS] = cmnt;

    let ret = Charts.Charts.update({_id: chartId}, {
        $push: push
    });
    if (ret > 0) {
        return cmnt[Comments.COMMENT_ID];
    }
    return null;
}