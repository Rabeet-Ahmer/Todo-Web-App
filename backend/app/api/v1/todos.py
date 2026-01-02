"""Todo CRUD API endpoints."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.api.v1.deps import get_current_user
from app.db.session import get_session
from app.models.todo import Todo
from app.models.user import User
from app.schemas.common import PaginationParams
from app.schemas.todo import TodoCreate, TodoResponse, TodoUpdate
from app.services.todo_service import todo_service


# Create todo router
router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=list[TodoResponse])
async def get_todos(
    current_user: Annotated[User, Depends(get_current_user)],
    pagination: Annotated[PaginationParams, Depends()],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> list[TodoResponse]:
    """
    Get all todos for authenticated user.

    Returns paginated list of todos belonging to the authenticated user,
    sorted by most recently updated.
    """
    todos = await todo_service.get_todos_for_user(
        user_id=current_user.id,
        session=session,
        skip=pagination.skip,
        limit=pagination.limit
    )

    return [TodoResponse.model_validate(todo) for todo in todos]


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_create: TodoCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> TodoResponse:
    """
    Create a new todo for authenticated user.

    Creates a todo with the provided title and optional description,
    associates it with the authenticated user.
    """
    todo = await todo_service.create_todo_for_user(
        todo_create=todo_create,
        user_id=current_user.id,
        session=session
    )

    return TodoResponse.model_validate(todo)


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> TodoResponse:
    """
    Get a specific todo by ID.

    Returns the todo if it exists and belongs to the authenticated user.
    Otherwise returns 404.
    """
    todo = await todo_service.get_todo_by_id(
        todo_id=todo_id,
        user_id=current_user.id,
        session=session
    )

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse.model_validate(todo)


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> TodoResponse:
    """
    Update a todo.

    Updates the todo if it exists and belongs to the authenticated user.
    Allows partial updates (any field can be optional).
    """
    todo = await todo_service.update_todo_for_user(
        todo_id=todo_id,
        todo_update=todo_update,
        user_id=current_user.id,
        session=session
    )

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse.model_validate(todo)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> None:
    """
    Delete a todo.

    Deletes the todo if it exists and belongs to the authenticated user.
    Returns 204 on successful deletion.
    """
    success = await todo_service.delete_todo_for_user(
        todo_id=todo_id,
        user_id=current_user.id,
        session=session
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )


@router.patch("/{todo_id}/complete", response_model=TodoResponse)
async def toggle_todo_completion(
    todo_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> TodoResponse:
    """
    Toggle todo completion status.

    Flips the is_completed field to its opposite value.
    """
    todo = await todo_service.toggle_todo_completion(
        todo_id=todo_id,
        user_id=current_user.id,
        session=session
    )

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return TodoResponse.model_validate(todo)
