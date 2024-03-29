const express = require("express");
const router = express.Router();
const conn = require("../model/db.mysql");
const bcrypt = require("bcrypt");
const checkAuthentication = require("../passport/checkAuthentication");

router.get("/", checkAuthentication.checkAuthenticated, (req, res) => {
  req.user.birthday = dateForEurope(req.user.birthday);
  res.render("myAccount", { user: req.user, fields: req.user });
});

router.post("/update", checkAuthentication.checkAuthenticated, (req, res) => {
  for (const field in req.body) {
    if (req.body[field] == "") {
      if (!(field == "floor")) {
        res.render("myAccount", {
          error:
            "Δεν έχετε συμπληρώσει όλα τα πεδία της φόρμας. Παρακαλώ ξαναπροσπαθήστε.",
          user: req.user,
          fields: req.body,
        });
        return;
      }
    }
  }
  if (!(req.body.telephone.length == 10)) {
    res.render("myAccount", {
      error:
        "Δεν έχετε συμπληρώσει σωστά το τηλέφωνο επικοινωνίας. Χωρίς κενά. Χωρίς αριθμό Χώρας",
      user: req.user,
      fields: req.body,
    });
    return;
  }
  bcrypt.hash(req.body.telephone, 10, (err, hash) => {
    if (err) {
      throw err;
    }
    console.log(req.user.isAdmin);
    if (req.user.isAdmin) {
      let data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        floor: req.body.floor,
        city: req.body.city,
        outOfLoutraki: checkOutOfLoutraki(req.body.city),
      };
      let sql0 = "UPDATE tbl_users SET ? WHERE user_id=" + req.user.user_id;
      let query = conn.query(sql0, data, (err, results0) => {
        if (err) throw err;
        res.render("myAccount", {
          error: "success",
          user: req.user,
          fields: req.body,
        });
        return;
      });
    } else {
      let data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        telephone: req.body.telephone,
        address: req.body.address,
        floor: req.body.floor,
        city: req.body.city,
        outOfLoutraki: checkOutOfLoutraki(req.body.city),
      };
      let sql0 = "UPDATE tbl_users SET ? WHERE user_id=" + req.user.user_id;
      let query = conn.query(sql0, data, (err, results0) => {
        if (err) throw err;
        res.render("myAccount", {
          error: "success",
          user: req.user,
          fields: req.body,
        });
        return;
      });
    }
  });
});

router.get("/myOrders", checkAuthentication.checkAuthenticated, (req, res) => {
  let sql =
    "SELECT * FROM tbl_orders WHERE user_id=" +
    req.user.user_id +
    " ORDER BY date DESC, order_id DESC";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    for (i in results) {
      results[i].date = dateForEurope(results[i].date);
    }
    res.render("myOrders", { user: req.user, result: results });
  });
});

module.exports = router;

function checkOutOfLoutraki(city) {
  if (city === "Λουτράκι" || city === "Πάτρα") {
    return 0;
  }
  return 1;
}

function dateForEurope(date) {
  var dd = date.slice(8);
  var mm = date.slice(5, 7);
  var yy = date.slice(0, 4);
  return dd + "-" + mm + "-" + yy;
}
