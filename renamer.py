import os
import json
import requests

# Constants
FILE_EXTENSION = ".mp3"
BATCH_SIZE = 5
PREVIEW_BATCH_SIZE = 20
PROCESSED_JSON = "processed_files.json"

LM_API_URL = "http://localhost:1234/v1/chat/completions"
LM_MODEL = "Llama-3.2-3B"

# Use current directory where the script is placed
DEFAULT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DIRECTORY = DEFAULT_DIRECTORY

LANGUAGE_PREFERENCE = input("Enter preferred language tags (comma-separated, e.g., 'PL, ENG') or type 'detect': ").strip()
DEFAULT_LANGUAGE = "ENG"

EXAMPLES = """
Examples:
1. JohnDoe - MyNewTrack - [ENG].mp3 -> JohnDoe - MyNewTrack - [ENG].mp3  
2. SuperBand - EpicSong [Official Video] - [ENG].mp3 -> SuperBand - EpicSong - [ENG].mp3  
3. AmazingArtist - Summer Hits (Official) - [ENG].mp3 -> AmazingArtist - Summer Hits - [ENG].mp3  
4. PopStar - New Single (Official Video) [HQ] - [ENG].mp3 -> PopStar - New Single - [ENG].mp3  
5. LunarBeats - Relaxing Music [Official Audio] - [ENG].mp3 -> LunarBeats - Relaxing Music - [ENG].mp3  
6. DJMaster - Party Vibes [Official] - [ENG].mp3 -> DJMaster - Party Vibes - [ENG].mp3  
7. RockBand - Live Concert (2019) [ENG].mp3 -> RockBand - Live Concert (2019) - [ENG].mp3  
8. Dawid Jasper - Święta 2021 - [PL].mp3 -> Dawid Jasper - Święta 2021 - [PL].mp3 (Polish)
9. Enrique Iglesias - Bailando - [ES].mp3 -> Enrique Iglesias - Bailando - [ES].mp3 (Spanish)
10. Edith Piaf - La Vie en Rose - [FR].mp3 -> Edith Piaf - La Vie en Rose - [FR].mp3 (French)
""".strip()

# Utility functions
def load_processed_files():
    if os.path.exists(PROCESSED_JSON):
        with open(PROCESSED_JSON, 'r') as f:
            return json.load(f)
    return {}

def save_processed_files(processed_files):
    with open(PROCESSED_JSON, 'w') as f:
        json.dump(processed_files, f, indent=2)

def is_processed(file_name, processed_files):
    return file_name in processed_files

def mark_as_processed(file_name, processed_files):
    processed_files[file_name] = True

def get_renamed_file_name(file_name, examples, language_tag=None):
    headers = {"Content-Type": "application/json"}
    system_prompt = (
        "You are a helpful assistant that cleans and formats music file names "
        "by removing unnecessary phrases and tagging with appropriate language codes. "
        "Follow the format shown in the examples below."
    )

    user_prompt = f"""Examples:
{examples}

Now rename and tag this file:
{file_name}

Output format: CleanTitle - [LANG].mp3
"""

    if language_tag and language_tag.lower() != "detect":
        user_prompt += f"\nUse one of the following language tags: {language_tag}"

    data = {
        "model": LM_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(LM_API_URL, json=data, headers=headers)
        if response.status_code == 200:
            content = response.json()
            suggestion = content['choices'][0]['message']['content'].strip()
            detected_lang = None
            if "[" in suggestion and "]" in suggestion:
                detected_lang = suggestion.split("[")[-1].split("]")[0].strip()
            return suggestion, detected_lang
        else:
            print(f"API error ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    return file_name, None  # Fallback

def process_files(directory, language_tag=None):
    processed_files = load_processed_files()
    for filename in os.listdir(directory):
        if filename.lower().endswith(FILE_EXTENSION) and not is_processed(filename, processed_files):
            print(f"\nProcessing file: {filename}")
            new_file_name, detected_language = get_renamed_file_name(filename, EXAMPLES, language_tag)

            if LANGUAGE_PREFERENCE.lower() == 'detect' and detected_language:
                if f"[{detected_language}]" not in new_file_name:
                    new_file_name = f"{os.path.splitext(new_file_name)[0]} - [{detected_language}]{FILE_EXTENSION}"

            src = os.path.join(directory, filename)
            dst = os.path.join(directory, new_file_name)

            try:
                os.rename(src, dst)
                mark_as_processed(filename, processed_files)
                print(f"Renamed to: {new_file_name}")
            except Exception as e:
                print(f"Failed to rename: {e}")
        else:
            print(f"Skipping: {filename}")

    save_processed_files(processed_files)

# Run script
if __name__ == "__main__":
    print(f"Starting batch rename in: {DIRECTORY}")
    if LANGUAGE_PREFERENCE.lower() == "detect":
        language_tag = None
    else:
        language_tag = LANGUAGE_PREFERENCE or DEFAULT_LANGUAGE
    process_files(DIRECTORY, language_tag)
    print("Renaming completed.")
