# MusicFlow

Project Overview

PL: Projekt ułatwia porządkowanie dużych bibliotek muzycznych przez automatyczne poprawianie nazw plików MP3 za pomocą sztucznej inteligencji (LM Studio) oraz dodaje zapowiedzi utworów i godziny, czytane na głos, w odtwarzaczu foobar2000, idealne do tworzenia playlist i dzielenia się muzyką na Discordzie.

EN: The project simplifies managing large music libraries by automatically standardizing MP3 file names using AI (LM Studio) and adds spoken track and time announcements in foobar2000, perfect for creating playlists and sharing music on Discord.

The following video demonstrates how the system generate radio-style track introductions in foobar2000:
https://github.com/user-attachments/assets/9507c3b8-eae4-4306-ad0f-bfdd8b8fe92d

Note: The video showcases the setup with LM Studio for AI-generated announcements, but the project supports generic TTS if LM Studio is not used.

## Wprowadzenie PL

Projekt **Music File Renaming and Text-to-Speech (TTS) Automation** powstał z myślą o stworzeniu wciągającego doświadczenia muzycznego podczas sesji gamingowych na Discordzie z przyjaciółmi, początkowo skupiając się na implementacji zapowiedzi tekstowo-mowy (TTS) dla utworów. Zarządzam playlistą liczącą niemal 4000 różnorodnych utworów — w tym miksy, remiksy, oryginalne piosenki, covery AI i niestandardowe utwory z YouTube w różnych językach — zauważyłem, że niespójne i źle sformatowane nazwy plików (np. zawierające `(OFFICIAL VIDEO)`, bez odpowiedniej struktury lub w różnych językach) zakłócały doświadczenie słuchania i utrudniały wdrożenie niezawodnych zapowiedzi TTS. Różnorodność typów utworów i języków dodatkowo komplikowała wykrywanie języka dla wyboru odpowiedniego głosu do zapowiedzi, ponieważ nazwy plików nie zawierały wyraźnych wskazówek językowych. Próbowałem ustawić wykrywanie języka na polskie znaki specjalne jak ą,ę lub wprowadzać plik tekstowy z najpopularniejszymi rodzinami polskich wyrazów, ale rozwiązanie było dalekie od ideału.

Pierwsze próby podjąłem w AIMP, moim domyślnym odtwarzaczu, ale ograniczone wsparcie dla wtyczek i skryptów oraz modyfikacja metadanych plików podczas odtwarzania powodowały, że zapowiedzi TTS pojawiały się losowo w trakcie utworu, a nie tylko na jego początku. Przeszedłem na foobar2000, początkowo testując wersję 64-bitową, ale odkryłem, że wersja 32-bitowa oferuje znacznie lepsze wsparcie dla komponentów, szczególnie dla wtyczki JScript Panel, która stała się kluczowa dla mojego rozwiązania. Aby rozwiązać problem z nazwami plików, opracowałem skrypt Python (`renaming_script.py`), który wykorzystuje lokalnie hostowany model AI (LM Studio z modelem Llama-3.2-3B) do standaryzacji nazw plików w formacie: `Artysta - Tytuł - [JĘZYK]` (np. `ACDC - You Shook Me All Night Long - [ENG]`). Skrypt wysyła nazwy plików do AI, które sugeruje czystą nazwę i wykrywa język, dodając tag językowy, który system TTS wykorzystuje bez jego odczytywania.

Ujednolicenie tytułów na tak zróżnicowanej playliście było wyzwaniem ze względu na różne konwencje nazewnictwa. Wczesne próby z modelem językowym (LLM), testowanym z modelami takimi jak Qwen, Deepseek, Gemma i Mistral, dawały niespójne wyniki, szczególnie przy przetwarzaniu dużych partii plików, ponieważ AI miało trudności z niejednoznacznymi lub źle sformatowanymi nazwami. Modele „myślące” często dostarczały zbyt rozwlekłe odpowiedzi zamiast zwięzłych, potrzebnych wyników. Po eksperymentach Llama-3.2-3B okazała się najskuteczniejsza, osiągając około 90% dokładności w moim przypadku, co było wystarczające, ale nie idealne. Aby poprawić wydajność LLM, iteracyjnie udoskonalałem prompt, uruchamiając skrypt w trybie podglądu, analizując najgorsze przypadki, ręcznie je poprawiając i dodając jako przykłady do promptu. Ten proces, w połączeniu z większą liczbą przykładów, znacznie poprawił ujednolicanie tytułów, choć planuję w przyszłości jeszcze ulepszyć ten proces. Przetwarzanie 4000 plików było czasochłonne, więc zoptymalizowałem skrypt, by wysyłał 5–10 nazw plików jednocześnie w jednym wywołaniu API, co znacznie przyspieszyło proces przy zachowaniu dokładności.

Mając ustandaryzowane nazwy plików, napisałem `tts.js` dla wtyczki JScript Panel w foobar2000, aby wyciągać nazwy utworów, wykrywać tagi językowe (np. `[ENG]`, `[PL]`) i zapowiadać utwory w odpowiednim języku, używając głosów Microsoft Edge TTS (np. `en-US-JennyNeural` dla angielskiego, `pl-PL-ZofiaNeural` dla polskiego). Tworzenie tych skryptów było wyzwaniem, ponieważ korzystałem z różnych modeli językowych (np. ChatGPT, Grok, lokalne modele) do pomocy. Precyzyjne określenie moich potrzeb było trudne, a generowane skrypty lub funkcje często wymagały intensywnego ręcznego debugowania lub dalszego udoskonalania z pomocą AI, aby spełnić moje specyficzne wymagania. Początkowo używałem SAPI w JScript Panel, co pozwalało odtwarzać zapowiedzi przez foobar2000 i działało na Discordzie, ale niskiej jakości głosy SAPI nie wspierały głosów neuronowych. Próbowałem generować tymczasowe pliki `.mp3` z głosami neuronowymi do odtwarzania na playliście foobar2000, ale było to zawodne, trudne do wymuszenia i zakłócało losowe playlisty, wstawiając pliki zapowiedzi między utwory. Ostatecznie porzuciłem to podejście i przeszedłem na głosy Microsoft Edge TTS za pomocą komendy `edge-playback`, aby uzyskać lepszą jakość dźwięku. Skrypt zapowiada również godzinę o 22:00 po polsku (zgodnie z moją preferencją), co pasuje do typowego zakończenia sesji gamingowych o 22:30. Wyzwaniem było nakładanie się zapowiedzi godziny na zapowiedzi utworów, ponieważ domyślnie używały tego samego głosu. Rozwiązałem to, zapewniając, że zapowiedzi godziny zawsze używają polskiego głosu i dostosowując logikę czasową, aby zapobiec nakładaniu się.

Przejście na `edge-playback` wprowadziło problem z udostępnianiem dźwięku na Discordzie, ponieważ zapowiedzi odtwarzały się przez systemowy dźwięk Windows, a muzyka przez foobar2000. Ograniczenie Discorda do udostępniania dźwięku z jednego okna uniemożliwiało przechwytywanie obu źródeł. Po przetestowaniu różnych rozwiązań ustawiłem maszynę wirtualną za pomocą Oracle VirtualBox z Tiny10, lekką wersją Windows 10. Uruchamiając cały zestaw — foobar2000, JScript Panel i skrypt TTS — wewnątrz VM, skonsolidowałem cały dźwięk w jednym oknie, które Discord mógł udostępnić, zapewniając, że moi przyjaciele słyszeli zarówno muzykę, jak i zapowiedzi bezproblemowo.

Dodatkowe wyzwania obejmowały udoskonalenie skryptu zmiany nazw, aby zachować istotne metadane (np. nazwy albumów, lata) przy usuwaniu niechcianych fraz, takich jak `[Official Video]`. Wzmocniłem wzorce regex i dodałem solidną obsługę błędów, aby radzić sobie z problemami blokady plików i niepowodzeniami API, zapewniając niezawodne działanie na dużych zbiorach danych. Zapowiedzi TTS wymagały dostrojenia, aby uniknąć odczytywania niepotrzebnych tagów (np. `[ENG]`) i wprowadzić naturalne pauzy między artystą a tytułem dla lepszej przejrzystości.

W przyszłości planuję ulepszyć zapowiedzi TTS poprzez integrację komentarzy generowanych przez AI w czasie rzeczywistym, wysyłając nazwy plików do AI, aby tworzyły kreatywne wprowadzenia, wyszukiwały ciekawostki o utworach lub dodawały szczegóły, takie jak album i rok wydania, które następnie byłyby dynamicznie odtwarzane. Chciałbym również poprawić wydajność LLM, aby zwiększyć jego dokładność powyżej obecnych 90% dla unifikacji tytułów. Ten projekt pokazuje moje umiejętności w skryptowaniu w Pythonie, integracji AI, automatyzacji dźwięku i kreatywnym rozwiązywaniu problemów, demonstrując moją zdolność do radzenia sobie ze złożonymi wyzwaniami technicznymi i dostarczania praktycznych, skoncentrowanych na użytkowniku rozwiązań.

## Introduction EN
The **Music File Renaming and Text-to-Speech (TTS) Automation** project began as an effort to create an immersive music listening experience during Discord gaming sessions with friends, initially focusing on implementing text-to-speech (TTS) announcements for tracks. I am managing a playlist of nearly 4000 diverse tracks—including mixes, remixes, original songs, AI covers, and custom YouTube tracks in various languages—I noticed that inconsistent and poorly formatted filenames (e.g., containing `(OFFICIAL VIDEO)`, lacking structure, or written in different languages) disrupted the listening experience and made it challenging to implement reliable TTS announcements. The variety of track types and languages also complicated language detection for selecting appropriate announcement voices, as filenames provided no clear language cues. I tried setting up language detection based on Polish special characters like ą, ę or using a text file with the most common Polish word families, but the solution was far from ideal.

My first attempt was with AIMP, my default music player, but its limited support for plugins and scripting, combined with its tendency to modify file metadata during playback, caused TTS announcements to trigger intermittently throughout a track rather than only at the start. I switched to foobar2000, initially testing the 64-bit version, but found that the 32-bit version offered significantly better component support, particularly for the JScript Panel plugin, which became central to my solution. To address the filename issue, I developed a Python script (`renaming_script.py`) that uses a locally hosted AI model to standardize filenames into a consistent format: `Artist - Title - [LANG]` (e.g., `ACDC - You Shook Me All Night Long - [ENG]`). The script sends filenames to the AI, which suggests a clean name and detects the language, appending a language tag that the TTS system uses without reading it aloud.

Unifying titles across such a diverse playlist was challenging due to the varied naming conventions. Early attempts with the language model (LLM), tested with models like Qwen, Deepseek, Gemma, and Mistral, yielded inconsistent results, especially when processing large batches of files, as the AI struggled with ambiguous or poorly formatted names. “Reasoning-heavy” models often provided verbose outputs instead of the concise responses needed. After experimentation, Llama-3.2-3B proved most effective, achieving about 90% accuracy in my case, which was sufficient but not perfect. To improve LLM performance, I iteratively refined the prompt by running the script in preview mode, analyzing the worst-performing cases, manually correcting them, and adding these as examples to the prompt. This process, combined with more examples, enhanced title unification, though I aim to further improve this process in the future. Processing 4000 files was time-consuming, so I optimized the script to send 5–10 filenames simultaneously in a single API call, greatly speeding up the process while maintaining accuracy.

With standardized filenames, I wrote `tts.js` for foobar2000’s JScript Panel to extract track names, detect language tags (e.g., `[ENG]`, `[PL]`), and announce tracks in the appropriate language using Microsoft Edge TTS voices (e.g., `en-US-JennyNeural` for English, `pl-PL-ZofiaNeural` for Polish). Developing these scripts was challenging, as I relied on various language models (e.g., ChatGPT, Grok, and local models) for assistance. Defining my needs precisely was difficult, and the generated scripts or functions often required extensive manual debugging or further refinement with AI help to meet my specific requirements. Initially, I used SAPI within the JScript Panel, which played announcements through foobar2000 and worked on Discord, but SAPI’s low-quality voices lacked neural voice support. I then tried generating temporary `.mp3` files with neural voices to play within foobar2000’s playlist, but this was unreliable, difficult to enforce, and disrupted random playlists by inserting announcement files between tracks. Ultimately, I switched to Microsoft Edge TTS voices via the `edge-playback` command for superior audio quality. The script also announces the time at 10 PM in Polish (per my preference), aligning with our gaming session end time of 10:30 PM. A challenge arose when time announcements overlapped with track announcements, as both used the same voice by default. I resolved this by ensuring time announcements always use the Polish voice and adjusting timing logic to prevent overlaps.

The switch to `edge-playback` introduced a Discord audio-sharing issue, as announcements played through Windows system audio while music played through foobar2000. Discord’s limitation of sharing audio from one window prevented capturing both sources. After exploring solutions, I set up a virtual machine using Oracle VirtualBox with Tiny10, a lightweight Windows 10 version. By running the entire setup—foobar2000, JScript Panel, and the TTS script—inside the VM, I consolidated all audio into a single window that Discord could share, ensuring my friends could hear both music and announcements seamlessly.

Additional challenges included refining the renaming script to preserve meaningful metadata (e.g., album names, years) while stripping unwanted phrases like `[Official Video]`. I enhanced regex patterns and added robust error handling to address file lock issues and API failures, ensuring reliable operation across large datasets. The TTS announcements required tuning to avoid reading unnecessary tags (e.g., `[ENG]`) and to introduce natural pauses between artist and title for clarity.

Looking ahead, I plan to enhance TTS announcements by integrating real-time AI-generated commentary, sending filenames to the AI to craft creative introductions, fetch song trivia, or include details like album and release year, which would be voiced dynamically. I also aim to further refine the LLM’s performance to improve its accuracy beyond the current 90% for title unification. This project showcases my skills in Python scripting, AI integration, audio automation, and creative problem-solving, demonstrating my ability to tackle complex technical challenges and deliver practical, user-focused solutions.ns.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

## Discord Audio Sharing Workaround

### **Default Audio Setup on Windows**
By default, this project plays audio from two separate sources on Windows:
- **Music Audio**: Played through **foobar2000**, which outputs audio via the foobar2000 application.
- **TTS Announcements**: Played via the `tts.js` script in foobar2000's JScript Panel, which uses the `edge-playback` command to generate announcements through the Windows system audio (Microsoft Edge TTS).

This setup poses a challenge when sharing audio on Discord because Discord only allows sharing audio from a single window at a time. Since the music (foobar2000) and announcements (Windows system audio via `edge-playback`) originate from different sources, Discord cannot capture both simultaneously when sharing the foobar2000 window.

### **Workaround: Using VirtualBox with Tiny10**
To address this, you can run the entire setup inside a virtual machine (VM) using **Oracle VirtualBox** with **Tiny10** (a lightweight version of Windows 10). This consolidates all audio output (music and announcements) into a single VM window, which Discord can then share, allowing both music and announcements to be heard by others.

#### **Steps to Set Up the Workaround**
1. **Install Oracle VirtualBox**:
   - Download and install **Oracle VirtualBox** from [VirtualBox Downloads](https://www.virtualbox.org/wiki/Downloads).
   - Follow the installation instructions for Windows.

2. **Download Tiny10**:
   - Obtain the **Tiny10** ISO (a lightweight Windows 10 version) from a trusted source, such as the official [Archive.org page](https://archive.org/details/tiny-10-21h-2-x-64) (verify the source for safety).
   - Note: Tiny10 is a third-party lightweight version of Windows 10; ensure you understand the risks and licensing implications.

3. **Set Up the Virtual Machine**:
   - Open VirtualBox and create a new VM:
     - Name: Choose a name (e.g., `Tiny10-Music-TTS`).
     - Type: Microsoft Windows.
     - Version: Windows 10 (64-bit).
     - Allocate at least 2GB of RAM and 20GB of storage.
   - Mount the Tiny10 ISO as a virtual optical disk in the VM settings.
   - Start the VM and follow the Tiny10 installation prompts to set up Windows.

4. **Install the Project in the VM**:
   - Inside the Tiny10 VM, follow the **Installation** instructions from this README:
     - Install Python 3.6+, LM Studio, foobar2000 32-bit, and the JScript Panel.
     - Run `install_dependencies.bat` to set up Python dependencies.
     - Copy the project files (`renaming_script.py`, `tts.js`, etc.) into the VM.
   - Configure foobar2000 and load `tts.js` in the JScript Panel as described in the **Usage** section.

5. **Share Audio on Discord**:
   - Open Discord on your host machine (outside the VM).
   - Start a voice channel or call.
   - Use Discord's screen-sharing feature to share the **VirtualBox VM window** (e.g., the Tiny10 VM window running foobar2000).
   - Enable the "Include audio" option in Discord's screen-sharing settings.
   - Play music in foobar2000 within the VM; both the music and TTS announcements will now be captured by Discord and audible to others in the channel.

#### **Benefits of This Setup**
- Consolidates all audio (music and announcements) into a single window (the VM), which Discord can share.
- Allows friends or listeners on Discord to hear both the music from foobar2000 and the track/time announcements from `tts.js`.
- Tiny10 is lightweight, minimizing the resource usage of the VM compared to a full Windows 10 installation.

#### **Notes**
- Ensure your host machine has sufficient resources (CPU, RAM) to run VirtualBox smoothly alongside Discord.
- You may need to adjust the VM's audio settings in VirtualBox (e.g., enable audio and select the correct audio controller) to ensure sound output works correctly.
- If audio quality or performance is an issue, consider tweaking Tiny10's settings or allocating more resources to the VM in VirtualBox.

This workaround enables seamless audio sharing on Discord while preserving the full functionality of the Music File Renaming and TTS Automation project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to open an issue or submit a pull request for improvements or bug fixes. Contributions are welcome!


