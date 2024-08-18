const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.urlencoded());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api-anggota', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'database', 'anggota.json');
        const data = fs.readFileSync(dataPath, 'utf-8');
        console.log('Reading file from:', dataPath)
        const dataParse = JSON.parse(data);

        res.json(dataParse);
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Internal server error') 
    }
});

app.get('/api-galeri', (req, res) => {
    const data = fs.readFileSync('./database/galeri.json', 'utf-8');
    const dataParse = JSON.parse(data);

    res.send(dataParse)
    res.end();
});

app.get('/members', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'members.html'));
});

app.post('/add', (req, res) => {
    const dataPath = path.join(__dirname, 'database', 'anggota.json');
    const dataOnDb = fs.readFileSync(dataPath, 'utf-8');
    const dataParse = JSON.parse(dataOnDb);

    dataParse.push(req.body);
    fs.writeFileSync(dataPath, JSON.stringify(dataParse));
    res.redirect('/members');
});

app.get('/delete/:name', (req, res) => {
    const dataPath = path.join(__dirname, 'database', 'anggota.json');
    const dataOnDb = fs.readFileSync(dataPath, 'utf-8');
    const dataParse = JSON.parse(dataOnDb);
    const deleteData = dataParse.filter((data) => data.name !== req.params.name);

    fs.writeFileSync(dataPath, JSON.stringify(deleteData));
    res.redirect('/members');
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

module.exports = app;