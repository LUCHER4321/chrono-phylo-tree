import { useState } from "react";
import { Species } from "./Species";
import { between } from "./between";
import { codeText } from "./translate";

interface MenuProps {
    species: Species;
    language?: string;
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

export const Menu = ({species, language, open, onClose, createDescendant, createAncestor, deleteAncestor, deleteSpecies}: MenuProps) => {
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
                <Data
                    name={name}
                    setName={setName}
                    aparision={aparision}
                    setAparision={(n) => {
                        setAparision(species.ancestor ? between(n, species.ancestor.aparision, species.ancestor.extinction()) : n);
                        setDuration(species.descendants.length > 0 ? Math.max(Math.max(...species.descendants.map(desc => desc.aparision)) - aparision, duration) : duration);
                    }}
                    minAparision={species.ancestor ? species.ancestor.aparision : undefined}
                    maxAparision={species.ancestor ? species.ancestor.extinction() : undefined}
                    duration={duration}
                    setDuration={setDuration}
                    minDuration={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.aparision)) - aparision : undefined}
                    maxDuration={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.aparision)) - aparision : undefined}
                    description={description}
                    setDescription={setDescription}
                    language={language}
                >
                    <button onClick={() => {
                        species.name = name;
                        species.aparision = aparision;
                        species.duration = duration;
                        species.description = description;
                        onClose?.();
                    }}>
                        {codeText("spbtn00", language ?? "")}
                    </button>
                    <button type="button" onClick={deleteSpecies}>
                        {codeText("spbtn01", language ?? "")}
                    </button>
                    <button type="button" onClick={toggleAddDescendant}>
                        {codeText("spbtn02", language ?? "")}
                    </button>
                    {addDescendant &&
                        <AddDescendant
                            species={species}
                            language={language}
                            onClose={onClose}
                            createDescendant={createDescendant}
                        />}
                    {species.ancestor ?
                        uniqueDescendant(species) &&
                        <button type="button" onClick={() => {
                            deleteAncestor?.();
                            onClose?.();
                        }}>
                            {codeText("spbtn04" + (species.ancestor.ancestor ? "_0" : ""), language ?? "")}
                        </button> :
                        <button type="button" onClick={toggleAddAncestor}>
                            {codeText("spbtn03", language ?? "")}
                        </button>}
                    {addAncestor &&
                        <AddAncestor
                            species={species}
                            language={language}
                            onClose={onClose}
                            createAncestor={createAncestor}
                        />}
                    <button type="button" onClick={onClose}>
                        {codeText("spbtn05", language ?? "")}
                    </button>
                </Data>
            </form>
        </Modal>
    );
};

interface DataProps {
    name: string;
    setName: (name: string) => void;
    aparision: number;
    setAparision: (aparision: number) => void;
    minAparision?: number;
    maxAparision?: number;
    duration: number;
    setDuration: (duration: number) => void;
    minDuration?: number;
    maxDuration?: number;
    description?: string;
    setDescription: (description: string) => void;
    language?: string;
    children?: React.ReactNode;
}

const Data = ({
    name,
    setName,
    aparision,
    setAparision,
    minAparision,
    maxAparision,
    duration,
    setDuration,
    minDuration,
    maxDuration,
    description,
    setDescription,
    language,
    children
}: DataProps) => {
    return (
        <>
            <label>
                {codeText("splbl00", language ?? "")}: <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                {codeText("splbl01", language ?? "")}: <input
                    type="number"
                    min={minAparision}
                    max={maxAparision}
                    value={aparision}
                    onChange={(e) => setAparision(Number(e.target.value))}
                />
            </label>
            <label>
                {codeText("splbl02", language ?? "")}: <input
                    type="number"
                    min={minDuration}
                    max={maxDuration}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                />
            </label>
            <label>
                {codeText("splbl03", language ?? "")}: <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            {children}
        </>
    );
};

const AddDescendant = ({species, language, onClose, createDescendant}: MenuProps) => {
    const [name, setName] = useState('');
    const [afterAparision, setAfterAparision] = useState(species.duration);
    const [duration, setDuration] = useState(0);
    const [description, setDescription] = useState('');

    return(
        <>
            <Data
                name={name}
                setName={setName}
                aparision={species.aparision + afterAparision}
                setAparision={(n) => setAfterAparision(n - species.aparision)}
                minAparision={species.aparision}
                maxAparision={species.extinction()}
                duration={duration}
                setDuration={setDuration}
                description={description}
                setDescription={setDescription}
                language={language}
            >
                <button type="button" onClick={() => {
                    createDescendant?.(species, name, afterAparision, duration, description);
                    onClose?.();
                }}>
                    {codeText("cdbtn00", language ?? "")}
                </button>
            </Data>
        </>
    );
};

const AddAncestor = ({species, language, onClose, createAncestor}: MenuProps) => {
    const [name, setName] = useState('');
    const [previousAparision, setPreviousAparision] = useState(0);
    const [duration, setDuration] = useState(0);
    const [description, setDescription] = useState('');

    return(
        <>
            <Data
                name={name}
                setName={setName}
                aparision={species.aparision - previousAparision}
                setAparision={(n) => {
                    setPreviousAparision(species.aparision - n);
                    setDuration(Math.max(species.aparision - n, duration));
                }}
                maxAparision={species.aparision}
                duration={duration}
                setDuration={setDuration}
                minDuration={previousAparision}
                description={description}
                setDescription={setDescription}
                language={language}
            >
                <button type="button" onClick={() => {
                    createAncestor?.(species, name, previousAparision, duration, description);
                    onClose?.();
                }}>
                    {codeText("cdbtn00", language ?? "")}
                </button>
            </Data>
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