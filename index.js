const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 1000;
const url = "mongodb+srv://abhiassaproject:abhiassa@abhiassacluster.vdvvi.mongodb.net/namelessDB?retryWrites=true&w=majority&appName=abhiassaCluster"

const User = require('./models/user.js');
const Galleries = require('./models/galleries.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, }));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(url)
.then(() => console.log("Connected..."))
.catch(err => console.log("Error", err))

cloudinary.config({
    cloud_name: "dly5mdfrl",
    api_key: "686751942755659",
    api_secret: "z9kBrIFtSQrwV4Xp3kvn5nGjZq8"
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('index', {
        title: "Nameless Management System"
    });
});

app.get('/members-api', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send("Server error...");
    }
});

app.get('/members', async (req, res) => {
    try {
        const users = await User.find();
        res.render('members', {
            title: "NMS | Members",
            data: users,
        });
    } catch {
        console.log('File not found');
    }
});

app.post('/add', upload.single('photo'), async (req, res) => {
    try {
        const { name, position, social} = req.body;

        if (!name || !position || !social || !req.file) {
            return res.status(400).send('Tidak ada data yang ditambahkan')
        };

        const result = await new Promise ((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(result);
                }
            ).end(req.file.buffer);
        });

        const newUser = new User({
            name,
            position,
            social,
            photo: result.secure_url,
        });

        await newUser.save();

        res.redirect('/members');
    } catch (err) {
        return console.error('Error:', err);
        res.status(500).send('Error:', err);
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        await User.findByIdAndDelete(id);
        res.redirect('/members');
    } catch (err) {
        console.error(err)
    }
})

app.post('/add-image', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body)
        const name = req.body.name;
        const now = new Date();
        const date = now.toISOString().split('T')[0];

        if (!name || !req.file) {
            res.status(400).send('Tidak ada data yang ditambahkan')
        }

        const result = await new Promise ((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            ).end(req.file.buffer);
        })

        const newImage = new Galleries({
            name,
            image: result.secure_url,
            date,
        });

        await newImage.save();
        res.redirect('/galleries');

    } catch (err) {
        return console.error('Error:', err);
        res.status(500).send('Error:', err);
    }
})

app.get('/galleries-api', async (req, res) => {
    try {
        const galleries = await Galleries.find();

        res.json(galleries);
    } catch {
        console.log('File not found');
    }
})

app.get('/galleries', async (req, res) => {
    try {
        const galleries = await Galleries.find();

        res.render('galleries', {
            title: "NMS | Galleries",
            data: galleries,
        });
    } catch {
        console.log('File not found');
    }
})

app.get('/delete/image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const galleries = await Galleries.findById(id);

        await Galleries.findByIdAndDelete(id);
        res.redirect('/galleries');
    } catch (err) {
        console.error(err)
    }
})

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

module.exports = app;
