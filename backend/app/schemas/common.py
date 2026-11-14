"""Common schemas including pagination and error envelope."""

from typing import Generic, List, Optional, TypeVar, Any
from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination query parameter validation."""

    limit: int = Field(default=20, ge=1, le=100, description="Page limit (1-100)")
    offset: int = Field(default=0, ge=0, description="Page offset (>= 0)")


class PaginatedResponse(BaseModel, Generic[T]):
    """Standardized paginated list envelope."""

    items: List[T]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class ErrorDetail(BaseModel):
    """Structured error payload per ARCHITECTURE.md §5."""

    code: str
    message: str
    details: Optional[Any] = None
    request_id: Optional[str] = None


class ErrorEnvelope(BaseModel):
    """Root error response schema."""

    error: ErrorDetail


class BaseSchema(BaseModel):
    """Base schema configured for ORM compatibility."""

    model_config = ConfigDict(from_attributes=True)
