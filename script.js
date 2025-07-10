  const produtos = [
        {
            imagem : "Imagem/Picanha.jpg",
            nome : "Picanha",
            preco : "1200Mts/kg"
        },
        {
            imagem : "Imagem/Alcatra2.jpg",
            nome : "Bife Alcatra",
            preco : "850Mts/kg"
        }
        ,
        {
            imagem : "Imagem/Alcatra.jpg",
            nome : "Bife Alcatra",
            preco : "850Mts/kg"
        }
    ];
    let items = []

    function get_carinho(imagem,nome,preco){
        items.push({imagem,nome,preco})
        alert("Produto adicionado ao carinho")
        console.log("produto adicionado ao carinho")

        for(let i = 0;i < items.length; i++){
            console.log(items[i]);
        }
    }

    function verCarinho() {
        if (items.length === 0) {
        alert("Seu carrinho está vazio.");
        fechar_div("mini-carrinho")
        return;
    }

        const carrinhoBox = document.getElementById("mini-carrinho");
        const lista = document.getElementById("mini-carrinho-itens");

        lista.innerHTML = ""; // limpa

       items.forEach((item, index) => {
  lista.innerHTML += `
    <div class="d-flex align-items-center mb-2 border-bottom pb-2 justify-content-between">
      <div class="d-flex align-items-center">
        <img src="${item.imagem}" alt="${item.nome}" 
             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
        <div>
          <strong>${item.nome}</strong><br>
          <span>${item.preco}</span>
        </div>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="removerItem(${index})">
        🗑️
      </button>
    </div>
  `;
});
            carrinhoBox.style.display = "block";
        }

    function removerItem(index){
        items.splice(index, 1);
        verCarinho();
    }

    // Função para criar card
    function criarCard(produtos) {
      return `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${produtos.imagem}" class="card-img-top" alt="${produtos.nome}">
            <div class="card-body">
              <h5 class="card-title text-danger">${produtos.nome}</h5>
              <p class="card-text fw-bold">${produtos.preco}</p>
               <div class="container d-flex justify-content-center">
               <button class="btn btn-danger d-flex align-items-center" onclick='get_carinho("${produtos.imagem}","${produtos.nome}","${produtos.preco}")' style="width: 140px;height: 40px">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-cart me-2" viewBox="0 0 16 16">
                    <path d="M0 1a1 1 0 0 1 1-1h1.11a.5.5 0 0 1 .49.4L2.89 2H14a1 1 0 0 1 .97 1.24l-1.5 6A1 1 0 0 1 12.5 10H4.12l-.21 1H13a.5.5 0 0 1 0 1H3.5a.5.5 0 0 1-.49-.6l.5-2A.5.5 0 0 1 4 9h8.5a.5.5 0 0 0 .48-.36l1.5-6A.5.5 0 0 0 14 2H3.21l-.38-1.53A.5.5 0 0 0 2.34 0H1a1 1 0 0 1-1-1zm5.5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Adicionar
                </button>
                </div>
            </div>
          </div>
        </div>
      `;
    }
    function fechar_div(id){
        const div =document.getElementById(id);
        if(div){
            div.style.display = "none";
        }
    }

   async function gerarReciboPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Pega os dados do carrinho do localStorage
        const items = JSON.parse(localStorage.getItem("dadosCarrinho")) || [];

  if (items.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  // Agrupar duplicados
  const produtosAgrupados = {};
  items.forEach(item => {
    const key = item.nome;
    if (produtosAgrupados[key]) {
      produtosAgrupados[key].quantidade += 1;
    } else {
      produtosAgrupados[key] = {
        nome: item.nome,
        preco: item.preco,
        quantidade: 1
      };
    }
  });

  // Cabeçalho
  const data = new Date().toLocaleDateString();
  doc.setFontSize(18);
  doc.setTextColor(220, 53, 69); // vermelho escuro
  doc.text("Recibo - JJ Carnes", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Data: ${data}`, 20, 30);

  // Tabela
  const tableData = [];
  let total = 0;

  Object.values(produtosAgrupados).forEach(prod => {
    const precoNumerico = parseInt(prod.preco.replace(/\D/g, ""));
    const subtotal = precoNumerico * prod.quantidade;
    total += subtotal;

    tableData.push([
      prod.nome,
      prod.preco,
      prod.quantidade,
      subtotal + " Mts"
    ]);
  });

  doc.autoTable({
    head: [["Produto", "Preço Unit.", "Quantidade", "Subtotal"]],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 11,
      cellPadding: 4
    },
    headStyles: {
      fillColor: [220, 53, 69], // vermelho
      textColor: 255,
      halign: 'center'
    },
    bodyStyles: {
      halign: 'center'
    }
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total: ${total} Mts`, 20, finalY);

  doc.save("recibo_jj_carnes.pdf");
}

    function concluirPedido() {
    // Salva os dados no localStorage para acessar na próxima página
     localStorage.setItem("dadosCarrinho", JSON.stringify(items));

     // Vai para a página de recibo
     window.location.href = "recibo.html";
    }

    // Adiciona o card no HTML
    const container = document.getElementById("produtos");

    produtos.forEach(produto => {
     container.innerHTML += criarCard(produto);  
});