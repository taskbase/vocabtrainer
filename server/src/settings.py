from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    chatbase_api_key: str

settings = Settings()
