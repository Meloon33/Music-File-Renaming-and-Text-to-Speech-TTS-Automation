# Music File Renaming and Text-to-Speech (TTS) Automation

This project automates the renaming of music files based on language detection and provides a Text-to-Speech (TTS) functionality for voice output. It is designed to handle MP3 file renaming tasks and convert text into audio using different voice options.

Additionally, the project integrates **foobar2000 32-bit** with a **JScript Panel** for enhanced music management and automation.

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
   - The script will process MP3 files in a specified directory, detect the language of the file (if `detect` is selected), and rename the files according to a structured format.
   - Renaming follows a pattern based on language tags (e.g., `[ENG]`, `[PL]`, `[ES]`).

### 2. **Text-to-Speech (TTS) Functionality**
   - Converts text to speech using either Google Text-to-Speech (gTTS) or an offline alternative (pyttsx3).
   - Users can choose the language for the speech or let the script automatically detect the language from the text.

### 3. **foobar2000 Integration**
   - Provides integration with **foobar2000 32-bit**, a popular music player.
   - Uses the **JScript Panel** for custom scripting and automation within foobar2000.

---

## Requirements

Before running the scripts, you must have the following installed:

- **Python 3.6+**
- **pip** (Python package installer)

### Dependencies:
- `requests==2.28.1`
- `pydub==0.25.1`
- `gTTS==2.2.3`
- `pyaudio==0.2.11`
- `pyttsx3==2.90`
- `langdetect==1.0.9`

These dependencies are listed in `requirements.txt` and can be installed automatically.

Additionally, you'll need:
- **foobar2000 32-bit**: Download it from [here](https://www.foobar2000.org/download).
- **JScript Panel**: Download the panel from [here](https://github.com/kbuffington/foo_jscript_panel/releases).

---

## Installation

### 1. **foobar2000 Setup**

To integrate **foobar2000** with this project, follow these steps:

1. **Download and Install foobar2000 (32-bit)**:
   - Go to the official website: [foobar2000 download page](https://www.foobar2000.org/download).
   - Download the **32-bit** version of **foobar2000**.
   - Follow the installation instructions for your operating system.

2. **Install the JScript Panel in foobar2000**:
   - Download the JScript Panel from the official repository: [JScript Panel GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
   - Extract the contents of the release into your foobar2000 installation directory.
   - Follow the installation instructions included in the release.

3. **Enable the JScript Panel**:
   - Open **foobar2000** and go to **View** → **Layout** → **Enable Layouts**.
   - In the layout configuration window, add a new **JScript Panel**.
   - Point it to the script you want to run. This could be a custom script for automation or interaction with your MP3 files.

### 2. **Install Dependencies**

The project provides a `install_dependencies.bat` (Windows) or `install_dependencies.sh` (Linux/macOS) script for automatic setup.

#### On Windows:
- Double-click the `install_dependencies.bat` file or run it in Command Prompt to install dependencies and set up the virtual environment.

#### On Linux/macOS:
- Run the following in your terminal:
  
```bash
bash install_dependencies.sh
```

This will:
1. Create a virtual environment.
2. Install the required dependencies from `requirements.txt`.
3. Optionally run the renaming script after the setup.

### 3. **Activate the Virtual Environment**
   
For **Windows**:
- Activate the environment by running:
  ```bash
  .\env\Scripts\activate
  ```

For **Linux/macOS**:
- Activate by running:
  ```bash
  source env/bin/activate
  ```

---

## Usage

### 1. **Music File Renaming Script**

This script will process the MP3 files in the directory where the script is located. It will rename the files based on language detection or a preferred language tag specified by the user.

#### Steps to use:

1. **Set the Language Preference:**
   - When prompted, input the language tags you prefer for renaming (e.g., `PL, ENG` for Polish and English) or type `detect` for automatic language detection.
   
2. **Run the Renaming Script:**
   - Run the script by executing:
     ```bash
     python renaming_script.py
     ```

   The script will:
   - Process all MP3 files in the current directory.
   - Check whether the file has already been processed (to prevent reprocessing).
   - Rename the file based on language detection or the specified language tag.

3. **Processed Files:**
   - Renamed files will have a language tag added (e.g., `- [ENG]` for English).
   - The names of processed files will be tracked in `processed_files.json` to avoid reprocessing on subsequent runs.

### 2. **Text-to-Speech Script**

This script takes text as input and outputs speech using your preferred voice engine (gTTS or pyttsx3).

#### Steps to use:

1. **Run the TTS Script:**
   - To generate speech, run the following command:
     ```bash
     python tts_script.py "Your text here"
     ```

   The script will:
   - Detect the language of the input text (if `detect` mode is enabled).
   - Convert the text into speech and output it as an audio file (e.g., `output.mp3`).

2. **Voice Options:**
   - If you're using **pyttsx3**, the script will use the system's default voice. You can modify the voice properties (rate, volume) within the script if needed.

### 3. **Using JScript Panel in foobar2000**

The **JScript Panel** in foobar2000 allows you to create custom scripts for automation within the foobar2000 environment. This can be especially useful for automating tasks such as renaming files or generating TTS output.

#### Steps to use:

1. **Install the JScript Panel** (as outlined in the foobar2000 setup section).

2. **Create or Modify a Script:**
   - Open the **JScript Panel** in foobar2000 and load your custom script.
   - This could be a script that interacts with your MP3 files or generates outputs based on the tasks defined in this project.

3. **Run the Script:**
   - Once the script is set up, it will run within foobar2000, and you can automate tasks such as:
     - Renaming music files.
     - Converting text to speech and playing the resulting audio.

---

## File Structure

```plaintext
music-rename-tts/
│
├── renaming_script.py       # Script for renaming MP3 files
├── tts_script.py            # Script for text-to-speech functionality
├── install_dependencies.bat # Batch file for Windows to install dependencies
├── install_dependencies.sh  # Shell script for Linux/macOS to install dependencies
├── requirements.txt         # List of dependencies for the project
├── processed_files.json     # File to track processed files for renaming
└── README.md                # Project overview and instructions
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to open an issue or submit a pull request if you have any improvements or bug fixes. Contributions are always welcome!

---

**Thank you for using the Music File Renaming and TTS Automation project!**
