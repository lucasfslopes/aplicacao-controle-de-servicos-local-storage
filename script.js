let temporizadorDebounce;

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

        if(!servico.checkboxPago){
            somaFaturamento += Number(servico.valor);
            somaComissao += Number(servico.comissao);
        }

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${servico.nome}</td>

            <td class="textValores">R$ ${servico.valor}</td>

            <td class="textValores">R$ ${servico.comissao}</td>

            <td><input class="inputbox" type="checkbox" id="checkbox" name="newsletter" ${servico.checkboxPago ? 'checked' : ''} onchange="editarCheckbox(${index}, this.checked)"></td>

            <td>
                <textarea
                    class="input-tabela"
                    oninput="editarObs(${index}, this.value)"
                >${servico.obs}</textarea>
            </td>

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

function editarCheckbox(index, novoCheckbox) {

    servicos[index].checkboxPago = novoCheckbox;

    atualizarTabela();
}

function editarObs(index, novaObs) {

    clearTimeout(temporizadorDebounce);

    temporizadorDebounce = setTimeout(() => {
        
        servicos[index].obs = novaObs || "";

        atualizarTabela();

    }, 1000); 

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

    const checkboxPago = true;

    const obs = document.getElementById("obsServico").value.trim();

    const agora = new Date();

    servicos.unshift({
        nome,
        valor,
        comissao,
        checkboxPago,
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