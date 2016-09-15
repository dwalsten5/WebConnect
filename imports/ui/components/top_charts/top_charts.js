/**
 * Created by Phani on 9/15/2016.
 */

import "./top_charts.html";
import "/imports/ui/components/app-loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";
import {findMostDownloadedCharts} from "/imports/api/charts/methods.js";

const NUM_TOP_CHARTS = 10;

Template.top_charts.onCreated(function () {
    this.subscribe("topCharts", NUM_TOP_CHARTS);
});

Template.top_charts.helpers({
    topCharts: function () {
        return findMostDownloadedCharts.call(NUM_TOP_CHARTS).fetch();
    },
    getChartName: function (chart) {
        return chart[Charts.NAME];
    },
    getChartDescription: function (chart) {
        return chart[Charts.DESCRIPTION];
    }
});