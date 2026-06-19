// Estado do catálogo
let catalogoState = {
    artigos: {},
    currentSlide: {}
};

// Estado do filtro com busca
let filtroState = {
    artigoAtual: 'todos',
    termoBusca: '',
    todosOsArtigos: [
        'todos', 'barbie', 'cotton-listrado', 'crepe-liverpool', 'dry-fit-colmeia',
        'dry-grao-de-arroz', 'duna', 'fio-torcido-listrado', 'liganete', 'london',
        'malha-algodao', 'malha-bally', 'malha-canelada',
        'malha-canelada-de-suede', 'malha-crepe', 'malha-fio-torcido', 'malha-helanca',
        'malha-laisy', 'malha-leila-kids', 'malha-leila-sublimacao', 'malha-montaria',
        'malha-pp', 'malha-pv', 'malha-suede', 'microfibra', 'moletom',
        'romantic', 'romantic-prime', 'suplex', 'tule', 'valentino', 'viscolycra'
    ]
};

// Contar slides automaticamente
function contarSlidesAutomaticamente() {
    const artigos = {};

    // Procurar por todos os sliders
    document.querySelectorAll('[id^="slider-"]').forEach(slider => {
        const artigoId = slider.id.replace('slider-', '');
        // Contar quantas imagens/divs tem dentro do slider
        const numSlides = slider.children.length;
        artigos[artigoId] = { slides: numSlides };
    });

    return artigos;
}

// Inicializar o catálogo
document.addEventListener('DOMContentLoaded', function () {
    catalogoState.artigos = contarSlidesAutomaticamente();
    inicializarCatalogo();
    // Inicializar filtro e busca no catálogo quando disponível
    inicializarFiltro();
});

// ============================================================================
// INICIALIZAR CATÁLOGO
// ============================================================================

function inicializarCatalogo() {
    // Inicializar slides de cada artigo
    Object.keys(catalogoState.artigos).forEach(artigo => {
        catalogoState.currentSlide[artigo] = 0;
        criarDots(artigo);
        atualizarDots(artigo);
    });
}

// ============================================================================
// CRIAR INDICADORES (DOTS)
// ============================================================================

function criarDots(artigo) {
    const dotsContainer = document.getElementById(`dots-${artigo}`);
    if (!dotsContainer) return;

    const numSlides = catalogoState.artigos[artigo].slides;
    dotsContainer.innerHTML = '';

    for (let i = 0; i < numSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => irParaSlide(artigo, i);
        dotsContainer.appendChild(dot);
    }
}

// ============================================================================
// ATUALIZAR INDICADORES
// ============================================================================

function atualizarDots(artigo) {
    const dotsContainer = document.getElementById(`dots-${artigo}`);
    if (!dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === catalogoState.currentSlide[artigo]) {
            dot.classList.add('active');
        }
    });
}

// ============================================================================
// MUDAR SLIDE
// ============================================================================

function mudarSlide(buttonOrArtigo, direcao) {
    let artigo;

    // Se receber um string (artigo), usa diretamente
    if (typeof buttonOrArtigo === 'string') {
        artigo = buttonOrArtigo;
    } else {
        // Se receber um elemento button, encontra o artigo
        const sliderContainer = buttonOrArtigo.closest('.slider-container');
        if (!sliderContainer) return;
        const slider = sliderContainer.querySelector('.slider');
        if (!slider) return;
        artigo = slider.id.replace('slider-', '');
    }

    if (!catalogoState.artigos[artigo]) return;

    const numSlides = catalogoState.artigos[artigo].slides;
    let novoSlide = catalogoState.currentSlide[artigo] + direcao;

    // Fazer loop (voltar ao início quando chegar ao final e vice-versa)
    if (novoSlide >= numSlides) {
        novoSlide = 0;
    } else if (novoSlide < 0) {
        novoSlide = numSlides - 1;
    }

    irParaSlide(artigo, novoSlide);
}

// ============================================================================
// IR PARA SLIDE ESPECÍFICO
// ============================================================================

function irParaSlide(artigo, indice) {
    const slider = document.getElementById(`slider-${artigo}`);
    if (!slider) return;

    catalogoState.currentSlide[artigo] = indice;

    // Calcular a posição do slider
    const offset = -indice * 100;
    slider.style.transform = `translateX(${offset}%)`;

    // Atualizar dots
    atualizarDots(artigo);
}

// ============================================================================
// FILTRO COM BUSCA
// ============================================================================

// Helper para normalizar texto, removendo acentos e convertendo para minúsculas
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function renderizarProdutos() {
    const nenhumResultado = document.getElementById('nenhum-resultado');
    const todosProdutos = document.querySelectorAll('.catalogo-artigo[data-artigo]');
    let produtosVisiveis = 0;

    todosProdutos.forEach(produto => {
        const artigoDoProduto = produto.getAttribute('data-artigo');
        const nomeProduto = produto.querySelector('.artigo-titulo')?.textContent || '';
        const descricaoProduto = produto.querySelector('.artigo-descricao')?.textContent || '';
        let mostrar = false;

        if (filtroState.termoBusca) {
            const nomeNormalizado = normalizarTexto(nomeProduto);
            const descricaoNormalizada = normalizarTexto(descricaoProduto);
            const artigoNormalizado = normalizarTexto(artigoDoProduto || '');

            mostrar = nomeNormalizado.includes(filtroState.termoBusca) ||
                descricaoNormalizada.includes(filtroState.termoBusca) ||
                artigoNormalizado.includes(filtroState.termoBusca);
        } else if (filtroState.artigoAtual === 'todos') {
            mostrar = true;
        } else {
            mostrar = artigoDoProduto === filtroState.artigoAtual;
        }

        if (mostrar) {
            produto.style.display = '';
            produtosVisiveis++;
        } else {
            produto.style.display = 'none';
        }
    });

    if (nenhumResultado) {
        nenhumResultado.style.display = produtosVisiveis === 0 ? 'block' : 'none';
    }
}

function mudarArtigo(artigo) {
    filtroState.artigoAtual = artigo;
    filtroState.termoBusca = '';

    const searchInput = document.getElementById('catalogo-search');
    if (searchInput) {
        searchInput.value = '';
    }

    document.querySelectorAll('.catalogo-filtro-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-artigo') === artigo) {
            btn.classList.add('active');
        }
    });

    renderizarProdutos();
}

function buscarArtigo(termo) {
    filtroState.termoBusca = normalizarTexto(termo);

    if (!filtroState.termoBusca) {
        mudarArtigo('todos');
        return;
    }

    document.querySelectorAll('.catalogo-filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    renderizarProdutos();
}

function inicializarFiltro() {
    const searchInput = document.getElementById('catalogo-search');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            buscarArtigo(e.target.value);
        });
    }

    document.querySelectorAll('.catalogo-filtro-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const artigo = this.getAttribute('data-artigo');
            mudarArtigo(artigo);
        });
    });

    mudarArtigo('todos');
}

function limparFiltros() {
    filtroState.artigoAtual = 'todos';
    filtroState.termoBusca = '';

    const searchInput = document.getElementById('catalogo-search');
    if (searchInput) {
        searchInput.value = '';
    }

    mudarArtigo('todos');
}

function obterArtigosFiltrados() {
    const todosProdutos = document.querySelectorAll('.catalogo-artigo[data-artigo]');
    const artigos = [];

    todosProdutos.forEach(produto => {
        if (produto.style.display !== 'none') {
            artigos.push({
                nome: produto.querySelector('.artigo-titulo')?.textContent || '',
                artigo: produto.getAttribute('data-artigo')
            });
        }
    });

    return artigos;
}

window.mudarArtigo = mudarArtigo;
window.buscarArtigo = buscarArtigo;
window.limparFiltros = limparFiltros;
window.obterArtigosFiltrados = obterArtigosFiltrados;

// ============================================================================
// SUPORTE A TECLADO
// ============================================================================

document.addEventListener('keydown', function (event) {
    // Encontrar o artigo ativo
    const artigoAtivo = document.querySelector('.catalogo-artigo.active');
    if (!artigoAtivo) return;

    const artigo = artigoAtivo.getAttribute('data-artigo');

    if (event.key === 'ArrowLeft') {
        mudarSlide(artigo, -1);
    } else if (event.key === 'ArrowRight') {
        mudarSlide(artigo, 1);
    }
});
