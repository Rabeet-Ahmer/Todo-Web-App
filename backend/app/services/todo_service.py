"""Todo business logic layer."""
from typing import Optional

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


class TodoService:
    """Service for Todo CRUD operations."""

    async def get_todos_for_user(
        self,
        user_id: int,
        session: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> list[Todo]:
        """
        Get all todos for a specific user with pagination.

        Args:
            user_id: ID of the authenticated user
            session: Async database session
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return

        Returns:
            List of todos belonging to the user
        """
        statement = (
            select(Todo)
            .where(Todo.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .order_by(Todo.updated_at.desc())
        )
        results = await session.exec(statement)
        return results.all()

    async def create_todo_for_user(
        self,
        todo_create: TodoCreate,
        user_id: int,
        session: AsyncSession
    ) -> Todo:
        """
        Create a new todo for user.

        Args:
            todo_create: Todo creation data
            user_id: ID of the authenticated user
            session: Async database session

        Returns:
            Created todo with generated ID and timestamps
        """
        todo = Todo.model_validate(todo_create)
        todo.user_id = user_id
        session.add(todo)
        await session.commit()
        await session.refresh(todo)
        return todo

    async def get_todo_by_id(
        self,
        todo_id: int,
        user_id: int,
        session: AsyncSession
    ) -> Optional[Todo]:
        """
        Get a specific todo by ID (must belong to user).

        Args:
            todo_id: ID of the todo
            user_id: ID of the authenticated user
            session: Async database session

        Returns:
            Todo if found and belongs to user, None otherwise
        """
        statement = select(Todo).where(
            Todo.id == todo_id,
            Todo.user_id == user_id  # Security: User owns this todo
        )
        results = await session.exec(statement)
        return results.one_or_none()

    async def update_todo_for_user(
        self,
        todo_id: int,
        todo_update: TodoUpdate,
        user_id: int,
        session: AsyncSession
    ) -> Optional[Todo]:
        """
        Update a todo (must belong to user).

        Args:
            todo_id: ID of the todo
            todo_update: Partial update data
            user_id: ID of the authenticated user
            session: Async database session

        Returns:
            Updated todo if found and belongs to user, None otherwise
        """
        todo = await self.get_todo_by_id(todo_id, user_id, session)

        if not todo:
            return None

        # Update fields using Pydantic v2 model_dump()
        todo_data = todo_update.model_dump(exclude_unset=True)
        for field, value in todo_data.items():
            setattr(todo, field, value)

        await session.commit()
        await session.refresh(todo)
        return todo

    async def delete_todo_for_user(
        self,
        todo_id: int,
        user_id: int,
        session: AsyncSession
    ) -> bool:
        """
        Delete a todo (must belong to user).

        Args:
            todo_id: ID of the todo
            user_id: ID of the authenticated user
            session: Async database session

        Returns:
            True if deleted, False if not found
        """
        todo = await self.get_todo_by_id(todo_id, user_id, session)

        if not todo:
            return False

        await session.delete(todo)
        await session.commit()
        return True

    async def toggle_todo_completion(
        self,
        todo_id: int,
        user_id: int,
        session: AsyncSession
    ) -> Optional[Todo]:
        """
        Toggle todo completion status.

        Args:
            todo_id: ID of the todo
            user_id: ID of the authenticated user
            session: Async database session

        Returns:
            Updated todo if found and belongs to user, None otherwise
        """
        todo = await self.get_todo_by_id(todo_id, user_id, session)

        if not todo:
            return None

        todo.is_completed = not todo.is_completed
        await session.commit()
        await session.refresh(todo)
        return todo


# Create singleton instance
todo_service = TodoService()
