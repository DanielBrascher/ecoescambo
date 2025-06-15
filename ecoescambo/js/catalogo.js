let paginaAtual = 1;
const limitePorPagina = 6;
let idLogado = null;

$(document).ready(function () {
  verificarSessao().then(() => {
    carregarProdutos();
  });

  $("#anterior").click(function () {
    if (paginaAtual > 1) {
      paginaAtual--;
      carregarProdutos();
    }
  });

  $("#proxima").click(function () {
    paginaAtual++;
    carregarProdutos();
  });
});

// Verifica se o usuário está logado via sessão PHP
function verificarSessao() {
  return $.ajax({
    url: "api/verifica_sessao.php",
    method: "GET",
    dataType: "json",
    success: function (res) {
      if (res.logado) {
        idLogado = res.id_usuario;
      }
    },
    error: function () {
      // Se não estiver logado, idLogado continua null
    }
  });
}

// Carrega produtos da API com paginação
function carregarProdutos() {
  $("#paginaAtual").text(paginaAtual);
  $.ajax({
    url: `api/buscarTodos.php?pagina=${paginaAtual}&limite=${limitePorPagina}`,
    method: "GET",
    dataType: "json",
    success: function (dados) {
      $("#produtos").empty();

      dados.forEach(produto => {
        // Oculta os produtos do próprio usuário se estiver logado
        if (idLogado && produto.id_usuario == idLogado) return;

        const card = $(`
          <div class="produto">
            <h4>${produto.nome}</h4>
            <img src="${produto.imagem}" alt="Imagem">
            <div class="detalhes" style="display: none;">
              <p>${produto.descricao}</p>
            </div>
            ${idLogado ? `<button class="interesse-btn" data-id_produto="${produto.id_produto}" data-id_dono="${produto.id_usuario}">Tenho interesse</button>` : ''}
            <button class="toggle-detalhes">Ver detalhes</button>
          </div>
        `);

        // Alternar exibição da descrição
        card.find(".toggle-detalhes").on("click", function () {
          const detalhes = $(this).siblings(".detalhes");
          const visivel = detalhes.is(":visible");
          detalhes.slideToggle(200);
          $(this).text(visivel ? "Ver detalhes" : "Ocultar detalhes");
        });

        // Manifestar interesse
        card.find(".interesse-btn").on("click", function (e) {
          e.stopPropagation(); // Evita o clique no botão abrir o detalhe

          const dadosInteresse = {
            id_usuario: $(this).data("id_dono"),
            id_produto: $(this).data("id_produto"),
            id_interessado: idLogado
          };

          $.ajax({
            url: "api/manifestar_interesse.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(dadosInteresse),
            success: function (resposta) {
              $("#resposta").css("color", "green").text(resposta.mensagem);
            },
            error: function (xhr) {
              const erro = xhr.responseJSON?.mensagem || "Erro ao manifestar interesse.";
              $("#resposta").css("color", "red").text(erro);
            }
          });
        });

        $("#produtos").append(card);
      });
    },
    error: function () {
      $("#produtos").html("<p>Erro ao carregar produtos.</p>");
    }
  });
}