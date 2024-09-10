const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());


const dataFilePath = path.join(__dirname, 'items.json');


const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};


const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};


app.post('/api/items', (req, res) => {
    const { nome, descricao, imagem_url } = req.body;
    const items = readData();
    const newItem = { id: Date.now(), nome, descricao, imagem_url };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});


app.get('/api/items', (req, res) => {
    const items = readData();
    res.json(items);
});


app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    let items = readData();
    items = items.filter(item => item.id != id);
    writeData(items);
    res.status(200).send('Item removido com sucesso');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
