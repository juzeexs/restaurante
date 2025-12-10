// ==========================================
    // 1. SISTEMA DE PEDIDOS E CARRINHO
    // ==========================================
    let pedidos = [];

    // Adicionar ao pedido
    document.querySelectorAll('.btn-comprar').forEach(btn => {
      btn.addEventListener('click', function() {
        const item = this.getAttribute('data-item');
        const preco = parseFloat(this.getAttribute('data-preco'));
        
        pedidos.push({ item, preco });
        atualizarContador();
        
        // Animação de feedback
        this.innerHTML = '<i class="fas fa-check me-2"></i>Adicionado!';
        this.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
        
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Adicionar ao Pedido';
          this.style.background = '';
        }, 1500);
        
        mostrarNotificacao('Item adicionado ao carrinho! 🎉');
      });
    });

    function atualizarContador() {
      const contador = document.getElementById('contador-pedidos');
      if(contador) contador.textContent = pedidos.length;
    }

    function mostrarNotificacao(msg) {
      const notif = document.createElement('div');
      notif.className = 'alert alert-success position-fixed top-0 end-0 m-3';
      notif.style.zIndex = '9999';
      notif.innerHTML = `<i class="fas fa-check-circle me-2"></i>${msg}`;
      document.body.appendChild(notif);
      
      setTimeout(() => notif.remove(), 3000);
    }

    // ==========================================
    // 2. PAGAMENTO E MODAL (Lógica Mista)
    // ==========================================
    
    // Ver pedidos (Abre o Modal)
    document.getElementById('link-pedidos').addEventListener('click', function(e) {
      e.preventDefault();
      
      if (pedidos.length === 0) {
        alert('Seu carrinho está vazio! Adicione itens ao pedido.');
        return;
      }
      
      let total = 0;
      let texto = 'ITENS DO PEDIDO:\n\n';
      
      pedidos.forEach((p, i) => {
        texto += `${i + 1}. ${p.item} - R$ ${p.preco.toFixed(2)}\n`;
        total += p.preco;
      });
      
      texto += `\n${'='.repeat(30)}\nTOTAL: R$ ${total.toFixed(2)}`;
      
      // Tenta usar o elemento de texto se existir
      const areaTexto = document.getElementById('texto-pedido');
      if(areaTexto) areaTexto.textContent = texto;

      // Abre o modal (usando sua função personalizada definida mais abaixo)
      abrirModal(); 
    });

    // Lógica para fechar modal e processar pagamentos
    // Nota: Seu código original misturava Bootstrap com JS puro. 
    // Mantive a estrutura lógica, mas certifique-se de que os IDs existam.

    // Pagamento Dinheiro
    const btnDinheiro = document.getElementById('btn-dinheiro');
    if(btnDinheiro) {
        btnDinheiro.addEventListener('click', function() {
            fecharModal(); // Usa a função personalizada
            setTimeout(() => {
                alert('Pedido confirmado! Pagamento em dinheiro na entrega. 💰');
                pedidos = [];
                atualizarContador();
            }, 500);
        });
    }

    // Pagamento Pix
    const btnPix = document.getElementById('btn-pix');
    if(btnPix) {
        btnPix.addEventListener('click', function() {
            const qrcodeDiv = document.getElementById('qrcode');
            if(qrcodeDiv) {
                qrcodeDiv.innerHTML = '<div class="mb-3"><div class="loading"></div><p class="mt-2">Gerando QR Code...</p></div>';
                
                setTimeout(() => {
                    qrcodeDiv.innerHTML = '';
                    // Verifica se a biblioteca QRCode existe antes de chamar
                    if(typeof QRCode !== 'undefined') {
                        new QRCode(qrcodeDiv, {
                            text: 'PIX: contato@lanchesebebidas.com',
                            width: 200,
                            height: 200
                        });
                    } else {
                        qrcodeDiv.innerHTML = '<p>QR Code Simulado (Lib não carregada)</p>';
                    }
                    
                    qrcodeDiv.innerHTML += '<p class="mt-3 fw-bold">Escaneie o QR Code para pagar</p>';
                    
                    setTimeout(() => {
                        fecharModal();
                        setTimeout(() => {
                            alert('Pagamento confirmado via Pix! Seu pedido está sendo preparado. 🚀');
                            pedidos = [];
                            atualizarContador();
                        }, 500);
                    }, 3000);
                }, 2000);
            }
        });
    }

    // ==========================================
    // 3. FORMULÁRIO E INTERFACE
    // ==========================================
    const formContato = document.getElementById('form-contato');
    if(formContato) {
        formContato.addEventListener('submit', function(e) {
          e.preventDefault();
          const btn = this.querySelector('button[type="submit"]');
          const textoOriginal = btn.innerHTML;
          
          btn.innerHTML = '<span class="loading"></span> Enviando...';
          btn.disabled = true;
          
          setTimeout(() => {
            alert('Mensagem enviada com sucesso! Responderemos em breve. 📧');
            this.reset();
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
          }, 2000);
        });
    }

    // Efeito scroll na navbar
    window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
      }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Ignora links vazios ou modais
        if (href !== '#' && !href.includes('modal')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const offset = 80;
            const targetPos = target.offsetTop - offset;
            window.scrollTo({
              top: targetPos,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Animação de entrada dos cards
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    });

    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });

    // ==========================================
    // 4. MENU E MODAL (Personalizados)
    // ==========================================
    
    // Menu Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    if(menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
          navbarMenu.classList.toggle('active');
        });
    }

    // Lógica Simples de Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-pagamento-content');

    function abrirModal() {
      if(modalOverlay) modalOverlay.classList.remove('hidden');
      if(modalContent) modalContent.classList.remove('hidden');
    }

    function fecharModal() {
      if(modalOverlay) modalOverlay.classList.add('hidden');
      if(modalContent) modalContent.classList.add('hidden');
    }

    // Fecha ao clicar fora
    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if(e.target === modalOverlay) fecharModal();
        });
    }

// Seleciona os elementos
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let currentIndex = 0;

// Função para mover o slide
function updateCarousel() {
  // Move o trilho para a esquerda baseado no índice atual
  // Ex: Slide 0 = 0%, Slide 1 = -100%, Slide 2 = -200%
  const amountToMove = -currentIndex * 100;
  track.style.transform = `translateX(${amountToMove}%)`;
}

// Botão Próximo
nextBtn.addEventListener('click', () => {
  currentIndex++;
  // Se chegar no fim, volta para o primeiro (loop infinito)
  if (currentIndex >= slides.length) {
    currentIndex = 0;
  }
  updateCarousel();
});

// Botão Anterior
prevBtn.addEventListener('click', () => {
  currentIndex--;
  // Se estiver no primeiro e voltar, vai para o último
  if (currentIndex < 0) {
    currentIndex = slides.length - 1;
  }
  updateCarousel();
});