const flechaSubir = document.querySelector(".flechaSubir");

const superior = document.querySelector("#superios");

// Funcion para el scroll
window.addEventListener("scroll", (event) => {
    var scroll = this.scrollY;
    if ( scroll > 80 ) {
        flechaSubir.classList.remove('d-none');
        flechaSubir.classList.add('d-block');
    }
    if ( scroll < 80 ) {
        flechaSubir.classList.remove('d-block');
        flechaSubir.classList.add('d-none');
    }
});


// Función para imprimir
function imprimirComprobante(comprobante) {

    var contenido = document.getElementById(comprobante).innerHTML;
    var contenidoOriginal= document.body.innerHTML;

    document.body.innerHTML = contenido;

    window.print();

    document.body.innerHTML = contenidoOriginal;

    location.reload();
}