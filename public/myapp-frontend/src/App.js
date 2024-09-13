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
                    <input type="checkbox" id="checkbox" onClick={() => setMenuOpen(!menuOpen)}></input>
                    <label for="checkbox" className="toggle">
                        
                        <div class="bars" id="bar1"></div>
                        <div class="bars" id="bar2"></div>
                        <div class="bars" id="bar3"></div>
                    </label>
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
                            <div className="input-group">
                                <label className="label">Nome:</label>
                                <input
                                    className="input"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="input-group">
                                <label className="label">Descrição:</label>
                                <textarea
                                    className="input"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                />
                            </div>
                            <label className="label">
                                Imagem:
                                <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
                            </label>
                            <button className='button' type="submit">Cadastrar</button>
                        </form>
                    </div>
                )}

                {currentPage === 'itens' && (
                    <div className="items-container">
                        <h2>Itens Cadastrados</h2>
                        <div className="items-list">
                            {items.map((item) => {
                                const imageUrl = item.imagem_url ? `http://localhost:3001/uploads/${item.imagem_url}` : 'https://via.placeholder.com/300x200';
                                console.log('Imagem URL:', imageUrl); // Log para depuração

                                return (
                                    <div className="item-card" key={item.id}>
                                        <img
                                            src={imageUrl}
                                            alt={item.nome}
                                            className="item-image"
                                        />
                                        <div className="item-details">
                                            <h5 className="nomeitem">{item.nome}</h5>
                                            <p className="descitem">{item.descricao}</p>
                                            <button className="button-delete" onClick={() => handleRemove(item.id)}>
                                            <svg viewBox="0 0 448 512" className="svgIcon">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                            </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
