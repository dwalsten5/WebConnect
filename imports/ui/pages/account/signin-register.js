/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";
import {countriesByName} from "/imports/utils/countries";
import "./signin-register.html";
import * as User from "/imports/api/users/users.js";

signinError   = new ReactiveVar(false);
registerError = new ReactiveVar(false);
registerMsg   = new ReactiveVar('');

Template.signin_register.helpers({
    'signinError': function () {
        return signinError.get();
    },
    'registerError': function () {
        return registerError.get();
    },
    'registerMsg': function () {
        return registerMsg.get();
    },
    'signingin': function () {
        return Meteor.loggingIn();
    },
    'countries': function () {
        return _.keys(countriesByName);
    }
});

Template.signin_register.events({
    'click #signin_btn': function (evt, template) {
        evt.preventDefault();
        let username = template.find('#signin_username').value;
        let password = template.find('#signin_password').value;
        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                signinError.set(true);
            } else {
                signinError.set(false);
            }
        });
    },
    'click #register_btn': function (evt, template) {
        evt.preventDefault();
        let name      = template.find('#register_name').value;
        let org       = template.find('#register_organization').value;
        let country   = template.find('#register_country').value;
        let email     = template.find('#register_email').value;
        let username  = template.find('#register_username').value;
        let password  = template.find('#register_password').value;
        let cpassword = template.find('#register_c_password').value;

        let valid = true;
        if (cpassword !== password) {
            valid = false;
            registerError.set(true);
            registerMsg.set(TAPi18n.__("mismatch_passwords"));
        }
        if (_.isEmpty(name) || _.isEmpty(org) || _.isEmpty(country) || _.isEmpty(password)) {
            valid = false;
            registerError.set(true);
            registerMsg.set(TAPi18n.__("empty_fields"));
        }

        if (valid) {

            let profile                              = {};
            profile[User.ORGANIZATION]               = org;
            profile[User.NAME]                       = name;
            profile[User.COUNTRY]                    = {};
            profile[User.COUNTRY][User.NAME]         = country;
            profile[User.COUNTRY][User.COUNTRY_CODE] = countriesByName[country];

            Accounts.createUser({
                username: username,
                email: email,
                password: password,
                profile: profile
            }, function (err) {
                if (err) {
                    registerError.set(true);
                    registerMsg.set(TAPi18n.__("try_register_again"));
                } else {
                    registerError.set(false);
                }
            });
        }
    }
});