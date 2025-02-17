export class Species {
  name = '';
  aparision = 0;
  duration = -1;
  ancestor?: Species = undefined;
  descendants: Species[] = [];
  display = true;

  constructor(
    name = '',
    aparision = 0,
    duration = -1,
    ancestor?: Species,
    descendants: Species[] = []
  ) {
    this.name = name;
    this.aparision = aparision;
    this.ancestor = ancestor;
    this.descendants = descendants;
    this.duration = duration;
  }

  copy() {
    return new Species(
      this.name,
      this.aparision,
      this.duration,
      this.ancestor,
      this.descendants
    );
  }

  addDescendant(name = '', afterAparision = 0, duration = -1, copy = false) {
    const sp = copy ? this.copy() : this;
    const desc = new Species(
      name,
      this.aparision + Math.max(afterAparision, 0),
      duration,
      this,
      []
    );
    sp.descendants.push(desc);
    return copy ? sp : desc;
  }

  addAncestor(
    name = '',
    previousAparision = 0,
    duration = -1,
    display = true,
    copy = false
  ) {
    const sp = copy ? this.copy() : this;
    const anc = new Species(
      name,
      this.aparision - Math.max(previousAparision, 0),
      duration,
      undefined,
      [sp]
    );
    anc.display = display;
    sp.ancestor = anc;
    return copy ? sp : anc;
  }

  extinction() {
    return this.duration >= 0 ? this.aparision + this.duration : this.aparision;
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
    const desc = this.descendants;
    if (desc.length === 0) {
      return [this];
    }
    if (desc.length === 1) {
      return desc[0].allDescendants().concat([this]);
    }
    const limit = desc.length / 2;
    const desc0 = desc.slice(0, limit).flatMap((d) => d.allDescendants());
    const desc1 = desc
      .slice(limit, desc.length)
      .flatMap((d) => d.allDescendants());
    return desc0.concat([this]).concat(desc1);
  }

  static fromJSON(json: any, ancestor?: Species): Species {
    const afterAparision = json.afterAparision ?? 0;
    const aparision = ancestor ? ancestor.aparision : json.aparision ?? 0;
    const sp = new Species(json.name ?? "", aparision + afterAparision, json.duration ?? -1, ancestor);
    if(json.descendants) {
      for (const desc of json.descendants) {
        sp.descendants.push(Species.fromJSON(desc, sp));
      }
    }
    return sp
  }
}
