import { Species } from "../classes/Species";
import { codeText } from "../utils/translate";
import { LanguageSelector } from "./LanguageSelector";

export const NavBar = ({
    species,
    color,
    lineColor,
    setLineColor,
    language,
    languages,
    setLanguage,
    minScale = 1e-12,
    maxScale,
    scale,
    setScale,
    showScaleNumber,
    chronoScale,
    setChronoScale,
    showHover,
    setShowHover,
    showImages,
    setShowImages,
    presentTime,
    presentTimeBoolean,
    setPresentTimeBoolean,
    changePresentTime,
    setFromJson,
    deleteAllSpecies,
    createEmptySpecies,
    showExample
}: NavBarProps) => {
    return (
        <nav style={{
            backgroundColor: color,
            maxWidth: window.screen.width - 64,
            }}
            className={`flex flex-col sm:flex-row w-auto ${species ? "fixed" : "static"} p-2.5 box-border ${species ? "transform translate-z-0" : "transform-none"}`}
        >
            <table className="flex flex-col justify-start text-start">
                <tbody>
                    <LanguageSelector
                        className="block sm:hidden"
                        languages={languages}
                        language={language}
                        setLanguage={setLanguage}
                    />
                    <tr className="block sm:hidden h-2.5"/>
                    <tr>
                        <td>{codeText("nvlbl00", language)}: </td>
                        <td>
                            <input
                                type="range"
                                min={minScale}
                                max={maxScale}
                                step={minScale}
                                value={maxScale - scale + minScale}
                                onChange={(e) => setScale(maxScale - Number(e.target.value) + minScale)}
                            /> {showScaleNumber && <input
                                type="number"
                                min={1}
                                max={maxScale}
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
                        <td>{codeText("nvlbl08", language)}</td>
                        <td>
                            <input
                                type="checkbox"
                                checked={showImages}
                                onChange={(e) => setShowImages(e.target.checked)}
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
                                <img style={{maxHeight: 25}} src="https://img.logo.dev/github.com?token=pk_VXzZR_o_QTelazRSvSRkNw&format=png"/>
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
                    <LanguageSelector
                        languages={languages}
                        language={language}
                        setLanguage={setLanguage}
                    />
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
    );
}

interface NavBarProps {
    species?: Species;
    color: string;
    lineColor: string;
    setLineColor: (lineColor: string) => void;
    language: string;
    languages: Map<string, string>;
    setLanguage: (language: string) => void;
    minScale?: number;
    maxScale: number;
    scale: number;
    setScale: (scale: number) => void;
    showScaleNumber: boolean;
    chronoScale: boolean;
    setChronoScale: (chronoScale: boolean) => void;
    showHover: boolean;
    setShowHover: (showHover: boolean) => void;
    showImages: boolean;
    setShowImages: (showImages: boolean) => void;
    presentTime: number;
    setPresentTime: (presentTime: number) => void;
    presentTimeBoolean: boolean;
    setPresentTimeBoolean: (presentTimeBoolean: boolean) => void;
    changePresentTime: (presentTime: number) => void;
    setFromJson: (file: File | undefined) => Promise<void>;
    deleteAllSpecies: () => void;
    createEmptySpecies: () => Promise<void>;
    showExample: () => void;
}