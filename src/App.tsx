import React, { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { PhTree } from './scripts/PhTree'
import { Species } from './scripts/Species'

function App() {
  const n0 = 15000000;
  const [scale, setScale] = useState(n0);
  const [lineColor, setLineColor] = useState("#7F7F7F");
  const [presentTime, setPresentTime] = useState(0);
  //*
  const root = new Species("Hominoidea", -n0, n0 - 13000000);
  root.addDescendant("Orangután", n0 - 13000000, 13000000);
  const child1 = root.addDescendant("Homininae", n0 - 13000000, 5000000);
  child1.addDescendant("Gorila", 5000000, 8000000);
  const child2 = child1.addDescendant("Homo & Pan", 5000000, 2000000);
  const child3 = child2.addDescendant("Pan", 2000000, 3000000);
  child3.addDescendant("Chimpancé", 3000000, 3000000);
  child3.addDescendant("Bonobo", 3000000, 3000000);
  child2.addDescendant("Humano", 2000000, 6000000);
  //*/
  const [species, setSpecies] = useState<Species | null>(root);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): Promise<any> => {
    return new Promise((resolve, reject) => {
      const file = e.target.files?.[0]; // Usamos el operador opcional para evitar errores si no hay archivo
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonContent = JSON.parse(event.target?.result as string); // Parseamos el contenido como JSON
            resolve(jsonContent); // Resolvemos la promesa con el contenido del JSON
          } catch (error) {
            reject('Error parsing JSON'); // Rechazamos la promesa si hay un error al parsear
          }
        };
        reader.onerror = () => {
          reject('Error reading file'); // Rechazamos la promesa si hay un error al leer el archivo
        };
        reader.readAsText(file); // Leemos el archivo como texto
      } else {
        reject('Please select a valid JSON file.'); // Rechazamos la promesa si el archivo no es válido
      }
    });
  };

  const setFromJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecies(null);
    const json = await handleFileChange(e);
    setSpecies(Species.fromJSON(json));
    setScale(species?.absoluteDuration() ?? 1);
  };

  const scientificNotation = (n: number, decimals: number = 2) => {
    if(n === 0) {
      return "0";
    }
    const abs = Math.abs(n);
    const exp = Math.floor(Math.log10(abs));
    const mant = n / Math.pow(10, exp);
    let mantText = mant.toFixed(decimals);
    for(let i = mantText.length - 1; i >= 0; i--) {
      if(mantText[i] === "0") {
        mantText = mantText.slice(0, i);
      } else {
        if(mantText[i] === ".") {
          mantText = mantText.slice(0, i);
        }
        break;
      }
    }
    return mantText + "e" + exp;
  };

  return (
    <>
      <nav style={{display: "flex", flexDirection: "row", width: "auto", position: "fixed", backgroundColor: "rgba(127, 127, 127, 0.5)", padding: 10}}>
        <div style={{justifyContent: "flex-start", flexDirection: "column", display: "flex", textAlign: "start"}}>
          <label>
            Escala: <input
              type="range"
              min={1}
              max={species ? Math.min(species.absoluteDuration(), presentTime ? presentTime - species.aparision : species.absoluteDuration()) : 1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            /> <input
              type="number"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </label>
          <label>
            Presente: <input
              type="range"
              min={species ? species.aparision : 0}
              max={species ? species.absoluteExtinction() : 1}
              value={presentTime}
              onChange={(e) => setPresentTime(Number(e.target.value))}
            /> <input
              type="number"
              value={presentTime}
              onChange={(e) => setPresentTime(Number(e.target.value))}
            />
          </label>
          <div style={{height: 10}}/>
          <label>
            Color: <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            />
          </label>
        </div>
          <div style={{width: 10}}/>
          <div style={{justifyContent: "flex-start", flexDirection: "column", display: "flex", textAlign: "start"}}>
            <label style={{ display: 'flex', alignItems: 'center', height: 25 }}>
              Repositorio: <a href="https://github.com/LUCHER4321/Phylo_Tree" target="_blank" style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }}>
                <img height={25} src="https://logo.clearbit.com/github.com"/>
              </a>
            </label>
            <label>
              Importar JSON: <input
                type="file"
                accept=".json"
                onChange={async (e) => await setFromJson(e)}
              />
            </label>
          </div>
        </nav>
      <div style={{height: 165}}/>
      {species ? <PhTree
        commonAncestor={species}
        width={window.screen.width * species.absoluteDuration() / scale}
        height={50 * species.allDescendants().length}
        stroke={lineColor}
        format={scientificNotation}
        presentTime={presentTime}
      /> : <div/>}
    </>
  )
}

export default App
