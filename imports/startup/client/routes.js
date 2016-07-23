/**
 * Created by Phani on 7/23/2016.
 */
import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "../../ui/layouts/app-body.js";
import "../../ui/pages/home.js";

// Import templates

FlowRouter.route("/", {
    name: 'App.home',
    action() {
        BlazeLayout.render('app_body', {main: 'home'});
    },
});