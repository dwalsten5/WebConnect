/**
 * Created by Phani on 7/24/2016.
 */
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import * as Charts from "./charts.js";

const insertValidationContext = Charts.Charts.simpleSchema()
    .pick([Charts.NAME, Charts.DESCRIPTION])
    .newContext();

/**
 * Inserts a new chart into the database, given the name and description.
 * A graph is created and associated with the chart automatically.
 *
 * The unique _id of the chart is returned, or null on failure.
 */
export const insertChart = new ValidatedMethod({
    name: 'charts.insert',
    validate: function (obj) {
        return insertValidationContext.validate(obj);
    },
    run({name, description}){
        let ownerId = Meteor.userId();
        if (!ownerId) {
            throw new Meteor.Error('charts.insert.accessDenied',
                'A user must be logged in to insert a new Chart');
        }
        let graphId = undefined;// TODO create a graph here and insert it with the chart

        let chart                 = {};
        chart[Charts.OWNER]       = ownerId;
        chart[Charts.NAME]        = name;
        chart[Charts.DESCRIPTION] = description;
        chart[Charts.GRAPH]       = graphId;

        return Charts.Charts.insert(chart);
    }
});