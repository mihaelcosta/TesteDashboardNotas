// Ao iniciar a tela, ativa a tela de Inicio
$(document).ready(() => {
  trocaTela({ attributes: { "data-menu": { value: "Inicio" } } });
});

var lista;

//Função para adcionar a partial a tela principal
function loadPartialView(partial) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.getElementById("content").innerHTML = xhr.responseText;
    }
  };
  xhr.open("GET", partial, true);
  xhr.send();
  if (partial == "Dashboard/Index.html") {
    setTimeout(function () {
        //Caso a tela seja Dashboard, inicia a montagem dos itens
        montaTela();
    }, 100);
  }
}

//Função para alterar a partial chamada
function trocaTela(div) {
  const view = div.attributes["data-menu"].value;
  loadPartialView(view + "/Index.html");
}

//Cria a variável para o popup
var myModal;

//Monta a tela de Dashboard
function montaTela() {
  lista = dados;
  geraGrafico1();
  geraGrafico2();
  atribuiIndicadores();
  preencheGrid();

  //Inicia o popup
  myModal = new bootstrap.Modal(document.getElementById("formFiltro"), {});
}

//Exibe o Popup
function exibeFiltro() {
  myModal.show();
}

//Esconde o Popup
function escondeFiltro() {
  myModal.hide();
}

//Gera o Gráfico de Inadimplentes
function geraGrafico1() {
  const ctx = document.getElementById("graficoI");

  const labels = meses.map((mes) => mes.mes);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Por Mês",
        data: inadimplenciaMes,
        //fill: fals,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Acumulado",
        data: inadimplenciaSoma,
        fill: false,
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
  };

  new Chart(ctx, config);
}

// Gera o Gráfico de Recebimento
function geraGrafico2() {
  const ctx = document.getElementById("graficoR");

  const labels = meses.map((mes) => mes.mes);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Por Mês",
        data: pagamentoMes,
        //fill: fals,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Acumulado",
        data: pagamentoSoma,
        fill: false,
        borderColor: "green",
        backgroundColor: "green",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
  };

  new Chart(ctx, config);
}

// Atribui os valores aos índices na tela
function atribuiIndicadores() {
  $("#somaTotal")[0].innerHTML = somaTotal.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  $("#somaSemCobranca")[0].innerHTML = semCobranca.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  $("#somaVencidas")[0].innerHTML = inadimplencia.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  $("#somaAVencer")[0].innerHTML = avencer.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  $("#somaPagas")[0].innerHTML = pagas.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}

// Expande/Encurta o menu lateral
function alternaMenu() {
  $("#sidebar").toggleClass("expande");
  $(".seta").toggleClass("expande");
}

// Preenche a lista de notas
function preencheGrid() {
  $("#gridNotas")[0].innerHTML = "";
  lista.forEach((dado) => {
    $("#gridNotas")[0].innerHTML =
      $("#gridNotas")[0].innerHTML +
      `<ul class="list-group list-group-horizontal">` +
      `<li class="list-group-item">${dado.nomePagador}</li>` +
      `<li class="list-group-item">${dado.numeroNota}</li>` +
      `<li class="list-group-item">${dado.dataEmissao}</li>` +
      `<li class="list-group-item">${dado.dataCobranca ?? ""}</li>` +
      `<li class="list-group-item">${dado.dataPagamento ?? ""}</li>` +
      `<li class="list-group-item">${parseFloat(dado.valorNota).toLocaleString(
        "pt-br",
        {
          style: "currency",
          currency: "BRL",
        }
      )}</li>` +
      `<li class="list-group-item">${dado.documentoNotaFiscal}</li>` +
      `<li class="list-group-item">${dado.documentoBoleto}</li>` +
      `<li class="list-group-item">${dado.statusNota}</li>` +
      `</ul>`;
  });
}

// Filtra a lista
function filtraLista() {
  lista = dados;
  var mesEmitida = $("#slbEmissao")[0].value;
  var mesCobranca = $("#slbCobranca")[0].value;
  var mesPagamento = $("#slbPagamento")[0].value;
  var status = $("#slbStatus")[0].value;

  if (mesEmitida)
    lista = lista.filter(
      (a) => parseInt(a.dataEmissao?.split("/")[1]) == parseInt(mesEmitida)
    );

  if (mesCobranca)
    lista = lista.filter(
      (a) => parseInt(a.dataCobranca?.split("/")[1]) == parseInt(mesCobranca)
    );

  if (mesPagamento)
    lista = lista.filter(
      (a) => parseInt(a.dataPagamento?.split("/")[1]) == parseInt(mesPagamento)
    );

  if (status) lista = lista.filter((a) => a.statusNota == status);

  preencheGrid();
  escondeFiltro();
}

// Limpa os filtros
function limpaFiltros() {
  $("#slbEmissao")[0].value = "";
  $("#slbCobranca")[0].value = "";
  $("#slbPagamento")[0].value = "";
  $("#slbStatus")[0].value = "";
}
