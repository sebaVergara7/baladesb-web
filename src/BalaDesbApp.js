import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './BalaDesbApp.css';

const style = {
  ContenedorStyle : {
    display       : "flex", 
    alignItems    : "center", 
    flexDirection : "column", 
    justifyContent: "center"
  },
  ButtonStyle: {
    marginBottom: "1rem"
  }
}

class BalaDesbApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texto : "", 
      mostrar: false, 
      balanceado: false,
      // listaBalance: [
      // // ---------- DATOS ORIGINALES
      //   "hola", //B
      //   "(hola)", //B
      //   "(()", //D
      //   "(:)", //B
      //   "no voy (:()",//B
      //   "hoy pm: fiesta :):)",//B
      //   ":((",//D
      //   "a (b (c (d) c) b) a :)",//B
      // // ---------- DATOS EXTRA
      //   ")",
      //   "(",
      //   "()AS(:)",
      //   "(::))",
      //   "(hoy pm: fiesta :):)",
      //   "((hoy pm: fiesta :):)",
      //   ":(():)",
      //   ":()",
      //   "(abc:)(abc)",
      //   "(abc)(abc)",
      //   "(abc:)",
      //   ":)",
      //   ":(",
      //   ")(",
      //   ":)()",
      //   "():(",
      //   "():(:)",
      //   "():(:(",
      //   "()()()()()()()",
      //   "()()()())))((((",
      //   ")(())(:()",
      //   ":::))()()(::()",
      //   ":)(())(:()",
      //   ":)(())(:))",
      //   ":)(())(:)))",
      //   ":)(())(:):))",
      //   "(::()",
      //   "(:()",
      //   "():)",
      //   ":)(:):)",
      //   "(:))"
      // ],
    };

    this.handleChange = this.handleChange.bind(this);
    this.verificar = this.verificar.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  verificar() {
    const {texto} = this.state;

    this.setState({mostrar: true, balanceado: this.validarBalanceV5(texto)});
    
    // // LISTADO DE PRUEBA
    // const {listaBalance} = this.state;
    // let listadoBalanceRnd = this.generadorListado();
    // console.log("----------------------V5----------------------");
    // let balanceado = null;
    // listaBalance.forEach(element => {
    //   balanceado = this.validarBalanceV5(element);
    //   if (balanceado) console.log(`${element} | Balanceado`);
    //   else console.log(`${element} | Desbalanceado`);
    // });
  }

  validarBalanceV5(texto){
    let lista_texto = texto.split("");
    
    let { lista_par_izq, lista_par_der } = this.clasificarPatrones(lista_texto);

    // console.log("------------------------INICIO-----------------------");
    // console.log(`Texto: ${texto}`);
    // console.log(`Izquierda: `, lista_par_izq);
    // console.log(`Izquierda Cont: `, lista_par_izq.length);
    // console.log(`Derecha: `, lista_par_der);
    // console.log(`Derecha Cont: `, lista_par_der.length);

    // this.tacharDatosExtra(lista_par_izq, lista_par_der);

    lista_par_izq = lista_par_izq.filter(f => !f.borrar);
    lista_par_der = lista_par_der.filter(f => !f.borrar);

    let contMaximo = lista_par_izq.length >= lista_par_der.length ? lista_par_izq.length : lista_par_der.length;
    // let listaMaximo = lista_par_izq.length >= lista_par_der.length ? lista_par_izq : lista_par_der;

    // console.log("------------------LISTA LIMPIA---------------------------");
    // console.log(`Texto: ${texto}`);
    // console.log(`Izquierda: `, lista_par_izq);
    // console.log(`Izquierda Cont: `, lista_par_izq.length);
    // console.log(`Derecha: `, lista_par_der);
    // console.log(`Derecha Cont: `, lista_par_der.length);
    // console.log(`contMaximo: `, contMaximo);
    // console.log(`listaMaximo: `, listaMaximo);

    let par_izq = null;
    let par_der = null;

    for (let index = 0; index < contMaximo; index++) {
      par_izq = lista_par_izq[index] ? lista_par_izq[index] : null;
      par_der = lista_par_der[index] ? lista_par_der[index] : null;

      if (par_izq){
        if (par_izq.patron !== ":(" && !par_der) return false;
        if (par_der && (par_der.posicion < par_izq.posicion)) return false;
      }
      else if (par_der){
        if (par_der.patron !== ":)" && !par_izq) return false;
        if (par_izq && (par_der.posicion < par_izq.posicion)) return false;
      }
    }
    return true;
  }
  //PERMITE CLASIFICAR LOS PATRONES '(' y ':(' A LA LISTA IZQUIERDA Y LOS PATRONES ')' y ':)' A LA DERECHA
  clasificarPatrones(lista_texto){
    let lista_par_izq = [];
    let lista_par_der = [];

    let cont_pos = 0;
    for (let index = 0; index < lista_texto.length; index++) {
      if (lista_texto[index] === "("){
        lista_par_izq.push({posicion: cont_pos, patron: lista_texto[index], borrar: false});
        cont_pos++;
      }
      else if (lista_texto[index] === ")"){
        lista_par_der.push({posicion: cont_pos, patron: lista_texto[index], borrar: false});
        cont_pos++;
      }
      else if (lista_texto[index] === ":"){
        if (lista_texto[index + 1]){
          if (lista_texto[index + 1] === "("){
            lista_par_izq.push({posicion: cont_pos, patron: `${lista_texto[index]}${lista_texto[index + 1]}`, borrar: false});
            cont_pos++;
            index++;
          }
          else if (lista_texto[index + 1] === ")"){
            lista_par_der.push({posicion: cont_pos, patron: `${lista_texto[index]}${lista_texto[index + 1]}`, borrar: false});
            cont_pos++;
            index++;
          }
        }
      }
    }

    return {lista_par_izq: lista_par_izq, lista_par_der: lista_par_der};
  }

  //PERMITE LIMPIAR AMBAS LISTAS, Y DEJAR LOS PATRONES ORDENADOS
  tacharDatosExtra(lista_par_izq, lista_par_der){
    let contMaximo = lista_par_izq.length >= lista_par_der.length ? lista_par_izq.length : lista_par_der.length;

    let par_izq = null;
    let par_der = null;

    for (let index = 0; index < contMaximo; index++) {
      par_izq = lista_par_izq[index] ? lista_par_izq[index] : null;
      par_der = lista_par_der[index] ? lista_par_der[index] : null;
      
      if (par_izq){
        if (par_izq.patron === ":("){
          if (!par_der || (par_der.posicion < par_izq.posicion)) par_izq.borrar = true;
        }
        else if(par_izq.patron === "("){
          if (par_der){
            if (par_der.patron === ":)" && par_der.posicion < par_izq.posicion) par_der.borrar = true;
          }
        }
      }else if (par_der){
        if (par_der.patron === ":)"){
          if (!par_izq || (par_izq.posicion > par_der.posicion)) par_der.borrar = true;
        }
        else if(par_der.patron === ")"){
          if(par_izq){
            if (par_izq.patron === ":(" && (par_izq.patron > par_der.posicion)) par_izq.borrar = true;
          }
        }
      }
    }
  }

  generadorListado(){
    let largo = 0;
    let simbolos = ["(", ")", ":"];
    let maximo = 30;
    let listaBalance = [
      //DATOS ORIGINALES
      "hola", //B
      "(hola)", //B
      "(()", //D
      "(:)", //B
      "no voy (:()",//B
      "hoy pm: fiesta :):)",//B
      ":((",//D
      "a (b (c (d) c) b) a :)",//B
    ];
    let texto = null;
    for (let index = 0; index < maximo; index++) {
      texto = "";
      largo = Math.floor(Math.random() * 10) + 1;
      for (let posLargo = 0; posLargo < largo; posLargo++) {
        texto += simbolos[Math.floor(Math.random() * 3)];
      }      
      listaBalance.push(texto);
    }

    return listaBalance;
  }

  render() {
    const {texto, mostrar, balanceado} = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h1>CHECKEA LOS PARÉNTESIS</h1>
          <div>
            <div style={style.ContenedorStyle}>
              <Button style={style.ButtonStyle} variant="contained" onClick={this.verificar}>VERIFICAR</Button>
              <TextField placeholder="Ingrese texto..." className="textFieldStyle" value={texto} onChange={this.handleChange} id="texto" label="Cadena String" variant="filled" />
            </div>
            {
              mostrar ? (
                <h2 style={{color: balanceado ? "#1cf138" : "#f11c1c"}}>
                  {balanceado ? "TEXTO BALANCEADO" : "TEXTO DESBALANCEADO"}
                </h2>   
              ) : (
                <h2>
                  ESPERANDO INGRESO...
                </h2>  
              )
            }
          </div>

        </div>
      </div>
    );
  }
}

export default BalaDesbApp;
