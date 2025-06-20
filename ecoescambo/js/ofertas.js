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
  });
});

function carregarProduto() {
  $.get("api/produto.php", { id: idProduto }, function (produto) {
    $("#produto-selecionado").html(`
      <div class='produto-info'>
        <strong>produto do ${produto.nome_usuario}</strong>
        <img src='${produto.imagem}' />
        <p>${produto.descricao}</p>
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
}