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

// Create a WScript Shell object for executing external commands
var WshShell = new ActiveXObject("WScript.Shell");

// === CONFIGURATION ===
var config = {
    // Mapping of language codes to arrays of Azure Neural voices
    voices: {
        "PL": ["pl-PL-ZofiaNeural", "pl-PL-MarekNeural"],          // Polish voices
        "ENG": ["en-US-JennyNeural", "en-US-GuyNeural"],          // English voices
        "PL-ENG": ["pl-PL-ZofiaNeural", "pl-PL-MarekNeural"],     // Polish-English bilingual voices
        "DE": ["de-DE-KatjaNeural", "de-DE-ConradNeural"],        // German voices
        "FR": ["fr-FR-DeniseNeural", "fr-FR-HenriNeural"],        // French voices
        "ES": ["es-ES-ElviraNeural", "es-ES-AlvaroNeural"],       // Spanish voices
        "IT": ["it-IT-ElsaNeural", "it-IT-DiegoNeural"],          // Italian voices
        "PT": ["pt-PT-FernandaNeural", "pt-PT-DuarteNeural"],     // Portuguese voices
        "RU": ["ru-RU-SvetlanaNeural", "ru-RU-DmitryNeural"],     // Russian voices
        "JA": ["ja-JP-NanamiNeural", "ja-JP-KeitaNeural"],        // Japanese voices
        "ZH": ["zh-CN-XiaoxiaoNeural", "zh-CN-YunyangNeural"]     // Chinese voices
    },
    charsPerSecond: 2.5,                // Estimate of TTS characters per second for timing
    ttsRate: "+0%",                   // Speech rate adjustment for TTS
    apiUrl: "http://localhost:1234/v1/chat/completions", // Local LLM endpoint
    modelName: "",                    // Using current LM Studio model by default, tested with gemma-3-4b-it-qat
    debug: true                       // Debug mode enabled for file logging
};

// === USER PREFERENCE ===
var userPreferredLanguage = null;      // Override auto-detected language if set by user

var currentTimeout = null;            // Reference to scheduled announcement timeout
var timeAnnouncedHour = null;         // Track last announced hour to avoid repeats

// === POLISH TIME WORDING ARRAYS ===
// Hour names in Polish (0-23)
var godziny = ["zero","pierwsza","druga","trzecia","czwarta","piąta","szósta","sódma","ósma","dziewiąta","dziesiąta","jedenasta","dwunasta","trzynasta","czternasta","piętnasta","szesnasta","siedemnasta","osiemnasta","dziewiętnasta","dwudziesta","dwudziesta pierwsza","dwudziesta druga","dwudziesta trzecia"];
// Minute names in Polish (0-59)
var minuty = [
    "zero","jedna","dwie","trzy","cztery","pięć","sześć","siedem","osiem","dziewięć","dziesięć",
    "jedenaście","dwanaście","trzynaście","czternaście","piętnasta","szesnaście","siedemnasta","osiemnasta","dziewiętnasta","dwadzieścia",
    "dwadzieścia jeden","dwadzieścia dwa","dwadzieścia trzy","dwadzieścia cztery","dwadzieścia pięć","dwadzieścia sześć","dwadzieścia siedem","dwadzieścia osiem","dwadzieścia dziewięć",
    "trzydzieści","trzydzieści jeden","trzydzieści dwa","trzydzieści trzy","trzydzieści cztery","trzydzieści pięć","trzydzieści sześć","trzydzieści siedem","trzydzieści osiem","trzydzieści dziewięć",
    "czterdzieści","czterdzieści jeden","czterdzieści dwa","czterdzieści trzy","czterdzieści cztery","czterdzieści pięć","czterdzieści sześć","czterdzieści siedem","czterdzieści dziewięć",
    "pięćdziesiąt","pięćdziesiąt jeden","pięćdziesiąt dwa","pięćdziesiąt trzy","pięćdziesiąt cztery","pięćdziesiąt pięć","pięćdziesiąt sześć","pięćdziesiąt siedem","pięćdziesiąt osiem","pięćdziesiąt dziewięć"
];

// === UTILITIES ===
/**
 * Logs debug messages to a file if debug mode is enabled
 * @param {string} msg - Message to log
 */
function debugLog(msg) {
    if (config.debug) {
        try {
            // Create a timestamp for the log entry
            var now = new Date();
            var timestamp = now.toISOString().replace("T", " ").replace("Z", "");
            var logMessage = "[" + timestamp + "] DEBUG: " + msg;

            // Use WScript.Shell to append to a file via command line
            var logFilePath = "%USERPROFILE%\\foobar2000_debug.log"; // Expands to C:\Users\YourUsername\foobar2000_debug.log
            var cmd = "cmd.exe /C echo " + escapeQuotes(logMessage) + ">>" + logFilePath;
            WshShell.Run(cmd, 0, true); // Run command, wait for completion
        } catch (e) {
            // Silently fail to avoid script interruption
        }
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
 * Randomly select a voice from the available voices for a given language
 * @param {string} lang - Language code
 * @returns {string} Selected voice
 */
function getRandomVoice(lang) {
    var voiceList = config.voices[lang] || config.voices["ENG"];
    var randomIndex = Math.floor(Math.random() * voiceList.length);
    var selectedVoice = voiceList[randomIndex];
    debugLog("Selected voice for " + lang + ": " + selectedVoice);
    return selectedVoice;
}

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
    if (l.indexOf("[it]") !== -1) return "IT";
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
 * Pause playback, speak text via TTS CLI, and resume playback after estimated duration
 * @param {string} txt - Text to speak
 * @param {string} lang - Language code for voice selection
 */
function pauseAndSpeak(txt, lang) {
    txt = txt.replace(/[\r\n]+/g, ' ').trim();
    var v = getRandomVoice(lang); // Randomly select a voice
    var cmd = "edge-playback --voice " + v + " --rate \"" + config.ttsRate + "\" --text \"" + escapeQuotes(txt) + "\"";
    debugLog("Pausing playback and running TTS command: " + cmd);
    
    // Pause playback if playing
    if (fb.IsPlaying && !fb.IsPaused) {
        fb.Pause();
    }
    
    // Execute TTS command
    WshShell.Run(cmd, 0, false);
    
    // Estimate duration (milliseconds) based on characters per second
    var estimatedDuration = (txt.length / config.charsPerSecond) * 300;
    debugLog("Estimated TTS duration: " + estimatedDuration + "ms");
    
    // Schedule playback resumption
    window.SetTimeout(function () {
        if (fb.IsPaused) {
            fb.Play();
            debugLog("Playback resumed");
        }
    }, estimatedDuration + 500); // Add 500ms buffer to ensure TTS completes
}

/**
 * Speak a given text via TTS CLI, pausing and resuming playback
 * @param {string} txt - Text to speak
 * @param {string} lang - Language code for voice selection
 */
function speak(txt, lang) {
    pauseAndSpeak(txt, lang);
}

debugLog("Speak utility with pause/resume ready");

/**
 * Fallback introduction if LLM fails or returns invalid output
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
    if (includeTime) {
        var timeText = (lang === "PL" ? getPolishTime(h, m) : getEnglishTime(h, m));
        introText = (lang === "PL"
            ? timeText + " Czas na '" + title + "' w wykonaniu " + artist + "."
            : timeText + " Time for '" + title + "' by " + artist + ".");
        pauseAndSpeak(introText, lang);
    } else {
        introText = (lang === "PL"
            ? "Następny utwór to '" + title + "' w wykonaniu " + artist + "."
            : "Up next: '" + title + "' by " + artist + ".");
        pauseAndSpeak(introText, lang);
    }
}

debugLog("Fallback intro configured");

/**
 * Request dynamic intro from LLM, fallback on error or invalid output
 */
function getIntroFromLLM(artist, title, h, m, lang, includeTime, cb) {
    var timeTxt = (lang === "ENG" ? getEnglishTime(h, m) : getPolishTime(h, m));
    var userPrompt = (lang === "ENG"
        ? "You are a lively radio DJ on Radio.\n" +
          "Create a vivid 1–2 sentence intro (10–20 words) for the song \"" + title + "\" by " + artist + ".\n" +
          "Start with the spoken announcement. Include artist (" + artist + ") and title (\"" + title + "\") explicitly.\n" +
          (includeTime
            ? "It is " + timeTxt + ". Include the time concisely in the announcement (e.g., 'it’s 13:24').\n"
            : "Do NOT mention the time; use it as background context only.\n") +
          "Use a fun, dramatic, warm, or mysterious tone.\n" +
          "Output ONLY spoken text, 10–20 words, no sound effects, stage directions, parentheses, or meta-text.\n" +
          "Example: 'Hey crew, it’s 13:24! Hans Zimmer’s Time fuels our Borderlands chaos!'"
        : "Jesteś energicznym DJ-em Radio.\n" +
          "Stwórz żywą zapowiedź (10–20 słów, 1–2 zdania) dla utworu \"" + title + "\" w wykonaniu " + artist + ".\n" +
          "Zacznij od tekstu zapowiedzi. Włącz artystę (" + artist + ") i tytuł (\"" + title + "\") wyraźnie.\n" +
          (includeTime
            ? "Jest " + timeTxt + ". Włącz czas zwięźle w zapowiedź (np. 'jest trzynasta dwadzieścia cztery').\n"
            : "NIE wspominaj czasu; użyj go tylko jako tła.\n") +
          "Użyj tonu zabawnego, dramatycznego, ciepłego lub tajemniczego.\n" +
          "Wypisz TYLKO tekst do wypowiedzenia, 10–20 słów, bez efektów dźwiękowych, nawiasów czy meta-tekstu.\n" +
          "Przykład: 'Jest trzynasta dwadzieścia cztery! Time Hansa Zimmera napędza Borderlands!'");
    
    var body = {
        messages: [
            { role: "system", content: lang === "ENG" ? "You are a radio DJ." : "Jesteś DJ-em radiowym." },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.0
    };
    if (config.modelName) body.model = config.modelName;

    try {
        var xhr = new ActiveXObject("MSXML2.XMLHTTP");
        xhr.open("POST", config.apiUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        debugLog("LLM prompt: " + userPrompt);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                debugLog("LLM responded with status " + xhr.status);
                if (xhr.status === 200) {
                    try {
                        var res = JSON.parse(xhr.responseText);
                        var msg = res.choices[0].message.content.trim();
                        var wordCount = msg.split(/\s+/).filter(Boolean).length;
                        debugLog("LLM reply: " + msg + " (" + wordCount + " words)");
                        if (!msg) {
                            debugLog("LLM validation failed: Empty response");
                            fallbackIntro(artist, title, lang, h, m, includeTime);
                        } else if (wordCount < 8 || wordCount > 22) {
                            debugLog("LLM validation failed: Invalid word count (" + wordCount + ")");
                            fallbackIntro(artist, title, lang, h, m, includeTime);
                        } else {
                            cb(msg, lang);
                        }
                    } catch (e) {
                        debugLog("Error parsing LLM response: " + e.message);
                        fallbackIntro(artist, title, lang, h, m, includeTime);
                    }
                } else {
                    debugLog("LLM request failed with status " + xhr.status);
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

    // Schedule immediate call to generate and speak intro
    currentTimeout = window.SetTimeout(function () {
        getIntroFromLLM(artist, title, h, m, lang, shouldAnnounceTime, function (txt, lg) {
            debugLog("Speaking generated intro: " + txt);
            pauseAndSpeak(txt, lg);
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
