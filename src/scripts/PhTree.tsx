import { Species } from "./Species";

interface PhtreeProps {
    commonAncestor: Species;
    width?: number;
    height?: number;
}

export const PhTree = (
    { commonAncestor, width = 1000, height = 1000}: PhtreeProps
) => {
    return (
        <div>
            <svg width={width} height={height}>
                {DrawTree(commonAncestor, 0, width / commonAncestor.absoluteExtinction(), height / (commonAncestor.allDescendants().length - 1))}
            </svg>
        </div>
    );
};

const DrawTree = (species: Species, y: number, scaleX: number, scaleY: number) => {
    const spIndex = species.firstAncestor().allDescendants().indexOf(species)
    const startX = species.aparision * scaleX;
    const endX = startX + species.duration * scaleX;
    const endY = spIndex * scaleY;
    return (
        <g key={spIndex}>
            {species.ancestor && (
                <line
                    x1={startX}
                    y1={y}
                    x2={startX}
                    y2={endY}
                    stroke="white"
                />
            )}
            <HorizontalLine
                species={species}
                x1={startX}
                y={endY}
                x2={endX}
                stroke="white"
                padding={10}
            />
            {species.descendants.map((desc, _) => {
                return DrawTree(desc, endY, scaleX, scaleY);
            })}
        </g>
    );
};

interface HorizontalLineProps {
    species: Species;
    x1: number;
    x2: number;
    y: number;
    stroke: string;
    padding?: number;
}

const HorizontalLine = ({species, x1, x2, y, stroke, padding = 0}: HorizontalLineProps) => {
    const all = species.firstAncestor().allDescendants()
    const index = (s: Species) => all.indexOf(s);
    const orientation = species.ancestor ? (index(species) > index(species.ancestor) ? -3 : 1) : 1;
    const lastOne = species.descendants.filter(desc => desc.aparision === species.extinction()).length === 0;
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
                width={x2 - x1 - 2 * padding}
                height={20}
            >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                        {species.aparision}
                    </div>
                    <div>
                        {species.name}
                    </div>
                    <div>
                        {lastOne ? species.extinction() : ""}
                    </div>
                </div>
            </foreignObject>
        </g>
    );
}