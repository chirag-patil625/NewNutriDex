import cv2
import easyocr
import re
import google.generativeai as genai
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from Authentication.models import OCRResult
import logging
import base64
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class IngredientExtractor:
    """Extracts ingredients from food product images"""
    
    def __init__(self):
        """ Initialize EasyOCR reader """
        self.reader = easyocr.Reader(['en'])
        
        # Initialize Gemini AI
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info("Gemini AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini AI: {str(e)}")
            self.gemini_model = None

    def extract_from_image(self, image_path):
        """Extract raw text from image using OCR"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Error: Unable to load image.")

        results = self.reader.readtext(image)
        extracted_text = "\n".join([res[1] for res in results])
        return extracted_text

    def extract_ingredients_with_gemini(self, ocr_text, image_path=None):
        """Directly ask Gemini to extract ingredients from OCR text and optionally image"""
        if not self.gemini_model:
            logger.warning("Gemini AI not available for ingredient extraction")
            return self.parse_ingredients(ocr_text)  # Fallback to simple parsing
        
        try:
            # Prepare the image if available
            image_parts = []
            if image_path and os.path.isfile(image_path):
                try:
                    with open(image_path, "rb") as img_file:
                        image_data = img_file.read()
                        encoded_image = base64.b64encode(image_data).decode('utf-8')
                        image_parts = [
                            {
                                "mime_type": "image/jpeg",
                                "data": encoded_image
                            }
                        ]
                        logger.info("Successfully encoded image for Gemini")
                except Exception as img_error:
                    logger.error(f"Error encoding image: {str(img_error)}")
            
            prompt = f"""
            You are a food ingredients expert. I have scanned a food product and extracted the following text from it. 
            Please identify and extract ONLY the ingredients list from this text:

            {ocr_text}

            Some important information:
            1. Ingredients lists typically start with "Ingredients:" or similar text
            2. They are usually comma-separated
            3. Ignore nutrition facts, instructions, allergen warnings unless they're part of the ingredients
            4. Return ONLY a clean JSON array of individual ingredients
            5. Split compound ingredients if possible (e.g., "sugar (cane sugar)" should be just "cane sugar")
            6. Remove percentages, parentheses, and other non-ingredient information

            Examples of good responses:
            ["wheat flour", "sugar", "vegetable oil", "salt"]
            ["water", "barley malt", "hops", "yeast"]

            Respond ONLY with a valid JSON array of ingredient strings.
            """
            
            # Get response from Gemini with or without image
            if image_parts:
                response = self.gemini_model.generate_content(
                    [prompt] + image_parts
                )
            else:
                response = self.gemini_model.generate_content(prompt)
                
            gemini_text = response.text.strip()
            
            # Extract JSON array from response
            json_match = re.search(r'\[.*\]', gemini_text, re.DOTALL)
            if json_match:
                try:
                    import json
                    ingredients = json.loads(json_match.group(0))
                    if isinstance(ingredients, list) and len(ingredients) > 0:
                        logger.info(f"Successfully extracted {len(ingredients)} ingredients with Gemini")
                        return ingredients
                    else:
                        logger.warning("Gemini returned an empty ingredients list")
                except json.JSONDecodeError as json_err:
                    logger.warning(f"Could not parse Gemini response as JSON: {gemini_text}")
            else:
                logger.warning(f"No JSON array found in Gemini response: {gemini_text}")
            
            # Fallback to standard parsing if Gemini processing fails
            return self.parse_ingredients(ocr_text)
                
        except Exception as e:
            logger.error(f"Error extracting ingredients with Gemini: {str(e)}")
            return self.parse_ingredients(ocr_text)  # Fallback to simple parsing

    def parse_ingredients(self, text):
        """Traditional rule-based ingredient parsing (fallback method)"""
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

    def extract_text(self, image_path):
        """Main method to extract ingredients from an image"""
        # Use OCR to extract text first
        ocr_text = self.extract_from_image(image_path)
        
        # Go straight to Gemini for ingredient extraction (with the image)
        ingredients = self.extract_ingredients_with_gemini(ocr_text, image_path)
        
        # If no ingredients found or parsing failed, try fallback
        if not ingredients or len(ingredients) < 1:
            logger.warning("No ingredients found with Gemini, using fallback method")
            ingredients = self.parse_ingredients(ocr_text)
        
        return ingredients