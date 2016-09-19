/**
 * Created by Phani on 9/18/2016.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Random} from "meteor/random";

// Constants for document field names
export const COMMENT_ID   = "_id";
export const OWNER        = "owner";
export const TEXT         = "text";
export const CREATED_DATE = "createdDate";
export const ATTACHMENT   = "attachment";

export const Comments = {};

Comments.schema = new SimpleSchema({
    _id: {
        type: SimpleSchema.RegEx.Id,
        optional: false,
        autoValue: function () {
            return Random.id();
        }
    },
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: 'Owner User Id',
        optional: false
    },
    text: {
        type: String,
        optional: false
    },
    createdDate: {
        type: Date,
        optional: true,
        autoValue: function () {
            return new Date();
        }
    },
    attachment: {
        type: String,
        optional: true
    }
});