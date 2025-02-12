import json
import logging
from datetime import datetime, timedelta
from app_settings import settings
from aitutor.models import Configuration
from aitutor.models import ChatConfig
import boto3
from langchain_core.runnables import RunnableConfig

s3_client = boto3.client("s3")
bucket_name = settings.bucket_name
config_key = settings.bucket_file_path

check_interval_seconds = 30
last_modified_time = None
last_check_time = None
config: Configuration = None


def get_config():
    _synchronize_config()
    return config


def _synchronize_config():
    global last_modified_time, config, last_check_time
    if last_check_time is None or last_check_time + timedelta(seconds=check_interval_seconds) < datetime.now():
        last_check_time = datetime.now()
        response = s3_client.head_object(Bucket=bucket_name, Key=config_key)
        new_modified_time = response["LastModified"]
        if last_modified_time is None or new_modified_time > last_modified_time:
            logging.info("Config updated, reloading...")
            last_modified_time = new_modified_time
            response = s3_client.get_object(Bucket=bucket_name, Key=config_key)
            config_content = response["Body"].read().decode("utf-8")
            config_dict = json.loads(config_content)
            config = Configuration(**config_dict)


def chat_config(config: RunnableConfig) -> ChatConfig:
    return config.get("configurable").get("chat_config")


def resolve_runnable_config_param(key: str, config: RunnableConfig) -> any:
    configurable = config.get("configurable")
    if configurable:
        if configurable.get(key):
            return configurable.get(key)
    raise Exception(f"Parameter {key} not specified on runnable config: {config}")
