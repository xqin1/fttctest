'use strict';
module.exports = function (app) {
    require('./routing_routes')(app);
    require('./app_schema_routes')(app);
    require('./catchall_routes')(app);
};
