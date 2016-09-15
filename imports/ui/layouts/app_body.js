/**
 * app-body is the main template that most other pages reside in. It provides standard
 * UI stuff such as the navbar and footer.
 */

import {Meteor} from "meteor/meteor";
import "./app_body.html";
import "../components/app-loading/app_loading";

Template.app_body.helpers({
    'isSignedIn': function () {
        return Meteor.userId() != null;
    }
});

Template.app_body.events({
    'click #logout_link': function (evt) {
        evt.preventDefault();
        Meteor.logout();
    }
});