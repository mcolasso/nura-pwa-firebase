/* --- BANCO DE DADOS DE PRODUTOS --- */
const CARDAPIO = [
    { 
        id: 1, 
        nome: "Bowl Verde Vitality", 
        cat: "Bowls", 
        preco: 32.90, 
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", 
        desc: "Mix de folhas, abacate, quinoa, grão de bico e molho de ervas." 
    }
];

/* --- PWA --- */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const path = window.location.pathname.includes('/pages/') ? '../service-worker.js' : './service-worker.js';
        navigator.serviceWorker.register(path).catch(console.error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarBadgeCarrinho();
    
    // Renderiza produtos se houver o grid
    if (document.getElementById('products-grid')) renderizarProdutos();
    
    // Renderiza carrinho se houver o container
    if (document.getElementById('cart-items-container')) renderizarCarrinho();

    // Abas
    const tabs = document.querySelectorAll('.tab-btn');
    if (tabs.length > 0) {
        tabs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.form-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
            });
        });
    }
});

/* --- PRODUTOS --- */
function renderizarProdutos() {
    const container = document.getElementById('products-grid');
    if(!container) return;

    container.innerHTML = CARDAPIO.map(prod => `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${prod.img}" alt="${prod.nome}" class="card-img" loading="lazy">
                <span class="card-badge" style="position:absolute; top:10px; right:10px; background:var(--primary); color:white; padding:4px 10px; border-radius:20px; font-size:0.7rem; font-weight:bold;">${prod.cat}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title" style="font-size:1.1rem; margin-bottom:0.5rem;">${prod.nome}</h3>
                <p class="card-desc" style="font-size:0.9rem; color:#666; margin-bottom:1rem; height:40px; overflow:hidden;">${prod.desc}</p>
                <div class="card-bottom" style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
                    <span class="price" style="font-weight:bold; font-size:1.2rem; color:var(--primary-dark);">R$ ${prod.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="btn btn-primary" onclick="adicionarAoCarrinho(${prod.id})">
                        <i class="ph-bold ph-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/* --- CARRINHO --- */
window.adicionarAoCarrinho = (id) => {
    let carrinho = JSON.parse(localStorage.getItem('nura_carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.qtd += 1;
    } else {
        const prod = CARDAPIO.find(p => p.id === id);
        carrinho.push({ ...prod, qtd: 1 });
    }

    localStorage.setItem('nura_carrinho', JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
    // Feedback visual rápido
    alert("Adicionado! Total na sacola: " + (itemExistente ? itemExistente.qtd : 1));
};

window.removerDoCarrinho = (id) => {
    let carrinho = JSON.parse(localStorage.getItem('nura_carrinho')) || [];
    carrinho = carrinho.filter(item => item.id !== id);
    localStorage.setItem('nura_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
    atualizarBadgeCarrinho();
};

window.alterarQtd = (id, delta) => {
    let carrinho = JSON.parse(localStorage.getItem('nura_carrinho')) || [];
    const item = carrinho.find(item => item.id === id);
    
    if (item) {
        item.qtd += delta;
        if (item.qtd <= 0) {
            removerDoCarrinho(id);
            return;
        }
        localStorage.setItem('nura_carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        atualizarBadgeCarrinho();
    }
};

function renderizarCarrinho() {
    const container = document.getElementById('cart-items-container');
    if(!container) return;

    const resumoSubtotal = document.getElementById('resumo-subtotal');
    const resumoTotal = document.getElementById('resumo-total');
    
    // Pega dados atualizados
    const carrinho = JSON.parse(localStorage.getItem('nura_carrinho')) || [];

    // Limpa o container antes de desenhar para não duplicar ou manter lixo
    container.innerHTML = '';

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="ph ph-shopping-cart" style="font-size: 3rem; color: var(--muted); margin-bottom: 1rem;"></i>
                <h3>Sua sacola está vazia</h3>
                <a href="produtos.html" class="btn btn-primary" style="margin-top: 1rem;">Ver Cardápio</a>
            </div>
        `;
        if(resumoSubtotal) resumoSubtotal.innerText = "R$ 0,00";
        if(resumoTotal) resumoTotal.innerText = "R$ 0,00";
        return;
    }

    let total = 0;
    
    // Gera o HTML
    container.innerHTML = carrinho.map(item => {
        const subtotalItem = item.preco * item.qtd;
        total += subtotalItem;
        return `
        <div class="cart-item" style="display:flex; gap:1rem; border-bottom:1px solid #eee; padding:1rem 0; align-items: center;">
            <img src="${item.img}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;" alt="${item.nome}">
            
            <div style="flex:1;">
                <h4 style="font-weight:600; font-size:1rem; margin-bottom: 0.2rem;">${item.nome}</h4>
                <div style="color:var(--primary-dark); font-weight:bold;">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem; background: #f8fafc; padding: 0.3rem; border-radius: 0.5rem;">
                <button onclick="alterarQtd(${item.id}, -1)" style="width:28px; height:28px; border:1px solid #ddd; background:white; border-radius:4px; cursor:pointer;">-</button>
                <span style="font-weight:bold; min-width:20px; text-align:center;">${item.qtd}</span>
                <button onclick="alterarQtd(${item.id}, 1)" style="width:28px; height:28px; border:1px solid #ddd; background:white; border-radius:4px; cursor:pointer;">+</button>
            </div>

            <button onclick="removerDoCarrinho(${item.id})" style="border:none; background:none; color:#ef4444; cursor:pointer; margin-left:10px; padding: 5px;">
                <i class="ph ph-trash" style="font-size:1.4rem;"></i>
            </button>
        </div>
        `;
    }).join('');

    const frete = 10.00;
    if(resumoSubtotal) resumoSubtotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if(resumoTotal) resumoTotal.innerText = `R$ ${(total + frete).toFixed(2).replace('.', ',')}`;
}

function atualizarBadgeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('nura_carrinho')) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
    
    document.querySelectorAll('.cart-count').forEach(badge => {
        badge.innerText = totalItens;
        badge.style.display = totalItens > 0 ? 'flex' : 'none';
    });
}