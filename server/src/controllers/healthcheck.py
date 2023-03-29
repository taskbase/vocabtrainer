from fastapi import APIRouter

router = APIRouter()


@router.get("/api/healthcheck")
def healthcheck():
    return {"status": "ok"}
