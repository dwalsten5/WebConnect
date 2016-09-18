/**
 * Created by Phani on 9/18/2016.
 */
import "./logout.html";
import {FlowRouter} from "meteor/kadira:flow-router";

Template.logout.onRendered(function () {
    Meteor.logout(function (err) {
        FlowRouter.go("/");
        if (err) {
            console.log(err);
        }
    });
});