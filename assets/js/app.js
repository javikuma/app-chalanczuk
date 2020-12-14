// Definicion de las clases

class Cliente {
    constructor(fechaComprobante, nombre, direccion, telefono){
        this.fechaComprobante = fechaComprobante;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
    }
}

class Conceptos {
    constructor(concepto, ingreso, egreso){
        this.concepto = concepto;
        this.ingreso = ingreso;
        this.egreso = egreso;
    }
}

class UI {
    static mostrarCliente(){
        const clientes = Datos.traerCliente();
        UI.agregarCliente(clientes);
        // sirve para completar los campos en caso de que cliente = vacio en el localStorage
        if (clientes.length === 0) {
            document.querySelector('#fechaEmision').innerHTML = 'xx/xx/xxxx';
            document.querySelector('#nomCli').innerHTML = 'Cliente';
            document.querySelector('#dirCli').innerHTML = 'Dirección';
            document.querySelector('#telCli').innerHTML = 'Teléfono';
        }
    }

    static mostrarConceptos(){
        const conceptos = Datos.traerConceptos();
        conceptos.forEach( (concepto) => UI.agregarConceptos(concepto) );
    }
    static agregarCliente(cliente){
        const fechaEmision = document.querySelector('#fechaEmision');
        const nombre = document.querySelector('#nomCli');
        const direccion = document.querySelector('#dirCli');
        const telefono = document.querySelector('#telCli');

        let nom = '';
        let dir = '';
        let tel = '';

        if (cliente.nombre != '') {
            nom = `${ cliente.nombre }`;
        }
        if (cliente.direccion != '') {
            dir = `${ cliente.direccion }`;
        }
        if (cliente.telefono != '') {
            tel = `${ cliente.telefono }`;
        }

        fechaEmision.innerHTML = '';
        nombre.innerHTML = '';
        direccion.innerHTML = '';
        telefono.innerHTML = '';
        if(nom != 'undefined'){
            fechaEmision.appendChild(document.createTextNode(cliente.fechaComprobante));
        }
        if(nom != 'undefined'){
            nombre.appendChild(document.createTextNode(nom));
        }
        if(dir != 'undefined'){
            direccion.appendChild(document.createTextNode(dir));
        }
        if(tel != 'undefined'){
            telefono.appendChild(document.createTextNode(tel));
        }

    }
    static agregarConceptos(concepto){
        const lista = document.querySelector('#conceptos-detalle');
        let ingresoAdd = '';
        let egresoAdd = '';
        if (concepto.ingreso > 0) {
            ingresoAdd = `$ ${Number(concepto.ingreso).toFixed(2)}`;
        }
        if (concepto.egreso > 0) {
            egresoAdd = `$ ${Number(concepto.egreso).toFixed(2)}`;
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td> <a class="delete">${ concepto.concepto }</a></td>
            <td class="text-center"> ${ ingresoAdd }</td>
            <td class="text-center"> ${ egresoAdd }</td>
            `;
            // <td class="text-center"><a type="button" class="btn btn-outline-danger btn-sm delete" value="${ concepto.idConcepto }"><i class="fas fa-trash"></i></a></td>

        lista.appendChild(fila);
    }
    static eliminarConceptos(e){
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove();
        }

    }
    static mostrarAlerta(valor){
        const container = document.querySelector(`#${valor}`);
        container.classList.add('border-danger');
    }
    static mostrarAlertaSuccess( msg){
        const p = document.createElement('p');
        p.className = `text-success text-center alerta`;
        p.appendChild(document.createTextNode(msg));

        // const btnSuccess = document.querySelector('.btn-success');
        const footerModal = document.querySelector('.footerModal');

        // btnSuccess.insertBefore(div, modaFooter);
        footerModal.after(p);

        setTimeout( () => document.querySelector('.alerta').remove(), 2000);

    }

    static limpiarCamposConceptos(){
        document.querySelector('#concepto').value = '';
        document.querySelector('#ingreso').value = '';
        document.querySelector('#egreso').value = '';
    }

    static limpiarCamposCliente(){
        document.querySelector('#fechaComprobante').value = '';
        document.querySelector('#nombreCli').value = '';
        document.querySelector('#direccionCli').value = '';
        document.querySelector('#telefonoCli').value = '';
    }

    static resstablecer() {
        UI.limpiarCamposCliente();
        UI.limpiarCamposConceptos();
        Datos.sumarTotales();

        document.querySelector('#fechaEmision').innerHTML = 'xx/xx/xxxx';
        document.querySelector('#nomCli').innerHTML = 'Cliente';
        document.querySelector('#dirCli').innerHTML = 'Dirección';
        document.querySelector('#telCli').innerHTML = 'Teléfono';
        document.querySelector('#conceptos-detalle').innerHTML = '';

        document.querySelector('#totalIngresos').innerHTML = '0.00';
        document.querySelector('#totalEgresos').innerHTML = '0.00';
        document.querySelector('#neto').innerHTML = '0.00';
        document.querySelector('#total').innerHTML = '0.00';

        localStorage.clear();

    }
    static agregarTotales(totalIngresos, totalEgresos, neto){
        document.querySelector('#totalIngresos').innerHTML = totalIngresos;
        document.querySelector('#totalEgresos').innerHTML = totalEgresos;
        document.querySelector('#neto').innerHTML = neto;
        document.querySelector('#total').innerHTML = neto;
    }

    static convertirNumeroLetra(){
        const valor = JSON.parse(localStorage.getItem('neto'));
        if (valor != null || valor != 0 ) {
            document.querySelector('#numLetras').innerHTML = NumeroALetras(valor);
        } else {
            document.querySelector('#numLetras').innerHTML = NumeroALetras(0);
        }
        if (valor < 0) {
            document.querySelector('#numLetras').innerHTML = 'Valor negativo';
        }
    }
}

class Datos {
    static agregarCliente(cliente) {
        let cli = Datos.traerCliente();
        // cli.push(cliente);
        cli = cliente;
        localStorage.setItem('cliente', JSON.stringify(cli));
        UI.limpiarCamposCliente();
    }

    static traerCliente(){
        let cliente = [];
        if (localStorage.getItem('cliente') !== null) {
            // localStorage.removeItem('cliente');
            cliente = JSON.parse(localStorage.getItem('cliente'));
        }
        return cliente;
    }

    static traerConceptos(){
        let conceptos = [];
        if(localStorage.getItem('conceptos') !== null){
            conceptos = JSON.parse(localStorage.getItem('conceptos'));
        }
        return conceptos;

    }

    static agregarConcepto(concepto){
        const conceptos = Datos.traerConceptos();
        conceptos.push(concepto);
        localStorage.setItem('conceptos', JSON.stringify(conceptos));
        UI.limpiarCamposConceptos();

    }
    static removerConcepto(concepto){
        const conceptoDato = Datos.traerConceptos();

        conceptoDato.forEach( (desc, index) => {
            if(desc.concepto === concepto){
                conceptoDato.splice(index, 1);
            }
        });
        localStorage.setItem('conceptos', JSON.stringify(conceptoDato));

    }
    static sumarTotales(){
        let ingresos = [];
        let totalIngresos = 0;
        let totalEgresos = 0;
        let neto = 0;
        ingresos = JSON.parse(localStorage.getItem('conceptos'));
        if (ingresos != null) {
            
            ingresos.forEach( (ingreso) => {
                totalIngresos += Number(ingreso.ingreso);
                totalEgresos += Number(ingreso.egreso);
            });
            neto = Number(totalIngresos) - Number(totalEgresos);
            localStorage.setItem('totalIngresos', JSON.stringify(totalIngresos.toFixed(2)));
            localStorage.setItem('totalEgresos', JSON.stringify(totalEgresos.toFixed(2)));
            localStorage.setItem('neto', JSON.stringify(neto.toFixed(2)));
            UI.agregarTotales(totalIngresos.toFixed(2), totalEgresos.toFixed(2), neto.toFixed(2));
        }
    }
}

// Carga la pagina, me carga la tabla
document.addEventListener( 'DOMContentLoader', UI.mostrarConceptos() );
// Carla la pagina, me carga los clientes
document.addEventListener( 'DOMContentLoader', UI.mostrarCliente() );
// Carla la pagina, me carga los TOTALES
document.addEventListener( 'DOMContentLoader', Datos.sumarTotales() );
// Carla la pagina, me carga los TOTALES
document.addEventListener( 'DOMContentLoader', UI.convertirNumeroLetra() );

//Controlar cuando se haga clic en agregar btnAgregarConcepto
document.querySelector('#btnAgregarConcepto').addEventListener('click', () => {

    // Obtener losa valores de los campos
    const concepto = document.querySelector('#concepto');
    const ingreso = document.querySelector('#ingreso');
    const egreso = document.querySelector('#egreso');

    concepto.addEventListener('focus', () => {
        concepto.classList.remove('border-danger');
    });

    if ( concepto.value === '') {
        UI.mostrarAlerta('concepto');
    } else {
        const conceptoDatos = new Conceptos( concepto.value, ingreso.value, egreso.value );
        Datos.agregarConcepto(conceptoDatos);
        UI.agregarConceptos(conceptoDatos);
        UI.mostrarAlertaSuccess('Concepto agregado');
        UI.limpiarCamposConceptos();
        Datos.sumarTotales();
        UI.convertirNumeroLetra();
    }
});


document.querySelector('#conceptos-detalle').addEventListener('click', (e) => {
    UI.eliminarConceptos(e.target);
    Datos.removerConcepto(e.target.textContent);
    Datos.sumarTotales();
    UI.convertirNumeroLetra();
});

// Controlar cuando haga clic en agregar cliente
const btnAgregarCliente = document.querySelector('#btnAgregarCliente').addEventListener('click', () => {
    const btnUsuario = document.querySelector('#btnAgregarCliente');
    // Obtener valores de los campos
    const fechaComprobante = document.querySelector('#fechaComprobante');
    const nombreCli = document.querySelector('#nombreCli');
    const direccionCli = document.querySelector('#direccionCli');
    const telefonoCli = document.querySelector('#telefonoCli');

    fechaComprobante.addEventListener('focus', () => {
        fechaComprobante.classList.remove('border-danger');
    });

    if (fechaComprobante.value === '') {
        UI.mostrarAlerta('fechaComprobante');
    } else {
        btnUsuario.setAttribute('data-dismiss', 'modal');
        const datosCliente = new Cliente( fechaComprobante.value, nombreCli.value, direccionCli.value, telefonoCli.value );
        Datos.agregarCliente(datosCliente);
        UI.agregarCliente(datosCliente);
        UI.mostrarAlertaSuccess('Cliente agregado');
        UI.limpiarCamposCliente();
    }

});

// ELIMINO ATRIBUTO DATA-DISMISS
document.querySelector('#agregarCliente').addEventListener('click', ()=>{
    document.querySelector('#btnAgregarCliente').removeAttribute('data-dismiss');
});

// Al cerrar modal me limpia los campos
document.querySelector('#btnCerrarConcepto').addEventListener('click', () => UI.limpiarCamposConceptos());
document.querySelector('#btnCerrarCliente').addEventListener('click', () => UI.limpiarCamposCliente());

// Boton reestablecer todo
const resstablecer = document.querySelector('#vaciarCampos').addEventListener('click', () => {
    UI.resstablecer();
    UI.convertirNumeroLetra();
});

// Hacer calculos porcentaje
const ingreso = document.querySelector('#ingreso');
const egreso = document.querySelector('#egreso');
const porcentaje = document.querySelector('#porcentaje');
const checkPor = document.querySelector('#checkPor');

const calculos = () => {
    const resultado = (ingreso.value * porcentaje.value) / 100;
    egreso.value = resultado;
}

const verifCheck = () => {
    if(checkPor.checked === true ){
        porcentaje.removeAttribute('disabled');
        calculos();
    }
    if(checkPor.checked === false ){
        porcentaje.setAttribute('disabled', '');
    }
}

ingreso.addEventListener('keyup', ()=>{
    verifCheck();
});
porcentaje.addEventListener('keyup', ()=>{
    verifCheck();
});
checkPor.addEventListener('click', ()=>{
    verifCheck();
});

// Agrego el año actual al footer
const year = new Date().getFullYear();
document.querySelector('#anio').innerHTML = year;






// FUNCIONES NUMERO A LETRAS
function Unidades(num){
 
    switch(num)
    {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
    }
   
    return "";
  }
   
  function Decenas(num){
   
    decena = Math.floor(num/10);
    unidad = num - (decena * 10);
   
    switch(decena)
    {
      case 1:
        switch(unidad)
        {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch(unidad)
        {
          case 0: return "VEINTE";
          default: return "VEINTI" + Unidades(unidad);
        }
      case 3: return DecenasY("TREINTA", unidad);
      case 4: return DecenasY("CUARENTA", unidad);
      case 5: return DecenasY("CINCUENTA", unidad);
      case 6: return DecenasY("SESENTA", unidad);
      case 7: return DecenasY("SETENTA", unidad);
      case 8: return DecenasY("OCHENTA", unidad);
      case 9: return DecenasY("NOVENTA", unidad);
      case 0: return Unidades(unidad);
    }
  }//Unidades()
   
  function DecenasY(strSin, numUnidades){
    if (numUnidades > 0)
      return strSin + " Y " + Unidades(numUnidades)
   
    return strSin;
  }//DecenasY()
   
  function Centenas(num){
   
    centenas = Math.floor(num / 100);
    decenas = num - (centenas * 100);
   
    switch(centenas)
    {
      case 1:
        if (decenas > 0)
          return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2: return "DOSCIENTOS " + Decenas(decenas);
      case 3: return "TRESCIENTOS " + Decenas(decenas);
      case 4: return "CUATROCIENTOS " + Decenas(decenas);
      case 5: return "QUINIENTOS " + Decenas(decenas);
      case 6: return "SEISCIENTOS " + Decenas(decenas);
      case 7: return "SETECIENTOS " + Decenas(decenas);
      case 8: return "OCHOCIENTOS " + Decenas(decenas);
      case 9: return "NOVECIENTOS " + Decenas(decenas);
    }
   
    return Decenas(decenas);
  }//Centenas()
   
  function Seccion(num, divisor, strSingular, strPlural){
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)
   
    letras = "";
   
    if (cientos > 0)
      if (cientos > 1)
        letras = Centenas(cientos) + " " + strPlural;
      else
        letras = strSingular;
   
    if (resto > 0)
      letras += "";
   
    return letras;
  }//Seccion()
   
  function Miles(num){
    divisor = 1000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)
   
    strMiles = Seccion(num, divisor, "MIL", "MIL");
    strCentenas = Centenas(resto);
   
    if(strMiles == "")
      return strCentenas;
   
    return strMiles + " " + strCentenas;
   
    //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
  }//Miles()
   
  function Millones(num){
    divisor = 1000000;
    cientos = Math.floor(num / divisor)
    resto = num - (cientos * divisor)
   
    strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
    strMiles = Miles(resto);
   
    if(strMillones == "")
      return strMiles;
   
    return strMillones + " " + strMiles;
   
    //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
  }//Millones()
   
  function NumeroALetras(num,centavos){
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
    };
    if(centavos == undefined || centavos==false) {
      data.letrasMonedaPlural="PESOS";
      data.letrasMonedaSingular="PESO";
    }else{
      data.letrasMonedaPlural="CENTAVOS";
      data.letrasMonedaSingular="CENTAVO";
    }
   
    if (data.centavos > 0)
      data.letrasCentavos = "CON " + NumeroALetras(data.centavos,true);
   
    if(data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
      return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
  }//NumeroALetras()