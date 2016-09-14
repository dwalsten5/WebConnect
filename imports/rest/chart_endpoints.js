/**
 * Created by Phani on 9/14/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog, getChart, getCharts} from "/imports/api/charts/methods.js";

/**
 * Returns the flowchart catalog.
 */
RestAPI.addRoute("v1/catalog", {
    get: function () {
        // This object has the mongo form of the flowcharts, ensure it matches the rest model.
        console.log("GET v1/catalog");
        let rawChartsInCatalog = getChartsInCatalog.call();
        let charts             = _.map(rawChartsInCatalog, function (chart) {
            return _.pick(chart, "_id", Charts.NAME,
                Charts.DESCRIPTION, Charts.OWNER,
                Charts.UPDATED_DATE, Charts.VERSION);
        });
        return {
            flowcharts: charts
        }
    }
});

/**
 * Returns a flowchart by id.
 */
RestAPI.addRoute("v1/chart/:id", {
    get: function () {
        let id = this.urlParams.id;
        console.log("GET v1/chart/" + id);

        let chart = getChart.call(id);
        if (!chart) {
            return {
                statusCode: 404,
                body: "No chart with id " + id + " found"
            };
        }
        return chart;
    }
});

/**
 * Returns multiple flowcharts by id.
 */
RestAPI.addRoute("v1/charts/:ids", {
    get: function () {
        let ids = this.urlParams.ids;
        console.log("GET v1/charts/" + ids);

        let charts = getCharts.call(ids.split(","));
        return {
            flowcharts: charts
        };
    }
});