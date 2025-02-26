import { useEffect, useState } from "react";
import { Species } from "./Species";
import { Menu } from "./Menu";

interface PhtreeProps {
    commonAncestor: Species;
    language?: string;
    width?: number;
    height?: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    presentTime?: number;
    saveSpecies?: (
        s: Species,
        name: string,
        aparision: number,
        duration: number,
        description?: string
    ) => void;
    createDescendant?: (
        s: Species,
        name: string,
        afterAparision: number,
        duration: number,
        description: string
    ) => void;
    createAncestor?: (
        s: Species,
        name: string,
        previousAparision: number,
        duration: number,
        description: string
    ) => void;
    deleteAncestor?: (s: Species) => void;
    deleteSpecies?: (s: Species) => void;
}

export const PhTree = (
    { commonAncestor, language, width = 1000, height = 50, padding = 0, stroke = "grey", format = (n) => n.toString(), presentTime, saveSpecies, createDescendant, createAncestor, deleteAncestor, deleteSpecies}: PhtreeProps
) => {
    const [showMenu, setShowMenu] = useState(false);
    const [species, setSpecies] = useState<Species | undefined>(undefined);
    const [showDesc, setShowDesc] = useState<Map<Species, boolean>>(commonAncestor.allDescendants().reduce((acc, desc) => acc.set(desc, true), new Map()));

    useEffect(() => {
        setShowDesc(commonAncestor.allDescendants().reduce((acc, desc) => acc.set(desc, true), new Map()));
    }, [commonAncestor]);

    const toggleShowMenu = (species: Species) => {
        setSpecies(showMenu ? undefined : species);
        setShowMenu(!showMenu);
    };

    const toggleShowDesc = (species: Species) => {
        const newShowDesc = new Map(showDesc);
        newShowDesc.set(species, !showDesc.get(species));
        setShowDesc(newShowDesc);
    }

    const isPresentTimeDefined = presentTime !== undefined;

    return (
        <>
            <svg width={width * (isPresentTimeDefined ? (Math.min(presentTime, commonAncestor.absoluteExtinction()) - commonAncestor.aparision) / commonAncestor.absoluteDuration() : 1)} height={height * (1 + (isPresentTimeDefined ? commonAncestor.allDescendants().filter(desc => desc.aparision < presentTime).length : commonAncestor.allDescendants().length))}>
                <DrawTree
                    species={commonAncestor}
                    y={-1}
                    scaleX={width / (commonAncestor.absoluteDuration())}
                    scaleY={height}
                    padding={padding}
                    stroke={stroke}
                    format={format}
                    presentTime={presentTime}
                    toggleShowMenu={toggleShowMenu}
                    showDesc={showDesc}
                    changeShowDesc={toggleShowDesc}
                />
            </svg>
            {showMenu && species &&
                <Menu
                    species={species}
                    language={language}
                    open={showMenu}
                    onClose={() => toggleShowMenu(species)}
                    saveSpecies={saveSpecies}
                    createDescendant={createDescendant}
                    createAncestor={createAncestor}
                    deleteAncestor={() => deleteAncestor?.(species)}
                    deleteSpecies={() => deleteSpecies?.(species)}
                />}
        </>
    );
};

interface DrawTreeProps {
    species: Species;
    y: number;
    scaleX: number;
    scaleY: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    presentTime?: number;
    toggleShowMenu: (s: Species) => void;
    showDesc: Map<Species, boolean>;
    changeShowDesc: (s: Species) => void;
}

const DrawTree = ({species, y, scaleX, scaleY, padding = 0, stroke = "white", format = (n: number) => n.toString(), presentTime = undefined, toggleShowMenu, showDesc, changeShowDesc}: DrawTreeProps) => {
    const isPresentTimeDefined = presentTime !== undefined;
    const fa = species.firstAncestor();
    const all = fa.allDescendants().filter(desc => isPresentTimeDefined ? desc.aparision < presentTime : true);
    const spIndex = all.indexOf(species);
    const startX = (species.aparision - fa.aparision) * scaleX;
    const endX = startX + Math.min(showDesc.get(species) ? species.duration : species.absoluteDuration(), isPresentTimeDefined ? presentTime - species.aparision : species.absoluteDuration()) * scaleX;
    const endY = spIndex * scaleY;
    const descendants = species.descendants.filter(desc => isPresentTimeDefined ? desc.aparision < presentTime : true);
    const branchX = descendants.length > 0 ? startX + (Math.min(...descendants.map(desc => desc.aparision)) - species.aparision) * scaleX : endX;
    
    return (
        <g key={spIndex}>
            {y >= 0 && (
                <line
                    x1={startX}
                    y1={y}
                    x2={startX}
                    y2={endY}
                    stroke={stroke}
                />
            )}
            <HorizontalLine
                species={species}
                x1={startX}
                x2={endX}
                x0={branchX}
                y={endY}
                stroke={stroke}
                changeShowDesc={() => changeShowDesc(species)}
                showDesc={showDesc.get(species)}
                padding={padding}
                format={format}
                presentTime={presentTime}
                toggleShowMenu={toggleShowMenu}
            />
            {species.descendants.map((desc, index) => (
                <g style={{ display: (showDesc.get(species) && descendants.includes(desc)) ? 'block' : 'none' }} key={all.length + index}>
                    <DrawTree
                        species={desc}
                        y={endY}
                        scaleX={scaleX}
                        scaleY={scaleY}
                        padding={padding}
                        stroke={stroke}
                        format={format}
                        presentTime={presentTime}
                        toggleShowMenu={toggleShowMenu}
                        showDesc={showDesc}
                        changeShowDesc={changeShowDesc}
                    />
                </g>
            ))}
        </g>
    );
};

interface HorizontalLineProps {
    species: Species;
    x1: number;
    x2: number;
    x0?: number;
    y: number;
    stroke: string;
    showDesc?: boolean;
    changeShowDesc?: () => void;
    padding?: number;
    format?: (n: number) => string;
    presentTime?: number;
    toggleShowMenu: (s: Species) => void;
}

const HorizontalLine = ({species, x1, x2, x0, y, stroke, showDesc = true, changeShowDesc = () => {}, padding = 0, format = (n) => n.toString(), presentTime, toggleShowMenu}: HorizontalLineProps) => {
    const isPresentTimeDefined = presentTime !== undefined;
    const all = species.firstAncestor().allDescendants().filter(desc => isPresentTimeDefined ? desc.aparision < presentTime : true);
    const index = (s: Species) => all.indexOf(s);
    const orientation = species.ancestor ? (index(species) > index(species.ancestor) ? -3 : 1) : 1;
    const descendants = species.descendants.filter(desc => isPresentTimeDefined ? desc.aparision < presentTime : true);
    const lastOne = descendants.filter(desc => desc.aparision === species.extinction()).length === 0;
    const extinction = format(Math.min(showDesc ? species.extinction() : species.absoluteExtinction(), isPresentTimeDefined ? presentTime : species.absoluteExtinction()));
    return (
        <g>
            <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={stroke}
            />
            <foreignObject
                x={x1 + padding}
                y={y + (padding) * orientation}
                width={(x0 ?? x2) - x1 - 2 * padding}
                height={50}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        {format(species.aparision)}
                    </div>
                    <button style={{padding: 2.5}} onClick={() => toggleShowMenu(species)}>
                        {species.name}
                    </button>
                    {descendants.length > 0 ?
                        <button onClick={changeShowDesc} style={{padding: showDesc ? 10 : 5}}>
                            {((lastOne || !showDesc) && (!x0 || x0 === x2)) ? extinction : ""}
                        </button> :
                        <div>
                            {extinction}
                        </div>
                    }
                </div>
            </foreignObject>
            {x0 && x0 < x2 && (
                <foreignObject
                    x={x0 + padding}
                    y={y + padding * orientation}
                    width={x2 - x0 - 2 * padding}
                    height={50}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", width: '100%' }}>
                        {lastOne || !showDesc ? extinction : ""}
                    </div>
                </foreignObject>)}
        </g>
    );
}