// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Camiseta Brazuca",
        price: 79.90,
        image: "assets/camisa.jpg",
        description: "Camiseta 100% algodão com estampa brasileira exclusiva.",
        badge: "Novo"
    },
    {
        id: 2,
        name: "Kit Brazuca Azul",
        price: 129.90,
        image: "assets/Kit azul.jpg",
        description: "Kit completo na cor azul, perfeito para o dia a dia.",
        badge: "Mais Vendido"
    },
    {
        id: 3,
        name: "Kit Brazuca Marrom",
        price: 159.90,
        image: "assets/Kit marrom.jpg",
        description: "Kit completo na cor marrom, estilo e conforto garantidos.",
        badge: "Elegante"
    },
    {
        id: 4,
        name: "Kit Brazuca Verde",
        price: 149.90,
        image: "assets/Kit Verde.jpg",
        description: "Kit completo na cor verde, visual moderno e sofisticado.",
        badge: "Premium"
    },
    {
        id: 5,
        name: "Short Brazuca",
        price: 69.90,
        image: "assets/Short.jpg",
        description: "Short confortável ideal para o verão brasileiro.",
        badge: "Verão"
    },
    {
        id: 6,
        name: "Camiseta Oversized",
        price: 89.90,
        image: "assets/oversized.jpg",
        description: "Camiseta oversized com design moderno e confortável.",
        badge: "Tendência"
    }
];

// Carrinho de compras
let cart = [];

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    
    // Configurar formulários
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showSection('profile');
    });
    
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showSection('profile');
    });
    
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccessAnimation();
    });

    // Adicionar efeitos de interação
    addInteractionEffects();
});

// Renderizar produtos
function renderProducts() {
    const featuredGrid = document.getElementById('featured-products');
    const allProductsGrid = document.getElementById('all-products');
    
    featuredGrid.innerHTML = '';
    allProductsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        allProductsGrid.appendChild(productCard.cloneNode(true));
        
        // Adicionar apenas alguns produtos aos destaques
        if (product.id <= 3) {
            featuredGrid.appendChild(productCard);
        }
    });
}

// Criar card de produto
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">R$ ${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
            </button>
        </div>
    `;
    return productCard;
}

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    
    // Feedback visual
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

// Atualizar contador do carrinho
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    
    // Se estamos na página do carrinho, atualizar também os itens
    if (document.getElementById('cart').classList.contains('active')) {
        renderCartItems();
    }
}

// Renderizar itens do carrinho
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; opacity: 0.7;">Seu carrinho está vazio.</p>
                <button class="btn" onclick="showSection('products')" style="margin-top: 1rem;">
                    <i class="fas fa-bag-shopping"></i> Continuar Comprando
                </button>
            </div>
        `;
        document.getElementById('cart-total').textContent = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div style="margin-left: auto;">
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; cursor: pointer; color: var(--accent); font-size: 1.5rem; padding: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar quantidade de um item no carrinho
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
    }
}

// Remover item do carrinho
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    
    if (item) {
        showNotification(`${item.name} removido do carrinho`, 'warning');
    }
}

// Mostrar seção específica
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção solicitada
    document.getElementById(sectionId).classList.add('active');
    
    // Se for a página do carrinho, renderizar os itens
    if (sectionId === 'cart') {
        renderCartItems();
    }
    
    // Rolar para o topo da página
    window.scrollTo(0, 0);
}

// Mostrar animação de sucesso
function showSuccessAnimation() {
    const animation = document.getElementById('success-animation');
    animation.classList.add('active');
    
    // Criar confetes
    createConfetti();
    
    // Limpar carrinho após compra
    cart = [];
    updateCartCount();
}

// Esconder animação de sucesso
function hideSuccessAnimation() {
    document.getElementById('success-animation').classList.remove('active');
    showSection('home');
}

// Criar efeito de confete
function createConfetti() {
    const colors = ['#f8d210', '#2c5530', '#ff6b6b', '#4ecdc4', '#ffbe0b'];
    const container = document.body;
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(confetti);
        
        // Remover confete após animação
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 5000);
    }
}

// Mostrar notificação
function showNotification(message, type) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}" 
               style="margin-right: 0.5rem; color: ${type === 'success' ? 'var(--secondary)' : 'var(--accent)'};"></i>
            ${message}
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--light);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        border-left: 4px solid ${type === 'success' ? 'var(--secondary)' : 'var(--accent)'};
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Adicionar efeitos de interação
function addInteractionEffects() {
    // Efeito de digitação no título
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar efeito quando a seção home estiver ativa
        if (document.getElementById('home').classList.contains('active')) {
            setTimeout(typeWriter, 500);
        }
    }
    
    // Efeito de parallax no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Efeito de hover nos botões
    const buttons = document.querySelectorAll('.btn, .add-to-cart, .checkout-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efeito de loading nos formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        });
    });
}