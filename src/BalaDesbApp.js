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
    };

    this.handleChange = this.handleChange.bind(this);
    this.verificar = this.verificar.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  verificar() {
    const {texto} = this.state;

    this.setState({mostrar: true, balanceado: this.validarBalanceV6(texto)});
    
    // // LISTADO DE PRUEBA
    // console.log("----------------------V6----------------------");
    // let balanceado = null;
    // this.generadorListado().forEach(element => {
    //   balanceado = this.validarBalanceV6(element);
    //   if (balanceado) console.log(`${element} | Balanceado`);
    //   else console.log(`${element} | Desbalanceado`);
    // });
  }

  validarBalanceV6(texto){
    let lista_texto = texto.split("");
    
    let lista_patrones  = this.clasificarPatronesV2(lista_texto);

    let cont_balance = 0;

    for (let index = 0; index < lista_patrones.length; index++) {
      switch (lista_patrones[index]) {
        case "(": cont_balance++;
          break;
        case ")": cont_balance--;
          break;
        case ":)":
          if (cont_balance > 0) cont_balance--;
          break;
        default:
          break;
      }
      
      if (cont_balance < 0) return false;
    }

    if (cont_balance !== 0) return false;
    else return true;
  }

  //PERMITE CLASIFICAR LOS PATRONES '(' y ':(' A LA LISTA IZQUIERDA Y LOS PATRONES ')' y ':)' A LA DERECHA
  clasificarPatronesV2(lista_texto){
    let lista_patrones = [];

    for (let index = 0; index < lista_texto.length; index++) {
      if (lista_texto[index] === "(" || lista_texto[index] === ")") lista_patrones.push(lista_texto[index]);
      else if (lista_texto[index] === ":"){
        if (lista_texto[index + 1]){
          if (lista_texto[index + 1] === "(" || lista_texto[index + 1] === ")"){
            lista_patrones.push(`${lista_texto[index]}${lista_texto[index + 1]}`);
            index++;
          }
        }
      }
    }

    return lista_patrones;
  }

  generadorListado(){
    let largo = 0;
    let simbolos = ["(", ")", ":"];
    let maximo = 30;
    let listaBalance = [
      //DATOS ORIGINALES
      "---------------------DATOS ORIGINALES--------------------------------",
      "hola", //B
      "(hola)", //B
      "(()", //D
      "(:)", //B
      "no voy (:()",//B
      "hoy pm: fiesta :):)",//B
      ":((",//D
      "a (b (c (d) c) b) a :)",//B
      "():)",
      "():(",
      //DATOS EXTRA
      "---------------------DATOS EXTRA--------------------------------------",
      ")",
      "(",
      "()AS(:)",
      "(::))",
      "(hoy pm: fiesta :):)",
      "((hoy pm: fiesta :):)",
      ":(():)",
      ":()",
      "(abc:)(abc)",
      "(abc)(abc)",
      "(abc:)",
      ":)",
      ":(",
      ")(",
      ":)()",
      "():(",
      "():(:)",
      "():(:(",
      "()()()()()()()",
      "()()()())))((((",
      ")(())(:()",
      ":::))()()(::()",
      ":)(())(:()",
      ":)(())(:))",
      ":)(())(:)))",
      ":)(())(:):))",
      "(::()",
      "(:()",
      "():)",
      ":)(:):)",
      "(:))",
      "---------------------------DATOS ALEATORIOS---------------------------------"
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
