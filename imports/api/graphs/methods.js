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

export const getGraph = new ValidatedMethod({
    name: "graphs.getGraph",
    validate: function (obj) {
        // Nothing to validate
    },
    run(id){
        return Graphs.Graphs.findOne({_id: id});
    }
});

/**
 * Attempts to upsert a graph. If the graph doesn't exist in the DB,
 * it is inserted with a new ID. The graph owner must be the current
 * user. The result of the upsert operation is returned.
 */
export const upsertGraph = new ValidatedMethod({
    name: "graphs.upsertGraph",
    validate: Graphs.Graphs.simpleSchema().validator({
        clean: true,
        filter: true
    }),
    run(graph){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error("graphs.upsertGraph.accessDenied",
                "A user must be logged in to insert or update a Graph");
        }
        if (graph[Graphs.OWNER] === ownerId) {
            return Graphs.Graphs.upsert(graph);
        } else {
            throw new Meteor.Error("graphs.upsertGraph.accessDenied",
                "The given Graph's owner does not match the current user");
        }
    }
});
