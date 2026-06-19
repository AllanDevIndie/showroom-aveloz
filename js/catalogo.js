/**
 * Sistema de Catálogo Digital A'Veloz v1.0
 * Focado em Estampas com Carrinho de Pedidos
 */

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR3VJH7Z2y2qibASth0x_2mC-g5MPblkuGh4XJBeLqK-EUznlCnClDYOQHGj_uLkatGch_FdgQDZOb_/pub?output=csv';
const IMG_PATH = 'img/produtos/';

let todosOsProdutos = [];

async function carregarDados() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;

    // Skeleton Screen
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        grid.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line" style="width: 30%"></div>
                    <div class="skeleton-line" style="width: 80%; height: 20px;"></div>
                    <div class="skeleton-line" style="width: 60%"></div>
                    <div class="skeleton-btn"></div>
                </div>
            </div>
        `;
    }

    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const linhas = data.split(/\r?\n/).filter(l => l.trim() !== "").slice(1);

        todosOsProdutos = linhas.map(linha => {
            const colunas = parseCSV(linha);
            if (colunas.length >= 4) {
                const fotosRaw = colunas[4] ? colunas[4].split(',') : [];
                const fotosProcessadas = fotosRaw.map(f => f.trim()).filter(f => f !== "");

                return {
                    id: colunas[2], // Usando a coluna de descrição/detalhes como ID
                    nome: colunas[0],
                    categoria: colunas[1], // Estilo (Floral, Xadrez, etc)
                    artigos: colunas[3], // Usando a coluna de status para Artigos Recomendados
                    fotos: fotosProcessadas.length > 0 ? fotosProcessadas : ['placeholder.webp'] // Imagem padrão se nenhuma foto for fornecida
                };
            }
            return null;
        }).filter(p => p && p.nome);

        gerarFiltrosAutomaticos(todosOsProdutos);
        renderizarProdutos(todosOsProdutos);
        configurarPesquisa();
        if (typeof carregarCarrinhoSalvo === 'function') carregarCarrinhoSalvo();

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Erro ao carregar catálogo.</p>';
    }
}

function parseCSV(text) {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const separator = text.includes(';') ? ';' : regex;
    return text.split(separator).map(v => v.replace(/^"|"$/g, '').trim());
}

function gerarFiltrosAutomaticos(produtos) {
    const containerFiltros = document.querySelector('.filtros');
    if (!containerFiltros) return;

    const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
    let htmlBotoes = `<button class="filter-btn active" onclick="filtrar('todos', this)">Todos os Estilos</button>`;

    categorias.forEach(cat => {
        if (cat) {
            htmlBotoes += `<button class="filter-btn" onclick="filtrar('${cat}', this)">${cat}</button>`;
        }
    });

    containerFiltros.innerHTML = htmlBotoes;
}

window.filtrar = function (categoria, botao) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');

    const filtrados = categoria.toLowerCase() === 'todos'
        ? todosOsProdutos
        : todosOsProdutos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());

    renderizarProdutos(filtrados);
}

function renderizarProdutos(lista) {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;
    grid.innerHTML = '';

    lista.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'produto-card';

        const estaNoCarrinho = typeof carrinho !== 'undefined' && carrinho.some(item => item.id === p.id);
        const fotoPrincipal = `${IMG_PATH}${p.fotos[0]}`;

        card.innerHTML = `
            <div class="img-container">
                <img src="${fotoPrincipal}" alt="${p.nome}" loading="lazy">
            </div>
            <div class="produto-info">
                <div class="produto-header">
                    <span class="produto-tag">${p.categoria}</span>
                    <span class="produto-id">ID: ${p.id}</span>
                </div>
                <h3>${p.nome}</h3>
                <p class="artigos-recomendados"><strong>Artigos:</strong> ${p.artigos}</p>
                <button class="btn-carrinho ${estaNoCarrinho ? 'no-carrinho' : ''}">
                    ${estaNoCarrinho ? '<i class="fas fa-check"></i> Selecionado' : '<i class="fas fa-plus"></i> Selecionar'}
                </button>
            </div>
        `;

        const btnCarrinho = card.querySelector('.btn-carrinho');
        if (btnCarrinho) {
            btnCarrinho.dataset.id = p.id;
            btnCarrinho.dataset.nome = p.nome;
            btnCarrinho.dataset.imagem = fotoPrincipal;
            btnCarrinho.addEventListener('click', () => toggleCarrinho(p.id, p.nome, fotoPrincipal));
        }

        grid.appendChild(card);
    });
}

function normalizarTexto(texto) {
    return (texto || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function configurarPesquisa() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.oninput = (e) => {
        const termo = normalizarTexto(e.target.value);
        const filtrados = todosOsProdutos.filter(p =>
            normalizarTexto(p.nome).includes(termo) ||
            normalizarTexto(p.categoria).includes(termo) ||
            normalizarTexto(p.id).includes(termo) ||
            normalizarTexto(p.artigos).includes(termo)
        );
        renderizarProdutos(filtrados);
    };
}

document.addEventListener('DOMContentLoaded', carregarDados);
