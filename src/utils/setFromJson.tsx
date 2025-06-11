import { Species } from "../classes/Species";
import { SpeciesJSON } from "../types";

const handleFileChange = (file: File | undefined): Promise<SpeciesJSON> => {
    return new Promise((resolve, reject) => {
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonContent = JSON.parse(event.target?.result as string);
                    resolve(jsonContent);
                } catch (error) {
                    reject('Error parsing JSON');
                }
            };
            reader.onerror = () => {
            reject('Error reading file');
        };
        reader.readAsText(file);
        } else {
            reject('Please select a valid JSON file.');
        }
    });
};

export const setFromJson = (
    setSpecies: (species: Species | undefined) => void,
    setScale: (scale: number) => void,
    setPresentTime: (time: number) => void,
    presentTimeBoolean: boolean
) => async (file: File | undefined) => {
    setSpecies(undefined);
    const json = await handleFileChange(file);
    const newSpecies = Species.fromJSON(json);
    setSpecies(newSpecies);
    if(presentTimeBoolean){
      setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
};