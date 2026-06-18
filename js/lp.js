/* ============================================================================
   LANDING PAGE A'VELOZ TÊXTIL - JAVASCRIPT
   Desenvolvido por DEV ALBK
   ============================================================================ */

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarPagina();
});

function inicializarPagina() {
    // Inicializar funcionalidades
    configurarNavegacao();
    configurarBotoes();
    configurarLazyLoading();
    configurarAnimacoes();
}

// ============================================================================
// NAVEGAÇÃO SUAVE
// ============================================================================

function configurarNavegacao() {
    // Encontrar todos os links internos
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar links vazios ou especiais
            if (href === '#' || href === '#elementor-action%3Aaction%3Dpopup%3Aclose%26settings%3DeyJkb19ub3Rfc2hvd19hZ2FpbiI6IiJ9') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================================================
// CONFIGURAR BOTÕES CTA
// ============================================================================

function configurarBotoes() {
    const botoes = document.querySelectorAll('.cta-button');
    
    botoes.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        botao.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ============================================================================
// LAZY LOADING DE IMAGENS
// ============================================================================

function configurarLazyLoading() {
    // Verificar se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Carregar imagem
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Parar de observar
                    observer.unobserve(img);
                }
            });
        });
        
        // Observar todas as imagens com lazy loading
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================================================
// ANIMAÇÕES AO SCROLL
// ============================================================================

function configurarAnimacoes() {
    // Verificar se o navegador suporta Intersection Observer
    if ('IntersectionObserver' in window) {
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observar elementos com classe 'animate-on-scroll'
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            elementObserver.observe(el);
        });
    }
}

// ============================================================================
// CONTADOR DE NÚMEROS (Para estatísticas)
// ============================================================================

function animarNumero(elemento, final, duracao = 2000) {
    const inicio = 0;
    const incremento = final / (duracao / 16);
    let atual = inicio;
    
    const timer = setInterval(() => {
        atual += incremento;
        if (atual >= final) {
            elemento.textContent = final;
            clearInterval(timer);
        } else {
            elemento.textContent = Math.floor(atual);
        }
    }, 16);
}

// ============================================================================
// FORMULÁRIO DE CONTATO (Se necessário)
// ============================================================================

function enviarFormulario(form) {
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    
    // Aqui você pode adicionar lógica para enviar o formulário
    // Por exemplo, usando fetch API
    
    return false;
}

// ============================================================================
// DETECÇÃO DE DISPOSITIVO
// ============================================================================

function ehMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function ehTablet() {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

// Debounce para otimizar eventos
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle para limitar execução
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// RASTREAMENTO DE EVENTOS (Analytics - Opcional)
// ============================================================================

function rastrearEvento(categoria, acao, label = '') {
    // Se você usar Google Analytics, descomente:
    // gtag('event', acao, {
    //     'event_category': categoria,
    //     'event_label': label
    // });
    
    console.log(`Evento rastreado: ${categoria} - ${acao} - ${label}`);
}

// Rastrear cliques em botões CTA
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        rastrearEvento('engagement', 'cta_click', e.target.textContent.trim());
    }
});

// ============================================================================
// SCROLL PARA TOPO
// ============================================================================

function criarBotaoTopo() {
    const botaoTopo = document.createElement('button');
    botaoTopo.id = 'scroll-to-top';
    botaoTopo.innerHTML = '<i class="fas fa-arrow-up"></i>';
    botaoTopo.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--secondary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(botaoTopo);
    
    // Mostrar/esconder botão ao fazer scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            botaoTopo.style.display = 'flex';
        } else {
            botaoTopo.style.display = 'none';
        }
    }, 100));
    
    // Scroll para topo ao clicar
    botaoTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Hover effects
    botaoTopo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    botaoTopo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Criar botão de topo se a página for longa
if (document.body.scrollHeight > 1000) {
    criarBotaoTopo();
}

// ============================================================================
// VERIFICAR SUPORTE A WEBP
// ============================================================================

function verificarSuporteWebP(callback) {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
        callback(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAA9AwCdASoBIAEADsAcJaACdLoB/gAA/v7+AAA=';
}

// ============================================================================
// PERFORMANCE - MONITORAR CORE WEB VITALS
// ============================================================================

function monitorarPerformance() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP não suportado');
        }
    }
}

// Chamar monitoramento em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorarPerformance();
}

// ============================================================================
// DARK MODE (Opcional)
// ============================================================================

function configurarDarkMode() {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Escutar mudanças de preferência
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
}

// Descomentar se quiser ativar dark mode
// configurarDarkMode();

// ============================================================================
// NOTIFICAÇÕES DE COOKIES (Simples)
// ============================================================================

function mostrarNotificacaoCookies() {
    // Verificar se o usuário já aceitou cookies
    if (localStorage.getItem('cookies-aceitos')) {
        return;
    }
    
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #1a1a1a;
        color: white;
        padding: 20px;
        text-align: center;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    notificacao.innerHTML = `
        <p style="margin: 0 0 15px 0;">Este site usa cookies para garantir a melhor experiência.</p>
        <button id="aceitar-cookies" style="
            background-color: #d4a574;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        ">Aceitar</button>
        <a href="#" style="color: #d4a574; text-decoration: underline;">Saiba mais</a>
    `;
    
    document.body.appendChild(notificacao);
    
    document.getElementById('aceitar-cookies').addEventListener('click', () => {
        localStorage.setItem('cookies-aceitos', 'true');
        notificacao.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notificacao.remove(), 300);
    });
}

// Descomentar para ativar notificação de cookies
// mostrarNotificacaoCookies();

// ============================================================================
// EXPORTAR FUNÇÕES (Para uso em outros arquivos)
// ============================================================================

window.LP = {
    animarNumero,
    debounce,
    throttle,
    rastrearEvento,
    ehMobile,
    ehTablet,
    verificarSuporteWebP
};
