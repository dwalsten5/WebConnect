/**
 * Created by Phani on 9/14/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getGraph} from "/imports/api/graphs/methods.js";

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
export const GRAPH_EDGE_ID        = "_id";
export const GRAPH_EDGE_NAME      = "_label";
export const GRAPH_EDGE_SOURCE    = "_outV";
export const GRAPH_EDGE_TARGET    = "_inV";
export const GRAPH_EDGE_DETAILS   = "details";

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
    chart[FLOWCHART_GRAPH]        = formatGraphForREST(getGraph.call(rawChart[Charts.GRAPH_ID]));
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