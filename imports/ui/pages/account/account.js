/**
 * Created by Phani on 7/23/2016.
 */
import "./account.html";
import "./signin-register.js";

Template.account.helpers({
    'isSignedIn': function () {
        return Meteor.userId() != null;
    }
});
