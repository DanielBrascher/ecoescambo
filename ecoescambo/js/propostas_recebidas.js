$(document).ready(function () {
  $.get("api/verifica_sessao.php", function (res) {
    if (res.logado) {
      carregarPropostas();
    } else {
      alert("Você precisa estar logado.");
      window.location.href = "index.html";
    }
  }, "json");
});

function carregarPropostas() {
  $.get("api/propostas_recebidas.php", function (propostas) {
    const container = $("#lista-propostas");
    container.empty();

    if (!propostas || propostas.length === 0) {
      container.html("<p>Você ainda não recebeu nenhuma proposta.</p>");
      return;
    }

    propostas.forEach(p => {
      const imagemDesejado = p.imagem_desejado || "https://via.placeholder.com/80?text=Sem+Imagem";
      const imagemOfertado = p.imagem_ofertado || "https://via.placeholder.com/80?text=Sem+Imagem";

      const card = $(`
        <div class="proposta">
          <div class="linha">
            <div>
              <strong>Produto desejado:</strong> ${p.nome_desejado}<br>
              <img src="${imagemDesejado}" alt="Produto desejado">
            </div>
            <div style="margin-left: 20px;">
              <strong>Produto ofertado:</strong> ${p.nome_ofertado}<br>
              <img src="${imagemOfertado}" alt="Produto ofertado">
            </div>
          </div>
          <p><strong>Interessado:</strong> ${p.nome_interessado}</p>
          <p><strong>Data:</strong> ${p.data_proposta}</p>
          <p><strong>Status:</strong> ${p.status}</p>
          ${p.status === "pendente" ? `
          <div class="botoes">
            <button onclick="responderProposta(${p.id_proposta}, 'aceita')">Aceitar</button>
            <button onclick="responderProposta(${p.id_proposta}, 'recusada')">Recusar</button>
          </div>
          ` : ""}
        </div>
      `);

      container.append(card);
    });
  }, "json");
}

function responderProposta(id, status) {
  $.ajax({
    url: "api/responder_proposta.php",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id_proposta: id, status }),
    success: function (res) {
      alert(res.mensagem);
      carregarPropostas();
    },
    error: function () {
      alert("Erro ao responder proposta.");
    }
  });
}