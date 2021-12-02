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
      listaIconos : [":)", ":("],
      // listaBalance: [
      // ---------- DATOS ORIGINALES
      //   "hola",//B
      //   "(hola)",//B
      //   "(()",//D
      //   "(:)",//B
      //   "no voy (:()",//B
      //   "hoy pm: fiesta :):)",//B
      //   ":((",//D
      //   "a (b (c (d) c) b) a :)",//B
      // ---------- DATOS EXTRA
      //   ")",//D
      //   "(",//D
      //   "()AS(:)",//B
      //   "(::))",//B
      //   "(hoy pm: fiesta :):)",//B
      //   "((hoy pm: fiesta :):)",//B
      //   ":(():)",//D
      //   ":()",//D
      //   "(abc:)(abc)",//B
      //   "(abc)(abc)",
      //   "(abc:)",
      //   ":)",
      //   ":(",
      //   ")("
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

    this.setState({mostrar: true, balanceado: this.validarBalanceV4(texto)});
    
    // const {listaBalance} = this.state;
    //LISTADO DE PRUEBA
    // console.log("----------------------V4----------------------");
    // let balanceado = null;
    // listaBalance.forEach(element => {
    //   balanceado = this.validarBalanceV4(element);
    //   if (balanceado) console.log(`${element} | Balanceado`);
    //   else console.log(`${element} | Desbalanceado`);
    // });
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
