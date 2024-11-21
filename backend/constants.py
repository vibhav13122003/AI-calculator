from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Server and environment configuration
SERVER_URL = 'localhost'
PORT = '8900'
ENV = 'prod'

# API Key fetched from .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Ensure this key is in your .env file
