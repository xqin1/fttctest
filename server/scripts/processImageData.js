var util = require('../util/util');

module.exports.processImageData = function() {
    var fs = require('fs');
    var imageDataRaw = fs.readFileSync(__dirname + '/../data/image_data_raw.json', 'utf8');
    imageDataRaw = JSON.parse(imageDataRaw);
    //console.log(imageDataRaw.image_data)
    var imageData = {};
    imageData.lastUpdated = util.getDate();
    imageData.imageData = imageDataRaw.image_data;
    console.log(imageData)

    fs.writeFile(__dirname + '/../data/image_data.json', JSON.stringify(imageData), function (err, done) {
        if (err) throw err;
        console.log("image data finished")
    })

}