'use strict';

var fs = require('fs');

//read a series of pre-processed files, use sync to make it simple
//valid end points file
var validEndPoints = fs.readFileSync('./data/valid_end_points.json', 'utf8');
var routeData = fs.readFileSync('./data/routes_and_toll.json', 'utf8');
var schemaData = fs.readFileSync('./data/schema_data.json', 'utf8');
var imageData = fs.readFileSync('./data/image_data.json', 'utf8');
var aboutData = fs.readFileSync('./data/about_data.json', 'utf8');

exports.validEndPoints = JSON.parse(validEndPoints);
exports.routeData = JSON.parse(routeData);
exports.schemaData = JSON.parse(schemaData);
exports.imageData = JSON.parse(imageData);
exports.aboutData = JSON.parse(aboutData);

