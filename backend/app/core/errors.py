"""Centralized error handling and envelope formatting for TerraTwin."""

from typing import Any, Optional
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.core.logging import logger


class AppException(Exception):
    """Base application exception returning structured error envelope."""

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_ERROR",
        message: str = "An unexpected error occurred.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


class NotFoundException(AppException):
    """Resource not found (HTTP 404)."""

    def __init__(self, message: str = "Resource not found.", details: Optional[Any] = None) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="RESOURCE_NOT_FOUND",
            message=message,
            details=details,
        )


class NotImplementedException(AppException):
    """Scaffolded or unbuilt operation (HTTP 501)."""

    def __init__(
        self,
        code: str = "ANALYSIS_NOT_IMPLEMENTED",
        message: str = "This analysis module is scaffolded but has not been implemented yet.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            code=code,
            message=message,
            details=details,
        )


def format_error_response(
    code: str,
    message: str,
    details: Optional[Any] = None,
    request_id: Optional[str] = None,
) -> dict:
    """Standardized error envelope per ARCHITECTURE.md §5."""
    return {
        "error": {
            "code": code,
            "message": message,
            "details": details,
            "request_id": request_id,
        }
    }


def register_error_handlers(app: FastAPI) -> None:
    """Register centralized exception handlers on the FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        logger.warning(f"AppException: [{exc.code}] {exc.message} (status={exc.status_code})")
        return JSONResponse(
            status_code=exc.status_code,
            content=format_error_response(
                code=exc.code,
                message=exc.message,
                details=exc.details,
            ),
        )

    @app.exception_handler(NotImplementedError)
    async def not_implemented_standard_handler(request: Request, exc: NotImplementedError) -> JSONResponse:
        logger.info(f"NotImplementedError on {request.url.path}: {str(exc)}")
        message = str(exc) if str(exc) else "This feature is scaffolded but not yet implemented."
        return JSONResponse(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            content=format_error_response(
                code="ANALYSIS_NOT_IMPLEMENTED",
                message=message,
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        logger.info(f"Validation error on {request.url.path}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=format_error_response(
                code="VALIDATION_ERROR",
                message="Request input validation failed.",
                details=exc.errors(),
            ),
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        code = "HTTP_ERROR"
        if exc.status_code == status.HTTP_404_NOT_FOUND:
            code = "RESOURCE_NOT_FOUND"
        elif exc.status_code == status.HTTP_400_BAD_REQUEST:
            code = "BAD_REQUEST"

        return JSONResponse(
            status_code=exc.status_code,
            content=format_error_response(
                code=code,
                message=str(exc.detail),
            ),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        # Never leak stack traces or internal paths to clients (SECURITY.md §6)
        logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=format_error_response(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected server error occurred.",
            ),
        )
