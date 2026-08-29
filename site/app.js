const BUILD_VERSION = "creator-slice-0.2.0";
const PERFORMANCE_FPS = 24;
const PERFORMANCE_FRAMES = 145;
const PERFORMANCE_DURATION_MS = (PERFORMANCE_FRAMES / PERFORMANCE_FPS) * 1000;
const FAST = new URLSearchParams(location.search).has("fast");
const TIME_SCALE = FAST ? 0.08 : 1;

const screens = [...document.querySelectorAll(".screen")];
const hubStage = document.querySelector("#hub-stage");
const hubNaya = document.querySelector("#hub-naya");
const hubPaths = document.querySelector("#hub-paths");
const routeLabel = document.querySelector("#route-label");
const soundToggle = document.querySelector("#sound-toggle");
const signalButtons = [...document.querySelectorAll(".signal")];
const performanceCanvas = document.querySelector("#performance-canvas");
const performanceContext = performanceCanvas.getContext("2d", { alpha: false });
const towerCanvas = document.querySelector("#tower-canvas");
const towerContext = towerCanvas.getContext("2d", { alpha: false });

const names = {
	outfit: { 1: "Neon", 2: "Glamour", 3: "Street" },
	background: { 1: "Neon", 2: "Glamour", 3: "Street" },
	movement: { 1: "Pulse Step", 2: "Arc Turn", 3: "Power Finish" }
};

const backgroundFiles = {
	1: "assets/performance/neon.png",
	2: "assets/performance/glamour.png",
	3: "assets/performance/street.png"
};

const mission = {
	phase: "idle",
	pattern: [],
	inputIndex: 0,
	accepting: false,
	correct: 0,
	incorrect: 0,
	corruptionRepaired: true,
	murkChoice: null,
	gatewayBaseResult: "strong"
};

const creator = {
	entryMode: "direct",
	outfit: 1,
	background: 1,
	movement: 1,
	effect: "creator",
	resultCategory: "creator",
	outcomeKey: "",
	frames: [],
	backgroundImage: null,
	playing: false,
	animationHandle: 0,
	playbackToken: 0,
	stopPlaybackAudio: null,
	videoBlob: null,
	videoUrl: null,
	exportFileName: ""
};

const ownedUnlocks = new Set(JSON.parse(localStorage.getItem("dreamRealmUnlocks") || "[]"));
let audioContext = null;
let audioEnabled = false;
let scheduledTimers = [];
let hubWalkTimer = 0;
let towerLoopHandle = 0;

window.dreamRealmEvents = [];

function track(eventName, resultValue = null, properties = {}) {
	const event = {
		creator_invite_id: "private_slice_local",
		session_id: sessionStorage.dreamRealmSession || (sessionStorage.dreamRealmSession = crypto.randomUUID()),
		timestamp_utc: new Date().toISOString(),
		device_category: innerWidth < 600 ? "mobile" : innerWidth < 980 ? "tablet" : "desktop",
		room: currentRoom(),
		event_name: eventName,
		result_value: resultValue,
		build_version: BUILD_VERSION,
		entry_mode: creator.entryMode,
		...properties
	};
	window.dreamRealmEvents.push(event);
}

function currentRoom() {
	const active = document.querySelector(".screen.active")?.id || "";
	if (active.includes("hub") || active.includes("access")) return "hub";
	if (active.includes("tower")) return "tower";
	if (active.includes("performance")) return "preview";
	return "dance";
}

function later(callback, milliseconds) {
	const timer = setTimeout(callback, milliseconds * TIME_SCALE);
	scheduledTimers.push(timer);
	return timer;
}

function clearTimers() {
	for (const timer of scheduledTimers) clearTimeout(timer);
	scheduledTimers = [];
}

function showScreen(id, routeText) {
	for (const screen of screens) screen.classList.toggle("active", screen.id === id);
	if (routeText) routeLabel.textContent = routeText;
	scrollTo({ top: 0, behavior: "smooth" });
}

function ensureAudio() {
	if (!audioContext) audioContext = new AudioContext();
	audioContext.resume();
	audioEnabled = true;
	soundToggle.textContent = "Sound on";
}

function playTone(frequency, duration = 0.18, volume = 0.045, destination = null, type = "sine") {
	if (!audioContext) return;
	const now = audioContext.currentTime;
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	oscillator.type = type;
	oscillator.frequency.value = frequency;
	gain.gain.setValueAtTime(volume, now);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
	oscillator.connect(gain);
	if (audioEnabled) gain.connect(audioContext.destination);
	if (destination) gain.connect(destination);
	oscillator.start(now);
	oscillator.stop(now + duration + 0.03);
}

function startBeat(destination = null) {
	const frequencySets = {
		1: [164.81, 246.94, 329.63, 246.94],
		2: [146.83, 220, 293.66, 349.23],
		3: [110, 164.81, 220, 329.63]
	};
	const frequencies = frequencySets[creator.movement];
	let step = 0;
	playTone(frequencies[0], 0.22, 0.035, destination, "triangle");
	const interval = setInterval(() => {
		playTone(frequencies[step % frequencies.length], 0.2, 0.035, destination, step % 2 ? "sine" : "triangle");
		step += 1;
	}, 500);
	return () => clearInterval(interval);
}

function startHubEntrance() {
	showScreen("screen-hub", "ENTERING DREAM REALM");
	hubNaya.src = "assets/hub/naya-walk/playablenaya-walking%20up-right-000.png";
	hubStage.classList.remove("reveal");
	void hubStage.offsetWidth;
	hubStage.classList.add("reveal");
	hubPaths.hidden = true;

	let frame = 0;
	clearInterval(hubWalkTimer);
	hubWalkTimer = setInterval(() => {
		hubNaya.src = `assets/hub/naya-walk/playablenaya-walking%20up-right-${String(frame % 8).padStart(3, "0")}.png`;
		frame += 1;
	}, 1000 / 7);

	playTone(116, 1.2, 0.06, null, "sine");
	later(() => playTone(52, 0.6, 0.08, null, "sine"), 4800);
	later(() => {
		clearInterval(hubWalkTimer);
		hubNaya.src = "assets/hub/naya-idle/playablenaya-idle%20up-000.png";
		hubPaths.hidden = false;
		routeLabel.textContent = "DREAM REALM / CHOOSE A PATH";
		track("entrance_completed", "complete");
		track("hub_entered", "first", { tower_state: ownedUnlocks.has("effect.dance.restored-pulse") ? "active" : "dormant" });
		notifyChallengeStateChange("entrance_completed");
	}, 7600);

	updateHubTower();
}

function updateHubTower() {
	const active = ownedUnlocks.has("effect.dance.restored-pulse") || localStorage.getItem("dreamRealmTowerActive") === "true";
	document.querySelector("#tower-pulse").classList.toggle("active", active);
	document.querySelector("#tower-state").textContent = active ? "TOWER / CREATOR SIGNAL ACTIVE" : "TOWER / DORMANT";
}

function enterGateway() {
	creator.entryMode = "gateway";
	creator.effect = "creator";
	creator.resultCategory = "strong";
	track("room_selected", "dance_gateway", { source: "hub" });
	track("mission_started", "dance.signal-sync");
	resetMission();
	showScreen("screen-mission", "DANCE GATEWAY MISSION");
	beginTutorial();
}

function enterCreatorDirect() {
	creator.entryMode = "direct";
	creator.resultCategory = "creator";
	creator.effect = "creator";
	track("room_selected", "create_now", { source: "hub" });
	openCreator();
}

function resetMission() {
	clearTimers();
	Object.assign(mission, {
		phase: "tutorial",
		pattern: [0],
		inputIndex: 0,
		accepting: false,
		correct: 0,
		incorrect: 0,
		corruptionRepaired: true,
		murkChoice: null,
		gatewayBaseResult: "strong",
		inputResults: []
	});
	updateMissionScore();
}

function beginTutorial() {
	mission.phase = "tutorial";
	mission.pattern = [0];
	mission.inputIndex = 0;
	mission.inputResults = [];
	document.querySelector("#mission-title").textContent = "Wake the first signal";
	document.querySelector("#mission-instruction").textContent = "No tutorial panel: touch the floor signal that wakes.";
	renderMissionProgress();
	later(() => {
		flashSignal(0, "cue", 720);
		document.querySelector("#mission-feedback").textContent = "Pulse is awake.";
		mission.accepting = true;
	}, 500);
}

function beginCleanRound() {
	mission.phase = "clean";
	mission.pattern = [0, 2, 1];
	mission.inputIndex = 0;
	mission.inputResults = [];
	document.querySelector("#mission-title").textContent = "Return the clean sequence";
	document.querySelector("#mission-instruction").textContent = "Watch three movement signals, then repeat their order.";
	track("pattern_round_started", "clean", { cue_count: 3 });
	renderMissionProgress();
	playPattern(false);
}

function beginCorruptRound() {
	mission.phase = "corrupt-reference";
	mission.pattern = [0, 2, 1, 3];
	mission.inputIndex = 0;
	mission.inputResults = [];
	document.querySelector("#mission-title").textContent = "Remember the original";
	document.querySelector("#mission-instruction").textContent = "The room shows a clean reference before Noiz enters.";
	track("pattern_round_started", "corrupt", { cue_count: 4 });
	renderMissionProgress();
	playPattern(false, () => {
		mission.phase = "corrupt";
		track("noiz_disruption_encountered", "replace_cue", { corrupted_index: 2 });
		document.querySelector("#mission-instruction").textContent = "Noiz replaced one cue. Reconstruct the original, not the glitch.";
		playPattern(true);
	});
}

function playPattern(corrupt, afterPlayback = null) {
	mission.accepting = false;
	const gap = 610;
	mission.pattern.forEach((signalId, index) => {
		later(() => {
			const shown = corrupt && index === 2 ? (signalId + 2) % 4 : signalId;
			flashSignal(shown, corrupt && index === 2 ? "corrupted" : "cue", 390);
		}, 400 + gap * index);
	});
	later(() => {
		if (afterPlayback) {
			afterPlayback();
			return;
		}
		mission.inputIndex = 0;
		mission.inputResults = [];
		mission.accepting = true;
		document.querySelector("#mission-feedback").textContent = corrupt ? "Repair the original sequence." : "Your turn.";
		renderMissionProgress();
	}, 520 + gap * mission.pattern.length);
}

function flashSignal(id, className, duration) {
	const button = signalButtons[id];
	button.classList.add(className);
	playTone([220, 294, 370, 494][id], duration / 1000, 0.05);
	later(() => button.classList.remove(className), duration);
}

function handleSignal(id, inputMethod) {
	if (!mission.accepting) return;
	const expected = mission.pattern[mission.inputIndex];
	const correct = id === expected;
	mission.inputResults[mission.inputIndex] = correct;
	if (correct) {
		mission.correct += 1;
		flashSignal(id, "correct", 240);
		track("pattern_input_correct", id, { cue_index: mission.inputIndex, round_id: mission.phase, input_method: inputMethod });
	} else {
		mission.incorrect += 1;
		if (mission.phase === "corrupt") mission.corruptionRepaired = false;
		signalButtons[id].classList.add("wrong");
		later(() => signalButtons[id].classList.remove("wrong"), 300);
		playTone(92, 0.24, 0.07, null, "sawtooth");
		track("pattern_input_incorrect", id, { expected_cue: expected, cue_index: mission.inputIndex, round_id: mission.phase, input_method: inputMethod });
	}
	mission.inputIndex += 1;
	updateMissionScore();
	renderMissionProgress();
	if (mission.inputIndex < mission.pattern.length) return;
	mission.accepting = false;
	later(() => {
		if (mission.phase === "tutorial") {
			track("tutorial_action_completed", "pulse", { input_method: inputMethod });
			beginCleanRound();
		} else if (mission.phase === "clean") {
			beginCorruptRound();
		} else if (mission.phase === "corrupt") {
			finishGameplay();
		}
	}, 620);
}

function updateMissionScore() {
	document.querySelector("#mission-score").textContent = Math.max(0, 100 - mission.incorrect * 15);
}

function renderMissionProgress() {
	const container = document.querySelector("#mission-progress");
	container.replaceChildren();
	for (let index = 0; index < mission.pattern.length; index++) {
		const dot = document.createElement("i");
		if (index < mission.inputIndex) dot.className = mission.inputResults[index] ? "ok" : "miss";
		container.append(dot);
	}
}

function finishGameplay() {
	const score = Math.max(0, 100 - mission.incorrect * 15);
	creator.resultCategory = score >= 70 && mission.corruptionRepaired ? "strong" : score >= 55 ? "remix" : "noiz";
	mission.gatewayBaseResult = creator.resultCategory;
	track("noiz_disruption_resolved", mission.corruptionRepaired ? "repaired" : "not_repaired");
	track("gameplay_completed", score, { corruption_repaired: mission.corruptionRepaired, result_category: creator.resultCategory });
	showScreen("screen-murk", "MURK / DOUBT");
	track("murk_choice_displayed", "confidence_doubt", { dimmed_clue: "expression" });
}

function chooseMurk(choice) {
	mission.murkChoice = choice;
	track(choice === "evidence" ? "murk_advice_rejected" : "murk_advice_followed", "confidence_doubt");
	if (choice === "doubt" && creator.resultCategory === "strong") creator.resultCategory = "remix";
	mission.gatewayBaseResult = creator.resultCategory;
	openCreator();
}

function openCreator() {
	showScreen("screen-creator", creator.entryMode === "gateway" ? "MISSION → CREATOR" : "DIRECT CREATOR TOOLS");
	document.querySelector("#creator-route").textContent = creator.entryMode === "gateway" ? "GATEWAY REWARD / CREATIVE LOCK" : "CREATE NOW / STARTER TOOLS";
	document.querySelector("#creator-clues").textContent = creator.entryMode === "gateway"
		? `Earned clues: SHARP / CITY / CONFIDENT · ${creator.resultCategory.toUpperCase()} signal`
		: "No mission required. Starter outfits, scenes and movements are available.";

	const restoredButton = document.querySelector("#restored-effect-choice");
	const unlocked = ownedUnlocks.has("effect.dance.restored-pulse");
	restoredButton.disabled = !unlocked;
	restoredButton.textContent = unlocked ? "Restored Pulse" : "Restored Pulse / locked";
	if (!unlocked && creator.effect === "restored") creator.effect = "creator";
	updateCreatorPreview();
}

function chooseCreator(category, value, button) {
	creator[category] = Number(value);
	for (const peer of document.querySelectorAll(`.creator-choice[data-category="${category}"]`)) peer.classList.toggle("selected", peer === button);
	const eventName = category === "movement" ? "final_move_selected" : `${category}_selected`;
	track(eventName, names[category][creator[category]]);
	updateCreatorPreview();
}

function chooseEffect(effect, button) {
	if (button.disabled) return;
	creator.effect = effect;
	for (const peer of document.querySelectorAll(".effect-choice")) peer.classList.toggle("selected", peer === button);
	track("outcome_effect_selected", effect);
	updateCreatorPreview();
}

function updateCreatorPreview() {
	document.querySelector("#creator-background").src = backgroundFiles[creator.background];
	document.querySelector("#creator-naya").src = framePath(creator.outfit, creator.movement, 0);
	document.querySelector("#preview-outfit").textContent = names.outfit[creator.outfit].toUpperCase();
	document.querySelector("#preview-move").textContent = names.movement[creator.movement].toUpperCase();
	document.querySelector("#creator-effect").className = `creator-effect ${creator.effect}`;
}

function framePath(outfit, movement, frame) {
	return `assets/performance/naya/${outfit}_${movement}/${String(frame).padStart(3, "0")}.png`;
}

async function loadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.decoding = "async";
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`Could not load ${url}`));
		image.src = url;
	});
}

async function buildPerformance() {
	if (creator.entryMode === "gateway") {
		const fitCount =
			Number(creator.outfit === 2) +
			Number(creator.background === 3) +
			Number(creator.movement === 3);
		if (mission.gatewayBaseResult === "noiz") creator.resultCategory = "noiz";
		else if (mission.gatewayBaseResult === "strong" && fitCount === 3) creator.resultCategory = "strong";
		else if (fitCount >= 1) creator.resultCategory = "remix";
		else creator.resultCategory = "noiz";
		track("creator_fit_evaluated", creator.resultCategory, {
			fit_count: fitCount,
			target_outfit: 2,
			target_background: 3,
			target_movement: 3,
			gameplay_result: mission.gatewayBaseResult
		});
	}

	creator.outcomeKey = `dance.${creator.entryMode}.${creator.outfit}.${creator.background}.${creator.movement}.${creator.effect}.${creator.resultCategory}`;
	document.querySelector("#performance-key").textContent = creator.outcomeKey;
	document.querySelector("#performance-status").textContent = creator.entryMode === "gateway" ? "MISSION OUTPUT READY" : "CREATOR SIGNAL READY";
	document.querySelector("#performance-title").textContent = `${names.outfit[creator.outfit]} / ${names.movement[creator.movement]}`;
	showScreen("screen-performance", "CREATOR PERFORMANCE");
	document.querySelector("#performance-loading").classList.remove("ready");
	if (creator.videoUrl) URL.revokeObjectURL(creator.videoUrl);
	creator.videoBlob = null;
	creator.videoUrl = null;
	creator.exportFileName = "";
	const downloadLink = document.querySelector("#download-video");
	downloadLink.hidden = true;
	downloadLink.removeAttribute("href");
	downloadLink.removeAttribute("download");
	downloadLink.textContent = "Download video";
	document.querySelector("#retry-mission").hidden = creator.entryMode !== "gateway" || creator.resultCategory !== "noiz";
	document.querySelector("#send-tower").disabled = true;
	document.querySelector("#export-note").textContent = "The downloaded video is recorded from the actual selected outfit, background, movement and outcome effect.";

	track("creative_lock_confirmed", creator.outcomeKey, {
		outfit: creator.outfit,
		background: creator.background,
		movement: creator.movement,
		effect: creator.effect,
		result_category: creator.resultCategory
	});

	creator.backgroundImage = await loadImage(backgroundFiles[creator.background]);
	creator.frames = new Array(PERFORMANCE_FRAMES);
	let loaded = 0;
	await Promise.all(Array.from({ length: PERFORMANCE_FRAMES }, async (_, frame) => {
		creator.frames[frame] = await loadImage(framePath(creator.outfit, creator.movement, frame));
		loaded += 1;
		document.querySelector("#performance-loading").textContent = `Loading selected performance frames… ${loaded}/${PERFORMANCE_FRAMES}`;
	}));
	document.querySelector("#performance-loading").classList.add("ready");
	const snapshot = performanceSnapshot();
	drawPerformanceFrame(0, performanceContext, performanceCanvas, snapshot);
	playPerformance(null, snapshot);
	track("performance_viewed", creator.resultCategory, { outcome_key: creator.outcomeKey });
}

function drawCover(context, image, width, height) {
	const scale = Math.max(width / image.width, height / image.height);
	const drawWidth = image.width * scale;
	const drawHeight = image.height * scale;
	context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function performanceSnapshot() {
	const frames = creator.frames.slice();
	if (!creator.backgroundImage || frames.length !== PERFORMANCE_FRAMES || frames.some(frame => !frame)) {
		throw new Error("The selected performance is not fully loaded yet.");
	}
	return { backgroundImage: creator.backgroundImage, frames };
}

function drawPerformanceFrame(frameIndex, context, canvas, snapshot = performanceSnapshot()) {
	const width = canvas.width;
	const height = canvas.height;
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, width, height);
	drawCover(context, snapshot.backgroundImage, width, height);

	const naya = snapshot.frames[frameIndex % snapshot.frames.length];
	const nayaHeight = height * 0.91;
	const nayaWidth = naya.width * nayaHeight / naya.height;
	context.save();
	context.shadowColor = "rgba(0,0,0,.55)";
	context.shadowBlur = 20;
	context.shadowOffsetY = 13;
	context.drawImage(naya, width * 0.5 - nayaWidth / 2, height - nayaHeight, nayaWidth, nayaHeight);
	context.restore();

	drawOutcomeEffect(context, width, height, frameIndex);

	context.fillStyle = "rgba(4,5,15,.72)";
	context.fillRect(0, height - 52, width, 52);
	context.fillStyle = "white";
	context.font = "700 20px Inter, system-ui, sans-serif";
	context.textBaseline = "middle";
	context.fillText(`DREAM REALM  /  ${names.outfit[creator.outfit].toUpperCase()}  /  ${names.movement[creator.movement].toUpperCase()}`, 26, height - 26);
	context.textAlign = "right";
	context.fillStyle = "#8eefff";
	context.fillText(creator.entryMode === "gateway" ? creator.resultCategory.toUpperCase() : "CREATOR SIGNAL", width - 26, height - 26);
	context.textAlign = "left";
}

function drawOutcomeEffect(context, width, height, frameIndex) {
	const time = frameIndex / PERFORMANCE_FPS;
	context.save();
	context.globalCompositeOperation = "screen";
	if (creator.resultCategory === "noiz") {
		context.globalAlpha = 0.28 + Math.max(0, Math.sin(time * 18)) * 0.3;
		context.fillStyle = frameIndex % 8 < 3 ? "rgba(255,35,146,.36)" : "rgba(55,220,255,.26)";
		for (let line = 0; line < 5; line++) {
			const y = (line * 137 + frameIndex * 17) % height;
			context.fillRect(0, y, width, 5 + line);
		}
	} else if (creator.effect === "restored" || creator.resultCategory === "strong") {
		const radius = 80 + ((frameIndex * 5) % 260);
		context.globalAlpha = 0.38;
		context.strokeStyle = "rgba(102,235,255,.9)";
		context.lineWidth = 5;
		context.beginPath();
		context.arc(width / 2, height * 0.67, radius, 0, Math.PI * 2);
		context.stroke();
		context.strokeStyle = "rgba(255,92,214,.65)";
		context.beginPath();
		context.arc(width / 2, height * 0.67, radius * 0.72, 0, Math.PI * 2);
		context.stroke();
	} else if (creator.resultCategory === "remix") {
		const gradient = context.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, "rgba(72,224,255,.16)");
		gradient.addColorStop(0.5, "rgba(255,166,66,.12)");
		gradient.addColorStop(1, "rgba(255,83,210,.18)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
	} else {
		const x = ((frameIndex * 13) % (width + 300)) - 150;
		const gradient = context.createLinearGradient(x - 100, 0, x + 100, 0);
		gradient.addColorStop(0, "rgba(91,231,255,0)");
		gradient.addColorStop(0.5, "rgba(91,231,255,.22)");
		gradient.addColorStop(1, "rgba(91,231,255,0)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, width, height);
	}
	context.restore();
}

function playPerformance(onComplete = null, snapshotOverride = null) {
	creator.playbackToken += 1;
	const playbackToken = creator.playbackToken;
	cancelAnimationFrame(creator.animationHandle);
	creator.stopPlaybackAudio?.();
	creator.stopPlaybackAudio = null;
	const snapshot = snapshotOverride || performanceSnapshot();
	creator.playing = true;
	const startedAt = performance.now();
	const stopBeat = audioEnabled ? startBeat() : () => {};
	creator.stopPlaybackAudio = stopBeat;
	function tick(now) {
		if (playbackToken !== creator.playbackToken) return;
		const elapsed = now - startedAt;
		const frame = Math.min(PERFORMANCE_FRAMES - 1, Math.floor(elapsed / 1000 * PERFORMANCE_FPS));
		drawPerformanceFrame(frame, performanceContext, performanceCanvas, snapshot);
		if (elapsed < PERFORMANCE_DURATION_MS) {
			creator.animationHandle = requestAnimationFrame(tick);
		} else {
			creator.playing = false;
			stopBeat();
			if (creator.stopPlaybackAudio === stopBeat) creator.stopPlaybackAudio = null;
			onComplete?.();
		}
	}
	creator.animationHandle = requestAnimationFrame(tick);
}

function supportedMimeType() {
	const options = [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm"
	];
	return options.find(type => MediaRecorder.isTypeSupported(type)) || "";
}

async function recordPerformance() {
	if (!("MediaRecorder" in window) || !performanceCanvas.captureStream) {
		document.querySelector("#export-note").textContent = "This browser cannot record the canvas. Use a current Chromium, Firefox or supported Safari build.";
		track("video_export_error", "unsupported");
		return;
	}

	const snapshot = performanceSnapshot();
	ensureAudio();
	document.querySelector("#record-video").disabled = true;
	document.querySelector("#download-video").hidden = true;
	document.querySelector("#send-tower").disabled = true;
	document.querySelector("#export-note").textContent = "Recording the actual selected performance…";

	const canvasStream = performanceCanvas.captureStream(30);
	const audioDestination = audioContext.createMediaStreamDestination();
	const combined = new MediaStream([...canvasStream.getVideoTracks(), ...audioDestination.stream.getAudioTracks()]);
	const mimeType = supportedMimeType();
	const recorder = new MediaRecorder(combined, {
		...(mimeType ? { mimeType } : {}),
		videoBitsPerSecond: 5_000_000,
		audioBitsPerSecond: 128_000
	});
	const chunks = [];
	recorder.addEventListener("dataavailable", event => {
		if (event.data.size) chunks.push(event.data);
	});
	recorder.addEventListener("stop", () => {
		const type = recorder.mimeType || mimeType || "video/webm";
		creator.videoBlob = new Blob(chunks, { type });
		if (creator.videoUrl) URL.revokeObjectURL(creator.videoUrl);
		creator.videoUrl = URL.createObjectURL(creator.videoBlob);
		const extension = type.includes("mp4") ? ".mp4" : ".webm";
		creator.exportFileName = `DreamRealm-${creator.outcomeKey}-${Date.now()}${extension}`;
		const link = document.querySelector("#download-video");
		link.href = creator.videoUrl;
		link.download = creator.exportFileName;
		link.hidden = false;
		link.textContent = `Download video (${(creator.videoBlob.size / 1048576).toFixed(1)} MB)`;
		document.querySelector("#send-tower").disabled = false;
		document.querySelector("#record-video").disabled = false;
		document.querySelector("#export-note").textContent = `Video ready: ${type}. It contains outfit ${names.outfit[creator.outfit]}, background ${names.background[creator.background]}, ${names.movement[creator.movement]} and ${creator.effect}/${creator.resultCategory} effects.`;
		track("video_export_ready", creator.exportFileName, { bytes: creator.videoBlob.size, mime_type: type, outcome_key: creator.outcomeKey });
		notifyChallengeStateChange("video_export_ready");
	});
	recorder.addEventListener("error", event => {
		document.querySelector("#record-video").disabled = false;
		document.querySelector("#export-note").textContent = `Video recording failed: ${event.error?.message || "unknown error"}`;
		track("video_export_error", event.error?.name || "unknown");
		notifyChallengeStateChange("video_export_error");
	});

	track("video_export_started", creator.outcomeKey);
	recorder.start(250);
	const stopBeat = startBeat(audioDestination);
	playPerformance(() => {
		stopBeat();
		recorder.stop();
	}, snapshot);
}

function downloadVideo() {
	track("output_clicked", "download", {
		file_name: creator.exportFileName,
		bytes: creator.videoBlob?.size || 0,
		outcome_key: creator.outcomeKey
	});
}

function sendToTower() {
	localStorage.setItem("dreamRealmTowerActive", "true");
	let unlockedNow = false;
	if (creator.entryMode === "gateway" && creator.resultCategory !== "noiz") {
		if (!ownedUnlocks.has("effect.dance.restored-pulse")) {
			ownedUnlocks.add("effect.dance.restored-pulse");
			localStorage.setItem("dreamRealmUnlocks", JSON.stringify([...ownedUnlocks]));
			unlockedNow = true;
		}
	}

	showScreen("screen-tower", "TRENDING TOWER");
	document.querySelector("#tower-status").textContent = creator.entryMode === "gateway" ? "SIGNAL RANKED" : "CREATOR SIGNAL LIVE";
	document.querySelector("#tower-title").textContent = creator.entryMode === "gateway" ? "Dream Realm restored the Dance frequency" : "Your performance entered the world";
	document.querySelector("#tower-detail").textContent = creator.entryMode === "gateway"
		? `${creator.resultCategory.toUpperCase()} mission output · ${names.outfit[creator.outfit]} · ${names.background[creator.background]} · ${names.movement[creator.movement]}`
		: `Direct creator output · ${names.outfit[creator.outfit]} · ${names.background[creator.background]} · ${names.movement[creator.movement]}`;
	document.querySelector("#unlock-card").hidden = !unlockedNow;
	track("tower_response_viewed", creator.entryMode === "gateway" ? "mission_signal" : "creator_signal", { outcome_key: creator.outcomeKey, unlocked: unlockedNow });
	startTowerLoop();
}

function startTowerLoop() {
	cancelAnimationFrame(towerLoopHandle);
	const snapshot = performanceSnapshot();
	const startedAt = performance.now();
	function tick(now) {
		const frame = Math.floor(((now - startedAt) / 1000 * PERFORMANCE_FPS) % PERFORMANCE_FRAMES);
		drawPerformanceFrame(frame, towerContext, towerCanvas, snapshot);
		towerLoopHandle = requestAnimationFrame(tick);
	}
	towerLoopHandle = requestAnimationFrame(tick);
}

function returnHub() {
	cancelAnimationFrame(towerLoopHandle);
	showScreen("screen-hub", "DREAM REALM / SIGNAL UPDATED");
	hubPaths.hidden = false;
	updateHubTower();
	track("hub_entered", "return", { tower_state: "active" });
}

function challengeError(code, message) {
	const error = new Error(message);
	error.code = code;
	return error;
}

function activeScreenId() {
	return document.querySelector(".screen.active")?.id || "unknown";
}

function missionScore() {
	return Math.max(0, 100 - mission.incorrect * 15);
}

function availableChallengeActions() {
	const screen = activeScreenId();
	const actions = [];
	if (screen === "screen-access") actions.push("activate_portal_human_control");
	if (screen === "screen-hub" && !hubPaths.hidden) actions.push("start_dream_realm_route");
	if (screen === "screen-mission" && mission.accepting) actions.push("submit_dance_signal");
	if (screen === "screen-murk") actions.push("resolve_murk_doubt");
	if (screen === "screen-creator") actions.push("set_creator_choices", "prepare_performance");
	if (screen === "screen-performance") {
		actions.push("record_video_human_control");
		if (creator.videoBlob) actions.push("send_output_to_tower");
	}
	if (screen === "screen-tower") actions.push("return_to_hub");
	return actions;
}

function getChallengeState() {
	const screen = activeScreenId();
	return {
		applicationBuild: BUILD_VERSION,
		screen,
		room: currentRoom(),
		route: creator.entryMode,
		hub: {
			entranceComplete: screen === "screen-hub" && !hubPaths.hidden,
			towerActive: ownedUnlocks.has("effect.dance.restored-pulse") || localStorage.getItem("dreamRealmTowerActive") === "true"
		},
		mission: {
			phase: mission.phase,
			acceptingInput: mission.accepting,
			inputIndex: mission.inputIndex,
			cueCount: mission.pattern.length,
			correctInputs: mission.correct,
			incorrectInputs: mission.incorrect,
			score: missionScore(),
			corruptionRepaired: mission.corruptionRepaired,
			murkChoice: mission.murkChoice,
			resultCategory: mission.gatewayBaseResult
		},
		creator: {
			outfit: names.outfit[creator.outfit],
			background: names.background[creator.background],
			movement: names.movement[creator.movement],
			effect: creator.effect,
			resultCategory: creator.resultCategory,
			outcomeKey: creator.outcomeKey || null,
			performancePrepared: creator.frames.length === PERFORMANCE_FRAMES && Boolean(creator.backgroundImage),
			videoReady: Boolean(creator.videoBlob),
			exportFileName: creator.exportFileName || null
		},
		unlocks: [...ownedUnlocks],
		availableActions: availableChallengeActions()
	};
}

function notifyChallengeStateChange(source) {
	window.dispatchEvent(new CustomEvent("dreamrealm:statechange", {
		detail: { source, state: getChallengeState() }
	}));
}

function assertScreen(expected, action) {
	const actual = activeScreenId();
	if (actual !== expected) {
		throw challengeError(
			"INVALID_STATE",
			`${action} is only available on ${expected}; the current screen is ${actual}.`
		);
	}
}

const creatorChoiceValues = {
	outfit: { neon: 1, glamour: 2, street: 3 },
	background: { neon: 1, glamour: 2, street: 3 },
	movement: { pulse_step: 1, arc_turn: 2, power_finish: 3 }
};

const DreamRealmChallenge = Object.freeze({
	getState() {
		return getChallengeState();
	},

	startRoute(route) {
		assertScreen("screen-hub", "Starting a Dream Realm route");
		if (hubPaths.hidden) {
			throw challengeError("HUB_NOT_READY", "The portal entrance is still playing. Wait until the HUB paths are visible.");
		}
		if (route === "gateway") enterGateway();
		else if (route === "creator") enterCreatorDirect();
		else throw challengeError("INVALID_INPUT", "route must be either 'gateway' or 'creator'.");
		notifyChallengeStateChange("start_dream_realm_route");
		return getChallengeState();
	},

	submitDanceSignal(signal) {
		assertScreen("screen-mission", "Submitting a Dance signal");
		if (!Number.isInteger(signal) || signal < 1 || signal > 4) {
			throw challengeError("INVALID_INPUT", "signal must be an integer from 1 to 4.");
		}
		if (!mission.accepting) {
			throw challengeError("INPUT_NOT_READY", "The mission is currently showing cues. Wait until the room asks for input.");
		}
		handleSignal(signal - 1, "webmcp");
		notifyChallengeStateChange("submit_dance_signal");
		return getChallengeState();
	},

	resolveMurkDoubt(choice) {
		assertScreen("screen-murk", "Resolving Murk's doubt");
		if (!['evidence', 'doubt'].includes(choice)) {
			throw challengeError("INVALID_INPUT", "choice must be either 'evidence' or 'doubt'.");
		}
		chooseMurk(choice);
		notifyChallengeStateChange("resolve_murk_doubt");
		return getChallengeState();
	},

	setCreatorChoices({ outfit, background, movement, effect }) {
		assertScreen("screen-creator", "Setting creator choices");
		const values = { outfit, background, movement };
		for (const [category, value] of Object.entries(values)) {
			if (!(value in creatorChoiceValues[category])) {
				throw challengeError("INVALID_INPUT", `${category} has an unsupported value: ${String(value)}.`);
			}
		}
		if (!['creator', 'restored'].includes(effect)) {
			throw challengeError("INVALID_INPUT", "effect must be either 'creator' or 'restored'.");
		}
		if (effect === "restored" && !ownedUnlocks.has("effect.dance.restored-pulse")) {
			throw challengeError("LOCKED_CHOICE", "The Restored Pulse effect is locked. Complete a non-Noiz Gateway result first.");
		}

		for (const [category, value] of Object.entries(values)) {
			const numericValue = creatorChoiceValues[category][value];
			const button = document.querySelector(`.creator-choice[data-category="${category}"][data-value="${numericValue}"]`);
			chooseCreator(category, numericValue, button);
		}
		const effectButton = document.querySelector(`.effect-choice[data-effect="${effect}"]`);
		chooseEffect(effect, effectButton);
		notifyChallengeStateChange("set_creator_choices");
		return getChallengeState();
	},

	async preparePerformance() {
		assertScreen("screen-creator", "Preparing a performance");
		await buildPerformance();
		notifyChallengeStateChange("prepare_performance");
		return getChallengeState();
	},

	sendOutputToTower() {
		assertScreen("screen-performance", "Sending an output to the Tower");
		if (!creator.videoBlob) {
			throw challengeError("VIDEO_NOT_READY", "Record the prepared performance with the visible Record video control before sending it to the Tower.");
		}
		sendToTower();
		notifyChallengeStateChange("send_output_to_tower");
		return getChallengeState();
	},

	returnToHub() {
		assertScreen("screen-tower", "Returning to the HUB");
		returnHub();
		notifyChallengeStateChange("return_to_hub");
		return getChallengeState();
	}
});

window.DreamRealmChallenge = DreamRealmChallenge;

document.querySelector("#activate-portal").addEventListener("click", () => {
	ensureAudio();
	track("portal_activated", "click");
	startHubEntrance();
	notifyChallengeStateChange("portal_activated");
});
document.querySelector("#gateway-entry").addEventListener("click", () => DreamRealmChallenge.startRoute("gateway"));
document.querySelector("#creator-entry").addEventListener("click", () => DreamRealmChallenge.startRoute("creator"));

signalButtons.forEach(button => button.addEventListener("click", event => {
	if (!mission.accepting) return;
	handleSignal(Number(button.dataset.signal), event.pointerType || "mouse");
	notifyChallengeStateChange("human_dance_signal");
}));
window.addEventListener("keydown", event => {
	const key = Number(event.key);
	if (key >= 1 && key <= 4 && mission.accepting) {
		handleSignal(key - 1, "keyboard");
		notifyChallengeStateChange("human_dance_signal");
	}
});

document.querySelectorAll("[data-murk]").forEach(button => button.addEventListener("click", () => DreamRealmChallenge.resolveMurkDoubt(button.dataset.murk)));
document.querySelectorAll(".creator-choice").forEach(button => button.addEventListener("click", () => {
	chooseCreator(button.dataset.category, button.dataset.value, button);
	notifyChallengeStateChange("human_creator_choice");
}));
document.querySelectorAll(".effect-choice").forEach(button => button.addEventListener("click", () => {
	chooseEffect(button.dataset.effect, button);
	notifyChallengeStateChange("human_creator_choice");
}));

document.querySelector("#build-performance").addEventListener("click", () => DreamRealmChallenge.preparePerformance().catch(error => {
	console.error(error);
	document.querySelector("#creator-clues").textContent = error.message;
	track("performance_load_error", error.message);
}));
document.querySelector("#replay-performance").addEventListener("click", () => playPerformance());
document.querySelector("#retry-mission").addEventListener("click", () => {
	track("retry_started", "dance_gateway", { outcome_key: creator.outcomeKey });
	enterGateway();
});
document.querySelector("#record-video").addEventListener("click", () => recordPerformance().catch(error => {
	console.error(error);
	document.querySelector("#export-note").textContent = error.message;
	track("video_export_error", error.message);
}));
document.querySelector("#download-video").addEventListener("click", downloadVideo);
document.querySelector("#send-tower").addEventListener("click", () => DreamRealmChallenge.sendOutputToTower());
document.querySelector("#return-hub").addEventListener("click", () => DreamRealmChallenge.returnToHub());

soundToggle.addEventListener("click", () => {
	if (!audioEnabled) {
		ensureAudio();
		playTone(330, 0.2);
	} else {
		audioEnabled = false;
		soundToggle.textContent = "Sound off";
	}
});

document.querySelector("#event-export").addEventListener("click", () => {
	const blob = new Blob([JSON.stringify(window.dreamRealmEvents, null, 2)], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `DreamRealm-events-${Date.now()}.json`;
	link.click();
	URL.revokeObjectURL(link.href);
});

document.querySelector("#build-id").textContent = BUILD_VERSION;
updateCreatorPreview();
updateHubTower();
track("invite_link_opened", "valid");
