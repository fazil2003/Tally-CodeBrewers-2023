import axios from "axios";
import { useState, useEffect } from "react";
import defaultVariables from "../variables";
import Footer from "./footer";
import ProgressBar from "./ProgressBar";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io.connect(
  // defaultVariables.backendUrl + "/private/room/" + roomID
  "http://localhost:5010"
);

socket.emit("join", {
  username: localStorage.getItem("username"),
});

function Private() {
  const params = useParams();
  const roomID = params.roomID;

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
  const [isOwner, setIsOwner] = useState(false);
  const [progressDivs, setProgressDivs] = useState(
    new Set([
      JSON.stringify({
        name: localStorage.getItem("username"),
        percentage: "0",
        inpercent: "0%",
      }),
    ])
  );

  useEffect(() => {
    axios
      .post(
        defaultVariables.backendUrl + "/private/ownership",
        { roomID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        const { owner } = response.data;
        setIsOwner(owner);
      });
  }, []);

  socket.on("join", (data) => {
    axios
      .post(
        defaultVariables.backendUrl + "/private/ownership",
        { roomID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        const { owner } = response.data;
        if (owner === true) {
          let newValue = new Set([
            ...progressDivs,
            JSON.stringify({
              name: data.username,
              percentage: "0",
              inpercent: "0%",
            }),
          ]);
          socket.emit("present", { users: [...newValue] });
          setProgressDivs(newValue);
        }
      });
  });

  socket.on("present", (data) => {
    axios
      .post(
        defaultVariables.backendUrl + "/private/ownership",
        { roomID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        const { owner } = response.data;
        if (!owner) {
          setProgressDivs(new Set(data.users));
        }
      });
  });

  socket.on("progress", (data) => {
    const { username, percent } = data;
    let newProgressDivs = [...progressDivs].filter((val) => {
      return JSON.parse(val).name !== username;
    });

    newProgressDivs.push(
      JSON.stringify({
        name: username,
        percentage: `${percent}`,
        inpercent: `${percent}%`,
      })
    );

    setProgressDivs(new Set(newProgressDivs));
  });

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
    // document.getElementById("textarea").focus();
    setFlag(true);
    setTimerState(true);

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

        if (mode === "words") {
          setTime(0);
          socket.emit("start", {
            mode: "words",
            sentence: response.data.sentence,
          });
        } else {
          socket.emit("start", {
            mode: "timer",
            time: parseInt(practiceTime),
            sentence: response.data.sentence,
          });
          setTime(parseInt(practiceTime));
        }
      });
  }

  function handleTypedWordsChange(event) {
    if (timerState === false && flag === false) {
      setTypedWords("");
      return;
    } else if (timerState === false && flag === true) {
      setTypedWords("");
      return;
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

        let newProgressDivs = [...progressDivs].filter((val) => {
          return JSON.parse(val).name !== localStorage.getItem("username");
        });

        const percent = parseInt((i / words.length) * 100);

        newProgressDivs.push(
          JSON.stringify({
            name: localStorage.getItem("username"),
            percentage: `${percent}`,
            inpercent: `${percent}%`,
          })
        );

        setProgressDivs(new Set(newProgressDivs));

        socket.emit("progress", {
          percent: parseInt((i / words.length) * 100),
          username: localStorage.getItem("username"),
        });

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

  socket.on("start", (data) => {
    if (!isOwner) {
      if (data.mode === "words") {
        setTime(0);
      } else {
        setTime(data.time);
      }

      setMode(data.mode);
      setSentence(data.sentence);
      setFlag(true);
      setTimerState(true);
      setTextSpans(
        <>
          <span className="pending-characters current-character">
            {data.sentence[0]}
          </span>
          <span className="pending-characters">{data.sentence.slice(1)}</span>
        </>
      );
      setTypedWords("");
      setWords(data.sentence.split(" "));
      setWordPointer(0);
    }
  });

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

  return (
    <div className="container">
      <div className="top-options">
        {isOwner && (
          <>
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
              Start
            </button>
          </>
        )}
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
      {[...progressDivs].map((val) => {
        val = JSON.parse(val);
        return (
          <ProgressBar
            id={val.name}
            name={val.name}
            percentage={val.percentage}
            inpercent={val.inpercent}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default Private;
