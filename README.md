# chrono-phylo-tree Documentation

## Overview

The **chrono-phylo-tree** is a JavaScript/TypeScript library designed to visualize and manage phylogenetic trees. Phylogenetic trees are diagrams that represent evolutionary relationships among species, where each node represents a species, and branches represent the evolutionary lineage, it can also be used in speculative evolution projects.

This documentation provides a detailed explanation of the core components and classes used in the application, including the `Species` class, which represents individual species in the tree, and the `PhTree` and `Menu` components, which handle the visualization and user interaction with the tree.

### Key Features

- **Species Management**: The `Species` class allows you to define species, manage their ancestors and descendants, and calculate properties such as extinction time and duration.
- **Interactive Tree Visualization**: The `PhTree` component renders the phylogenetic tree as an SVG, allowing users to interact with the tree by toggling the visibility of species and accessing detailed information.
- **User-Friendly Interface**: The `Menu` component provides a modal interface for editing species attributes, adding new descendants or ancestors, and deleting species.
- **Localization Support**: The application supports multiple languages, making it accessible to a global audience.

### How It Works

1. **Species Representation**: Each species is represented by an instance of the `Species` class, which stores its name, appearance time, duration, ancestor, descendants, and other attributes.
2. **Tree Rendering**: The `PhTree` component takes a common ancestor species as input and recursively renders the tree structure using SVG elements. It supports dynamic resizing, padding, and customizable stroke colors.
3. **User Interaction**: Users can interact with the tree by clicking on species nodes to open the `Menu` component, where they can edit species data, add new species, or delete existing ones.
4. **Data Persistence**: The application allows users to save the phylogenetic tree as a JSON file, ensuring that the data can be easily stored and reloaded.

This documentation will guide you through the properties, methods, and usage of each component, helping you understand how to build, modify, and interact with phylogenetic trees using this application.

## Installation

You can install chrono-phylo-tree via npm:

```bash
npm install chrono-phylo-tree
```

or using yarn:

```bash
npm install chrono-phylo-tree
```

## Usage

### Importing the Library

In a JavaScript or TypeScript project, import the necessary modules:

```typescript
import { Species, PhTree } from "chrono-phylo-tree";
```

## Creating a Phylogenetic Tree

You can create species and construct a phylogenetic tree as follows:

```typescript
const root = new Species("Hominoidea", -25e6, 6e6);
root.addDescendant("Hilobates", 6e6, 19e6);
const child0 = root.addDescendant("Hominidae", 6e6, 6e6);
child0.addDescendant("Pongo", 6e6, 13e6);
const child1 = child0.addDescendant("Homininae", 6e6, 5e6);
child1.addDescendant("Gorilla", 5e6, 8e6);
const child2 = child1.addDescendant("Hominini", 5e6, 2e6);
const child3 = child2.addDescendant("Pan", 2e6, 3e6);
child3.addDescendant("Pan Troglodytes", 3e6, 3e6);
child3.addDescendant("Pan Paniscus", 3e6, 3e6);
child2.addDescendant("Homo", 2e6, 6e6);
```

## Rendering the Tree in a React Component

If using chrono-phylo-tree in a React project, you can render the tree as follows:

```typescript
import React from "react";
import { Species, PhTree } from "chrono-phylo-tree";

const root = new Species("Hominoidea", -25e6, 6e6);
root.addDescendant("Hilobates", 6e6, 19e6);
const child0 = root.addDescendant("Hominidae", 6e6, 6e6);
child0.addDescendant("Pongo", 6e6, 13e6);
const child1 = child0.addDescendant("Homininae", 6e6, 5e6);
child1.addDescendant("Gorilla", 5e6, 8e6);
const child2 = child1.addDescendant("Hominini", 5e6, 2e6);
const child3 = child2.addDescendant("Pan", 2e6, 3e6);
child3.addDescendant("Pan Troglodytes", 3e6, 3e6);
child3.addDescendant("Pan Paniscus", 3e6, 3e6);
child2.addDescendant("Homo", 2e6, 6e6);

const App = () => {
  return (
    <PhTree
      commonAncestor={ancestor}
      width={1000}
      height={500}
      stroke="black"
    />
  );
};

export default App;
```

## Species Class

The `Species` class represents a species in a phylogenetic tree, with properties and methods to manage its ancestors, descendants, and other attributes.

### Properties

- **name**: `string`The name of the species.
- **apparition**: `number`The time at which the species appears in the timeline.
- **duration**: `number`The duration for which the species exists.
- **ancestor**: `Species | undefined`The ancestor species from which this species descends. It is `undefined` if this species has no ancestor.
- **descendants**: `Species[]`An array of species that descend from this species.
- **description**: `string | undefined`An optional description of the species.
- **display**: `boolean`
  A flag indicating whether the species should be displayed. Default is `true`

### Methods

#### Constructor

```typescript
constructor(
  name = '',
  apparition = 0,
  duration = 0,
  ancestor?: Species,
  descendants: Species[] = [],
  description: string | undefined = undefined
)
```

Initializes a new instance of the `Species` class.

- **name**: The name of the species.
- **apparition**: The time at which the species appears.
- **duration**: The duration for which the species exists.
- **ancestor**: The ancestor of the species.
- **descendants**: An array of descendant species.
- **description**: An optional description of the species.

#### copy

```typescript
copy(): Species
```

Creates a deep copy of the current species and its descendants.

#### addDescendant

```typescript
addDescendant(
  name = '',
  afterApparition = 0,
  duration = 0,
  description: string | undefined = undefined,
  copy = false
): Species
```

Adds a descendant to the current species.

- **name**: The name of the descendant.
- **afterApparition**: The time after the ancestor's appearance when the descendant appears.
- **duration**: The duration for which the descendant exists.
- **description**: An optional description of the descendant.
- **copy**: If `true`, the current species is copied before adding the descendant.

#### removeDescendant

```typescript
removeDescendant(desc: Species): void
```

Removes a descendant from the current species.

- **desc**: The descendant species to remove.

#### addAncestor

```typescript
addAncestor(
  name = '',
  previousApparition = 0,
  duration = 0,
  description: string | undefined = undefined,
  display = true,
  copy = false
): Species
```

Adds an ancestor to the current species.

- **name**: The name of the ancestor.
- **previousApparition**: The time before the current species' appearance when the ancestor appears.
- **duration**: The duration for which the ancestor exists.
- **description**: An optional description of the ancestor.
- **display**: A flag indicating whether the ancestor should be displayed.
- **copy**: If `true`, the current species is copied before adding the ancestor.

#### extinction

```typescript
extinction(): number
```

Returns the time at which the species goes extinct.

#### absoluteExtinction

```typescript
absoluteExtinction(): number
```

Returns the time at which the species goes extinct, considering its descendants.

#### absoluteDuration

```typescript
absoluteDuration(): number
```

Returns the duration of the species, considering its descendants.

#### firstAncestor

```typescript
firstAncestor(includeNotDisplay = false): Species
```

Returns the first ancestor of the species.

- **includeNotDisplay**: If `true`, includes ancestors that are not displayed.

#### cousinsExtinction

```typescript
cousinsExtinction(): number
```

Returns the extinction time of the species' cousins.

#### allDescendants

```typescript
allDescendants(): Species[]
```

Returns an array of all descendants of the species, sorted by appearance time.

#### toJSON

```typescript
toJSON(): any
```

Converts the species and its descendants to a JSON object.

#### saveJSON

```typescript
saveJSON(filename: string | undefined = undefined): Promise<void>
```

Saves the species and its descendants as a JSON file.

- **filename**: The name of the file to save. If not provided, the species name is used.

#### fromJSON

```typescript
static fromJSON(json: any, ancestor?: Species): Species
```

Creates a species instance from a JSON object.

- **json**: The JSON object representing the species. The structure of the JSON object should follow the format below:
  - **name**: (string) The name of the species.
  - **apparition**: (number, optional) The time when the species first appeared. This is only required if the species has no ancestor.
  - **afterApparition**: (number, optional) The time after the ancestor's apparition when this species appeared. This is required if the species has an ancestor.
  - **duration**: (number) The duration for which the species existed.
  - **description**: (string, optional) A description of the species.
  - **descendants**: (array, optional) An array of JSON objects representing the descendant species. Each descendant follows the same structure as described here.
- **ancestor**: (Species, optional) The ancestor species, if any. This is used to calculate the apparition time of the current species based on the ancestor's apparition time.

### Example JSON Structure

Here is an example of a JSON object representing a species and its descendants:

```json
{
  "name": "Hominoidea",
  "apparition": -25000000,
  "duration": 6000000,
  "descendants": [
    {
      "name": "Hilobates",
      "afterApparition": 6000000,
      "duration": 19000000
    },
    {
      "name": "Hominidae",
      "afterApparition": 6000000,
      "duration": 6000000,
      "descendants": [
        {
          "name": "Pongo",
          "afterApparition": 6000000,
          "duration": 13000000
        },
        {
          "name": "Homininae",
          "afterApparition": 6000000,
          "duration": 5000000,
          "descendants": [
            {
              "name": "Gorilla",
              "afterApparition": 5000000,
              "duration": 8000000
            },
            {
              "name": "Hominini",
              "afterApparition": 5000000,
              "duration": 2000000,
              "descendants": [
                {
                  "name": "Pan",
                  "afterApparition": 2000000,
                  "duration": 3000000,
                  "descendants": [
                    {
                      "name": "Pan Troglodytes",
                      "afterApparition": 3000000,
                      "duration": 3000000
                    },
                    {
                      "name": "Pan Paniscus",
                      "afterApparition": 3000000,
                      "duration": 3000000
                    }
                  ]
                },
                {
                  "name": "Homo",
                  "afterApparition": 2000000,
                  "duration": 6000000
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

In this example:

- The root species is "Hominoidea", which appeared 25 million years ago and existed for 6 million years.

- It has two descendants: "Hilobates" and "Hominidae".

- "Hominidae" further has descendants like "Pongo" and "Homininae", and so on.

This structure allows for a hierarchical representation of species and their evolutionary relationships.

## PhTree Component

The `PhTree` component is responsible for rendering a phylogenetic tree based on a given common ancestor species. It provides interactive features to manage and visualize the species tree.

### Properties

- **commonAncestor**: `Species`The root species of the phylogenetic tree.
- **language**: `string` (optional)The language code for localization.
- **width**: `number` (optional, default: `1000`)The width of the SVG canvas.
- **height**: `number` (optional, default: `50`)The height of the SVG canvas.
- **padding**: `number` (optional, default: `0`)The padding around the tree.
- **stroke**: `string` (optional, default: `"grey"`)The stroke color for the tree lines.
- **format**: `(n: number) => string` (optional, default: `(n) => n.toString()`)A function to format the display of time values.
- **presentTime**: `number` (optional)The current time to highlight in the tree.
- **saveSpecies**: `(s: Species, name: string, apparition: number, duration: number, description?: string) => void` (optional)A callback function to save species data.
- **createDescendant**: `(s: Species, name: string, afterApparition: number, duration: number, description: string) => void` (optional)A callback function to create a new descendant species.
- **createAncestor**: `(s: Species, name: string, previousApparition: number, duration: number, description: string) => void` (optional)A callback function to create a new ancestor species.
- **deleteAncestor**: `(s: Species) => void` (optional)A callback function to delete an ancestor species.
- **deleteSpecies**: `(s: Species) => void` (optional)
  A callback function to delete a species.

### State

- **showMenu**: `boolean`Controls the visibility of the `Menu` component.
- **species**: `Species | undefined`The currently selected species for which the menu is displayed.
- **showDesc**: `Map<Species, boolean>`
  A map to track the visibility of descendants for each species.

## Methods

- **toggleShowMenu**: `(species: Species) => void`Toggles the visibility of the menu for a given species.
- **toggleShowDesc**: `(species: Species) => void`
  Toggles the visibility of descendants for a given species, if `false`, its `descendants` won't be displayed and the `line` will extend until its `absoluteExtinction()`.

### Rendering

The component renders an SVG element that contains the phylogenetic tree. It uses the `DrawTree` component to recursively draw the tree structure. The `Menu` component is conditionally rendered based on the `showMenu` state.

## Menu Component

The `Menu` component provides a user interface to edit and manage species data. It allows users to modify species attributes, add descendants or ancestors, and delete species.

### Properties

- **species**: `Species`The species for which the menu is displayed.
- **language**: `string` (optional)The language code for localization.
- **open**: `boolean` (optional)Controls the visibility of the menu.
- **onClose**: `() => void` (optional)A callback function to close the menu.
- **saveSpecies**: `(s: Species, name: string, apparition: number, duration: number, description?: string) => void` (optional)A callback function to save species data.
- **createDescendant**: `(s: Species, name: string, afterApparition: number, duration: number, description: string) => void` (optional)A callback function to create a new descendant species.
- **createAncestor**: `(s: Species, name: string, previousApparition: number, duration: number, description: string) => void` (optional)A callback function to create a new ancestor species.
- **deleteAncestor**: `() => void` (optional)A callback function to delete an ancestor species.
- **deleteSpecies**: `() => void` (optional)
  A callback function to delete a species.

### State

- **name**: `string`The name of the species.
- **apparition**: `number`The appearance time of the species.
- **duration**: `number`The duration of the species.
- **description**: `string | undefined`The description of the species.
- **addDescendant**: `boolean`Controls the visibility of the descendant addition form.
- **addAncestor**: `boolean`
  Controls the visibility of the ancestor addition form.

### Methods

- **toggleAddDescendant**: `() => void`Toggles the visibility of the descendant addition form.
- **toggleAddAncestor**: `() => void`Toggles the visibility of the ancestor addition form.
- **uniqueDescendant**: `(s: Species) => boolean`
  Checks if the species is the only descendant of its ancestor.

### Rendering

The component renders a modal form with fields to edit species attributes. It conditionally renders forms to add descendants or ancestors based on the state. The form includes buttons to save changes, delete species, and close the menu.

## Translation Functions

The application supports localization through a CSV file (`translate.csv`) that contains translation strings for different languages. The `translate.tsx` file provides functions to fetch and use these translations dynamically.

### CSV File Structure (`translate.csv`)

The `translate.csv` file is structured as follows:

- **Columns**:

  - `code`: A unique identifier for each translation string.
  - `spanish`: The translation in Spanish.
  - `english`: The translation in English.

- **Rows**:

  - Each row represents a translation string, identified by its `code`.
  - The first row with the `code` value `"lan"` contains the language names (e.g., `"Español"` for Spanish, `"English"` for English).

#### Example CSV Content

```csv
code;spanish;english
lan;Español;English
ttl;Árbol Cronofilogenético;Chronophylogenetic Tree
nvlbl00;Escala;Scale
nvlbl01;Presente;Present
nvlbl02;Color;Color
nvlbl03;Repositorio;Repository
nvlbl04;Importar JSON;Import JSON
nvbtn00;Crear especie vacía;Create empty species
nvbtn00_0;Eliminar todas las especies;Delete all species
nvbtn01;Ejemplo;Example
nvbtn02;Descargar JSON;Download JSON
nvlbl05;Idioma;Language
splbl00;Nombre;Name
splbl01;Aparición;Apparition
splbl02;Duración;Duration
splbl03;Descripción;Description
spbtn00;Guardar;Save
spbtn01;Eliminar;Delete
spbtn02;Crear descendiente;Create descendant
spbtn03;Crear ancestro;Create ancestor
spbtn04;Quitar Ancestro;Remove Ancestor
spbtn04_0;Quitar Ancestros;Remove Ancestors
spbtn05;Cancelar;Cancel
cdbtn00;Crear;Create
cnfrm00;¿Estás seguro de que deseas quitar al ancestro de {0}?;Are you sure you want to remove the {0}'s ancestor?
cnfrm00_0;¿Estás seguro de que deseas quitar a los ancestros de {0}?;Are you sure you want to remove the {0}'s ancestors?
cnfrm01;¿Estás seguro de que deseas eliminar la especie {0}?;Are you sure you want to remove the {0} species?
cnfrm01_0;¿Estás seguro de que deseas eliminar la especie {0} junto a sus descendientes?;Are you sure you want to remove the {0} species along with its descendants?
```

### How It Works

1. **Translation Lookup**:

- The `codeText` and `codeTextAlt` functions in `translate.tsx` fetch the translation data from the CSV file.
- They search for the row with the matching `code` and retrieve the translation for the specified language.
- If the translation contains placeholders (e.g., `{0}`), they are replaced with the provided arguments.

2. **Language Options**:

- The `getLanguageOptions` function retrieves the available languages from the CSV file by looking for the row with the `code` value `"lan"`.
- It returns a map of language codes (e.g., `"spanish"`, `"english"`) to their corresponding language names (e.g., `"Español"`, `"English"`).

3. **Dynamic Translation**:

- The application uses the `codeText` function to dynamically translate UI elements based on the selected language.
- For example, buttons, labels, and confirmation messages are translated using the `code` values defined in the CSV file.

#### `codeText`

```typescript
export const codeText = (code: string, language: string, arg: string[] = [], filePath: string = "/translate.csv"): string
```

Retrieves a translated string based on a given code and language. It also supports string interpolation using placeholders (`{0}`, `{1}`, etc.).

**Parameters**

- **code**: `string`
  The code that identifies the translation string in the CSV file.
- **language**: `string`
  The language code (e.g., `"spanish"`, `"english"`) for which the translation is requested.
- **arg**: `string[]` (optional, default: `[]`)
  An array of arguments to replace placeholders in the translated string.
- **filePath**: `string` (optional, default: `"/translate.csv"`)
  The path to the CSV file containing the translation data.

**Returns**

- **`string`**: The translated string with placeholders replaced by the provided arguments. If the translation is not found, the function returns the original `code`.

#### `codeTextAlt`

```typescript
export const codeTextAlt = async (code: string, language: string, arg: string[] = [], filePath: string = "/translate.csv"): Promise<string>
```

An asynchronous version of codeText. It fetches the translation data from the CSV file and retrieves the translated string.

**Parameters**

- **code**: `string`
  The code that identifies the translation string in the CSV file.
- **language**: `string`
  The language code (e.g., `"spanish"`, `"english"`) for which the translation is requested.
- **arg**: `string[]` (optional, default: `[]`)
  An array of arguments to replace placeholders in the translated string.
- **filePath**: `string` (optional, default: `"/translate.csv"`)
  The path to the CSV file containing the translation data.

**Returns**

- **`Promise<string>`**: A promise that resolves to the translated string with placeholders replaced by the provided arguments. If the translation is not found, the function returns the original `code`.

#### `getLanguageOptions`

```typescript
export const getLanguageOptions = (filePath: string = "/translate.csv"): Map<string, string>
```

Retrieves a map of available language options from the CSV file. The language options are stored in a row with the code `"lan"`.

**Parameters**

- **filePath**: string (optional, default: "/translate.csv")
  The path to the CSV file containing the translation data.

**Returns**

- **`Map<string, string>`**: A map where the keys are language codes (e.g., "spanish", "english") and the values are the corresponding language names (e.g., "Español", "English").

### Example Usage

#### Fetching a Translated String

**`codeText`**

```typescript
const greeting = codeText("greeting", "spanish", ["Juan"]); //Example row: greeting; Hola, {0}; Hello, {0}
console.log(greeting); // Output: "Hola, Juan"
```

**`codeTextAlt`**

```typescript
const greeting = await codeTextAlt("greeting", "spanish", ["Juan"]); //Example row: greeting; Hola, {0}; Hello, {0}
console.log(greeting); // Output: "Hola, Juan"
```

#### Fetching Language Options

```typescript
const languageOptions = getLanguageOptions();
console.log(languageOptions.get("spanish")); // Output: "Español"
```

### Adding New Languages

To add support for a new language (e.g., French):

1. Add a new column to the CSV file (e.g., `french`).
2. Populate the new column with translations for each `code`.
3. Update the `getLanguageOptions` function to include the new language in the language options map.

#### Example CSV Update for French

```csv
code;spanish;english;french
lan;Español;English;Français
nvlbl00;Escala;Scale;Échelle
nvlbl01;Presente;Present;Présent
...
```

### Supported Translation Codes

Below is a list of some of the translation codes used in the application:

| Code        | Spanish                                                                        | English                                                                     |
| ----------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `ttl`       | Árbol Cronofilogenético                                                        | Chronophylogenetic Tree                                                     |
| `nvlbl00`   | Escala                                                                         | Scale                                                                       |
| `nvlbl01`   | Presente                                                                       | Present                                                                     |
| `nvlbl02`   | Color                                                                          | Color                                                                       |
| `nvlbl03`   | Repositorio                                                                    | Repository                                                                  |
| `nvlbl04`   | Importar JSON                                                                  | Import JSON                                                                 |
| `nvbtn00`   | Crear especie vacía                                                            | Create empty species                                                        |
| `nvbtn00_0` | Eliminar todas las especies                                                    | Delete all species                                                          |
| `nvbtn01`   | Ejemplo                                                                        | Example                                                                     |
| `nvbtn02`   | Descargar JSON                                                                 | Download JSON                                                               |
| `nvlbl05`   | Idioma                                                                         | Language                                                                    |
| `splbl00`   | Nombre                                                                         | Name                                                                        |
| `splbl01`   | Aparición                                                                      | Apparition                                                                  |
| `splbl02`   | Duración                                                                       | Duration                                                                    |
| `splbl03`   | Descripción                                                                    | Description                                                                 |
| `spbtn00`   | Guardar                                                                        | Save                                                                        |
| `spbtn01`   | Eliminar                                                                       | Delete                                                                      |
| `spbtn02`   | Crear descendiente                                                             | Create descendant                                                           |
| `spbtn03`   | Crear ancestro                                                                 | Create ancestor                                                             |
| `spbtn04`   | Quitar Ancestro                                                                | Remove Ancestor                                                             |
| `spbtn04_0` | Quitar Ancestros                                                               | Remove Ancestors                                                            |
| `spbtn05`   | Cancelar                                                                       | Cancel                                                                      |
| `cdbtn00`   | Crear                                                                          | Create                                                                      |
| `cnfrm00`   | ¿Estás seguro de que deseas quitar al ancestro de {0}?                         | Are you sure you want to remove the {0}'s ancestor?                         |
| `cnfrm00_0` | ¿Estás seguro de que deseas quitar a los ancestros de {0}?                     | Are you sure you want to remove the {0}'s ancestors?                        |
| `cnfrm01`   | ¿Estás seguro de que deseas eliminar la especie {0}?                           | Are you sure you want to remove the {0} species?                            |
| `cnfrm01_0` | ¿Estás seguro de que deseas eliminar la especie {0} junto a sus descendientes? | Are you sure you want to remove the {0} species along with its descendants? |
