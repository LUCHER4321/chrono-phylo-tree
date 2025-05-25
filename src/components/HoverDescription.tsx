import { Species } from "../classes/Species";
import { scientificNotation } from "../utils/scientificNotation";

export const HoverDescription = ({
    hoverPosition,
    hoverSpecies,
    offset = { x: 0, y: 50 }
} : HoverDescriptionProps) => {
    return (
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
    );
};

interface HoverDescriptionProps {
    hoverPosition: { x: number; y: number };
    hoverSpecies: Species;
    offset?: { x: number; y: number };
}