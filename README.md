# Music File Renaming and Text-to-Speech (TTS) Automation

Streamline your music library management with this Python-based project! Automatically rename MP3 files based on language detection and generate text-to-speech (TTS) content for use in **foobar2000 32-bit** via the **JScript Panel**. This tool is perfect for music enthusiasts and developers looking to automate music file organization and integrate TTS with foobar2000.

## Table of Contents
- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
  - [foobar2000 Setup](#foobar2000-setup)
  - [Install Dependencies](#install-dependencies)
- [Usage](#usage)
  - [Music File Renaming Script](#music-file-renaming-script)
  - [Text-to-Speech Script](#text-to-speech-script)
  - [Using JScript Panel in foobar2000](#using-jscript-panel-in-foobar2000)
- [File Structure](#file-structure)
- [License](#license)

## Overview

This project consists of two primary functionalities:

### 1. **Music File Renaming**
   - Processes MP3 files in a specified directory, detects the language of the file (if detect is selected), and renames files according to a structured format.
   - Renaming follows a pattern with language tags (e.g., [ENG], [PL], [ES]).

### 2. **Text-to-Speech (TTS) Functionality in foobar200 with Jscript Panel**
   - Contains content for use in the **JScript Panel** within foobar2000, enabling audio announcement for each track
---

## Requirements

Before running the scripts, ensure the following are installed:

- **Python 3.6+**
- **pip** (Python package installer)

### Dependencies:
- requests==2.28.1
- pydub==0.25.1
- gTTS==2.2.3
- pyaudio==0.2.11
- pyttsx3==2.90
- langdetect==1.0.9

These dependencies are listed in requirements.txt and can be installed automatically.

Additionally, youll need:
- **foobar2000 32-bit**: Download from [foobar2000](https://www.foobar2000.org/download).
- **JScript Panel**: Download from [JScript Panel GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).

---

## Installation

### 1. **foobar2000 Setup**

To integrate **foobar2000** with this project, follow these steps:

1. **Download and Install foobar2000 (32-bit)**:
   - Visit the official website: [foobar2000 download page](https://www.foobar2000.org/download).
   - Download the **32-bit** version of **foobar2000**.
   - Follow the installation instructions for your operating system.

2. **Install the JScript Panel in foobar2000**:
   - Download the JScript Panel from: [JScript Panel GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
   - Extract the contents into your foobar2000 installation directory.
   - Follow the installation instructions included in the release.

3. **Enable the JScript Panel**:
   - Open **foobar2000**, go to **View** → **Layout** → **Enable Layouts**.
   - In the layout configuration window, add a new **JScript Panel**.
   - Load a custom JScript file for automation or interaction with your MP3 files or TTS output.

### 2. **Install Dependencies**

The project includes install_dependencies.bat (Windows)

#### On Windows:
- Double-click install_dependencies.bat or run it in Command Prompt to install dependencies and set up the virtual environment.

This will:
1. Create a virtual environment.
2. Install dependencies from requirements.txt.
3. Optionally run the renaming script after setup.

### 3. **Activate the Virtual Environment**

For **Windows**:
- Activate the environment:
  .\env\Scripts\activate

---

## Usage

### 1. **Music File Renaming Script**

This script processes MP3 files in the current directory, renaming them based on language detection or a user-specified language tag.

#### Steps to use:

1. **Set the Language Preference:**
   - When prompted, input preferred language tags (e.g., PL, ENG for Polish and English) or type detect for automatic language detection.

2. **Run the Renaming Script:**
   - Execute:
     python renaming_script.py

   The script will:
   - Process all MP3 files in the current directory.
   - Check processed_files.json to avoid reprocessing files.
   - Rename files with a language tag (e.g., song.mp3 → song - [ENG].mp3).

3. **Processed Files:**
   - Renamed files include a language tag.
   - Processed files are tracked in processed_files.json to prevent duplicate processing.

### 2. **Text-to-Speech Script**

This script generates TTS content from text input and prepares it for use in the **JScript Panel** within foobar2000.

#### Steps to use:

1. **Run the TTS Script:**
   - Execute:
     python tts_script.py "Your text here"

   The script will:
   - Detect the language of the input text (if detect mode is enabled).
   - Generate an audio file (e.g., output.mp3) containing the TTS content.
   - Prepare the output for copying to a JScript Panel script in foobar2000 (e.g., for playlist announcements or metadata integration).

2. **Voice Options:**
   - Uses **gTTS** for online TTS or **pyttsx3** for offline TTS.
   - To customize pyttsx3 voice settings (e.g., rate, volume), edit tts_script.py and modify engine.setProperty() calls (see [pyttsx3 documentation](https://pyttsx3.readthedocs.io/en/latest/)).

### 3. **Using JScript Panel in foobar2000**

The **JScript Panel** enables custom automation in foobar2000, such as renaming files or integrating TTS output.

#### Steps to use:

1. **Install the JScript Panel** (as outlined in the foobar2000 setup section).

2. **Create or Modify a Script:**
   - Open the **JScript Panel** in foobar2000 and load a custom JScript file.
   - Example: Use a script to rename playlist tracks or play TTS output generated by tts_script.py.

3. **Run the Script:**
   - The script runs within foobar2000, enabling tasks like:
     - Renaming music files in playlists.
     - Incorporating TTS audio for announcements or metadata.

---

## File Structure
music-rename-tts/
│
├── renaming_script.py       # Script for renaming MP3 files
├── tts_script.py            # Script for generating TTS content
├── install_dependencies.bat # Batch file for Windows to install dependencies
├── install_dependencies.sh  # Shell script for Linux/macOS to install dependencies
├── requirements.txt         # List of dependencies for the project
├── processed_files.json     # Tracks processed files for renaming
└── README.md                # Project overview and instructions



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to open an issue or submit a pull request for improvements or bug fixes. Contributions are welcome!

---

**Thank you for using the Music File Renaming and TTS Automation project!**
