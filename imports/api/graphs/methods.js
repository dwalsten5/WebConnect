/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Graphs from "./graphs.js";

/**
 * Inserts a new graph into the database, given the owner id
 *
 * The unique _id of the graph is returned, or null on failure.
 */
export const insertGraph = new ValidatedMethod({
    name: 'graphs.insert',
    validate: function (obj) {
        // No arguments to validate
    },
    run(){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error('graphs.insert.accessDenied',
                'A user must be logged in to insert a new Graph');
        }
        let graph           = {};
        graph[Graphs.OWNER] = ownerId;
        return Graphs.Graphs.insert(graph);
    }
});