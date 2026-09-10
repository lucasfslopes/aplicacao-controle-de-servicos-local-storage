const form = document.getElementById("formServico");
const listaServicos = document.getElementById("listaServicos");

const valorServico = document.getElementById("valorServico");
const comissaoServico = document.getElementById("comissaoServico");

const totalFaturado = document.getElementById("totalFaturado");
const totalComissao = document.getElementById("totalComissao");

let servicos = JSON.parse(localStorage.getItem("controle-comissao")) || [];

valorServico.addEventListener("input", () => {

    const valor = parseFloat(valorServico.value);

    if (!isNaN(valor)) {
        comissaoServico.value = (valor * 0.10).toFixed(2);
    }

});

function salvarDados() {
    localStorage.setItem(
        "controle-comissao",
        JSON.stringify(servicos)
    );
}

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarTabela() {

    listaServicos.innerHTML = "";

    let somaFaturamento = 0;
    let somaComissao = 0;

    servicos.forEach((servico, index) => {

        somaFaturamento += Number(servico.valor);
        somaComissao += Number(servico.comissao);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${servico.nome}</td>

            <td class="textValores">R$ ${servico.valor}</td>

            <td class="textValores">R$ ${servico.comissao}</td>

            <td><textarea>${servico.obs}</textarea></td>

            <td>${servico.dataHora}</td>

            <td>
                <button
                    class="btn-excluir"
                    onclick="excluirServico(${index})"
                >
                    Excluir
                </button>
            </td>
        `;

        listaServicos.appendChild(tr);

    });

    totalFaturado.textContent = moeda(somaFaturamento);
    totalComissao.textContent = moeda(somaComissao);

    salvarDados();
}

function editarValor(index, novoValor) {

    servicos[index].valor = parseFloat(novoValor) || 0;

    atualizarTabela();
}

function editarComissao(index, novaComissao) {

    servicos[index].comissao = parseFloat(novaComissao) || 0;

    atualizarTabela();
}

function excluirServico(index) {

    if (!confirm("Deseja excluir este registro?")) {
        return;
    }

    servicos.splice(index, 1);

    atualizarTabela();
}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const nome = document.getElementById("nomeServico").value.trim();

    const valor = parseFloat(valorServico.value);

    const comissao = parseFloat(comissaoServico.value);

    const obs = document.getElementById("obsServico").value.trim();

    const agora = new Date();

    servicos.unshift({
        nome,
        valor,
        comissao,
        obs,
        dataHora: agora.toLocaleString("pt-BR")
    });

    atualizarTabela();

    form.reset();

    comissaoServico.value = "";
});

function limparLista(){

    if (!confirm("Deseja limpar todos os registros?")) {
        return;
    }

    servicos.length = 0;

    localStorage.removeItem("controle-comissao");
    
    atualizarTabela();
}

atualizarTabela();