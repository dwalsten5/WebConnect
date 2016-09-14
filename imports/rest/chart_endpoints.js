/**
 * Created by Phani on 9/14/2016.
 */
import {RestAPI} from "/imports/rest/restivus.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getChartsInCatalog} from "/imports/api/charts/methods.js";

/**
 * Returns the flowchart catalog.
 */
RestAPI.addRoute("v1/catalog", {
    get: function () {
        // This object has the mongo form of the flowcharts, ensure it matches the rest model.
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