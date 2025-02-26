import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { PhTree } from './scripts/PhTree'
import { Species } from './scripts/Species'
import { between } from './scripts/between';
import { codeText, codeTextAlt, getLanguageOptions } from './scripts/translate';

function App() {
  const [scale, setScale] = useState(1);
  const [species, setSpecies] = useState<Species | undefined>(undefined);
  const [lineColor, setLineColor] = useState("#7F7F7F");
  const [presentTime, setPresentTime] = useState<number>(1);
  const [presentTimeBoolean, setPresentTimeBoolean] = useState(true);
  const [language, setLanguage] = useState("spanish");
  const languages = getLanguageOptions();
  const minScale = 0.000000000001;
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

  const hexToRGB = (hex: string) => {
    // Eliminar el '#' si está presente
    hex = hex.replace(/^#/, '');
  
    // Convertir cada par de caracteres a un número decimal
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return { r, g, b };
  };

  const hexToRGBA = (hex: string, a: number) => {
    const {r, g, b} = hexToRGB(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`
  };

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
    return mantText + ((abs >= 1 && abs < 10) ? "" : ("e" + exp));
  };

  const saveSpecies = (s: Species, name: string, aparision: number, duration: number, description?: string) => {
    const newSpecies = s.copy();
    setSpecies(undefined);
    newSpecies.name = name;
    newSpecies.aparision = aparision;
    newSpecies.duration = duration;
    newSpecies.description = description === "" ? undefined : description;
    setSpecies(newSpecies.firstAncestor());
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

  const deleteAncestor = async (sp: Species) => {
    if(!confirm(await codeTextAlt("cnfrm00" + (sp.ancestor?.ancestor ? "_0" : ""), language, sp.name))) {
      return;
    }
    setSpecies(undefined);
    const removingAncestor = sp?.copy();
    removingAncestor.ancestor = undefined;
    setScale(removingAncestor.absoluteDuration());
    setSpecies(removingAncestor);
  };

  const deleteSpecies = async (sp: Species) => {
    if(!confirm(await codeTextAlt("cnfrm01" + (sp.descendants.length > 0 ? "_0" : ""), language, sp.name))) {
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

  const createEmptySpecies = async () => {
    setSpecies(new Species(await codeTextAlt("nvbtn01", language), 0, 1));
    setScale(1);
    setPresentTime(1);
  };

  const deleteAllSpecies = async () => {
    if(!species) return;
    if(!confirm(await codeTextAlt("cnfrm01" + (species.descendants.length > 0 ? "_0" : ""), language, species.name))) return;
    setSpecies(undefined);
  };

  return (
    <>
      <nav style={{display: "flex", flexDirection: "row", width: "auto", position: species ? "fixed" : "static", backgroundColor: hexToRGBA(lineColor, 0.5), padding: 10}}>
        <div style={{justifyContent: "flex-start", flexDirection: "column", display: "flex", textAlign: "start"}}>
          <label>
            {codeText("nvlbl00", language)}: <input
              type="range"
              min={minScale}
              max={maxScale(presentTime)}
              step={minScale}
              value={maxScale(presentTime) - scale + minScale}
              onChange={(e) => setScale(maxScale(presentTime) - Number(e.target.value) + minScale)}
            /> {showScaleNumber && <input
              type="number"
              min={1}
              max={maxScale(presentTime)}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />}
          </label>
          <label>
          {codeText("nvlbl01", language)}: <input
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
          {codeText("nvlbl02", language)}: <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            />
          </label>
        </div>
        <div style={{width: 10}}/>
        <div style={{justifyContent: "flex-start", flexDirection: "column", display: "flex", textAlign: "start"}}>
          <label style={{ display: 'flex', alignItems: 'center', height: 25 }}>
          {codeText("nvlbl03", language)}: <a href="https://github.com/LUCHER4321/Phylo_Tree" target="_blank" style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }}>
              <img height={25} src="https://logo.clearbit.com/github.com"/>
            </a>
          </label>
          <label>
          {codeText("nvlbl04", language)}: <input
              type="file"
              accept=".json"
              onChange={async (e) => await setFromJson(e.target.files?.[0])}
            />
          </label>
          <div style={{display: "flex", flexDirection: "row"}}>
            <button type="button" onClick={async () => species ? deleteAllSpecies() : await createEmptySpecies()}>
              {codeText("nvbtn00" + (species ? "_0" : ""), language)}
            </button>
            <div style={{display: species ? "none" : "block"}}>
            </div>
            <div style={{width: 10}}/>
            <button type="button" onClick={showExample}>
              {codeText("nvbtn01", language)}
            </button>
            <div style={{width: 10}}/>
            <button onClick={async () => await species?.saveJSON()}>
              {codeText("nvbtn02", language)}
            </button>
          </div>
        </div>
        <div style={{width: 10}}/>
        <label>
          {codeText("nvlbl05", language)}: <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {Array.from(languages).map(([key, value]) => (
              <option value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </nav>
      {species && <div style={{height: 165}}/>}
      {species && <PhTree
        commonAncestor={species}
        language={language}
        width={window.screen.width * (species?.absoluteDuration() ?? 0) / scale}
        height={50}
        stroke={lineColor}
        format={scientificNotation}
        presentTime={presentTimeBoolean ? presentTime : undefined}
        padding={7.5}
        saveSpecies={saveSpecies}
        createDescendant={createDescendant}
        createAncestor={createAncestor}
        deleteAncestor={deleteAncestor}
        deleteSpecies={deleteSpecies}
      />}
    </>
  )
}

export default App
