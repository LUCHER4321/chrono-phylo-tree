import { sortArray } from "multiple-sorting-array";

export class Species {
  name = "";
  apparition = 0;
  duration = 0;
  ancestor?: Species = undefined;
  descendants: Species[] = [];
  description?: string = undefined;
  display = true;
  image?: string = undefined;
  private onPosition = true;

  constructor(
    name = '',
    apparition = 0,
    duration = 0,
    ancestor: Species | undefined = undefined,
    descendants: Species[] = [],
    description: string | undefined = undefined,
    image: string | undefined = undefined,
  ) {
    if(duration <= 0){
      throw new Error("The duration of the species must be greater than 0");
    }
    this.name = name;
    this.apparition = apparition;
    this.duration = duration;
    this.ancestor = ancestor;
    this.descendants = descendants;
    this.description = description === "" ? undefined : description;
    this.image = image === "" ? undefined : image;
  }

  copy() : Species {
    const fa = this.firstAncestor();
    const n = fa.allDescendants().indexOf(this)
    const sp = Species.fromJSON(fa.toJSON());
    sp.onPosition = fa.onPosition;
    
    const invertPositon = (s: Species) => {
      for(const d of s.descendants){
        d.onPosition = !s.onPosition
        invertPositon(d);
      }
    };

    invertPositon(sp);
    return sp.allDescendants()[n];
  }

  addDescendant(
    name = '',
    afterApparition = 0,
    duration = 0,
    description: string | undefined = undefined,
    image: string | undefined = undefined,
    copy = false
  ) {
    if(afterApparition < 0 || afterApparition > this.duration) {
      throw new Error(`The apparition of the descendant must be between the apparition (${this.apparition}) and the extinction (${this.extinction()}) of the ancestor`);
    }
    const sp = copy ? this.copy() : this;
    const desc = new Species(
      name,
      sp.apparition + Math.max(afterApparition, 0),
      Math.max(duration, 0),
      sp,
      [],
      description,
      image
    );
    desc.onPosition = !this.onPosition;
    sp.descendants.push(desc);
    return copy ? sp : desc;
  }

  removeDescendant(desc: Species) {
    this.descendants = this.descendants.filter((d) => d !== desc);
  }

  addAncestor(
    name = '',
    previousApparition = 0,
    duration = 0,
    description: string | undefined = undefined,
    image: string | undefined = undefined,
    display = true,
    copy = false
  ) {
    if(previousApparition < 0) {
      throw new Error(`The apparition of the ancestor must be before or equal the apparition (${this.apparition}) of the descendant`);
    }
    if(duration < previousApparition){
      throw new Error(`The extiction of the ancestor must be after or equal the apparition (${this.apparition}) of the descendant`);
    }
    const sp = copy ? this.copy() : this;
    const anc = new Species(
      name,
      sp.apparition - Math.max(previousApparition, 0),
      duration,
      undefined,
      [sp],
      description
    );
    anc.display = display;
    anc.onPosition = !this.onPosition;
    sp.ancestor = anc;
    return copy ? sp : anc;
  }

  extinction() {
    return this.apparition + this.duration;
  }

  absoluteExtinction(): number {
    return this.descendants.length > 0
      ? Math.max(...this.descendants.map((desc) => desc.absoluteExtinction()))
      : this.extinction();
  }

  absoluteDuration() {
    return this.absoluteExtinction() - this.apparition;
  }

  firstAncestor(includeNotDisplay = false): Species {
    return this.ancestor ? ((this.ancestor.display || includeNotDisplay) ? this.ancestor.firstAncestor() : this) : this;
  }

  cousinsExtinction() {
    return this.firstAncestor().absoluteExtinction();
  }

  allDescendants(): Species[] {
    const desc = sortArray(this.descendants, s => -s.apparition, s => -s.absoluteExtinction());
    if (desc.length === 0) {
      return [this];
    }
    const limitDesc = desc.filter(desc => desc.apparition >= this.extinction());
    const prevDesc = desc.filter(desc => limitDesc.indexOf(desc) === -1);
    const halfFunc = this.onPosition ? Math.ceil : Math.floor;
    const half = halfFunc(limitDesc.length / 2);
    const lim0 = limitDesc.slice(0, half);
    const lim1 = limitDesc.slice(half);
    return lim0.flatMap((d) => d.allDescendants()).concat([this]).concat(lim1.flatMap((d) => d.allDescendants())).concat(prevDesc.flatMap((d) => d.allDescendants()));
  }

  stepsChain(desc: Species, includeNotDisplay = false): Species[] {
    if(!this.allDescendants().includes(desc)) {
      return [];
    }
    return [this as Species].concat(this.descendants.find(d => d.allDescendants().includes(desc))?.stepsChain(desc) ?? []).filter(d => d.display || includeNotDisplay);
  }

  stepsUntil(desc: Species, includeNotDisplay = false): number | undefined {
    if(!this.allDescendants().includes(desc)) {
      return;
    }
    return this.stepsChain(desc, includeNotDisplay).length - 1;
  }

  stepsUntilLastDescendant(icludeNotDisplay = false): number{
    if(this.descendants.length === 0) {
      return 0;
    }
    return Math.max(...this.allDescendants().filter(d => d.descendants.length === 0).map(d => this.stepsUntil(d, icludeNotDisplay) ?? 0));
  }

  toJSON(): SpeciesJSON {
    return {
      name: this.name,
      apparition: !this.ancestor ? this.apparition : undefined,
      afterApparition: this.ancestor ? this.apparition - this.ancestor.apparition : undefined,
      description: this.description,
      duration: this.duration,
      descendants: this.descendants.length > 0 ? this.descendants.map((desc) => desc.toJSON()) : undefined,
      image: this.image,
    };
  }

  async saveJSON(filename: string | undefined = undefined) {
    try{
      const jsonString = JSON.stringify(this.toJSON(), null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename ?? `${this.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch(errror) {
      console.error("Error saving file:", errror);
    }
  }

  static fromJSON(json: SpeciesJSON, ancestor?: Species): Species {
    const afterApparition = json.afterApparition ?? 0;
    const apparition = ancestor ? ancestor.apparition : json.apparition ?? 0;
    const sp = new Species(json.name ?? "", apparition + afterApparition, json.duration ?? 0, ancestor, [], json.description, json.image);
    if(json.descendants) {
      for (const desc of json.descendants) {
        sp.descendants.push(Species.fromJSON(desc, sp));
      }
    }
    return sp
  }
}

export interface SpeciesJSON {
  name: string;
  apparition?: number;
  duration?: number;
  description?: string;
  descendants?: SpeciesJSON[];
  afterApparition?: number;
  image?: string;
}