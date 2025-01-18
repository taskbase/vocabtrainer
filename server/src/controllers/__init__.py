from fastapi import APIRouter
from .healthcheck import router as healthcheck_router
from .chatbase import router as chatbase_router

router = APIRouter()

router.include_router(healthcheck_router)
router.include_router(chatbase_router)
