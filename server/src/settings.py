from pydantic import BaseSettings


class Settings(BaseSettings):
    api_key = "6kiXbCB5Q-qDEnJfKZdL95tjJcg"
    analytics_api_url = "http://localhost:10000"
    tenant_id = "99"
    feedback_api_url = "http://localhost:60050"


settings = Settings()
