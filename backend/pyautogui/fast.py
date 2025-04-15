import pyautogui
import time
import webbrowser

# Open Google
webbrowser.open("https://www.google.com")

# Give browser time to open
time.sleep(3)

# Click on the search bar (adjust coordinates as needed)
pyautogui.click(396, 101)  # You may need to update this based on your screen

# Type the URL instantly
url = "https://workday.wd5.myworkdayjobs.com/en-US/Workday/job/United-Kingdom-London/Director-and-Head-of-EMEA-Sales-Enablement_JR-0095933?source=Careers_Website"
pyautogui.write(url, interval=0)

# Press Enter
pyautogui.press("enter")
