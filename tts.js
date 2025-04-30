// Foobar2000 JScript Panel Script
// Universal Version for Public Sharing (JScript Panel v3 compatible)

// === External Requirements ===
//   - edge-playback CLI tool for TTS (Text-to-Speech)
//   - Local LLM server (OpenAI-compatible API compatible, e.g., LM Studio)
//   - Microsoft SAPI-compatible voices installed if using edge-playback
//   - Internet access not required (fully local unless LLM API points to remote)

// === Dependencies ===
//   - ActiveXObject for COM (WScript.Shell, MSXML2.XMLHTTP)
//   - JScript Panel v3 (https://github.com/marc2k3/foo-jscript-panel)
//   - Windows Script Host (WSH) enabled on system
//   - Proper PATH configuration for edge-playback CLI


// Create a WScript Shell object for executing external commands and showing popups
var WshShell = new ActiveXObject("WScript.Shell");

// === CONFIGURATION ===
var config = {
    // Mapping of language codes to Azure Neural voices
    voices: {
        "PL": "pl-PL-ZofiaNeural",    // Polish voice
        "ENG": "en-US-JennyNeural",   // English voice
        "PL-ENG": "pl-PL-ZofiaNeural",// Polish-English bilingual voice
        "DE": "de-DE-KatjaNeural",    // German voice
        "FR": "fr-FR-DeniseNeural",   // French voice
        "ES": "es-ES-ElviraNeural",   // Spanish voice
        "ITA": "it-IT-ElsaNeural",    // Italian voice
        "PT": "pt-PT-FernandaNeural", // Portuguese voice
        "RU": "ru-RU-SvetlanaNeural", // Russian voice
        "JA": "ja-JP-NanamiNeural",   // Japanese voice
        "ZH": "zh-CN-XiaoxiaoNeural"  // Chinese voice
    },
    charsPerSecond: 2.5,                // Estimate of TTS characters per second for timing
    ttsRate: "+0%",                   // Speech rate adjustment for TTS
    apiUrl: "http://localhost:1234/v1/chat/completions", // Local LLM endpoint
    modelName: "",                    // Using current LM Studio model by default (tested on gemma-3-4b-it-qat)
    debug: false                       // Debug mode flag (verbose logging)
};

// === USER PREFERENCE ===
var userPreferredLanguage = null;      // Override auto-detected language if set by user

var currentTimeout = null;            // Reference to scheduled announcement timeout
var timeAnnouncedHour = null;         // Track last announced hour to avoid repeats

// === POLISH TIME WORDING ARRAYS ===
// Hour names in Polish (0-23)
var godziny = ["zero","pierwsza","druga","trzecia","czwarta","piąta","szósta","sódma","ósma","dziewiąta","dziesiąta","jedenasta","dwunasta","trzynasta","czternasta","piętnaasta","szesnasta","siedemnasta","osiemnasta","dziewiętnasta","dwudziesta","dwudziesta pierwsza","dwudziesta druga","dwudziesta trzecia"];
// Minute names in Polish (0-59)
var minuty = [
    "zero","jedna","dwie","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć","dziesięć",
    "jedenaście","dwanaście","trzynaście","czternaście","piętnaście","szesnaście","siedemnasta","osiemnaście","dziewiętnaście","dwadzieścia",
    "dwadzieścia jeden","dwadzieścia dwa","dwadzieścia trzy","dwadzieścia cztery","dwadzieścia pięć","dwadzieścia sześć","dwadzieścia siedem","dwadzieścia osiem","dwadzieścia dziewięć",
    "trzydzieści","trzydzieści jeden","trzydzieści dwa","trzydzieści trzy","trzydzieści cztery","trzydzieści pięć","trzydzieści sześć","trzydzieści siedem","trzydzieści osiem","trzydzieści dziewięć",
    "czterdzieści","czterdzieści jeden","czterdzieści dwa","czterdzieści trzy","czterdzieści cztery","czterdzieści pięć","czterdzieści sześć","czterdzieści siedem","czterdzieści osiem","czterdzieści dziewięć",
    "pięćdziesiąt","pięćdziesiąt jeden","pięćdziesiąt dwa","pięćdziesiąt trzy","pięćdziesiąt cztery","pięćdziesiąt pięć","pięćdziesiąt sześć","pięćdziesiąt siedem","pięćdziesiąt osiem","pięćdziesiąt dziewięć"
];

// === UTILITIES ===
/**
 * Logs debug messages via popup if debug mode is enabled
 * @param {string} msg - Message to display
 */
function debugLog(msg) {
    if (config.debug) {
        // Show a transient popup with debug info
        WshShell.Popup("DEBUG: " + msg, 1, "Debug", 0);
    }
}

/**
 * Escape double quotes for safe CLI invocation
 * @param {string} t - Input text
 * @returns {string}
 */
function escapeQuotes(t) { return t.replace(/"/g, '\\"'); }

/**
 * Remove language tags like [PL], [ENG] from filename string
 * @param {string} t - Raw title string
 * @returns {string}
 */
function stripTags(t) { return t.replace(/\[(?:PL|ENG|PL-ENG|[A-Z]{2,4})\]/gi, "").trim(); }

debugLog("Utilities initialized");

/**
 * Determine language from filename tags
 * @param {string} fn - Filename
 * @returns {string} Language code
 */
function detectLang(fn) {
    debugLog("Detecting language for: " + fn);
    var l = fn.toLowerCase();
    if (l.indexOf("[pl-eng]") !== -1) return "PL-ENG";
    if (l.indexOf("[eng]") !== -1) return "ENG";
    if (l.indexOf("[pl]") !== -1) return "PL";
    if (l.indexOf("[de]") !== -1) return "DE";
    if (l.indexOf("[fr]") !== -1) return "FR";
    if (l.indexOf("[es]") !== -1) return "ES";
    if (l.indexOf("[it]") !== -1) return "ITA";
    if (l.indexOf("[pt]") !== -1) return "PT";
    if (l.indexOf("[ru]") !== -1) return "RU";
    if (l.indexOf("[ja]") !== -1) return "JA";
    if (l.indexOf("[zh]") !== -1) return "ZH";
    return "ENG"; // Default to English
}

debugLog("Language detection ready");

/**
 * Get spoken Polish time phrase
 * @param {number} h - Hour
 * @param {number} m - Minute
 * @returns {string}
 */
function getPolishTime(h, m) {
    var phrase = "Jest godzina " + godziny[h] + " " + minuty[m];
    debugLog("Polish time phrase: " + phrase);
    return phrase;
}

/**
 * Get spoken English time phrase
 * @param {number} h - Hour
 * @param {number} m - Minute
 * @returns {string}
 */
function getEnglishTime(h, m) {
    var ms = m < 10 ? "0" + m : m;
    var phrase = "It is now " + h + ":" + ms;
    debugLog("English time phrase: " + phrase);
    return phrase;
}

/**
 * Generic fallback for time (currently English)
 */
function getGenericTime(h, m) {
    return getEnglishTime(h, m);
}

debugLog("Time formatting functions loaded");

/**
 * Speak a given text via TTS CLI
 * @param {string} txt - Text to speak
 * @param {string} lang - Language code for voice selection
 */
function speak(txt, lang) {
    txt = txt.replace(/[\r\n]+/g, ' ').trim();
    var v = config.voices[lang] || config.voices["ENG"];
    var cmd = "edge-playback --voice " + v + " --rate \"" + config.ttsRate + "\" --text \"" + escapeQuotes(txt) + "\"";
    debugLog("Running TTS command: " + cmd);
    WshShell.Run(cmd, 0, false);
}

debugLog("Speak utility ready");

/**
 * Fallback introduction if LLM fails or returns too short
 * @param {string} artist
 * @param {string} title
 * @param {string} lang
 * @param {number} h
 * @param {number} m
 * @param {boolean} includeTime
 */
function fallbackIntro(artist, title, lang, h, m, includeTime) {
    debugLog("Using fallback intro for " + artist + " - " + title);
    var introText = "";
    switch (lang === "PL-ENG" ? "ENG" : lang) {
        case "PL":
            introText = "Następny utwór to '" + title + "' w wykonaniu " + artist + "."; break;
        case "ENG":
            introText = "Up next: '" + title + "' by " + artist + "."; break;
        case "DE":
            introText = "Als nächstes hören wir '" + title + "' von " + artist + "."; break;
        case "FR":
            introText = "Ensuite, voici '" + title + "' par " + artist + "."; break;
        case "ES":
            introText = "A continuación, '" + title + "' de " + artist + "."; break;
        default:
            introText = "Up next track: '" + title + "' by " + artist + "."; break;
    }
    if (includeTime) {
        var timeText = (lang === "PL" ? getPolishTime(h, m) : getEnglishTime(h, m));
        speak(timeText, lang);
        var estimatedDuration = (timeText.length / config.charsPerSecond) * 300;
        debugLog("Waiting " + estimatedDuration + "ms before fallback intro");
        window.SetTimeout(function () { speak(introText, lang); }, estimatedDuration + 500);
    } else {
        speak(introText, lang);
    }
}

debugLog("Fallback intro configured");

/**
 * Request dynamic intro from LLM, fallback on error or too-short
 */
function getIntroFromLLM(artist, title, h, m, lang, includeTime, cb) {
    debugLog("Requesting LLM intro for " + artist + " - " + title + ", includeTime=" + includeTime);
    var timeTxt = (lang === "ENG" ? getEnglishTime(h, m) : getPolishTime(h, m));
    var userPrompt = (lang === "ENG"
        ? "You are a wildly creative radio DJ for an underground station.\n" +
          (includeTime
            ? timeTxt + ". Time must be naturally included in the announcement."
            : "Use the time only as atmospheric context – DO NOT mention it directly.") +
          "\nCreate a short, one or two-sentence introduction for the track \"" + title + "\" by " + artist + "." +
          " Be vivid, unpredictable, and entertaining. Avoid repetition or generic phrases like 'get ready'. Max 35 words." +
          " Start directly with the announcement text itself. Do NOT include any meta-text like 'Okay, here’s your intro,' 'This is your announcement,' or similar." +
          " Your response will be read *directly* and *verbatim* by a text-to-speech system as a radio announcement." +
          " Do NOT include any stage directions, voice tone instructions, or anything in parentheses like (in calm voice), (*shouting*), or similar. Your text must sound natural when spoken out loud."
        : "Jesteś szalonym, twórczym DJ-em radiowym.\n" +
          (includeTime
            ? timeTxt + ". Czas musi być ładnie dołączony do twojej odpowiedzi jako część zapowiedzi utworu.."
            : "Użyj godziny tylko jako tła – NIE wspominaj jej wprost.") +
          "\nStwórz krótką, jedno- lub dwuzdaniową zapowiedź utworu \"" + title + "\" w wykonaniu " + artist + "." +
          " Bądź obrazowy, zaskakujący i zabawny. Unikaj powtórzeń i banałów. Maksymalnie 35 słów." +
          " Zaczynaj bezpośrednio od tekstu zapowiedzi. NIE dodawaj meta-tekstu, np. 'Oto zapowiedź,' 'To jest Twoja zapowiedź,' lub podobnych." +
          " Twoja odpowiedź zostanie przeczytana *bezpośrednio* przez syntezator mowy (TTS) jako zapowiedź radiowa." +
          " NIE wolno dodawać żadnych wskazówek w nawiasach, np. (spokojnym głosem), (*krzyk*), (ciszej). Treść musi naturalnie brzmieć wypowiedziana na głos.");
    
    var body = {
        messages: [
            { role: "system", content: lang === "ENG" ? "You are a radio DJ." : "Jesteś DJ-em radiowym." },
            { role: "user", content: userPrompt }
        ],
        temperature: 1
    };
    if (config.modelName) body.model = config.modelName;  // include custom model if specified

    try {
        var xhr = new ActiveXObject("MSXML2.XMLHTTP");
        xhr.open("POST", config.apiUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        if (config.debug) debugLog("LLM prompt: " + userPrompt);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                debugLog("LLM responded with status " + xhr.status);
                if (xhr.status === 200) {
                    try {
                        var res = JSON.parse(xhr.responseText);
                        var msg = res.choices[0].message.content.trim();
                        // strip any stray brackets or stage directions
                        msg = msg.replace(/^\s*\([^)]*\)\s*/g, "").replace(/\([^)]*\)/g, "").replace(/\[[^\]]+\]/g, "").replace(/\*[^*]+\*/g, "");
                        var wordCount = msg.split(/\s+/).filter(Boolean).length;
                        debugLog("LLM reply: " + msg + " (" + wordCount + " words)");
                        if (!msg || wordCount < 10) {
                            fallbackIntro(artist, title, lang, h, m, includeTime);
                        } else {
                            cb(msg, lang);
                        }
                    } catch (e) {
                        debugLog("Error parsing LLM response: " + e.message);
                        fallbackIntro(artist, title, lang, h, m, includeTime);
                    }
                } else {
                    fallbackIntro(artist, title, lang, h, m, includeTime);
                }
            }
        };
        xhr.send(JSON.stringify(body));
    } catch (e) {
        debugLog("Exception calling LLM: " + e.message);
        fallbackIntro(artist, title, lang, h, m, includeTime);
    }
}

debugLog("LLM intro function ready");

/**
 * Handle new track playback event
 */
function on_playback_new_track() {
    debugLog("New track event triggered");
    if (currentTimeout) {
        debugLog("Clearing existing timeout");
        window.ClearTimeout(currentTimeout);
        currentTimeout = null;
    }

    var raw = fb.TitleFormat("%filename%").Eval();  // get raw filename
    debugLog("Raw filename: " + raw);
    var clean = stripTags(raw);                     // remove any tags
    debugLog("Clean title: " + clean);
    var parts = clean.split(/\s*-\s*/);           // split artist-title
    var artist = parts[0], title = parts.length > 1 ? parts.slice(1).join(" - ") : clean;
    debugLog("Parsed artist: " + artist + ", title: " + title);
    var lang = userPreferredLanguage || detectLang(raw);
    debugLog("Using language: " + lang);

    var now = new Date(), h = now.getHours(), m = now.getMinutes();
    debugLog("Current time: " + h + ":" + m);
    var shouldAnnounceTime = (timeAnnouncedHour !== h);
    if (shouldAnnounceTime) {
        debugLog("Hour changed since last announcement, will include time");
        timeAnnouncedHour = h;
    }

    // schedule immediate call to generate and speak intro
    currentTimeout = window.SetTimeout(function () {
        getIntroFromLLM(artist, title, h, m, lang, shouldAnnounceTime, function (txt, lg) {
            debugLog("Speaking generated intro");
            speak(txt, lg);
        });
        currentTimeout = null;
    }, 0);
}

debugLog("Attaching playback event listener");

// If playback is already active when script loads, trigger intro immediately
if (fb.IsPlaying) {
    debugLog("Playback already in progress, announcing initial track");
    on_playback_new_track();
} else {
    debugLog("No playback on load");
}
