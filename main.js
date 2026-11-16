// 🟩 nombres que elegís vos
const URL_BASE = "https://prod-main-api-704464-00tre1p1erm.compute.instacloud-edge.com/api/v1"  // ⚙️ la Base URL de tu captura
let chistes = []   // 🟪 array vacío: acá guardamos los datos cuando lleguen

fetch(URL_BASE + "/public/randomjokes")   // 🟥 ver aviso de arriba: endpoint de LISTA, confirmalo
  .then(response => response.json())      // 🟪 convierte la respuesta en un objeto JS
  .then(respuesta => {
    console.log(respuesta)                // 🟨 mirá esto en la consola (F12) para ver la forma real
    chistes = respuesta.data.data         // 🟥 ver nota abajo
    llenarCategorias(chistes)             // 🟦 la creamos en el paso 4
    mostrarChistes(chistes)               // 🟦 la creamos en el paso 3
  })
  .catch(error => {
    console.error("Error al traer los chistes:", error)
  })








  function mostrarChistes(lista) {            // 🟦 función; 🟩 nombre elegido por vos
    const chistesContainer = document.getElementById("chistesContainer")
    chistesContainer.innerHTML = ""           // 🟪 vacía el contenedor para no duplicar
  
    lista.forEach(chiste => {                 // 🟪 chiste = cada elemento del array
      chistesContainer.innerHTML += `
        <article class="card">
          <p>${chiste.content}</p>            <!-- 🟨 viene de la API -->
          <ul>
            ${chiste.categories.map(cat => `<li>${cat}</li>`).join("")}  <!-- 🟨 array de categorias -->
          </ul>
        </article>
      `
    })
  }







  function llenarCategorias(lista) {
    const filtroCategoria = document.getElementById("filtroCategoria")
    const categorias = []                                   // 🟩 acá juntamos las categorias sin repetir
  
    lista.forEach(chiste => {
      chiste.categories.forEach(cat => {                    // 🟨 recorre el array de cada chiste
        if (!categorias.includes(cat)) {                    // 🟪 si todavía no la guardamos...
          categorias.push(cat)                              // ...la agregamos
        }
      })
    })
  
    categorias.forEach(cat => {
      filtroCategoria.innerHTML += `<option value="${cat}">${cat}</option>`
    })
  }










  const buscador = document.getElementById("buscador")
const filtroCategoria = document.getElementById("filtroCategoria")

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase()              // 🟪 pasa a minúscula lo que escribió
  const categoria = filtroCategoria.value                 // ⚙️ "" si eligió "Todas"

  const filtrados = chistes.filter(chiste => {
    const coincideTexto = chiste.content.toLowerCase().includes(texto)   // 🟨 busca en el chiste
    const coincideCategoria = categoria === "" || chiste.categories.includes(categoria)  // 🟪 "" = no filtrar

    return coincideTexto && coincideCategoria             // 🟪 tienen que cumplirse las DOS
  })

  mostrarChistes(filtrados)
}

buscador.addEventListener("input", aplicarFiltros)        // ⚙️ "input" = cada vez que escribe una letra
filtroCategoria.addEventListener("change", aplicarFiltros)









const agregarChisteForm = document.getElementById("agregarChisteForm")

agregarChisteForm.addEventListener("submit", (event) => {
  event.preventDefault()                                  // 🟪 evita que se recargue la página

  const nuevoChiste = {
    content: event.target.contenido.value,                // 🟩 mismo nombre de campo que la API
    categories: [event.target.categoria.value]            // 🟪 array con una categoria
  }

  chistes.push(nuevoChiste)
  aplicarFiltros()                                        // 🟦 vuelve a mostrar respetando filtros
  event.target.reset()
})












