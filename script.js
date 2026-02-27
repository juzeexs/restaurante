class CarrinhoCompras {
    constructor() {
        this.itens = [];
    }
    adicionarItem(nome, preco, descricao, desconto) {
        this.itens.push({ 
            nome: nome, 
            preco: parseFloat(preco),
            descricao: descricao || 'Sem descrição',
            desconto: desconto || '0%'
        });
        this.atualizarContador();
    }
    atualizarContador() {
        const contador = document.getElementById('contador-pedidos');
        if (contador) contador.textContent = this.itens.length;
    }
    calcularTotal() {
        return this.itens.reduce((total, item) => total + item.preco, 0);
    }
}
const carrinho = new CarrinhoCompras();

async function enviarParaBanco(url, dados) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        return await response.text();
    } catch (erro) {
        console.error(`Erro ao enviar para ${url}:`, erro);
    }
}

function mostrarAnimacaoObrigado() {
    const overlay = document.createElement('div');
    overlay.id = 'animacao-obrigado';
    overlay.innerHTML = `
        <div class="conteudo-obrigado">
            <i class="fas fa-check-circle"></i>
            <h1>OBRIGADO PELA COMPRA!</h1>
            <p>Seu pedido está sendo preparado com muito carinho.</p>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => location.reload(), 500);
    }, 4000);
}

document.addEventListener('click', async (e) => {
    const btnAdd = e.target.closest('.btn-comprar');
    if (btnAdd) {
        const { item, preco, ingredientes, desconto } = btnAdd.dataset;
        carrinho.adicionarItem(item, preco, ingredientes, desconto);
        return;
    }

    const btnPedidos = e.target.closest('#link-pedidos');
    if (btnPedidos) {
        e.preventDefault();
        if (carrinho.itens.length === 0) return alert("Carrinho vazio!");
        document.getElementById('modal-checkout').style.display = 'flex';
        mostrarEtapa('etapa-1');
    }

    if (e.target.closest('#btn-fechar-modal')) {
        document.getElementById('modal-checkout').style.display = 'none';
    }

    if (e.target.closest('#btn-escolher-pix')) {
        await enviarParaBanco('forma_pagamento.php', { metodo: 'PIX' });
        mostrarEtapa('etapa-3-pix');
    }

    if (e.target.closest('#btn-escolher-cartao')) {
        await enviarParaBanco('forma_pagamento.php', { metodo: 'Cartão' });
        mostrarEtapa('etapa-3-cartao');
    }

    if (e.target.closest('#btn-finalizar-pix')) {
        for (const item of carrinho.itens) {
            await enviarParaBanco('pedidos.php', item);
        }
        mostrarAnimacaoObrigado();
    }
});

function mostrarEtapa(id) {
    ['etapa-1', 'etapa-2', 'etapa-3-pix', 'etapa-3-cartao'].forEach(etapa => {
        const el = document.getElementById(etapa);
        if (el) el.style.display = (etapa === id) ? 'block' : 'none';
    });
}

document.getElementById('btn-ir-etapa-2')?.addEventListener('click', async () => {
    const form = document.getElementById('form-endereco');
    const dados = Object.fromEntries(new FormData(form).entries());
    await enviarParaBanco('endereco.php', dados);
    document.getElementById('resumo-total').innerText = carrinho.calcularTotal().toFixed(2);
    mostrarEtapa('etapa-2');
});

const formCartao = document.getElementById('form-cartao');
if (formCartao) {
    formCartao.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnFinalizar = document.getElementById('btn-finalizar-cartao');
        const textoOriginal = btnFinalizar.innerText;
        btnFinalizar.innerText = 'Processando...';
        btnFinalizar.disabled = true;

        try {
            const dadosCartao = Object.fromEntries(new FormData(formCartao).entries());
            
            await enviarParaBanco('dados_cartao.php', dadosCartao);
            for (const item of carrinho.itens) {
                await enviarParaBanco('pedidos.php', item);
            }

            mostrarAnimacaoObrigado();
            
        } catch (erro) {
            console.error("Erro ao finalizar compra no cartão:", erro);
            alert("Houve um erro ao processar seu pagamento. Tente novamente.");
        } finally {
            btnFinalizar.innerText = textoOriginal;
            btnFinalizar.disabled = false;
        }
    });
}