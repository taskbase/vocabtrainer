from fastapi import APIRouter
from .healthcheck import router as healthcheck_router
from .task import router as task_router
from .mastery import router as mastery_router
from .feedback import router as feedback_router

router = APIRouter()

router.include_router(feedback_router)
router.include_router(healthcheck_router)
router.include_router(task_router)
router.include_router(mastery_router)
