from typing import Optional, Sequence
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate, TodoStats
from app.core.exceptions import TodoNotFoundException, TodoAccessDeniedException

class TodoService:
    @staticmethod
    async def create_todo(session: AsyncSession, todo_in: TodoCreate, user_id: str) -> Todo:
        db_obj = Todo.model_validate(todo_in, update={"user_id": user_id})
        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    @staticmethod
    async def get_todos(session: AsyncSession, user_id: str) -> Sequence[Todo]:
        statement = select(Todo).where(Todo.user_id == user_id).order_by(Todo.created_at.desc())
        result = await session.exec(statement)
        return result.all()

    @staticmethod
    async def update_todo(session: AsyncSession, todo_id: int, todo_in: TodoUpdate, user_id: str) -> Optional[Todo]:
        statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        result = await session.exec(statement)
        db_obj = result.one_or_none()
        if not db_obj:
            # Raise exception if todo not found or user doesn't have access
            raise TodoNotFoundException(todo_id)

        update_data = todo_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_obj, key, value)

        session.add(db_obj)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    @staticmethod
    async def delete_todo(session: AsyncSession, todo_id: int, user_id: str) -> bool:
        statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        result = await session.exec(statement)
        db_obj = result.one_or_none()
        if not db_obj:
            # Raise exception if todo not found or user doesn't have access
            raise TodoNotFoundException(todo_id)
        await session.delete(db_obj)
        await session.commit()
        return True

    @staticmethod
    async def get_stats(session: AsyncSession, user_id: str) -> TodoStats:
        """Get todo statistics for the dashboard."""
        # Count total todos
        total_stmt = select(func.count()).select_from(Todo).where(Todo.user_id == user_id)
        total_result = await session.exec(total_stmt)
        total = total_result.one() or 0

        # Count completed todos
        completed_stmt = select(func.count()).select_from(Todo).where(
            Todo.user_id == user_id,
            Todo.completed == True
        )
        completed_result = await session.exec(completed_stmt)
        completed = completed_result.one() or 0

        # Pending is total - completed
        pending = total - completed

        return TodoStats(total=total, pending=pending, completed=completed)
