import sys
from os import path

import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import router
from custom_logging import setup_logging

sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

app = FastAPI()
setup_logging()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=58000)
