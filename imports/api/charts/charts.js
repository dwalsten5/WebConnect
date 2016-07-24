/**
 * Created by Phani on 7/24/2016.
 */
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

// Constants for document field names
export const OWNER         = 'owner';
export const NAME          = 'name';
export const DESCRIPTION   = 'description';
export const CREATED_DATE  = 'createdDate';
export const UPDATED_DATE  = 'updatedDate';
export const VERSION       = 'version';
export const UPVOTED_IDS   = 'upvoted';
export const DOWNVOTED_IDS = 'downvoted';
export const DOWNLOADS     = 'downloads';
export const GRAPH         = 'graph';

export const Charts = new Mongo.Collection('charts');

// Deny all client updates, everything going to be done through methods
Charts.deny({
    insert(){
        return true;
    },
    remove(){
        return true;
    },
    update(){
        return true;
    }
});

Charts.schema = new SimpleSchema({
    owner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: 'Owner User Id',
        optional: false
    },
    name: {
        type: String,
        optional: false
    },
    description: {
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
    updatedDate: {
        type: Date,
        optional: false,
        autoValue: function () {
            if (this.isUpdate || this.isInsert || this.isUpsert) {
                return new Date();
            }
        }
    },
    version: {
        type: String,
        optional: false,
        defaultValue: '1.0',
        regEx: /\d+(\.\d+)+/
    },
    upvoted: {
        type: [String],
        label: 'Upvoted user Ids',
        optional: false,
        defaultValue: '',
    },
    downvoted: {
        type: [String],
        label: 'Downvoted user Ids',
        optional: false,
        defaultValue: '',
    },
    downloads: {
        type: Number,
        optional: false,
        defaultValue: 0
    },
    graph: {
        type: String,
        optional: false,
        regEx: SimpleSchema.RegEx.Id
    }
});

Charts.attachSchema(Charts.schema);