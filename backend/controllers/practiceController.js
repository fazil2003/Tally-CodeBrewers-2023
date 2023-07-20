const asyncHandler = require("express-async-handler");

const { easyWords, mediumWords, hardWords } = require("./resources");

const easyWordCount = asyncHandler(async (req, res) => {
  const { wordCount } = req.body;
  let sentence = "";

  for (let i = 0; i < wordCount; ++i) {
    const word = easyWords[Math.floor(Math.random() * easyWords.length)];
    sentence += " " + word;
  }

  res.status(200).json({ sentence: sentence.trim() });
});

const mediumWordCount = asyncHandler(async (req, res) => {
  const { wordCount } = req.body;
  let sentence = "";

  const difficultArray = ["medium", "easy", "medium"];

  for (let i = 0; i < wordCount; ++i) {
    const difficult =
      difficultArray[Math.floor(Math.random() * difficultArray.length)];

    if (difficult === "easy") {
      const word = easyWords[Math.floor(Math.random() * easyWords.length)];
      sentence += " " + word;
    } else {
      const word = mediumWords[Math.floor(Math.random() * mediumWords.length)];
      sentence += " " + word;
    }
  }

  res.status(200).json({ sentence: sentence.trim() });
});

const hardWordCount = asyncHandler(async (req, res) => {
  let { wordCount } = req.body;
  let sentence = [];

  const difficultArray = [
    "hard",
    "medium",
    "easy",
    "hard",
    "easy",
    "medium",
    "hard",
  ];

  for (let i = 0; i < wordCount; ++i) {
    const difficult =
      difficultArray[Math.floor(Math.random() * difficultArray.length)];

    if (difficult === "easy") {
      const word = easyWords[Math.floor(Math.random() * easyWords.length)];
      sentence.push(word);
    } else if (difficult === "medium") {
      const word = mediumWords[Math.floor(Math.random() * mediumWords.length)];
      sentence.push(word);
    } else {
      const word = hardWords[Math.floor(Math.random() * hardWords.length)];
      sentence.push(word);
    }
  }

  const hardCharacters = `   "   '   /   -   `;

  let i = 0;

  while (i < wordCount) {
    const character =
      hardCharacters[Math.floor(Math.random() * hardCharacters.length)];
    if (character === "") {
      ++i;
    } else {
      if (character === `'` || character === `"`) {
        sentence[i] = character + sentence[i];
        const quoteClosingIndex =
          Math.floor(Math.random() * (wordCount - i)) + i;
        sentence[quoteClosingIndex] += character;
        i = quoteClosingIndex + 1;
      } else {
        if (i != wordCount - 1) {
          sentence[i] += character + sentence[i + 1];
          sentence.splice(i + 1, 1);
          --wordCount;
          ++i;
        } else {
          ++i;
        }
      }
    }
  }

  res.status(200).json({ sentence: sentence.join(" ").trim() });
});

const easyTimer = asyncHandler(async (req, res) => {
  let sentence = "";

  for (let i = 0; i < 3000; ++i) {
    const word = easyWords[Math.floor(Math.random() * easyWords.length)];
    sentence += " " + word;
  }

  res.status(200).json({ sentence: sentence.trim() });
});

const mediumTimer = asyncHandler(async (req, res) => {
  let sentence = "";

  const difficultArray = ["medium", "easy", "medium"];

  for (let i = 0; i < 3000; ++i) {
    const difficult =
      difficultArray[Math.floor(Math.random() * difficultArray.length)];

    if (difficult === "easy") {
      const word = easyWords[Math.floor(Math.random() * easyWords.length)];
      sentence += " " + word;
    } else {
      const word = mediumWords[Math.floor(Math.random() * mediumWords.length)];
      sentence += " " + word;
    }
  }

  res.status(200).json({ sentence: sentence.trim() });
});

const hardTimer = asyncHandler(async (req, res) => {
  let sentence = [];

  const difficultArray = [
    "hard",
    "medium",
    "easy",
    "hard",
    "easy",
    "medium",
    "hard",
  ];

  for (let i = 0; i < 3000; ++i) {
    const difficult =
      difficultArray[Math.floor(Math.random() * difficultArray.length)];

    if (difficult === "easy") {
      const word = easyWords[Math.floor(Math.random() * easyWords.length)];
      sentence.push(word);
    } else if (difficult === "medium") {
      const word = mediumWords[Math.floor(Math.random() * mediumWords.length)];
      sentence.push(word);
    } else {
      const word = hardWords[Math.floor(Math.random() * hardWords.length)];
      sentence.push(word);
    }
  }

  const hardCharacters = `   "   '   /   -   `;

  let i = 0;
  let wordCount = 3000;

  while (i < wordCount) {
    const character =
      hardCharacters[Math.floor(Math.random() * hardCharacters.length)];
    if (character === "") {
      ++i;
    } else {
      if (character === `'` || character === `"`) {
        sentence[i] = character + sentence[i];
        const quoteClosingIndex =
          Math.floor(Math.random() * (wordCount - i)) + i;
        sentence[quoteClosingIndex] += character;
        i = quoteClosingIndex + 1;
      } else {
        if (i != wordCount - 1) {
          sentence[i] += character + sentence[i + 1];
          sentence.splice(i + 1, 1);
          --wordCount;
          ++i;
        } else {
          ++i;
        }
      }
    }
  }

  res.status(200).json({ sentence: sentence.join(" ").trim() });
});

module.exports = {
  easyWordCount,
  mediumWordCount,
  hardWordCount,
  easyTimer,
  mediumTimer,
  hardTimer,
};
