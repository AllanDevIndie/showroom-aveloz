/**
 * Sistema de Carrinho de Estampas A'Veloz
 * Gerencia a seleção de estampas e o envio para o WhatsApp
 */

let carrinho = [];

// Função para adicionar/remover do carrinho
function toggleCarrinho(produtoId, produtoNome) {
    const index = carrinho.findIndex(item => item.id === produtoId);
    
    if (index > -1) {
        // Remove se já estiver no carrinho
        carrinho.splice(index, 1);
    } else {
        // Adiciona se não estiver
        carrinho.push({ id: produtoId, nome: produtoNome });
    }
    
    atualizarInterfaceCarrinho();
    salvarCarrinho();
}

// Atualiza o contador e a lista visual do carrinho
function atualizarInterfaceCarrinho() {
    const contador = document.getElementById('carrinho-count');
    if (contador) contador.innerText = carrinho.length;
    
    const lista = document.getElementById('carrinho-lista');
    if (lista) {
        if (carrinho.length === 0) {
            lista.innerHTML = '<p class="carrinho-vazio" style="padding: 20px; text-align: center; color: #888;">Nenhuma estampa selecionada.</p>';
        } else {
            lista.innerHTML = carrinho.map(item => `
                <div class="carrinho-item">
                    <div class="carrinho-item-info">
                        <strong>${item.nome}</strong>
                        <span>ID: ${item.id}</span>
                    </div>
                    <button class="btn-remover-item" onclick="toggleCarrinho('${item.id}', '${item.nome}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Atualiza o estado dos botões nos cards
    const botoes = document.querySelectorAll('.btn-carrinho');
    botoes.forEach(btn => {
        const id = btn.getAttribute('data-id');
        const estaNoCarrinho = carrinho.some(item => item.id === id);
        
        if (estaNoCarrinho) {
            btn.classList.add('no-carrinho');
            btn.innerHTML = '<i class="fas fa-check"></i> Selecionado';
        } else {
            btn.classList.remove('no-carrinho');
            btn.innerHTML = '<i class="fas fa-plus"></i> Selecionar';
        }
    });
}

// Salva o carrinho no localStorage para não perder ao atualizar a página
function salvarCarrinho() {
    localStorage.setItem('carrinho_aveloz', JSON.stringify(carrinho));
}

// Abre/Fecha a lista do carrinho
function toggleExibirCarrinho() {
    const container = document.getElementById('carrinho-flutuante');
    container.classList.toggle('aberto');
}

// Carrega o carrinho salvo
function carregarCarrinhoSalvo() {
    const salvo = localStorage.getItem('carrinho_aveloz');
    if (salvo) {
        carrinho = JSON.parse(salvo);
        atualizarInterfaceCarrinho();
    }
}

// Formata e envia o pedido para o WhatsApp
function enviarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Selecione algumas estampas primeiro.");
        return;
    }

    const numeroWhats = "5581994733852";
    let mensagem = "*Olá A'Veloz! Gostaria de solicitar as seguintes estampas digitais:*\n\n";
    
    carrinho.forEach((item, index) => {
        mensagem += `${index + 1}. *ID:* ${item.id} - *Nome:* ${item.nome}\n`;
    });
    
    mensagem += `\n*Total de itens:* ${carrinho.length}\n`;
    mensagem += "\n_Aguardando confirmação de disponibilidade dos artigos._";

    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Inicialização
document.addEventListener('DOMContentLoaded', carregarCarrinhoSalvo);
