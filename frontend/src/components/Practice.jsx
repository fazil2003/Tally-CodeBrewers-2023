import axios from "axios";
import { useState, useEffect, useRef } from "react";
import defaultVariables from "../variables";

function Practice() {
	const [mode, setMode] = useState("words");
	const [sentence, setSentence] = useState("");
	const [difficulty, setDifficulty] = useState("easy");
	const [practiceWords, setPracticeWords] = useState("10");
	const [practiceTime, setPracticeTime] = useState(15);
	const [typedWords, setTypedWords] = useState("");
	const [words, setWords] = useState([]);
	const [wordPointer, setWordPointer] = useState(0);
	const [textSpans, setTextSpans] = useState(<></>);

	function getMismatchPosition(word1, word2) {
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
		clearTimer(getDeadTime(parseInt(event.target.value)));
	}

	function handleModeChange(event) {
		setMode(event.target.value);
	}

	function handleDifficultyChange(event) {
		setDifficulty(event.target.value);
	}

	function getSentence() {
		document.getElementById('footer').style.visibility = 'hidden';
		// enable the textarea.
		document.getElementsByClassName("textarea")[0].disabled = false;
		document.getElementsByClassName("textarea")[0].focus();
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
				setTypedWords(typedWordsArray.join(" ").trimStart());

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

	// timer
	useEffect(() => {
		getSentence();
	}, []);

	const Ref = useRef(null);

	// The state for our timer
	const [timer, setTimer] = useState("00:00:00");

	const getTimeRemaining = (e) => {
		const total = Date.parse(e) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / 1000 / 60 / 60) % 24);
		if (seconds == 0) {
			// Disable the textarea
			document.getElementsByClassName("textarea")[0].disabled = true;
			document.getElementById('footer').style.visibility = "visible";
		}
		return {
			total,
			hours,
			minutes,
			seconds,
		};
	};

	const startTimer = (e) => {
		let { total, hours, minutes, seconds } = getTimeRemaining(e);
		if (total >= 0) {
			setTimer(
				(hours > 9 ? hours : "0" + hours) +
				":" +
				(minutes > 9 ? minutes : "0" + minutes) +
				":" +
				(seconds > 9 ? seconds : "0" + seconds)
			);
		}
	};

	const clearTimer = (e) => {
		setTimer("00:00:00");
		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
			startTimer(e);
		}, 1000);
		Ref.current = id;
	};

	const getDeadTime = (time) => {
		let deadline = new Date();
		deadline.setSeconds(deadline.getSeconds() + time);
		return deadline;
	};

	useEffect(() => {
		clearTimer(getDeadTime(3));
	}, []);

	const onClickReset = () => {
		clearTimer(getDeadTime(3));
	};

	//   useEffect(() => {
	//     function handleKeyDown(e) {
	//       let char;
	//       // 16 - Shift Key
	//       if (e.keyCode != 16 && e.keyCode != 20) {
	//         if (e.shiftKey || e.getModifierState("CapsLock")) {
	//           char = String.fromCharCode(e.keyCode).toUpperCase();
	//         } else {
	//           char = String.fromCharCode(e.keyCode).toLowerCase();
	//         }
	//         alert(char);
	//       }
	//     }

	//     document.addEventListener("keydown", handleKeyDown);

	//     // Don't forget to clean up
	//     return function cleanup() {
	//       document.removeEventListener("keydown", handleKeyDown);
	//     };
	//   }, []);

	return (
		<div className="container">
			<div className="top-options">
				<select className="select" value={mode} onChange={handleModeChange}>
					<option value="words">Words</option>
					<option value="timer">Time</option>
				</select>
				{mode === "timer" ? (
					<select className="select"
						value={practiceTime}
						onChange={handlePracticeTimeChange}>
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

				<p>{timer}</p>
			</div>

			<p className="sentence">{textSpans}</p>
			<textarea
				style={{ width: "0", height: "0" }}
				className="textarea"
				value={typedWords}
				onChange={handleTypedWordsChange}
			/>
		</div>
	);
}

export default Practice;
