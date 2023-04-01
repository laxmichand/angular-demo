const { ARRAY } = require('sequelize');
const db= require('../models/index');
const users = db.user;

module.exports = {

    getData: async(req,res) =>{
      await users.findAll()
      .then(data=>{
        res.send(data);
      })

    },

    addData: async(req,res) =>{
        await users.create(req.body)
        .then(data=>{
            res.send(data);
        })
    }

}