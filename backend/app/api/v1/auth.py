from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

class UserMeResponse(BaseModel):
    id: str
    email: str
    name: str | None

@router.get("/me", response_model=UserMeResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Return current authenticated user profile.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }
