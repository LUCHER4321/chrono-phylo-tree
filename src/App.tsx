import { useEffect, useState } from 'react'
import './App.css'
import { PhTree } from './components/PhTree'
import { Species } from './classes/Species'
import { between } from './utils/between';
import { codeTextAlt, getLanguageOptions } from './utils/translate';
import { Menu } from './components/Menu';
import { NavBar } from './components/NavBar';
import { scientificNotation } from './utils/scientificNotation';
import { hexToRGBA } from './utils/hexToRGBA';
import { example } from './utils/example';
import { createAncestor, createDescendant, deleteAncestor, deleteSpecies, saveSpecies } from './utils/updateSpecies';
import { setFromJson } from './utils/setFromJson';
import { HoverDescription } from './components/HoverDescription';

function App() {
  const [scale, setScale] = useState(1);
  const [species, setSpecies] = useState<Species | undefined>(undefined);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [lineColor, setLineColor] = useState("#7F7F7F");
  const [presentTime, setPresentTime] = useState<number>(1);
  const [presentTimeBoolean, setPresentTimeBoolean] = useState(true);
  const [chronoScale, setChronoScale] = useState(true);
  const [language, setLanguage] = useState("spanish");
  const [hoverPosition, setHoverPosition] = useState({x: 0, y: 0});
  const [showHover, setShowHover] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const languages = getLanguageOptions();
  const minScale = 1e-12;
  const offset = {x: 0, y: -50}

  useEffect(() => {
    const title = document.getElementById("title");
    if(title) {
      codeTextAlt("ttl", language).then((ttl) => title.textContent = ttl);
    }
  }, [language]);
  const showScaleNumber = false;

  const showExample = () => {
    setSpecies(() =>{
      if(presentTimeBoolean){
        setPresentTime(example.absoluteExtinction());
      }
      setScale(example.absoluteDuration());
      return example;
    });
  };

  const changePresentTime = (n: number) => {
    setPresentTime(n);
    setScale(between(scale, 1, maxScale(n)));
  };

  const maxScale = (n: number) => species ? Math.min(species.absoluteDuration(), presentTimeBoolean ? n - species.apparition : species.absoluteDuration()) : 1

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

  const handleMouseMove = (x: number, y: number) => {
    setHoverPosition({
      x: x,
      y: y,
    });
  };

  //document.addEventListener("mousemove", handleMouseMove);

  return (
    <>
      <NavBar
        species={species}
        color={hexToRGBA(lineColor, 0.5)}
        lineColor={lineColor}
        setLineColor={setLineColor}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
        minScale={minScale}
        maxScale={maxScale(presentTime)}
        scale={scale}
        setScale={setScale}
        chronoScale={chronoScale}
        setChronoScale={setChronoScale}
        showScaleNumber={showScaleNumber}
        showHover={showHover}
        setShowHover={setShowHover}
        showImages={showImages}
        setShowImages={setShowImages}
        presentTime={presentTime}
        setPresentTime={setPresentTime}
        setFromJson={setFromJson(setSpecies, setScale, setPresentTime, presentTimeBoolean)}
        presentTimeBoolean={presentTimeBoolean}
        setPresentTimeBoolean={setPresentTimeBoolean}
        changePresentTime={changePresentTime}
        deleteAllSpecies={deleteAllSpecies}
        createEmptySpecies={createEmptySpecies}
        showExample={showExample}
      />
      {species && <div className="h-155 sm:h-65"/>}
      {species && <PhTree
        commonAncestor={species}
        width={window.screen.width * (species?.absoluteDuration() ?? 0) / scale - 64}
        height={50}
        stroke={lineColor}
        format={scientificNotation}
        chronoScale={chronoScale}
        showImages={showImages}
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
              saveSpecies={saveSpecies(setSpecies, language)}
              createDescendant={createDescendant(setSpecies, language, presentTimeBoolean, setPresentTime, setScale)}
              createAncestor={createAncestor(setSpecies, language, presentTimeBoolean, setPresentTime, setScale)}
              deleteAncestor={deleteAncestor(sp, setSpecies, setScale, language)}
              deleteSpecies={deleteSpecies(sp, setSpecies, language)}
            />}
            {showHover && hoverSpecies && hoverSpecies.description &&
              <HoverDescription
                hoverPosition={hoverPosition}
                hoverSpecies={hoverSpecies}
                offset={offset}
              />
            }
          </>
        }
      </PhTree>}
    </>
  )
}

export default App
