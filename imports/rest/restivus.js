/**
 * Created by Phani on 9/14/2016.
 */

import {Restivus} from "meteor/nimble:restivus";

export const RestAPI = new Restivus({
    version: "v1",
    useDefaultAuth: true,
    prettyJson: true
});