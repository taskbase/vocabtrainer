from pydantic import BaseSettings


class Settings(BaseSettings):
    api_key: str
    # not used atm. was meant for the filter tasks which were set up on prod
    #prod_api_key: str
    analytics_api_url: str
    tenant_id: str
    feedback_api_url: str


settings = Settings()
