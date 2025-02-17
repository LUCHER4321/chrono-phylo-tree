import { useState } from "react";
import { Species } from "./Species";

interface PhtreeProps {
    commonAncestor: Species;
    width?: number;
    height?: number;
    stroke?: string;
}

export const PhTree = (
    { commonAncestor, width = 1000, height = 1000, stroke = "white"}: PhtreeProps
) => {
    return (
        <div>
            <svg width={width} height={height}>
                {DrawTree(commonAncestor, -1, width / commonAncestor.absoluteDuration(), height / (commonAncestor.allDescendants().length - 1), stroke)}
            </svg>
        </div>
    );
};

const DrawTree = (species: Species, y: number, scaleX: number, scaleY: number, stroke = "white") => {
    const [showDesc, setShowDesc] = useState(true);

    const changeShowDesc = () => {
        setShowDesc(!showDesc);
    };

    const fa = species.firstAncestor();
    const all = fa.allDescendants();
    const spIndex = all.indexOf(species)
    const startX = (species.aparision - fa.aparision) * scaleX;
    const endX = startX + (showDesc ? species.duration : (species.absoluteExtinction() - species.aparision)) * scaleX;
    const endY = spIndex * scaleY;
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
                y={endY}
                x2={endX}
                stroke={stroke}
                changeShowDesc={changeShowDesc}
                showDesc={showDesc}
                padding={10}
            />
            {species.descendants.map((desc, index) => (
                <g style={{ display: showDesc ? 'block' : 'none' }} key={all.length + index}>
                    {DrawTree(desc, endY, scaleX, scaleY, stroke)}
                </g>
            ))}
        </g>
    );
};

interface HorizontalLineProps {
    species: Species;
    x1: number;
    x2: number;
    y: number;
    stroke: string;
    showDesc?: boolean;
    changeShowDesc?: () => void;
    padding?: number;
}

const HorizontalLine = ({species, x1, x2, y, stroke, showDesc = true, changeShowDesc = () => {}, padding = 0}: HorizontalLineProps) => {
    const all = species.firstAncestor().allDescendants();
    const index = (s: Species) => all.indexOf(s);
    const orientation = species.ancestor ? (index(species) > index(species.ancestor) ? -3 : 1) : 1;
    const lastOne = species.descendants.filter(desc => desc.aparision === species.extinction()).length === 0;
    const extinction = showDesc ? species.extinction() : species.absoluteExtinction();
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
                y={y + (padding + 5) * orientation}
                width={x2 - x1 - 2 * padding}
                height={50}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        {species.aparision}
                    </div>
                    <button style={{padding: 2.5}}>
                        {species.name}
                    </button>
                    {/*TODO: Menú de Especie*/}
                    {species.descendants.length > 0 ?
                        <button onClick={changeShowDesc} style={{padding: showDesc ? 10 : 5}}>
                            {(lastOne || !showDesc) ? extinction : " "}
                        </button> :
                        <div>
                            {extinction}
                        </div>
                    }
                </div>
            </foreignObject>
        </g>
    );
}