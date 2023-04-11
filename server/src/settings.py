from pydantic import BaseSettings


class Settings(BaseSettings):
    api_key: str
    analytics_api_url: str
    tenant_id: int
    feedback_api_url: str
    vocabtrainer_user: str
    off_topic_filter_task: str = ''


settings = Settings()
