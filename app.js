/* =========================================================================
   Otro Tiempo — Árbol genealógico
   App de un solo archivo. Todo el estado vive en memoria + localStorage.
   ========================================================================= */
(function(){
"use strict";

/* ---------------------------------------------------------------------
   -1. DATOS GEOGRÁFICOS (país → provincia/estado)
   --------------------------------------------------------------------- */
const PROVINCIAS_POR_PAIS = {
  "Argentina": ["Buenos Aires","Ciudad Autónoma de Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa","Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan","San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"],
  "España": ["Andalucía","Aragón","Asturias","Islas Baleares","Canarias","Cantabria","Castilla-La Mancha","Castilla y León","Cataluña","Extremadura","Galicia","La Rioja","Madrid","Murcia","Navarra","País Vasco","Comunidad Valenciana","Ceuta","Melilla"],
  "México": ["Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","Estado de México","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"],
  "Chile": ["Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo","Valparaíso","Metropolitana de Santiago","O'Higgins","Maule","Ñuble","Biobío","La Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"],
  "Uruguay": ["Artigas","Canelones","Cerro Largo","Colonia","Durazno","Flores","Florida","Lavalleja","Maldonado","Montevideo","Paysandú","Río Negro","Rivera","Rocha","Salto","San José","Soriano","Tacuarembó","Treinta y Tres"],
  "Brasil": ["Acre","Alagoas","Amapá","Amazonas","Bahía","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Río de Janeiro","Río Grande do Norte","Río Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"],
  "Colombia": ["Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá","Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare","Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo","Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima","Valle del Cauca","Vaupés","Vichada"],
  "Perú": ["Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca","Callao","Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad","Lambayeque","Lima","Loreto","Madre de Dios","Moquegua","Pasco","Piura","Puno","San Martín","Tacna","Tumbes","Ucayali"],
  "Bolivia": ["Beni","Chuquisaca","Cochabamba","La Paz","Oruro","Pando","Potosí","Santa Cruz","Tarija"],
  "Paraguay": ["Asunción","Concepción","San Pedro","Cordillera","Guairá","Caaguazú","Caazapá","Itapúa","Misiones","Paraguarí","Alto Paraná","Central","Ñeembucú","Amambay","Canindeyú","Presidente Hayes","Boquerón","Alto Paraguay"],
  "Venezuela": ["Amazonas","Anzoátegui","Apure","Aragua","Barinas","Bolívar","Carabobo","Cojedes","Delta Amacuro","Distrito Capital","Falcón","Guárico","Lara","Mérida","Miranda","Monagas","Nueva Esparta","Portuguesa","Sucre","Táchira","Trujillo","Vargas","Yaracuy","Zulia"],
  "Estados Unidos": ["Alabama","Alaska","Arizona","Arkansas","California","Carolina del Norte","Carolina del Sur","Colorado","Connecticut","Dakota del Norte","Dakota del Sur","Delaware","Florida","Georgia","Hawái","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Luisiana","Maine","Maryland","Massachusetts","Míchigan","Minnesota","Misisipi","Misuri","Montana","Nebraska","Nevada","Nueva Jersey","Nueva York","Nuevo Hampshire","Nuevo México","Ohio","Oklahoma","Oregón","Pensilvania","Rhode Island","Tennessee","Texas","Utah","Vermont","Virginia","Virginia Occidental","Washington","Wisconsin","Wyoming"],
  "Italia": ["Abruzos","Basilicata","Calabria","Campania","Emilia-Romaña","Friul-Venecia Julia","Lacio","Liguria","Lombardía","Las Marcas","Molise","Piamonte","Apulia","Cerdeña","Sicilia","Toscana","Trentino-Alto Adigio","Umbría","Valle de Aosta","Véneto"],
  "Francia": ["Auvernia-Ródano-Alpes","Borgoña-Franco Condado","Bretaña","Centro-Valle del Loira","Córcega","Gran Este","Alta Francia","Isla de Francia","Normandía","Nueva Aquitania","Occitania","Países del Loira","Provenza-Alpes-Costa Azul"]
};

const PAISES = ["Argentina","España","México","Chile","Uruguay","Brasil","Colombia","Perú","Bolivia","Paraguay","Venezuela","Estados Unidos","Canadá","Italia","Francia","Alemania","Portugal","Reino Unido","Irlanda","Países Bajos","Bélgica","Suiza","Austria","Suecia","Noruega","Dinamarca","Finlandia","Polonia","República Checa","Grecia","Rusia","Ucrania","Turquía","Israel","Líbano","Siria","Japón","China","Corea del Sur","India","Vietnam","Filipinas","Indonesia","Tailandia","Australia","Nueva Zelanda","Sudáfrica","Marruecos","Egipto","Ecuador","Cuba","República Dominicana","Puerto Rico","Panamá","Costa Rica","Nicaragua","Honduras","El Salvador","Guatemala","Otro / no especificado"].concat(Object.keys(PROVINCIAS_POR_PAIS).filter(p=>!["Argentina","España","México","Chile","Uruguay","Brasil","Colombia","Perú","Bolivia","Paraguay","Venezuela","Estados Unidos","Italia","Francia"].includes(p)));
const PAISES_ORDENADOS = [...new Set(PAISES)].sort((a,b)=>a==="Otro / no especificado"?1:(b==="Otro / no especificado"?-1:a.localeCompare(b,"es")));

/* ---------------------------------------------------------------------
   0. ESTADO GLOBAL
   --------------------------------------------------------------------- */
const STORAGE_KEY = "ot_arbol_genealogico_v1";

let state = {
  version: 1,
  personas: [],   // ver crearPersona()
  uniones: [],    // ver crearUnion()
  layout: {}      // overrides manuales de posición: {personaId: {x,y}}
};

let selectedId = null;      // persona seleccionada en el panel
let editingPersonaId = null; // persona en edición (form)
let editingUnionId = null;   // union en edición (form)
let viewBox = {x:0,y:0,w:1200,h:800};
let panState = null;

/* ---------------------------------------------------------------------
   1. UTILIDADES
   --------------------------------------------------------------------- */
function uid(prefix){
  return (prefix||"id") + "_" + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
}

function normalizar(txt){
  if(!txt) return "";
  return txt.toString().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ").trim();
}

function nombreCompleto(p){
  if(!p) return "";
  return [p.nombre, p.apellido].filter(Boolean).join(" ");
}

function lugarNacimientoTexto(p){
  if(!p) return "";
  const compuesto = [p.localidadNacimiento, p.provinciaNacimiento, p.paisNacimiento].filter(Boolean).join(", ");
  return compuesto || p.lugarNacimiento || "";
}

function nombreConAnio(p){
  if(!p) return "";
  const fnac = mejorFechaNacimiento(p);
  const anio = fnac ? new Date(fnac).getFullYear() : null;
  return nombreCompleto(p) + (anio ? ` (${anio})` : "");
}

function iniciales(p){
  const n = (p.nombre||"").trim()[0]||"";
  const a = (p.apellido||"").trim()[0]||"";
  return (n+a).toUpperCase() || "?";
}

function mejorFechaNacimiento(p){
  // prioridad: exacta > probable > DNI
  return p.fNacExacta || p.fNacProbable || p.fNacDNI || "";
}

function parseFecha(str){
  if(!str) return null;
  const d = new Date(str+"T00:00:00");
  if(isNaN(d.getTime())) return null;
  return d;
}

function formatFecha(str){
  if(!str) return "";
  const d = parseFecha(str);
  if(!d) return str;
  return d.toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"});
}

function tieneMuerte(p){
  return !!(p && (p.fMuerte || p.fMuerteAnioSolo));
}

function fechaMuerteParaCalculo(p){
  if(!p) return null;
  if(p.fMuerte) return parseFecha(p.fMuerte);
  if(p.fMuerteAnioSolo){
    const anio = parseInt(p.fMuerteAnioSolo,10);
    if(!isNaN(anio)) return new Date(anio,6,2); // aproximación: mitad de año
  }
  return null;
}

function textoMuerte(p){
  if(!p) return "";
  let base = "";
  if(p.fMuerte) base = formatFecha(p.fMuerte);
  else if(p.fMuerteAnioSolo) base = p.fMuerteAnioSolo;
  if(!base) return "";
  return base + (p.fMuerteProbable ? " (probable)" : "");
}

function anioMuerte(p){
  if(!p) return "";
  if(p.fMuerte) return new Date(p.fMuerte).getFullYear();
  if(p.fMuerteAnioSolo) return p.fMuerteAnioSolo;
  return "";
}

function edadOrDuracion(fIni,fFin){
  const a = parseFecha(fIni), b = fFin ? parseFecha(fFin) : new Date();
  if(!a) return "";
  let años = b.getFullYear()-a.getFullYear();
  const m = b.getMonth()-a.getMonth();
  if(m<0 || (m===0 && b.getDate()<a.getDate())) años--;
  return años;
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove("show"), 2600);
}

/* ---------------------------------------------------------------------
   2. MODELO DE DATOS
   --------------------------------------------------------------------- */
function crearPersona(datos){
  return Object.assign({
    id: uid("p"),
    nombre: "",
    apellido: "",
    sexo: "M", // 'M' | 'F' | 'X'
    fNacExacta: "",
    fNacProbable: "",
    fNacDNI: "",
    fMuerte: "",
    fMuerteAnioSolo: "",
    fMuerteProbable: false,
    motivoMuerte: "",
    ocupacion: "",
    sintomas: [],
    lugarNacimiento: "",
    paisNacimiento: "",
    provinciaNacimiento: "",
    localidadNacimiento: "",
    notas: "",
    importante: "",
    esProtagonista: false,
    dobleManual: false,
    dobleManualNota: "",
    unionPadresId: null,   // union de la que es hijo/a
    gemeloDe: null,        // id de hermano/a gemelo/a (opcional)
    creado: Date.now()
  }, datos||{});
}

function crearUnion(datos){
  return Object.assign({
    id: uid("u"),
    tipo: "pareja", // 'pareja' | 'matrimonio'
    personaA: null,
    personaB: null,
    fechaInicio: "",
    fechaFin: "",
    separado: false,
    motivoSeparacion: "",
    notas: "",
    hijos: [] // array de {tipo:'persona', id} | {tipo:'aborto', nota, id}
  }, datos||{});
}

function getPersona(id){ return state.personas.find(p=>p.id===id); }
function getUnion(id){ return state.uniones.find(u=>u.id===id); }
function getProtagonista(){ return state.personas.find(p=>p.esProtagonista); }

function unionDePersona(personaId){
  return state.uniones.filter(u=>u.personaA===personaId || u.personaB===personaId);
}

function padresDe(personaId){
  const p = getPersona(personaId);
  if(!p || !p.unionPadresId) return null;
  return getUnion(p.unionPadresId);
}

/* ---------------------------------------------------------------------
   3. DETECCIÓN DE DOBLES / YACIENTES
   --------------------------------------------------------------------- */
const GRUPOS_MESES = [
  [1,4,7,10],
  [2,5,8,11],
  [3,6,9,12]
];
function grupoMes(mes){
  return GRUPOS_MESES.findIndex(g=>g.includes(mes));
}

function diferenciaDiasCircular(mes1,dia1,mes2,dia2){
  // distancia en días entre dos fechas mes/día, ignorando el año, en forma circular (0-365)
  const base = 2001; // año no bisiesto de referencia
  const d1 = new Date(base,mes1-1,dia1);
  const d2 = new Date(base,mes2-1,dia2);
  let diff = Math.abs((d1-d2)/86400000);
  if(diff>182) diff = 365-diff;
  return diff;
}

function calcularDobles(){
  const proto = getProtagonista();
  const resultado = {}; // personaId -> {esDoble, motivos:[], esYaciente}
  state.personas.forEach(p=>resultado[p.id] = {esDoble:false, motivos:[], esYaciente:false});
  if(!proto) return resultado;

  const fNacProto = mejorFechaNacimiento(proto);
  const dProto = parseFecha(fNacProto);
  const nombreProto = normalizar(nombreCompleto(proto));

  state.personas.forEach(p=>{
    if(p.id === proto.id) return;
    const motivos = [];

    // 1) coincidencia de nombre
    const nombreP = normalizar(nombreCompleto(p));
    if(nombreP && nombreProto && nombreP === nombreProto){
      motivos.push("Comparte nombre completo con el/la protagonista");
    }

    // 2) fecha de nacimiento cercana (±7 días, mismo día/mes sin importar el año)
    const fNacP = mejorFechaNacimiento(p);
    const dP = parseFecha(fNacP);
    if(dProto && dP){
      const dist = diferenciaDiasCircular(dProto.getMonth()+1, dProto.getDate(), dP.getMonth()+1, dP.getDate());
      if(dist <= 7){
        motivos.push("Fecha de nacimiento cercana a la del protagonista (±7 días)");
      }
      // 3) rango de hermandad: mismo grupo de meses + día ±7
      const gProto = grupoMes(dProto.getMonth()+1);
      const gP = grupoMes(dP.getMonth()+1);
      if(gProto === gP && Math.abs(dProto.getDate()-dP.getDate()) <= 7){
        motivos.push("Comparte rango de hermandad (misma columna de meses, día ±7)");
      }
    }

    // 4) marca manual
    if(p.dobleManual){
      motivos.push(p.dobleManualNota ? ("Marcado manualmente: " + p.dobleManualNota) : "Marcado manualmente como doble");
    }

    const esDoble = motivos.length>0;
    let esYaciente = false;
    if(esDoble && dProto){
      const dMuerte = fechaMuerteParaCalculo(p);
      if(dMuerte && dMuerte < dProto) esYaciente = true;
    }
    resultado[p.id] = {esDoble, motivos, esYaciente};
  });
  return resultado;
}

/* ---------------------------------------------------------------------
   4. SIMILITUD ENTRE NOTAS
   --------------------------------------------------------------------- */
const STOPWORDS = new Set("de la que el en y a los se del las un por con no una su para es al lo como mas pero sus le ya o este si porque esta entre cuando muy sin sobre tambien me hasta hay donde quien desde todo nos durante todos uno les ni contra otros ese eso ante ellos e esto mi antes algunos que unos yo otro otras otra el tanto esa estos mucho quienes nada muchos cual poco ella estar estas algunas algo nosotros mi mis tu tus te ti tuyo ustedes fue era".split(" "));

function palabrasClave(texto){
  const norm = normalizar(texto);
  if(!norm) return [];
  return [...new Set(norm.split(" ").filter(w=>w.length>=4 && !STOPWORDS.has(w)))];
}

function similitudNotas(){
  // devuelve mapa personaId -> [{otroId, score, compartidas:[palabras]}]
  const personasConNotas = state.personas.filter(p=>p.notas && p.notas.trim().length>0);
  const mapa = {};
  personasConNotas.forEach(p=>mapa[p.id]=[]);
  for(let i=0;i<personasConNotas.length;i++){
    for(let j=i+1;j<personasConNotas.length;j++){
      const A = personasConNotas[i], B = personasConNotas[j];
      const wa = palabrasClave(A.notas), wb = palabrasClave(B.notas);
      if(!wa.length || !wb.length) continue;
      const setA = new Set(wa);
      const compartidas = wb.filter(w=>setA.has(w));
      if(compartidas.length===0) continue;
      const union = new Set([...wa,...wb]).size;
      const score = compartidas.length / union;
      if(compartidas.length>=2 || score>=0.28){
        mapa[A.id].push({otroId:B.id, score, compartidas});
        mapa[B.id].push({otroId:A.id, score, compartidas});
      }
    }
  }
  Object.keys(mapa).forEach(k=>mapa[k].sort((a,b)=>b.score-a.score));
  return mapa;
}

/* ---------------------------------------------------------------------
   5. LAYOUT (posicionamiento del genograma)
   --------------------------------------------------------------------- */
const SPACING_X = 138;
const SPACING_Y = 225;
const COUPLE_GAP = 46;

function calcularLayout(){
  const personas = state.personas;
  const uniones = state.uniones;
  const genPersona = {};
  const genMemo = {};

  function genDe(pid, visitados){
    if(genMemo[pid]!==undefined) return genMemo[pid];
    if(visitados && visitados.has(pid)) return 0; // corta ciclos accidentales
    const p = getPersona(pid);
    if(!p) return 0;
    if(!p.unionPadresId){ genMemo[pid]=null; return null; }
    const u = getUnion(p.unionPadresId);
    if(!u){ genMemo[pid]=null; return null; }
    const vis = new Set(visitados); vis.add(pid);
    const padresIds = [u.personaA,u.personaB].filter(Boolean);
    // los padres sin ancestros propios se tratan como generación 0 (fundadores)
    // a los solos efectos de calcular la generación de sus hijos.
    const gs = padresIds.map(id=>{ const gg = genDe(id,vis); return gg===null ? 0 : gg; });
    const g = gs.length ? Math.max(...gs)+1 : 0;
    genMemo[pid] = g;
    return g;
  }
  personas.forEach(p=>genDe(p.id,new Set()));

  // propagar generación a cónyuges sin ancestros conocidos (varias pasadas)
  for(let pass=0; pass<6; pass++){
    let cambios = false;
    uniones.forEach(u=>{
      const a = u.personaA, b = u.personaB;
      if(!a || !b) return;
      const ga = genMemo[a], gb = genMemo[b];
      if(ga!==null && ga!==undefined && (gb===null || gb===undefined)){ genMemo[b]=ga; cambios=true; }
      else if(gb!==null && gb!==undefined && (ga===null || ga===undefined)){ genMemo[a]=gb; cambios=true; }
    });
    if(!cambios) break;
  }
  personas.forEach(p=>{ genPersona[p.id] = (genMemo[p.id]===null || genMemo[p.id]===undefined) ? 0 : genMemo[p.id]; });

  // normalizar para que el mínimo sea 0
  const minGen = personas.length ? Math.min(...personas.map(p=>genPersona[p.id])) : 0;
  personas.forEach(p=>genPersona[p.id]-=minGen);

  // agrupar por generación
  const porGen = {};
  personas.forEach(p=>{
    const g = genPersona[p.id];
    (porGen[g] = porGen[g]||[]).push(p.id);
  });
  const generaciones = Object.keys(porGen).map(Number).sort((a,b)=>a-b);

  // padre siempre a la izquierda, madre siempre a la derecha (si el sexo de ambos es conocido y distinto)
  function ladoIzquierdaDerecha(idA, idB){
    const pa = getPersona(idA), pb = getPersona(idB);
    if(pa && pb){
      if(pa.sexo==="M" && pb.sexo==="F") return [idA, idB];
      if(pa.sexo==="F" && pb.sexo==="M") return [idB, idA];
    }
    return [idA, idB];
  }

  // linaje directo del/de la protagonista: la persona + todos sus ascendientes.
  // se usa para que los padres/abuelos/etc. de "Yo" se centren sobre ese
  // descendiente puntual y no sobre el promedio de todos sus hermanos.
  const linaje = new Set();
  (function(){
    const proto = getProtagonista();
    if(!proto) return;
    const pila = [proto.id];
    while(pila.length){
      const pid = pila.pop();
      if(!pid || linaje.has(pid)) continue;
      linaje.add(pid);
      const per = getPersona(pid);
      if(per && per.unionPadresId){
        const u = getUnion(per.unionPadresId);
        if(u){ if(u.personaA) pila.push(u.personaA); if(u.personaB) pila.push(u.personaB); }
      }
    }
  })();

  // ancho de ascendencia: cuántas "unidades" de SPACING_X necesita reservar
  // cada persona para que sus propios ancestros (más arriba) no choquen con
  // los de sus tíos/primos. Un fundador (sin padres cargados) vale 1 unidad;
  // alguien con dos padres cargados vale la suma del ancho de cada uno.
  // Esto es lo que permite que, por ejemplo, los abuelos paternos y los
  // maternos queden cada uno bien centrados sobre su hijo/a sin superponerse.
  const anchoMemo = new Map();
  function anchoAscendencia(pid){
    if(anchoMemo.has(pid)) return anchoMemo.get(pid);
    anchoMemo.set(pid, 1); // valor provisorio por si hay referencias circulares
    const per = getPersona(pid);
    let ancho = 1;
    if(per && per.unionPadresId){
      const u = getUnion(per.unionPadresId);
      if(u){
        const padresIds = [u.personaA, u.personaB].filter(Boolean);
        if(padresIds.length===2) ancho = Math.max(1, anchoAscendencia(padresIds[0])+anchoAscendencia(padresIds[1]));
        else if(padresIds.length===1) ancho = Math.max(1, anchoAscendencia(padresIds[0]));
      }
    }
    anchoMemo.set(pid, ancho);
    return ancho;
  }

  // orden Y posición se calculan juntos, en un único pase "de abajo hacia
  // arriba" (generación más profunda primero). Esto es clave: si el orden
  // izquierda-derecha se decidiera de arriba hacia abajo (por orden de carga)
  // y el centrado se hiciera de abajo hacia arriba (por ancla del linaje),
  // ambos criterios podían contradecirse — por ejemplo, la familia de un
  // abuelo cargada "después" quedaba de todos modos a la izquierda por
  // ascendencia, pero el barrido ya había avanzado hacia la derecha y no
  // podía volver atrás, empujándola lejos de su hijo/a. Ordenando cada
  // generación según la posición ya calculada de sus propios descendientes,
  // ese conflicto desaparece.
  const xFinal = {}; // personaId -> x en píxeles
  const generacionesDesc = generaciones.slice().sort((a,b)=>b-a);

  generacionesDesc.forEach(g=>{
    const idsGen = porGen[g].slice();
    const idxOriginal = new Map();
    idsGen.forEach((pid,i)=>idxOriginal.set(pid,i));

    // 1) agrupar en unidades (pareja o individuo), padre siempre a la izquierda
    const procesados = new Set();
    const unidades = [];
    idsGen.forEach(pid=>{
      if(procesados.has(pid)) return;
      const uns = unionDePersona(pid).filter(u=>{
        const otro = u.personaA===pid?u.personaB:u.personaA;
        return otro && genPersona[otro]===g && !procesados.has(otro);
      });
      if(uns.length){
        const otro = uns[0].personaA===pid?uns[0].personaB:uns[0].personaA;
        const [izq, der] = ladoIzquierdaDerecha(pid, otro);
        procesados.add(izq); procesados.add(der);
        unidades.push({miembros:[izq,der], union: uns[0]});
      } else {
        procesados.add(pid);
        unidades.push({miembros:[pid], union: null});
      }
    });

    // 2) calcular el "ancla" de cada unidad: el centro de sus hijos ya
    // posicionados (priorizando al hijo/a del linaje directo si lo hay)
    function anclaDe(unidad){
      let hijosIds = [];
      if(unidad.union){
        hijosIds = (unidad.union.hijos||[]).filter(h=>h.tipo==="persona").map(h=>h.id);
      } else {
        unionDePersona(unidad.miembros[0]).forEach(u=>(u.hijos||[]).forEach(h=>{ if(h.tipo==="persona") hijosIds.push(h.id); }));
      }
      const validos = hijosIds.filter(id=>xFinal[id]!==undefined);
      if(!validos.length) return null;
      const hijoLinaje = validos.find(id=>linaje.has(id));
      if(hijoLinaje!==undefined) return {x: xFinal[hijoLinaje], esLinaje:true, hijosIds};
      return {x: validos.reduce((a,b)=>a+xFinal[b],0)/validos.length, esLinaje:false, hijosIds};
    }
    unidades.forEach(u=>{ u.ancla = anclaDe(u); });

    // 3) ordenar las unidades: las que tienen ancla, por su posición x
    // deseada; las que no (aún no tienen descendientes posicionados),
    // se intercalan según su orden de aparición original.
    function idxUnidad(u){ return Math.min(...u.miembros.map(m=>idxOriginal.get(m))); }
    unidades.sort((a,b)=>{
      if(a.ancla && b.ancla) return a.ancla.x - b.ancla.x || idxUnidad(a)-idxUnidad(b);
      if(a.ancla && !b.ancla) return a.ancla.x - (b.ancla?b.ancla.x:0) || (idxUnidad(a)-idxUnidad(b)) || -1;
      if(!a.ancla && b.ancla) return idxUnidad(a)-idxUnidad(b) || 1;
      return idxUnidad(a)-idxUnidad(b);
    });

    // 4) barrido izquierda→derecha en ese orden, centrando cada unidad sobre
    // su ancla (con el ancho extra de ascendencia si ancla al linaje) o
    // colocándola en secuencia si todavía no tiene hijos posicionados.
    let prevX = null;
    unidades.forEach(u=>{
      if(u.miembros.length===2){
        const [izq, der] = u.miembros;
        const esAnclaLinaje = !!(u.ancla && u.ancla.esLinaje);
        const sep = esAnclaLinaje ? (anchoAscendencia(izq)/2 + anchoAscendencia(der)/2) * SPACING_X : SPACING_X;
        let xIzq;
        if(u.ancla){
          xIzq = u.ancla.x - sep/2;
        } else {
          xIzq = prevX===null ? 0 : prevX+SPACING_X;
        }
        if(prevX!==null && xIzq < prevX+SPACING_X) xIzq = prevX+SPACING_X;
        const xDer = xIzq + sep;
        xFinal[izq] = xIzq;
        xFinal[der] = xDer;
        prevX = xDer;
      } else {
        const pid = u.miembros[0];
        let x;
        if(u.ancla){
          x = u.ancla.x;
        } else {
          x = prevX===null ? 0 : prevX+SPACING_X;
        }
        if(prevX!==null && x < prevX+SPACING_X) x = prevX+SPACING_X;
        xFinal[pid] = x;
        prevX = x;
      }
    });
  });

  const pos = {}; // personaId -> {x,y}
  personas.forEach(p=>{
    const g = genPersona[p.id];
    pos[p.id] = { x: xFinal[p.id]||0, y: g*SPACING_Y };
  });

  // posicionar los "hijos especiales" (abortos) junto a sus hermanos o bajo la unión
  state.uniones.forEach(u=>{
    const abortos = (u.hijos||[]).filter(h=>h.tipo==="aborto");
    if(!abortos.length) return;
    const partnerIds = [u.personaA, u.personaB].filter(Boolean);
    const partnerPos = partnerIds.map(id=>pos[id]).filter(Boolean);
    if(!partnerPos.length) return;
    const midX = partnerPos.reduce((s,pp)=>s+pp.x,0)/partnerPos.length;
    const gUnion = Math.max(...partnerIds.map(id=>genPersona[id]));
    const y = (gUnion+1)*SPACING_Y;
    const hijosPersonaIds = (u.hijos||[]).filter(h=>h.tipo==="persona").map(h=>h.id);
    let baseX = midX;
    if(hijosPersonaIds.length){
      const xs = hijosPersonaIds.map(id=>pos[id]?pos[id].x:midX);
      baseX = Math.max(...xs) + SPACING_X*0.55;
    }
    abortos.forEach((ab,i)=>{
      pos[ab.id] = {x: baseX + i*(SPACING_X*0.45), y};
    });
  });

  // aplicar overrides manuales
  Object.keys(state.layout||{}).forEach(pid=>{
    if(pos[pid]) pos[pid] = Object.assign({}, pos[pid], state.layout[pid]);
  });

  return {pos, genPersona};
}

/* ---------------------------------------------------------------------
   6. RENDER SVG DEL ÁRBOL
   --------------------------------------------------------------------- */
const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs){
  const el = document.createElementNS(NS, tag);
  if(attrs) Object.keys(attrs).forEach(k=>el.setAttribute(k, attrs[k]));
  return el;
}

function renderArbol(){
  const svg = document.getElementById("tree-svg");
  const wrap = document.getElementById("canvas-wrap");
  svg.innerHTML = "";
  if(state.personas.length===0){
    wrap.classList.add("empty");
    return;
  }
  wrap.classList.remove("empty");

  const {pos} = calcularLayout();
  const dobles = calcularDobles();
  const proto = getProtagonista();

  const gRoot = svgEl("g", {id:"g-root"});
  svg.appendChild(gRoot);

  const gLines = svgEl("g", {class:"lines"});
  const gNodes = svgEl("g", {class:"nodes"});
  gRoot.appendChild(gLines);
  gRoot.appendChild(gNodes);

  const PADX = 90, PADY = 70;

  function px(pid){ return pos[pid].x + PADX; }
  function py(pid){ return pos[pid].y + PADY; }

  /* ---- líneas de uniones e hijos ---- */
  state.uniones.forEach(u=>{
    const a = u.personaA, b = u.personaB;
    let midX, midY;
    if(a && b){
      const ax=px(a), ay=py(a), bx=px(b), by=py(b);
      const y = (ay+by)/2;
      const cx = (ax+bx)/2;
      const esMatrimonio = u.tipo==="matrimonio";

      const gUnion = svgEl("g", {class:"union-connector", "data-union-id":u.id, style:"cursor:pointer;"});

      // área de clic ampliada (invisible) para poder editar la unión con un toque
      const hit = svgEl("line",{x1:ax+22,y1:y,x2:bx-22,y2:y,stroke:"transparent","stroke-width":16});
      gUnion.appendChild(hit);

      const line = svgEl("line",{x1:ax+22,y1:y,x2:bx-22,y2:y,stroke:"var(--linea)","stroke-width":esMatrimonio?1.8:1.4});
      gUnion.appendChild(line);

      const tickOffset = esMatrimonio ? 18 : 0;
      // símbolo de separación
      if(u.separado){
        [ -5, 5 ].forEach(off=>{
          const s = svgEl("line",{x1:cx+tickOffset+off-4,y1:y-8,x2:cx+tickOffset+off+4,y2:y+8,stroke:"var(--linea)","stroke-width":1.4});
          gUnion.appendChild(s);
        });
      }

      // matrimonio: anillos entrelazados + fecha completa
      if(esMatrimonio){
        const r = 6.5;
        const ringX = cx - tickOffset;
        const ring1 = svgEl("circle",{cx:ringX-4.5,cy:y,r:r,fill:"none",stroke:"var(--dorado)","stroke-width":1.7});
        const ring2 = svgEl("circle",{cx:ringX+4.5,cy:y,r:r,fill:"none",stroke:"var(--dorado)","stroke-width":1.7});
        gUnion.appendChild(ring1); gUnion.appendChild(ring2);
        if(u.fechaInicio){
          const dateLabel = svgEl("text",{x:ringX,y:y-13,"text-anchor":"middle","font-family":"Montserrat, sans-serif","font-size":"9.5","font-weight":"600","fill":"var(--cobre)"});
          dateLabel.textContent = formatFecha(u.fechaInicio);
          gUnion.appendChild(dateLabel);
        }
      }

      gUnion.addEventListener("click",(ev)=>{ ev.stopPropagation(); formularioUnion(u.id); });
      gLines.appendChild(gUnion);

      midX = cx; midY = y;
    } else if(a || b){
      const solo = a||b;
      midX = px(solo); midY = py(solo);
    } else {
      return;
    }

    if(u.hijos && u.hijos.length){
      const hijosValidos = u.hijos.filter(h=>pos[h.id]);
      if(!hijosValidos.length) return;
      const busY = midY + SPACING_Y/2;
      const drop = svgEl("line",{x1:midX,y1:midY,x2:midX,y2:busY,stroke:"var(--linea)","stroke-width":1.4});
      gLines.appendChild(drop);

      const allXs = hijosValidos.map(h=>px(h.id));
      if(hijosValidos.length>1){
        const minX = Math.min(...allXs);
        const maxX = Math.max(...allXs);
        const bus = svgEl("line",{x1:minX,y1:busY,x2:maxX,y2:busY,stroke:"var(--linea)","stroke-width":1.4});
        gLines.appendChild(bus);
      }

      hijosValidos.forEach(h=>{
        const hx = px(h.id);
        if(h.tipo==="aborto"){
          const hy = py(h.id);
          const stem = svgEl("line",{x1:hx,y1:busY,x2:hx,y2:hy-6,stroke:"var(--linea)","stroke-width":1.2});
          gLines.appendChild(stem);
          const t1 = svgEl("line",{x1:hx-3,y1:hy-6,x2:hx-6,y2:hy+6,stroke:"var(--linea)","stroke-width":1.4});
          const t2 = svgEl("line",{x1:hx,y1:hy-6,x2:hx-3,y2:hy+6,stroke:"var(--linea)","stroke-width":1.4});
          gLines.appendChild(t1); gLines.appendChild(t2);
          if(h.nota){
            const titleEl = svgEl("title",{});
            titleEl.textContent = "Aborto: " + h.nota;
            t2.appendChild(titleEl);
          }
        } else {
          const hy = py(h.id);
          const stem = svgEl("line",{x1:hx,y1:busY,x2:hx,y2:hy-24,stroke:"var(--linea)","stroke-width":1.4});
          gLines.appendChild(stem);
        }
      });

      // gemelos: unir con el símbolo ^ si dos hijos del mismo union están marcados como gemelos entre sí
      const hijosPersonas = u.hijos.filter(h=>h.tipo!=="aborto").map(h=>getPersona(h.id)).filter(Boolean);
      hijosPersonas.forEach(hp=>{
        if(hp.gemeloDe){
          const otro = getPersona(hp.gemeloDe);
          if(otro && u.hijos.some(h=>h.id===otro.id)){
            const x1=px(hp.id), x2=px(otro.id);
            const y = busY - 12;
            const capX = (x1+x2)/2;
            const poly = svgEl("polyline",{points:`${x1},${y+10} ${capX},${y-6} ${x2},${y+10}`,fill:"none",stroke:"var(--linea)","stroke-width":1.3});
            gLines.appendChild(poly);
          }
        }
      });
    }
  });

  /* ---- nodos (personas) ---- */
  state.personas.forEach(p=>{
    const x = px(p.id), y = py(p.id);
    const d = dobles[p.id]||{esDoble:false,esYaciente:false,motivos:[]};
    const claseNodo = "nodo" + (d.esDoble ? " es-especial" : "");
    const g = svgEl("g", {class:claseNodo, "data-id":p.id, transform:`translate(${x},${y})`, style:"cursor:pointer;"});

    // área de clic invisible que cubre todo el nodo (figura + nombre apilado + fechas),
    // para que el clic funcione también sobre el espacio "vacío" entre el ícono y el texto.
    const palabrasEstim = [p.nombre, p.apellido].join(" ").trim().split(/\s+/).filter(Boolean).length || 1;
    const lineasEstim = palabrasEstim + (mejorFechaNacimiento(p)?1:0) + (tieneMuerte(p)?1:0);
    const altoEstim = 16 + 16 + lineasEstim*12 + 6;
    const hitRect = svgEl("rect",{x:-42,y:-24,width:84,height:altoEstim,fill:"transparent"});
    g.appendChild(hitRect);

    const finado = tieneMuerte(p);
    const color = d.esDoble ? "var(--dorado)" : "var(--linea)";
    const strokeW = d.esDoble ? 2.8 : 1.8;
    const fillColor = d.esYaciente ? "var(--tinta)" : "#fff";
    const fillOpacity = d.esYaciente ? 0.92 : 0.9;

    let shape;
    const R = 17;
    if(p.sexo==="F"){
      shape = svgEl("circle",{cx:0,cy:0,r:R,fill:fillColor,"fill-opacity":fillOpacity,stroke:color,"stroke-width":strokeW});
    } else if(p.sexo==="X"){
      shape = svgEl("rect",{x:-R,y:-R,width:R*2,height:R*2,rx:5,fill:fillColor,"fill-opacity":fillOpacity,stroke:color,"stroke-width":strokeW});
    } else {
      shape = svgEl("polygon",{points:`0,${-R-3} ${R+2},${R-3} ${-R-2},${R-3}`,fill:fillColor,"fill-opacity":fillOpacity,stroke:color,"stroke-width":strokeW});
    }
    g.appendChild(shape);

    if(p.esProtagonista){
      const box = svgEl("rect",{x:-R-7,y:-R-9,width:(R+7)*2,height:(R+9)*2,fill:"none",stroke:"var(--dorado)","stroke-width":2,rx:4});
      g.appendChild(box);
    }

    if(finado){
      const lineColor = d.esYaciente ? "#fff" : color;
      const x1 = svgEl("line",{x1:-R*0.7,y1:-R*0.7,x2:R*0.7,y2:R*0.7,stroke:lineColor,"stroke-width":1.4});
      g.appendChild(x1);
    }

    if(d.esDoble){
      const mark = svgEl("circle",{cx:R-2,cy:-R+2,r:5.5,fill:"var(--dorado)",stroke:"#fff","stroke-width":1.3});
      g.appendChild(mark);
      const markLabel = svgEl("text",{x:R-2,y:-R+5.5,"text-anchor":"middle","font-family":"Oswald, sans-serif","font-size":"7.5","font-weight":"700",fill:"var(--tinta)"});
      markLabel.textContent = d.esYaciente ? "Y" : "D";
      g.appendChild(markLabel);
    }

    // nombre apilado: cada palabra (nombre/s y apellido/s) en su propia línea centrada
    const palabrasNombre = [p.nombre, p.apellido].join(" ").trim().split(/\s+/).filter(Boolean);
    const lineasNombre = palabrasNombre.length ? palabrasNombre : ["(sin nombre)"];
    const LH = 12;
    lineasNombre.forEach((palabra,i)=>{
      const t = svgEl("text",{x:0,y:R+16+i*LH,"text-anchor":"middle","font-family":"Montserrat, sans-serif","font-size":"10.5","font-weight":"600","fill":"var(--tinta)"});
      t.textContent = palabra;
      g.appendChild(t);
    });

    let dateY = R+16+lineasNombre.length*LH+3;
    const fnac = mejorFechaNacimiento(p);
    if(fnac){
      const l1 = svgEl("text",{x:0,y:dateY,"text-anchor":"middle","font-family":"Montserrat, sans-serif","font-size":"9","fill":"#8a7f6c"});
      l1.textContent = "n. " + formatFecha(fnac);
      g.appendChild(l1);
      dateY += 11.5;
    }
    if(tieneMuerte(p)){
      const l2 = svgEl("text",{x:0,y:dateY,"text-anchor":"middle","font-family":"Montserrat, sans-serif","font-size":"9","fill":"#8a7f6c"});
      l2.textContent = "f. " + textoMuerte(p);
      g.appendChild(l2);
      dateY += 11.5;
    }

    g.addEventListener("mouseenter", (ev)=>mostrarHoverCard(p, ev));
    g.addEventListener("mousemove", (ev)=>moverHoverCard(ev));
    g.addEventListener("mouseleave", ocultarHoverCard);
    g.addEventListener("click", (ev)=>{ ev.stopPropagation(); abrirDetalle(p.id); });

    hacerArrastrable(g, p.id);

    gNodes.appendChild(g);
  });

  aplicarTransformCanvas();
}

/* ---- arrastre manual de nodos ---- */
function hacerArrastrable(g, personaId){
  let dragging=false, startX,startY, origX, origY;
  g.addEventListener("mousedown",(ev)=>{
    ev.stopPropagation();
    dragging=true;
    const svg = document.getElementById("tree-svg");
    const pt = clientToSvg(ev.clientX, ev.clientY);
    startX = pt.x; startY = pt.y;
    const {pos} = calcularLayout();
    origX = pos[personaId].x; origY = pos[personaId].y;
    function onMove(e2){
      if(!dragging) return;
      const p2 = clientToSvg(e2.clientX, e2.clientY);
      const nx = origX + (p2.x-startX);
      const ny = origY + (p2.y-startY);
      state.layout[personaId] = {x:nx,y:ny};
      renderArbol();
    }
    function onUp(){
      dragging=false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      guardarEstado();
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}

function clientToSvg(clientX, clientY){
  const svg = document.getElementById("tree-svg");
  const rect = svg.getBoundingClientRect();
  const scale = viewBox.w / rect.width;
  return {
    x: (clientX-rect.left)*scale + viewBox.x,
    y: (clientY-rect.top)*scale + viewBox.y
  };
}

function aplicarTransformCanvas(){
  const svg = document.getElementById("tree-svg");
  svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
}

/* ---- hover card ---- */
function mostrarHoverCard(p, ev){
  const dobles = calcularDobles();
  const d = dobles[p.id]||{};
  const card = document.getElementById("hover-card");
  let html = `<div class="hc-name">${escapeHtml(nombreCompleto(p))}</div>`;
  const nacTxt = formatFecha(mejorFechaNacimiento(p))||"¿?";
  const muerteTxt = textoMuerte(p);
  html += `<div class="hc-dates">${nacTxt}${muerteTxt?(" — "+muerteTxt):""}</div>`;
  if(d.esYaciente) html += `<span class="hc-badge" style="background:var(--tinta);color:#fff;">Yaciente</span>`;
  else if(d.esDoble) html += `<span class="hc-badge">Doble</span>`;
  if(p.importante) html += `<div class="hc-important">★ ${escapeHtml(p.importante)}</div>`;
  card.innerHTML = html;
  card.classList.add("show");
  moverHoverCard(ev);
}
function moverHoverCard(ev){
  const card = document.getElementById("hover-card");
  const wrapRect = document.getElementById("canvas-wrap").getBoundingClientRect();
  let left = ev.clientX - wrapRect.left + 16;
  let top = ev.clientY - wrapRect.top + 12;
  card.style.left = left+"px";
  card.style.top = top+"px";
}
function ocultarHoverCard(){
  document.getElementById("hover-card").classList.remove("show");
}
function escapeHtml(s){
  return (s||"").toString().replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ---------------------------------------------------------------------
   7. PANEL LATERAL — detalle / formularios
   --------------------------------------------------------------------- */
function abrirPanel(html){
  const panel = document.getElementById("side-panel");
  panel.innerHTML = html;
  panel.classList.add("open");
  document.getElementById("overlay-scrim").classList.add("show");
}
function cerrarPanel(){
  document.getElementById("side-panel").classList.remove("open");
  document.getElementById("overlay-scrim").classList.remove("show");
  selectedId = null; editingPersonaId=null; editingUnionId=null;
}
document.getElementById("overlay-scrim").addEventListener("click", cerrarPanel);

/* ---- guía de uso, integrada en la app ---- */
function contenidoGuia(){
  return `
    <section>
      <div class="g-num">01</div>
      <h4>Primeros pasos</h4>
      <p class="g-intro">No hay que instalar ni registrarse en nada. Cargá personas y uniones para ir armando tu árbol — se guarda solo en este navegador a medida que trabajás.</p>
      <div class="g-tip"><strong>¿Recién arrancás?</strong> Probá "Cargar ejemplo" desde la pantalla de bienvenida para ver un árbol ya armado, o "Empezar vacío" para ir directo con tu propia familia.</div>
    </section>

    <section>
      <div class="g-num">02</div>
      <h4>Moverte por el árbol</h4>
      <table class="g-kv">
        <tr><th>Acción</th><th>Mouse / computadora</th><th>Dedo / celular</th></tr>
        <tr><td>Mover el árbol</td><td>Clic sostenido y arrastrar</td><td>Arrastrar con un dedo</td></tr>
        <tr><td>Acercar / alejar</td><td>Rueda del mouse, o botones + / −</td><td>Pellizcar con dos dedos, o botones + / −</td></tr>
        <tr><td>Ver todo el árbol</td><td colspan="2">Botón con la flechita en las cuatro puntas</td></tr>
      </table>
    </section>

    <section>
      <div class="g-num">03</div>
      <h4>Agregar una persona</h4>
      <p class="g-intro">Tocá el botón dorado <strong>"+ Persona"</strong>.</p>
      <ol class="g-steps">
        <li><span class="g-n">1</span><p>Completá al menos el <strong>nombre o el apellido</strong> — es lo único obligatorio. El resto lo podés dejar en blanco y completar después.</p></li>
        <li><span class="g-n">2</span><p>Si no sabés la fecha exacta de muerte, hay un campo para poner <strong>solo el año</strong>, con un tilde de "es probable".</p></li>
        <li><span class="g-n">3</span><p>Las <strong>notas</strong> se comparan automáticamente entre todas las personas — la app avisa si dos historias se parecen mucho.</p></li>
        <li><span class="g-n">4</span><p>Marcá <strong>"Protagonista"</strong> en la persona sobre la que gira el árbol (solo puede haber una) — activa la detección de dobles y yacientes.</p></li>
      </ol>
    </section>

    <section>
      <div class="g-num">04</div>
      <h4>Uniones e hijos</h4>
      <p class="g-intro">Con al menos dos personas cargadas, tocá <strong>"+ Pareja / unión"</strong>, elegí si fue matrimonio o pareja, y sumá a sus hijos/as al final del formulario.</p>
      <div class="g-tip"><strong>¿Ya existe la unión?</strong> No crees una nueva — tocá directamente la línea que conecta a la pareja en el dibujo del árbol para editarla.</div>
    </section>

    <section>
      <div class="g-num">05</div>
      <h4>Los símbolos del árbol</h4>
      <div class="g-symbols">
        <div class="g-symbol"><svg width="26" height="20"><polygon points="13,2 24,18 2,18" fill="none" stroke="#073B5C" stroke-width="1.6"/></svg><div class="g-label"><b>Triángulo</b><span>Hombre</span></div></div>
        <div class="g-symbol"><svg width="26" height="20"><circle cx="13" cy="10" r="8" fill="none" stroke="#073B5C" stroke-width="1.6"/></svg><div class="g-label"><b>Círculo</b><span>Mujer</span></div></div>
        <div class="g-symbol"><svg width="26" height="20"><rect x="4" y="2" width="18" height="16" fill="none" stroke="#C78B2B" stroke-width="1.8"/></svg><div class="g-label"><b>Marco dorado</b><span>Protagonista (Yo)</span></div></div>
        <div class="g-symbol"><svg width="26" height="20"><polygon points="13,2 24,18 2,18" fill="none" stroke="#073B5C" stroke-width="1.6"/><line x1="5" y1="5" x2="21" y2="16" stroke="#073B5C" stroke-width="1.4"/></svg><div class="g-label"><b>Línea diagonal</b><span>Fallecido/a</span></div></div>
        <div class="g-symbol"><svg width="40" height="18"><line x1="2" y1="9" x2="38" y2="9" stroke="#073B5C" stroke-width="1.4"/><circle cx="15" cy="9" r="6" fill="none" stroke="#C78B2B" stroke-width="1.4"/><circle cx="24" cy="9" r="6" fill="none" stroke="#C78B2B" stroke-width="1.4"/></svg><div class="g-label"><b>Anillos entrelazados</b><span>Matrimonio (con fecha)</span></div></div>
        <div class="g-symbol"><svg width="30" height="14"><line x1="2" y1="7" x2="28" y2="7" stroke="#073B5C" stroke-width="1.4"/></svg><div class="g-label"><b>Línea simple</b><span>Pareja (sin casamiento)</span></div></div>
        <div class="g-symbol"><svg width="30" height="14"><line x1="2" y1="7" x2="28" y2="7" stroke="#073B5C" stroke-width="1.4"/><line x1="12" y1="1" x2="16" y2="13" stroke="#073B5C" stroke-width="1.4"/><line x1="16" y1="1" x2="20" y2="13" stroke="#073B5C" stroke-width="1.4"/></svg><div class="g-label"><b>Doble raya</b><span>Separación / divorcio</span></div></div>
        <div class="g-symbol"><svg width="18" height="18"><line x1="8" y1="2" x2="5" y2="16" stroke="#073B5C" stroke-width="1.4"/><line x1="12" y1="2" x2="9" y2="16" stroke="#073B5C" stroke-width="1.4"/></svg><div class="g-label"><b>Dos rayas cortas</b><span>Aborto</span></div></div>
        <div class="g-symbol"><svg width="26" height="18"><polyline points="2,16 13,2 24,16" fill="none" stroke="#073B5C" stroke-width="1.4"/></svg><div class="g-label"><b>Techo doble</b><span>Gemelos / mellizos</span></div></div>
        <div class="g-symbol"><svg width="26" height="20"><circle cx="13" cy="10" r="8" fill="#fff" stroke="#C78B2B" stroke-width="2"/><circle cx="20" cy="4" r="5" fill="#C78B2B"/></svg><div class="g-label"><b>Borde dorado + "D"</b><span>Doble</span></div></div>
        <div class="g-symbol"><svg width="26" height="20"><circle cx="13" cy="10" r="8" fill="#172B36" stroke="#C78B2B" stroke-width="2"/><circle cx="20" cy="4" r="5" fill="#C78B2B"/></svg><div class="g-label"><b>Relleno oscuro + "Y"</b><span>Yaciente</span></div></div>
      </div>
    </section>

    <section>
      <div class="g-num">06</div>
      <h4>Dobles y yacientes</h4>
      <p class="g-intro">La app los detecta <strong>sola</strong> — pero solo si marcaste a alguien como protagonista.</p>
      <div class="g-card">
        <h5><span class="badge doble">Doble</span></h5>
        <p>Alguien que parece "repetir" al protagonista: comparte su nombre, nació muy cerca de la misma fecha, o nació en el mismo mes que otro hermano/a en un punto equivalente de la familia.</p>
      </div>
      <div class="g-card">
        <h5><span class="badge yaciente">Yaciente</span></h5>
        <p>Un doble que además <strong>murió antes de que naciera el protagonista</strong>.</p>
      </div>
      <div class="g-tip">También podés marcar a alguien como doble <strong>a mano</strong> (con una nota), desde su ficha.</div>
    </section>

    <section>
      <div class="g-num">07</div>
      <h4>Buscar y resaltar</h4>
      <ol class="g-steps">
        <li><span class="g-n">1</span><p>Escribí un nombre en <strong>"Buscar persona…"</strong> — la vista se centra sola en esa persona.</p></li>
        <li><span class="g-n">2</span><p><strong>"Resaltar dobles/yacientes"</strong> atenúa el resto del árbol y deja bien visibles solo esos casos.</p></li>
      </ol>
    </section>

    <section>
      <div class="g-num">08</div>
      <h4>Guardar y compartir con la familia</h4>
      <p class="g-intro">Tu árbol se guarda <strong>solo en tu navegador</strong>. Otro familiar que abra la app en su computadora <strong>no ve tus datos</strong> — cada uno tiene su propia copia.</p>
      <ol class="g-steps">
        <li><span class="g-n">1</span><p>Tocá <strong>"Exportar .json"</strong> — se descarga un archivo con todos los datos.</p></li>
        <li><span class="g-n">2</span><p>Se lo mandás a tu familiar (mail, WhatsApp como documento).</p></li>
        <li><span class="g-n">3</span><p>Esa persona toca <strong>"Importar .json"</strong> y elige el archivo.</p></li>
        <li><span class="g-n">4</span><p>Si agrega algo, exporta su .json actualizado y te lo devuelve para reimportar.</p></li>
      </ol>
      <div class="g-tip"><strong>No es en tiempo real</strong> — es más como pasarse un cuaderno. Guardá siempre una copia del .json en un lugar seguro.</div>
    </section>

    <section>
      <div class="g-num">09</div>
      <h4>Exportar imagen o imprimir</h4>
      <div class="g-card"><h5>Exportar imagen</h5><p>Genera una foto (PNG) de todo el árbol, lista para mandar por WhatsApp.</p></div>
      <div class="g-card"><h5>Vista imprimible</h5><p>Acomoda el árbol en una hoja grande (A3 apaisado) y abre el diálogo de impresión — también sirve para "imprimir como PDF".</p></div>
    </section>

    <section>
      <div class="g-num">10</div>
      <h4>Preguntas frecuentes</h4>
      <div class="g-faq">
        <details><summary>¿Se guardó todo al cerrar la app?</summary><p>Sí, siempre que la abras desde el mismo navegador y dispositivo. Igual conviene exportar un .json de tanto en tanto como respaldo.</p></details>
        <details><summary>El árbol se ve desordenado, ¿cómo lo acomodo?</summary><p>Tocá "Reordenar automático" — recalcula las posiciones para que las parejas y sus hijos queden centrados.</p></details>
        <details><summary>¿Puedo mover a una persona a mano?</summary><p>Sí, arrastrala en el dibujo. Si en algún momento se ve rara, "Reordenar automático" la acomoda sola.</p></details>
        <details><summary>Importé un archivo y algo se ve raro</summary><p>La app revisa el archivo al importarlo y corrige sola los problemas más comunes, avisándote qué corrigió.</p></details>
        <details><summary>¿Necesito internet para usarla?</summary><p>No, salvo la primera vez (para las tipografías). Después funciona sin conexión.</p></details>
      </div>
    </section>
  `;
}

function abrirDetalle(personaId){
  selectedId = personaId;
  const p = getPersona(personaId);
  if(!p) return;
  const dobles = calcularDobles();
  const d = dobles[personaId]||{esDoble:false,esYaciente:false,motivos:[]};
  const sims = similitudNotas()[personaId] || [];
  const color = p.sexo==="F" ? "var(--azul-nav)" : (p.sexo==="X" ? "var(--cobre)" : "var(--azul-oceano)");

  let badges = "";
  if(p.esProtagonista) badges += `<span class="badge muted">Protagonista</span>`;
  if(d.esYaciente) badges += `<span class="badge yaciente">Yaciente</span>`;
  else if(d.esDoble) badges += `<span class="badge doble">Doble</span>`;

  let motivosHtml = "";
  if(d.motivos.length){
    motivosHtml = `<fieldset><legend>Por qué es doble</legend><ul style="margin:0;padding-left:18px;font-size:12.5px;">${d.motivos.map(m=>`<li>${escapeHtml(m)}</li>`).join("")}</ul></fieldset>`;
  }

  const uniones = unionDePersona(personaId);
  let unionesHtml = "";
  if(uniones.length){
    unionesHtml = `<fieldset><legend>Parejas</legend>` + uniones.map(u=>{
      const otroId = u.personaA===personaId ? u.personaB : u.personaA;
      const otro = otroId ? getPersona(otroId) : null;
      const dur = u.fechaInicio ? `${formatFecha(u.fechaInicio)} — ${u.separado||u.fechaFin ? (formatFecha(u.fechaFin)||"?") : "presente"} (${edadOrDuracion(u.fechaInicio,u.fechaFin)} años)` : "";
      return `<div class="union-block">
        <div class="title">${otro?escapeHtml(nombreConAnio(otro)):"(pareja sin datos)"} ${u.separado?"· separados":""}</div>
        <div class="meta">${u.tipo==="matrimonio"?"Matrimonio":"Pareja"} ${dur?("· "+dur):""}</div>
        ${u.separado && u.motivoSeparacion ? `<div class="meta">Motivo separación: ${escapeHtml(u.motivoSeparacion)}</div>`:""}
        ${u.notas ? `<div class="meta" style="margin-top:4px;">${escapeHtml(u.notas)}</div>`:""}
        <div style="margin-top:6px;display:flex;gap:6px;">
          <button class="btn small ghost" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.editarUnion('${u.id}')">Editar</button>
        </div>
      </div>`;
    }).join("") + `</fieldset>`;
  }

  let sintomasHtml = (p.sintomas||[]).map(s=>`<span class="chip">${escapeHtml(s)}</span>`).join("") || `<span style="color:#a99;font-size:12px;">Sin síntomas cargados</span>`;

  let simHtml = "";
  if(sims.length){
    simHtml = `<fieldset><legend>Similitudes en notas</legend>` + sims.map(s=>{
      const otro = getPersona(s.otroId);
      return `<div class="note-card">
        <div class="who">${escapeHtml(nombreConAnio(otro))}</div>
        <div class="shared">Palabras en común: ${s.compartidas.slice(0,8).map(escapeHtml).join(", ")}</div>
      </div>`;
    }).join("") + `</fieldset>`;
  }

  const html = `
    <div class="panel-head">
      <h3>Ficha de persona</h3>
      <button class="close" onclick="OT.cerrarPanel()">×</button>
    </div>
    <div class="panel-body">
      <div class="detail-header">
        <div class="detail-avatar" style="background:${color};">${iniciales(p)}</div>
        <div>
          <div class="detail-name">${escapeHtml(nombreCompleto(p))||"(sin nombre)"}</div>
          <div class="detail-sub">${escapeHtml(p.ocupacion||"")}</div>
          <div class="detail-badges">${badges}</div>
        </div>
      </div>
      <dl class="kv">
        <dt>Nacimiento</dt><dd>${formatFecha(p.fNacExacta)||"—"} ${p.fNacProbable?`<br><span style="color:#8a7f6c;">Probable: ${formatFecha(p.fNacProbable)}</span>`:""} ${p.fNacDNI?`<br><span style="color:#8a7f6c;">Según DNI: ${formatFecha(p.fNacDNI)}</span>`:""}</dd>
        <dt>Lugar de nac.</dt><dd>${escapeHtml(lugarNacimientoTexto(p))||"—"}</dd>
        <dt>Fallecimiento</dt><dd>${tieneMuerte(p)?escapeHtml(textoMuerte(p)):"—"}</dd>
        ${tieneMuerte(p)?`<dt>Motivo de muerte</dt><dd>${escapeHtml(p.motivoMuerte)||"—"}</dd>`:""}
        <dt>Ocupación</dt><dd>${escapeHtml(p.ocupacion)||"—"}</dd>
        ${p.importante?`<dt>Dato importante</dt><dd><strong>${escapeHtml(p.importante)}</strong></dd>`:""}
      </dl>
      <fieldset><legend>Síntomas</legend><div class="chip-list">${sintomasHtml}</div></fieldset>
      ${p.notas ? `<fieldset><legend>Notas</legend><div style="font-size:12.5px;white-space:pre-wrap;">${escapeHtml(p.notas)}</div></fieldset>` : ""}
      ${motivosHtml}
      ${simHtml}
      ${unionesHtml}
    </div>
    <div class="panel-foot">
      <button class="btn ghost danger-light" style="border:1px solid var(--pergamino);" onclick="OT.eliminarPersona('${p.id}')">Eliminar</button>
      <button class="btn primary" onclick="OT.editarPersona('${p.id}')">Editar</button>
    </div>
  `;
  abrirPanel(html);
}

function formularioPersona(personaId){
  editingPersonaId = personaId || null;
  const p = personaId ? getPersona(personaId) : crearPersona({});
  const esNueva = !personaId;

  const sintomasChips = (p.sintomas||[]).map((s,i)=>`<span class="chip">${escapeHtml(s)}<button type="button" onclick="OT.quitarSintoma(${i})">×</button></span>`).join("");

  const html = `
    <div class="panel-head">
      <h3>${esNueva?"Nueva persona":"Editar persona"}</h3>
      <button class="close" onclick="OT.cerrarPanel()">×</button>
    </div>
    <div class="panel-body">
      <div class="field-row">
        <div class="field"><label>Nombre/s</label><input type="text" id="f-nombre" value="${escapeHtml(p.nombre)}"></div>
        <div class="field"><label>Apellido/s</label><input type="text" id="f-apellido" value="${escapeHtml(p.apellido)}"></div>
      </div>
      <div class="field">
        <label>Sexo</label>
        <select id="f-sexo">
          <option value="M" ${p.sexo==="M"?"selected":""}>Hombre</option>
          <option value="F" ${p.sexo==="F"?"selected":""}>Mujer</option>
          <option value="X" ${p.sexo==="X"?"selected":""}>Otro / prefiere no decir</option>
        </select>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="f-protagonista" ${p.esProtagonista?"checked":""}>
        <label for="f-protagonista">Es el/la protagonista del árbol ("Yo")</label>
      </div>

      <fieldset><legend>Fechas de nacimiento</legend>
        <div class="field"><label>Fecha exacta</label><input type="date" id="f-fnac" value="${p.fNacExacta}"></div>
        <div class="field"><label>Fecha probable (si no hay certeza)</label><input type="date" id="f-fnac-prob" value="${p.fNacProbable}"></div>
        <div class="field"><label>Fecha según DNI/documento</label><input type="date" id="f-fnac-dni" value="${p.fNacDNI}"><div class="hint">Se usa cuando difiere de la real/probable.</div></div>
      </fieldset>

      <fieldset><legend>Lugar de nacimiento</legend>
        <div class="field">
          <label>País</label>
          <select id="f-pais">
            <option value="">— Elegir país —</option>
            ${PAISES_ORDENADOS.map(pais=>`<option value="${escapeHtml(pais)}" ${p.paisNacimiento===pais?"selected":""}>${escapeHtml(pais)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>Provincia / Estado</label>
          <select id="f-provincia"><option value="">— Elegir —</option></select>
          <div class="hint" id="f-provincia-hint" style="display:none;">No tenemos un listado de provincias/estados para este país todavía: escribila en el campo de abajo.</div>
        </div>
        <div class="field"><label>Localidad</label><input type="text" id="f-localidad" value="${escapeHtml(p.localidadNacimiento || (!p.paisNacimiento ? p.lugarNacimiento : ""))}" placeholder="Ciudad, pueblo o barrio"></div>
      </fieldset>

      <fieldset><legend>Fallecimiento</legend>
        <div class="field"><label>Fecha de muerte (exacta)</label><input type="date" id="f-fmuerte" value="${p.fMuerte}"></div>
        <div class="field"><label>Año de muerte (si no se sabe la fecha exacta)</label><input type="number" id="f-fmuerte-anio" value="${escapeHtml(p.fMuerteAnioSolo)}" min="1000" max="9999" placeholder="ej. 1978"><div class="hint">Se usa solo si no completaste la fecha exacta de arriba.</div></div>
        <div class="checkbox-row">
          <input type="checkbox" id="f-fmuerte-probable" ${p.fMuerteProbable?"checked":""}>
          <label for="f-fmuerte-probable">Es una fecha/año probable (no se sabe con certeza)</label>
        </div>
        <div class="field"><label>Motivo de muerte</label><input type="text" id="f-motivo-muerte" value="${escapeHtml(p.motivoMuerte)}"></div>
      </fieldset>

      <div class="field"><label>Ocupación</label><input type="text" id="f-ocupacion" value="${escapeHtml(p.ocupacion)}"></div>

      <fieldset><legend>Síntomas</legend>
        <div class="chip-list" id="f-sintomas-list">${sintomasChips}</div>
        <div class="add-chip-row" style="margin-top:8px;">
          <input type="text" id="f-sintoma-nuevo" placeholder="Agregar síntoma…">
          <button type="button" class="btn small" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.agregarSintoma()">Agregar</button>
        </div>
      </fieldset>

      <div class="field"><label>Dato importante (se muestra destacado)</label><input type="text" id="f-importante" value="${escapeHtml(p.importante)}"></div>

      <div class="field"><label>Notas / historias</label><textarea id="f-notas">${escapeHtml(p.notas)}</textarea></div>

      <fieldset><legend>Doble (marca manual)</legend>
        <div class="checkbox-row">
          <input type="checkbox" id="f-doble-manual" ${p.dobleManual?"checked":""}>
          <label for="f-doble-manual">Marcar como doble manualmente</label>
        </div>
        <div class="field"><label>Nota / motivo</label><input type="text" id="f-doble-nota" value="${escapeHtml(p.dobleManualNota)}"></div>
      </fieldset>
    </div>
    <div class="panel-foot">
      <button class="btn ghost" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.cerrarPanel()">Cancelar</button>
      <button class="btn primary" onclick="OT.guardarPersona()">Guardar</button>
    </div>
  `;
  window.__ot_sintomas_temp = (p.sintomas||[]).slice();
  abrirPanel(html);
  document.getElementById("f-pais").value = p.paisNacimiento || "";
  wireCascadaUbicacion(p.paisNacimiento, p.provinciaNacimiento);
  document.getElementById("f-pais").addEventListener("change", (ev)=>wireCascadaUbicacion(ev.target.value, ""));
}

function wireCascadaUbicacion(pais, provinciaSeleccionada){
  const selProvincia = document.getElementById("f-provincia");
  const hint = document.getElementById("f-provincia-hint");
  const provincias = PROVINCIAS_POR_PAIS[pais];
  if(provincias && provincias.length){
    selProvincia.innerHTML = `<option value="">— Elegir —</option>` + provincias.map(pr=>`<option value="${escapeHtml(pr)}" ${provinciaSeleccionada===pr?"selected":""}>${escapeHtml(pr)}</option>`).join("");
    selProvincia.disabled = false;
    hint.style.display = "none";
  } else {
    selProvincia.innerHTML = `<option value="">— (sin listado para este país) —</option>`;
    selProvincia.disabled = !pais;
    hint.style.display = pais ? "block" : "none";
  }
}

/* ---------------------------------------------------------------------
   8. FORMULARIO DE UNIÓN / PAREJA
   --------------------------------------------------------------------- */
function formularioUnion(unionId){
  editingUnionId = unionId || null;
  const u = unionId ? getUnion(unionId) : crearUnion({});
  const esNueva = !unionId;

  const opciones = state.personas.map(p=>`<option value="${p.id}" ${u.personaA===p.id?"selected":""}>${escapeHtml(nombreConAnio(p))}</option>`).join("");
  const opcionesB = state.personas.map(p=>`<option value="${p.id}" ${u.personaB===p.id?"selected":""}>${escapeHtml(nombreConAnio(p))}</option>`).join("");

  const hijosActuales = (u.hijos||[]).filter(h=>h.tipo!=="aborto").map(h=>getPersona(h.id)).filter(Boolean);
  const abortosActuales = (u.hijos||[]).filter(h=>h.tipo==="aborto");
  const candidatosHijos = state.personas.filter(p=> !(u.hijos||[]).some(h=>h.id===p.id));

  const html = `
    <div class="panel-head">
      <h3>${esNueva?"Nueva pareja / unión":"Editar pareja / unión"}</h3>
      <button class="close" onclick="OT.cerrarPanel()">×</button>
    </div>
    <div class="panel-body">
      <div class="field-row">
        <div class="field"><label>Persona A</label><select id="fu-a"><option value="">— sin especificar —</option>${opciones}</select></div>
        <div class="field"><label>Persona B</label><select id="fu-b"><option value="">— sin especificar —</option>${opcionesB}</select></div>
      </div>
      <div class="field">
        <label>Tipo</label>
        <select id="fu-tipo">
          <option value="pareja" ${u.tipo==="pareja"?"selected":""}>Pareja</option>
          <option value="matrimonio" ${u.tipo==="matrimonio"?"selected":""}>Matrimonio</option>
        </select>
      </div>
      <div class="field-row">
        <div class="field"><label>Inicio</label><input type="date" id="fu-inicio" value="${u.fechaInicio}"></div>
        <div class="field"><label>Fin (si corresponde)</label><input type="date" id="fu-fin" value="${u.fechaFin}"></div>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="fu-separado" ${u.separado?"checked":""}>
        <label for="fu-separado">Separados / divorciados</label>
      </div>
      <div class="field"><label>Motivo de separación</label><input type="text" id="fu-motivo" value="${escapeHtml(u.motivoSeparacion)}"></div>
      <div class="field"><label>Notas de la pareja</label><textarea id="fu-notas">${escapeHtml(u.notas)}</textarea></div>

      <fieldset><legend>Hijos de esta unión</legend>
        <div class="chip-list" id="fu-hijos-list">
          ${hijosActuales.map(h=>`<span class="chip">${escapeHtml(nombreCompleto(h))}<button type="button" onclick="OT.quitarHijoUnion('${h.id}')">×</button></span>`).join("")}
          ${abortosActuales.map(a=>`<span class="chip" style="background:#e8d9c4;">Aborto${a.nota?": "+escapeHtml(a.nota):""}<button type="button" onclick="OT.quitarAbortoUnion('${a.id}')">×</button></span>`).join("")}
        </div>
        <div class="add-chip-row" style="margin-top:8px;">
          <select id="fu-hijo-select"><option value="">Agregar persona existente…</option>${candidatosHijos.map(p=>`<option value="${p.id}">${escapeHtml(nombreConAnio(p))}</option>`).join("")}</select>
          <button type="button" class="btn small" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.agregarHijoUnion()">Agregar</button>
        </div>
        <div class="add-chip-row" style="margin-top:8px;">
          <input type="text" id="fu-aborto-nota" placeholder="Nota de aborto (opcional)…">
          <button type="button" class="btn small" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.agregarAbortoUnion()">+ Aborto</button>
        </div>
        <div class="hint">Para agregar un/a hijo/a nuevo/a, primero creálo con "+ Persona" y luego sumalo acá.</div>
      </fieldset>
    </div>
    <div class="panel-foot">
      ${!esNueva?`<button class="btn ghost danger-light" style="border:1px solid var(--pergamino);" onclick="OT.eliminarUnion('${u.id}')">Eliminar unión</button>`:""}
      <button class="btn ghost" style="border:1px solid var(--pergamino);color:var(--tinta);" onclick="OT.cerrarPanel()">Cancelar</button>
      <button class="btn primary" onclick="OT.guardarUnion()">Guardar</button>
    </div>
  `;
  window.__ot_union_temp = JSON.parse(JSON.stringify(u.hijos||[]));
  abrirPanel(html);
}

/* ---------------------------------------------------------------------
   9. ACCIONES (expuestas en window.OT para los onclick inline)
   --------------------------------------------------------------------- */
const OT = {};
window.OT = OT;

OT.cerrarPanel = cerrarPanel;

OT.abrirGuia = function(){
  document.getElementById("guide-body").innerHTML = contenidoGuia();
  document.getElementById("guide-scrim").classList.add("show");
};
OT.cerrarGuia = function(){
  document.getElementById("guide-scrim").classList.remove("show");
};
document.getElementById("guide-scrim").addEventListener("click",(ev)=>{
  if(ev.target.id==="guide-scrim") OT.cerrarGuia();
});

OT.agregarSintoma = function(){
  const input = document.getElementById("f-sintoma-nuevo");
  const val = input.value.trim();
  if(!val) return;
  window.__ot_sintomas_temp.push(val);
  input.value = "";
  document.getElementById("f-sintomas-list").innerHTML = window.__ot_sintomas_temp.map((s,i)=>`<span class="chip">${escapeHtml(s)}<button type="button" onclick="OT.quitarSintoma(${i})">×</button></span>`).join("");
};
OT.quitarSintoma = function(i){
  window.__ot_sintomas_temp.splice(i,1);
  document.getElementById("f-sintomas-list").innerHTML = window.__ot_sintomas_temp.map((s,idx)=>`<span class="chip">${escapeHtml(s)}<button type="button" onclick="OT.quitarSintoma(${idx})">×</button></span>`).join("");
};

OT.guardarPersona = function(){
  const nombre = document.getElementById("f-nombre").value.trim();
  const apellido = document.getElementById("f-apellido").value.trim();
  if(!nombre && !apellido){ toast("Ingresá al menos un nombre o apellido"); return; }

  const esProtagonista = document.getElementById("f-protagonista").checked;

  const datos = {
    nombre, apellido,
    sexo: document.getElementById("f-sexo").value,
    fNacExacta: document.getElementById("f-fnac").value,
    fNacProbable: document.getElementById("f-fnac-prob").value,
    fNacDNI: document.getElementById("f-fnac-dni").value,
    paisNacimiento: document.getElementById("f-pais").value,
    provinciaNacimiento: document.getElementById("f-provincia").value,
    localidadNacimiento: document.getElementById("f-localidad").value.trim(),
    lugarNacimiento: [
      document.getElementById("f-localidad").value.trim(),
      document.getElementById("f-provincia").value,
      document.getElementById("f-pais").value
    ].filter(Boolean).join(", "),
    fMuerte: document.getElementById("f-fmuerte").value,
    fMuerteAnioSolo: document.getElementById("f-fmuerte-anio").value.trim(),
    fMuerteProbable: document.getElementById("f-fmuerte-probable").checked,
    motivoMuerte: document.getElementById("f-motivo-muerte").value.trim(),
    ocupacion: document.getElementById("f-ocupacion").value.trim(),
    sintomas: window.__ot_sintomas_temp.slice(),
    importante: document.getElementById("f-importante").value.trim(),
    notas: document.getElementById("f-notas").value,
    dobleManual: document.getElementById("f-doble-manual").checked,
    dobleManualNota: document.getElementById("f-doble-nota").value.trim(),
    esProtagonista
  };

  if(editingPersonaId){
    if(esProtagonista) state.personas.forEach(p=>{ if(p.id!==editingPersonaId) p.esProtagonista=false; });
    Object.assign(getPersona(editingPersonaId), datos);
    toast("Persona actualizada");
  } else {
    if(esProtagonista) state.personas.forEach(p=>p.esProtagonista=false);
    const nueva = crearPersona(datos);
    state.personas.push(nueva);
    toast("Persona agregada");
  }
  guardarEstado();
  renderArbol();
  cerrarPanel();
};

OT.editarPersona = function(id){ formularioPersona(id); };

OT.eliminarPersona = function(id){
  if(!confirm("¿Eliminar esta persona? También se quitará de las uniones donde participe.")) return;
  state.personas = state.personas.filter(p=>p.id!==id);
  state.uniones.forEach(u=>{
    if(u.personaA===id) u.personaA=null;
    if(u.personaB===id) u.personaB=null;
    u.hijos = u.hijos.filter(h=>h.id!==id);
  });
  state.personas.forEach(p=>{
    const u = p.unionPadresId?getUnion(p.unionPadresId):null;
    if(u && !u.personaA && !u.personaB && u.hijos.length<=1) { /* keep, harmless */ }
  });
  delete state.layout[id];
  guardarEstado();
  renderArbol();
  cerrarPanel();
  toast("Persona eliminada");
};

OT.editarUnion = function(id){ formularioUnion(id); };

OT.agregarHijoUnion = function(){
  const sel = document.getElementById("fu-hijo-select");
  const id = sel.value;
  if(!id) return;
  window.__ot_union_temp.push({tipo:"persona", id});
  refrescarChipsHijos();
  sel.value = "";
};
OT.agregarAbortoUnion = function(){
  const nota = document.getElementById("fu-aborto-nota").value.trim();
  window.__ot_union_temp.push({tipo:"aborto", id: uid("ab"), nota});
  document.getElementById("fu-aborto-nota").value="";
  refrescarChipsHijos();
};
OT.quitarHijoUnion = function(id){
  window.__ot_union_temp = window.__ot_union_temp.filter(h=>h.id!==id);
  refrescarChipsHijos();
};
OT.quitarAbortoUnion = function(id){
  window.__ot_union_temp = window.__ot_union_temp.filter(h=>h.id!==id);
  refrescarChipsHijos();
};
function refrescarChipsHijos(){
  const cont = document.getElementById("fu-hijos-list");
  cont.innerHTML = window.__ot_union_temp.map(h=>{
    if(h.tipo==="aborto") return `<span class="chip" style="background:#e8d9c4;">Aborto${h.nota?": "+escapeHtml(h.nota):""}<button type="button" onclick="OT.quitarAbortoUnion('${h.id}')">×</button></span>`;
    const per = getPersona(h.id);
    return `<span class="chip">${per?escapeHtml(nombreCompleto(per)):"?"}<button type="button" onclick="OT.quitarHijoUnion('${h.id}')">×</button></span>`;
  }).join("");
}

OT.guardarUnion = function(){
  const a = document.getElementById("fu-a").value || null;
  const b = document.getElementById("fu-b").value || null;
  if(!a && !b){ toast("Elegí al menos una persona"); return; }
  if(a && b && a===b){ toast("Elegí dos personas distintas"); return; }

  const datos = {
    personaA: a, personaB: b,
    tipo: document.getElementById("fu-tipo").value,
    fechaInicio: document.getElementById("fu-inicio").value,
    fechaFin: document.getElementById("fu-fin").value,
    separado: document.getElementById("fu-separado").checked,
    motivoSeparacion: document.getElementById("fu-motivo").value.trim(),
    notas: document.getElementById("fu-notas").value,
    hijos: window.__ot_union_temp.slice()
  };

  // Si es una unión nueva, chequear que no exista ya una unión entre esta
  // misma pareja (para evitar duplicados accidentales, p.ej. al cargar un
  // hijo desde "+ Pareja/unión" en lugar de editar la unión existente).
  let targetEditId = editingUnionId;
  if(!targetEditId && a && b){
    const mismaPareja = state.uniones.filter(x=>{
      const pares = [x.personaA, x.personaB].filter(Boolean).slice().sort();
      const nuevos = [a, b].filter(Boolean).slice().sort();
      return pares.length===nuevos.length && pares.every((id,i)=>id===nuevos[i]);
    });
    if(mismaPareja.length){
      const identica = mismaPareja.find(x=>x.tipo===datos.tipo && x.fechaInicio===datos.fechaInicio);
      if(identica){
        const irAEditar = confirm(
          "Ya existe una unión con el mismo tipo y la misma fecha entre estas dos personas — parece una duplicada.\n\n" +
          "Aceptar: editar esa unión existente (se le sumarán los hijos que agregaste acá) en lugar de crear otra.\n" +
          "Cancelar: crear igualmente una unión nueva y separada."
        );
        if(irAEditar) targetEditId = identica.id;
      } else {
        const seguir = confirm(
          "Ya existe otra unión cargada entre estas dos personas (por ejemplo, una relación anterior con distinta fecha o tipo).\n\n" +
          "¿Confirmás que querés agregar esta como una unión nueva y distinta?"
        );
        if(!seguir) return;
      }
    }
  }

  let union;
  if(targetEditId){
    union = getUnion(targetEditId);
    // limpiar unionPadresId de hijos previos que ya no están
    (union.hijos||[]).forEach(h=>{
      if(h.tipo==="persona" && !datos.hijos.some(nh=>nh.id===h.id)){
        const per = getPersona(h.id);
        if(per && per.unionPadresId===union.id) per.unionPadresId=null;
      }
    });
    // si veníamos de "crear nueva" pero redirigimos a una existente, sumamos
    // los hijos que ya tenía esa unión y que no estén en lo recién cargado
    (union.hijos||[]).forEach(h=>{
      if(!datos.hijos.some(nh=>nh.id===h.id && nh.tipo===h.tipo)) datos.hijos.push(h);
    });
    Object.assign(union, datos);
  } else {
    union = crearUnion(datos);
    state.uniones.push(union);
  }
  datos.hijos.forEach(h=>{
    if(h.tipo==="persona"){
      const per = getPersona(h.id);
      if(per) per.unionPadresId = union.id;
    }
  });

  guardarEstado();
  renderArbol();
  cerrarPanel();
  toast("Unión guardada");
};

OT.eliminarUnion = function(id){
  if(!confirm("¿Eliminar esta unión? Los hijos quedarán sin padres asignados.")) return;
  const u = getUnion(id);
  (u.hijos||[]).forEach(h=>{
    if(h.tipo==="persona"){
      const per = getPersona(h.id);
      if(per && per.unionPadresId===id) per.unionPadresId=null;
    }
  });
  state.uniones = state.uniones.filter(x=>x.id!==id);
  guardarEstado();
  renderArbol();
  cerrarPanel();
  toast("Unión eliminada");
};

/* ---------------------------------------------------------------------
   10. PERSISTENCIA
   --------------------------------------------------------------------- */
function guardarEstado(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){ console.warn("No se pudo guardar en localStorage", e); }
}

// Detecta uniones "gemelas" (misma pareja, mismo tipo, misma fecha de inicio)
// que hayan quedado duplicadas -por ejemplo, de versiones anteriores de la app
// donde se podía crear una unión nueva por error en vez de editar la existente-
// y las fusiona en una sola, combinando sus hijos. Devuelve cuántas fusionó.
function fusionarUnionesDuplicadas(){
  if(!state.uniones || !state.uniones.length) return 0;
  const grupos = new Map();
  state.uniones.forEach(u=>{
    const par = [u.personaA, u.personaB].filter(Boolean).slice().sort().join("|");
    if(!par) return; // ignorar uniones sin ninguna persona (no debería pasar)
    const clave = par + "::" + u.tipo + "::" + (u.fechaInicio||"");
    if(!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(u);
  });

  let fusionadas = 0;
  const aEliminar = new Set();
  grupos.forEach(grupo=>{
    if(grupo.length<2) return;
    // conservar la que tenga más hijos (o la primera si empatan)
    grupo.sort((x,y)=>(y.hijos||[]).length-(x.hijos||[]).length);
    const principal = grupo[0];
    for(let i=1;i<grupo.length;i++){
      const dup = grupo[i];
      (dup.hijos||[]).forEach(h=>{
        if(!(principal.hijos||[]).some(nh=>nh.id===h.id)){
          principal.hijos = principal.hijos||[];
          principal.hijos.push(h);
        }
      });
      if(!principal.notas && dup.notas) principal.notas = dup.notas;
      if(!principal.motivoSeparacion && dup.motivoSeparacion) principal.motivoSeparacion = dup.motivoSeparacion;
      if(dup.separado) principal.separado = true;
      aEliminar.add(dup.id);
      fusionadas++;
    }
  });

  if(aEliminar.size){
    state.uniones = state.uniones.filter(u=>!aEliminar.has(u.id));
    // reapuntar a los hijos que quedaron huérfanos de unionPadresId
    state.personas.forEach(p=>{
      if(p.unionPadresId && aEliminar.has(p.unionPadresId)){
        // buscar la unión principal que absorbió a esta
        for(const grupo of grupos.values()){
          if(grupo.length<2) continue;
          if(grupo.some(u=>u.id===p.unionPadresId)){
            p.unionPadresId = grupo[0].id;
            break;
          }
        }
      }
    });
  }
  return fusionadas;
}

// Chequea y repara automáticamente inconsistencias comunes en los datos
// (referencias a personas/uniones que ya no existen, vínculos padre-hijo/a
// rotos, más de un protagonista, etc.) -por ejemplo tras ediciones manuales
// del .json o bugs de versiones anteriores- y devuelve una lista de textos
// describiendo qué se corrigió.
function validarYRepararIntegridad(){
  const mensajes = [];
  const idsPersonas = new Set(state.personas.map(p=>p.id));
  const idsUniones = new Set(state.uniones.map(u=>u.id));

  let padresRotos = 0;
  state.personas.forEach(p=>{
    if(p.unionPadresId && !idsUniones.has(p.unionPadresId)){
      p.unionPadresId = null;
      padresRotos++;
    }
  });
  if(padresRotos) mensajes.push(`${padresRotos} vínculo${padresRotos>1?"s":""} a una unión de padres inexistente corregido${padresRotos>1?"s":""}`);

  let gemelosRotos = 0;
  state.personas.forEach(p=>{
    if(p.gemeloDe && !idsPersonas.has(p.gemeloDe)){
      p.gemeloDe = null;
      gemelosRotos++;
    }
  });
  if(gemelosRotos) mensajes.push(`${gemelosRotos} referencia${gemelosRotos>1?"s":""} de gemelo/a inexistente corregida${gemelosRotos>1?"s":""}`);

  let miembrosRotos = 0;
  state.uniones.forEach(u=>{
    if(u.personaA && !idsPersonas.has(u.personaA)){ u.personaA=null; miembrosRotos++; }
    if(u.personaB && !idsPersonas.has(u.personaB)){ u.personaB=null; miembrosRotos++; }
  });
  if(miembrosRotos) mensajes.push(`${miembrosRotos} integrante${miembrosRotos>1?"s":""} de unión inexistente corregido${miembrosRotos>1?"s":""}`);

  let hijosRotos = 0;
  state.uniones.forEach(u=>{
    if(!u.hijos) return;
    const antes = u.hijos.length;
    u.hijos = u.hijos.filter(h=>h.tipo==="aborto" || idsPersonas.has(h.id));
    hijosRotos += antes - u.hijos.length;
  });
  if(hijosRotos) mensajes.push(`${hijosRotos} hijo${hijosRotos>1?"s":""} con referencia inexistente quitado${hijosRotos>1?"s":""} de su unión`);

  const antesUniones = state.uniones.length;
  state.uniones = state.uniones.filter(u=>u.personaA || u.personaB || (u.hijos && u.hijos.length));
  const unionesVacias = antesUniones - state.uniones.length;
  if(unionesVacias) mensajes.push(`${unionesVacias} unión${unionesVacias>1?"es":""} vacía${unionesVacias>1?"s":""} eliminada${unionesVacias>1?"s":""}`);

  const protagonistas = state.personas.filter(p=>p.esProtagonista);
  if(protagonistas.length>1){
    protagonistas.slice(1).forEach(p=>p.esProtagonista=false);
    mensajes.push(`había ${protagonistas.length} personas marcadas como protagonista; se dejó solo a ${nombreCompleto(protagonistas[0])}`);
  }

  let vinculosReparados = 0;
  state.personas.forEach(p=>{
    if(!p.unionPadresId) return;
    const u = getUnion(p.unionPadresId);
    if(u && !(u.hijos||[]).some(h=>h.id===p.id)){
      u.hijos = u.hijos||[];
      u.hijos.push({tipo:"persona", id:p.id});
      vinculosReparados++;
    }
  });
  if(vinculosReparados) mensajes.push(`${vinculosReparados} vínculo${vinculosReparados>1?"s":""} padre/madre-hijo/a reconstruido${vinculosReparados>1?"s":""}`);

  return mensajes;
}

function cargarEstado(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.personas) {
        state = Object.assign({layout:{}}, parsed);
        const fusionadas = fusionarUnionesDuplicadas();
        const reparaciones = validarYRepararIntegridad();
        if(fusionadas>0 || reparaciones.length) guardarEstado();
        return true;
      }
    }
  }catch(e){ console.warn("No se pudo leer localStorage", e); }
  return false;
}

function exportarJSON(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `arbol-genealogico-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
  toast("Archivo exportado");
}

function importarJSON(file){
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const parsed = JSON.parse(e.target.result);
      if(!parsed.personas || !parsed.uniones) throw new Error("formato inválido");
      state = Object.assign({layout:{}}, parsed);
      const fusionadas = fusionarUnionesDuplicadas();
      const reparaciones = validarYRepararIntegridad();
      guardarEstado();
      renderArbol();
      const detalle = [];
      if(fusionadas>0) detalle.push(`${fusionadas} unión${fusionadas>1?"es":""} duplicada${fusionadas>1?"s":""} fusionada${fusionadas>1?"s":""}`);
      detalle.push(...reparaciones);
      toast(detalle.length ? `Árbol importado — se corrigió: ${detalle.join("; ")}` : "Árbol importado correctamente");
    }catch(err){
      alert("No se pudo leer el archivo. Verificá que sea un .json exportado desde esta app.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------------------
   11. DATOS DE EJEMPLO
   --------------------------------------------------------------------- */
function cargarEjemplo(){
  state = {version:1, personas:[], uniones:[], layout:{}};
  const P = (d)=>{ const per = crearPersona(d); state.personas.push(per); return per; };
  const U = (d)=>{ const u = crearUnion(d); state.uniones.push(u); return u; };

  const bisabueloA = P({nombre:"José", apellido:"Fernández", sexo:"M", fNacExacta:"1918-03-02", fMuerte:"1990-05-10", motivoMuerte:"Vejez", ocupacion:"Agricultor", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Santa Fe"});
  const bisabuelaA = P({nombre:"Rosa", apellido:"Gimenez", sexo:"F", fNacExacta:"1922-07-19", fMuerte:"1995-01-02", ocupacion:"Ama de casa", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Santa Fe"});
  const uBis1 = U({tipo:"matrimonio", personaA:bisabueloA.id, personaB:bisabuelaA.id, fechaInicio:"1940-06-01"});

  const bisabueloB = P({nombre:"Antonio", apellido:"Ríos", sexo:"M", fNacExacta:"1915-11-23", fMuerte:"1988-02-14", ocupacion:"Comerciante", paisNacimiento:"Argentina", provinciaNacimiento:"Córdoba", localidadNacimiento:"Córdoba"});
  const bisabuelaB = P({nombre:"Clara", apellido:"Molina", sexo:"F", fNacExacta:"1920-02-05", fMuerte:"2001-09-30", ocupacion:"Docente", paisNacimiento:"Argentina", provinciaNacimiento:"Córdoba", localidadNacimiento:"Córdoba"});
  const uBis2 = U({tipo:"matrimonio", personaA:bisabueloB.id, personaB:bisabuelaB.id, fechaInicio:"1938-04-10"});

  const abuelo = P({nombre:"Carlos", apellido:"Fernández", sexo:"M", fNacExacta:"1945-09-12", fMuerte:"2010-03-01", motivoMuerte:"Enfermedad cardíaca", ocupacion:"Ferroviario", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Rosario", unionPadresId:uBis1.id, notas:"Trabajó toda su vida en el ferrocarril. Le costaba mucho hablar de sentimientos."});
  uBis1.hijos.push({tipo:"persona", id:abuelo.id});

  const abuela = P({nombre:"Ester", apellido:"Ríos", sexo:"F", fNacExacta:"1948-01-30", fMuerte:"2015-11-20", ocupacion:"Enfermera", paisNacimiento:"Argentina", provinciaNacimiento:"Córdoba", localidadNacimiento:"Córdoba", unionPadresId:uBis2.id, notas:"Muy religiosa. Cuidó a sus padres hasta el final."});
  uBis2.hijos.push({tipo:"persona", id:abuela.id});

  const uAbuelos = U({tipo:"matrimonio", personaA:abuelo.id, personaB:abuela.id, fechaInicio:"1968-05-20"});

  const madre = P({nombre:"Silvina", apellido:"Fernández", sexo:"F", fNacExacta:"1972-04-14", ocupacion:"Contadora", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Rosario", unionPadresId:uAbuelos.id, importante:"Diagnóstico de hipertensión a los 45", sintomas:["Hipertensión","Migrañas"], notas:"Siempre cargó con el rol de cuidadora de la familia."});
  uAbuelos.hijos.push({tipo:"persona", id:madre.id});

  const padre = P({nombre:"Roberto", apellido:"Suárez", sexo:"M", fNacExacta:"1970-08-03", ocupacion:"Ingeniero", paisNacimiento:"Argentina", provinciaNacimiento:"Ciudad Autónoma de Buenos Aires", localidadNacimiento:"Buenos Aires", importante:"Migró solo a los 20 años"});

  const uPadres = U({tipo:"matrimonio", personaA:padre.id, personaB:madre.id, fechaInicio:"1995-02-14", separado:true, fechaFin:"2010-06-01", motivoSeparacion:"Distanciamiento gradual, diferencias de proyecto de vida", notas:"Se conocieron en la facultad."});

  const yo = P({nombre:"Martín", apellido:"Suárez", sexo:"M", fNacExacta:"1997-06-18", ocupacion:"Diseñador", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Rosario", esProtagonista:true, unionPadresId:uPadres.id, importante:"Protagonista del árbol", notas:"Empezó terapia en 2020 buscando entender patrones familiares repetidos."});
  uPadres.hijos.push({tipo:"persona", id:yo.id});

  const hermana = P({nombre:"Julia", apellido:"Suárez", sexo:"F", fNacExacta:"1999-10-02", ocupacion:"Médica", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Rosario", unionPadresId:uPadres.id});
  uPadres.hijos.push({tipo:"persona", id:hermana.id});

  // "doble" de ejemplo: pariente con nombre y fecha cercana al protagonista (yaciente, murió antes de que naciera "Yo")
  const tioDoble = P({nombre:"Martín", apellido:"Suárez", sexo:"M", fNacExacta:"1965-06-22", fMuerte:"1994-01-01", motivoMuerte:"Accidente", ocupacion:"Músico", paisNacimiento:"Argentina", provinciaNacimiento:"Ciudad Autónoma de Buenos Aires", localidadNacimiento:"Buenos Aires", notas:"Se fue de la casa joven y nunca más lo mencionaron en las reuniones familiares. Repetía patrones que nadie en la familia quería nombrar."});

  // pareja del protagonista
  const pareja1 = P({nombre:"Lucía", apellido:"Vega", sexo:"F", fNacExacta:"1998-03-11", ocupacion:"Fotógrafa", paisNacimiento:"Argentina", provinciaNacimiento:"Santa Fe", localidadNacimiento:"Rosario"});
  U({personaA:yo.id, personaB:pareja1.id, tipo:"pareja", fechaInicio:"2018-01-01", fechaFin:"2021-05-01", separado:true, motivoSeparacion:"Proyectos de vida distintos", notas:"Primera relación larga."});

  guardarEstado();
  renderArbol();
  toast("Ejemplo cargado");
}

/* ---------------------------------------------------------------------
   12. ZOOM / PAN
   --------------------------------------------------------------------- */
function centrarVista(){
  const svg = document.getElementById("tree-svg");
  const rect = svg.getBoundingClientRect();
  if(!state.personas.length){ viewBox={x:0,y:0,w:rect.width||1200,h:rect.height||800}; aplicarTransformCanvas(); return; }
  const {pos} = calcularLayout();
  const xs = Object.values(pos).map(p=>p.x), ys = Object.values(pos).map(p=>p.y);
  const minX=Math.min(...xs)-120, maxX=Math.max(...xs)+120;
  const minY=Math.min(...ys)-100, maxY=Math.max(...ys)+140;
  viewBox = {x:minX,y:minY,w:Math.max(maxX-minX, 400), h:Math.max(maxY-minY,300)};
  aplicarTransformCanvas();
}

function initZoomPan(){
  const svg = document.getElementById("tree-svg");
  svg.addEventListener("wheel",(ev)=>{
    ev.preventDefault();
    const factor = ev.deltaY>0 ? 1.08 : 0.92;
    zoom(factor, ev.clientX, ev.clientY);
  }, {passive:false});

  let panning=false, lastX,lastY;
  svg.addEventListener("mousedown",(ev)=>{
    if(ev.target.closest(".nodo")) return;
    panning=true; lastX=ev.clientX; lastY=ev.clientY;
    svg.classList.add("grabbing");
  });
  window.addEventListener("mousemove",(ev)=>{
    if(!panning) return;
    const rect = svg.getBoundingClientRect();
    const scale = viewBox.w/rect.width;
    viewBox.x -= (ev.clientX-lastX)*scale;
    viewBox.y -= (ev.clientY-lastY)*scale;
    lastX=ev.clientX; lastY=ev.clientY;
    aplicarTransformCanvas();
  });
  window.addEventListener("mouseup",()=>{ panning=false; svg.classList.remove("grabbing"); });

  // --- soporte táctil: un dedo para mover el árbol, dos dedos (pinch) para zoom ---
  let touchPanning = false, touchLastX = 0, touchLastY = 0;
  let pinchStartDist = null, pinchStartW = 0, pinchStartH = 0, pinchStartX = 0, pinchStartY = 0, pinchMidClient = null;

  function distanciaTouch(t0, t1){
    return Math.hypot(t1.clientX-t0.clientX, t1.clientY-t0.clientY);
  }

  svg.addEventListener("touchstart",(ev)=>{
    if(ev.touches.length===1){
      if(ev.target.closest(".nodo") || ev.target.closest(".union-connector")) return; // dejar que el toque abra la ficha
      touchPanning = true;
      touchLastX = ev.touches[0].clientX;
      touchLastY = ev.touches[0].clientY;
    } else if(ev.touches.length===2){
      touchPanning = false;
      pinchStartDist = distanciaTouch(ev.touches[0], ev.touches[1]);
      pinchStartW = viewBox.w; pinchStartH = viewBox.h;
      pinchStartX = viewBox.x; pinchStartY = viewBox.y;
      pinchMidClient = {
        x:(ev.touches[0].clientX+ev.touches[1].clientX)/2,
        y:(ev.touches[0].clientY+ev.touches[1].clientY)/2
      };
    }
  }, {passive:true});

  svg.addEventListener("touchmove",(ev)=>{
    if(ev.touches.length===1 && touchPanning){
      ev.preventDefault();
      const rect = svg.getBoundingClientRect();
      const scale = viewBox.w/rect.width;
      const t = ev.touches[0];
      viewBox.x -= (t.clientX-touchLastX)*scale;
      viewBox.y -= (t.clientY-touchLastY)*scale;
      touchLastX = t.clientX; touchLastY = t.clientY;
      aplicarTransformCanvas();
    } else if(ev.touches.length===2 && pinchStartDist){
      ev.preventDefault();
      const newDist = Math.max(distanciaTouch(ev.touches[0], ev.touches[1]), 1);
      const factor = pinchStartDist / newDist;
      const rect = svg.getBoundingClientRect();
      const cx = (pinchMidClient.x-rect.left)/rect.width;
      const cy = (pinchMidClient.y-rect.top)/rect.height;
      const newW = Math.min(Math.max(pinchStartW*factor, 300), 6000);
      const newH = newW * (pinchStartH/pinchStartW);
      viewBox.x = pinchStartX + (pinchStartW-newW)*cx;
      viewBox.y = pinchStartY + (pinchStartH-newH)*cy;
      viewBox.w = newW; viewBox.h = newH;
      aplicarTransformCanvas();
    }
  }, {passive:false});

  function terminarToque(ev){
    if(ev.touches.length===0){
      touchPanning = false;
      pinchStartDist = null;
    } else if(ev.touches.length===1){
      // si se levanta un dedo durante un pinch, seguir paneando con el que queda
      pinchStartDist = null;
      touchPanning = true;
      touchLastX = ev.touches[0].clientX;
      touchLastY = ev.touches[0].clientY;
    }
  }
  svg.addEventListener("touchend", terminarToque);
  svg.addEventListener("touchcancel", terminarToque);

  document.getElementById("zoom-in").addEventListener("click",()=>zoom(0.85));
  document.getElementById("zoom-out").addEventListener("click",()=>zoom(1.15));
  document.getElementById("zoom-reset").addEventListener("click",centrarVista);
}
function zoom(factor, clientX, clientY){
  const svg = document.getElementById("tree-svg");
  const rect = svg.getBoundingClientRect();
  const cx = clientX!==undefined ? (clientX-rect.left)/rect.width : 0.5;
  const cy = clientY!==undefined ? (clientY-rect.top)/rect.height : 0.5;
  const newW = Math.min(Math.max(viewBox.w*factor, 300), 6000);
  const newH = newW * (viewBox.h/viewBox.w);
  viewBox.x += (viewBox.w-newW)*cx;
  viewBox.y += (viewBox.h-newH)*cy;
  viewBox.w = newW; viewBox.h = newH;
  aplicarTransformCanvas();
}

/* ---------------------------------------------------------------------
   12b. BÚSQUEDA, RESALTADO, EXPORTAR IMAGEN, IMPRIMIR
   --------------------------------------------------------------------- */
function centrarEnPersona(id){
  const per = getPersona(id);
  if(!per) return;
  const {pos} = calcularLayout();
  if(!pos[id]) return;
  const PADX = 90, PADY = 70;
  const x = pos[id].x + PADX, y = pos[id].y + PADY;
  const w = Math.min(viewBox.w || 900, 700);
  const aspecto = (viewBox.h||800) / (viewBox.w||1200);
  const h = w * aspecto;
  viewBox = {x: x-w/2, y: y-h/2, w, h};
  aplicarTransformCanvas();
  resaltarNodoTemporal(id);
}

function resaltarNodoTemporal(id){
  const el = document.querySelector(`.nodo[data-id="${id}"]`);
  if(!el) return;
  el.classList.remove("resaltado-busqueda");
  // forzar reflow para poder re-disparar la animación si ya se había usado
  void el.offsetWidth;
  el.classList.add("resaltado-busqueda");
  setTimeout(()=>el.classList.remove("resaltado-busqueda"), 2300);
}

function wireBusqueda(){
  const input = document.getElementById("search-input");
  const resultsBox = document.getElementById("search-results");
  if(!input || !resultsBox) return;

  function actualizar(){
    const q = normalizar(input.value);
    if(!q){ resultsBox.classList.remove("show"); resultsBox.innerHTML=""; return; }
    const matches = state.personas.filter(p=>normalizar(nombreCompleto(p)).includes(q)).slice(0,8);
    if(!matches.length){
      resultsBox.innerHTML = `<div class="search-empty">Sin resultados</div>`;
    } else {
      resultsBox.innerHTML = matches.map(p=>`<div class="search-item" data-id="${p.id}">${escapeHtml(nombreConAnio(p))}</div>`).join("");
    }
    resultsBox.classList.add("show");
  }

  input.addEventListener("input", actualizar);
  input.addEventListener("focus", ()=>{ if(input.value.trim()) actualizar(); });
  resultsBox.addEventListener("mousedown",(ev)=>{
    const item = ev.target.closest(".search-item");
    if(!item) return;
    centrarEnPersona(item.getAttribute("data-id"));
    resultsBox.classList.remove("show");
    input.value = "";
    input.blur();
  });
  input.addEventListener("keydown",(ev)=>{
    if(ev.key==="Enter"){
      const first = resultsBox.querySelector(".search-item");
      if(first){
        centrarEnPersona(first.getAttribute("data-id"));
        resultsBox.classList.remove("show");
        input.value = "";
        input.blur();
      }
    } else if(ev.key==="Escape"){
      resultsBox.classList.remove("show");
      input.blur();
    }
  });
  document.addEventListener("click",(ev)=>{
    if(!ev.target.closest("#search-box")) resultsBox.classList.remove("show");
  });
}

function toggleResaltarEspeciales(){
  const svg = document.getElementById("tree-svg");
  const btn = document.getElementById("btn-highlight");
  const activo = svg.classList.toggle("resaltar-especiales");
  if(btn) btn.classList.toggle("active", activo);
  toast(activo ? "Mostrando solo dobles y yacientes" : "Resaltado desactivado");
}

function vistaImprimible(){
  centrarVista();
  setTimeout(()=>window.print(), 60);
}

function exportarImagenPNG(){
  const svg = document.getElementById("tree-svg");
  const gRoot = document.getElementById("g-root");
  if(!gRoot || !state.personas.length){ toast("No hay árbol para exportar"); return; }

  let bbox;
  try{ bbox = gRoot.getBBox(); }catch(e){ toast("No se pudo generar la imagen"); return; }
  const pad = 50;
  const w = Math.max(bbox.width + pad*2, 200);
  const h = Math.max(bbox.height + pad*2, 200);

  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", w);
  clone.setAttribute("height", h);
  clone.setAttribute("viewBox", `${bbox.x-pad} ${bbox.y-pad} ${w} ${h}`);
  clone.classList.remove("resaltar-especiales");

  // fondo marfil + estilos de la app (colores/fuentes) embebidos para que
  // la imagen resultante se vea igual que en pantalla
  const estiloOriginal = document.querySelector("style") ? document.querySelector("style").textContent : "";
  const styleTag = document.createElementNS(NS, "style");
  styleTag.textContent = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');\n` + estiloOriginal;
  const defs = document.createElementNS(NS, "defs");
  defs.appendChild(styleTag);
  clone.insertBefore(defs, clone.firstChild);

  const bg = svgEl("rect", {x:bbox.x-pad, y:bbox.y-pad, width:w, height:h, fill:"#FFF8E8"});
  clone.insertBefore(bg, defs.nextSibling);

  const svgData = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = function(){
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = w*scale; canvas.height = h*scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#FFF8E8";
    ctx.fillRect(0,0,w,h);
    ctx.drawImage(img,0,0,w,h);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob=>{
      if(!blob){ toast("No se pudo generar la imagen"); return; }
      const a = document.createElement("a");
      const fecha = new Date().toISOString().slice(0,10);
      a.href = URL.createObjectURL(blob);
      a.download = `arbol-genealogico-${fecha}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
      toast("Imagen exportada");
    }, "image/png");
  };
  img.onerror = function(){
    URL.revokeObjectURL(url);
    toast("No se pudo generar la imagen (probá con 'Vista imprimible' como alternativa)");
  };
  img.src = url;
}

/* ---------------------------------------------------------------------
   13. INIT
   --------------------------------------------------------------------- */
function wireToolbar(){
  document.getElementById("btn-add-persona").addEventListener("click",()=>formularioPersona(null));
  document.getElementById("btn-add-union").addEventListener("click",()=>formularioUnion(null));
  document.getElementById("btn-autolayout").addEventListener("click",()=>{
    state.layout = {};
    guardarEstado();
    renderArbol();
    centrarVista();
    toast("Posiciones reordenadas");
  });
  document.getElementById("btn-highlight").addEventListener("click", toggleResaltarEspeciales);
  document.getElementById("btn-export-imagen").addEventListener("click", exportarImagenPNG);
  document.getElementById("btn-print").addEventListener("click", vistaImprimible);
  document.getElementById("btn-guia").addEventListener("click", OT.abrirGuia);
  document.getElementById("btn-export").addEventListener("click", exportarJSON);
  document.getElementById("btn-import").addEventListener("click", ()=>document.getElementById("file-import").click());
  document.getElementById("file-import").addEventListener("change",(ev)=>{
    const file = ev.target.files[0];
    if(file) importarJSON(file);
    ev.target.value = "";
  });
  document.getElementById("btn-reset").addEventListener("click",()=>{
    if(!confirm("¿Vaciar todo el árbol? Esta acción no se puede deshacer (pero podés exportar antes).")) return;
    state = {version:1, personas:[], uniones:[], layout:{}};
    guardarEstado();
    renderArbol();
    toast("Árbol vaciado");
  });

  // menú "Más": agrupa las acciones menos frecuentes para que la barra
  // entre en una sola fila y le deje más espacio al árbol.
  const moreBtn = document.getElementById("btn-more");
  const moreMenu = document.getElementById("more-menu");
  moreBtn.addEventListener("click",(ev)=>{
    ev.stopPropagation();
    const abierto = moreMenu.classList.toggle("show");
    moreBtn.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  moreMenu.querySelectorAll(".dropdown-item").forEach(item=>{
    item.addEventListener("click", ()=>{
      moreMenu.classList.remove("show");
      moreBtn.setAttribute("aria-expanded","false");
    });
  });
  document.addEventListener("click",(ev)=>{
    if(!ev.target.closest("#more-dropdown")) {
      moreMenu.classList.remove("show");
      moreBtn.setAttribute("aria-expanded","false");
    }
  });
}

function init(){
  const logoImg = document.getElementById("logo-img");
  logoImg.src = "data:image/png;base64," + window.__OT_LOGO_B64__;
  document.documentElement.style.setProperty("--logo-watermark", `url(data:image/png;base64,${window.__OT_LOGO_NAVY_B64__})`);

  wireToolbar();
  initZoomPan();
  wireBusqueda();

  const habiaGuardado = cargarEstado();
  if(habiaGuardado && state.personas.length>0){
    renderArbol();
    centrarVista();
  } else {
    document.getElementById("welcome-modal").classList.add("show");
  }

  document.getElementById("btn-load-example").addEventListener("click",()=>{
    document.getElementById("welcome-modal").classList.remove("show");
    cargarEjemplo();
    centrarVista();
  });
  document.getElementById("btn-start-empty").addEventListener("click",()=>{
    document.getElementById("welcome-modal").classList.remove("show");
    renderArbol();
  });
}

document.addEventListener("DOMContentLoaded", init);

})();
