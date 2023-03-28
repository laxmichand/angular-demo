const stdentc =require('../controllers/students/student.controller');
const departmentc = require('../controllers/department/department.controller');
module.exports = (app) => {
    app.get('/',(req,res) => {
        res.status(200).send({
            data : "Welcome Node Sequlize API v1"
        })
    })
    app.post('/add',stdentc.addStudent);
    app.get('/get',stdentc.getAllStudent);

}
