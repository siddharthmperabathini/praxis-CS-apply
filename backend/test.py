import os
import time
from pyautogui import click, screenshot, typewrite
import pyautogui
import cv2
import numpy as np

pyautogui.PAUSE = 1.5

# Example URLs for the application process
test1 = "https://leidos.wd5.myworkdayjobs.com/External/job/Huntsville-AL/Aviation-Software-Engineer-Intern_R-00156871?utm_source=Simplify&ref=Simplify"
test2 = "https://zeissgroup.wd3.myworkdayjobs.com/External/job/Dublin-CA/ADD-Research-Intern-Image-Quality_JR_1040761?utm_source=Simplify&ref=Simplify"
test3 = "https://workday.wd5.myworkdayjobs.com/en-US/Workday/job/United-Kingdom-London/Director-and-Head-of-EMEA-Sales-Enablement_JR-0095933?source=Careers_Website"

# Create a folder to store dynamic template images if it doesn't exist
DYNAMIC_FOLDER = "dynamic_templates"
if not os.path.exists(DYNAMIC_FOLDER):
    os.makedirs(DYNAMIC_FOLDER)


def capture_dynamic_template(region, label):
    """
    Captures a region of the screen and saves it as a dynamic template image.
    :param region: A tuple (x, y, width, height) defining the region.
    :param label: A descriptive name for the UI element.
    :return: File path of the saved image.
    """
    x, y, w, h = region
    # Take a screenshot of the specified region
    region_img = pyautogui.screenshot(region=(x, y, w, h))
    file_name = os.path.join(DYNAMIC_FOLDER, f"{label}_{int(time.time())}.png")
    region_img.save(file_name)
    print(f"[Dynamic Capture] Saved template image: {file_name}")
    return file_name


def find_image(path, capture_dynamic=False, label="unknown", threshold=0.8):
    """
    Searches the current screen for the template image.
    If the best match value is below the threshold and dynamic capture is enabled,
    it captures the region as a new template.
    :param path: Path to the template image.
    :param capture_dynamic: Boolean flag to enable dynamic capture if match is weak.
    :param label: Label to use when saving the dynamic image.
    :param threshold: Matching threshold (0 to 1).
    :return: (x, y) coordinates for clicking (center of matched region).
    """
    # Capture current screen image
    screen_img = pyautogui.screenshot()
    screen_np = np.array(screen_img)
    # Convert screen to grayscale
    gray_screen = cv2.cvtColor(screen_np, cv2.COLOR_RGB2GRAY)
    # Read the template image in grayscale
    template = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if template is None:
        raise FileNotFoundError(f"Template {path} not found.")

    # Perform template matching
    result = cv2.matchTemplate(gray_screen, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

    # Check the best match score; if too low and capture_dynamic is True, capture the region anyway.
    if max_val < threshold:
        print(f"[Template Matching] Match for {label} below threshold ({max_val:.2f}).")
        if capture_dynamic:
            h, w = template.shape
            region = (max_loc[0], max_loc[1], w, h)
            # Dynamically capture this region and use it as a new template.
            new_template_path = capture_dynamic_template(region, label)
            # Re-read the newly saved template and re-run template matching
            template = cv2.imread(new_template_path, cv2.IMREAD_GRAYSCALE)
            result = cv2.matchTemplate(gray_screen, template, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            print(f"[Template Matching] New match score for {label} is {max_val:.2f}")

    # Calculate scaling (in case your screenshot dimensions differ from actual screen size)
    screen_width, screen_height = pyautogui.size()
    scale_x = screen_width / screen_np.shape[1]
    scale_y = screen_height / screen_np.shape[0]

    h, w = template.shape
    # Compute the center of the matched region
    center_x = max_loc[0] + w // 2
    center_y = max_loc[1] + h // 2

    return int(center_x * scale_x), int(center_y * scale_y)


def auto_apply(url_path):
    # Open the URL in the browser.
    click(396, 101)  # Assumes you've pre-clicked the address bar location
    typewrite(url_path)
    pyautogui.press("enter")
    time.sleep(3)

    # For each UI element, try to find the pre-existing template and dynamically capture if needed.
    apply_coords = find_image(
        "images/apply-button.png", capture_dynamic=True, label="apply-button"
    )
    pyautogui.click(apply_coords)

    autofill_coords = find_image(
        "images/autofill-with-resume.png", capture_dynamic=True, label="autofill"
    )
    pyautogui.click(autofill_coords)
    time.sleep(3)

    email_coords = find_image(
        "images/email-address.png", capture_dynamic=True, label="email-address"
    )
    pyautogui.click(email_coords)
    typewrite("smperabathini@gmail.com")

    password_coords = find_image(
        "images/password.png", capture_dynamic=True, label="password"
    )
    pyautogui.click(password_coords)
    typewrite("SGBN#h5?fYmP7XMe*{>Z/")

    pyautogui.scroll(-100)
    verify_password_coords = find_image(
        "images/verify-new-password.png",
        capture_dynamic=True,
        label="verify-new-password",
    )
    pyautogui.click(verify_password_coords)
    typewrite("SGBN#h5?fYmP7XMe*{>Z/")

    create_account_coords = find_image(
        "images/create-account.png", capture_dynamic=True, label="create-account"
    )
    pyautogui.click(create_account_coords)


# Run the automation on test2 URL
auto_apply(test3)
