/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Users} from "./users.js";

export const currentUser = function () {
    return Users.findOne({_id: Meteor.userId()});
};