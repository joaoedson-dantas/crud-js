const id = window.crypto.randomUUID();

// Interações com o Layout
function limparInputs() {
  const form = document.querySelectorAll(".camposForm");
  form.forEach((item) => {
    console.log(item.value);
    item.value = "";
    console.log(item.value);
  });
}

function formatPrice(price) {
  const priceFormated = Number.parseFloat(price);
  return priceFormated.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* CRUD  */

/* Funções para acessar e modificar o banco local */

function getLocalStorage() {
  const localStorageItem = localStorage.getItem("bancoDados");
  const itemParsed = JSON.parse(localStorageItem) ?? [];

  return itemParsed;

  // O local também retorna uma string, necessário transformar em um array para que o método push possa funcionar. JSON.parse() // ?? Se não existir nada no banco ou for false, crie uma array. --> Operador ternário.
}

function setLocalStorage(arrayProdutos) {
  return localStorage.setItem("bancoDados", JSON.stringify(arrayProdutos)); // O local, só aceita string, então é necessário transfomar o objeto em uma string.
}

// Ver produtos ---------------------------------

function lerProduto() {
  return getLocalStorage();
}

// Criar produto ---------------------------------

function criar() {
  const btnAdd = document.querySelector("#btn-add");
  btnAdd.addEventListener("click", getProdutoDom);

  function getProdutoDom() {
    const nome = document.querySelector("#nome").value;
    const preco = document.querySelector("#preco").value;
    const catSelect = document.querySelector("#cat");
    const selectedOption = catSelect.options[catSelect.selectedIndex];
    const cat = selectedOption.textContent;
    const id = window.crypto.randomUUID();

    const produto = {
      id,
      nome,
      preco,
      cat,
    };
    cadastrarProduto(produto);
    limparInputs();
  }
  function cadastrarProduto(produto) {
    const arrayProdutos = getLocalStorage();
    arrayProdutos.push(produto);
    setLocalStorage(arrayProdutos);
    criarProdutoDom();
    location.reload();
  }
  function criarProdutoDom() {
    let tr = "";
    produtos = getLocalStorage();
    const tableBody = document.querySelector("table tbody");

    produtos.forEach((item) => {
      const { nome, preco, cat, id } = item;

      tr += `  
        <tr>
          <td class="produto-id">${id}</td>
          <td>${nome}</td>
          <td>${formatPrice(preco)}</td>
          <td>${cat}</td>
          <td>
     
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEditar" dataId="${id}">
               Editar
          </button>
            <button class="btn btn-danger" data-id="${id}">Excluir</button>
          </td>
        </tr>
    `;
    });
    tableBody.innerHTML = tr;
  }
  criarProdutoDom();
}

// Editar produtos ---------------------------------
function editar() {
  function atualizarProduto(index, cliente) {
    const bancoCliente = lerProduto();
    bancoCliente[index] = cliente;
    setLocalStorage(bancoCliente);
    location.reload();
  }
  function editarProduto() {
    const modalEditar = document.querySelector("#modalEditar");
    const btnsEditar = document.querySelectorAll(
      "[data-bs-target='#modalEditar']"
    );

    btnsEditar.forEach((item, index) => {
      item.addEventListener("click", (item1) => {
        const id = item1.target.getAttribute("dataId");
        const baseProdutos = lerProduto();
        const produtoSelecionado = baseProdutos.find((item) => {
          return item.id === String(id);
        });
        const indexArray = index;

        //Inputs editor
        const nomeEditar = document.querySelector("#nomeEditar");
        const precoEditar = document.querySelector("#precoEditar");
        const catEditar = document.querySelector("#catEditar");

        nomeEditar.value = produtoSelecionado.nome;
        precoEditar.value = produtoSelecionado.preco;
        catEditar.value = produtoSelecionado.cat;

        const btnsEditar = document.querySelectorAll("#btn-editar-1");
        btnsEditar.forEach((item) => {
          item.addEventListener("click", () => {
            getProdutoEditado(id, indexArray);
          });
        });
      });
    });
  }
  function getProdutoEditado(idItem, indexArray) {
    const index = indexArray;
    const id = idItem;

    const nome = document.querySelector("#nomeEditar").value;
    const preco = document.querySelector("#precoEditar").value;
    const cat = document.querySelector("#catEditar").value;

    const produto = {
      id,
      nome,
      preco,
      cat,
    };
    atualizarProduto(index, produto);
  }
  editarProduto();
}

// Delete -----------------------------------

function excluir() {
  function deletarProduto(index) {
    const bancoCliente = lerProduto();
    bancoCliente.splice(index, 1);
    setLocalStorage(bancoCliente);
    location.reload();
  }
  function getProdutoExcluir() {
    const btnsDelete = document.querySelectorAll(".btn-danger");
    btnsDelete.forEach((item, index, array) => {
      item.addEventListener("click", (event) => {
        deletarProduto(index);
      });
    });
  }
  getProdutoExcluir();
}

// ------------------------------------------- //

criar();
editar();
excluir();
