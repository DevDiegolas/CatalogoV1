const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3001;

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Servir arquivos estáticos da pasta uploads

const dataFilePath = path.join(__dirname, 'items.json');

const readData = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return [];
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Adiciona um item com imagem
app.post('/api/items', upload.single('image'), (req, res) => {
    try {
        const { nome, descricao } = req.body;
        const imagem_url = req.file ? req.file.filename : null; // Obtém o nome do arquivo de imagem
        const items = readData();
        const newItem = { id: Date.now(), nome, descricao, imagem_url };
        items.push(newItem);
        writeData(items);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        res.status(500).json({ message: 'Erro ao cadastrar o item' });
    }
});

// Busca todos os itens
app.get('/api/items', (req, res) => {
    try {
        const items = readData();
        res.json(items);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ message: 'Erro ao buscar itens' });
    }
});

// Remove um item pelo ID
app.delete('/api/items/:id', (req, res) => {
    try {
        const { id } = req.params;
        let items = readData();
        items = items.filter(item => item.id != id);
        writeData(items);
        res.status(200).send('Item removido com sucesso');
    } catch (error) {
        console.error('Erro ao remover item:', error);
        res.status(500).json({ message: 'Erro ao remover item' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
