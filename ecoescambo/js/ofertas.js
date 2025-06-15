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
});

function carregarProduto() {
  $.get("api/produto.php", { id: idProduto }, function (produto) {
    $("#produto-selecionado").html(`
      <div class='produto-info'>
        <h3>${produto.nome}</h3>
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
      container.append(`
        <div class='produto-oferta'>
          <div>
            <strong>${p.nome}</strong>
            <img src='${p.imagem}' />
            <p>${p.descricao}</p>
          </div>
          <button class='propor-btn'>Propor</button>
        </div>
      `);
    });
  }, "json");
}
