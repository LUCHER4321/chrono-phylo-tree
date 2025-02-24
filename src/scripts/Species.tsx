export class Species {
  name = "";
  aparision = 0;
  duration = 0;
  ancestor?: Species = undefined;
  descendants: Species[] = [];
  description?: string = undefined;
  display = true;

  constructor(
    name = '',
    aparision = 0,
    duration = 0,
    ancestor?: Species,
    descendants: Species[] = [],
    description: string | undefined = undefined
  ) {
    this.name = name;
    this.aparision = aparision;
    this.duration = duration;
    this.ancestor = ancestor;
    this.descendants = descendants;
    this.description = description;
  }

  copy() : Species {
    const fa = this.firstAncestor();
    const n = fa.allDescendants().indexOf(this)
    const sp = Species.fromJSON(fa.toJSON());
    return sp.allDescendants()[n];
  }

  addDescendant(
    name = '',
    afterAparision = 0,
    duration = 0,
    description: string | undefined = undefined,
    copy = false
  ) {
    const sp = copy ? this.copy() : this;
    const desc = new Species(
      name,
      sp.aparision + Math.max(afterAparision, 0),
      Math.max(duration, 0),
      sp,
      [],
      description
    );
    sp.descendants.push(desc);
    return copy ? sp : desc;
  }

  removeDescendant(desc: Species) {
    this.descendants = this.descendants.filter((d) => d !== desc);
  }

  addAncestor(
    name = '',
    previousAparision = 0,
    duration = 0,
    description: string | undefined = undefined,
    display = true,
    copy = false
  ) {
    const sp = copy ? this.copy() : this;
    const anc = new Species(
      name,
      sp.aparision - Math.max(previousAparision, 0),
      duration,
      undefined,
      [sp],
      description
    );
    anc.display = display;
    sp.ancestor = anc;
    return copy ? sp : anc;
  }

  extinction() {
    return this.aparision + this.duration;
  }

  absoluteExtinction(): number {
    return this.descendants.length > 0
      ? Math.max(...this.descendants.map((desc) => desc.absoluteExtinction()))
      : this.extinction();
  }

  absoluteDuration(): number {
    return this.absoluteExtinction() - this.aparision;
  }

  firstAncestor(includeNotDisplay = false): Species {
    return this.ancestor ? ((this.ancestor.display || includeNotDisplay) ? this.ancestor.firstAncestor() : this) : this;
  }

  cousinsExtinction() {
    return this.firstAncestor().absoluteExtinction();
  }

  allDescendants(): Species[] {
    const desc = this.descendants.sort((a, b) => (a.aparision === b.aparision) ? (b.absoluteExtinction() - a.absoluteExtinction()) : (b.aparision - a.aparision));
    if (desc.length === 0) {
      return [this];
    }
    return [this as Species].concat(desc.flatMap((d) => d.allDescendants()));
  }

  toJSON(): any {
    const aparisionJSON = this.ancestor ?
      {
        afterAparision: this.aparision - this.ancestor.aparision
      } :
      {
        aparision: this.aparision
      };
    const json = {
      name: this.name,
      ...aparisionJSON,
      duration: this.duration,
    }
    const description = this.description ? {description: this.description} : {};
    return this.descendants.length > 0 ?
      {
        ...json,
        ...description,
        descendants: this.descendants.map((desc) => desc.toJSON()),
      } : json;
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

  static fromJSON(json: any, ancestor?: Species): Species {
    const afterAparision = json.afterAparision ?? 0;
    const aparision = ancestor ? ancestor.aparision : json.aparision ?? 0;
    const sp = new Species(json.name ?? "", aparision + afterAparision, json.duration ?? 0, ancestor, [], json.description ?? undefined);
    if(json.descendants) {
      for (const desc of json.descendants) {
        sp.descendants.push(Species.fromJSON(desc, sp));
      }
    }
    return sp
  }
}
