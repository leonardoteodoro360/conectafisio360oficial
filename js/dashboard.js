document.addEventListener("DOMContentLoaded", function () {
  const cursos = document.querySelectorAll(".course-card");

  cursos.forEach(curso => {
    const progresso = curso.getAttribute("data-progress");
    const barra = curso.querySelector(".progress-fill");
    const texto = curso.querySelector(".progress-text");

    barra.style.width = progresso + "%";
    texto.innerText = progresso + "% concluído";
  });
});
