let ID_USUARIO_LOGADO = null;

$(document).ready(function () {
  // Verifica sessão
  $.ajax({
    url: "api/verifica_sessao.php",
    method: "GET",
    dataType: "json",
    success: function (resposta) {
      if (resposta.logado) {
        ID_USUARIO_LOGADO = resposta.id_usuario;
        carregarMeusProdutos(ID_USUARIO_LOGADO);
      } else {
        alert("Você precisa estar logado.");
        window.location.href = "index.html";
      }
    },
    error: function () {
      alert("Erro ao verificar sessão.");
      window.location.href = "index.html";
    }
  });

  // Adicionar novo produto
  $("#formAdicionarProduto").on("submit", function (e) {
    e.preventDefault();

    const novoProduto = {
      nome: $("#nome").val(),
      imagem: $("#imagem").val(),
      descricao: $("#descricao").val(),
      id_usuario: ID_USUARIO_LOGADO
    };

    $.ajax({
      url: "api/adicionar.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(novoProduto),
      success: function (resposta) {
        $("#resposta").css("color", "green").text(resposta.mensagem);
        $("#formAdicionarProduto")[0].reset();
        carregarMeusProdutos(ID_USUARIO_LOGADO);
      },
      error: function (xhr) {
        const erro = xhr.responseJSON?.mensagem || "Erro ao adicionar produto.";
        $("#resposta").css("color", "red").text(erro);
      }
    });
  });
});

function carregarMeusProdutos(idUsuario) {
  $.ajax({
    url: "api/buscarTodos.php",
    method: "GET",
    dataType: "json",
    success: function (dados) {
      $("#produtos").empty();

      dados.forEach(function (produto) {
        if (produto.id_usuario != idUsuario) return;

        const qtd = parseInt(produto.qtd_interessados);
        const temInteresse = !isNaN(qtd) && qtd > 0;

        const card = $(`
          <div class="produto">
            <h4>${produto.nome}</h4>
            <img src="${produto.imagem}" alt="Imagem">
            <p>${produto.descricao}</p>
            <p><strong>Interessados:</strong> ${qtd}</p>

            ${temInteresse 
              ? `<button class="ver-interesses" data-id="${produto.id_produto}">Ver interesses</button>` 
              : `
                <button class="btn btn-editar">Editar</button>
                <button class="btn btn-excluir">Excluir</button>
                <div class="form-editar" style="display: none;">
                  <input type="text" class="edit-nome" value="${produto.nome}">
                  <input type="text" class="edit-imagem" value="${produto.imagem}">
                  <textarea class="edit-descricao">${produto.descricao}</textarea>
                  <button class="btn btn-salvar">Salvar</button>
                  <button class="btn btn-cancelar">Cancelar</button>
                </div>
              `}
          </div>
        `);

        // Editar produto
        card.find(".btn-editar").click(() => {
          card.find(".form-editar").slideDown();
        });

        // Cancelar edição
        card.find(".btn-cancelar").click(() => {
          card.find(".form-editar").slideUp();
        });

        // Salvar edição
        card.find(".btn-salvar").click(() => {
          const dadosAtualizados = {
            id_produto: produto.id_produto,
            nome: card.find(".edit-nome").val(),
            imagem: card.find(".edit-imagem").val(),
            descricao: card.find(".edit-descricao").val()
          };

          $.ajax({
            url: "api/alterar.php",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(dadosAtualizados),
            success: function (res) {
              $("#resposta").css("color", "green").text(res.mensagem);
              carregarMeusProdutos(idUsuario);
            },
            error: function (xhr) {
              const erro = xhr.responseJSON?.mensagem || "Erro ao atualizar produto.";
              $("#resposta").css("color", "red").text(erro);
            }
          });
        });

        // Excluir produto
        card.find(".btn-excluir").click(() => {
          if (confirm("Tem certeza que deseja excluir este produto?")) {
            $.ajax({
              url: "api/excluir.php",
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({ id_produto: produto.id_produto }),
              success: function (res) {
                $("#resposta").css("color", "green").text(res.mensagem);
                carregarMeusProdutos(idUsuario);
              },
              error: function () {
                $("#resposta").css("color", "red").text("Erro ao excluir produto.");
              }
            });
          }
        });

        // Redirecionar para interesses
        card.find(".ver-interesses").click(function () {
          const id = $(this).data("id");
          window.location.href = `ofertas.html?id_produto=${id}`;
        });

        $("#produtos").append(card);
      });
    },
    error: function () {
      $("#produtos").html("<p>Erro ao carregar seus produtos.</p>");
    }
  });
}
