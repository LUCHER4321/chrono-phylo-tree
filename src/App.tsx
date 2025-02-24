import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { PhTree } from './scripts/PhTree'
import { Species } from './scripts/Species'
import { between } from './scripts/between';

function App() {
  const [scale, setScale] = useState(1);
  const [species, setSpecies] = useState<Species | undefined>(undefined);
  const [lineColor, setLineColor] = useState("#7F7F7F");
  const [presentTime, setPresentTime] = useState<number>(1);
  const [presentTimeBoolean, setPresentTimeBoolean] = useState(true);
  //*
  const root = new Species("Hominoidea", -25e6, 6e6);
  root.addDescendant("Gibón", 6e6, 19e6);
  const child0 = root.addDescendant("Hominidae", 6e6, 6e6);
  child0.addDescendant("Orangután", 6e6, 13e6);
  const child1 = child0.addDescendant("Homininae", 6e6, 5e6);
  child1.addDescendant("Gorila", 5e6, 8e6);
  const child2 = child1.addDescendant("Hominini", 5e6, 2e6);
  const child3 = child2.addDescendant("Pan", 2e6, 3e6);
  child3.addDescendant("Chimpancé", 3e6, 3e6);
  child3.addDescendant("Bonobo", 3e6, 3e6);
  child2.addDescendant("Humano", 2e6, 6e6);
  //*/
  const showScaleNumber = false;

  const handleFileChange = (file: File | undefined): Promise<any> => {
    return new Promise((resolve, reject) => {
      //const file = e.target.files?.[0]; // Usamos el operador opcional para evitar errores si no hay archivo
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

  const setFromJson = async (file: File | undefined) => {
    setSpecies(undefined);
    const json = await handleFileChange(file);
    const newSpecies = Species.fromJSON(json);
    setSpecies(newSpecies);
    if(presentTimeBoolean){
      setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
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

  const createDescendant = (s: Species, name: string, afterAparision: number, duration: number, description: string) => {
    const newSpecies = s.addDescendant(name, afterAparision, duration, description, true).firstAncestor();
    //*
    setSpecies(undefined);
    if(presentTimeBoolean){
      setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
    setSpecies(newSpecies);
    //*/
  };

  const createAncestor = (s: Species, name: string, previousAparision: number, duration: number, description: string) => {
    const newSpecies = s.addAncestor(name, previousAparision, duration, description, true, true).firstAncestor();
    //*
    setSpecies(undefined);
    if(presentTimeBoolean){
      setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
    setSpecies(newSpecies);
    //*/
  };

  const deleteSpecies = (sp: Species) => {
    if(!confirm(`¿Estás seguro de que deseas eliminar la especie ${sp.name}${sp.descendants.length > 0 ? " junto a sus descendientes" : ""}?`)) {
      return;
    }
    setSpecies(undefined);
    const removingSpecies = sp?.copy();
    const ancestor = removingSpecies?.ancestor;
    ancestor?.removeDescendant(removingSpecies);
    setSpecies(ancestor?.firstAncestor());
  };

  const showExample = () => {
    setSpecies(() =>{
      if(presentTimeBoolean){
        setPresentTime(root.absoluteExtinction());
      }
      setScale(root.absoluteDuration());
      return root;
    });
  };

  const changePresentTime = (n: number) => {
    setPresentTime(n);
    setScale(between(scale, 1, maxScale(n)));
  };

  const maxScale = (n: number) => {
    return species ? Math.min(species.absoluteDuration(), presentTimeBoolean ? n - species.aparision : species.absoluteDuration()) : 1
  }

  return (
    <>
      <nav style={{display: "flex", flexDirection: "row", width: "auto", position: species ? "fixed" : "static", backgroundColor: "rgba(127, 127, 127, 0.5)", padding: 10}}>
        <div style={{justifyContent: "flex-start", flexDirection: "column", display: "flex", textAlign: "start"}}>
          <label>
            Escala: <input
              type="range"
              min={1}
              max={maxScale(presentTime)}
              value={maxScale(presentTime) - scale + 1}
              onChange={(e) => setScale(maxScale(presentTime) - Number(e.target.value) + 1)}
            /> {showScaleNumber && <input
              type="number"
              min={1}
              max={maxScale(presentTime)}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />}
          </label>
          <label>
            Presente: <input
              type="range"
              min={species ? species.aparision : 0}
              max={species ? species.absoluteExtinction() : 1}
              value={presentTime}
              onChange={(e) => changePresentTime(Number(e.target.value))}
              disabled={!presentTimeBoolean}
            /> <input
              type="number"
              min={species ? species.aparision : 0}
              max={species ? species.absoluteExtinction() : 1}
              value={presentTime}
              onChange={(e) => changePresentTime(Number(e.target.value))}
              disabled={!presentTimeBoolean}
            /> <input
              type="checkbox"
              checked={presentTimeBoolean}
              onChange={(e) => setPresentTimeBoolean(e.target.checked)}
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
                onChange={async (e) => await setFromJson(e.target.files?.[0])}
              />
            </label>
            <div style={{display: "flex", flexDirection: "row"}}>
              <button type="button" onClick={showExample}>
                Ejemplo
              </button>
              <div style={{width: 10}}/>
              <button onClick={async () => await species?.saveJSON()}>
                Descargar JSON
              </button>
            </div>
          </div>
        </nav>
      {species && <div style={{height: 165}}/>}
      {species && <PhTree
        commonAncestor={species}
        width={window.screen.width * (species?.absoluteDuration() ?? 0) / scale}
        height={50 * (species?.allDescendants().length ?? 0)}
        stroke={lineColor}
        format={scientificNotation}
        presentTime={presentTimeBoolean ? presentTime : undefined}
        padding={7.5}
        createDescendant={createDescendant}
        createAncestor={createAncestor}
        deleteSpecies={deleteSpecies}
      />}
    </>
  )
}

export default App
