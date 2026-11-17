const URL_BASE = "https://www.thesportsdb.com/api/v1/json/"
const CLAVE = "3"   // clave gratuita de prueba de la API
let equipos = []    // aca se guardan los equipos que trae la API

// nombre que se muestra : nombre que entiende la API
const ligas = {
  "Premier League": "English Premier League",
  "La Liga": "Spanish La Liga",
  "Serie A": "Italian Serie A",
  "Bundesliga": "German Bundesliga",
  "Ligue 1": "French Ligue 1"
}

// elementos del html
const buscador = document.getElementById("buscador")
const filtroLiga = document.getElementById("filtroLiga")
const ordenar = document.getElementById("ordenar")
const mensaje = document.getElementById("mensaje")
const equiposContainer = document.getElementById("equiposContainer")
const agregarEquipoForm = document.getElementById("agregarEquipoForm")


// arma las opciones del select a partir del objeto ligas
function llenarLigas() {
  Object.keys(ligas).forEach(nombre => {
    filtroLiga.innerHTML += `<option value="${ligas[nombre]}">${nombre}</option>`
  })
}


// pide los equipos de una liga a la API
function cargarEquipos(liga) {
  mensaje.textContent = "Cargando equipos..."

  const nombreLiga = liga.replaceAll(" ", "_")   // la API usa guion bajo en vez de espacios

  fetch(URL_BASE + CLAVE + "/search_all_teams.php?l=" + nombreLiga)
    .then(response => response.json())
    .then(respuesta => {
      console.log(respuesta)   // para ver en la consola como viene la respuesta

      // si no viene la lista, esa liga no devolvio equipos
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


// dibuja las tarjetas
function mostrarEquipos(lista) {
  equiposContainer.innerHTML = ""

  lista.forEach(equipo => {
    equiposContainer.innerHTML += `
      <article class="card">
        ${equipo.strTeamBadge ? `<img src="${equipo.strTeamBadge}" alt="Escudo de ${equipo.strTeam}">` : ""}
        <h2>${equipo.strTeam}</h2>
        <p>Estadio: ${equipo.strStadium}</p>
        <p>Fundado: ${equipo.intFormedYear}</p>
        <p>${equipo.strCountry}</p>
      </article>
    `
  })
}


// aplica el buscador y el orden al mismo tiempo
function aplicarFiltros() {
  const texto = buscador.value.toLowerCase()

  const filtrados = equipos.filter(equipo => {
    return (
      equipo.strTeam.toLowerCase().includes(texto) ||
      (equipo.strStadium || "").toLowerCase().includes(texto)   // si no tiene estadio usa texto vacio
    )
  })

  // ordena segun lo elegido
  if (ordenar.value === "nombre") {
    filtrados.sort((a, b) => a.strTeam.localeCompare(b.strTeam))
  } else {
    filtrados.sort((a, b) => Number(a.intFormedYear) - Number(b.intFormedYear))
  }

  mostrarEquipos(filtrados)
}


// eventos
buscador.addEventListener("input", aplicarFiltros)
ordenar.addEventListener("change", aplicarFiltros)

// al cambiar de liga se vuelve a pedir a la API
filtroLiga.addEventListener("change", () => {
  cargarEquipos(filtroLiga.value)
})

//