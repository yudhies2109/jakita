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

    // Pastikan data valid sebelum melakukan query
    if (!data.nama_pegawai || !data.no_telepon) {
      return res.json({
        success: false,
        message: "Nama pegawai dan nomor telepon harus diisi",
      });
    }

    // Query untuk memasukkan data pegawai
    let sql = `INSERT INTO jakita_pegawai (id_pegawai, nama_pegwai, no_telepon) VALUES ('${data.id_pegawai}','${data.nama_pegawai}', '${data.no_telepon}') RETURNING *`;
    pool.query(sql, (err, insertPegawai) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal menambahkan data pegawai",
          error: err,
        });
      }
      // Jika berhasil, kirimkan respon
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

  // SQL Query untuk update data pegawai
  let sql = `UPDATE jakita_pegawai SET nama_pegwai='${data.nama_pegawai}', no_telepon='${data.no_telepon}' WHERE id_pegawai = ${id} RETURNING *`;

  pool.query(sql, (err, updatePegawai) => {
    if (err) {
      // Menangani error jika query gagal dijalankan
      console.error('Error executing query:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while updating data',
        data: null,
      });
    }

    if (!updatePegawai || updatePegawai.rowCount === 0) {
      // Cek jika tidak ada data yang diupdate
      return res.json({
        success: false,
        message: `Updating data failed. ID: ${id} not found.`,
        data: null,
      });
    }

    // Jika data berhasil diupdate
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




  return router;
};
