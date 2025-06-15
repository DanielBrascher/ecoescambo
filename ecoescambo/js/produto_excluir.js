$(document).ready(function () {
  $("#formExcluirProduto").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      id_produto: $("#id_produto").val()
    };

    $.ajax({
      url: "../api/excluir.php",
      method: "DELETE",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
        $("#resposta").text(resposta.mensagem || "Produto excluído com sucesso!");
        $("#formExcluirProduto")[0].reset();
      },
      error: function (xhr) {
        let erro = xhr.responseJSON?.erro || "Erro ao excluir.";
        $("#resposta").text(erro);
      }
    });
  });
});