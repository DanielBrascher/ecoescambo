$(document).ready(function () {
  $("#formLogin").on("submit", function (e) {
    e.preventDefault();

    const dados = {
      email: $("#email").val(),
      senha: $("#senhaLogin").val()
    };

    $.ajax({
      url: "api/login.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(dados),
      success: function (resposta) {
      if (resposta.id_usuario && resposta.nome) {
        sessionStorage.setItem("id_usuario", resposta.id_usuario);
        sessionStorage.setItem("nome_usuario", resposta.nome);

        $("#resposta").css("color", "green").text(resposta.mensagem);
        setTimeout(() => {
          window.location.href = "catalogo.html";
        }, 1000);
      } else {
        $("#resposta").css("color", "red").text("Erro inesperado.");
      }
    },
      error: function (xhr) {
  console.error("ERRO:", xhr);
  let erro = "Erro ao fazer login.";
  if (xhr.responseJSON && xhr.responseJSON.erro) {
    erro = xhr.responseJSON.erro;
  }
  $("#resposta").css("color", "red").text(erro);
}
    });
  });
});