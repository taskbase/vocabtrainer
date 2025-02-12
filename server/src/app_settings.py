from pydantic_settings import BaseSettings
import os

class AppSettings(BaseSettings):
    chatbase_api_key: str
    lap_host: str
    lap_api_host: str
    bucket_name: str
    bucket_file_path: str

settings = AppSettings(
    chatbase_api_key=os.getenv('CHATBASE_API_KEY'),
    lap_host="https://lapi.taskbase.com",
    lap_api_host="https://api.taskbase.com",
    bucket_name="ai-tutor-configs",
    bucket_file_path="config.json"
)
