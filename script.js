const url = 'http://localhost:3000/produtos';
let produtos = [];
let carrinho = [];
let paginaAtual = 1;
const itensPorPagina = 6;

const produtosContainer = document.getElementById('produtos');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const contadorCarrinho = document.getElementById('contador-carrinho');
const carrinhoBox = document.getElementById('carrinho');
const toggleBtn = document.getElementById('carrinhoToggle');

toggleBtn.addEventListener('click', () => {
  carrinhoBox.classList.toggle('ativo');
});

document.addEventListener('click', (e) => {
  if (!carrinhoBox.contains(e.target) && !toggleBtn.contains(e.target)) {
    carrinhoBox.classList.remove('ativo');
  }
});

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (produto) {
    carrinho.push(produto);
    atualizarCarrinho();
    mostrarToast(`${produto.nome} adicionado ao carrinho`);
  }
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    mostrarToast("Seu carrinho está vazio.");
    return;
  }

  mostrarToast("Compra finalizada com sucesso!");
  carrinho.length = 0;
  atualizarCarrinho();
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="miniatura" />
      <span>${item.nome}</span> - R$ ${item.preco.toFixed(2)}
      <button onclick="removerItem(${index})">❌</button>
    `;
    listaCarrinho.appendChild(li);
  });

  contadorCarrinho.textContent = carrinho.length;
  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function renderizarPaginacao(totalPaginas) {
  const paginacaoContainer = document.getElementById('paginacao');
  if (!paginacaoContainer) return;

  paginacaoContainer.innerHTML = '';

  const anterior = document.createElement('button');
  anterior.textContent = 'Anterior';
  anterior.disabled = paginaAtual === 1;
  anterior.onclick = () => {
    paginaAtual--;
    exibirProdutos();
  };
  paginacaoContainer.appendChild(anterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = i === paginaAtual;
    btn.onclick = () => {
      paginaAtual = i;
      exibirProdutos();
    };
    paginacaoContainer.appendChild(btn);
  }

  const proximo = document.createElement('button');
  proximo.textContent = 'Próximo';
  proximo.disabled = paginaAtual === totalPaginas;
  proximo.onclick = () => {
    paginaAtual++;
    exibirProdutos();
  };
  paginacaoContainer.appendChild(proximo);
}

function exibirProdutos() {
  produtosContainer.innerHTML = '';
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const pagina = produtos.slice(inicio, fim);

  pagina.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
    `;
    produtosContainer.appendChild(card);
  });

  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);
  renderizarPaginacao(totalPaginas);
}

async function carregarProdutos() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao carregar dados da API');

    produtos = await response.json();
    exibirProdutos();
  } catch (err) {
    produtosContainer.innerHTML = '<p style="color:red">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    console.error(err);
  }
}

function mostrarToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = mensagem;

  const container = document.getElementById('toast-container');
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

carregarProdutos();

// Torna a função acessível no escopo global para o HTML
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerItem = removerItem;
window.limparCarrinho = limparCarrinho;
window.finalizarCompra = finalizarCompra;
