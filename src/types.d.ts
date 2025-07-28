export type SpeciesJSON = {
    id?: string;
    name?: string;
    apparition?: number;
    duration?: number;
    description?: string;
    descendants?: SpeciesJSON[];
    afterApparition?: number;
    image?: string;
}