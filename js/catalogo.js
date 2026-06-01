/**
 * Sistema de Catálogo Ferreira Showroom v5.1
 * CORREÇÃO: Carregamento inicial garantido + Skeleton
 */

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR3VJH7Z2y2qibASth0x_2mC-g5MPblkuGh4XJBeLqK-EUznlCnClDYOQHGj_uLkatGch_FdgQDZOb_/pub?output=csv';
const IMG_PATH = 'img/produtos/';

let todosOsProdutos = [];

async function carregarDados() {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;

    // 1. Inicia o Skeleton Screen
    grid.innerHTML = ''; 
    for(let i=0; i<6; i++) { 
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
                    nome: colunas[0],
                    categoria: colunas[1],
                    detalhes: colunas[2],
                    status: colunas[3],
                    fotos: fotosProcessadas.length > 0 ? fotosProcessadas : ['placeholder.jpg']
                };
            }
            return null;
        }).filter(p => p && p.nome);

        // 2. Gera os filtros e renderiza IMEDIATAMENTE
        gerarFiltrosAutomaticos(todosOsProdutos);
        renderizarProdutos(todosOsProdutos);
        configurarPesquisa();

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">Erro ao carregar catálogo. Verifique a conexão.</p>';
    }
}

// Resto das funções (parseCSV, gerarFiltrosAutomaticos, filtrar, renderizarProdutos, mudarFoto, configurarPesquisa) continuam as mesmas...
// Vou incluir o arquivo completo abaixo para você não ter erro de colagem.

function parseCSV(text) {
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const separator = text.includes(';') ? ';' : regex;
    return text.split(separator).map(v => v.replace(/^"|"$/g, '').trim());
}

function gerarFiltrosAutomaticos(produtos) {
    const containerFiltros = document.querySelector('.filtros');
    if (!containerFiltros) return;

    const categorias = [...new Set(produtos.map(p => p.categoria))].sort();
    let htmlBotoes = `<button class="filter-btn active" onclick="filtrar('todos', this)">Todos</button>`;
    
    categorias.forEach(cat => {
        if(cat) {
            htmlBotoes += `<button class="filter-btn" onclick="filtrar('${cat}', this)">${cat}</button>`;
        }
    });

    containerFiltros.innerHTML = htmlBotoes;
}

window.filtrar = function(categoria, botao) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(b => b.classList.remove('active'));
    botao.classList.add('active');

    const filtrados = categoria.toLowerCase() === 'todos' 
        ? todosOsProdutos 
        : todosOsProdutos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    
    renderizarProdutos(filtrados);
}

const PHONE_NUMBERS = ["5581973142897", "558189927012"];
let nextWhatsNumberIndex = 0;

function renderizarProdutos(lista) {
    const grid = document.getElementById('grid-catalogo');
    if (!grid) return;
    grid.innerHTML = '';

    if(lista.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding: 40px;">Nenhum produto encontrado.</p>';
        return;
    }

    lista.forEach((p, index) => {
        const whatsApp = PHONE_NUMBERS[nextWhatsNumberIndex];
        nextWhatsNumberIndex = (nextWhatsNumberIndex + 1) % PHONE_NUMBERS.length;
        
        const msg = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto *${p.nome}* do catálogo.`);
        const linkWhats = `https://wa.me/${whatsApp}?text=${msg}`;

        const card = document.createElement('div');
        card.className = 'produto-card';
        
        let fotosHTML = '';
        p.fotos.forEach((foto, i) => {
            fotosHTML += `<img src="${IMG_PATH}${foto}" class="slide-foto ${i === 0 ? 'active' : ''}" alt="${p.nome}" loading="lazy">`;
        });

        const controlesHTML = p.fotos.length > 1 ? `
            <div class="carrossel-controls">
                <button onclick="mudarFoto(${index}, -1)"><i class="fas fa-chevron-left"></i></button>
                <button onclick="mudarFoto(${index}, 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="carrossel-dots" id="dots-${index}">
                ${p.fotos.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="img-container" id="carrossel-${index}">
                ${fotosHTML}
                ${controlesHTML}
            </div>
            <div class="produto-info">
                <span class="produto-tag">${p.categoria}</span>
                <h3>${p.nome}</h3>
                <div class="detalhes">
                    <p>${p.detalhes}</p>
                    <span style="color: ${p.status.toLowerCase() === 'disponível' ? '#25D366' : '#ff4444'}; font-weight: 700;">
                        ● ${p.status}
                    </span>
                </div>
                <a href="${linkWhats}" target="_blank" class="btn-pedir">Consultar no WhatsApp</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.mudarFoto = function(productIndex, direction) {
    const container = document.getElementById(`carrossel-${productIndex}`);
    const slides = container.querySelectorAll('.slide-foto');
    const dots = document.getElementById(`dots-${productIndex}`).querySelectorAll('.dot');
    
    let activeIndex = Array.from(slides).findIndex(s => s.classList.contains('active'));
    if(activeIndex === -1) return;

    slides[activeIndex].classList.remove('active');
    dots[activeIndex].classList.remove('active');

    activeIndex = (activeIndex + direction + slides.length) % slides.length;

    slides[activeIndex].classList.add('active');
    dots[activeIndex].classList.add('active');
}

function configurarPesquisa() {
    const input = document.getElementById('search-input');
    if(!input) return;

    input.oninput = (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = todosOsProdutos.filter(p => 
            p.nome.toLowerCase().includes(termo) || 
            p.categoria.toLowerCase().includes(termo) ||
            p.detalhes.toLowerCase().includes(termo)
        );
        renderizarProdutos(filtrados);
        
        const botoes = document.querySelectorAll('.filter-btn');
        botoes.forEach(b => b.classList.remove('active'));
        if(termo === "" && botoes.length > 0) botoes[0].classList.add('active');
    };
}

document.addEventListener('DOMContentLoaded', carregarDados);