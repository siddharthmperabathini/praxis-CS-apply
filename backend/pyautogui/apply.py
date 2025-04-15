import pyautogui
import cv2
import numpy as np
import subprocess
import time
from PIL import Image
import difflib

# Application Questions data dictionary
profile_form_data = {
    "Do you have relatives or significant others currently working at Pitney Bowes": "No",
    "Are you legally entitled to work in the country that you are applying to": "Yes",
    "Have you been previously employed by Pitney Bowes": "No",
    "What was your manager's name": "Bob",
    "What was your Pitney Bowes Email Address": "",
    "What was your Employee ID": "",
    "Are you currently authorized to work in the U.S. for Pitney Bowes Inc": "Yes",
    "Will you now or in the future require sponsorship by Pitney Bowes to attain or maintain your employment eligibility": "No",
    "Are you at least 18 years old": "Yes",
}


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


def is_dropdown(roi):
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    right_section = gray[:, int(0.8 * w) :]
    edges = cv2.Canny(right_section, 50, 150)
    return np.sum(edges) > 100


def select_dropdown_option(value):
    time.sleep(1)
    value_map = {"Yes": 1, "No": 2, "": 0}
    positions = value_map.get(value, 0)
    if positions > 0:
        pyautogui.press("down")
        time.sleep(0.3)
        for _ in range(positions):
            pyautogui.press("down")
            time.sleep(0.3)
        pyautogui.press("enter")
    time.sleep(0.5)


def main():
    url = "https://pitneybowes.wd1.myworkdayjobs.com/en-US/pbcareers/job/US-CT-Shelton/Data-Science-Intern--onsite-_R19911/apply/autofillWithResume?utm_source=Simplify&ref=Simplify"

    lower_blue = np.array([90, 80, 50])
    upper_blue = np.array([140, 255, 255])

    MIN_WIDTH = 30
    MIN_HEIGHT = 15
    ASPECT_RATIO_MIN = 1.0
    ASPECT_RATIO_MAX = 10.0
    TOP_CUTOFF_RATIO = 0.10
    BOTTOM_CUTOFF_RATIO = 0.90
    ABOVE_BOX_HEIGHT = 50
    TOTAL_TABS = 11

    print("[STEP] Opening URL in Chrome")
    time.sleep(2)
    pyautogui.click(671, 614)
    pyautogui.scroll(100)
    pyautogui.scroll(-300)
    time.sleep(1)

    for tab_count in range(TOTAL_TABS):
        pyautogui.scroll(-4)
        print(f"[STEP] Field #{tab_count+1}: Pressing TAB")
        pyautogui.press("tab")
        time.sleep(1.5)

        screenshot = pyautogui.screenshot()
        screenshot_np = np.array(screenshot)
        image_bgr = cv2.cvtColor(screenshot_np, cv2.COLOR_RGB2BGR)

        hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        height, width, _ = image_bgr.shape
        detected_box = None

        for contour in contours:
            approx = cv2.approxPolyDP(
                contour, 0.02 * cv2.arcLength(contour, True), True
            )
            if len(approx) == 4:
                x, y, w_box, h_box = cv2.boundingRect(approx)
                aspect_ratio = w_box / float(h_box)
                if (
                    y < TOP_CUTOFF_RATIO * height
                    or (y + h_box) > BOTTOM_CUTOFF_RATIO * height
                ):
                    continue
                if (
                    w_box > MIN_WIDTH
                    and h_box > MIN_HEIGHT
                    and ASPECT_RATIO_MIN < aspect_ratio < ASPECT_RATIO_MAX
                ):
                    detected_box = (x, y, w_box, h_box)
                    break

        if detected_box is None:
            print(f"[WARN] Field #{tab_count+1}: No blue-highlighted box found.")
            continue

        x, y, w_box, h_box = detected_box

        question_mapping = {
            0: "Do you have relatives or significant others currently working at Pitney Bowes",
            1: "Are you legally entitled to work in the country that you are applying to",
            2: "Have you been previously employed by Pitney Bowes",
            3: "What was your manager's name",
            4: "What was your Pitney Bowes Email Address",
            5: "What was your Employee ID",
            6: "Are you currently authorized to work in the U.S. for Pitney Bowes Inc",
            7: "Will you now or in the future require sponsorship by Pitney Bowes to attain or maintain your employment eligibility",
            8: "Are you at least 18 years old",
        }

        current_question = question_mapping.get(tab_count, "Unknown Question")
        print(f"[INFO] Field #{tab_count+1}: Likely question: '{current_question}'")
        value_to_enter = profile_form_data.get(current_question, "")
        print(f"[INFO] Field #{tab_count+1}: Value to enter: '{value_to_enter}'")

        field_roi = image_bgr[y : y + h_box, x : x + w_box]
        is_dropdown_field = is_dropdown(field_roi)

        field_center_x = x + w_box // 2
        field_center_y = y + h_box // 2

        # pyautogui.click(field_center_x, field_center_y)
        time.sleep(0.5)

        if is_dropdown_field:
            print(f"[INFO] Field #{tab_count+1}: Detected as dropdown")
            # pyautogui.click(field_center_x, field_center_y)
            time.sleep(0.5)
            select_dropdown_option(value_to_enter)
        else:
            print(f"[INFO] Field #{tab_count+1}: Detected as text field")
            if value_to_enter:
                pyautogui.hotkey("command", "a")
                time.sleep(0.3)
                pyautogui.press("delete")
                time.sleep(0.3)
                pyautogui.write(value_to_enter)
                time.sleep(0.5)

        # Move mouse to center to ensure scroll works
        screen_width, screen_height = pyautogui.size()
        # pyautogui.moveTo(screen_width // 2, screen_height // 2)
        time.sleep(0.1)

        # Scroll after filling field
        # pyautogui.scroll(-4)
        time.sleep(0.5)

    print(f"[COMPLETE] Processed {TOTAL_TABS} fields")
    pyautogui.click(find_image("images/next.png"))


if __name__ == "__main__":
    main()
