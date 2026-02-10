console.log("🚀 ConectaFisio360 iniciado");

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.app !== "conectafisio") {
        console.warn("App não iniciado");
        return;
    }

    const loginModal = document.getElementById("login-modal");
    const cadastroModal = document.getElementById("cadastro-modal");

    document.getElementById("btn-login")?.addEventListener("click", () => {
        loginModal.classList.remove("hidden");
    });

    document.getElementById("btn-cadastro")?.addEventListener("click", () => {
        cadastroModal.classList.remove("hidden");
    });

    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            loginModal.classList.add("hidden");
            cadastroModal.classList.add("hidden");
        });
    });

    console.log("✅ Login e cadastro prontos");
});

