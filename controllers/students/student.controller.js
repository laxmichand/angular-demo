const db = require('../../models/index');
const Student = db.Student;

const addStudent = async (req, res) => {
    await Student.create(req.body)
        .then(data => { res.send(data) })
        .catch(err => res.send(err))
}

const getAllStudent = async (req,res) =>{
    await Student.findAll()
    .then(data=>res.send(data))
    .catch(err=>res.send(err));
}


module.exports = {
    addStudent,
    getAllStudent
}
