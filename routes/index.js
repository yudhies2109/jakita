var express = require("express");
var router = express.Router();

module.exports = function (pool) {

  // LOGIN
  
  router.post('/', function(req, res) {
    let email = req.body.email;
    let pass = req.body.password;
    let sql = `SELECT COUNT(email) as count FROM jakita_user WHERE email = '${email}' AND password ='${pass}'`;
  
    pool.query(sql, function(err, data) {
      let JmlhData = data.rows[0].count;
  
      if (err) {
        throw err;
      }
  
      if (JmlhData > 0) {
        req.session.email = email;
        const response = {
          status: "succes",
          message: "Login Berhasil",
          data : {
            email: email
          }
        }
        console.log(JSON.stringify(response, null, 2)); 
      } else {
        req.flash('loginMessage', 'Masukkan Username & Password Dengan Benar');
        const response = {
          status: "error",
          message: "Login gagal!"
        };
        console.log(JSON.stringify(response, null, 2));
      }
    });
  });

  // LOGOUT
  
  router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      const response = {
        status: "success",
        message: "TERIMA KASIH! Anda telah berhasil logout."
      };
      console.log(JSON.stringify(response, null, 2));
    });
  });
  
  return router;
};
