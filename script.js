const monito = document.getElementById('monito');
const dialogo = document.getElementById('dialogo');
const texto = document.getElementById('texto');
const aviso = document.getElementById('aviso-clic');
const finalScreen = document.getElementById('ramo');

let corriendo = true;
let posicion = 0;
let direccion = 1;

const fps = 8;
const sheetCols = 10;
const sheetRows = 3;
const frameWidth = 203;
const frameHeight = 289;

const runFrames = [
  {col: 0, row: 2},
  {col: 1, row: 2},
  {col: 2, row: 2}
];

const jumpFrames = [
  { col: 5, row: 0 },
  { col: 6, row: 0 }
];

let frameActual = 0;
let limiteDerecho = window.innerWidth - frameWidth;
let saltando = false;

let intervaloEscritura = null; 
let fraseCompletaMostrada = false;

mostrarAviso();

function mostrarAviso() {
  aviso.style.opacity = 1;
}

function ocultarAviso() {
  aviso.style.opacity = 0;
}

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

// -------------------------------------------
//  DIÁLOGO (SE PUEDE ACELERAR CON CLICS)
// -------------------------------------------

const frases = [
  "¡Hola de nuevo, feo!",
  "¿Cómo estás?",
  "Me contaron que terminaste unos proyectos...",
  "o no sé qué cosa.",
  "¿Fue duro?",
  "...",
  "Bueno, como ves por aquí todo sigue más o menos igual...",
  "aún me siguen haciendo corretear de lado a lado sin parar...",
  "Es un desvivir >:(",
  "Dile algo a la jefa, ¿quieres?",
  "...",
  "Hablando del rey de Roma, me volvió a dejar un mensaje para ti...",
  "''Eu, ¿qué tal?...",
  "...qué manera más tonta de preguntarte, ¿no? Si puedo mandarte un mensaje...",
  "...pero pensé que esto seria más divertido...",
  "...Verás, mi idea inicial era darte un pequeño detalle tras terminar el curso...",
  "...Pensé en esto ya que estamos un poquito lejitos...",
  "...no es la gran cosa, y podria estar más pulido...",
  "...hasta me da un poco de vergüenza sabiendo que en parte este es tu campo jsjj...",
  "...Pero sé que han sido unos días complicados y pesados...",
  "...y pensé: ¿Por qué no? Quería hacer algo...",
  "...Aunque no pude resistirme a enseñarte un adelanto hace unos días...",
  "...No he hecho mucho más y, en realidad, el 'plato principal' lleva un tiempo hecho...",
  "...creo que no se me dan bien estas cosas, lol...",
  "...Al menos espero haber recordado bien cuales eran tus favoritas...",
  "...A falta de unos reales, ahí te van...",
  "...Espero que te guste...",
  "...Lo has hecho muy bien, enhorabuena''",
  "¡Qué pesada!",
  "No sabes cuánto me ha costado memorizar todo eso, ¡pf!...",
  "Hala, venga. Ha dejado esto para ti."
];

let i = 0;

function escribirFrase() {
  if (i >= frases.length) {
    dialogo.style.opacity = 0;
    activarFinal();    
    return;
  }

  fraseCompletaMostrada = false;
  texto.textContent = "";
  let j = 0;

  if (intervaloEscritura) clearInterval(intervaloEscritura);

  intervaloEscritura = setInterval(() => {
    texto.textContent += frases[i][j];
    j++;

    if (j >= frases[i].length) {
      clearInterval(intervaloEscritura);
      fraseCompletaMostrada = true;

      setTimeout(() => {
        if (fraseCompletaMostrada) {
          i++;
          escribirFrase();
        }
      }, 1200);
    }
  }, 50);
}

// Adelantar texto con clics
dialogo.addEventListener("click", () => {
  if (!saltando) return;

  // Si está escribiendo → completar inmediatamente
  if (!fraseCompletaMostrada) {
    clearInterval(intervaloEscritura);
    texto.textContent = frases[i];
    fraseCompletaMostrada = true;
    return;
  }

  // Si ya estaba completa → avanzar
  i++;
  escribirFrase();
});


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
  escribirFrase();
});

monito.style.transform = 'scaleX(-1)';
moverMonito();
animarMonito();
