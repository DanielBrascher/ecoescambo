$(document).ready(function () {
  $("#formCadastro").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      nome: $("#nome").val(),
      email: $("#email").val(),
      senha: $("#senha").val()
    };

    $.ajax({
      url: "../api/registrar_usuario.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
        $("#resposta").text(resposta.mensagem || "Usuário cadastrado com sucesso!");
        $("#formCadastro")[0].reset();
      },
      error: function (xhr) {
        let resposta = {};
        try {
          resposta = JSON.parse(xhr.responseText);
        } catch {
          resposta.erro = "Erro desconhecido.";
        }
        $("#resposta").text(resposta.erro || "Erro ao cadastrar.");
      }
    });
  });
});