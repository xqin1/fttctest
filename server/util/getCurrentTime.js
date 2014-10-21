'use strict';

module.exports = function(req, res, next){
    req.startTime =  Date.now();
    return next();
};