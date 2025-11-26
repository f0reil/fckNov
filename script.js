const monito = document.getElementById('monito');
const dialogo = document.getElementById('dialogo');
const texto = document.getElementById('texto');
const aviso = document.getElementById('aviso-clic');
const finalScreen = document.getElementById('ramo');

let corriendo = true;
let posicion = 0;
let direccion = 1;

// spritesheet
const sheetCols = 10;
const sheetRows = 3;
const frameWidth = 203;
const frameHeight = 289;

const runFrames = [
  { col: 0, row: 2 },
  { col: 1, row: 2 },
  { col: 2, row: 2 }
];

const jumpFrames = [
  { col: 5, row: 0 },
  { col: 6, row: 0 }
];

const idle = [{ col: 0, row: 0 }];
const melting = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 2, row: 0 }
];
const bothered_1 = [{ col: 3, row: 0 }];
const bothered_2 = [{ col: 4, row: 0 }];

const animacionesPorFrase = {};

for (let f = 0; f <= 4; f++) animacionesPorFrase[f] = { frames: jumpFrames, velocidad: 400 }; 
for (let f = 5; f <= 7; f++) animacionesPorFrase[f] = { frames: idle, velocidad: 300 };
animacionesPorFrase[8] = { frames: bothered_1, velocidad: 300 };
animacionesPorFrase[9] = { frames: bothered_2, velocidad: 300 };

// carajo
animacionesPorFrase[10] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[11] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[12] = { frames: idle, velocidad: 300 };          
animacionesPorFrase[13] = { frames: idle, velocidad: 300 };    
animacionesPorFrase[14] = { frames: jumpFrames, velocidad: 400 }; 
animacionesPorFrase[15] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[16] = { frames: melting, velocidad: 200, unaVez: true }; 
animacionesPorFrase[17] = { frames: idle, velocidad: 300 };          
animacionesPorFrase[18] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[19] = { frames: idle, velocidad: 300 };     
animacionesPorFrase[20] = { frames: jumpFrames, velocidad: 400 }; 
animacionesPorFrase[21] = { frames: melting, velocidad: 200, unaVez: true };           
animacionesPorFrase[22] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[23] = { frames: melting, velocidad: 200, unaVez: true };          
animacionesPorFrase[24] = { frames: idle, velocidad: 300 }; 
animacionesPorFrase[25] = { frames: idle, velocidad: 300 };           
animacionesPorFrase[26] = { frames: jumpFrames, velocidad: 400 };     
animacionesPorFrase[27] = { frames: jumpFrames, velocidad: 400 };           

animacionesPorFrase[28] = { frames: bothered_2, velocidad: 300 };
animacionesPorFrase[29] = { frames: bothered_2, velocidad: 300 };
animacionesPorFrase[30] = { frames: jumpFrames, velocidad: 400 };

let limiteDerecho = window.innerWidth - frameWidth;
let saltando = false;

let i = 0; 
let intervaloEscritura = null;
let fraseCompletaMostrada = false;

let animacionActual = idle;
let frameIndex = 0;
let animacionActiva = true;
let velocidadAnimacion = 120;
let unaVez = false; //para la anim

function mostrarAviso() { aviso.style.opacity = 1; }
function ocultarAviso() { aviso.style.opacity = 0; }

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

function loopAnimaciones() {
  if (animacionActiva && animacionActual) {
    const f = animacionActual[frameIndex];
    const offsetX = -f.col * frameWidth;
    const offsetY = -f.row * frameHeight;
    monito.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

    if (unaVez) {
      if (frameIndex < animacionActual.length - 1) frameIndex++;
    } else {
      frameIndex = (frameIndex + 1) % animacionActual.length;
    }
  }
  setTimeout(loopAnimaciones, velocidadAnimacion);
}
loopAnimaciones();

function setAnimacion(obj) {
  if (!obj) return;
  animacionActual = obj.frames;
  velocidadAnimacion = obj.velocidad || 120;
  frameIndex = 0;
  animacionActiva = true;
  unaVez = !!obj.unaVez;
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
  frameIndex = 0;

  monito.style.left = "0px";
  monito.style.transform = "scaleX(-1)";

  mostrarAviso();
  setAnimacion({ frames: runFrames, velocidad: 120 });
  moverMonito();
}

// me vuelvo loca
const frases = [
  "¡Hola de nuevo, feo!", 
  "¿Cómo estás?", 
  "Me contaron que terminaste unos proyectos...",
  "o no sé qué cosa.", 
  "¿Fue duro?", "...", 
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

function escribirFrase() {
  if (i >= frases.length) {
    dialogo.style.opacity = 0;
    activarFinal();
    return;
  }

  setAnimacion(animacionesPorFrase[i] || { frames: idle, velocidad: 300 });

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

// Click en diálogo 
dialogo.addEventListener("click", () => {
  if (!saltando) return;
  if (!fraseCompletaMostrada) {
    clearInterval(intervaloEscritura);
    texto.textContent = frases[i];
    fraseCompletaMostrada = true;
    return;
  }
  i++;
  escribirFrase();
});

// Click en monito 
monito.addEventListener('click', () => {
  if (!corriendo) return;
  corriendo = false;
  saltando = true;
  ocultarAviso();

  setAnimacion({ frames: jumpFrames, velocidad: 400 });
  dialogo.style.opacity = 1;
  escribirFrase();
});

monito.style.transform = 'scaleX(-1)';
moverMonito();
setAnimacion({ frames: runFrames, velocidad: 120 });
