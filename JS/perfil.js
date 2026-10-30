/* ==========================================================
   CURRÍCULO WEB INTELIGENTE
   1. Elementos  2. Armazenamento  3. Perfil  4. Tema  5. Visita
   ========================================================== */

/* 1. ELEMENTOS DA PÁGINA */
const form = document.getElementById("form-perfil");
const inputNome = document.getElementById("nome");
const inputProfissao = document.getElementById("profissao");
const inputSobre = document.getElementById("sobre");
const btnLimpar = document.getElementById("btn-limpar");
const btnTema = document.getElementById("btn-tema");
const iconeTema = document.getElementById("icone-tema");
const mensagem = document.getElementById("mensagem");

const secaoVisualizacao = document.getElementById("visualizacao");
const avatar = document.getElementById("avatar");
const prevNome = document.getElementById("prev-nome");
const prevProfissao = document.getElementById("prev-profissao");
const prevSobre = document.getElementById("prev-sobre");
const textoVisita = document.getElementById("ultima-visita");

const CHAVE_PERFIL = "perfil";
const CHAVE_TEMA = "tema";
const CHAVE_VISITA = "ultimaVisita";

const PADRAO = {
    nome: "Seu Nome",
    profissao: "Sua Profissão",
    sobre: "Sua descrição aparecerá aqui."
};

/* 2. ARMAZENAMENTO (localStorage guarda os dados no navegador) */
function ler(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (erro) {
        return null;
    }
}

function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (erro) {
        /* se o navegador bloquear, o site continua funcionando sem salvar */
    }
}

function apagar(chave) {
    try {
        localStorage.removeItem(chave);
    } catch (erro) {}
}

/* 3. PERFIL */

/* pega a primeira letra do primeiro e do último nome: "Karine Souza" -> "KS" */
function iniciais(nome) {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return "?";

    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
}

/* mostra o valor, ou o texto de exemplo (em cinza) quando está vazio */
function definirTexto(elemento, valor, padrao) {
    /* textContent insere só texto (seguro contra código malicioso) */
    elemento.textContent = valor || padrao;
    elemento.classList.toggle("vazio", !valor);
}

function mostrarPerfil(perfil) {
    definirTexto(prevNome, perfil.nome, PADRAO.nome);
    definirTexto(prevProfissao, perfil.profissao, PADRAO.profissao);
    definirTexto(prevSobre, perfil.sobre, PADRAO.sobre);
    avatar.textContent = iniciais(perfil.nome || "");
}

/* tipo: "ok" (verde) ou "aviso" (vermelho) */
let temporizadorMensagem;

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;

    clearTimeout(temporizadorMensagem);
    temporizadorMensagem = setTimeout(function () {
        mensagem.textContent = "";
        mensagem.className = "";
    }, 3000);
}

/* faz a visualização piscar uma borda azul depois de salvar */
function destacarVisualizacao() {
    secaoVisualizacao.classList.remove("novo");
    void secaoVisualizacao.offsetWidth;   /* reinicia a animação */
    secaoVisualizacao.classList.add("novo");
}

function carregarPerfil() {
    const salvo = ler(CHAVE_PERFIL);
    if (!salvo) return;

    try {
        const perfil = JSON.parse(salvo);
        inputNome.value = perfil.nome || "";
        inputProfissao.value = perfil.profissao || "";
        inputSobre.value = perfil.sobre || "";
        mostrarPerfil(perfil);
    } catch (erro) {
        apagar(CHAVE_PERFIL);
    }
}

/* SALVAR: guarda, atualiza a visualização e desce até ela */
form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const perfil = {
        nome: inputNome.value.trim(),
        profissao: inputProfissao.value.trim(),
        sobre: inputSobre.value.trim()
    };

    gravar(CHAVE_PERFIL, JSON.stringify(perfil));
    mostrarPerfil(perfil);
    mostrarMensagem("✓ Perfil salvo com sucesso!", "ok");

    secaoVisualizacao.scrollIntoView({ behavior: "smooth", block: "start" });
    destacarVisualizacao();
});

/* EXCLUIR: apaga os campos, os dados salvos e volta ao texto padrão */
btnLimpar.addEventListener("click", function () {
    if (!confirm("Deseja excluir o perfil salvo?")) return;

    form.reset();
    apagar(CHAVE_PERFIL);
    mostrarPerfil({});
    mostrarMensagem("Perfil excluído.", "aviso");
    inputNome.focus();
});

/* 4. TEMA (claro / escuro) */
function aplicarTema(tema) {
    const escuro = tema === "escuro";
    document.body.classList.toggle("escuro", escuro);
    iconeTema.textContent = escuro ? "☀️" : "🌙";
}

btnTema.addEventListener("click", function () {
    const novoTema = document.body.classList.contains("escuro") ? "claro" : "escuro";
    aplicarTema(novoTema);
    gravar(CHAVE_TEMA, novoTema);
});

/* 5. ÚLTIMA VISITA */
function formatarData(data) {
    return data.toLocaleDateString("pt-BR") + " às " +
        data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function registrarVisita() {
    const agora = new Date();
    const anterior = ler(CHAVE_VISITA);

    /* mostra a visita anterior; na primeira vez, mostra a data de agora */
    const mostrar = anterior ? new Date(anterior) : agora;
    textoVisita.textContent = "Última visita registrada: " + formatarData(mostrar);

    gravar(CHAVE_VISITA, agora.toISOString());
}

/* INÍCIO: roda assim que a página abre */
aplicarTema(ler(CHAVE_TEMA));
carregarPerfil();
registrarVisita();
