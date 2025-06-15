$(document).ready(function () {
  $("#formAdicionarProduto").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      nome: $("#nome").val(),
      imagem: $("#imagem").val(),
      descricao: $("#descricao").val(),
      id_usuario: $("#id_usuario").val()
    };

    $.ajax({
      url: "../api/adicionar.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
        $("#resposta").text(resposta.mensagem || "Produto adicionado!");
        $("#formAdicionarProduto")[0].reset();
      },
      error: function (xhr) {
        let erro = xhr.responseJSON?.erro || "Erro ao adicionar.";
        $("#resposta").text(erro);
      }
    });
  });
});