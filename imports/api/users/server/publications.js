/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {Users} from "../users.js";

Meteor.publish('users.currentUser', function () {
    return Users.find({_id: this.userId});
});