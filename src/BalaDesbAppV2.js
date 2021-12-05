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

const letras          = "abcdefghijklmnñopqrstuvwxyz".split("");
const lista_regla_2   = [":", " "].concat(letras);
const listaCaracteres = ["(", ")"].concat(lista_regla_2);

class BalaDesbApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texto                : "", 
      mostrar              : false, 
      balanceado           : false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.verificar = this.verificar.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  verificar() {
    const {texto} = this.state;

    this.setState({mostrar: true, balanceado: this.validarBalanceV7(texto)});
    
    // LISTADO DE PRUEBA
    // console.log("----------------------V7----------------------");
    // let balanceado = null;
    // this.generadorListado().forEach(item => {
    //   console.log(`--------------${item}---------------------`)
    //   balanceado = this.validarBalanceV7(item);
    //   if (balanceado) console.log(`${item} | Balanceado`);
    //   else console.log(`${item} | Desbalanceado`);
    // });
    // this.generadorListado();
  }

  validarBalanceV7(texto){
    let lista_texto = texto.split("");

    if(lista_texto && lista_texto.length > 0){
      for (let i = 0; i < lista_texto.length; i++) {
        if (!this.validarRegla1(lista_texto[i])) return false;
      }
  
      let lista_texto_obj = this.inicializarCaracteres(lista_texto);
      this.validarRegla2(lista_texto_obj);

      //VALIDAR PARÉNTESIS DE DERECHA A IZQUIERDA
      for (let i = 0; i < lista_texto_obj.length; i++) {
        if (lista_texto_obj[i].caracter === "("){
          if (lista_texto_obj[i - 1] && lista_texto_obj[i - 1].caracter === ":"){
            lista_texto_obj[i].regla_5 = true;
            lista_texto_obj[i - 1].regla_5 = true;
          }
        }else if(lista_texto_obj[i].caracter === ")"){
          if (lista_texto_obj[i - 1]){
            let primera = true;
            for (let reversa = i - 1; reversa >= 0; reversa--) {
              if (lista_texto_obj[reversa]){
                if (primera && lista_texto_obj[reversa].caracter === ":"){
                  lista_texto_obj[i].regla_5 = true;
                  lista_texto_obj[reversa].regla_5 = true;
                }else if (lista_texto_obj[reversa].caracter === "(" && !lista_texto_obj[reversa].regla_3){
                  lista_texto_obj[i].regla_3 = true;
                  lista_texto_obj[reversa].regla_3 = true;
                  if (lista_texto_obj[reversa].regla_5) lista_texto_obj[i].cerrado_emoji = true; 
                  if (lista_texto_obj[i].regla_5) lista_texto_obj[reversa].cerrado_emoji = true;
                  break;
                }
                primera = false;
              }
            }
          }
        }
      }

      //VALIDAR PARÉNTESIS DESDE IZQUIERDA A DERECHA
      for (let i = 0; i < lista_texto_obj.length; i++) {
        if (lista_texto_obj[i].caracter === "(" && !lista_texto_obj[i].regla_3 && !lista_texto_obj[i].regla_5){
          if (lista_texto_obj[i + 1]){
            for (let siguiente = i + 1; siguiente < lista_texto_obj.length; siguiente++) {
              if(lista_texto_obj[siguiente].caracter === ")" && lista_texto_obj[siguiente].cerrado_emoji && !lista_texto_obj[siguiente].regla_3_con_emoji){
                lista_texto_obj[i].regla_3 = true;
                lista_texto_obj[siguiente].regla_3_con_emoji = true;
                break;
              }
            }
          }
        }
        else if(lista_texto_obj[i].caracter === ")" && !lista_texto_obj[i].regla_3 && !lista_texto_obj[i].regla_5){
          if (lista_texto_obj[i - 1]){
            for (let reversa = i - 1; reversa >= 0; reversa--) {
              if(lista_texto_obj[reversa].caracter === "(" && lista_texto_obj[reversa].cerrado_emoji && !lista_texto_obj[reversa].regla_3_con_emoji){
                lista_texto_obj[i].regla_3 = true;
                lista_texto_obj[reversa].regla_3_con_emoji = true;
                break;
              }
            }
          }
        }
      }

      for (let i = 0; i < lista_texto_obj.length; i++) {
        if (!lista_texto_obj[i].regla_2 && !lista_texto_obj[i].regla_3 && !lista_texto_obj[i].regla_5) return false;        
      }
    }

    return true;
  }

  inicializarCaracteres(lista_texto){
    //Regla 1: Validada antes de analizar caracter por caracter
    //Regla 4: Se autovalida habiendo validado las reglas 2, 3 y 5
    return lista_texto.map(item => {
      return {caracter: item, regla_2: false, regla_3: false, regla_5: false, cerrado_emoji: false, regla_3_con_emoji: false};
    });
  }

  validarRegla1(caracter){
    if (!listaCaracteres.includes(caracter)) return false;

    return true;
  }

  validarRegla2(lista_texto_obj){
    for (let i = 0; i < lista_texto_obj.length; i++) {
      if ((letras.concat([" ", ":"])).includes(lista_texto_obj[i].caracter)) lista_texto_obj[i].regla_2 = true;
    }
  }

  generadorListado(){
    let largo = 0;
    let simbolos = ["(", ")", ":"];
    let maximo = 100;
    let listaBalance = [
      //DATOS ORIGINALES
      "---------------------DATOS ORIGINALES--------------------------------",
      "hola", //B
      "(hola)", //B
      "(()", //D
      "(:)", //B
      "no voy (:()",//B
      "no voy (:((:())",//B
      "hoy pm: fiesta :):)",//B
      ":((",//D
      "a (b (c (d) c) b) a :)",//B
      "():)",
      "():(",
      ":(:()):)",
      "((((:(:()):))",
      //DATOS EXTRA
      "---------------------DATOS EXTRA--------------------------------------",
      ")",
      "(",
      "()as(:)",
      "(::))",
      ":(::))",
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
      "):(",
      ":):(",
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
      ":()(:):):((:()",
      "::))::)::",
      "()::((:)))(((((",
      "::)):)):::(",	
      ":))):::)(::(:)",
      "(((:):)))))))",
      "(:::::()):()(",
      ":(:))):((((:",
      "---------------------------DATOS ALEATORIOS---------------------------------"
    ];
    let texto = null;
    for (let index = 0; index < maximo; index++) {
      texto = "";
      largo = Math.floor(Math.random() * 15) + 1;
      for (let posLargo = 0; posLargo < largo; posLargo++) {
        texto += simbolos[Math.floor(Math.random() * 3)];
      }      

      let balanceado = this.validarBalanceV7(texto);
      if (!balanceado){ console.log(`${texto} | Desbalanceado`); listaBalance.push(texto);}
      else index--;
      // listaBalance.push(texto);
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
