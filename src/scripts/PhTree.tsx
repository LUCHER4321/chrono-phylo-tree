import { useState } from "react";
import { Species } from "./Species";

interface PhtreeProps {
    commonAncestor: Species;
    width?: number;
    height?: number;
    stroke?: string;
    format?: (n: number) => string;
}

export const PhTree = (
    { commonAncestor, width = 1000, height = 1000, stroke = "white", format = (n) => n.toString()}: PhtreeProps
) => {
    return (
        <div>
            <svg width={width} height={height}>
                {DrawTree(commonAncestor, -1, width / commonAncestor.absoluteDuration(), height / (commonAncestor.allDescendants().length - 1), stroke, format)}
            </svg>
        </div>
    );
};

const DrawTree = (species: Species, y: number, scaleX: number, scaleY: number, stroke = "white", format = (n: number) => n.toString()) => {
    const [showDesc, setShowDesc] = useState(true);

    const changeShowDesc = () => {
        setShowDesc(!showDesc);
    };

    const fa = species.firstAncestor();
    const all = fa.allDescendants();
    const spIndex = all.indexOf(species)
    const startX = (species.aparision - fa.aparision) * scaleX;
    const endX = startX + (showDesc ? species.duration : species.absoluteDuration()) * scaleX;
    const endY = spIndex * scaleY;
    const branchX = species.descendants.length > 0 ? startX + (Math.min(...species.descendants.map(desc => desc.aparision)) - species.aparision) * scaleX : endX;
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
                padding={10}
                format={format}
            />
            {species.descendants.map((desc, index) => (
                <g style={{ display: showDesc ? 'block' : 'none' }} key={all.length + index}>
                    {DrawTree(desc, endY, scaleX, scaleY, stroke, format)}
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
}

const HorizontalLine = ({species, x1, x2, x0, y, stroke, showDesc = true, changeShowDesc = () => {}, padding = 0, format = (n) => n.toString()}: HorizontalLineProps) => {
    const all = species.firstAncestor().allDescendants();
    const index = (s: Species) => all.indexOf(s);
    const orientation = species.ancestor ? (index(species) > index(species.ancestor) ? -3 : 1) : 1;
    const lastOne = species.descendants.filter(desc => desc.aparision === species.extinction()).length === 0;
    const extinction = format(showDesc ? species.extinction() : species.absoluteExtinction());
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
                    <button style={{padding: 2.5}} onClick={() => console.log(species.allDescendants().map(s => s.name))}>
                        {species.name}
                    </button>
                    {/*TODO: Menú de Especie*/}
                    {species.descendants.length > 0 ?
                        <button onClick={changeShowDesc} style={{padding: showDesc ? 10 : 5}}>
                            {((lastOne || !showDesc) && (!x0 || x0 === x2)) ? extinction : " "}
                        </button> :
                        <div>
                            {extinction}
                        </div>
                    }
                </div>
            </foreignObject>
            {x0 && x0 !== x2 && (
                <foreignObject
                    x={x0 + padding}
                    y={y + (padding) * orientation}
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