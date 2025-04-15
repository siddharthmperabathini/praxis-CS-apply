import pyautogui
import cv2
import numpy as np
import subprocess
import time
from PIL import Image
import difflib

# Updated profile data dictionary with Voluntary Disclosures fields
profile_form_data = {
    # Original fields (keep for reference)
    "How Did You Hear About Us?": "Campus Recruiting",
    "Country": "United States of America",
    "First Name": "Alex",
    "Last Name": "Johnson",
    "Address Line 1": "123 Tech Avenue",
    "City": "San Francisco",
    "State": "Rhode Island",
    "Postal Code": "94105",
    "Email": "alex.johnson@example.com",
    "Phone Number": "5551234567",
    # Voluntary Disclosures fields
    "Gender": "Female",
    "ethnicity": "Asian",  # Updated to match the checkbox value we want to select
    "Hispanic or Latino?": "No",
    "Are you a veteran?": "No",
    "I Accept": "Yes",  # For Terms and Conditions checkbox
}


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
    """Find an image on screen using template matching."""
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


# Function to check if a field is a dropdown
def is_dropdown(roi):
    """Determine if a field is likely a dropdown based on visual cues."""
    if roi is None:
        return False

    try:
        # Convert to grayscale
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

        # Check right side of the box for a dropdown arrow
        h, w = gray.shape
        right_section = gray[:, int(0.8 * w) :]

        # Apply edge detection to find the arrow
        edges = cv2.Canny(right_section, 50, 150)

        # If there are enough edge pixels in the right section, might be a dropdown
        return np.sum(edges) > 100
    except:
        return False


# Function to check if a field is a checkbox
def is_checkbox(roi):
    """Determine if a field is likely a checkbox based on visual characteristics."""
    if roi is None:
        return False

    try:
        # Convert to grayscale
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

        # Checkboxes are typically small and square
        h, w = gray.shape

        # Check if dimensions are roughly square
        is_square = 0.8 < w / h < 1.2 and w < 50 and h < 50

        # Apply thresholding to identify the box outline
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

        # Count outline pixels
        outline_pixels = np.sum(thresh > 0)

        # A checkbox typically has a significant outline but is mostly empty inside
        has_outline = outline_pixels > (w * h * 0.1) and outline_pixels < (w * h * 0.5)

        return is_square and has_outline
    except:
        return False


# Function to handle dropdown selection
def select_dropdown_option(field_key, value):
    """Select appropriate option from dropdown based on field key and value."""
    # Wait a moment after clicking
    time.sleep(0.5)

    # For Gender dropdown
    if field_key == "Gender" and value == "Female":
        # Select "Female" (usually second option)
        pyautogui.press("down")  # First option is typically "Select One"
        time.sleep(0.2)
        pyautogui.press("down")  # "Female" is typically the second option
        time.sleep(0.2)
        pyautogui.press("enter")

    # For Hispanic/Latino dropdown
    elif field_key == "Hispanic or Latino?":
        if value == "Yes":
            # Select "Yes" (usually first option after "Select One")
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("enter")
        elif value == "No":
            # Select "No" (usually second option after "Select One")
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("enter")

        time.sleep(1)
        pyautogui.press("tab")

    # For Veteran dropdown
    elif field_key == "Are you a veteran?":
        print("checking veteran")
        if value == "Yes":
            # Select "Yes" (usually first option after "Select One")
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("enter")
        elif value == "No":
            # Select "No" (usually second option after "Select One")
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("down")
            time.sleep(0.2)
            pyautogui.press("enter")

    # Default handling for other dropdowns
    else:
        # Just select the first option after "Select One"
        pyautogui.press("down")
        time.sleep(0.2)
        pyautogui.press("enter")

    time.sleep(0.5)


def main():
    # Configuration
    url = "https://pitneybowes.wd1.myworkdayjobs.com/en-US/pbcareers/job/US-CT-Shelton/Data-Science-Intern--onsite-_R19911/apply/autofillWithResume?utm_source=Simplify&ref=Simplify"

    # HSV range for a more inclusive 'blue' highlight
    lower_blue = np.array([90, 80, 50])
    upper_blue = np.array([140, 255, 255])

    # Bounding-box filters
    MIN_WIDTH = 30
    MIN_HEIGHT = 15
    ASPECT_RATIO_MIN = 0.5  # More permissive for checkboxes
    ASPECT_RATIO_MAX = 10.0

    # Additional constraints: skip very top (10%) and very bottom (10%) of screen
    TOP_CUTOFF_RATIO = 0.10
    BOTTOM_CUTOFF_RATIO = 0.90

    # How many pixels above the box to look for text
    ABOVE_BOX_HEIGHT = 60  # Increased to capture more text

    # ========== Open the URL in Chrome ==========
    print("[STEP] Opening URL in Chrome")
    # open_in_chrome(url)
    time.sleep(2)  # Give the page time to load

    # ========== 0. Initial setup ==========
    print("[STEP] Processing Voluntary Disclosures form")

    # Initial scroll to see form properly
    pyautogui.scroll(-300)
    time.sleep(0.5)

    # ========== 1. Tab to first field ==========
    print("[STEP] Tabbing to first field")
    pyautogui.press("tab")
    time.sleep(0.5)

    # ========== 2. Process form fields ==========
    # Maximum number of tabs to try
    max_tabs = 30
    found_next_button = False

    # Track if we've already handled the ethnicity section
    asian_checkbox_clicked = False
    first_checkbox_found = False

    # Keep track of form state
    processed_gender = False
    processed_hispanic = False
    processed_veteran = False
    processed_terms = False

    for tab_count in range(max_tabs):
        pyautogui.scroll(-2)
        if found_next_button:
            print("[INFO] Found and clicked Next button. Form submission complete.")
            break

        print(f"[STEP] Tab #{tab_count+1}")

        # Take a screenshot
        screenshot = pyautogui.screenshot()
        screenshot_np = np.array(screenshot)
        image_bgr = cv2.cvtColor(screenshot_np, cv2.COLOR_RGB2BGR)

        # Save screenshot for debugging
        # cv2.imwrite(f"voluntary_screenshot_{tab_count}.png", image_bgr)

        # Find the blue-highlighted element
        hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, lower_blue, upper_blue)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        height, width, _ = image_bgr.shape
        detected_element = None

        for contour in contours:
            approx = cv2.approxPolyDP(
                contour, 0.02 * cv2.arcLength(contour, True), True
            )
            x, y, w_box, h_box = cv2.boundingRect(contour)
            aspect_ratio = w_box / float(h_box) if h_box > 0 else 0

            # Apply vertical constraints
            if (
                y < TOP_CUTOFF_RATIO * height
                or (y + h_box) > BOTTOM_CUTOFF_RATIO * height
            ):
                continue

            # Relaxed criteria for checkboxes
            if w_box > 5 and h_box > 5:
                detected_element = (x, y, w_box, h_box)
                break

        if detected_element is None:
            print(f"[WARN] Tab #{tab_count+1}: No blue-highlighted element found.")
            # Just press tab and continue
            pyautogui.press("tab")
            time.sleep(0.7)
            continue

        # Unpack element coordinates
        x, y, w_box, h_box = detected_element

        # Extract the highlighted element
        element_roi = image_bgr[y : y + h_box, x : x + w_box]
        cv2.imwrite(f"element_{tab_count}.png", element_roi)

        # Check if element is a checkbox
        if is_checkbox(element_roi) or (
            w_box < 50 and h_box < 50 and 0.7 < aspect_ratio < 1.3
        ):

            print(f"[INFO] Tab #{tab_count+1}: Checkbox detected")

            # Check if this is the first checkbox and we haven't clicked Asian yet
            if (
                not first_checkbox_found
                and not asian_checkbox_clicked
                and processed_gender
            ):
                print("[INFO] First checkbox detected - Looking for Asian checkbox")
                first_checkbox_found = True

                # Immediately look for and click the Asian checkbox using the template matching function
                try:
                    asian_coords = find_image("images/asian.png")
                    # Click on the Asian checkbox
                    pyautogui.click(asian_coords[0], asian_coords[1])
                    time.sleep(0.5)
                    print("[INFO] Clicked on Asian checkbox")
                    asian_checkbox_clicked = True
                except Exception as e:
                    print(f"[WARN] Error finding or clicking Asian checkbox: {e}")
                    # Continue tabbing - we'll try again on the next checkbox

            # Handle terms checkbox (usually at the end)
            elif (
                processed_hispanic
                and processed_veteran
                and not processed_terms
                and tab_count > 15
            ):
                # This is likely the terms checkbox
                print(f"[INFO] Terms acceptance checkbox detected")
                # Click to accept
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(0.5)
                processed_terms = True

        # Check if element is a dropdown
        elif is_dropdown(element_roi):
            print(f"[INFO] Tab #{tab_count+1}: Dropdown detected")

            # Identify dropdown based on form progress
            if not processed_gender:
                field_key = "Gender"
                value = profile_form_data.get(field_key, "Female")
                print(f"[INFO] Identified dropdown as: '{field_key}'")

                # Click and select
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(0.5)
                select_dropdown_option(field_key, value)

                processed_gender = True

            elif asian_checkbox_clicked and not processed_hispanic:
                field_key = "Hispanic or Latino?"
                value = profile_form_data.get(field_key, "No")
                print(f"[INFO] Identified dropdown as: '{field_key}'")

                # Click and select
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(0.5)
                select_dropdown_option(field_key, value)

                processed_hispanic = True

            elif processed_hispanic and not processed_veteran:
                field_key = "Are you a veteran?"
                value = profile_form_data.get(field_key, "I am not a veteran")
                print(f"[INFO] Identified dropdown as: '{field_key}'")

                # Click and select
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(0.5)
                select_dropdown_option(field_key, value)
                pyautogui.scroll(-10)
                pyautogui.click(find_image("images/Iaccept2.png"))
                pyautogui.click(find_image("images/next.png"))
                print("lebron")
                break

                processed_veteran = True

            else:
                # Unknown dropdown
                print(f"[WARN] Unidentified dropdown. Selecting first option.")
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(0.5)
                pyautogui.press("down")
                time.sleep(0.2)
                pyautogui.press("enter")

        # Check if element might be a button (like "Next")
        elif w_box > 100 and h_box > 30:
            print(f"[INFO] Tab #{tab_count+1}: Potential button detected")

            # Look for "Next" buttons towards the end of the form
            if processed_veteran and tab_count > 20:
                print(f"[INFO] Likely 'Next' button detected")
                # Click the button
                # pyautogui.click(element_center_x, element_center_y)
                time.sleep(1)
                found_next_button = True
                continue

        # Move to next element
        pyautogui.press("tab")
        time.sleep(0.7)

    print("[COMPLETE] Form processing completed")


if __name__ == "__main__":
    main()
