# Music File Renaming and Text-to-Speech (TTS) Automation

Streamline your music library management with this Python-based project! Automatically rename MP3 files using language detection powered by **LM Studio** and generate text-to-speech (TTS) announcements for tracks and time in **foobar2000 32-bit** via the **JScript Panel**. This tool is ideal for music enthusiasts and developers looking to automate music file organization and add audio announcements in foobar2000.

## Table of Contents
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
  - [foobar2000 Setup](#foobar2000-setup)
  - [LM Studio Setup](#lm-studio-setup)
  - [Install Python Dependencies](#install-python-dependencies)
- [Usage](#usage)
  - [Music File Renaming Script](#music-file-renaming-script)
  - [Text-to-Speech Announcements](#text-to-speech-announcements)
  - [Using JScript Panel in foobar2000](#using-jscript-panel-in-foobar2000)
- [File Structure](#file-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contributing](#contributing)

## Overview

This project provides two main functionalities:

### 1. **Music File Renaming**
   - Processes MP3 files in a specified directory, using **LM Studio**'s language model to detect the language (if detect is selected) and renames files with a structured format.
   - Adds language tags (e.g., [ENG], [PL], [ES]) to filenames based on detection or user-specified preferences.

### 2. **Text-to-Speech (TTS) Announcements**
   - Uses a JScript Panel script (tts.js) in foobar2000 to generate TTS announcements for track names and hourly time updates, leveraging Microsoft Edge TTS voices.
   - Supports multiple languages with configurable voices (e.g., en-US-JennyNeural, pl-PL-ZofiaNeural).

### 3. **foobar2000 Integration**
   - Integrates with **foobar2000 32-bit** using the **JScript Panel** for custom automation, such as renaming files and playing TTS announcements.

---

## Requirements

Before running the scripts, ensure the following are installed:

- **Python 3.6+**
- **pip** (Python package installer)
- **LM Studio**: Download from [LM Studio](https://lmstudio.ai/) for language detection in the renaming script.
- **foobar2000 32-bit**: Download from [foobar2000](https://www.foobar2000.org/download).
- **JScript Panel**: Download from [JScript Panel GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
- **Microsoft Edge**: Required for TTS announcements via edge-playback in tts.js.

### Python Dependencies
- requests==2.28.1
- pydub==0.25.1
- langdetect==1.0.9

These are listed in requirements.txt and can be installed automatically. Note: gTTS, pyaudio, and pyttsx3 are not required, as TTS is handled by tts.js in foobar2000.

---

## Installation

### 1. **foobar2000 Setup**

1. **Download and Install foobar2000 (32-bit)**:
   - Visit [foobar2000 download page](https://www.foobar2000.org/download).
   - Download the **32-bit** version and follow the installation instructions for Windows.

2. **Install the JScript Panel**:
   - Download from [JScript Panel GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
   - Extract the contents to your foobar2000 installation directory.
   - Follow the included installation instructions.

3. **Enable the JScript Panel**:
   - Open **foobar2000**, go to **View** → **Layout** → **Enable Layouts**.
   - Add a new **JScript Panel** in the layout configuration.
   - Load the tts.js script for TTS announcements or a custom JScript for other automation.

### 2. **LM Studio Setup**

The renaming script uses **LM Studio**'s language model for language detection and file renaming.

1. **Download and Install LM Studio**:
   - Visit [LM Studio](https://lmstudio.ai/) and download the latest version for Windows.
   - Follow the installation instructions provided.

2. **Load the Recommended Model**:
   - Open LM Studio and load the **Llama-3.2-3B** model (recommended for this project).
   - Alternatively, download the model from LM Studio's model library if not already available.

3. **Start the LM Studio API Server**:
   - In LM Studio, enable the local API server (default URL: http://localhost:1234/v1/chat/completions).
   - Ensure the server is running before executing the renaming script.

### 3. **Install Python Dependencies**

The project includes install_dependencies.bat for automatic setup on Windows.

#### On Windows:
- Double-click install_dependencies.bat or run it in Command Prompt to set up the virtual environment and install dependencies.

This will:
1. Create a virtual environment (env).
2. Install dependencies from requirements.txt.
3. Optionally run the renaming script after setup.

#### Activate the Virtual Environment:
- Run:
  
  .\env\Scripts\activate
  

---

## Usage

### 1. **Music File Renaming Script**

This script processes MP3 files in the current directory, using **LM Studio**'s Llama-3.2-3B model to detect languages and rename files with a language tag (e.g., song.mp3 → song - [ENG].mp3).

#### Steps to Use:
1. **Ensure LM Studio is Running**:
   - Start LM Studio and ensure the API server is active at http://localhost:1234/v1/chat/completions.

2. **Set the Language Preference**:
   - Run the script and input preferred language tags (e.g., PL, ENG) or type detect for automatic language detection using LM Studio.

3. **Run the Renaming Script**:
   - Execute:
     
     python renaming_script.py
     

   The script will:
   - Process all .mp3 files in the current directory.
   - Use LM Studio to clean filenames and detect languages (if detect is selected).
   - Skip files listed in processed_files.json to avoid reprocessing.
   - Rename files with a language tag (e.g., song - [ENG].mp3).

4. **Processed Files**:
   - Renamed files include a language tag (e.g., [ENG], [PL]).
   - Processed files are tracked in processed_files.json.

#### Example Output:
- Input: SuperBand - EpicSong [Official Video].mp3
- Output: SuperBand - EpicSong - [ENG].mp3

### 2. **Text-to-Speech Announcements**

The tts.js script runs in the **JScript Panel** within foobar2000 to announce track names and hourly time updates using Microsoft Edge TTS voices.

#### Steps to Use:
1. **Load the TTS Script**:
   - Open foobar2000, add a **JScript Panel**, and load tts.js.
   - The script automatically runs when a new track plays or foobar2000 starts with a track playing.

2. **Functionality**:
   - **Track Announcements**: Extracts the track name from the filename, removes language tags (e.g., [ENG]), and announces it using a language-specific voice (e.g., en-US-JennyNeural for English, pl-PL-ZofiaNeural for Polish).
   - **Time Announcements**: Announces the time in English (e.g., "It's now 3:45 PM") at the start of each hour, ensuring it only triggers once per hour.
   - **Voice Configuration**: Uses predefined voices in tts.js (e.g., EN, PL, ES, DE, FR) with adjustable delay and rate settings.

3. **Customization**:
   - Edit tts.js to modify voice mappings, announcement delays (minDelaySeconds, maxDelaySeconds), or TTS rate (ttsRate).

### 3. **Using JScript Panel in foobar2000**

The **JScript Panel** enables automation in foobar2000, such as renaming files or playing TTS announcements.

#### Steps to Use:
1. **Install the JScript Panel** (as outlined in the foobar2000 setup section).

2. **Load a Script**:
   - Open the **JScript Panel** in foobar2000 and load tts.js for TTS announcements or a custom JScript for other tasks (e.g., renaming playlist tracks).

3. **Run the Script**:
   - The script runs within foobar2000, enabling tasks like:
     - Announcing track names and time via tts.js.
     - Automating playlist or metadata management.

---

## File structure
music-rename-tts/  
- renaming_script.py       # Script for renaming MP3 files using LM Studio  
- tts.js                   # JScript for TTS announcements in foobar2000  
- install_dependencies.bat # Batch file for Windows to install dependencies  
- requirements.txt         # List of Python dependencies  
- processed_files.json     # Tracks processed files for renaming  
- LICENSE                  # MIT License file  
- README.md                # Project overview and instructions  


---

## Testing

Verify the setup with these steps:

1. **Test the Renaming Script**:
   - Place a sample MP3 file (e.g., test_song.mp3) in the project directory.
   - Ensure LM Studio is running with the Llama-3.2-3B model.
   - Run python renaming_script.py and select detect or a language tag (e.g., ENG).
   - Check that the file is renamed (e.g., test_song - [ENG].mp3) and listed in processed_files.json.

2. **Test the TTS Announcements**:
   - Open foobar2000, add a JScript Panel, and load tts.js.
   - Play a track with a language tag (e.g., song - [ENG].mp3).
   - Verify that the track name is announced (e.g., "song") using the correct voice (e.g., en-US-JennyNeural).
   - At the start of an hour, confirm the time is announced (e.g., "It's now 3:00 PM").

3. **Test foobar2000 Integration**:
   - Confirm that the JScript Panel loads tts.js correctly and interacts with renamed files.

---

## Troubleshooting

- **LM Studio API Error**:
  - Ensure LM Studio is running and the API server is active at http://localhost:1234/v1/chat/completions.
  - Verify the Llama-3.2-3B model is loaded.
- **"pip not found"**:
  - Confirm Python and pip are installed and added to your system's PATH (python --version, pip --version).
- **Language Detection Fails**:
  - Ensure the input text or MP3 metadata is sufficient for detection. Try specifying a language tag (e.g., ENG) instead of detect.
- **TTS Announcements Not Playing**:
  - Confirm Microsoft Edge is installed and edge-playback is accessible.
  - Verify the JScript Panel is correctly configured and tts.js is loaded.
- **foobar2000 JScript Panel Not Loading**:
  - Confirm you're using the 32-bit version of foobar2000 and the JScript Panel is installed in the components directory.
- **Dependency Installation Errors**:
  - Run pip install -r requirements.txt manually in the virtual environment to diagnose issues.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to open an issue or submit a pull request for improvements or bug fixes. Contributions are welcome!
