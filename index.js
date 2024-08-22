const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 1000;
const url = "mongodb+srv://abhiassaproject:abhiassa@abhiassacluster.vdvvi.mongodb.net/namelessDB?retryWrites=true&w=majority&appName=abhiassaCluster"

const User = require('./models/user.js');

app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true, }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(url)
.then(() => console.log("Connected..."))
.catch(err => console.log("Error", err))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/members-api', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send("Server error...");
    }
});

app.get('/members', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'members.html'));
    } catch {
        console.log('File not found');
    }
});

app.post('/add', upload.single('photo'), async (req, res) => {
    try {
        console.log(req.file);
        const { name, position, social} = req.body;
        const photo = req.file ? req.file.path : ''

        if (!name || !position || !social || !photo ) {
            return res.status(400).send('Tidak ada data yang ditambahkan')
        };

        const newUser = new User({
            name,
            position,
            social,
            photo,
        });

        await newUser.save();

        res.redirect('/members');
    } catch (err) {
        return console.error('Error:', err);
        res.status(500).send('Error...');
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

app.get('/gallery-api', (req,res) => {
    res.send('Sedang diproses ngab....');
})

app.get('/gallery', (req,res) => {
    res.send('Sedang diproses ngab....');
})

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

module.exports = app;
