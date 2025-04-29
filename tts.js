var config = {
    voices: {
        "EN": "en-US-JennyNeural",
        "PL": "pl-PL-ZofiaNeural",
        "ES": "es-ES-ElviraNeural",
        "DE": "de-DE-KatjaNeural",
        "FR": "fr-FR-DeniseNeural",
        "DEFAULT": "en-US-JennyNeural"
    },
    minDelaySeconds: 3,
    maxDelaySeconds: 6,
    charsPerSecond: 2.5,
    ttsRate: "+0%"
};

var isAnnouncing = false;
var currentTimeout = null;
var timeAnnouncedHour = null;

function detectLanguage(fileName) {
    const match = fileName.match(/\[([A-Z]{2})\]/i);
    if (match) {
        return match[1].toUpperCase();
    }
    return "EN";  // Fallback to English if no tag
}

function getVoiceForLang(lang) {
    return config.voices[lang] || config.voices.DEFAULT;
}

function stripLanguageTags(text) {
    return text.replace(/\[[A-Z]{2}\]/gi, "").trim();
}

function escapeQuotes(text) {
    return text.replace(/"/g, '\\"');
}

function calculateDelay(text) {
    const estimated = text.length / config.charsPerSecond;
    return Math.max(config.minDelaySeconds, Math.min(config.maxDelaySeconds, Math.ceil(estimated)));
}

function formatEnglishTimeText() {
    const now = new Date();
    let hour = now.getHours();
    const minute = now.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const minuteStr = minute.toString().padStart(2, '0');
    return `It's now ${hour}:${minuteStr} ${ampm}.`;
}

function speakText(text, voiceKey) {
    const voice = getVoiceForLang(voiceKey);
    const cmd = 'edge-playback --voice ' + voice +
        ' --rate "' + config.ttsRate + '"' +
        ' --text "' + escapeQuotes(text) + '"';
    WshShell.Run(cmd, 0, false);
}

function on_playback_new_track() {
    if (currentTimeout !== null) {
        window.ClearTimeout(currentTimeout);
        currentTimeout = null;
    }
    isAnnouncing = false;

    const rawFileName = fb.TitleFormat("%filename%").Eval();
    const lang = detectLanguage(rawFileName);
    const spokenText = stripLanguageTags(rawFileName).replace(/\s*-\s*/g, " . ");
    const now = new Date();

    let totalDelay = 0;

    // Announce time every full hour (once per hour)
    if (now.getMinutes() === 0 && timeAnnouncedHour !== now.getHours()) {
        const timeText = formatEnglishTimeText();
        speakText(timeText, "EN");
        totalDelay = calculateDelay(timeText);
        timeAnnouncedHour = now.getHours();
    }

    const trackDelay = calculateDelay(spokenText);
    currentTimeout = window.SetTimeout(function () {
        speakText(spokenText, lang);
        isAnnouncing = true;

        window.SetTimeout(function () {
            isAnnouncing = false;
            currentTimeout = null;
        }, trackDelay * 1000);
    }, totalDelay * 1000);
}

// Auto-run if track is already playing
if (fb.IsPlaying) on_playback_new_track();
