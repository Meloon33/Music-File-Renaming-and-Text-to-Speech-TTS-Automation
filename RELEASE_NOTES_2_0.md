# Release Notes: MusicFlow AI v2.0

**Release Date**: April 30, 2025

## Overview

Version 2.0 of **MusicFlow AI** (previously **Music File Renaming and Text-to-Speech (TTS) Automation**) introduces powerful enhancements to the `tts.js` script, enabling dynamic, AI-generated, radio-style track introductions. This release integrates an optional local Large Language Model (LLM) for creative announcements, expands language support, improves time announcements in Polish and English, and adds robust debugging capabilities. The `renaming_script.py` remains unchanged, continuing to provide reliable MP3 file renaming using LM Studio.

Renamed to **MusicFlow AI**, the project now better reflects its focus on seamless music playback with AI-driven announcements. It is designed for public sharing, with improved compatibility for **foobar2000 32-bit** and **JScript Panel 3**, making it ideal for music enthusiasts and developers automating music libraries and enhancing playback with immersive TTS announcements.

## New Features

- **Dynamic LLM-Generated Track Introductions**:
  - Integrates with an optional local LLM server (e.g., LM Studio) via an OpenAI-compatible API (`http://localhost:1234/v1/chat/completions`) to generate vivid, radio-style track introductions.
  - Sends artist, title, and time context to the LLM, producing creative announcements (max 35 words) in English or Polish, tailored to the track’s language.
  - Example: “Dive into the cosmic vibes of ‘Epic Song’ by SuperBand” instead of static “Artist - Title”.
  - Falls back to generic TTS announcements if LM Studio is not used or if the LLM fails or returns a response with fewer than 10 words.

- **Expanded Language Support**:
  - Added support for new languages: PL-ENG (bilingual Polish-English), ITA, PT, RU, JA, ZH, in addition to PL, ENG, DE, FR, ES.
  - Maps each language to Microsoft Edge TTS Azure Neural voices (e.g., `it-IT-ElsaNeural`, `ja-JP-NanamiNeural`).
  - Improved language detection with case-insensitive tag matching (e.g., `[JA]`, `[ZH]`) and support for bilingual tracks (`[PL-ENG]`).

- **User-Configurable Language Override**:
  - Introduced `userPreferredLanguage` in `tts.js` to allow users to override auto-detected language for announcements.

- **Debugging Mode**:
  - Added a `debug` flag in the `tts.js` config to enable verbose logging via transient popups (`WshShell.Popup`).
  - Logs include filename parsing, language detection, LLM prompts/responses, time formatting, and TTS commands, aiding troubleshooting.

## Project Name Change

- **Renamed to MusicFlow AI**: The project has been renamed from **Music File Renaming and Text-to-Speech (TTS) Automation** to **MusicFlow AI** to better reflect its focus on seamless music playback integration with AI-driven, radio-style announcements. The new name emphasizes the smooth flow of music and dynamic TTS features while remaining concise and memorable.

## Enhancements

- **Improved Time Announcements**:
  - Supports time announcements in Polish (e.g., “Jest godzina dwudziesta pierwsza trzydzieści”) and English (e.g., “It is now 21:00”), using language-specific phrasing.
  - Polish announcements use `godziny` and `minuty` arrays for natural wording.
  - Time is announced only when the hour changes, with dynamic integration into LLM-generated intros when appropriate.
  - Uses `charsPerSecond` for precise scheduling to prevent overlap between track and time announcements.

- **Robust Error Handling**:
  - Enhanced LLM request handling with fallbacks for network errors, invalid JSON, or timeouts, ensuring reliable operation.
  - Strips stray brackets, stage directions, or meta-text from LLM responses for clean TTS output.
  - Improved filename parsing to handle edge cases (e.g., missing artist-title separator).

- **Simplified Timing and Scheduling**:
  - Removed `minDelaySeconds` and `maxDelaySeconds`, relying on `charsPerSecond` for dynamic delay calculation.
  - Uses a single `currentTimeout` for all announcements, with immediate scheduling (`SetTimeout` with 0ms delay) for LLM requests to reduce latency.
  - Adds 500ms padding for fallback intros to ensure smooth playback.

- **Modular Code Structure**:
  - Organized `tts.js` into modular functions (`detectLang`, `speak`, `getIntroFromLLM`, etc.) for better maintainability.
  - Added detailed comments on dependencies and requirements for public sharing.

- **Documentation Updates**:
  - Revised `README.md` to reflect new features, including LLM integration, expanded language support, debugging instructions, and the name change to **MusicFlow AI**.
  - Clarified dependencies (e.g., JScript Panel 3, `edge-playback`, WSH) and configuration options.

## Bug Fixes

- Fixed potential overlap between track and time announcements by improving timing logic and using estimated durations.
- Resolved issues with language detection by making tag matching case-insensitive and supporting a broader range of tags.
- Addressed edge cases in filename parsing to prevent errors with malformed or tagless names.

## Known Issues

- LLM-generated introductions may occasionally produce inconsistent results depending on the model used (e.g., gemma-3-4b-it-qat).
- Discord audio sharing still requires a virtual machine workaround (Oracle VirtualBox with Tiny10) to capture both foobar2000 music and `edge-playback` TTS audio.
- Debug popups may briefly interrupt focus in foobar2000 when `debug` mode is enabled; disable `debug` for production use.

## Dependencies

- **New Dependencies**:
  - Optional local LLM server (e.g., LM Studio) for dynamic track introductions.
  - `MSXML2.XMLHTTP` for HTTP requests to the LLM API.
- **Existing Dependencies**:
  - foobar2000 32-bit
  - JScript Panel 3
  - Microsoft Edge with `edge-playback` CLI
  - Windows Script Host (WSH)
  - Python 3.6+ with `requests`, `pydub`, `langdetect` (for `renaming_script.py`)

## Upgrade Instructions

1. **Backup Existing Setup**:
   - Save your current `tts.js` and `processed_files.json` to avoid data loss.

2. **Update foobar2000**:
   - Ensure you’re using foobar2000 32-bit and JScript Panel 3 ([GitHub](https://github.com/marc2k3/foo_jscript_panel)).

3. **Replace `tts.js`**:
   - Copy the new `tts.js` to your foobar2000 JScript Panel configuration directory.
   - Load the script in a JScript Panel.

4. **Set Up LLM Server (Optional)**:
   - Install LM Studio ([LM Studio](https://lmstudio.ai/)) and load a compatible model (e.g., Llama-3.2-3B or gemma-3-4b-it-qat) for AI-generated introductions.
   - Start the API server at `http://localhost:1234/v1/chat/completions`.
   - If not using LM Studio, the script will fall back to generic TTS announcements.

5. **Configure `tts.js`**:
   - Update `apiUrl` or `modelName` in `tts.js` if using a non-default LLM setup.
   - Set `userPreferredLanguage` if desired.
   - Enable `debug` mode for initial testing.

6. **Test the Setup**:
   - Play a track in foobar2000 and verify dynamic track introductions and time announcements.
   - Check debug logs (if enabled) for any errors.
   - Ensure `renaming_script.py` continues to work with existing `processed_files.json`.

## Notes

- The `renaming_script.py` functionality remains unchanged, maintaining compatibility with existing renamed files and `processed_files.json`.
- For optimal LLM performance, use Llama-3.2-3B or test other models with the provided prompt structure.
- The virtual machine workaround (Tiny10 in VirtualBox) is still required for Discord audio sharing; refer to `README.md` for setup instructions.
- Planned features include pausing or lowering music volume during announcements and integrating a local TTS engine for improved audio quality.
- Contributions are welcome! Open issues or submit pull requests on the project repository.

## Acknowledgments

- Thanks to the LM Studio team for providing a robust local AI platform.
- Gratitude to the foobar2000 and JScript Panel communities for their continued support and component development.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Feedback**: Please report issues or share suggestions via the project repository. Enjoy your enhanced music experience with **MusicFlow AI**!