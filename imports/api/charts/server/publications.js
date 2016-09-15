/**
 * Created by Phani on 7/24/2016.
 */
/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {findMostDownloadedCharts} from "/imports/api/charts/methods.js";

Meteor.publish("topCharts", function (n) {
    findMostDownloadedCharts.validate(n);
    return findMostDownloadedCharts.run(n);
});