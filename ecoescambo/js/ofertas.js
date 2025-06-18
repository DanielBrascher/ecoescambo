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
  });
});

function carregarProduto() {
  $.get("api/produto.php", { id: idProduto }, function (produto) {
    $("#produto-selecionado").html(`
      <div class='card-produto'>
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
}