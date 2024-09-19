module.exports = function(app){
    require('./../middleware/authentication')(app);
    require('./routes')(app);
}