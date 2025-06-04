let audioCtx;
let audioSource
let gainNode;
let pitchNode;;
let videoElement;
let is_ready = false;

$(document).ready( function() {
	try {
		videoElement = document.querySelector("video");
		initSoundEffect();
	} catch (err) {
		console.log(err);
	}
});

const initSoundEffect = async () => {
	try {
		await setupContext();
		audioSource  = audioCtx.createMediaElementSource(videoElement);
		pitchNode = new AudioWorkletNode(audioCtx, "pitch-processor", {
							channelCount: 2,
							channelCountMode: "clamped-max"
						});
		gainNode = audioCtx.createGain();
		audioSource.connect(pitchNode).connect(gainNode).connect(audioCtx.destination);

	} catch (err) {
		console.error('[loadSource] ', err);
	}
};

window.soundSetPitch = function(pitch) {
	pitchNode.parameters.get("semitone").value = pitch;
}

const setupContext = function () {
	try {
		audioCtx = new AudioContext();
		return audioCtx.audioWorklet.addModule('/js/pitch-processor.js');
	} catch (err) {
		console.error('[setupContext] ', err);
	}
};

