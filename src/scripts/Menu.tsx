import { useState } from "react";
import { Species } from "./Species";

interface MenuProps {
    species: Species;
}

export const Menu = ({species}: MenuProps) => {
    const [name, setName] = useState(species.name);
    const [aparision, setAparision] = useState(species.aparision);
    const [duration, setDuration] = useState(species.duration);
    const [description, setDescription] = useState(species.description);
    return(
        <nav style={{display: "flex", flexDirection: "column", textAlign: "start", width: "auto", position: "fixed", backgroundColor: "rgba(127, 127, 127, 0.5)", padding: 10}}>
            <label>
                Nombre: <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Aparición: <input
                    type="number"
                    min={species.ancestor ? species.ancestor.aparision : undefined}
                    max={species.ancestor ? species.ancestor.extinction() : undefined}
                    value={aparision}
                    onChange={(e) => setAparision(Number(e.target.value))}
                />
            </label>
            <label>
                Duración: <input
                    type="number"
                    min={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.aparision)) - aparision : undefined}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                />
            </label>
            <label>
                Descripción: <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            {/*TODO: Crear descendiente*/}
            <button onClick={() => {
                species.name = name;
                species.aparision = aparision;
                species.duration = duration;
                species.description = description;
            }}>
                Guardar
            </button>
        </nav>
    );
};