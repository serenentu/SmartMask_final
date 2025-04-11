from flask import Flask, request, jsonify
import cv2
import numpy as np
from collections import Counter
from matplotlib import pyplot as plt

app = Flask(__name__)

# ====================== IMAGE PREPROCESSING ======================
def preprocess_image(image):
    """
    Preprocess the input image by enhancing saturation and brightness,
    and applying white balance correction.
    """
    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # BACKGROUND REMOVAL 
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, bg_mask = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    fg_mask = cv2.bitwise_not(bg_mask)

    # Boost Saturation & Brightness
    h, s, v = cv2.split(hsv)
    s = cv2.add(s, 20)
    v = cv2.add(v, 20)
    hsv_boosted = cv2.merge([h, s, v])
    image_boosted = cv2.cvtColor(hsv_boosted, cv2.COLOR_HSV2BGR)

    # White balance correction
    lab = cv2.cvtColor(image_boosted, cv2.COLOR_BGR2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    image_corrected = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    return image_corrected

# Function to split image into sections and detect majority color
def split_and_detect(image, sections=5):
    height, width, _ = image.shape
    section_height = height // sections
    horizontal_sections = [image[i * section_height:(i + 1) * section_height, :] for i in range(sections)]
    detected_colors_horizontal = []

    def detect_color(image_section, hsv_section):
        # Color ranges for HSV filtering
        color_ranges = {
            "red1": ([0, 30, 80], [5, 255, 255]),
            "red2": ([170, 30, 80], [180, 255, 255]),
            "magenta": ([90, 30, 70], [100, 255, 255]),
            "purple1": ([110, 30, 70], [145, 255, 255]),
            "purple2": ([146, 30, 70], [165, 255, 255]),
            "blue": ([105, 50, 70], [115, 255, 255]),
            "green1": ([55, 40, 70], [74, 255, 255]),
            "green2": ([75, 40, 70], [95, 255, 255]),
            "yellow1": ([45, 30, 70], [54, 255, 255]),
            "yellow2": ([25, 30, 70], [44, 255, 255]),
        }

        # Create masks for each color
        masks = {}
        for color, (lower, upper) in color_ranges.items():
            masks[color] = cv2.inRange(hsv_section, np.array(lower, np.uint8), np.array(upper, np.uint8))

        # Combine similar color ranges
        masks["red"] = cv2.bitwise_or(masks["red1"], masks["red2"])
        masks["yellow"] = cv2.bitwise_or(masks["yellow1"], masks["yellow2"])
        masks["green"] = cv2.bitwise_or(masks["green1"], masks["green2"])
        masks["purple"] = cv2.bitwise_or(masks["purple1"], masks["purple2"])

        # Remove intermediate masks
        for key in ["red1", "red2", "green1", "green2", "yellow1", "yellow2", "purple1", "purple2"]:
            masks.pop(key)

        kernel = np.ones((3, 3), np.uint8)
        for color in masks:
            masks[color] = cv2.morphologyEx(masks[color], cv2.MORPH_OPEN, kernel)
            masks[color] = cv2.morphologyEx(masks[color], cv2.MORPH_CLOSE, kernel)
        
        # Apply masks to the original image
        segmented_images = {
            color: cv2.bitwise_and(image_section, image_section, mask=mask)
            for color, mask in masks.items()
        }

        # Count the number of pixels for each color
        color_counts = {color: np.count_nonzero(mask) for color, mask in masks.items()}
        MIN_PIXELS = 20
        color_counts = {color: count for color, count in color_counts.items() if count > MIN_PIXELS}

        # Find the dominant color
        dominant_color = max(color_counts, key=color_counts.get) if color_counts else None
        return dominant_color

    for sec in horizontal_sections:
        hsv_sec = cv2.cvtColor(sec, cv2.COLOR_BGR2HSV)
        dominant_color = detect_color(sec, hsv_sec)
        if dominant_color:
            detected_colors_horizontal.append(dominant_color)

    majority_color_horizontal = Counter(detected_colors_horizontal).most_common(1)[0][0] if detected_colors_horizontal else None
    return majority_color_horizontal

# ====================== MAIN WORKFLOW ======================
# Color to pH mapping
color_pH_mapping = {
    "red": 2.0,
    "magenta": 3.0,
    "purple": 6.0,
    "blue": 8.0,
    "green": 9.0,
    "yellow": 12.0
}

health_findings = {
    2.0: "Low pH detected (Acidic), could indicate respiratory acidosis.",
    3.0: "Acidic pH, possibly indicating respiratory distress.",
    6.0: "Slightly acidic pH, may indicate metabolic issues.",
    8.0: "Neutral pH detected, generally normal.",
    9.0: "Alkaline pH, could indicate metabolic alkalosis.",
    12.0: "Strongly alkaline, could suggest serious imbalances."
}

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({"error": "Invalid image format"}), 400

    image_corrected = preprocess_image(image)
    detected_colors = split_and_detect(image_corrected)

    detected_pH = color_pH_mapping.get(detected_colors, "Unknown")
    health_message = health_findings.get(detected_pH, "No specific health issues identified.")

    return jsonify({
        "detected_pH": detected_pH,
        "health_message": health_message
    })

if __name__ == "__main__":
    app.run(host="192.168.1.130", port=5000, debug=True)
