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


pyautogui.PAUSE = 1.5

test1 = "https://leidos.wd5.myworkdayjobs.com/External/job/Huntsville-AL/Aviation-Software-Engineer-Intern_R-00156871?utm_source=Simplify&ref=Simplify"

test2 = "https://zeissgroup.wd3.myworkdayjobs.com/External/job/Dublin-CA/ADD-Research-Intern-Image-Quality_JR_1040761?utm_source=Simplify&ref=Simplify"

test3 = "https://lumentum.wd5.myworkdayjobs.com/en-US/LITE/job/USA---CA---San-Jose-Ridder/Software-Development-Intern_2025469?utm_source=Simplify&ref=Simplify"

test4 = "https://pitneybowes.wd1.myworkdayjobs.com/en-US/pbcareers/job/US-CT-Shelton/Data-Science-Intern--onsite-_R19911?utm_source=Simplify&ref=Simplify"

test5 = "https://rhsc.wd5.myworkdayjobs.com/delta_dental_of_michigan/job/Okemos-MI/Internship---Application-Development_JR100758?utm_source=Simplify&ref=Simplify"


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


def auto_apply(url_path):
    webbrowser.open("https://www.google.com")

    click(396, 101)
    pyautogui.typewrite(url_path)

    pyautogui.press("enter")
    time.sleep(3)

    pyautogui.click(find_image("images/apply-button.png"))
    pyautogui.click(find_image("images/autofill-with-resume.png"))
    time.sleep(3)
    pyautogui.click(find_image("images/email-address.png"))
    pyautogui.typewrite("venkateshsuhesh807@gmail.com")
    pyautogui.click(find_image("images/password.png"))

    pyautogui.typewrite("SGBN#h5?fYmP7XMe*{>Z/")

    pyautogui.scroll(-100)
    pyautogui.click(find_image("images/verify-new-password.png"))
    pyautogui.typewrite("SGBN#h5?fYmP7XMe*{>Z/")
    pyautogui.click(find_image("images/create-account.png"))


auto_apply(test5)
