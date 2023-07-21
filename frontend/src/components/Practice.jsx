import axios from "axios";
import { useState, useEffect } from "react";
import defaultVariables from "../variables";

function Practice() {
	const [mode, setMode] = useState("words");
	const [sentence, setSentence] = useState("");
	const [difficulty, setDifficulty] = useState("easy");
	const [practiceWords, setPracticeWords] = useState("10");
	const [typedWords, setTypedWords] = useState("");

	function handlePracticeWordsChange(event) {
		setPracticeWords(event.target.value);
	}

	function handleModeChange(event) {
		setMode(event.target.value);
	}

	function handleDifficultyChange(event) {
		setDifficulty(event.target.value);
	}

	function getSentence() {
		const practiceUrl =
			mode === "words" ? `wordcount/${difficulty}` : `timer/${difficulty}`;
		axios
			.post(`${defaultVariables.backendUrl}/practice/${practiceUrl}`, {
				wordCount: parseInt(practiceWords),
			})
			.then((response) => {
				setSentence(response.data.sentence);
			});
	}

	useEffect(() => {

		function handleKeyDown(e) {
			let char;
			// 16 - Shift Key
			if(e.keyCode != 16 && e.keyCode != 20){
				if(e.shiftKey || e.getModifierState("CapsLock")){
					char = String.fromCharCode(e.keyCode).toUpperCase();
				}
				else{
					char = String.fromCharCode(e.keyCode).toLowerCase();
				}
				alert(char);
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		// Don't forget to clean up
		return function cleanup() {
			document.removeEventListener('keydown', handleKeyDown);
		}

	}, []);

	return (
		<div className="container">

			<div className='top-options'>

				<select className="select" value={mode} onChange={handleModeChange}>
					<option value="words">Words</option>
					<option value="timer">Time</option>
				</select>
				{mode === "timer" ? (
					<select className="select">
						<option value="0.25">15 seconds</option>
						<option value="0.5">30 seconds</option>
						<option value="0.75">45 seconds</option>
						<option value="1">1 minute</option>
						<option value="2">2 minutes</option>
						<option value="3">3 minutes</option>
						<option value="5">5 minutes</option>
					</select>
				) : (
					<select className="select" value={practiceWords} onChange={handlePracticeWordsChange}>
						<option value="10">10 words</option>
						<option value="30">30 words</option>
						<option value="50">50 words</option>
						<option value="75">75 words</option>
						<option value="100">100 words</option>
						<option value="150">150 words</option>
						<option value="200">200 words</option>
					</select>
				)}
				<select className="select" value={difficulty} onChange={handleDifficultyChange}>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>

				<button className='button' onClick={getSentence}>Set</button>

			</div>

			<p className='sentence'>{sentence}</p>

		</div>
	);
}

export default Practice;
