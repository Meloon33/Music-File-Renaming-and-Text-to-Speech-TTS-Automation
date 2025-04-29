@echo off
:: Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python and add it to the system PATH.
    exit /b
)

:: Check if pip is installed
python -m ensurepip --upgrade >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo pip is not installed. Installing pip...
    python -m ensurepip --upgrade
)

:: Create a virtual environment
echo Creating a virtual environment...
python -m venv env

:: Activate the virtual environment
echo Activating the virtual environment...
call env\Scripts\activate.bat

:: Upgrade pip
echo Upgrading pip to the latest version...
pip install --upgrade pip

:: Create a requirements.txt file with the necessary dependencies
echo Creating requirements.txt...
echo requests==2.28.1 > requirements.txt
echo pydub==0.25.1 >> requirements.txt
echo gTTS==2.2.3 >> requirements.txt
echo pyaudio==0.2.11 >> requirements.txt
echo pyttsx3==2.90 >> requirements.txt
echo langdetect==1.0.9 >> requirements.txt

:: Install dependencies from requirements.txt
echo Installing dependencies...
pip install -r requirements.txt

:: Inform user that dependencies have been installed
echo All dependencies have been installed successfully!

:: (Optional) Run the Python script (e.g., renaming script)
:: Uncomment the next line if you'd like to run a script after installation
:: echo Running the renaming script...
:: python renaming_script.py

:: Deactivate the virtual environment
echo Deactivating the virtual environment...
deactivate

:: Inform the user the process is complete
echo Installation and setup completed successfully!

pause
