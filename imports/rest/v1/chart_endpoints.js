/**
 * Created by Phani on 9/14/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog, getChart, getCharts, incrementChartDownload} from "/imports/api/charts/methods.js";
import * as RESTUtils from "/imports/rest/rest_utils.js";

const RESPONSE_STATUS         = "status";
const RESPONSE_MESSAGE        = "message";
const RESPONSE_DATA           = "data";
const RESPONSE_STATUS_SUCCESS = "success";
const RESPONSE_STATUS_ERROR   = "error";

/**
 * Returns the flowchart catalog.
 */
RestAPI.addRoute("catalog", {
    get: function () {
        console.log("GET v1/catalog");
        let rawChartsInCatalog = getChartsInCatalog.call();

        // For each chart in the array, convert to REST format and omit the graph field
        let charts = _.map(rawChartsInCatalog, function (chart) {
            return _.omit(RESTUtils.formatChartForREST(chart), RESTUtils.FLOWCHART_GRAPH);
        });

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
        response[RESPONSE_DATA]   = {
            flowcharts: charts
        };
        return response;
    }
});

/**
 * Returns a flowchart by id.
 */
RestAPI.addRoute("chart/:id", {
    get: function () {
        let id = this.urlParams.id;
        console.log("GET v1/chart/" + id);

        let chart = getChart.call(id);
        if (!chart) {
            let response               = {};
            response[RESPONSE_STATUS]  = RESPONSE_STATUS_ERROR;
            response[RESPONSE_MESSAGE] = "The given chart id wasn't found.";
            return {
                statusCode: 404,
                body: response
            };
        }
        // New chart download, increment download
        incrementChartDownload.call(id);
        chart = RESTUtils.formatChartForREST(chart);

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
        response[RESPONSE_DATA]   = {
            flowchart: chart
        };
        return response;
    }
});

/**
 * Returns multiple flowcharts by id.
 */
RestAPI.addRoute("charts", {
    post: function () {
        let ids = this.bodyParams.ids;
        console.log("POST v1/charts/ with ids: " + ids);

        let charts   = getCharts.call(ids);
        charts       = _.map(charts, function (chart) {
            // New chart download, increment download
            incrementChartDownload.call(chart[Charts.CHART_ID]);
            return RESTUtils.formatChartForREST(chart);
        });
        let good_ids = _.pluck(charts, Charts.CHART_ID);
        let bad_ids  = _.difference(ids, good_ids);

        let response              = {};
        response[RESPONSE_STATUS] = RESPONSE_STATUS_SUCCESS;
        response[RESPONSE_DATA]   = {
            bad_ids: bad_ids,
            flowcharts: charts
        };
        return response;
    }
});