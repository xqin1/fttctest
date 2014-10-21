var util = require('../util/util');

module.exports.processAboutData = function() {
    var fs = require('fs');
    var about_facilities = fs.readFileSync(__dirname + '/../data/about_html/about_facilities.html', 'utf8');
    var about_fl_turnpike = fs.readFileSync(__dirname + '/../data/about_html/about_fl_turnpike.html', 'utf8');
    var about_payment = fs.readFileSync(__dirname + '/../data/about_html/about_payment.html', 'utf8');
    var about_service_plazas = fs.readFileSync(__dirname + '/../data/about_html/about_service_plazas.html', 'utf8');
    var about_using_toll_cal = fs.readFileSync(__dirname + '/../data/about_html/about_using_toll_cal.html', 'utf8');
    var vehicle_desc = fs.readFileSync(__dirname + '/../data/about_html/vehicle_desc.html', 'utf8');






    var aboutData = {};
    aboutData.lastUpdated = util.getDate();
    aboutData.htmlData = {};
    aboutData.htmlData.about_facilities = about_facilities;
    aboutData.htmlData.about_fl_turnpike = about_fl_turnpike;
    aboutData.htmlData.about_payment = about_payment;
    aboutData.htmlData.about_service_plazas = about_service_plazas;
    aboutData.htmlData.about_using_toll_cal = about_using_toll_cal;
    aboutData.htmlData.vehicle_desc = vehicle_desc;



    //console.log(aboutData)

    fs.writeFile(__dirname + '/../data/about_data.json', JSON.stringify(aboutData), function (err, done) {
        if (err) throw err;
        console.log("about data finished")
    })

}