let btm = document.querySelector("#BTM") 
let itens =  document.querySelectorAll(".nav-menu");
let botao = document.getElementById("#BTM");
document.getElementById ("#BTM").addEventListener("click", () => {
    botao.innerText = "Oi, estou muito chateado";
    botao.style.color = "red";
    itens.forEach(item => {
        item.style.backgroundColor = "le293b";
        item.style.color = "red";
    });
});
