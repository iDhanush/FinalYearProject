import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from PIL import Image
# Create the certificates directory if it doesn't exist
os.makedirs("certificates", exist_ok=True)

chrome_options = Options()
chrome_options.add_argument("--start-maximized")  # Start maximized
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--disable-infobars")
chrome_options.add_argument("--disable-extensions")

# Set up WebDriver
service = Service()  # Replace with your chromedriver path if needed
driver = webdriver.Chrome(service=service, options=chrome_options)


def html_parser(real_percentage, fake_percentage, file_hash, issued_for, collection_id, date):
    return f"""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UnMask Certificate</title>

    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
      :root {{
        --primary: #7879F1;
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }}

      body {{
        font-family: "Poppins", sans-serif;
        padding: 0;
        margin: 0;
        background-color: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }}

      .certi-wrapper {{
        width: 80%;
        max-width: 90%;
        margin: 0px;
      }}

      .certificate {{
        width: 100%;
        height:100%;
        background-color: #000;
        box-shadow: var(--shadow);
        display: flex;
        overflow: hidden;
        border-radius: 10px;
      }}

      .left-bar {{
        min-width: 80px;
        background: var(--primary);
      }}

      .right-side {{
        flex: 1;
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }}

      .certi-head {{
        font-size: 36px;
        font-weight: 600;
        color: var(--primary);
        margin: 0;
      }}

      .certi-head span {{
        color: #fff;
      }}

      .divider {{
        width: 100%;
        height: 2px;
        background-color: #ccd9fb91;
      }}

      .certi-flex {{
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 30px;
        margin-top: 20px;
        align-items: center;
      }}

      .certi-flex-left {{
        display: flex;
        flex-direction: column;
        gap: 25px;
        color: #fff;
        width: 60%;
      }}

      .certi-grp {{
        display: flex;
        flex-direction: column;
        gap: 8px;
      }}

      .grp-title {{
        font-weight: 300;
        font-size: 14px;
        color: #aaa;
      }}

      .grp-name {{
        font-weight: 500;
        font-size: 20px;
      }}

      .certi-id {{
        font-size: 16px;
        word-break: break-all;
      }}

      .certi-flex-right {{
        display: flex;
        color: #fff;
        flex-direction: column;
        align-items: flex-end;
        gap: 15px;
        font-weight: 600;
      }}

      .img-container {{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;
      }}

      .cert-img {{
        max-width: 60%;
        height: auto;
      }}

      .prediction {{
        color: #007bff;
        display: flex;
        flex-direction: column;
        gap: 25px;
      }}

      .content {{
        display: flex;
        align-items: center;
        font-size: 28px;
        font-weight: 500;
      }}

      .fake {{
        color: #fd3992;
      }}

      .qr-sec {{
        display: flex;
        color: #fff;
        font-size: 14px;
        align-items: flex-end;
        gap: 15px;
        margin-top: 30px;
      }}

      .verify {{
        color: #aaa;
      }}
    </style>
  </head>
  <body>
    <div class="certi-wrapper">
      <div class="certificate">
        <div class="left-bar"></div>
        <div class="right-side">
          <h1 class="certi-head">Un<span>Mask</span></h1>
          <div class="divider"></div>

          <div class="img-container">
            <img
              src="https://i.ibb.co/MCn5NHL/head.png"
              alt="Authentication Result"
              class="cert-img"
            />
            <div class="prediction">
              <div class="content">
                <div class="real">Real: {real_percentage}%</div>
              </div>
              <div class="content">
                <div class="fake">Fake: {fake_percentage}%</div>
              </div>
            </div>
          </div>

          <div class="certi-flex">
            <div class="certi-flex-left">
              <div class="certi-grp">
                <div class="grp-title">Issued for</div>
                <div class="grp-name">{issued_for}</div>
                <div class="divider"></div>
              </div>
              <div class="certi-grp">
                <div class="grp-title">File Hash</div>
                <div class="grp-name certi-id">#{file_hash}</div>
                <div class="divider"></div>
              </div>
              <div class="certi-grp">
                <div class="grp-title">Collection ID & Token ID</div>
                <div class="grp-name certi-id">{collection_id}</div>
                <div class="divider"></div>
              </div>
            </div>
            <div class="certi-flex-right">
              <div class="certi-date">{date}</div>
              <img
                src="https://i.ibb.co/47CcZvw/Medallionss.png"
                width="150"
                alt="Medallion"
              />
            </div>
          </div>

          <div class="qr-sec">
            <img
              src="https://i.ibb.co/7jQhnvM/qr-code-xxl.png"
              width="70"
              alt="QR Code"
            />
            <div class="verify">Verified by unmask.com</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
"""


def html_to_image(html_string, uid):
    # Define file paths
    html_file = os.path.abspath(os.path.join(os.getcwd(), "temp_certificate.html"))
    screenshot_path = os.path.abspath(os.path.join(os.getcwd(), "certificates", uid))

    # Write HTML to file
    with open(html_file, "w", encoding="utf-8") as file:
        file.write(html_string)

    # Navigate to the HTML file
    driver.get(f"file:///{html_file}")

    # Wait for page to fully load (wait for body)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(("tag name", "body"))
    )

    # Take full screenshot
    driver.save_screenshot(screenshot_path)

    # Process the image to crop it


    img = Image.open(screenshot_path)

    # Get original image dimensions
    width, height = img.size

    # Define how many pixels to crop from each side
    left_crop = 300  # pixels to remove from left
    right_crop = 220  # pixels to remove from right

    # Define the crop boundaries
    left = left_crop
    top = 0
    right = width - right_crop
    bottom = height

    # Crop the image
    img = img.crop((left, top, right, bottom))

    # Save or display the cropped image
    img.save(screenshot_path)
    return screenshot_path


def create_certificate(real_percentage, fake_percentage, file_hash, issued_for, collection_id, date, certificate_uid):
    certificate_html = html_parser(real_percentage, fake_percentage, file_hash, issued_for, collection_id, date)
    screenshot_path = html_to_image(certificate_html, certificate_uid)
    return screenshot_path

