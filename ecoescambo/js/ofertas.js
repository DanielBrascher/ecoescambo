const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get("id_produto");

if (!idProduto) {
  alert("Produto inválido.");
  window.location.href = "meus_produtos.html";
}

$(document).ready(function () {
  carregarProduto();
  carregarInteressados();

  $("#interessado").on("change", function () {
    const idInteressado = $(this).val();
    if (idInteressado) {
      carregarProdutosInteressado(idInteressado);
    } else {
      $("#produtos-interessado").empty();
    }
  });

<<<<<<< HEAD
  // Captura de clique nos botões "Propor" de forma segura
  $(document).on("click", ".propor-btn", function () {
    console.log("Botão 'Propor' clicado");

    const card = $(this).closest(".produto-oferta");
    const idInteressado = $("#interessado").val();
    const idProdutoInteresse = card.data("id");

    if (!idInteressado || !idProdutoInteresse || !idProduto) {
      alert("Dados incompletos para propor troca.");
      return;
    }

    const dadosTroca = {
      id_produto: parseInt(idProduto),
      id_interessado: parseInt(idInteressado),
      id_produto_interesse: parseInt(idProdutoInteresse)
    };

    console.log("Enviando dados:", dadosTroca);

    $.ajax({
      url: "api/propor_troca.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(dadosTroca),
      success: function (res) {
        alert(res.mensagem || "Troca proposta com sucesso!");
      },
      error: function (xhr) {
        const erro = xhr.responseJSON?.erro || "Erro ao propor troca.";
        alert(erro);
      }
    });
=======
  $("#rejeitarTodas").click(function () {
    const idInteressado = $("#interessado").val();

    if (!idInteressado) {
      alert("Selecione um interessado antes de rejeitar.");
      return;
    }

    if (confirm("Tem certeza que deseja rejeitar todas as ofertas deste interessado?")) {
      $.ajax({
        url: "api/rejeitar_todas.php",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          id_produto: idProduto,
          id_interessado: idInteressado
        }),
        success: function (resposta) {
          alert(resposta.mensagem);
          carregarInteressados();
          $("#produtos-interessado").empty();
        },
        error: function () {
          alert("Erro ao rejeitar todas as ofertas.");
        }
      });
    }
>>>>>>> abb42fb04635ace6127fc1f9b4bb129ebcf0196c
  });
});

function carregarProduto() {
  $.get("api/produto.php", { id: idProduto }, function (produto) {
    $("#produto-selecionado").html(`
<<<<<<< HEAD
      <div class='produto-info'>
        <strong>produto do ${produto.nome_usuario}</strong>
=======
      <div class='card-produto'>
>>>>>>> abb42fb04635ace6127fc1f9b4bb129ebcf0196c
        <img src='${produto.imagem}' />
        <section class="info-produto">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
        </section>
      </div>
    `);
  }, "json");
}

function carregarInteressados() {
  $.get("api/interessados_por_produto.php", { id_produto: idProduto }, function (dados) {
    const select = $("#interessado");
    select.empty();
    select.append("<option value=''>-- selecione --</option>");

    dados.forEach(i => {
      select.append(`<option value='${i.id_usuario}'>${i.nome}</option>`);
    });
  }, "json");
}

function carregarProdutosInteressado(idUsuario) {
<<<<<<< HEAD
  $.get("api/produtos_do_usuario.php", { id_usuario: idUsuario }, function (produtos) {
    const container = $("#produtos-interessado");
    container.empty();

    produtos.forEach(p => {
      const card = $(`
        <div class='produto-oferta' data-id='${p.id_produto}'>
          <div>
            <strong>${p.nome}</strong>
            <img src='${p.imagem}' />
            <p>${p.descricao}</p>
          </div>
          <button class='propor-btn'>Propor</button>
        </div>
      `);
      container.append(card);
    });
  }, "json");
=======
 $.get("api/produtos_do_usuario.php", { id_usuario: idUsuario }, function (produtos) {
   const container = $("#produtos-interessado");
   container.empty();
   produtos.forEach(p => {
     container.append(`
       <div class='card-produto'>
         <img src='${p.imagem}' />
         <section class="info-produto">
           <h3>${p.nome}</h3>
           <p>${p.descricao}</p>
           <button class='propor-btn'>Propor</button>
         </section>
       </div>
     `);
   });
 }, "json");
>>>>>>> abb42fb04635ace6127fc1f9b4bb129ebcf0196c
}