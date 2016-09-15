/**
 * Created by Phani on 9/15/2016.
 */

import * as Charts from "/imports/api/charts/charts.js";
import * as Graphs from "/imports/api/graphs/graphs.js";
import {getChart} from "/imports/api/charts/methods.js";

const TEST_CHART = {
    "_id": "testchart",
    "name": "Device Name",
    "description": "A description of the device",
    "owner": "wjQyQ6sGjzvNMDLiJ",
    "graph": "Df93jdo92jmes8mc7"

};

const TEST_GRAPH = {
    "_id": "Df93jdo92jmes8mc7",
    "owner": "wjQyQ6sGjzvNMDLiJ",
    "nodes": [
        {
            "_id": "jf93jdo92jsme7mc7",
            "name": "Name for the node. For a question node, this should be the question",
            "details": "Details for this node. Optional but non-nullable",
            "resources": ["Array of associated resource URLs. URLs should be publicly accessible"],
            "images": ["Array of associated image URLs. URLs should be publicly accessible"],
        },
        {
            "_id": "dsfS532323JSdfJsf",
            "name": "Discard and replace batteries if they are leaking, rusted, corroding, or over two years old.",
            "details": "",
            "images": [
                "battery/imgs/battery_corroded.jpg"
            ],
        }
    ],
    "edges": [
        {
            "_id": "1",
            "name": "test edge",
            "details": "These are some random details about this edge",
            "source": "dsfS532323JSdfJsf",
            "target": "jf93jdo92jsme7mc7",
        }

    ]
};


if (!getChart.call(TEST_CHART["_id"])) {
    Graphs.Graphs.insert(TEST_GRAPH);
    Charts.Charts.insert(TEST_CHART);
    console.log("Added TEST_CHART")
}