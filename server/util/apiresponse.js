'use strict';

/**
 * A module that defines the response format.
 * @module apiresponse
 */

/** Configuration for API Response.  Defaults are set and response format is set.*/
exports.sendAPIResponse = function (req, res) {
    var resp = {};
    resp.results = [];
    /** Create the result object.  If a result object is provided  they are put into the res array for result.*/
    if (req.result) {
        if (req.result instanceof Array){
            resp.results = req.result;
        }
        else {
            resp.results = [];
            resp.results.push(req.result);
        }
    }
    /** Set resultCount object to be either the length of resp objects, or, if set a numeric resultCount number.*/
    if(!req.resultCount){
        resp.resultCount = resp.results.length;
    }
    else{
        resp.resultCount = req.resultCount;
    }

    if (!req.statusCode) {
        resp.statusCode = '200';
    }
    else {
        resp.statusCode = req.statusCode;

    }
    if (req.message){
        resp.message = req.message;
    }
    else {
        resp.message = null;
    }
    resp.status = 'successful';

    resp.responseTime = Date.now() - req.startTime + "ms";

    //set cross-domain header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.json(resp);
};
