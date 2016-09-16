/**
 * Created by Phani on 9/15/2016.
 */
import "./user_charts.html";
import "/imports/ui/components/app_loading/app_loading.js";
import * as Charts from "/imports/api/charts/charts.js";
import {getCurrentUserCharts} from "/imports/api/charts/methods.js";

Template.user_charts.onCreated(function () {
    this.subscribe("userCharts");
});

Template.user_charts.helpers({
    hasCharts: function () {
        return getCurrentUserCharts.call().length > 0;
    },
    userCharts: function () {
        return getCurrentUserCharts.call();
    },
    getChartName: function (chart) {
        return chart[Charts.NAME];
    },
    getChartDescription: function (chart) {
        return chart[Charts.DESCRIPTION];
    }
});