// ---------- 1. Variables ----------

// 🟩 nombres que elegís vos
const URL_BASE = "https://prod-main-api-704464-00tre1p1erm.compute.instacloud-edge.com/api/v1"  // ⚙️ Base URL de tu captura
let chistes = []   // 🟪 array vacío: acá guardamos los datos cuando llegan de la API

const buscador = document.getElementById("buscador")                     // 🟪 agarra el elemento del HTML por su id
const filtroCategoria = document.getElementById("filtroCategoria")
const chistesContainer = document.getElementById("chistesContainer")
const agregarChisteForm = document.getElementById("agregarChisteForm")


// ---------- 2. Traer los datos de la API ----------

fetch(URL_BASE + "/public/randomjokes")   // 🟥 endpoint de LISTA: confirmalo probándolo en la página de la captura
  .then(response => response.json())      // 🟪 convierte la respuesta en un objeto JS
  .then(respuesta => {
    console.log(respuesta)                // 🟨 mirá esto en la consola (F12) para ver la forma real de los datos
    chistes = respuesta.data.data         // 🟥 ajustá según lo que veas en la consola
    llenarCategorias(chistes)             // 🟦 función del bloque 4
    mostrarChistes(chistes)               // 🟦 función del bloque 3
  })
  .catch(error => {
    console.error("Error al traer los chistes:", error)
  })


// ---------- 3. Mostrar la lista ----------

function mostrarChistes(lista) {            // 🟦 función; 🟩 nombre elegido por vos
  chistesContainer.innerHTML = ""           // 🟪 vacía el contenedor para no duplicar tarjetas

  lista.forEach(chiste => {                 // 🟪 chiste = cada elemento del array
    chistesContainer.innerHTML += `
      <article class="card">
        <p>${chiste.content}</p>
        <ul>
          ${chiste.categories.map(cat => `<li>${cat}</li>`).join("")}
        </ul>
      </article>
    `                                       // 🟨 content y categories vienen de la API
  })
}


// ---------- 4. Llenar el select de categorias ----------

function llenarCategorias(lista) {          // 🟦
  const categorias = []                     // 🟩 acá juntamos las categorias sin repetir

  lista.forEach(chiste => {
    chiste.categories.forEach(cat => {      // 🟨 recorre el array de categorias de cada chiste
      if (!categorias.includes(cat)) {      // 🟪 si todavía no la guardamos...
        categorias.push(cat)                // ...la agregamos
      }
    })
  })

  categorias.forEach(cat => {
    filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`
  })
}


// ---------- 5. Buscar y filtrar juntos ----------

function aplicarFiltros() {                 // 🟦
  const texto = buscador.value.toLowerCase()   // 🟪 lo que escribió, en minúscula
  const categoria = filtroCategoria.value      // ⚙️ "" si eligió "Todas las categorias"

  const filtrados = chistes.filter(chiste => {
    const coincideTexto = chiste.content.toLowerCase().includes(texto)
    const coincideCategoria = categoria === "" || chiste.categories.includes(categoria)  // 🟪 "" = no filtrar

    return coincideTexto && coincideCategoria  // 🟪 tienen que cumplirse las DOS
  })

  mostrarChistes(filtrados)
}

buscador.addEventListener("input", aplicarFiltros)           // ⚙️ "input" = cada letra que escribe
filtroCategoria.addEventListener("change", aplicarFiltros)   // ⚙️ "change" = cuando elige otra opción


// ---------- 6. Agregar un chiste ----------

agregarChisteForm.addEventListener("submit", (event) => {
  event.preventDefault()                    // 🟪 evita que la página se recargue

  const nuevoChiste = {
    content: event.target.contenido.value,          // 🟩 el id="contenido" del HTML
    categories: [event.target.categoria.value]      // 🟪 array con una sola categoria
  }

  chistes.push(nuevoChiste)                 // 🟪 se agrega al array (solo en tu página, no en la API)
  aplicarFiltros()                          // 🟦 vuelve a mostrar respetando buscador y filtro
  event.target.reset()                      // 🟪 limpia el formulario
})