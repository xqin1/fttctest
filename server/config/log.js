'use strict';
var logger = require('winston');
module.exports = function (config) {
    logger.add(logger.transports.File, config.log);
    logger.remove(logger.transports.Console);
    if (config.env === 'development') {
        logger.add(logger.transports.Console, {level: 'verbose'});
    }
    logger.info('log started');
};