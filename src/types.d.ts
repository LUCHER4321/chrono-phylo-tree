export interface SpeciesJSON {
    name: string;
    apparition?: number;
    duration?: number;
    description?: string;
    descendants?: SpeciesJSON[];
    afterApparition?: number;
    image?: string;
}