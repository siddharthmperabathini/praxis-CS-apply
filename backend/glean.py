import time
from pyautogui import click, displayMousePosition, screenshot, typewrite
import pyautogui
import cv2
import numpy as np
import pyautogui
import cv2
import numpy as np
import webbrowser
import time
from PIL import Image
import subprocess


def safe_type(text):
    """Type text safely avoiding emoji triggering with letter 'e'"""
    # Make sure no modifier keys are pressed
    pyautogui.keyUp("fn")
    pyautogui.keyUp("command")
    pyautogui.keyUp("ctrl")
    pyautogui.keyUp("alt")
    pyautogui.keyUp("shift")
    # time.sleep(0.5)

    # Type each character with special handling for 'e'
    for char in text:
        if char.lower() == "e":
            # Special handling for the letter 'e'
            # Try using keyboard key code instead of character
            pyautogui.keyDown("e")
            # time.sleep(0.05)                                                                                                        pyautogui.keyUp("e")
            # time.sleep(0.2)
        else:
            pyautogui.write(char)
            # time.sleep(0.1)


def open_in_chrome(url):
    """Opens the given URL in Google Chrome via AppleScript on macOS."""
    script = f"""
    tell application "Google Chrome"
        if not (exists window 1) then
            make new window
        end if
        activate
        open location "{url}"
    end tell
    """
    subprocess.run(["osascript", "-e", script])


def find_image(path):
    screenshot = pyautogui.screenshot()
    screenshot_np = np.array(screenshot)
    gray_screenshot = cv2.cvtColor(screenshot_np, cv2.COLOR_RGB2GRAY)
    template = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    result = cv2.matchTemplate(gray_screenshot, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    screen_width, screen_height = pyautogui.size()
    scale_x = screen_width / screenshot_np.shape[1]
    scale_y = screen_height / screenshot_np.shape[0]
    h, w = template.shape
    center_x = max_loc[0] + w // 2
    center_y = max_loc[1] + h // 2
    return int(center_x * scale_x), int(center_y * scale_y)


url = "https://job-boards.greenhouse.io/gleanwork/jobs/4552477005?utm_source=Simplify&ref=Simplify"
open_in_chrome(url)
time.sleep(2)
pyautogui.press("tab")

pyautogui.press("tab")
pyautogui.press("tab")
pyautogui.press("tab")
pyautogui.typewrite("Siddharth")

pyautogui.press("tab")

pyautogui.typewrite("Perabathini")

pyautogui.press("tab")

pyautogui.typewrite("smperabathini@gmail.com")

pyautogui.press("tab")


pyautogui.typewrite("3802129409")
pyautogui.press("tab")

pyautogui.press("enter")
time.sleep(2)
pyautogui.press("tab")
pyautogui.typewrite("Siddharth_Perabathini_Resume%20(49).pdf")

time.sleep(2)
# pyautogui.moveTo(504, 376)
pyautogui.click(find_image("images/resumepdf.png"))
pyautogui.press("enter")
time.sleep(4)
pyautogui.press("tab", presses=7, interval=0.1)

pyautogui.typewrite("purd")
for i in range(5):
    pyautogui.press("down")

time.sleep(4)
pyautogui.press("enter")

pyautogui.press("tab", presses=2, interval=0.1)


pyautogui.typewrite("b")

time.sleep(2)
pyautogui.press("enter")


pyautogui.press("tab", presses=3, interval=0.1)
safe_type("https://www.linkedin.com/in/siddharth-perabathini-76a6a1242/")


pyautogui.press("tab", presses=2, interval=0.1)


pyautogui.typewrite("4.0")

pyautogui.press("tab", presses=1, interval=0.1)
pyautogui.typewrite("y")

time.sleep(2)
pyautogui.press("enter")


pyautogui.press("tab", presses=2, interval=0.1)

pyautogui.typewrite("jo")

time.sleep(2)

pyautogui.press("enter")

pyautogui.press("tab", presses=2, interval=0.1)


# pyautogui.press("tab", presses=7, interval=0.1)

pyautogui.typewrite("m")
time.sleep(2)

pyautogui.press("enter")

pyautogui.press("tab", presses=4, interval=0.1)

pyautogui.typewrite("no")

time.sleep(2)

pyautogui.press("enter")


pyautogui.press("tab", presses=3, interval=0.1)

pyautogui.typewrite("no")

time.sleep(2)

pyautogui.press("enter")


pyautogui.press("tab", presses=2, interval=0.1)


pyautogui.press("enter")
