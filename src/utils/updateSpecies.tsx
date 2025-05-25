import { Species } from "../classes/Species";
import { codeTextAlt } from "./translate";

export const saveSpecies = (
    setSpecies: (sp?: Species) => void,
    language: string
) => async (
    s: Species,
    name: string,
    apparition: number,
    duration: number,
    description: string,
    image: string
) => {
    if(duration <= 0){
      const alertText = await codeTextAlt("alert01", language, [name])
      alert(alert);
      throw new Error(alertText);
    }
    const newSpecies = s.copy();
    setSpecies(undefined);
    newSpecies.name = name;
    newSpecies.apparition = apparition;
    newSpecies.duration = duration;
    newSpecies.description = description === "" ? undefined : description;
    newSpecies.image = image === "" ? undefined : image;
    setSpecies(newSpecies.firstAncestor());
};

export const createDescendant = (
    setSpecies: (sp?: Species) => void,
    language: string,
    presentTimeBoolean: boolean,
    setPresentTime: (time: number) => void,
    setScale: (scale: number) => void
) => async (
    s: Species,
    name: string,
    afterApparition: number,
    duration: number,
    description: string,
    image: string
) => {
    if(duration <= 0){
        const alertText = await codeTextAlt("alert01", language, [name]);
        alert(alertText);
        throw new Error(alertText);
    }
    if(afterApparition < 0 || afterApparition > s.duration) {
        const alertText = await codeTextAlt("alert02", language, [name, s.apparition.toString(), s.extinction().toString(), s.name]);
        alert(alertText);
        throw new Error(alertText);
    }
    const newSpecies = s.addDescendant(name, afterApparition, duration, description, image, true).firstAncestor();
    //*
    setSpecies(undefined);
    if(presentTimeBoolean){
        setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
    setSpecies(newSpecies);
    //*/
};

export const createAncestor = (
    setSpecies: (sp?: Species) => void,
    language: string,
    presentTimeBoolean: boolean,
    setPresentTime: (time: number) => void,
    setScale: (scale: number) => void
) => async (
    s: Species,
    name: string,
    previousApparition: number,
    duration: number,
    description: string,
    image: string
) => {
    if(duration <= 0){
        const alertText = await codeTextAlt("alert01", language, [name])
        alert(alert);
        throw new Error(alertText);
    }
    if(previousApparition < 0 || duration < previousApparition) {
        const alertText = await codeTextAlt("alert02" + (duration < previousApparition) ? "_0" : "", language, [name, s.apparition.toString(), s.name]);
        alert(alertText);
        throw new Error(alertText);
    }
    const newSpecies = s.addAncestor(name, previousApparition, duration, description, image, true, true).firstAncestor();
    //*
    setSpecies(undefined);
    if(presentTimeBoolean){
        setPresentTime(newSpecies.absoluteExtinction());
    }
    setScale(newSpecies.absoluteDuration());
    setSpecies(newSpecies);
    //*/
};

export const deleteAncestor = (
    sp: Species,
    setSpecies: (sp?: Species) => void,
    setScale: (scale: number) => void,
    language: string
) => async () => {
    if(!confirm(await codeTextAlt("cnfrm00" + (sp.ancestor?.ancestor ? "_0" : ""), language, [sp.name]))) {
        return;
    }
    setSpecies(undefined);
    const removingAncestor = sp?.copy();
    removingAncestor.ancestor = undefined;
    setScale(removingAncestor.absoluteDuration());
    setSpecies(removingAncestor);
};

export const deleteSpecies = (
    sp: Species,
    setSpecies: (sp?: Species) => void,
    language: string
) => async () => {
    if(!confirm(await codeTextAlt("cnfrm01" + (sp.descendants.length > 0 ? "_0" : ""), language, [sp.name]))) {
        return;
    }
    setSpecies(undefined);
    const removingSpecies = sp?.copy();
    const ancestor = removingSpecies?.ancestor;
    ancestor?.removeDescendant(removingSpecies);
    setSpecies(ancestor?.firstAncestor());
};