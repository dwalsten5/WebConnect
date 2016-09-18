/**
 * Created by Phani on 9/18/2016.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";

// Constants for document field names
export const COMMENT_ID  = "_id";
export const OWNER       = "owner";
export const TEXT        = "text";
export const createdDate = "createdDate";
export const ATTACHMENT  = "attachment";

export const Comments = {};

Comments.schema = new SimpleSchema({
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
        optional: false,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
    attachment: {
        type: String,
        optional: true
    }
});