$(document).ready(function () {
  $("#formCadastro").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      nome: $("#nome").val(),
      email: $("#email").val(),
      senha: $("#senha").val()
    };

    $.ajax({
      url: "api/registrar_usuario.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
        $("#resposta").css("color", "green").text(resposta.mensagem || "Usuário cadastrado!");
        $("#formCadastro")[0].reset();
        setTimeout(() => window.location.href = "index.html", 1000);
      },
      error: function (xhr) {
        let erro = "Erro ao cadastrar.";
        if (xhr.responseJSON && xhr.responseJSON.erro) {
          erro = xhr.responseJSON.erro;
        }
        $("#resposta").css("color", "red").text(erro);
      }
    });
  });
});