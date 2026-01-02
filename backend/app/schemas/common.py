"""Common Pydantic schemas for API."""
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    status_code: int


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""
    skip: int = Field(ge=0, default=0)
    limit: int = Field(ge=1, le=100, default=100)
