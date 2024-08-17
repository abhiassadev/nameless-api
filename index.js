const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api-anggota', (req, res) => {
    const data = fs.readFileSync('./database/anggota.json', 'utf-8');
    const dataParse = JSON.parse(data);

    res.send(dataParse)
    res.end();
});

app.get('/api-galeri', (req, res) => {
    const data = fs.readFileSync('./database/galeri.json', 'utf-8');
    const dataParse = JSON.parse(data);

    res.send(dataParse)
    res.end();
});

app.get('/api-jadwal-rapat', (req, res) => {
    const data = fs.readFileSync('./database/jadwalRapat.json', 'utf-8');
    const dataParse = JSON.parse(data);

    res.send(dataParse)
    res.end();
});

app.get('/api-pengumuman', (req, res) => {
    const data = fs.readFileSync('./database/pengumuman.json', 'utf-8');
    const dataParse = JSON.parse(data);

    res.send(dataParse)
    res.end();
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});