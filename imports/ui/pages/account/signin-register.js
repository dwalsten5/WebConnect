/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import "./signin-register.html";

signinError = new ReactiveVar(false);

Template.signin_register.helpers({
    'signinError': function () {
        return signinError.get();
    },
    'signingin': function () {
        return Meteor.loggingIn();
    }
});

Template.signin_register.events({
    'click #signin_btn': function (evt, template) {
        evt.preventDefault();
        let username = template.find("#signin_username").value;
        let password = template.find("#signin_password").value;
        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                signinError.set(true);
            } else {
                signinError.set(false);
            }
        });
    }
});