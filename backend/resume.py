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


# ========== Open URL in Chrome ==========
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


# ========== Config ==========
url = "https://pitneybowes.wd1.myworkdayjobs.com/en-US/pbcareers/job/US-CT-Shelton/Data-Science-Intern--onsite-_R19911/apply/autofillWithResume?utm_source=Simplify&ref=Simplify"

# ========== Run ==========
print("[STEP] Opening URL in Chrome")
# open_in_chrome(url)

time.sleep(1)  # Wait for page to load

pyautogui.scroll(-50)
pyautogui.click(788, 544)
print("[STEP] Pressing TAB once")
time.sleep(1)
pyautogui.press("tab")
pyautogui.press("enter")
time.sleep(1)


# pyautogui.moveTo(333, 342)
# pyautogui.click()
# pyautogui.press("tab")
# pyautogui.sleep(2)
pyautogui.press("tab")
pyautogui.typewrite("Siddharth_Perabathini_Resume%20(49).pdf")
pyautogui.press("enter")

pyautogui.sleep(1)
# pyautogui.moveTo(504, 376)
pyautogui.click(find_image("images/resumepdf.png"))
pyautogui.press("enter")
pyautogui.scroll(50)
pyautogui.sleep(1)
pyautogui.click(find_image("images/next.png"))
print("[✅] Done.")
