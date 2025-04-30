# MusicFlow

## Przegląd projektu

**MusicFlow** to zaawansowane narzędzie zaprojektowane, aby ułatwić zarządzanie dużymi bibliotekami muzycznymi i wzbogacić doświadczenie odtwarzania. Oferuje dwie główne funkcje:

- **Automatyczne zmienianie nazw plików MP3**: Wykorzystuje sztuczną inteligencję (LM Studio) do wykrywania języka i standaryzacji nazw plików MP3 w spójnym formacie z tagami językowymi (np. `Artysta - Tytuł - [PL].mp3`).
- **Zapowiedzi tekstowo-mowy (TTS)**: Integruje się z foobar2000, oferując radiowe zapowiedzi utworów i godzinowe komunikaty czasu, korzystając z głosów Microsoft Edge TTS, idealne do tworzenia wciągających playlist i udostępniania muzyki na Discordzie.

Projekt jest idealny dla miłośników muzyki, DJ-ów lub każdego, kto chce uporządkować swoją kolekcję muzyczną i dodać profesjonalny akcent do odtwarzania, szczególnie podczas grupowych sesji słuchania.

**Film demonstracyjny**: Zobacz MusicFlow w akcji z radiowymi zapowiedziami utworów w foobar2000:  
[![Obejrzyj film demonstracyjny](https://i3.ytimg.com/vi/INU63GQoYA8/maxresdefault.jpg)](https://youtu.be/INU63GQoYA8)

*Uwaga*: Film pokazuje LM Studio dla zapowiedzi generowanych przez AI, ale obsługiwane jest również ogólne TTS, jeśli LM Studio nie jest dostępne.

---

## Spis treści
- [Przegląd](#przegląd)
- [Funkcje](#funkcje)
- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
  - [Konfiguracja foobar2000](#konfiguracja-foobar2000)
  - [Konfiguracja LM Studio](#konfiguracja-lm-studio)
  - [Zależności Python](#zależności-python)
- [Użycie](#użycie)
  - [Zmiana nazw plików muzycznych](#zmiana-nazw-plików-muzycznych)
  - [Zapowiedzi TTS](#zapowiedzi-tts)
  - [Panel JScript w foobar2000](#panel-jscript-w-foobar2000)
- [Struktura plików](#struktura-plików)
- [Testowanie](#testowanie)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)
- [Obchodzenie ograniczeń udostępniania dźwięku na Discordzie](#obchodzenie-ograniczeń-udostępniania-dźwięku-na-discordzie)
- [Licencja](#licencja)
- [Współpraca](#współpraca)
- [Tło projektu](#tło-projektu)

---

## Przegląd

MusicFlow usprawnia zarządzanie biblioteką muzyczną i automatyzację odtwarzania dzięki dwóm głównym funkcjonalnościom:

### 1. Zmiana nazw plików muzycznych
- Przetwarza pliki MP3 w wybranym katalogu, wykorzystując model AI **LM Studio** do wykrywania języka i standaryzacji nazw.
- Dodaje tagi językowe (np. `[PL]`, `[ENG]`, `[ES]`) na podstawie wykrycia AI lub preferencji użytkownika.

### 2. Zapowiedzi tekstowo-mowy
- Wykorzystuje skrypt JScript Panel (`tts.js`) w foobar2000 do generowania zapowiedzi utworów i godzinowych komunikatów czasu za pomocą głosów Microsoft Edge TTS.
- Obsługuje wiele języków z konfigurowalnymi głosami (np. `en-US-JennyNeural`, `pl-PL-ZofiaNeural`).

### 3. Integracja z foobar2000
- Bezproblemowo integruje się z **foobar2000 32-bit** za pomocą **JScript Panel** do automatyzacji, takich jak zmiana nazw plików i odtwarzanie TTS.

---

## Funkcje
- **Zmiana nazw z AI**: Czyści i standaryzuje nazwy plików MP3 za pomocą modelu językowego LM Studio.
- **Wielojęzyczne TTS**: Oferuje zapowiedzi utworów i czasu w różnych językach z wysokiej jakości głosami neuronowymi.
- **Konfigurowalne zapowiedzi**: Umożliwia dostosowanie głosów, opóźnień i języków w `tts.js`.
- **Kompatybilność z Discordem**: Zawiera rozwiązanie do udostępniania muzyki i zapowiedzi na Discordzie za pomocą maszyny wirtualnej.
- **Efektywne przetwarzanie**: Śledzi przetworzone pliki, aby uniknąć powtórek, i obsługuje wsadowe wywołania API dla szybkości.

---

## Wymagania

Upewnij się, że zainstalowano następujące elementy:

- **Python 3.6+** z **pip**
- **LM Studio**: Do wykrywania języka przez AI ([Pobierz](https://lmstudio.ai/))
- **foobar2000 32-bit**: Do odtwarzania i automatyzacji ([Pobierz](https://www.foobar2000.org/download))
- **JScript Panel**: Wtyczka foobar2000 do skryptów ([Pobierz](https://github.com/kbuffington/foo_jscript_panel/releases))
- **Microsoft Edge**: Wymagane do TTS przez `edge-playback`

### Zależności Python
- `requests==2.28.1`
- `pydub==0.25.1`
- `langdetect==1.0.9`

Zależności są wymienione w `requirements.txt` i mogą być zainstalowane automatycznie.

---

## Instalacja

### Konfiguracja foobar2000
1. **Zainstaluj foobar2000 (32-bit)**:
   - Pobierz z [foobar2000.org](https://www.foobar2000.org/download).
   - Zainstaluj wersję 32-bitową na Windows.
2. **Zainstaluj JScript Panel**:
   - Pobierz z [GitHub](https://github.com/kbuffington/foo_jscript_panel/releases).
   - Wypakuj do katalogu foobar2000 i postępuj zgodnie z instrukcją instalacji wtyczki.
3. **Skonfiguruj JScript Panel**:
   - W foobar2000 przejdź do **Widok** → **Układ** → **Włącz układy**.
   - Dodaj **JScript Panel** do układu.
   - Załaduj `tts.js` dla zapowiedzi TTS lub inne skrypty dla automatyzacji.

### Konfiguracja LM Studio
1. **Zainstaluj LM Studio**:
   - Pobierz z [lmstudio.ai](https://lmstudio.ai/) i zainstaluj na Windows.
2. **Załaduj model AI**:
   - Otwórz LM Studio i załaduj model **Llama-3.2-3B** (lub pobierz z biblioteki modeli).
3. **Uruchom serwer API**:
   - Włącz lokalny serwer API (domyślnie: `http://localhost:1234/v1/chat/completions`).

### Zależności Python
1. **Automatyczna instalacja (Windows)**:
   - Uruchom `install_dependencies.bat`, aby:
     - Utworzyć środowisko wirtualne (`env`).
     - Zainstalować zależności z `requirements.txt`.
2. **Ręczna instalacja**:
   - Aktywuj środowisko wirtualne:
     ```bash
     .\env\Scripts\activate
     ```
   - Zainstaluj zależności:
     ```bash
     pip install -r requirements.txt
     ```

---

## Użycie

### Zmiana nazw plików muzycznych
Skrypt `renaming_script.py` standaryzuje nazwy plików MP3 za pomocą AI LM Studio, dodając tagi językowe (np. `song.mp3` → `Artysta - Tytuł - [PL].mp3`).

#### Kroki:
1. **Uruchom LM Studio**:
   - Upewnij się, że serwer API działa pod adresem `http://localhost:1234/v1/chat/completions`.
2. **Uruchom skrypt**:
   - Wykonaj:
     ```bash
     python renaming_script.py
     ```
   - Wybierz tag językowy (np. `PL`, `ENG`) lub `detect` dla wykrywania języka przez AI.
3. **Działanie skryptu**:
   - Przetwarza wszystkie pliki `.mp3` w bieżącym katalogu.
   - Czyści nazwy i dodaje tagi językowe.
   - Pomija przetworzone pliki (śledzone w `processed_files.json`).
4. **Przykład**:
   - Wejście: `SuperBand - EpicSong [Official Video].mp3`
   - Wyjście: `SuperBand - EpicSong - [PL].mp3`

### Zapowiedzi TTS
Skrypt `tts.js` w JScript Panel foobar2000 ogłasza nazwy utworów i godzinowe komunikaty czasu za pomocą głosów Microsoft Edge TTS.

#### Kroki:
1. **Załaduj skrypt**:
   - Dodaj JScript Panel w foobar2000 i załaduj `tts.js`.
   - Zapowiedzi uruchamiają się automatycznie przy zmianie utworu lub starcie odtwarzacza.
2. **Funkcjonalność**:
   - **Zapowiedzi utworów**: Wyodrębnia i ogłasza nazwy utworów (bez tagów, np. `[PL]`) w odpowiednim języku.
   - **Zapowiedzi czasu**: Ogłasza czas (np. „Jest teraz 15:45”) co godzinę, ograniczając do raz na godzinę.
   - **Konfiguracja głosu**: Obsługuje głosy takie jak `en-US-JennyNeural` i `pl-PL-ZofiaNeural`, konfigurowalne w `tts.js`.
3. **Dostosowanie**:
   - Edytuj `tts.js`, aby zmienić mapowania głosów, opóźnienia (`minDelaySeconds`, `maxDelaySeconds`) lub szybkość TTS (`ttsRate`).

### Panel JScript w foobar2000
JScript Panel umożliwia zadania automatyzacji w foobar2000.

#### Kroki:
1. **Zainstaluj JScript Panel** (patrz Instalacja).
2. **Załaduj skrypt**:
   - Dodaj JScript Panel i załaduj `tts.js` lub niestandardowy skrypt.
3. **Zadania automatyzacji**:
   - Użyj `tts.js` do zapowiedzi utworów i czasu.
   - Twórz niestandardowe skrypty do zarządzania playlistami lub metadanymi.

---

## Struktura plików
```
music-rename-tts/
├── renaming_script.py       # Skrypt Python do zmiany nazw plików MP3
├── tts.js                   # Skrypt JScript do zapowiedzi TTS
├── install_dependencies.bat # Plik wsadowy do instalacji zależności (Windows)
├── requirements.txt         # Lista zależności Python
├── processed_files.json     # Śledzi przetworzone pliki
├── LICENSE                  # Licencja MIT
└── README.pl.md             # Dokumentacja projektu
```

---

## Testowanie

### Test zmiany nazw
1. Umieść próbny plik MP3 (np. `test_song.mp3`) w katalogu projektu.
2. Upewnij się, że LM Studio działa z modelem Llama-3.2-3B.
3. Uruchom `python renaming_script.py` i wybierz `detect` lub tag językowy.
4. Sprawdź, czy plik został przemianowany (np. `test_song - [PL].mp3`) i zapisany w `processed_files.json`.

### Test zapowiedzi TTS
1. W foobar2000 załaduj `tts.js` w JScript Panel.
2. Odtwórz utwór z tagiem językowym (np. `song - [PL].mp3`).
3. Potwierdź, że nazwa utworu jest zapowiadana odpowiednim głosem.
4. Na początku godziny sprawdź zapowiedź czasu.

### Test integracji z foobar2000
- Upewnij się, że JScript Panel ładuje `tts.js` i współpracuje z przemianowanymi plikami.

---

## Rozwiązywanie problemów

- **Błąd API LM Studio**:
  - Sprawdź, czy serwer API działa pod adresem `http://localhost:1234/v1/chat/completions` i model Llama-3.2-3B jest załadowany.
- **„pip nie znaleziono”**:
  - Potwierdź, że Python i pip są w PATH (`python --version`, `pip --version`).
- **Nieudane wykrywanie języka**:
  - Upewnij się, że metadane są wystarczające lub określ tag językowy.
- **Zapowiedzi TTS nie działają**:
  - Sprawdź, czy Microsoft Edge jest zainstalowany i `edge-playback` jest dostępny.
  - Potwierdź, że `tts.js` jest poprawnie załadowany.
- **JScript Panel się nie ładuje**:
  - Użyj foobar2000 32-bit i zweryfikuj instalację JScript Panel.
- **Problemy z zależnościami**:
  - Uruchom `pip install -r requirements.txt` ręcznie w środowisku wirtualnym.

---

## Obchodzenie ograniczeń udostępniania dźwięku na Discordzie

### Problem
MusicFlow odtwarza muzykę przez foobar2000, a zapowiedzi TTS przez systemowy dźwięk Windows (`edge-playback`). Ograniczenie Discorda do udostępniania dźwięku z jednego okna uniemożliwia przechwytywanie obu źródeł.

### Rozwiązanie
Uruchom MusicFlow w maszynie wirtualnej **VirtualBox** z **Tiny10** (lekka wersja Windows 10), aby skonsolidować dźwięk w jednym oknie dla Discorda.

#### Kroki
1. **Zainstaluj VirtualBox**:
   - Pobierz z [virtualbox.org](https://www.virtualbox.org/wiki/Downloads).
2. **Pobierz Tiny10**:
   - Uzyskaj ISO Tiny10 z zaufanego źródła (np. [Archive.org](https://archive.org/details/tiny-10-21h-2-x-64)).
   - *Uwaga*: Zweryfikuj źródło i sprawdź licencję.
3. **Skonfiguruj maszynę wirtualną**:
   - Utwórz VM (Windows 10, 64-bit, 2GB RAM, 20GB miejsca).
   - Zamontuj ISO Tiny10 i zainstaluj Windows.
4. **Zainstaluj MusicFlow**:
   - Postępuj zgodnie z krokami **Instalacja** dla Python, LM Studio, foobar2000 i plików projektu.
   - Załaduj `tts.js` w foobar2000.
5. **Udostępniaj na Discordzie**:
   - Na komputerze głównym udostępnij okno VM VirtualBox w Discordzie z włączonym dźwiękiem.
   - Odtwórz muzykę w foobar2000; muzyka i zapowiedzi będą udostępniane.

#### Korzyści
- Konsoliduje dźwięk dla Discorda.
- Tiny10 minimalizuje zużycie zasobów VM.

#### Uwagi
- Upewnij się, że komputer ma wystarczające zasoby dla płynnej pracy VM.
- W razie potrzeby dostosuj ustawienia dźwięku VirtualBox.

---

## Licencja
Projekt jest objęty licencją MIT. Zobacz [LICENSE](LICENSE) dla szczegółów.

---

## Współpraca
Zapraszamy do współpracy! Otwórz zgłoszenie lub prześlij pull request dla ulepszeń lub poprawek.

---

## Tło projektu

MusicFlow powstał, aby stworzyć wciągające doświadczenie muzyczne podczas sesji gamingowych na Discordzie, zarządzając playlistą blisko 4000 różnorodnych utworów — miksów, remiksów, oryginalnych piosenek, coverów AI i utworów z YouTube w wielu językach. Niespójne nazwy plików (np. zawierające `[Official Video]`) i zawodne zapowiedzi TTS stanowiły wyzwanie, inspirując ten projekt.

### Droga rozwoju
- **Początkowe wyzwania**: Niespójne nazwy plików zakłócały odtwarzanie i TTS. Wczesne próby z AIMP nie powiodły się z powodu ograniczonego wsparcia dla skryptów, powodując losowe zapowiedzi TTS. Wykrywanie języka na podstawie polskich znaków (np. ą, ę) lub list słów było zawodne.
- **Przejście na foobar2000**: Przeszedłem na foobar2000 32-bit dla lepszego wsparcia JScript Panel po nieudanych testach wersji 64-bitowej. JScript Panel stał się kluczowy dla automatyzacji.
- **Rozwiązanie zmiany nazw**: Opracowano `renaming_script.py` z modelem Llama-3.2-3B LM Studio do standaryzacji nazw (np. `ACDC - You Shook Me All Night Long - [PL]`). Testowano modele Qwen, Deepseek, Gemma i Mistral, ale Llama-3.2-3B osiągnął ~90% dokładności. Zoptymalizowano skrypt wsadowymi wywołaniami API (5–10 plików) i iteracyjnym udoskonalaniem promptów dla niejednoznacznych nazw.
- **Implementacja TTS**: Napisano `tts.js` dla foobar2000 do zapowiadania utworów i czasu za pomocą głosów Microsoft Edge TTS. Początkowe użycie SAPI porzucono z powodu niskiej jakości głosów. Tymczasowe pliki `.mp3` zakłócały playlisty, co doprowadziło do użycia `edge-playback` dla lepszej jakości. Dostosowano czasowanie, aby uniknąć nakładania się zapowiedzi (np. godziny o 22:00 po polsku).
- **Wybór modelu dla zapowiedzi**: Wyzwaniem było znalezienie małego modelu AI o niskim zużyciu zasobów do generowania zwięzłych zapowiedzi w języku polskim i angielskim. Testowano popularne modele nierozumujące, takie jak BERT, DistilBERT i T5-small, ale dawały niespójne lub zbyt rozwlekłe wyniki. Po szeroko zakrojonych testach `gemma-3-4b-it-qat` okazał się optymalny, równoważąc jakość, szybkość i efektywność zasobów dla zapowiedzi dwujęzycznych.
- **Integracja z Discordem**: `edge-playback` powodował problemy z udostępnianiem dźwięku na Discordzie. Maszyna wirtualna VirtualBox z Tiny10 skonsolidowała dźwięk, umożliwiając płynne udostępnianie.
- **Dodatkowe ulepszenia**: Wzorce regex i obsługa błędów w `renaming_script.py` zostały ulepszone, aby zachować metadane (np. album, rok) i radzić sobie z blokadami plików. TTS dostrojono, aby pomijać tagi (np. `[PL]`) i dodawać naturalne pauzy.

### Najważniejsze osiągnięcia techniczne
- **Integracja AI**: Wykorzystano LM Studio i `gemma-3-4b-it-qat` do wykrywania języka i generowania zapowiedzi.
- **Skryptowanie**: Połączono Python i JScript dla solidnej automatyzacji.
- **Rozwiązywanie problemów**: Pokonano ograniczenia Discorda za pomocą VM.
- **Optymalizacja**: Poprawiono wydajność dzięki wsadowemu przetwarzaniu i śledzeniu przetworzonych plików.

### Plany na przyszłość
- **Ulepszone TTS**: Integracja zapowiedzi generowanych przez AI z ciekawostkami, szczegółami albumu lub rokiem wydania.
- **Lepsza dokładność AI**: Udoskonalenie modelu LLM, aby przekroczyć 90% dokładności w standaryzacji nazw.
- **Lokalny model głosowy AI**: Wdrożenie lokalnego modelu głosowego AI dla wyższej jakości i konfigurowalnych zapowiedzi TTS.
- **Rozszerzone funkcje**: Obsługa dodatkowych formatów plików i zaawansowana automatyzacja playlist.

MusicFlow demonstruje wiedzę w zakresie skryptowania w Pythonie, integracji AI, automatyzacji dźwięku i kreatywnego rozwiązywania problemów, dostarczając praktyczne rozwiązanie dla miłośników muzyki i użytkowników technicznych.