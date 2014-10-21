module.exports = function(err, req, res, next){
    console.log(err.stack);
    var resq = {};
    resq.statusCode = '500';
    resq.message = 'An internal Error Happens';
    resq.status = 'fail';

    //set cross-domain header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.send(resq);
}