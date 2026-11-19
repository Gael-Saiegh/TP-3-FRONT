const URL_BASE = "https://www.thesportsdb.com/api/v1/json/"
const CLAVE = "123"   // esta es la clave de la api
let equipos = []    

const ligas = {
  "Premier League": "English Premier League",
  "La Liga": "Spanish La Liga",
  "Serie A": "Italian Serie A",
  "Bundesliga": "German Bundesliga",
  "Ligue 1": "French Ligue 1"
}

const logosLigas = {
  "English Premier League": "premierleague.png",
  "Spanish La Liga": "LaLiga.png",
  "Italian Serie A": "serieA.png",
  "German Bundesliga": "bundesliga.png",
  "French Ligue 1": "LigueOne.png"
}

const buscador = document.getElementById("buscador")
const filtroLiga = document.getElementById("filtroLiga")
const ordenar = document.getElementById("ordenar")
const mensaje = document.getElementById("mensaje")
const equiposContainer = document.getElementById("equiposContainer")
const agregarEquipoForm = document.getElementById("agregarEquipoForm")

// 3. Cambio de nombre de la variable
const archivoImagen = document.getElementById("logo")

function llenarLigas() {
  for (const nombre in ligas) {
    filtroLiga.innerHTML += `<option value="${ligas[nombre]}">${nombre}</option>`
  }
}

/*para pedir los equipos de las ligas a la api*/
function cargarEquipos(liga) {
  mensaje.textContent = "Cargando equipos..."

  const nombreLiga = liga.replaceAll(" ", "_")  

  fetch(URL_BASE + CLAVE + "/search_all_teams.php?l=" + nombreLiga)
    .then(response => response.json())
    .then(respuesta => {
      console.log(respuesta)   

      if (!respuesta.teams) {
        equipos = []
        mostrarEquipos(equipos)
        mensaje.textContent = "No se encontraron equipos"
        return
      }

      equipos = respuesta.teams
      mensaje.textContent = ""
      aplicarFiltros()
    })
    .catch(error => {
      console.error("Error al traer los equipos:", error)
      mensaje.textContent = "No se pudo conectar con la API"
    })
}

/*para dibujar las card de los equipos*/
function mostrarEquipos(lista) {
  equiposContainer.innerHTML = ""
  
  const logoLigaActual = logosLigas[filtroLiga.value] || ""

  lista.forEach(equipo => {
    equiposContainer.innerHTML += `
      <article class="card">
        ${logoLigaActual ? `<img src="${logoLigaActual}" alt="Logo de la liga" class="logo-liga">` : ""}
        ${equipo.strBadge ? `<img src="${equipo.strBadge}" alt="Escudo de ${equipo.strTeam}" class="escudo-equipo">` : ""}
        <h2>${equipo.strTeam}</h2>
        <p>Estadio: ${equipo.strStadium}</p>
        <p>Fundado: ${equipo.intFormedYear}</p>
        <p>${equipo.strCountry}</p>
      </article>
    `
  })
}

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase()

  // 2. Uso de filter() para limpiar el texto
  // (Se mantiene el filter principal de equipos y adentro usamos filter para limpiar)
  const filtrados = equipos.filter(equipo => {
    const nombreLimpio = [equipo.strTeam].filter(Boolean)[0].toLowerCase()
    const estadioLimpio = [equipo.strStadium].filter(Boolean)[0]?.toLowerCase() || ""
    
    return (
      nombreLimpio.includes(texto) ||
      estadioLimpio.includes(texto)   
    )
  })

  if (ordenar.value === "nombre") {
    filtrados.sort((a, b) => a.strTeam.localeCompare(b.strTeam))
  } else {
    filtrados.sort((a, b) => Number(a.intFormedYear) - Number(b.intFormedYear))
  }

  mostrarEquipos(filtrados)
}

buscador.addEventListener("input", aplicarFiltros)
ordenar.addEventListener("change", aplicarFiltros)

filtroLiga.addEventListener("change", () => {
  cargarEquipos(filtroLiga.value)
})

/*agregar un equipo*/
agregarEquipoForm.addEventListener("submit", (event) => {
  event.preventDefault()

  // 1. Uso de un if para el archivo en lugar de la función interna
  if (archivoImagen.files[0]) {
    const lector = new FileReader()
    lector.onload = (e) => {
      equipos.push({
        strTeam: event.target.nombre.value,
        strStadium: event.target.estadio.value,
        intFormedYear: "-",
        strBadge: e.target.result,
        strCountry: event.target.pais.value
      })
      aplicarFiltros()
      event.target.reset()
    }
    lector.readAsDataURL(archivoImagen.files[0])
  } else {
    equipos.push({
      strTeam: event.target.nombre.value,
      strStadium: event.target.estadio.value,
      intFormedYear: "-",
      strBadge: "",
      strCountry: event.target.pais.value
    })
    aplicarFiltros()
    event.target.reset()
  }
})

llenarLigas()
cargarEquipos(filtroLiga.value)