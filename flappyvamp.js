const sprites = [
    "vampiro1.png",
    "vampiro2.png",
    "vampiro3.png"
];

let frame = 0;

setInterval(() => {
    frame = (frame + 1) % sprites.length;

    document.getElementById("vampiro").src =
        sprites[frame];

}, 150);

// ---------- movimento do vampiro ----------

const tela = document.getElementById("tela");
const vampiro = document.getElementById("vampiro");

let y = 0;
let velocidade = 0;
let comecou = false;   // só começa a cair depois do primeiro espaço
let morreu = false;

const gravidade = 0.25;
const pulo = -5;
const velocidadeMaxima = 6;

// meio da área visível, do lado esquerdo
function posicaoInicial() {
  const topo = tela.offsetHeight * 0.15;
  return (topo + tela.clientHeight) / 2 - vampiro.offsetHeight / 2;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !e.repeat) {
    e.preventDefault();
    if (morreu) return;   // depois que caiu, o espaço não faz nada
    comecou = true;
    velocidade = pulo;
  }
});

function loop() {
  if (!comecou) {
    y = posicaoInicial();
    vampiro.style.top = y + "px";
    requestAnimationFrame(loop);
    return;
  }

  velocidade += gravidade;
  if (velocidade > velocidadeMaxima) velocidade = velocidadeMaxima;
  y += velocidade;

  // o teto continua travando, pra ele não sair por cima
  const topo = tela.offsetHeight * 0.15;
  if (y < topo) { y = topo; velocidade = 0; }

  vampiro.style.top = y + "px";

  // saiu pela parte de baixo: acabou
  if (y > tela.clientHeight) {
    morreu = true;
    return;   // para o loop
  }

  requestAnimationFrame(loop);
}

loop();