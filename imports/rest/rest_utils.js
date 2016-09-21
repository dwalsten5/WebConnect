/**
 * Created by Phani on 9/14/2016.
 *
 * This file provides methods to ensure proper structure of
 * returned objects in the REST interface. This maps the mongo
 * objects into the REST format. It is mostly similar with some differences.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import * as Comments from "/imports/api/comments/comments.js";
import {getGraph} from "/imports/api/graphs/methods.js";
import {getAllChartResources} from "/imports/api/charts/methods";

/**
 * Names of the flowchart REST json fields.
 */
export const FLOWCHART_ID           = "_id";
export const FLOWCHART_NAME         = "name";
export const FLOWCHART_DESCRIPTION  = "description";
export const FLOWCHART_UPDATED_DATE = "updatedDate";
export const FLOWCHART_VERSION      = "version";
export const FLOWCHART_OWNER        = "owner";
export const FLOWCHART_GRAPH        = "graph";
export const FLOWCHART_ALL_RES      = "all_res";
export const FLOWCHART_COMMENTS     = "comments";
export const FLOWCHART_SCORE        = "score";
export const FLOWCHART_RESOURCES    = "resources";
export const FLOWCHART_IMAGE        = "image";
export const FLOWCHART_TYPE         = "type";

/**
 * Names of the graph REST json fields.
 */
export const GRAPH_NODES          = "vertices";
export const GRAPH_EDGES          = "edges";
export const GRAPH_NODE_ID        = "_id";
export const GRAPH_NODE_NAME      = "name";
export const GRAPH_NODE_DETAILS   = "details";
export const GRAPH_NODE_RESOURCES = "resources";
export const GRAPH_NODE_IMAGES    = "images";
export const GRAPH_NODE_COMMENTS  = "comments";
export const GRAPH_EDGE_ID        = "_id";
export const GRAPH_EDGE_NAME      = "_label";
export const GRAPH_EDGE_SOURCE    = "_outV";
export const GRAPH_EDGE_TARGET    = "_inV";
export const GRAPH_EDGE_DETAILS   = "details";

/**
 * Names of the comment REST json fields.
 */
export const COMMENT_ID           = "_id";
export const COMMENT_OWNER        = "owner";
export const COMMENT_TEXT         = "text";
export const COMMENT_CREATED_DATE = "createdDate";
export const COMMENT_ATTACHMENT   = "attachment";

/**
 * Converts the MongoDB representation of a chart into
 * what is used by the REST interface.
 * @param rawChart
 */
export const formatChartForREST = function (rawChart) {
    let chart                     = {};
    chart[FLOWCHART_ID]           = rawChart[Charts.CHART_ID];
    chart[FLOWCHART_NAME]         = rawChart[Charts.NAME];
    chart[FLOWCHART_DESCRIPTION]  = rawChart[Charts.DESCRIPTION];
    chart[FLOWCHART_UPDATED_DATE] = rawChart[Charts.UPDATED_DATE];
    chart[FLOWCHART_VERSION]      = rawChart[Charts.VERSION];
    chart[FLOWCHART_OWNER]        = rawChart[Charts.OWNER];
    chart[FLOWCHART_RESOURCES]    = rawChart[Charts.RESOURCES];
    chart[FLOWCHART_TYPE]         = rawChart[Charts.TYPE];
    chart[FLOWCHART_IMAGE]        = rawChart[Charts.IMAGE];
    chart[FLOWCHART_SCORE]        = rawChart[Charts.UPVOTED_IDS].length - rawChart[Charts.DOWNVOTED_IDS].length;
    chart[FLOWCHART_GRAPH]        = formatGraphForREST(getGraph.call(rawChart[Charts.GRAPH_ID]));
    chart[FLOWCHART_ALL_RES]      = getAllChartResources.call(rawChart[Charts.CHART_ID]);

    chart[FLOWCHART_COMMENTS] = _.map(rawChart[Charts.COMMENTS], function (rawComment) {
        return formatCommentForREST(rawComment);
    });

    if (!chart[FLOWCHART_IMAGE]) {
        chart[FLOWCHART_IMAGE] = null;
    }

    return chart;
};

/**
 * Converts the MongoDB representation of a graph into
 * what is used by the REST interface.
 * @param rawGraph
 */
export const formatGraphForREST = function (rawGraph) {
    let graph          = {};
    graph[GRAPH_NODES] = _.map(rawGraph[Graphs.NODES], function (rawNode) {
        return formatNodeForREST(rawNode);
    });
    graph[GRAPH_EDGES] = _.map(rawGraph[Graphs.EDGES], function (rawEdge) {
        return formatEdgeForREST(rawEdge);
    });
    return graph;
};

function formatNodeForREST(rawNode) {
    let node                   = {};
    node[GRAPH_NODE_ID]        = rawNode[Graphs.NODE_ID];
    node[GRAPH_NODE_NAME]      = rawNode[Graphs.NODE_NAME];
    node[GRAPH_NODE_DETAILS]   = rawNode[Graphs.NODE_DETAILS];
    node[GRAPH_NODE_RESOURCES] = rawNode[Graphs.NODE_RESOURCES];
    node[GRAPH_NODE_IMAGES]    = rawNode[Graphs.NODE_IMAGES];
    node[GRAPH_NODE_COMMENTS]  = _.map(rawNode[Charts.COMMENTS], function (rawComment) {
        return formatCommentForREST(rawComment);
    });
    return node;
}

function formatEdgeForREST(rawEdge) {
    let edge                 = {};
    edge[GRAPH_EDGE_ID]      = rawEdge[Graphs.EDGE_ID];
    edge[GRAPH_EDGE_NAME]    = rawEdge[Graphs.EDGE_NAME];
    edge[GRAPH_EDGE_SOURCE]  = rawEdge[Graphs.EDGE_SOURCE];
    edge[GRAPH_EDGE_TARGET]  = rawEdge[Graphs.EDGE_TARGET];
    edge[GRAPH_EDGE_DETAILS] = rawEdge[Graphs.EDGE_DETAILS];
    return edge;
}

function formatCommentForREST(rawComment) {
    let comment                   = {};
    comment[COMMENT_ID]           = rawComment[Comments.COMMENT_ID];
    comment[COMMENT_OWNER]        = rawComment[Comments.OWNER];
    comment[COMMENT_TEXT]         = rawComment[Comments.TEXT];
    comment[COMMENT_CREATED_DATE] = rawComment[Comments.CREATED_DATE];
    comment[COMMENT_ATTACHMENT]   = rawComment[Comments.ATTACHMENT];
    if (!comment[COMMENT_ATTACHMENT]) {
        comment[COMMENT_ATTACHMENT] = null;
    }
    return comment;
}