var express = require("express");
var router = express.Router();

module.exports = function (pool) {
  /* GET All */
  router.get("/", (req, res) => {
    const sql = `SELECT * FROM jakita_pegawai;`;

    console.log("Running SQL query:", sql);

    pool
      .query(sql)
      .then((listProduct) => {
        res.json({
          Data: listProduct.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: `Something went wrong: ${err.message}`,
        });
      });
  });

  // Add pegawai
  router.post("/", (req, res) => {
    let data = {
      id_pegawai: req.body.id_pegawai,
      nama_pegawai: req.body.nama_pegawai,
      no_telepon: req.body.no_telepon,
    };

    console.log("INI DATA YANG MASUK",data); 
    if (!data.nama_pegawai || !data.no_telepon) {
      return res.json({
        success: false,
        message: "Nama pegawai dan nomor telepon harus diisi",
      });
    }
    let sql = `INSERT INTO jakita_pegawai (id_pegawai, nama_pegwai, no_telepon) VALUES ('${data.id_pegawai}','${data.nama_pegawai}', '${data.no_telepon}') RETURNING *`;
    pool.query(sql, (err, insertPegawai) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal menambahkan data pegawai",
          error: err,
        });
      }
      res.json({
        success: true,
        message: "Data pegawai berhasil ditambahkan",
        data: {
          id_pegawai: insertPegawai.rows[0].id_pegawai,
          nama_pegawai: insertPegawai.rows[0].nama_pegawai,
          no_telepon: insertPegawai.rows[0].no_telepon,
        },
      });
    });
  });

  // UPDATE
router.put('/:id', (req, res) => {
  let id = req.params.id;
  let data = {
    nama_pegawai: req.body.nama_pegawai,
    no_telepon: req.body.no_telepon,
  };
  let sql = `UPDATE jakita_pegawai SET nama_pegwai='${data.nama_pegawai}', no_telepon='${data.no_telepon}' WHERE id_pegawai = ${id} RETURNING *`;

  pool.query(sql, (err, updatePegawai) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while updating data',
        data: null,
      });
    }

    if (!updatePegawai || updatePegawai.rowCount === 0) {
      return res.json({
        success: false,
        message: `Updating data failed. ID: ${id} not found.`,
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Data has been updated.",
      data: {
        id_pegawai: updatePegawai.rows[0].id_pegawai,
        nama_pegawai: updatePegawai.rows[0].nama_pegawai,
        no_telepon: updatePegawai.rows[0].no_telepon,
      },
    });
  });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  let id = req.params.id;

  let sql = `SELECT id_pegawai FROM jakita_pegawai WHERE id_pegawai = ${id}`;
  pool.query(sql, (err, result) => {
      if (result.rowCount === 0) {
          res.json({
              success: false,
              message: `Deleted failed: id_pegawai ${id} not found`,
              data: null
          });
      } else {
          let sql2 = `DELETE FROM jakita_pegawai WHERE id_pegawai = ${id}`;
          pool.query(sql2, (err) => {
              if (err) {
                  res.json({
                      success: false,
                      message: "Error deleting data",
                      error: err
                  });
              } else {
                  res.json({
                      success: true,
                      message: "Data Deleted",
                  });
              }
          });
      }
  });
});



  return router;
};
