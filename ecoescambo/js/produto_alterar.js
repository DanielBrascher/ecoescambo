$(document).ready(function () {
  $("#formAlterarProduto").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      id_produto: $("#id_produto").val(),
      nome: $("#nome").val(),
      imagem: $("#imagem").val(),
      descricao: $("#descricao").val()
    };

    $.ajax({
      url: "../api/alterar.php",
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
        $("#resposta").text(resposta.mensagem || "Produto alterado com sucesso!");
      },
      error: function (xhr) {
        let erro = xhr.responseJSON?.erro || "Erro ao alterar.";
        $("#resposta").text(erro);
      }
    });
  });
});
