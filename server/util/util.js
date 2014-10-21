module.exports.getDate = function() {
        var a = new Date();
        var myDate = String(a.getMonth() + 1) + '/' + String(a.getDate()) + '/' + String(a.getFullYear())
        return myDate;
}