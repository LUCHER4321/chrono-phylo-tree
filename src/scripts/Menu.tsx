import { useState } from "react";
import { Species } from "./Species";
import { between } from "./between";
import { codeText } from "./translate";

interface MenuProps {
    species: Species;
    language?: string;
    open?: boolean;
    onClose?: () => void;
    saveSpecies?: (
        s: Species,
        name: string,
        apparition: number,
        duration: number,
        description?: string
    ) => void;
    createDescendant?: (
        s: Species,
        name: string,
        afterApparition: number,
        duration: number,
        description: string
    ) => void;
    createAncestor?: (
        s: Species,
        name: string,
        previousApparition: number,
        duration: number,
        description: string
    ) => void;
    deleteAncestor?: () => void;
    deleteSpecies?: () => void;
}

export const Menu = ({species, language, open, onClose, saveSpecies, createDescendant, createAncestor, deleteAncestor, deleteSpecies}: MenuProps) => {
    const [name, setName] = useState(species.name);
    const [apparition, setApparition] = useState(species.apparition);
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
            <form style={{backgroundColor: "grey"}} className="flex flex-col text-start w-auto fixed p-2.5">
                <Data
                    name={name}
                    setName={setName}
                    apparition={apparition}
                    setApparition={(n) => {
                        setApparition(species.ancestor ? between(n, species.ancestor.apparition, species.ancestor.extinction()) : n);
                        setDuration(species.descendants.length > 0 ? Math.max(Math.max(...species.descendants.map(desc => desc.apparition)) - apparition, duration) : duration);
                    }}
                    minApparition={species.ancestor ? species.ancestor.apparition : undefined}
                    maxApparition={species.ancestor ? species.ancestor.extinction() : undefined}
                    duration={duration}
                    setDuration={setDuration}
                    minDuration={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.apparition)) - apparition : undefined}
                    maxDuration={species.descendants.length > 0 ? Math.max(...species.descendants.map(desc => desc.apparition)) - apparition : undefined}
                    description={description}
                    setDescription={setDescription}
                    language={language}
                >
                    <button onClick={async () => {
                        try{
                            await saveSpecies?.(species, name, apparition, duration, description);
                            onClose?.();
                        } catch(e) {
                            console.error(e);
                        }
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
                        <button type="button" onClick={async () => {
                            try {
                                await deleteAncestor?.();
                                onClose?.();
                            } catch(e){
                                console.error(e);
                            }
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
    apparition: number;
    setApparition: (apparition: number) => void;
    minApparition?: number;
    maxApparition?: number;
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
    apparition,
    setApparition,
    minApparition,
    maxApparition,
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
            <table>
                <tbody>
                    <tr>
                        <td>{codeText("splbl00", language ?? "")}:</td>
                        <td>
                            <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{codeText("splbl01", language ?? "")}:</td>
                        <td>
                            <input
                                type="number"
                                min={minApparition}
                                max={maxApparition}
                                value={apparition}
                                onChange={(e) => setApparition(Number(e.target.value))}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{codeText("splbl02", language ?? "")}:</td>
                        <td>
                            <input
                                type="number"
                                min={minDuration}
                                max={maxDuration}
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{codeText("splbl03", language ?? "")}:</td>
                        <td>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </td>
                         
                    </tr>
                </tbody>
            </table>
            {children}
        </>
    );
};

const AddDescendant = ({species, language, onClose, createDescendant}: MenuProps) => {
    const [name, setName] = useState('');
    const [afterApparition, setAfterApparition] = useState(species.duration);
    const [duration, setDuration] = useState(species.duration);
    const [description, setDescription] = useState('');

    return(
        <>
            <Data
                name={name}
                setName={setName}
                apparition={species.apparition + afterApparition}
                setApparition={(n) => setAfterApparition(n - species.apparition)}
                minApparition={species.apparition}
                maxApparition={species.extinction()}
                duration={duration}
                setDuration={setDuration}
                description={description}
                setDescription={setDescription}
                language={language}
            >
                <button type="button" onClick={async () => {
                    try{
                        await createDescendant?.(species, name, afterApparition, duration, description);
                        onClose?.();
                    } catch(e) {
                        console.error(e);
                    }
                }}>
                    {codeText("cdbtn00", language ?? "")}
                </button>
            </Data>
        </>
    );
};

const AddAncestor = ({species, language, onClose, createAncestor}: MenuProps) => {
    const [name, setName] = useState('');
    const [previousApparition, setPreviousApparition] = useState(species.duration);
    const [duration, setDuration] = useState(species.duration);
    const [description, setDescription] = useState('');

    return(
        <>
            <Data
                name={name}
                setName={setName}
                apparition={species.apparition - previousApparition}
                setApparition={(n) => {
                    setPreviousApparition(species.apparition - n);
                    setDuration(Math.max(species.apparition - n, duration));
                }}
                maxApparition={species.apparition}
                duration={duration}
                setDuration={setDuration}
                minDuration={previousApparition}
                description={description}
                setDescription={setDescription}
                language={language}
            >
                <button type="button" onClick={async () => {
                    try {
                        await createAncestor?.(species, name, previousApparition, duration, description);
                        onClose?.();
                    } catch (e) {
                        console.error(e);
                    }
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
            style={{backgroundColor: open ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0)',}}
            className={`flex fixed inset-0 justify-center items-center transition-colors duration-300 ease-in-out ${open ? "visible" : "hidden"}`}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex justify-center items-center"
            >
                {children}
            </div>
        </div>
    );
};