const carrinho = [];
let totalPedido = 0;

function atualizarContador() {
  const contador = document.getElementById('contador-pedidos');
  if (contador) {
    contador.textContent = carrinho.length;
  }
}

function adicionarAoCarrinho(nome, preco) {
  carrinho.push({ nome, preco: parseFloat(preco) });
  totalPedido += parseFloat(preco);
  atualizarContador();
  
  mostrarNotificacao(`${nome} adicionado ao carrinho!`, 'success');
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  const notif = document.createElement('div');
  notif.className = `notificacao notif-${tipo}`;
  notif.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${mensagem}</span>
  `;
  notif.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${tipo === 'success' ? '#28a745' : '#ffc107'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideInRight 0.4s ease;
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => notif.remove(), 400);
  }, 2500);
}

function abrirModalPedidos() {
  if (carrinho.length === 0) {
    mostrarNotificacao('Seu carrinho está vazio!', 'warning');
    return;
  }

  const modalOverlay = document.getElementById('modal-overlay');
  if (!modalOverlay) return;

  let resumo = '═══════════════════════════\n';
  resumo += '     RESUMO DO PEDIDO\n';
  resumo += '═══════════════════════════\n\n';
  
  carrinho.forEach((item, index) => {
    resumo += `${index + 1}. ${item.nome}\n`;
    resumo += `   R$ ${item.preco.toFixed(2)}\n\n`;
  });
  
  resumo += '───────────────────────────\n';
  resumo += `TOTAL: R$ ${totalPedido.toFixed(2)}\n`;
  resumo += '═══════════════════════════';

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h4><i class="fas fa-receipt me-2"></i>Finalizar Pedido</h4>
        <button class="btn-close" onclick="fecharModal()">&times;</button>
      </div>
      <div class="modal-body">
        <h5><i class="fas fa-shopping-bag me-2"></i>Seu Pedido</h5>
        <pre class="pedido-resumo">${resumo}</pre>
        
        <h5><i class="fas fa-credit-card me-2"></i>Forma de Pagamento</h5>
        <div class="payment-options">
          <button class="btn-outline-success" onclick="selecionarPagamento('pix')">
            <i class="fab fa-pix"></i>
            PIX
          </button>
          <button class="btn-outline-info" onclick="selecionarPagamento('cartao')">
            <i class="fas fa-credit-card"></i>
            Cartão
          </button>
        </div>
        
        <div id="qrcode-container" class="qrcode-area hidden">
          <div id="qrcode"></div>
          <p><i class="fas fa-mobile-alt me-2"></i>Escaneie o QR Code para pagar</p>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.remove('hidden');
}

function fecharModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.classList.add('hidden');
    setTimeout(() => {
      const qrcodeDiv = document.getElementById('qrcode');
      if (qrcodeDiv) qrcodeDiv.innerHTML = '';
    }, 400);
  }
}

function selecionarPagamento(tipo) {
  const qrcodeContainer = document.getElementById('qrcode-container');
  const qrcodeDiv = document.getElementById('qrcode');
  
  if (tipo === 'pix') {
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, {
      text: `PIX: R$ ${totalPedido.toFixed(2)} - Lanches & Bebidas`,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    qrcodeContainer.classList.remove('hidden');
    
    setTimeout(() => {
      finalizarPedido('PIX');
    }, 3000);
  } else {
    finalizarPedido('Cartão');
  }
}

function finalizarPedido(formaPagamento) {
  mostrarNotificacao(`Pedido confirmado! Pagamento: ${formaPagamento}`, 'success');
  
  setTimeout(() => {
    fecharModal();
    carrinho.length = 0;
    totalPedido = 0;
    atualizarContador();
  }, 2000);
}

function inicializarCarrossel() {
  const track = document.getElementById('carousel-track');
  const btnPrev = document.getElementById('prevBtn');
  const btnNext = document.getElementById('nextBtn');
  
  if (!track || !btnPrev || !btnNext) return;
  
  let currentIndex = 0;
  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let autoPlayInterval;
  
  function updateCarousel(smooth = true) {
    track.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      currentIndex++;
      updateCarousel();
      
      if (currentIndex >= totalSlides) {
        setTimeout(() => {
          currentIndex = 0;
          updateCarousel(false);
        }, 500);
      }
    }, 5000);
  }
  
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  
  btnNext.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
    resetAutoPlay();
    
    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        updateCarousel(false);
      }, 500);
    }
  });
  
  btnPrev.addEventListener('click', () => {
    if (currentIndex === 0) {
      currentIndex = totalSlides;
      updateCarousel(false);
      setTimeout(() => {
        currentIndex = totalSlides - 1;
        updateCarousel();
      }, 20);
    } else {
      currentIndex--;
      updateCarousel();
    }
    resetAutoPlay();
  });
  
  startAutoPlay();
}

function inicializarMenuMobile() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  
  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
    
    const navLinks = navbarMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  }
}

function inicializarBusca() {
  const inputPesquisa = document.getElementById('input-pesquisa');
  const listaProdutos = document.getElementById('lista-produtos');
  
  if (!inputPesquisa || !listaProdutos) return;
  
  inputPesquisa.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase().trim();
    const cards = listaProdutos.querySelectorAll('.card');
    
    cards.forEach(card => {
      const titulo = card.querySelector('.card-title').textContent.toLowerCase();
      const descricao = card.querySelector('.card-text').textContent.toLowerCase();
      
      if (titulo.includes(termo) || descricao.includes(termo)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function inicializarFormularioContato() {
  const formContato = document.getElementById('form-contato');
  
  if (formContato) {
    formContato.addEventListener('submit', (e) => {
      e.preventDefault();
      mostrarNotificacao('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      formContato.reset();
    });
  }
}

function inicializarEventListeners() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-comprar')) {
      const btn = e.target.closest('.btn-comprar');
      const item = btn.dataset.item;
      const preco = btn.dataset.preco;
      adicionarAoCarrinho(item, preco);
    }
  });
  
  const linkPedidos = document.getElementById('link-pedidos');
  if (linkPedidos) {
    linkPedidos.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalPedidos();
    });
  }
  
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        fecharModal();
      }
    });
  }
}

function adicionarAnimacoes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .btn-comprar {
      transition: all 0.3s ease;
    }
    
    .btn-comprar:active {
      transform: scale(0.95);
    }
    
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarCarrossel();
  inicializarMenuMobile();
  inicializarBusca();
  inicializarFormularioContato();
  inicializarEventListeners();
  adicionarAnimacoes();
  atualizarContador();
  
  console.log('🍔 Sistema de Delivery inicializado com sucesso!');
});