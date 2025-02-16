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
            <line
                x1={startX}
                y1={endY}
                x2={endX}
                y2={endY}
                stroke="white"
            />
            {species.descendants.map((desc, _) => {
                return DrawTree(desc, endY, scaleX, scaleY);
            })}
        </g>
    );
};