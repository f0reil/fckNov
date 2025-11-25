const monito = document.getElementById('monito');
const dialogo = document.getElementById('dialogo');
const texto = document.getElementById('texto');
const aviso = document.getElementById('aviso-clic');
const finalScreen = document.getElementById('ramo');

let corriendo = true;
let posicion = 0;
let direccion = 1;

// spritesheet
const fps = 8;
const sheetCols = 10;
const sheetRows = 3;
const frameWidth = 203;
const frameHeight = 289;

// correr 
const runFrames = [
  {col: 0, row: 2},
  {col: 1, row: 2},
  {col: 2, row: 2}
];

// saltito (col 6–7)
const jumpFrames = [
  { col: 5, row: 0 },
  { col: 6, row: 0 }
];

let frameActual = 0;
let limiteDerecho = window.innerWidth - frameWidth;
let saltando = false;

function mostrarAviso() {
  aviso.style.opacity = 1;
}

function ocultarAviso() {
  aviso.style.opacity = 0;
}

mostrarAviso();

function moverMonito() {
  if (!corriendo) return;

  posicion += 8 * direccion;

  if (posicion > limiteDerecho || posicion < 0) {
    direccion *= -1;
    monito.style.transform = `scaleX(${-direccion})`;
  }

  monito.style.left = posicion + 'px';
  requestAnimationFrame(moverMonito);
}

function animarMonito() {
  if (!corriendo) return;

  const frame = runFrames[frameActual];
  const offsetX = -frame.col * frameWidth;
  const offsetY = -frame.row * frameHeight;

  monito.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

  frameActual = (frameActual + 1) % runFrames.length;
  setTimeout(animarMonito, 1000 / fps);
}

function activarFinal() {
  saltando = false;

  monito.style.opacity = 0;

  document.body.classList.add("fondo-final");

  setTimeout(() => {
    finalScreen.style.opacity = 1;
    finalScreen.style.transform = "translateY(0px)";
  }, 500);

  setTimeout(() => {
    document.addEventListener("click", reiniciarTodo);
  }, 1000);
}

function reiniciarTodo() {
  document.removeEventListener("click", reiniciarTodo);

  finalScreen.style.opacity = 0;
  finalScreen.style.transform = "translateY(20px)";

  document.body.classList.remove("fondo-final");

  monito.style.opacity = 1;

  corriendo = true;
  saltando = false;
  posicion = 0;
  direccion = 1;
  frameActual = 0;

  monito.style.left = "0px";
  monito.style.transform = "scaleX(-1)";

  mostrarAviso();

  animarMonito();
  moverMonito();
}

monito.addEventListener('click', () => {
  if (!corriendo) return; 

  corriendo = false;
  saltando = true;

  ocultarAviso();

  let saltoFrame = 0;

  function animarSalto() {
    if (!saltando) return;

    const f = jumpFrames[saltoFrame];
    const offsetX = -f.col * frameWidth;
    const offsetY = -f.row * frameHeight;

    monito.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    saltoFrame = (saltoFrame + 1) % jumpFrames.length;

    setTimeout(animarSalto, 300);
  }
  animarSalto();

  dialogo.style.opacity = 1;

  const frases = [
    "¡AH, un feo!",
    "¡Qué susto!"
  ];

  let i = 0;

  function escribirFrase() {
    if (i >= frases.length) {
      dialogo.style.opacity = 0;

      activarFinal();
      return;
    }

    texto.textContent = "";
    let j = 0;
    const intervalo = setInterval(() => {
      texto.textContent += frases[i][j];
      j++;
      if (j >= frases[i].length) {
        clearInterval(intervalo);
        i++;
        setTimeout(escribirFrase, 1200); 
      }
    }, 50);
  }

  escribirFrase();
});

monito.style.transform = 'scaleX(-1)';
moverMonito();
animarMonito();
