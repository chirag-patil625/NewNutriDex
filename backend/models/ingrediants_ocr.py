import cv2
import easyocr
import re
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from Authentication.models import OCRResult

class IngredientExtractor:
    def __init__(self):
        """ Initialize EasyOCR reader """
        self.reader = easyocr.Reader(['en'])

    def extract_text(self, image_path):
        """ Extracts text from an image and processes it for ingredients. """
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Error: Unable to load image.")

        results = self.reader.readtext(image)
        extracted_text = "\n".join([res[1] for res in results])
        return self.extract_ingredients(extracted_text)

    def extract_ingredients(self, text):
        """ Extracts only ingredient-related text. """
        lines = text.split("\n")
        extracted_lines = []
        capturing = False

        for line in lines:
            normalized_line = line.strip().lower()

            if "ingredients" in normalized_line:
                capturing = True

            stop_keywords = ["allergen information", "contains", "nutrition", "calories", "may contain", 
                             "advice", "no artificial", "for allergens", "flavouring substances"]
            if any(keyword in normalized_line for keyword in stop_keywords):
                break

            if capturing:
                extracted_lines.append(line)

        cleaned_text = " ".join(extracted_lines)
        return self.format_ingredients(cleaned_text)

    def format_ingredients(self, text):
        """ Cleans and structures ingredient text into a list. """
        text = re.sub(r'ingredients[:\s]*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'\s*[;_|.)(%":/]\s', ', ', text)
        text = re.sub(r'\(.*?\)', '', text)
        text = re.sub(r'\b\d+\b', '', text)  # Remove standalone numbers
        text = re.sub(r'\b\w*\d\w*\b', '', text)  # Remove words with numbers
        ingredients = [item.strip() for item in text.split(',') if item.strip()]
        return ingredients