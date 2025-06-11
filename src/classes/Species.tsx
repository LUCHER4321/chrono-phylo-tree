import { sortArray } from "multiple-sorting-array";
import { SpeciesJSON } from "../types";

export class Species {
  name = "";
  apparition = 0;
  duration = 0;
  ancestor?: Species = undefined;
  descendants: Species[] = [];
  description?: string = undefined;
  display = true;
  image?: string = undefined;

  private onPosition(ret = true) {
    if(!ret) return ret;
    return this.firstAncestor().stepsUntil(this)! % 2 === 0;
  }

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
    const n = fa.allDescendants(false).indexOf(this)
    const sp = Species.fromJSON(fa.toJSON());
    return sp.allDescendants(false)[n];
  }

  unlinkAncestor(): [Species, Species] | undefined {
    if(!this.ancestor) {
      return;
    }
    this.ancestor.descendants = this.ancestor.descendants.filter((d) => d !== this);
    const exAncestor = this.ancestor;
    this.ancestor = undefined;
    return [exAncestor.firstAncestor(), this];
  }

  unlinkDescendant(descendant: Species): [Species, Species] | undefined {
    if(!this.descendants.includes(descendant)) {
      return;
    }
    this.descendants = this.descendants.filter((d) => d !== descendant);
    descendant.ancestor = undefined;
    return [this.firstAncestor(), descendant];
  }

  linkAncestor(ancestor: Species) {
    if(this.ancestor === ancestor && ancestor.descendants.includes(this)) {
      return;
    }
    if(ancestor.apparition > this.apparition) {
      throw new Error(`The ancestor's apparition (${ancestor.apparition}) must be before or equal the descendant's apparition (${this.apparition})`);
    }
    if(ancestor.extinction() < this.apparition) {
      throw new Error(`The ancestor's extinction (${ancestor.extinction()}) must be after or equal the descendant's apparition (${this.apparition})`);
    }
    if(this.ancestor !== ancestor) {
      this.unlinkAncestor();
    }
    this.ancestor = ancestor;
    ancestor.descendants.push(this);
  }

  linkDescendant(descendant: Species) {
    if(descendant.ancestor === this && this.descendants.includes(descendant)) {
      return;
    }
    if(descendant.apparition < this.apparition) {
      throw new Error(`The descendant's apparition (${descendant.apparition}) must be after or equal the ancestor's apparition (${this.apparition})`);
    }
    if(descendant.extinction() > this.extinction()) {
      throw new Error(`The descendant's extinction (${descendant.extinction()}) must be before or equal the ancestor's extinction (${this.extinction()})`);
    }
    if(this.descendants.includes(descendant)) {
      return;
    }
    if(descendant.ancestor) {
      descendant.unlinkAncestor();
    }
    this.descendants.push(descendant);
    descendant.ancestor = this;
  }

  linkDescendants(descendants: Species[]) {
    for(const desc of descendants) {
      try {
        this.linkDescendant(desc);
      } catch (error) {
        console.error(`Error linking descendant ${desc.name} to ancestor ${this.name}:`, error);
      }
    }
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
      undefined,
      [],
      description,
      image
    );
    desc.linkAncestor(sp);
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
      [],
      description,
      image
    );
    anc.display = display;
    sp.linkAncestor(anc);
    return copy ? sp : anc;
  }

  extinction() {
    return this.apparition + this.duration;
  }

  absoluteExtinction(): number {
    return this.descendants.length > 0
        ? Math.max(...this.allDescendants(false).map((desc) => desc.extinction()))
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

  allDescendants(sort = true): Species[] {
    const desc = sort ? sortArray(this.descendants, s => -s.apparition, s => -s.absoluteExtinction()) : this.descendants;
    if (desc.length === 0) {
      return [this];
    }
    const limitDesc = desc.filter(desc => desc.apparition >= this.extinction());
    const prevDesc = desc.filter(desc => limitDesc.indexOf(desc) === -1);
    const halfFunc = this.onPosition(sort) ? Math.ceil : Math.floor;
    const half = halfFunc(limitDesc.length / 2);
    const lim0 = limitDesc.slice(0, half);
    const lim1 = limitDesc.slice(half);
    return lim0.flatMap((d) => d.allDescendants(sort)).concat([this]).concat(lim1.flatMap((d) => d.allDescendants(sort))).concat(prevDesc.flatMap((d) => d.allDescendants(sort)));
  }

  stepsChain(desc: Species, includeNotDisplay = false): Species[] {
    if(!this.allDescendants(false).includes(desc)) {
      return [];
    }
    return [this as Species].concat(this.descendants.find(d => d.allDescendants(false).includes(desc))?.stepsChain(desc) ?? []).filter(d => d.display || includeNotDisplay);
  }

  stepsUntil(desc: Species, includeNotDisplay = false): number | undefined {
    if(!this.allDescendants(false).includes(desc)) {
      return;
    }
    return this.stepsChain(desc, includeNotDisplay).length - 1;
  }

  stepsUntilLastDescendant(icludeNotDisplay = false): number{
    if(this.descendants.length === 0) {
      return 0;
    }
    return Math.max(...this.allDescendants(false).filter(d => d.descendants.length === 0).map(d => this.stepsUntil(d, icludeNotDisplay) ?? 0));
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