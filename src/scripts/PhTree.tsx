import { useState } from "react";
import { Species } from "./Species";
import { Menu } from "./Menu";

interface PhtreeProps {
    commonAncestor: Species;
    width?: number;
    height?: number;
    padding?: number;
    stroke?: string;
    format?: (n: number) => string;
    presentTime?: number;
}

export const PhTree = (
    { commonAncestor, width = 1000, height = 1000, padding = 0, stroke = "white", format = (n) => n.toString(), presentTime}: PhtreeProps
) => {
    const isPresentTimeDefined = presentTime !== undefined;
    return (
        <svg width={width * (isPresentTimeDefined ? (Math.min(presentTime, commonAncestor.absoluteExtinction()) - commonAncestor.aparision) / commonAncestor.absoluteDuration() : 1)} height={height * (isPresentTimeDefined ? commonAncestor.allDescendants().filter(desc => desc.aparision < presentTime).length / commonAncestor.allDescendants().length : 1)}>
            {DrawTree(commonAncestor, -1, width / commonAncestor.absoluteDuration(), height / (commonAncestor.allDescendants().length - 1), padding, stroke, format, presentTime)}
        </svg>
    );
};

const DrawTree = (species: Species, y: number, scaleX: number, scaleY: number, padding = 0, stroke = "white", format = (n: number) => n.toString(), presentTime: number | undefined = undefined) => {
    const [showDesc, setShowDesc] = useState(true);

    const changeShowDesc = () => {
        setShowDesc(!showDesc);
    };

    const isPresentTimeDefined = presentTime !== undefined;
    const fa = species.firstAncestor();
    const all = fa.allDescendants().filter(desc => isPresentTimeDefined ? desc.aparision < presentTime : true);
    const spIndex = all.indexOf(species)
    const startX = (species.aparision - fa.aparision) * scaleX;
    const endX = startX + Math.min(showDesc ? species.duration : species.absoluteDuration(), isPresentTimeDefined ? presentTime - species.aparision : species.absoluteDuration()) * scaleX;
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
                changeShowDesc={changeShowDesc}
                showDesc={showDesc}
                padding={padding}
                format={format}
                presentTime={presentTime}
            />
            {species.descendants.map((desc, index) => (
                <g style={{ display: (showDesc && descendants.includes(desc)) ? 'block' : 'none' }} key={all.length + index}>
                    {DrawTree(desc, endY, scaleX, scaleY, padding, stroke, format, presentTime)}
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
}

const HorizontalLine = ({species, x1, x2, x0, y, stroke, showDesc = true, changeShowDesc = () => {}, padding = 0, format = (n) => n.toString(), presentTime}: HorizontalLineProps) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

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
                    <button style={{padding: 2.5}} onClick={() => {
                        console.log(species.toJSON());
                        toggleShowMenu();
                        //species.saveJSON();
                    }}>
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
            {showMenu && (
                <foreignObject
                    x={x1 + padding}
                    y={y + 50 + padding * orientation}
                    width={x2 - x1 - 2 * padding}
                    height={200}
                >
                    <Menu species={species}/>
                </foreignObject>
            )}
        </g>
    );
}