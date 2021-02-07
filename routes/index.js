const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');

router.get('/', (req,res) => {
  let sql0 = "SELECT action_value FROM `tbl_site`"
  let query0 = conn.query(sql0, (err, results0) => {
    if(err) throw err;
    if (results0[0].action_value=="1"){
      res.render('index',{ user: req.user});
    }else{
      res.render('siteOffline',{ user: req.user, day: results0[1].action_value});
    }
  })
});

router.get('/home', (req,res) => {
  res.render('index',{ user: req.user});
});

module.exports = router;