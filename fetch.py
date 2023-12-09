from selenium import webdriver
from PIL import Image
import time
import json
from selenium.webdriver.chrome.options import Options

# Read 
with open('./training_data/result.sample.json', 'r') as file:
    result = json.load(file)

# Read and execute JavaScript from a file
with open('script.js', 'r') as file:
    js_code = file.read()

# Initialize the WebDriver (example using Chrome)
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--start-maximized')
driver = webdriver.Chrome(chrome_options)

def take_screenshot(url, id):

    driver.set_window_size(1920, 1080) 
    # Open the URL
    driver.get(url)

    # Wait for the page to load completely
    time.sleep(5)
    height = driver.execute_script('return document.documentElement.scrollHeight')
    width  = driver.execute_script('return document.documentElement.scrollWidth')
    driver.set_window_size(width, height) 
    # Take and save the screenshot
    screenshot_path=f'./training_data/images/{id}.png'
    driver.save_screenshot(screenshot_path)
    image = Image.open(screenshot_path)
    width, height = image.size

    driver.execute_script(js_code)

    # Take screenshot after JavaScript execution
    driver.save_screenshot(f'./training_data/results/{id}.png')

    dataset = driver.execute_script("return window.dataset;")

    new_image_object = {
      "width": width,
      "height": height,
      "id": id,
      "file_name": screenshot_path
    }
    result['images'].append(new_image_object)
    index = len(result['annotations'])
    if dataset == None:
        print(f'No dataset found for {url}')
        return
    for data in dataset:
        category_id = next((item['id'] for item in result['categories'] if item['name'] == data['label_name']), None)
        new_obj = {
            "id": index,
            "image_id": id,
            "category_id": category_id,
            "segmentation": [],
            "bbox": [
                data['bbox_x'],
                data['bbox_y'],
                data['bbox_width'],
                data['bbox_height']
            ],
            "ignore": 0,
            "iscrowd": 0,
            "area": (data['bbox_height']*data['bbox_width'])
        }
        index=index+1
        result['annotations'].append(new_obj)
    print(result)
    time.sleep(1)

# Example usage
urls = [
    "https://example.com/",
    "https://atomicdesign.bradfrost.com/",
    "https://www.fontpair.co/",
    "https://devchallenges.io/dashboard",
    # "https://www.udemy.com/course/web-design-secrets/",
    "https://wave.webaim.org/",
    "https://www.tshirtdesigns.com/mockups/",
    "https://www.funkify.org/"
]
for index, url in enumerate(urls):
    take_screenshot(url, index)
# Close the browser
driver.quit()
with open('./training_data/result.json', 'w') as file:
    json.dump(result, file, indent=4)