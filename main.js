const URL_BASE = "https://api.football-data.org/v4"
const TOKEN = "PEGA_TU_TOKEN_ACA"   // el token que te llega por mail al registrarte
let equipos = []                    // aca se guardan los equipos que trae la API

// elementos del html
const buscador = document.getElementById("buscador")
const filtroCompeticion = document.getElementById("filtroCompeticion")
const filtroPais = document.getElementById("filtroPais")
const mensaje = document.getElementById("mensaje")
const equiposContainer = document.getElementById("equiposContainer")
const agregarEquipoForm = document.getElementById("agregarEquipoForm")


// pide los equipos de una liga a la API (codigo = PL, PD, etc)
function cargarEquipos(codigo) {
  mensaje.textContent = "Cargando equipos..."

  fetch(URL_BASE + "/competitions/" + codigo + "/teams", {
    headers: { "X-Auth-Token": TOKEN }   // la API pide el token en este header
  })
    .then(response => response.json())
    .then(respuesta => {
      console.log(respuesta)   // para ver en la consola como viene la respuesta

      // si no viene la lista, la API devolvio un error
      if (!respuesta.teams) {
        mensaje.textContent = "Error de la API: " + respuesta.message
        return
      }

      equipos = respuesta.teams
      mensaje.textContent = ""
      llenarPaises(equipos)
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
        ${equipo.crest ? `<img src="${equipo.crest}" alt="Escudo de ${equipo.name}">` : ""}
        <h2>${equipo.name}</h2>
        <p>Estadio: ${equipo.venue}</p>
        <p>Fundado: ${equipo.founded}</p>
        <p>${equipo.area.name}</p>
      </article>
    `
  })
}


// carga el select de paises con los que aparecen en los equipos (sin repetir)
function llenarPaises(lista) {
  filtroPais.innerHTML = `<option value="">Todos los paises</option>`

  const paises = []

  lista.forEach(equipo => {
    if (!paises.includes(equipo.area.name)) {
      paises.push(equipo.area.name)
    }
  })

  paises.forEach(pais => {
    filtroPais.innerHTML += `<option value="${pais}">${pais}</option>`
  })
}


// aplica el buscador y el filtro de pais al mismo tiempo
function aplicarFiltros() {
  const texto = buscador.value.toLowerCase()
  const pais = filtroPais.value

  const filtrados = equipos.filter(equipo => {
    const coincideTexto =
      equipo.name.toLowerCase().includes(texto) ||
      (equipo.venue || "").toLowerCase().includes(texto)   // si no tiene estadio usa texto vacio
    const coincidePais = pais === "" || equipo.area.name === pais

    return coincideTexto && coincidePais
  })

  mostrarEquipos(filtrados)
}


// eventos
buscador.addEventListener("input", aplicarFiltros)
filtroPais.addEventListener("change", aplicarFiltros)

// al cambiar de liga se vuelve a pedir a la API
filtroCompeticion.addEventListener("change", () => {
  cargarEquipos(filtroCompeticion.value)
})

// agrega un equipo a mano (solo queda en la pagina, no en la API)
agregarEquipoForm.addEventListener("submit", (event) => {
  event.preventDefault()

  const nuevoEquipo = {
    name: event.target.nombre.value,
    venue: event.target.estadio.value,
    founded: "-",
    crest: "",
    area: { name: event.target.pais.value }
  }

  equipos.push(nuevoEquipo)
  llenarPaises(equipos)
  aplicarFiltros()
  event.target.reset()
})


// al abrir la pagina carga la liga que esta seleccionada
cargarEquipos(filtroCompeticion.value)