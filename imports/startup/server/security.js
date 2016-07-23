/**
 * Created by Phani on 7/23/2016.
 */
import {Meteor} from "meteor/meteor";
import {_} from "meteor/underscore";

// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
    update() {
        return true;
    },
});