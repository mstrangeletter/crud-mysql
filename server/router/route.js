const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const imgDir = path.join(__dirname, '../images');
const dbImgDir = path.join(__dirname, '../dbimages');

const createDirectories = () => {
    if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir);
    }
};

createDirectories();

const diskStorage = multer.diskStorage({
    destination: imgDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-flag-' + file.originalname);
    },
});

const fileUpload = multer({
    storage: diskStorage,
}).single('image');

router.use('/public/dbimages', express.static(path.join(__dirname, '../public/dbimages')));

router.get('/', (req, res) => {
    res.send('Welcome to my image CRUD app');
});

router.post('/images/post', (req, res) => {
    fileUpload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        req.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error');
            }

            const type = req.file.mimetype;
            const name = req.file.originalname;
            const data = fs.readFileSync(
                path.join(imgDir, req.file.filename)
            );
            
            res.setHeader('Content-Type', 'image/png');
            
            const { country, description } = req.body;

            const uuidFileName = uuid.v4() + path.extname(name);
            const imagePath = path.join(dbImgDir, uuidFileName);

            fs.writeFile(imagePath, data, (error) => {
                if (error) {
                    console.error('Error al escribir la imagen:', error);
                } else {
                    console.log('Imagen guardada exitosamente:', imagePath);
                }
            });

            const sqlQuery = 'INSERT INTO flag (flag_type, flag_name, flag_data, country, flag_desc) VALUES (?, ?, ?, ?, ?)';
            conn.query(sqlQuery, [type, uuidFileName, data, country, description], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Server error');
                }

                fs.unlink(path.join(imgDir, req.file.filename), (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error al eliminar la imagen temporal:', unlinkErr);
                    }

                    console.log('Imagen guardada en la base de datos y la imagen temporal eliminada');
                    res.send('Imagen guardada en la base de datos y la imagen temporal eliminada');
                });
            });

        });
    });
});

router.get('/images/get', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        conn.query('SELECT flag_id, flag_name, country, flag_desc FROM flag', (err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Server error');
            }

            const imageResponses = rows.map((row) => {
                const { flag_id, flag_name, country, flag_desc } = row;
                const imagePath = `/public/dbimages/${flag_name}`;
                return {
                    flag_id,
                    country,
                    flag_desc,
                    imagePath,
                };
            });

            res.json(imageResponses);
        });
    });
});



module.exports = router;
