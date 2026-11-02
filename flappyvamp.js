const sprites = [
    "vampiro1.png",
    "vampiro2.png",
    "vampiro3.png"
];

let frame = 0;

setInterval(() => {
    if (morreu) return;   // depois da colisão, não troca mais o sprite
    frame = (frame + 1) % sprites.length;

    document.getElementById("vampiro").src =
        sprites[frame];

}, 150);

// ---------- movimento do vampiro ----------

const tela = document.getElementById("tela");
const vampiro = document.getElementById("vampiro");
const gameover = document.getElementById("gameover");
const obstaculos = document.querySelectorAll(".estaca");   // pega estaca1, 2, 3... sozinho
const pontos = document.getElementById("pontos");
let contador = 0;
let botaoReiniciar = document.getElementById("botaoReiniciar");
const menu = document.getElementById("menu");

let y = 0;
let velocidade = 0;
let comecou = false;   // só começa a cair depois do primeiro espaço
let morreu = false;
let jogando = false;

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
    if (!jogando) return;  
    if (morreu) return;   // depois que caiu, o espaço não faz nada
    comecou = true;
    velocidade = pulo;
  }
});

// "folga" os PNGs têm bordas transparentes.
function colidiu(a, b, folga = 8) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return (
    r1.left   + folga < r2.right  - folga &&
    r1.right  - folga > r2.left   + folga &&
    r1.top    + folga < r2.bottom - folga &&
    r1.bottom - folga > r2.top    + folga
  );
}

function fimDeJogo() {
  morreu = true;
  gameover.style.visibility = "visible";
  tela.classList.add("parado");      // congela cenário, nuvens e estacas (ver CSS)
  // vampiro.src = "perdeu.png";
}

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
    fimDeJogo();
    return;   // para o loop
  }

  // bateu em alguma estaca?
  for (const o of obstaculos) {
    if (colidiu(vampiro, o)) {
      fimDeJogo();
      return;
    }
  }

  requestAnimationFrame(loop);

  somadorPontos();
}

loop();

function somadorPontos () {
  contador++;
  pontos.textContent = `Pontos: ${contador}`;
}

function recarregar () {
  location.reload();
}

function iniciarJogo() {
  menu.style.display = "none";
  jogando = true;
  document.body.classList.add("jogando");
}

