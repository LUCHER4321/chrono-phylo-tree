import { useState } from "react";
import { Species } from "./Species";
import { between } from "./between";

interface MenuProps {
    species: Species;
    open?: boolean;
    onClose?: () => void;
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
    deleteAncestor?: () => void;
    deleteSpecies?: () => void;
}

export const Menu = ({species, open, onClose, createDescendant, createAncestor, deleteAncestor, deleteSpecies}: MenuProps) => {
    const [name, setName] = useState(species.name);
    const [aparision, setAparision] = useState(species.aparision);
    const [duration, setDuration] = useState(species.duration);
    const [description, setDescription] = useState(species.description);
    const [addDescendant, setAddDescendant] = useState(false);
    const [addAncestor, setAddAncestor] = useState(false);

    const toggleAddDescendant = () => {
        setAddDescendant(!addDescendant);
    };

    const toggleAddAncestor = () => {
        setAddAncestor(!addAncestor);
    };

    const uniqueDescendant = (s: Species): boolean => {
        return s.ancestor ? s.ancestor.descendants.length === 1 && uniqueDescendant(s.ancestor) : true;
    }

    return(
        <Modal open={open} onClose={onClose}>
            <form style={{display: "flex", flexDirection: "column", textAlign: "start", width: "auto", position: "fixed", backgroundColor: "grey", padding: 10}}>
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
                        onChange={(e) => {
                            setAparision(species.ancestor ? between(Number(e.target.value), species.ancestor.aparision, species.ancestor.extinction()) : Number(e.target.value));
                            setDuration(species.descendants.length > 0 ? Math.max(Math.max(...species.descendants.map(desc => desc.aparision)) - aparision, duration) : duration);
                        }}
                    />
                </label>
                <label>
                    Duración: <input
                        type="number"
                        min={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.aparision)) - aparision : undefined}
                        value={duration}
                        onChange={(e) => setDuration(species.descendants.length > 0 ? Math.max(Math.max(...species.descendants.map(desc => desc.aparision)) - aparision, Number(e.target.value)) : Number(e.target.value))}
                    />
                </label>
                <label>
                    Descripción: <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value === "" ? undefined : e.target.value)}
                    />
                </label>
                <button onClick={() => {
                    species.name = name;
                    species.aparision = aparision;
                    species.duration = duration;
                    species.description = description;
                    onClose?.();
                }}>
                    Guardar
                </button>
                <button type="button" onClick={deleteSpecies}>
                    Eliminar
                </button>
                <button type="button" onClick={toggleAddDescendant}>
                    Crear descendiente
                </button>
                {addDescendant &&
                    <AddDescendant
                        species={species}
                        onClose={onClose}
                        createDescendant={createDescendant}
                    />}
                {species.ancestor ?
                    uniqueDescendant(species) &&
                    <button type="button" onClick={() => {
                        deleteAncestor?.();
                        onClose?.();
                    }}>
                        Quitar Ancestro{species.ancestor.ancestor ? "s" : ""}
                    </button> :
                    <button type="button" onClick={toggleAddAncestor}>
                        Crear ancestro
                    </button>}
                {addAncestor &&
                    <AddAncestor
                        species={species}
                        onClose={onClose}
                        createAncestor={createAncestor}
                    />}
                <button type="button" onClick={onClose}>
                    Cancelar
                </button>
            </form>
        </Modal>
    );
};

const AddDescendant = ({species, onClose, createDescendant}: MenuProps) => {
    const [name, setName] = useState('');
    const [afterAparision, setAfterAparision] = useState(0);
    const [duration, setDuration] = useState(0);
    const [description, setDescription] = useState('');

    return(
        <>
            <label>
                Nombre: <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Después de: <input
                    type="number"
                    min={0}
                    max={species.duration}
                    value={afterAparision}
                    onChange={(e) => setAfterAparision(Number(e.target.value))}
                />
            </label>
            <label>
                Duración: <input
                    type="number"
                    min={0}
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
            <button type="button" onClick={() => {
                createDescendant?.(species, name, afterAparision, duration, description);
                onClose?.();
            }}>
                Crear
            </button>
        </>
    );
};

const AddAncestor = ({species, onClose, createAncestor}: MenuProps) => {
    const [name, setName] = useState('');
    const [previousAparision, setPreviousAparision] = useState(0);
    const [duration, setDuration] = useState(0);
    const [description, setDescription] = useState('');

    return(
        <>
            <label>
                Nombre: <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Antes de: <input
                    type="number"
                    min={0}
                    value={previousAparision}
                    onChange={(e) => {
                        setPreviousAparision(Number(e.target.value));
                        setDuration(Math.max(Number(e.target.value), duration));
                    }}
                />
            </label>
            <label>
                Duración: <input
                    type="number"
                    min={previousAparision}
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
            <button type="button" onClick={() => {
                createAncestor?.(species, name, previousAparision, duration, description);
                onClose?.();
            }}>
                Crear
            </button>
        </>
    );
};

interface ModalProps {
    open?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
}

const Modal = ({open, onClose, children}: ModalProps) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.3s ease', // Ajusta la duración y el timing según sea necesario
                backgroundColor: open ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)',
                visibility: open ? 'visible' : 'hidden',
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{justifyContent: "center", alignItems: "center", display: "flex"}}
            >
                {children}
            </div>
        </div>
    );
};