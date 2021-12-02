import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

class BalaDesbApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texto : "", 
      mostrar: false, 
      balanceado: false,
      listaBalance: [
        "hola",//B
        "(hola)",//B
        "(()",//D
        "(:)",//B
        "no voy (:()",//B
        "hoy pm: fiesta :):)",//B
        ":((",//D
        "a (b (c (d) c) b) a :)",//B
        
        ")",//D
        "(",//D
        "()AS(:)",//B
        "(::))",//B
        "(hoy pm: fiesta :):)",//B
        "((hoy pm: fiesta :):)",//B
        ":(():)",//D
        ":()",//D
        "(abc:)(abc)",//B
        "(abc)(abc)",
        "(abc:)",
        ":)",
        ":(",
        ")("
      ],
      listaIconos : [":)", ":("]
    };

    this.handleChange = this.handleChange.bind(this);
    this.verificar = this.verificar.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  verificar(event) {
    const {listaBalance} = this.state;
    const {texto} = this.state;
    // let textoArreglado = null;

    // let textoArreglado = this.arreglarTexto(texto);

    this.setState({mostrar: true, balanceado: this.validarBalanceV4(texto)});
    // listaBalance.forEach(element => {
    //   this.validarBalance(element)
    // });

    // console.log("----------------------V1---Texto-Arreglado----------------------");

    // listaBalance.forEach(element => {
    //   textoArreglado = this.arreglarTexto(element);
    //   this.validarBalance(element);
    //   console.log("--------------");
    // });

    // console.log("----------------------V2----------------------");

    // listaBalance.forEach(element => {
    //   // textoArreglado = this.arreglarTexto(element);
    //   this.validarBalanceV2(element);
    //   console.log("--------------");
    // });

    // console.log("----------------------V3----------------------");

    // listaBalance.forEach(element => {
    //   this.validarBalanceV3(element)
    // });

    console.log("----------------------V4----------------------");
    let balanceado = null;
    listaBalance.forEach(element => {
      balanceado = this.validarBalanceV4(element);
      if (balanceado) console.log(`${element} | Balanceado`);
      else console.log(`${element} | Desbalanceado`);
    });
  }

  validarBalance(texto){
    let lista = texto.split("");

    let cont_balance = 0;
    let largoLista = lista.length - 1;
    
    for (let index = 0; index < lista.length; index++) {
      switch (lista[index]) {
        case "(": cont_balance++;
          break;
        case ")": cont_balance--;
          break;
        case ":":
          if ((lista[index + 1] === "(") || (lista[index + 1] === ")")) {
            index++;
            if ((index + 1 > largoLista) && cont_balance > 0) {
              cont_balance--;
            };
          };
          break;
        default:
          
          break;
      }
    }

    if (cont_balance !== 0) console.log(`${texto} | ${cont_balance} | Desbalanceado`);
    else console.log(`${texto} | ${cont_balance} | Balanceado`);
  }

  validarBalanceV2(texto){
    let lista = texto.split("");
    let cont_par_izq = 0;
    let cont_par_der = 0;

    while (lista[0] && lista.length >= 0) {
      if (lista[0] === "(") {
        cont_par_izq++;
        lista.splice(0, 1);
        if (lista[lista.length - 1]){
          if (lista[lista.length- 1] === ")") cont_par_der++;
          else if (lista[lista.length- 1] === "(") cont_par_izq++;
          lista.splice(-1, 1);
        }
      }
      else if (lista[0] === ")"){
        cont_par_der++;
        lista.splice(0, 1);
        if (lista[lista.length - 1]){
          if (lista[lista.length - 1] === ")") cont_par_der++;
          else if (lista[lista.length - 1] === "(") cont_par_izq++;
          lista.splice(-1, 1);
        }
      }
      else if(lista[0] === ":"){
        if (lista[1]){
          if (lista[1] === "(" || lista[1] === ")") lista.splice(0, 2);
          else lista.splice(0, 1);
        }
        else lista.splice(0, 1);

        if (lista[lista.length - 1]){
          if (lista[lista.length - 1] === ")") cont_par_der++;
          else if (lista[lista.length - 1] === "(") cont_par_izq++;
          lista.splice(-1, 1);
        }
      }
      else{
        lista.splice(0, 1);
        if (lista[lista.length - 1]){
          if (lista[lista.length - 2]){
            if (lista[lista.length - 2] === ":") lista.splice(-2 , 2);
          }else{
            if (lista[lista.length - 1] === ")") cont_par_der++;
            else if (lista[lista.length - 1] === "(") cont_par_izq++;
            lista.splice(-1, 1);
          }
        }
      }
    }   

    if (cont_par_izq === cont_par_der) console.log(`${texto} | ${cont_par_izq} === ${cont_par_der} | Balanceado`);
    else console.log(`${texto} | ${cont_par_izq} !== ${cont_par_der} | Desbalanceado`);
  }

  validarBalanceV3(texto){
    let lista = texto.split("");

    let indiceIzq = [];
    let indiceDer = [];

    lista.forEach((item, indice) => {
      if (item === "(") indiceIzq.push(indice);
      else if(item === ")") indiceDer.push(indice);
    });

    let indiceCompleto = (indiceIzq.concat(indiceDer)).sort(function(a, b){return a-b});

  }

  validarBalanceV4(texto){
    const {listaIconos} = this.state;

    let lista = texto.split("");

    let cont_balance = 0;

    if (listaIconos.includes(texto)) return true;
    
    for (let index = 0; index < lista.length; index++) {
      switch (lista[index]) {
        case "(":
          cont_balance++; 
          break;
        case ")": 
          cont_balance--;
          break;
        case ":":
          if ((lista[index + 1] && lista[index + 1] === "(")) {
            index++;
            if(cont_balance === 0) cont_balance++;
          }
          else if ((lista[index + 1] && lista[index + 1] === ")")){
            index++;
            if (cont_balance > 0) cont_balance--;
          };
          break;
        default:
          break;
      }
      if (cont_balance < 0) return false;
    }

    if (cont_balance === 0) return true; 
    else return false;
  }

  arreglarTexto(texto){
    let lista = texto.split("");
    let agregar = null;
    let listaArreglada = [];

    lista.forEach((element, indice) => {
      agregar = true;
      if ((element === ":" && (!lista[indice + 1] || (lista[indice + 1] !== "(" && lista[indice + 1] !== ")"))) || (element !== ":" && element !== "(" && element !== ")")) agregar = false;
      if (agregar) listaArreglada.push(element);
    });
    
    return listaArreglada.join("");
  }

  render() {
    const {texto, mostrar, balanceado} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <div style={{display: "flex", alignItems: "center"}}>
            <Button style={{marginRight: "1rem"}} variant="contained" onClick={this.verificar}>Probar</Button>
            <TextField style={{width: "300px"}} value={texto} onChange={this.handleChange} id="texto" label="Texto a probar" variant="outlined" />
          </div>
          {
            mostrar && (
              <h1>
                {balanceado ? "BALANCEADO" : "DESBALANCEADO"}
              </h1>   
            )
          }

        </header>
      </div>
    );
  }
}

export default BalaDesbApp;
