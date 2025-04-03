import cv2
import re
import spacy
import logging
import os
from paddleocr import PaddleOCR
from django.utils import timezone
from Authentication.models import NutritionResult

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FoodLabelOCR:
    """Service for OCR processing of food labels"""
    
    # Nutrition patterns dictionary
    NUTRITION_PATTERNS = {
        'calories': r'(\d+\.?\d*)\s*(kcal|calories)(?![^\(\[]*[\)\]])',
        'protein': r'protein\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'fats': r'fat\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'carbohydrates': r'carbohydrate\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'sugar': r'sugar\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'sodium': r'sodium\s*(\d+\.?\d*)\s*(mg|milligrams)(?![^\(\[]*[\)\]])',
        'fiber': r'fiber\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'serving_size': r'serving size\s*(\d+\.?\d*)\s*(g|grams|ml|oz)(?![^\(\[]*[\)\]])',
        'energy_100g': r'energy\s*(\d+\.?\d*)\s*(kcal|calories)(?![^\(\[]*[\)\]])',
        'saturated_fat_100g': r'saturated fat\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'trans_fat_100g': r'trans fat\s*(\d+\.?\d*)\s*(g|grams)(?![^\(\[]*[\)\]])',
        'calcium_100g': r'calcium\s*(\d+\.?\d*)\s*(mg|milligrams)(?![^\(\[]*[\)\]])',
        'iron_100g': r'iron\s*(\d+\.?\d*)\s*(mg|milligrams)(?![^\(\[]*[\)\]])',
        'vitamin_a_100g': r'vitamin a\s*(\d+\.?\d*)\s*(iu|international units)(?![^\(\[]*[\)\]])',
        'vitamin_c_100g': r'vitamin c\s*(\d+\.?\d*)\s*(mg|milligrams)(?![^\(\[]*[\)\]])',
        'cholesterol_100g': r'cholesterol\s*(\d+\.?\d*)\s*(mg|milligrams)(?![^\(\[]*[\)\]])'
    }
    
    def __init__(self, use_gpu=False):
        """Initialize the OCR service"""
        try:
            self.ocr = PaddleOCR(use_angle_cls=True, lang="en", use_gpu=use_gpu)
            logger.info("PaddleOCR initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize PaddleOCR: {str(e)}")
            raise
            
        try:
            self.nlp = spacy.load("en_core_web_sm")
            logger.info("SpaCy model loaded successfully")
        except OSError as e:
            logger.error(f"SpaCy model not found: {str(e)}")
            logger.error("Please install using: python -m spacy download en_core_web_sm")
            raise
    
    def preprocess_image(self, image):
        """Preprocess image for better OCR results"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                     cv2.THRESH_BINARY, 11, 2)
        return thresh
    
    def extract_nutrition_info(self, text):
        """Extract nutritional information using regex patterns"""
        nutrition_data = {}
        text = text.lower()
        
        for nutrient, pattern in self.NUTRITION_PATTERNS.items():
            match = re.search(pattern, text)
            if match:
                try:
                    value = float(match.group(1))
                    nutrition_data[nutrient] = value
                    
                    # Save unit separately for serving_size
                    if nutrient == 'serving_size':
                        unit = match.group(2)
                        if unit in ['grams', 'g']:
                            unit = 'g'
                        elif unit in ['milliliters', 'ml']:
                            unit = 'ml'
                        elif unit in ['ounces', 'oz']:
                            unit = 'oz'
                        nutrition_data['serving_size_unit'] = unit
                except (ValueError, IndexError) as e:
                    logger.warning(f"Error extracting value for {nutrient}: {str(e)}")
        
        return nutrition_data
    
    def process_image(self, image_path, save_to_db=True):
        """
        Process an image and extract nutritional information
        
        Args:
            image_path: Path to the image file
            save_to_db: Whether to save results to database
            
        Returns:
            tuple: (nutrition_result_object or dict, extracted_text)
        """
        try:
            # Read the image
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Failed to read image from {image_path}")
                return None, "Failed to read image"
                
            # Preprocess the image
            processed_image = self.preprocess_image(image)
            
            # Run OCR
            result = self.ocr.ocr(processed_image)
            
            if result and isinstance(result[0], list):
                text = " ".join([line[1][0] for line in result[0] if line])
                logger.info(f"Extracted {len(text)} characters of text")
                
                # Extract nutrition information
                nutrition_info = self.extract_nutrition_info(text)
                
                if not nutrition_info:
                    logger.warning("No nutrition information found in the text")
                else:
                    logger.info(f"Found {len(nutrition_info)} nutrition data points")
                
                # Save to database if requested
                if save_to_db:
                    db_result = self.save_to_database(image_path, text, nutrition_info)
                    return db_result, text
                
                return nutrition_info, text
            
            logger.warning("No text detected in the image")
            return None, "No text detected"
                
        except Exception as e:
            error_msg = f"Error processing image: {str(e)}"
            logger.error(error_msg)
            return None, error_msg
    
    def save_to_database(self, image_path, text, nutrition_info):
        """Save extracted nutrition information to database"""
        try:
            # Create a new NutritionResult object
            result = NutritionResult(
                image_path=image_path,
                image_name=os.path.basename(image_path),
                processed_at=timezone.now()
            )
            
            # Set nutrition values based on extracted info
            for field, value in nutrition_info.items():
                if hasattr(result, field):
                    setattr(result, field, value)
            
            # Save to database
            result.save()
            logger.info(f"Saved nutrition result to database with ID: {result.id}")
            return result
            
        except Exception as e:
            logger.error(f"Error saving to database: {str(e)}")
            return None


# Example usage function
def run_ocr_on_image(image_path, use_gpu=False, save_to_db=True):
    """
    Run OCR on an image file and return the results
    
    Args:
        image_path: Path to the image file
        use_gpu: Whether to use GPU for OCR
        save_to_db: Whether to save results to database
        
    Returns:
        tuple: (nutrition_info, extracted_text)
    """
    ocr_service = FoodLabelOCR(use_gpu=use_gpu)
    return ocr_service.process_image(image_path, save_to_db=save_to_db)