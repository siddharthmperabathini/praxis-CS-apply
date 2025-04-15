import pyautogui
import cv2
import numpy as np
import subprocess
import time
from PIL import Image
import pytesseract
import difflib
import unicodedata
import re


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


def clean_text(text):
    # Normalize Unicode, then remove non-ASCII characters.
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    return (
        "".join(ch for ch in ascii_text if ch.isalnum() or ch.isspace()).strip().lower()
    )


def safe_type(text):
    """Type text safely avoiding emoji triggering with letter 'e'"""
    # Make sure no modifier keys are pressed
    pyautogui.keyUp("fn")
    pyautogui.keyUp("command")
    pyautogui.keyUp("ctrl")
    pyautogui.keyUp("alt")
    pyautogui.keyUp("shift")
    time.sleep(0.5)

    # Type each character with special handling for 'e'
    for char in text:
        if char.lower() == "e":
            # Special handling for the letter 'e'
            # Try using keyboard key code instead of character
            pyautogui.keyDown("e")
            time.sleep(0.05)
            pyautogui.keyUp("e")
            time.sleep(0.2)
        else:
            # Normal typing for other characters
            pyautogui.write(char)
            time.sleep(0.1)


profile_form_data = {
    # Personal Information
    "fullName": "Alex Johnson",
    "email": "alex.johnson@example.com",
    "phone": "(555) 123-4567",
    "address": {
        "street": "123 Tech Avenue",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94105",
    },
    "linkedin": "https://linkedin.com/in/alexjohnson",
    "portfolio": "https://github.com/alexjohnson",
    # Add specific field for How Did You Hear About Us
    "How Did You Hear About Us?": "Job Portal",
    # Other fields (kept for reference)
    "gender": "non-binary",
    "ethnicity": "asian",
    "veteranStatus": "not-veteran",
    "disabilityStatus": "no",
    "lgbtqIdentification": "yes",
    "eligibleForAffirmativeAction": "yes",
    "legallyAuthorized": "yes",
    "requireSponsorship": "no",
    "over18": "yes",
    "educationLevel": "master",
    "schoolName": "University of California, Berkeley",
    "degree": "Master of Science",
    "fieldOfStudy": "Computer Science",
    "graduationDate": "May 2017",
    "gpa": "3.85/4.0",
    "positionApplyingFor": "Full Stack Developer",
    "howHeardAboutJob": "Job Portal",  # Alternative key
    "previouslyApplied": "no",
    "workedHereBefore": "no",
    "desiredStartDate": "Available to start in 2 weeks",
    "desiredSalary": "$120,000 - $140,000",
    "convictedFelonyMisdemeanor": "no",
    "terminatedResigned": "no",
    "backgroundCheck": "yes",
    "drugTest": "yes",
    "date": "04132025",
}


# ========== 1. Force Chrome to Open the URL ==========
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


# ========== 2. Configuration ==========
url = "https://pitneybowes.wd1.myworkdayjobs.com/en-US/pbcareers/job/US-CT-Shelton/Data-Science-Intern--onsite-_R19911/apply/autofillWithResume?utm_source=Simplify&ref=Simplify"

# HSV range for a more inclusive 'blue' highlight
lower_blue = np.array([90, 80, 50])
upper_blue = np.array([140, 255, 255])

# Bounding-box filters for detected blue outlines:
MIN_WIDTH = 30
MIN_HEIGHT = 15
ASPECT_RATIO_MIN = 1.0
ASPECT_RATIO_MAX = 10.0

# Additional vertical constraints: ignore top 10% and bottom 10% of screen
TOP_CUTOFF_RATIO = 0.10
BOTTOM_CUTOFF_RATIO = 0.90

# How many pixels above the box to look for text
ABOVE_BOX_HEIGHT = 50  # adjust based on your UI


def clean_value_for_typing(value):
    """Prepare a string for safe typing with pyautogui"""
    if not isinstance(value, str):
        if isinstance(value, dict):
            value = ", ".join(
                str(value.get(field, "")).strip()
                for field in ["street", "city", "state", "zip"]
            )
            value = value.strip(", ")
        else:
            value = str(value)

    # Convert to ASCII and remove any problematic characters
    value = value.encode("ascii", errors="ignore").decode("ascii")
    # Remove characters that might trigger keyboard shortcuts
    value = re.sub(r"[^\w\s.,@\-()]", "", value)
    return value


# ========== 3. Main Script Execution ==========
try:
    # Open in Chrome
    print("[STEP] Opening URL in Chrome")
    # open_in_chrome(url)
    # time.sleep(10)  # Wait longer for the page to fully load

    # Initial Setup - Scroll and focus first field
    pyautogui.scroll(-4)
    print("[STEP] Pressing TAB to focus first input field")
    pyautogui.press("tab")
    time.sleep(0.5)  # Wait longer for focus

    print("[STEP] First field: arrowing down twice and selecting option")
    pyautogui.press("down")
    time.sleep(0.5)
    # pyautogui.press("down")
    time.sleep(0.5)
    pyautogui.press("enter")
    time.sleep(0.5)

    print("[STEP] Moving to second field")
    # pyautogui.press("tab")
    time.sleep(1)

    # Process each field
    num_fields = 10  # number of fields to process
    pyautogui.scroll(-4)

    for i in range(num_fields):
        print(f"\n[STEP] Field #{i}: Pressing TAB")
        pyautogui.press("tab")
        time.sleep(0.5)  # Increased wait time

        # Take screenshot and identify the field
        screenshot = pyautogui.screenshot()
        screenshot_np = np.array(screenshot)
        image_bgr = cv2.cvtColor(screenshot_np, cv2.COLOR_RGB2BGR)

        # Convert to HSV and create mask
        hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, lower_blue, upper_blue)

        # Find contours
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

                # Apply vertical constraints
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
                    break  # Use the first valid detected box

        if detected_box is None:
            print(f"[WARN] Field #{i}: No blue-highlighted box found.")
            extracted_text = ""
        else:
            x, y, w_box, h_box = detected_box
            # Draw rectangle for annotation (optional)
            cv2.rectangle(image_bgr, (x, y), (x + w_box, y + h_box), (0, 255, 0), 2)
            # cv2.imwrite(f"field_box_{i}.png", image_bgr)

            # Extract text above the detected box
            text_region_top = max(0, y - ABOVE_BOX_HEIGHT)
            label_roi = image_bgr[text_region_top:y, x : x + w_box]
            # cv2.imwrite(f"label_field_{i}.png", label_roi)

            # Convert for OCR
            label_roi_rgb = cv2.cvtColor(label_roi, cv2.COLOR_BGR2RGB)
            pil_label = Image.fromarray(label_roi_rgb)
            extracted_text = pytesseract.image_to_string(pil_label).strip()
            print(f"[INFO] Field #{i}: Raw extracted text: '{extracted_text}'")

        # Clean extracted text and match to form data
        extracted_text_clean = clean_text(extracted_text)
        print(f"[INFO] Field #{i}: Cleaned extracted text: '{extracted_text_clean}'")

        # Convert the keys in profile_form_data to lowercase for matching
        profile_keys_clean = {clean_text(key): key for key in profile_form_data.keys()}

        close_matches = difflib.get_close_matches(
            extracted_text_clean, profile_keys_clean.keys(), n=1, cutoff=0.4
        )
        if close_matches:
            matched_key = profile_keys_clean[close_matches[0]]
            value_to_type = profile_form_data[matched_key]
            value_to_type = clean_value_for_typing(value_to_type)

            print(
                f"[INFO] Field #{i}: Typing value '{value_to_type}' for key '{matched_key}'"
            )

            # Use our safe typing function
            time.sleep(0.5)  # Short pause before typing
            if extracted_text_clean == "date":
                safe_type(value_to_type)
                print("[INFO] Special handling for 'date' field: Pressing TAB 3 times")
                time.sleep(0.5)
                pyautogui.press("tab", presses=4, interval=0.5)
                pyautogui.click(find_image("images/no-dis.png"))
                pyautogui.click(find_image("images/next.png"))
                time.sleep(1)
                pyautogui.click(find_image("images/submit.png"))

                break

            else:
                safe_type(value_to_type)
        # safe_type(value_to_type)
        else:
            print(
                f"[WARN] Field #{i}: No close match found for '{extracted_text_clean}', skipping."
            )

        time.sleep(0.5)  # Wait before scrolling
        pyautogui.scroll(-2)

    # Save final annotated screenshot
    # cv2.imwrite("final_output_detected_boxes.png", image_bgr)
    print(f"[✅] Completed processing {num_fields} field(s).")

except Exception as e:
    print(f"[ERROR] An error occurred: {str(e)}")
