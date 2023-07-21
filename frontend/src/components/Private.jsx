import axios from "axios";
import { useState, useEffect } from "react";
import defaultVariables from "../variables";
import Footer from "./footer";
import ProgressBar from "./ProgressBar";

function Private() {
  const [mode, setMode] = useState("words");
  const [sentence, setSentence] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [practiceWords, setPracticeWords] = useState("10");
  const [practiceTime, setPracticeTime] = useState("15");
  const [typedWords, setTypedWords] = useState("");
  const [words, setWords] = useState([]);
  const [wordPointer, setWordPointer] = useState(0);
  const [textSpans, setTextSpans] = useState(<></>);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [timerState, setTimerState] = useState(false);
  const [flag, setFlag] = useState(false);

  function getMismatchPosition(word1, word2) {
    if (word1 === undefined || word2 === undefined) {
      return 0;
    }

    let i = 0;
    let j = 0;

    while (i < word1.length && j < word2.length && word1[i] === word2[j]) {
      ++i;
      ++j;
    }

    return i;
  }

  function handlePracticeWordsChange(event) {
    setPracticeWords(event.target.value);
  }

  function handlePracticeTimeChange(event) {
    setPracticeTime(event.target.value);
    setTime(event.target.value);
  }

  function handleModeChange(event) {
    setTimerState(false);
    setFlag(false);
    setMode(event.target.value);
    if (event.target.value === "words") {
      setPracticeWords("10");
      setTime(0);
    } else {
      setPracticeTime("15");
      setTime(15);
    }
  }

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  function getSentence() {
    document.getElementById("textarea").focus();
    setFlag(false);
    if (mode === "words") {
      setTime(0);
    } else {
      setTime(parseInt(practiceTime));
    }

    setTimerState(false);

    const practiceUrl =
      mode === "words" ? `wordcount/${difficulty}` : `timer/${difficulty}`;
    axios
      .post(`${defaultVariables.backendUrl}/practice/${practiceUrl}`, {
        wordCount: parseInt(practiceWords),
      })
      .then((response) => {
        setSentence(response.data.sentence);
        setTextSpans(
          <>
            <span className="pending-characters current-character">
              {response.data.sentence[0]}
            </span>
            <span className="pending-characters">
              {response.data.sentence.slice(1)}
            </span>
          </>
        );
        setTypedWords("");
        setWords(response.data.sentence.split(" "));
        setWordPointer(0);
      });
  }

  function handleTypedWordsChange(event) {
    if (timerState === false && flag === false) {
      setTimerState(true);
      setFlag(true);
    } else if (timerState === false && flag === true) {
      setTypedWords("");
    }

    if (
      words.length === 0 ||
      wordPointer === words.length ||
      (event.target.value.length > typedWords.length &&
        event.target.value.trimStart().length === 0)
    ) {
      setTypedWords("");
    } else {
      let typedWordsArray = event.target.value.split(" ");
      if (
        typedWordsArray[0] === words[wordPointer] &&
        typedWordsArray.length !== 1
      ) {
        let i = wordPointer;

        while (
          i < words.length &&
          typedWordsArray[0] === words[i] &&
          typedWordsArray.length !== 1
        ) {
          typedWordsArray.shift();
          while (typedWordsArray[0] === "") {
            typedWordsArray.shift();
          }
          ++i;
        }

        setWordPointer(i);

        if (i === words.length) {
          setTypedWords("");
          setTimerState(false);
        } else {
          setTypedWords(typedWordsArray.join(" ").trimStart());
        }

        let completedCharacters = 0;

        for (let j = 0; j < i; ++j) {
          completedCharacters += words[j].length + 1;
        }

        const mismatchPosition = getMismatchPosition(
          typedWordsArray.join(" "),
          words[i]
        );
        completedCharacters += mismatchPosition;

        let pointerClass = "pending-characters current-character";

        if (mismatchPosition !== typedWordsArray.join(" ").length) {
          pointerClass = "mismatch";
        }

        setTextSpans(
          <>
            <span className="completed-characters">
              {sentence.slice(0, completedCharacters)}
            </span>
            <span className={pointerClass}>
              {sentence[completedCharacters]}
            </span>
            <span className="pending-characters">
              {sentence.slice(completedCharacters + 1)}
            </span>
          </>
        );
      } else {
        if (typedWords.length < event.target.value.length) {
          let currentIndex = 0;

          for (let i = 0; i < wordPointer; ++i) {
            currentIndex += words[i].length + 1;
          }

          currentIndex += event.target.value.length - 1;

          if (currentIndex >= sentence.length) {
            setMistakes((oldValue) => {
              return oldValue + 1;
            });
          } else if (
            sentence[currentIndex] !==
            event.target.value[event.target.value.length - 1]
          ) {
            setMistakes((oldValue) => {
              return oldValue + 1;
            });
          }
        }

        setTypedWords(event.target.value.trimStart());

        let completedCharacters = 0;

        for (let i = 0; i < wordPointer; ++i) {
          completedCharacters += words[i].length + 1;
        }

        const mismatchPosition = getMismatchPosition(
          event.target.value,
          words[wordPointer]
        );
        completedCharacters += mismatchPosition;

        let pointerClass = "pending-characters current-character";

        if (mismatchPosition !== event.target.value.length) {
          pointerClass = "mismatch";
        }

        setTextSpans(
          <>
            <span className="completed-characters">
              {sentence.slice(0, completedCharacters)}
            </span>
            <span className={pointerClass}>
              {sentence[completedCharacters]}
            </span>
            <span className="pending-characters">
              {sentence.slice(completedCharacters + 1)}
            </span>
          </>
        );
      }
    }
  }

  useEffect(() => {
    let clock;
    if (timerState === true) {
      clock = setInterval(() => {
        if (mode === "words") {
          setTime((oldValue) => oldValue + 1);
        } else {
          if (time <= 1) {
            setTimerState(false);
          }
          setTime((oldValue) => oldValue - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(clock);
    };
  }, [timerState, time, mode]);

  function testSocket(event) {
    event.preventDefault();
  }

  return (
    <div className="container">
      <div className="top-options">
        <select className="select" value={mode} onChange={handleModeChange}>
          <option value="words">Words</option>
          <option value="timer">Time</option>
        </select>
        {mode === "timer" ? (
          <select
            className="select"
            value={practiceTime}
            onChange={handlePracticeTimeChange}
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="45">45 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="180">3 minutes</option>
            <option value="300">5 minutes</option>
          </select>
        ) : (
          <select
            className="select"
            value={practiceWords}
            onChange={handlePracticeWordsChange}
          >
            <option value="10">10 words</option>
            <option value="30">30 words</option>
            <option value="50">50 words</option>
            <option value="75">75 words</option>
            <option value="100">100 words</option>
            <option value="150">150 words</option>
            <option value="200">200 words</option>
          </select>
        )}
        <select
          className="select"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="button" onClick={getSentence}>
          Set
        </button>
        <div className="timer">{time}</div>
      </div>

      <p id="some" className="sentence">
        {textSpans}
      </p>
      <textarea
        id="textarea"
        style={{ width: "100", height: "100" }}
        className="textarea"
        value={typedWords}
        onChange={handleTypedWordsChange}
      />
      <form onSubmit={testSocket}>
        <input type="text" placeholder="msg" />
        <input type="submit" value="send" />
      </form>
      <ProgressBar name={"muthu"} percentage={"80"} inpercent={"80%"} />
      <Footer />
    </div>
  );
}

export default Private;
