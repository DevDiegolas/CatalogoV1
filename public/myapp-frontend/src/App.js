import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState('cadastro');
    const [menuOpen, setMenuOpen] = useState(false);
    const [message, setMessage] = useState('');

    const navigateTo = (page) => {
        setCurrentPage(page);
        setMenuOpen(false);
    };

    // Função para adicionar item
    const saveItem = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        if (imagem) formData.append('image', imagem);

        try {
            await axios.post('http://localhost:3001/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage({ text: 'Item cadastrado com sucesso!', type: 'success' });
            setNome('');
            setDescricao('');
            setImagem(null);
            document.querySelector('input[type="file"]').value = '';
            fetchItems();
        } catch (error) {
            console.error('Erro ao cadastrar o item:', error);
            setMessage({ text: 'Erro ao cadastrar o item', type: 'warning' });
        }
    };

    // Função para buscar itens
    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/items');
            setItems(response.data);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Função para remover item
    const handleRemove = async (id) => {
        if (window.confirm('Tem certeza que deseja remover este item?')) {
            try {
                await axios.delete(`http://localhost:3001/api/items/${id}`);
                fetchItems();
                setMessage({ text: 'Item removido com sucesso!', type: 'success' });
            } catch (error) {
                console.error('Erro ao remover item:', error);
                setMessage({ text: 'Erro ao remover o item', type: 'warning' });
            }
        }
    };

    // Função para limpar a mensagem após 2 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 2000);
            return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
        }
    }, [message]);

    return (
        <div className="app-container">
            <header>
                <div className="navbar">
                    <h1>Catalogo Online</h1>
                    <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
                        &#9776;
                    </button>
                    {menuOpen && (
                        <nav className="menu">
                            <ul>
                                <li onClick={() => navigateTo('cadastro')}>Cadastro</li>
                                <li onClick={() => navigateTo('itens')}>Itens Cadastrados</li>
                            </ul>
                        </nav>
                    )}
                </div>
            </header>

            <main>
                {message && (
                    <div className={`message ${message.type === 'warning' ? 'warning' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                {currentPage === 'cadastro' && (
                    <div className="form-container">
                        <h2>Cadastro de Itens</h2>
                        <form onSubmit={saveItem}>
                            <label>
                                Nome:
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Descrição:
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Imagem:
                                <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
                            </label>
                            <button type="submit">Cadastrar</button>
                        </form>
                    </div>
                )}

                {currentPage === 'itens' && (
                    <div className="items-container">
                        <h2>Itens Cadastrados</h2>
                        <div className="items-list">
                            {items.map((item) => (
                                <div className="item-card" key={item.id}>
                                    <img
                                        src={item.imagem_url ? `http://localhost:3001/${item.imagem_url}` : 'https://via.placeholder.com/300x200'}
                                        alt={item.nome}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <h5>{item.nome}</h5>
                                        <p>{item.descricao}</p>
                                        <button className="delete-button" onClick={() => handleRemove(item.id)}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
