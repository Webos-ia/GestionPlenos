const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.get('/audio', (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).send('Falta el parámetro ?url=');
    }

    res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
    res.setHeader('Content-Type', 'audio/mpeg');

    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o - "${videoUrl}"`;
    const child = exec(command, { maxBuffer: 1024 * 1024 * 10 });

    child.stdout.pipe(res);
    child.stderr.on('data', data => {
        console.error(data.toString());
    });

    child.on('error', err => {
        res.status(500).send('Error ejecutando yt-dlp');
    });
});

app.get('/', (req, res) => {
    res.send('Microservicio de audio yt-dlp funcionando');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});