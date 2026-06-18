// Estado do catálogo
let catalogoState = {
    artigos: {},
    currentSlide: {}
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
document.addEventListener('DOMContentLoaded', function() {
    catalogoState.artigos = contarSlidesAutomaticamente();
    inicializarCatalogo();
    inicializarNavegacao();
    // Exibir todos os artigos por padrão
    if (document.querySelector('[data-artigo="todos"]')) {
        mudarArtigo('todos');
    }
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
// INICIALIZAR NAVEGAÇÃO DE ARTIGOS
// ============================================================================

function inicializarNavegacao() {
    const navBtns = document.querySelectorAll('.catalogo-nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const artigo = this.getAttribute('data-artigo');
            mudarArtigo(artigo);
        });
    });
}

// ============================================================================
// MUDAR ARTIGO
// ============================================================================

function mudarArtigo(artigo) {
    // Remover classe active de todos os botões
    document.querySelectorAll('.catalogo-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Se for 'todos', mostrar todos os artigos
    if (artigo === 'todos') {
        const btnTodos = document.querySelector(`[data-artigo="todos"]`);
        if (btnTodos) btnTodos.classList.add('active');

        document.querySelectorAll('.catalogo-artigo').forEach(art => {
            art.classList.add('active');
        });

        // Resetar slides de todos os artigos
        Object.keys(catalogoState.artigos).forEach(a => {
            catalogoState.currentSlide[a] = 0;
            irParaSlide(a, 0);
        });

        const catalogoSection = document.getElementById('catalogo-nativo');
        if (catalogoSection) {
            catalogoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        return;
    }

    // Adicionar classe active ao botão clicado
    const btn = document.querySelector(`[data-artigo="${artigo}"]`);
    if (btn) btn.classList.add('active');

    // Remover classe active de todos os artigos e ativar apenas o selecionado
    document.querySelectorAll('.catalogo-artigo').forEach(art => {
        art.classList.remove('active');
    });

    const artigoElem = document.querySelector(`[data-artigo="${artigo}"].catalogo-artigo`);
    if (artigoElem) artigoElem.classList.add('active');

    // Resetar o slide para o primeiro do artigo selecionado
    if (catalogoState.artigos[artigo]) {
        catalogoState.currentSlide[artigo] = 0;
        irParaSlide(artigo, 0);
    }

    // Scroll suave para o catálogo
    const catalogoSection = document.getElementById('catalogo-nativo');
    if (catalogoSection) {
        catalogoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================================================
// SUPORTE A TECLADO
// ============================================================================

document.addEventListener('keydown', function(event) {
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
