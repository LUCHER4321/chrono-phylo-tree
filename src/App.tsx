import React, { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { PhTree } from './scripts/PhTree'
import { Species } from './scripts/Species'
import { between } from './scripts/between';
import { codeText, codeTextAlt, getLanguageOptions } from './scripts/translate';
import { Menu } from './scripts/Menu';

function App() {
  const [scale, setScale] = useState(1);
  const [species, setSpecies] = useState<Species | undefined>(undefined);
  const [lineColor, setLineColor] = useState("#7F7F7F");
  const [presentTime, setPresentTime] = useState<number>(1);
  const [presentTimeBoolean, setPresentTimeBoolean] = useState(true);
  const [chronoScale, setChronoScale] = useState(true);
  const [language, setLanguage] = useState("spanish");
  const [hoverPosition, setHoverPosition] = useState({x: 0, y: 0});
  const [showHover, setShowHover] = useState(false);
  const languages = getLanguageOptions();
  const minScale = 1e-12;
  const offset = {x: 0, y: -50}

  useEffect(() => {
    const title = document.getElementById("title");
    if(title) {
      codeTextAlt("ttl", language).then((ttl) => title.textContent = ttl);
    }
  }, [language]);
  //*
  const root = new Species("Hominoidea", -25e6, 6e6);
  root.addDescendant("Hilobates", 6e6, 19e6);
  const child0 = root.addDescendant("Hominidae", 6e6, 6e6);
  child0.addDescendant("Pongo", 6e6, 13e6);
  const child1 = child0.addDescendant("Homininae", 6e6, 5e6);
  child1.addDescendant("Gorilla", 5e6, 8e6);
  const child2 = child1.addDescendant("Hominini", 5e6, 2e6);
  const child3 = child2.addDescendant("Pan", 2e6, 3e6);
  child3.addDescendant("Pan Troglodytes", 3e6, 3e6);
  child3.addDescendant("Pan Paniscus", 3e6, 3e6);
  child2.addDescendant("Homo", 2e6, 6e6);
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

  const saveSpecies = async (s: Species, name: string, apparition: number, duration: number, description?: string) => {
    if(duration <= 0){
      const alertText = await codeTextAlt("alert01", language, [name])
      alert(alert);
      throw new Error(alertText);
    }
    const newSpecies = s.copy();
    setSpecies(undefined);
    newSpecies.name = name;
    newSpecies.apparition = apparition;
    newSpecies.duration = duration;
    newSpecies.description = description === "" ? undefined : description;
    setSpecies(newSpecies.firstAncestor());
  };

  const createDescendant = async (s: Species, name: string, afterApparition: number, duration: number, description: string) => {
    if(duration <= 0){
      const alertText = await codeTextAlt("alert01", language, [name]);
      alert(alertText);
      throw new Error(alertText);
    }
    if(afterApparition < 0 || afterApparition > s.duration) {
      const alertText = await codeTextAlt("alert02", language, [name, s.apparition.toString(), s.extinction().toString(), s.name]);
      alert(alertText);
      throw new Error(alertText);
    }
    const newSpecies = s.addDescendant(name, afterApparition, duration, description, true).firstAncestor();
    //*
    setSpecies(undefined);
    if(presentTimeBoolean){
      setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
    setSpecies(newSpecies);
    //*/
  };

  const createAncestor = async (s: Species, name: string, previousApparition: number, duration: number, description: string) => {
    if(duration <= 0){
      const alertText = await codeTextAlt("alert01", language, [name])
      alert(alert);
      throw new Error(alertText);
    }
    if(previousApparition < 0 || duration < previousApparition) {
      const alertText = await codeTextAlt("alert02" + (duration < previousApparition) ? "_0" : "", language, [name, s.apparition.toString(), s.name]);
      alert(alertText);
      throw new Error(alertText);
    }
    const newSpecies = s.addAncestor(name, previousApparition, duration, description, true, true).firstAncestor();
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
    if(!confirm(await codeTextAlt("cnfrm00" + (sp.ancestor?.ancestor ? "_0" : ""), language, [sp.name]))) {
      return;
    }
    setSpecies(undefined);
    const removingAncestor = sp?.copy();
    removingAncestor.ancestor = undefined;
    setScale(removingAncestor.absoluteDuration());
    setSpecies(removingAncestor);
  };

  const deleteSpecies = async (sp: Species) => {
    if(!confirm(await codeTextAlt("cnfrm01" + (sp.descendants.length > 0 ? "_0" : ""), language, [sp.name]))) {
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
    return species ? Math.min(species.absoluteDuration(), presentTimeBoolean ? n - species.apparition : species.absoluteDuration()) : 1
  }

  const createEmptySpecies = async () => {
    setSpecies(new Species(await codeTextAlt("nvbtn01", language), 0, 1));
    setScale(1);
    setPresentTime(1);
  };

  const deleteAllSpecies = async () => {
    if(!species) return;
    if(!confirm(await codeTextAlt("cnfrm01" + (species.descendants.length > 0 ? "_0" : ""), language, [species.name]))) return;
    setSpecies(undefined);
  };

  const LanguageSelector = ({className = ""}: {className?: string}) => {
    return (
      <tr className={"text-start " + className}>
        <td>{codeText("nvlbl05", language)}:</td>
        <td>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-[#242424] rounded"
          >
            {Array.from(languages).map(([key, value], index) => (
              <option value={key} key={index}>
                {value}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  };

  const handleMouseMove = (x: number, y: number) => {
    setHoverPosition({
      x: x,
      y: y,
    });
  };

  //document.addEventListener("mousemove", handleMouseMove);

  return (
    <>
      <nav style={{
        backgroundColor: hexToRGBA(lineColor, 0.5),
        maxWidth: window.screen.width - 64,
        }}
        className={`flex flex-col sm:flex-row w-auto ${species ? "fixed" : "static"} p-2.5 box-border ${species ? "transform translate-z-0" : "transform-none"}`}
        >
        <table className="flex flex-col justify-start text-start">
          <tbody>
          <LanguageSelector className="block sm:hidden"/>
          <tr className="block sm:hidden h-2.5"/>
          <tr>
            <td>{codeText("nvlbl00", language)}: </td>
            <td>
              <input
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
            </td>
          </tr>
          <tr className="h-2.5"/>
          <tr>
            <td>{codeText("nvlbl06", language)}: </td>
            <td>
              <input
                type="checkbox"
                checked={chronoScale}
                onChange={(e) => setChronoScale(e.target.checked)}
              />
            </td>
          </tr>
          <tr className="h-2.5"/>
          <tr>
            <td>{codeText("nvlbl07", language)}: </td>
            <td>
              <input
                type="checkbox"
                checked={showHover}
                onChange={(e) => setShowHover(e.target.checked)}
              />
            </td>
          </tr>
          <tr className="h-2.5"/>
          <tr>
            <td>{codeText("nvlbl01", language)}: </td>
            <td>
              <input
                type="range"
                min={species ? species.apparition : 0}
                max={species ? species.absoluteExtinction() : 1}
                value={presentTime}
                onChange={(e) => changePresentTime(Number(e.target.value))}
                disabled={!presentTimeBoolean || !chronoScale}
              /> <input
                type="number"
                min={species ? species.apparition : 0}
                max={species ? species.absoluteExtinction() : 1}
                value={presentTime}
                onChange={(e) => changePresentTime(Number(e.target.value))}
                disabled={!presentTimeBoolean || !chronoScale}
              /> <input
                type="checkbox"
                checked={presentTimeBoolean}
                onChange={(e) => setPresentTimeBoolean(e.target.checked)}
                disabled={!chronoScale}
              />
            </td>
          </tr>
          </tbody>
        </table>
        <div className="h-2.5 sm:w-2.5 sm:h-auto"/>
        <table className="flex flex-col justify-start text-start">
          <tbody>
          <tr>
            <td>{codeText("nvlbl03", language)}: </td>
            <td>
              <a href="https://github.com/LUCHER4321/chrono-phylo-tree" target="_blank" className="ml-1.25 flex items-center">
                <img style={{maxHeight: 25}} src="https://logo.clearbit.com/github.com"/>
              </a>
            </td>
          </tr>
          <tr className="h-2.5"/>
          <tr>
            <td>{codeText("nvlbl04", language)}: </td>
            <td>
              <input
                type="file"
                accept=".json"
                value={undefined}
                onChange={async (e) => await setFromJson(e.target.files?.[0])}
              />
            </td>
          </tr>
          <tr className="h-2.5"/>
          <tr className="block sm:hidden">
            <td>{codeText("nvlbl02", language)}: </td>
            <td>
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
              />
            </td>
          </tr>
          </tbody>
          <tbody>
          <tr className="h-2.5 sm:h-auto"/>
          <tr className="flex flex-col sm:flex-row">
            <button type="button" onClick={async () => species ? deleteAllSpecies() : await createEmptySpecies()}>
              {codeText("nvbtn00" + (species ? "_0" : ""), language)}
            </button>
            <div className="h-2.5 sm:w-2.5 sm:h-auto"/>
            <button type="button" onClick={showExample}>
              {codeText("nvbtn01", language)}
            </button>
            <div className="h-2.5 sm:w-2.5 sm:h-auto"/>
            <button onClick={async () => await species?.saveJSON()} disabled={!species}>
              {codeText("nvbtn02", language)}
            </button>
          </tr>
          </tbody>
        </table>
        <div className="h-2.5 sm:w-2.5 sm:h-auto"/>
        <table className="flex flex-col justify-start text-start hidden sm:block">
          <tbody>
            <LanguageSelector/>
            <tr className="h-2.5"/>
            <tr>
              <td>{codeText("nvlbl02", language)}:</td>
              <td>
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </nav>
      {species && <div className="h-137.5 sm:h-40"/>}
      {species && <PhTree
        commonAncestor={species}
        width={window.screen.width * (species?.absoluteDuration() ?? 0) / scale - 64}
        height={50}
        stroke={lineColor}
        format={scientificNotation}
        chronoScale={chronoScale}
        presentTime={presentTimeBoolean ? presentTime : undefined}
        padding={1}
        handleMouseMove={handleMouseMove}
      >
        {(sp, showMenu, toggleShowMenu, hoverSpecies) => species &&
          <>
            {showMenu && sp && <Menu
              species={sp}
              language={language}
              open={showMenu}
              onClose={() => toggleShowMenu(sp)}
              saveSpecies={saveSpecies}
              createDescendant={createDescendant}
              createAncestor={createAncestor}
              deleteAncestor={() => deleteAncestor?.(sp)}
              deleteSpecies={() => deleteSpecies?.(sp)}
            />}
            {showHover && hoverSpecies && hoverSpecies.description &&
              <nav
                style={{
                  left: hoverPosition.x + offset.x,
                  top: hoverPosition.y - offset.y,
                }}
                className="absolute bg-gray-500 p-2.5"
              >
                <p>{hoverSpecies.name} ({scientificNotation(hoverSpecies.apparition)} — {scientificNotation(hoverSpecies.extinction())}):</p>
                <p>{hoverSpecies.description}</p>
              </nav>
            }
          </>
        }
      </PhTree>}
    </>
  )
}

export default App
