from fastapi import APIRouter
from .healthcheck import router as healthcheck_router
from .chat import router as chat_router
router = APIRouter()

router.include_router(healthcheck_router)
router.include_router(chat_router)
