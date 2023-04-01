const usersController = require('./users.controller');

module.exports = (app)=>{
    app.get('/get',usersController.getData);
    app.post('/add',usersController.addData);

}