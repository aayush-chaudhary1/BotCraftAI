# VS Code Setup Guide for Local RAG Backend

This guide will help you set up and run the Local RAG Backend project in Visual Studio Code (VS Code).

## Prerequisites
Ensure the following are installed on your machine:
- [Visual Studio Code](https://code.visualstudio.com/)
- [Python 3.10+](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)

## 1. VS Code Extensions
Install the following recommended VS Code extensions for Python development:
- **Python** (Microsoft) - Essential for Python support.
- **Python Debugger** (Microsoft) - Debugging support for Python.
- **Pylance** (Microsoft) - Provides rich language support.
- **Black Formatter** (Microsoft) - Automated code formatting.
- **isort** (Microsoft) - Automated import sorting.

## 2. Environment Setup

### Open the Project
1. Open VS Code.
2. Go to **File > Open Folder...** and select the root folder of this project (`c:/dev/newrag`).

### Create a Virtual Environment
1. Open the integrated terminal in VS Code (`Ctrl + ~`).
2. Run the following command to create a virtual environment named `.venv`:
   ```bash
   python -m venv .venv
   ```

### Activate the Virtual Environment
1. In VS Code, press `Ctrl + Shift + P` to open the Command Palette.
2. Type **Python: Select Interpreter** and select it.
3. Choose the interpreter from the `.venv` folder (should show something like `Python 3.10.x ('.venv': venv)`).
4. VS Code may ask to use this environment for the terminal. Select **Yes**.
5. Restart the terminal to ensure the environment is activated. You should see `(.venv)` at the beginning of the command prompt.

### Install Dependencies
Run the following command to install the required packages:
```bash
pip install -r requirements.txt
```

## 3. Running the Application

### Using the Terminal
To run the server manually, execute:
```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`.

### Debugging with VS Code (F5)
We have provided a `.vscode/launch.json` configuration for seamless debugging.
1. Go to the **Run and Debug** view (Play icon on the left sidebar).
2. Select **"Python: FastAPI"** from the dropdown menu.
3. Press `F5` or click the green play button.
4. The server will start, and you can set breakpoints in your code.

## 4. Testing the API
Once the server is running:
- **Swagger UI**: Open your browser and go to `http://127.0.0.1:8000/docs` to interact with the API.
- **Example Usage Script**: Open `example_usage.py` and run it (or use the debugger configuration "Python: Current File") to test the upload and query functionality.

## 5. Helpful Commands
- **Linting**: VS Code will automatically lint your files.
- **Formatting**: Right-click in a file and select **Format Document** (or enable format on save in settings).

Happy coding!
