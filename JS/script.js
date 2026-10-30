/* ANO ATUAL NO RODAPÉ */
document.getElementById("ano").textContent = new Date().getFullYear();

/* FORMULÁRIO DE CONTATO (validação do Bootstrap) */
const form = document.getElementById("form-contato");
const areaAlerta = document.getElementById("alerta");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    /* se algum campo estiver inválido, mostra as mensagens em vermelho */
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const nome = document.getElementById("nome").value.trim();

    /* monta o alerta verde do Bootstrap (textContent é seguro contra código malicioso) */
    const alerta = document.createElement("div");
    alerta.className = "alert alert-success alert-dismissible fade show mb-0";
    alerta.setAttribute("role", "alert");
    alerta.append("Obrigado, " + nome + "! Seus dados foram validados com sucesso.");

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "btn-close";
    fechar.setAttribute("data-bs-dismiss", "alert");
    fechar.setAttribute("aria-label", "Fechar");
    alerta.append(fechar);

    areaAlerta.replaceChildren(alerta);

    form.reset();
    form.classList.remove("was-validated");
});
