import React, { useEffect, useState } from "react";
import { Species } from "./Species";

interface MultiplePhTreesProps {
    speciesList: Species[];
    width?: number;
    height?: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    chronoScale?: boolean;
    presentTime?: number;
    handleMouseMove?: (x: number, y: number) => void;
    children?: (
        species: Species | undefined,
        showMenu: boolean,
        toggleShowMenu: (species: Species) => void,
        hoverSpecies: Species | undefined
    ) => React.ReactNode;
}

export const MultiplePhTrees = (
    {
        speciesList,
        width = 1000,
        height = 50,
        padding = 0,
        stroke = "grey",
        format = (n) => n.toString(),
        chronoScale = true,
        presentTime,
        handleMouseMove,
        children
    }: MultiplePhTreesProps
) => {
    const copies = speciesList.map(sp => sp.copy());
    const lifeApparition = Math.min(...copies.map(sp => sp.apparition));
    const life = new Species(
        "",
        lifeApparition,
        Math.max(...copies.map(sp => sp.apparition - lifeApparition)),
        undefined,
        copies,
    );
    life.display = false;
    for(const sp of copies) {
        sp.ancestor = life;
    }
    return (
        <PhTree
            commonAncestor={life}
            width={width}
            height={height}
            padding={padding}
            stroke={stroke}
            format={format}
            chronoScale={chronoScale}
            presentTime={presentTime}
            handleMouseMove={handleMouseMove}
        >
            {(species, showMenu, toggleShowMenu, hoverSpecies) => children?.(species, showMenu, toggleShowMenu, hoverSpecies)}
        </PhTree>
    );
};

interface PhTreeProps {
    commonAncestor: Species;
    width?: number;
    height?: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    chronoScale?: boolean;
    presentTime?: number;
    handleMouseMove?: (x: number, y: number) => void;
    children?: (
        species: Species | undefined,
        showMenu: boolean,
        toggleShowMenu: (species: Species) => void,
        hoverSpecies: Species | undefined
    ) => React.ReactNode;
}

export const PhTree = (
    {
        commonAncestor,
        width = 1000,
        height = 50,
        padding = 0,
        stroke = "grey",
        format = (n) => n.toString(),
        chronoScale = true,
        presentTime,
        handleMouseMove,
        children
    }: PhTreeProps
) => {
    const [showMenu, setShowMenu] = useState(false);
    const [species, setSpecies] = useState<Species | undefined>(undefined);
    const [hoverSpecies, setHoverSpecies] = useState<Species | undefined>(undefined);
    const [showDesc, setShowDesc] = useState<Map<Species, boolean>>(commonAncestor.allDescendants().reduce((acc, desc) => acc.set(desc, true), new Map()));

    useEffect(() => {
        setShowDesc(commonAncestor.allDescendants().reduce((acc, desc) => acc.set(desc, true), new Map()));
    }, [commonAncestor]);

    const toggleShowMenu = (sp: Species) => {
        setSpecies(showMenu ? undefined : sp);
        setShowMenu(!showMenu);
    };

    const toggleShowDesc = (sp: Species) => {
        const newShowDesc = new Map(showDesc);
        newShowDesc.set(sp, !showDesc.get(sp));
        setShowDesc(newShowDesc);
    };

    const hoverShowMenu = (sp: Species | undefined) => {
        setHoverSpecies(sp);
    };

    const isPresentTimeDefined = presentTime !== undefined && chronoScale;

    return (
        <>
            <svg
                width={width * (isPresentTimeDefined ? (Math.min(presentTime, commonAncestor.absoluteExtinction()) - commonAncestor.apparition) / commonAncestor.absoluteDuration() : 1)}
                height={height * (1 + (isPresentTimeDefined ? commonAncestor.allDescendants().filter(desc => desc.apparition < presentTime).length : commonAncestor.allDescendants().length))}
                onMouseMove={(event) => {handleMouseMove?.(event.clientX, event.clientY)}}
            >
                <DrawTree
                    commonAncestor={commonAncestor}
                    species={commonAncestor}
                    y={-1}
                    scaleX={width / (chronoScale ? commonAncestor.absoluteDuration() : (Math.max(0, commonAncestor.stepsUntilLastDescendant()) + 1))}
                    scaleY={height}
                    padding={padding}
                    stroke={stroke}
                    format={format}
                    chronoScale={chronoScale}
                    presentTime={presentTime}
                    toggleShowMenu={toggleShowMenu}
                    hoverShowMenu={hoverShowMenu}
                    showDesc={showDesc}
                    changeShowDesc={toggleShowDesc}
                />
            </svg>
            {children?.(species, showMenu, toggleShowMenu, hoverSpecies)}
        </>
    );
};

interface DrawTreeProps {
    commonAncestor: Species;
    species: Species;
    y: number;
    scaleX: number;
    scaleY: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    chronoScale?: boolean;
    presentTime?: number;
    toggleShowMenu: (s: Species) => void;
    hoverShowMenu: (s: Species | undefined) => void;
    showDesc: Map<Species, boolean>;
    changeShowDesc: (s: Species) => void;
}

const DrawTree = ({
    commonAncestor,
    species,
    y,
    scaleX,
    scaleY,
    padding = 0,
    stroke = "grey",
    format = (n: number) => n.toString(),
    chronoScale = true,
    presentTime = undefined,
    toggleShowMenu,
    hoverShowMenu,
    showDesc,
    changeShowDesc
}: DrawTreeProps) => {
    const isPresentTimeDefined = presentTime !== undefined && chronoScale;
    const all = commonAncestor.allDescendants().filter(desc => isPresentTimeDefined ? desc.apparition < presentTime : true);
    const spIndex = all.indexOf(species);
    const startX = (chronoScale ? species.apparition - commonAncestor.apparition : (commonAncestor.stepsUntil(species) ?? 0)) * scaleX;
    const endX = startX + (chronoScale ? Math.min(showDesc.get(species) ? species.duration : species.absoluteDuration(), isPresentTimeDefined ? presentTime - species.apparition : species.absoluteDuration()) : 1) * scaleX;
    const endY = spIndex * scaleY;
    const descendants = species.descendants.filter(desc => isPresentTimeDefined ? desc.apparition < presentTime : true);
    const branchX = descendants.length > 0 ? startX + (Math.min(...descendants.map(desc => desc.apparition)) - species.apparition) * scaleX : endX;
    
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
            {species.display && <HorizontalLine
                commonAncestor={commonAncestor}
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
                chronoScale={chronoScale}
                presentTime={presentTime}
                toggleShowMenu={toggleShowMenu}
                hoverShowMenu={hoverShowMenu}
            />}
            {species.descendants.map((desc, index) => (
                <g style={{ display: (showDesc.get(species) && descendants.includes(desc)) ? 'block' : 'none' }} key={all.length + index}>
                    <DrawTree
                        commonAncestor={commonAncestor}
                        species={desc}
                        y={desc.display ? endY : -1}
                        scaleX={scaleX}
                        scaleY={scaleY}
                        padding={padding}
                        stroke={stroke}
                        format={format}
                        chronoScale={chronoScale}
                        presentTime={presentTime}
                        toggleShowMenu={toggleShowMenu}
                        showDesc={showDesc}
                        changeShowDesc={changeShowDesc}
                        hoverShowMenu={hoverShowMenu}
                    />
                </g>
            ))}
        </g>
    );
};

interface HorizontalLineProps {
    commonAncestor: Species;
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
    chronoScale?: boolean;
    presentTime?: number;
    toggleShowMenu: (s: Species) => void;
    hoverShowMenu: (s: Species | undefined) => void;
}

const HorizontalLine = ({
    commonAncestor,
    species,
    x1, x2, x0, y,
    stroke,
    showDesc = true,
    changeShowDesc = () => {},
    padding = 0,
    format = (n) => n.toString(),
    chronoScale = true,
    presentTime,
    toggleShowMenu,
    hoverShowMenu
}: HorizontalLineProps) => {
    const isPresentTimeDefined = presentTime !== undefined;
    const all = commonAncestor.allDescendants().filter(desc => isPresentTimeDefined ? desc.apparition < presentTime : true);
    const index = (s: Species) => all.indexOf(s);
    const orientation = species.ancestor ? (index(species) > index(species.ancestor) ? -3 : 1) : 1;
    const descendants = species.descendants.filter(desc => isPresentTimeDefined ? desc.apparition < presentTime : true);
    const lastOne = descendants.filter(desc => desc.apparition === species.extinction()).length === 0;
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
                width={(chronoScale ? x0 ?? x2 : x2) - x1 - 2 * padding}
                height={50}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        {chronoScale ? format(species.apparition) : ""}
                    </div>
                    <button
                        style={{padding: 2.5}}
                        onClick={() => toggleShowMenu(species)}
                        onMouseEnter={() => hoverShowMenu(species)}
                        onMouseLeave={() => hoverShowMenu(undefined)}
                    >
                        {species.name}
                    </button>
                    {descendants.length > 0 ?
                        <button onClick={changeShowDesc} style={{padding: showDesc ? 10 : 5}}>
                            {((lastOne || !showDesc) && (!x0 || x0 === x2)) ? extinction : ""}
                        </button> :
                        <div>
                            {chronoScale ? extinction : ""}
                        </div>
                    }
                </div>
            </foreignObject>
            {chronoScale && x0 && x0 < x2 && (
                <foreignObject
                    x={x0 + padding}
                    y={y + padding * orientation}
                    width={x2 - x0 - 2 * padding}
                    height={50}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", width: '100%' }}>
                        {(lastOne || !showDesc) && chronoScale ? extinction : ""}
                    </div>
                </foreignObject>)}
        </g>
    );
}