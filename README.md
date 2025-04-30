POLSKA WERSJA -> https://github.com/Meloon33/MusicFlow/blob/main/README.pl.md
# MusicFlow

## Project Overview

**MusicFlow** is an innovative tool designed to simplify the management of extensive music libraries while enhancing the playback experience. It offers two primary features:

- **Automated MP3 File Renaming**: Leverages AI-powered language detection via LM Studio to standardize MP3 filenames into a consistent format with language tags (e.g., `Artist - Title - [ENG].mp3`).
- **Text-to-Speech (TTS) Announcements**: Integrates with foobar2000 to deliver radio-style track introductions and hourly time announcements using Microsoft Edge TTS voices, perfect for immersive playlists and sharing music on Discord.

Ideal for music enthusiasts, DJs, or anyone seeking to organize their music collection and add a professional flair to playback, MusicFlow enhances group listening experiences.

**Demo Video**: See MusicFlow in action with radio-style track introductions in foobar2000:  
[![Watch the Demo Video](https://i3.ytimg.com/vi/INU63GQoYA8/maxresdefault.jpg)](https://youtu.be/INU63GQoYA8)

*Note*: The demo showcases LM Studio for AI-generated announcements, but generic TTS is supported if LM Studio is unavailable.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [foobar2000 Setup](#foobar2000-setup)
  - [LM Studio Setup](#lm-studio-setup)
  - [Python Dependencies](#python-dependencies)
- [Usage](#usage)
  - [Renaming Music Files](#renaming-music-files)
  - [TTS Announcements](#tts-announcements)
  - [JScript Panel in foobar2000](#jscript-panel-in-foobar2000)
- [File Structure](#file-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Discord Audio Sharing Workaround](#discord-audio-sharing-workaround)
- [License](#license)
- [Contributing](#contributing)
- [Project Background](#project-background)

---

## Overview

MusicFlow streamlines music library management and playback automation through two core functionalities:

### 1. Music File Renaming
- Processes MP3 files in a specified directory, using **LM Studio**'s AI model to detect languages and standardize filenames.
- Adds language tags (e.g., `[ENG]`, `[PL]`, `[ES]`) based on AI detection or user-specified preferences.

### 2. Text-to-Speech Announcements
- Employs a JScript Panel script (`tts.js`) in foobar2000 to generate spoken track introductions and hourly time updates via Microsoft Edge TTS voices.
- Supports multiple languages with configurable voices (e.g., `en-US-JennyNeural`, `pl-PL-ZofiaNeural`).

### 3. foobar2000 Integration
- Seamlessly integrates with **foobar2000 32-bit** using the **JScript Panel** for automation tasks like file renaming and TTS playback.

---

## Features
- **AI-Driven File Renaming**: Cleans and standardizes MP3 filenames using LM Studio’s language model.
- **Multilingual TTS**: Delivers track and time announcements in various languages with high-quality neural voices.
- **Customizable Announcements**: Allows voice, delay, and language adjustments in `tts.js`.
- **Discord Compatibility**: Provides a workaround to share music and announcements on Discord via a virtual machine.
- **Efficient Processing**: Tracks processed files to prevent redundant renaming and supports batch API calls for speed.

---

## Requirements

Ensure the following are installed:

- **Python 3.6+** with **pip**
- **LM Studio**: For AI language detection ([Download](https://lmstudio.ai/))
- **foobar2000 32-bit**: For playback and automation ([Download](https://www.foobar2000.org/download))
- **JScript Panel**: foobar2000 plugin for scripting ([Download](https://github.com/kbuffington/foo_jscript_panel/releases))
- **Microsoft Edge**: Required for TTS via `edge-playback`

### Python Dependencies
- `requests==2.28.1`
- `pydub==0.25.1`
- `langdetect==1.0.9`

Dependencies are listed in `requirements.txt` and can be installed automatically.

---

## Installation

### foobar2000 Setup
1. **Install foobar2000 (32-bit)**:
   - Download from [foobar2000.org](https://www.foobar2000.org/download).
   - Install the 32-bit version on Windows.
2. **Install JScript Panel**:
   - Download from [GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
   - Extract to the foobar2000 installation directory and follow the plugin’s installation guide.
3. **Configure JScript Panel**:
   - In foobar2000, go to **View** → **Layout** → **Enable Layouts**.
   - Add a **JScript Panel** to the layout.
   - Load `tts.js` for TTS announcements or custom scripts for automation.

### LM Studio Setup
1. **Install LM Studio**:
   - Download from [lmstudio.ai](https://lmstudio.ai/) and install on Windows.
2. **Load the AI Model**:
   - Open LM Studio and load the **Llama-3.2-3B** model (or download from the model library).
3. **Start the API Server**:
   - Enable the local API server (default: `http://localhost:1234/v1/chat/completions`).

### Python Dependencies
1. **Automated Setup (Windows)**:
   - Run `install_dependencies.bat` to:
     - Create a virtual environment (`env`).
     - Install dependencies from `requirements.txt`.
2. **Manual Setup**:
   - Activate the virtual environment:
     ```bash
     .\env\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```

---

## Usage

### Renaming Music Files
The `renaming_script.py` script standardizes MP3 filenames using LM Studio’s AI, adding language tags (e.g., `song.mp3` → `Artist - Title - [ENG].mp3`).

#### Steps:
1. **Start LM Studio**:
   - Ensure the API server is running at `http://localhost:1234/v1/chat/completions`.
2. **Run the Script**:
   - Execute:
     ```bash
     python renaming_script.py
     ```
   - Select a language tag (e.g., `ENG`, `PL`) or `detect` for AI-based detection.
3. **Script Behavior**:
   - Processes all `.mp3` files in the current directory.
   - Cleans filenames and appends language tags.
   - Skips processed files (tracked in `processed_files.json`).
4. **Example**:
   - Input: `SuperBand - EpicSong [Official Video].mp3`
   - Output: `SuperBand - EpicSong - [ENG].mp3`

### TTS Announcements
The `tts.js` script in foobar2000’s JScript Panel announces track names and hourly times using Microsoft Edge TTS voices.

#### Steps:
1. **Load the Script**:
   - Add a JScript Panel in foobar2000 and load `tts.js`.
   - Announcements trigger on track changes or player startup.
2. **Functionality**:
   - **Track Announcements**: Extracts and announces track names (excluding tags like `[ENG]`) in the appropriate language.
   - **Time Announcements**: Announces the time (e.g., “It’s now 3:45 PM”) hourly, limited to once per hour.
   - **Voice Configuration**: Supports voices like `en-US-JennyNeural` and `pl-PL-ZofiaNeural`, customizable in `tts.js`.
3. **Customization**:
   - Edit `tts.js` to adjust voice mappings, delays (`minDelaySeconds`, `maxDelaySeconds`), or TTS rate (`ttsRate`).

### JScript Panel in foobar2000
The JScript Panel enables automation tasks in foobar2000.

#### Steps:
1. **Install JScript Panel** (see Installation).
2. **Load a Script**:
   - Add a JScript Panel and load `tts.js` or a custom script.
3. **Automation Tasks**:
   - Use `tts.js` for track and time announcements.
   - Create custom scripts for playlist or metadata management.

---

## File Structure
```
music-rename-tts/
├── renaming_script.py       # Python script for MP3 file renaming
├── tts.js                   # JScript for TTS announcements
├── install_dependencies.bat # Batch file for dependency installation (Windows)
├── requirements.txt         # Python dependency list
├── processed_files.json     # Tracks processed files
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## Testing

### Test File Renaming
1. Place a sample MP3 (e.g., `test_song.mp3`) in the project directory.
2. Ensure LM Studio is running with the Llama-3.2-3B model.
3. Run `python renaming_script.py` and select `detect` or a language tag.
4. Verify the file is renamed (e.g., `test_song - [ENG].mp3`) and logged in `processed_files.json`.

### Test TTS Announcements
1. In foobar2000, load `tts.js` in a JScript Panel.
2. Play a track with a language tag (e.g., `song - [ENG].mp3`).
3. Confirm the track name is announced in the correct voice.
4. At the start of an hour, verify the time announcement.

### Test foobar2000 Integration
- Ensure the JScript Panel loads `tts.js` and interacts with renamed files.

---

## Troubleshooting

- **LM Studio API Error**:
  - Verify the API server is active at `http://localhost:1234/v1/chat/completions` and the Llama-3.2-3B model is loaded.
- **“pip not found”**:
  - Confirm Python and pip are in PATH (`python --version`, `pip --version`).
- **Language Detection Failure**:
  - Ensure sufficient metadata or specify a language tag.
- **TTS Announcements Not Playing**:
  - Verify Microsoft Edge is installed and `edge-playback` is accessible.
  - Confirm `tts.js` is loaded correctly.
- **JScript Panel Not Loading**:
  - Use foobar2000 32-bit and verify JScript Panel installation.
- **Dependency Issues**:
  - Run `pip install -r requirements.txt` manually in the virtual environment.

---

## Discord Audio Sharing Workaround

### Issue
MusicFlow outputs music via foobar2000 and TTS announcements via Windows system audio (`edge-playback`). Discord’s single-window audio sharing cannot capture both sources.

### Solution
Run MusicFlow in a **VirtualBox** VM with **Tiny10** (lightweight Windows 10) to consolidate audio into one window for Discord sharing.

#### Steps
1. **Install VirtualBox**:
   - Download from [virtualbox.org](https://www.virtualbox.org/wiki/Downloads).
2. **Download Tiny10**:
   - Obtain the Tiny10 ISO from a trusted source (e.g., [Archive.org](https://archive.org/details/tiny-10-21h-2-x-64)).
   - *Note*: Verify the source and review licensing.
3. **Set Up the VM**:
   - Create a VM (Windows 10, 64-bit, 2GB RAM, 20GB storage).
   - Mount the Tiny10 ISO and install Windows.
4. **Install MusicFlow**:
   - Follow **Installation** steps for Python, LM Studio, foobar2000, and project files.
   - Load `tts.js` in foobar2000.
5. **Share on Discord**:
   - On the host machine, share the VirtualBox VM window in Discord with audio enabled.
   - Play music in foobar2000; both music and announcements will be shared.

#### Benefits
- Consolidates audio for Discord sharing.
- Tiny10 minimizes VM resource usage.

#### Notes
- Ensure sufficient host resources for VM performance.
- Adjust VirtualBox audio settings if needed.

---

## License
Licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contributing
Contributions are welcome! Open an issue or submit a pull request for enhancements or fixes.

---

## Project Background

MusicFlow was developed to create an immersive music experience during Discord gaming sessions, managing a playlist of nearly 4,000 diverse tracks—mixes, remixes, original songs, AI covers, and YouTube tracks in multiple languages. Inconsistent filenames (e.g., containing `[Official Video]`) and unreliable TTS announcements posed challenges, inspiring this project.

### Development Journey
- **Initial Challenges**: Inconsistent filenames disrupted playback and TTS. Early attempts with AIMP failed due to limited scripting support, causing random TTS triggers. Language detection based on Polish characters (e.g., ą, ę) or word lists was unreliable.
- **Switch to foobar2000**: Transitioned to foobar2000 32-bit for better JScript Panel support after the 64-bit version proved inadequate. The JScript Panel became central to automation.
- **File Renaming Solution**: Developed `renaming_script.py` using LM Studio’s Llama-3.2-3B model to standardize filenames (e.g., `ACDC - You Shook Me All Night Long - [ENG]`). Tested models like Qwen, Deepseek, Gemma, and Mistral, but Llama-3.2-3B achieved ~90% accuracy. Optimized with batch API calls (5–10 files) and iterative prompt refinement to handle ambiguous names.
- **TTS Implementation**: Wrote `tts.js` for foobar2000 to announce tracks and times using Microsoft Edge TTS voices. Initial SAPI use was abandoned due to low-quality voices. Temporary `.mp3` files disrupted playlists, leading to `edge-playback` for superior quality. Adjusted timing to prevent overlapping announcements (e.g., hourly time at 10 PM in Polish).
- **Model Selection for Announcements**: A key challenge was finding a small, low-resource AI model to generate concise track announcements in Polish and English. Popular non-reasoning models, including BERT, DistilBERT, and T5-small, were tested but produced inconsistent or verbose outputs. After extensive testing, `gemma-3-4b-it-qat` proved optimal, balancing quality, speed, and resource efficiency for bilingual announcements.
- **Discord Integration**: `edge-playback` caused audio-sharing issues on Discord. A VirtualBox VM with Tiny10 consolidated audio, enabling seamless sharing.
- **Additional Refinements**: Enhanced regex patterns and error handling in `renaming_script.py` to preserve metadata (e.g., album, year) and handle file locks. Tuned TTS to skip tags (e.g., `[ENG]`) and add natural pauses.

### Technical Highlights
- **AI Integration**: Leveraged LM Studio and `gemma-3-4b-it-qat` for language detection and announcement generation.
- **Scripting**: Combined Python and JScript for robust automation.
- **Problem-Solving**: Overcame Discord audio limitations with a VM-based workaround.
- **Optimization**: Improved performance with batch processing and processed file tracking.

### Future Plans
- **Enhanced TTS**: Integrate AI-generated track introductions with trivia, album details, or release years.
- **Improved AI Accuracy**: Refine the LLM to surpass 90% accuracy for filename standardization.
- **Local AI Voice Model**: Implement a local AI voice model for higher-quality, customizable TTS announcements.
- **Expanded Features**: Support additional file formats and advanced playlist automation.

MusicFlow showcases expertise in Python scripting, AI integration, audio automation, and creative problem-solving, delivering a practical, user-focused solution for music enthusiasts and technical users.
