# A Flexible React Crossword for Every Cruciverbalist

Ultimate React Crossword is a user-friendly, deeply flexible crossword component. Whether you're building the next collaborative crossword solving platform or just looking to build out the games section of your local paper's website, Ultimate React Crossword is the component for you. It's simple enough to dive into from moment one, but deep enough to allow creative developers to create entirely new crossword experiences via it's array of custom styling and event handling options!

## Installing the Package

Simply run `npm i ultimate-react-crossword` in your terminal to get started.

## Importing the Package

Add the following code to your react project, then utilize the crossword function as you would any other component:

```js
import Crossword from "ultimate-react-crossword";

// ...
<body>
  <div>
    <Crossword />
  </div>
</body>;
// ...
```

## Adding Your Data

### Required Attributes

1. `data`

   A two-dimensional array representing the grid of the crossword. Regular squares should be represented by an object with an answer property representing the correct input for that square. A black square should be represented by `null`. For example, here is the correct input for a simple, 2x2 grid with a black square in the upper right:

   ```js
   [
     [{ answer: "A" }, null],
     [{ answer: "B" }, { answer: "C" }],
   ];
   ```

   Note that the component will throw an error if any of the subarrays are of unequal length.

2. `acrosses`

   An array of objects, each representing the number (in ascending order) and the text of an across clue, like so:

   ```js
   [
     { num: 1, clue: "Parsley, ___, rosemary and thyme" },
     { num: 5, clue: "Garden Growth" },
     { num: 7, clue: "Synonym of 'evade' and 'avoid'" },
   ];
   ```

   Pay particular attention to the number property-- if something doesn't seem to be working, make sure the number of each clue aligns properly with the ones automatically appearing on the crossword's grid.

3. `downs`

   An array exactly like the acrosses, only represening the downward clues of the puzzle:

   ```js
   [
     { num: 1, clue: "Shoots out, as lava" },
     { num: 2, clue: "Nickname for Alexandra" },
     { num: 3, clue: "Bandage material" },
   ];
   ```

### Optional Attributes

#### `revealAnswers`

A boolean, which when true displays the correct answer in each square of the puzzle.

#### Event Handlers

The Crossword component supports a suite of event handler functions. For more information on when these functions will run and what information they have access to, refer to the full documentation, coming soon!

1. `onInput` // A function that runs whenever the user enters a guess in any square of the puzzle
2. `onCellCorrect` // A function that runs whenever the user enters the correct value in any square of the puzzle
3. `onClueCorrect` // A function that runs whenever the user enters the correct value in every cell of a particular clue
4. `onPuzzleFinished` // A function that runs whenever the user fills the entire puzzle grid with inputs, but _not_ when the entire grid is correct
5. `onPuzzleCorrect` // A function that runs whenever the user has input the correct value in every single square of the puzzle

#### Custom Style Objects

The Crossword component also supports a range of custom styling options. Each of these expects an object composed of various CSS properties as key-value pairs like so:

```js
{ backgroundColor: "red", borderRadius: "10px" }
```

1. `puzzleStyle` // Applies to the entire space of the puzzle, including the clue lists
2. `crosswordStyle` // Applies to the crossword board itself
3. `squareStyle` // Applies to each square of the puzzle

#### Custom Classes and Color Themes

For additional styling flexibility, the component allows the user to apply specific classnames to each modular component of the puzzle, and to choose key colors to represent the user's focus within the puzzle. For the full list of these attributes and examples of how they can be used, refer to the full documentation, which is coming soon!

## Example Data

Ultimate React Crossword also comes loaded with two example crossword data sets which can be imported from the package and plugged directly into the Crossword component. These include:

1. `examplePuzzleFull`: A full, 15x15 New York Times Monday puzzle.
2. `examplePuzzleShort`: A 5x5 New York Times Mini puzzle

They can be imported with the following code:

```js
import Crossword, {
  examplePuzzleFull,
  examplePuzzleShort,
} from "ultimate-react-crossword";

// ...

function App() {
  return (
    <div className="App">
      <Crossword
        data={examplePuzzleShort.grid}
        acrosses={examplePuzzleShort.acrosses}
        downs={examplePuzzleShort.downs}
      />
      <Crossword
        data={examplePuzzleFull.grid}
        acrosses={examplePuzzleFull.acrosses}
        downs={examplePuzzleFull.downs}
      />
    </div>
  );
}
```

## Want to Learn More?

Feel free to check out the [project on GitHub](https://github.com/LucasMc17/Ultimate-React-Crossword)! Full documentation is coming soon!
