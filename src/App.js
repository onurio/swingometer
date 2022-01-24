import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Tone from "tone";
import DiscreteSlider from "./components/DiscreteSlider";
import BpmSlider from "./components/BpmSlider";
import pan1 from "./samples/pan1.mp3";
import pan2 from "./samples/pan2.mp3";
import pan3 from "./samples/pan3.mp3";
import pan4 from "./samples/pan4.mp3";
import sn1 from "./samples/sn1.mp3";
import sn2 from "./samples/sn2.mp3";
import sn3 from "./samples/sn3.mp3";
import sn4 from "./samples/sn4.mp3";
import rep1 from "./samples/rep1.mp3";
import rep2 from "./samples/rep2.mp3";
import rep3 from "./samples/rep3.mp3";
import rep4 from "./samples/rep4.mp3";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./components/Sketch";
import { useReducer } from "react";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
// import ShareDial from './components/ShareDial';
import { blue, red } from "@material-ui/core/colors";
import VolumeSlider from "./components/VolumeSlider";
import SimpleSelect from "./components/SimpleSelect";
import SwingMeter from "./components/SwingMeter";

const initialState = { count: 0 };

const theme = createMuiTheme({
	typography: {
		fontFamily: "Anton",
		body1: {
			fontWeight: 800,
			fontSize: 23,
			letterSpacing: 1,
		},
	},
	palette: {
		type: "dark",
		primary: {
			main: "#CF9F4E",
		},
	},
});

const innerTheme = createMuiTheme({
	palette: {
		secondary: {
			main: red[900],
		},
		primary: {
			main: blue[900],
		},
	},
});

function reducer(state, action) {
	switch (action.type) {
		case "setCount":
			return { count: action.count };
		default:
			throw new Error();
	}
}

function App() {
	const [amount, setAmount] = useState(50);
	const loop = useRef(null);
	const sampler = useRef(null);
	const gain = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [bpm, setBpm] = useState(360);
	const [state, dispatch] = useReducer(reducer, initialState);
	// const [fixed, setFixed] = useState(true);
	const count = useRef(0);
	const canvasDiv = useRef(null);
	const [volume, setVolume] = useState(50);
	const [sample, setSample] = useState("Pandeiro");

	const handleChange = (e, value) => {
		let newAmount = value;
		loop.current.dispose();
		loop.current = makeLoop(newAmount, sampler.current, isPlaying);
		setAmount(newAmount);
	};

	const drawme = (time, beat) => {
		Tone.Draw.schedule(function () {
			dispatch({ type: "setCount", count: count.current });
		}, time - 0.05);
	};

	const makeLoop = (swing, sampler, playState) => {
		const brazil = swing < 51;
		swing = (swing - 50) / 1000;
		let beat = 60 / Tone.Transport.bpm.value;
		swing = swing * beat;
		let beatBpmRatio = (beat / bpm) * 400 + 5;
		let newloop;
		let note;
		switch (sample) {
			case "Pandeiro":
				note = 5;
				break;
			case "Snare":
				note = 4;
				break;
			case "Repenique":
				note = 3;
				break;
			default:
				note = 5;
				break;
		}

		if (brazil) {
			//Mirroring is close to hip hop
			newloop = new Tone.Loop(function (time) {
				count.current = (count.current + 1) % 4;
				if (sampler.loaded) {
					let newTime;
					switch (count.current) {
						case 0:
							sampler.triggerAttack(`C${note}`, time, 0.7);
							drawme(time, 0);
							break;
						case 1:
							newTime = time - (swing * beatBpmRatio) / 2;
							sampler.triggerAttack(`D${note}`, newTime, 0.7);
							drawme(newTime, 1);
							break;
						case 2:
							newTime = time + swing * beatBpmRatio;
							sampler.triggerAttack(`E${note}`, newTime, 0.7);
							drawme(newTime, 2);
							break;
						default:
							newTime = time + swing * beatBpmRatio;
							sampler.triggerAttack(`F${note}`, newTime, 0.7);
							drawme(newTime, 3);
							break;
					}
				}
			}, "4n");
		} else {
			// traditional jazz swing
			newloop = new Tone.Loop(function (time) {
				count.current = (count.current + 1) % 4;
				if (sampler.loaded) {
					let newTime;
					switch (count.current) {
						case 0:
							sampler.triggerAttack(`C${note}`, time, 0.7);
							drawme(time, 0);
							break;
						case 1:
							newTime = time + (swing * beatBpmRatio) / 2;
							sampler.triggerAttack(`D${note}`, newTime, 0.7);
							drawme(newTime, 1);
							break;
						case 2:
							sampler.triggerAttack(`E${note}`, time, 0.7);
							drawme(time, 2);
							break;
						default:
							newTime = time + (swing * beatBpmRatio) / 2;
							sampler.triggerAttack(`F${note}`, newTime, 0.7);
							drawme(newTime, 3);
							break;
					}
				}
			}, "4n");
		}
		if (playState) {
			newloop.start(0);
		}
		return newloop;
	};

	useEffect(() => {
		Tone.Transport.bpm.value = 360;
		Tone.Transport.start();
		gain.current = new Tone.Gain().toMaster();
		sampler.current = new Tone.Sampler(
			{
				C5: pan1,
				D5: pan2,
				E5: pan3,
				F5: pan4,
				C4: sn1,
				D4: sn2,
				E4: sn3,
				F4: sn4,
				C3: rep1,
				D3: rep2,
				E3: rep3,
				F3: rep4,
			},
			{
				onload: () => {
					// setLoaded(true);
					loop.current = makeLoop(50, sampler.current, false);
					loop.current.stop();
				},
			}
		).connect(gain.current);
		let button = document.getElementById("playButton");
		canvasDiv.current.appendChild(button);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		gain.current.gain.value = (volume / 100) * 1.2;
	}, [volume]);

	const handleBpmChange = (e, value) => {
		let newBpm = value * 4;
		Tone.Transport.bpm.value = newBpm;
		if (isPlaying) {
			loop.current.dispose();
			loop.current = makeLoop(amount, sampler.current, isPlaying);
		}
		setBpm(newBpm);
	};

	useEffect(() => {
		if (loop.current) {
			loop.current.cancel();
			loop.current.dispose();
			loop.current = makeLoop(amount, sampler.current, true);
		}
	}, [sample]);

	const handleToggle = () => {
		if (isPlaying) {
			setIsPlaying(false);
			loop.current.stop("now");
		} else {
			setIsPlaying(true);
			loop.current.cancel();
			loop.current.dispose();
			loop.current = makeLoop(amount, sampler.current, true);
		}
	};

	return (
		<div className="App">
			<div className="controls-visuals">
				<ThemeProvider theme={theme}>
					<div className="controls-container">
						<SwingMeter onChange={handleChange} />
						{/* <DiscreteSlider fixed={fixed} handleChange={handleChange} /> */}
						<BpmSlider bpm={bpm} handleChange={handleBpmChange} />
						{/* <FormControlLabel
							className="switch"
							control={
								<Switch
									checked={fixed}
									onChange={(e) => (fixed ? setFixed(false) : setFixed(true))}
									name="fixed/free"
									color="primary"
									size="small"
								/>
							}
							label="Fixed/Free"
						/> */}
						<SimpleSelect
							onChange={setSample}
							options={["Pandeiro", "Snare", "Repenique"]}
						/>
						<VolumeSlider setValue={setVolume} value={volume} />
						<ThemeProvider theme={innerTheme}>
							<div id="playButton">
								<Button
									variant="contained"
									color={isPlaying ? "secondary" : "primary"}
									onClick={(e) => handleToggle()}
								>
									{!isPlaying ? <PlayArrowIcon /> : <StopIcon />}
								</Button>
							</div>
						</ThemeProvider>
					</div>
				</ThemeProvider>
				<div style={{ position: "relative" }} ref={canvasDiv}>
					<P5Wrapper
						sketch={sketch}
						counter={state.count}
						swing={(amount - 50) / 100}
					/>
				</div>
			</div>
			<div style={{ marginTop: 50 }}>
				<p>
					Designed by{" "}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={"https://scottkettner.com"}
					>
						Scott Kettner
					</a>{" "}
					and{" "}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={"https://omrinuri.com"}
					>
						Omri Nuri
					</a>
				</p>
			</div>
			{/* <ShareDial/> */}
		</div>
	);
}

export default App;
