import logging

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, Response, status
from google.api_core.exceptions import InvalidArgument, PermissionDenied, ResourceExhausted
from pydantic import BaseModel
from sqlalchemy.orm import Session, selectinload

from .db import get_db
from .models import Category, Course, Module
from .prompts import SYSTEM_PROMPT
from .schemas import CourseCreate, CourseOut, CourseUpdate
from .settings import GEMINI_API_KEY, GEMINI_MODEL

router = APIRouter()
logger = logging.getLogger(__name__)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    GEMINI_MODEL,
    system_instruction=SYSTEM_PROMPT
)

class ChatRequest(BaseModel):
    message: str


def _course_to_out(course: Course) -> CourseOut:
    return CourseOut(
        id=course.id,
        title=course.title,
        description=course.description,
        duration_text=course.duration_text,
        category=course.category.name,
        price=course.price,
        rating=course.rating,
        modules=[
            {
                "id": module.id,
                "title": module.title,
                "content": module.content,
                "position": module.position,
                "created_at": module.created_at,
                "updated_at": module.updated_at,
            }
            for module in sorted(course.modules, key=lambda item: item.position)
        ],
        created_at=course.created_at,
        updated_at=course.updated_at,
    )


def _get_or_create_category(db: Session, category_name: str) -> Category:
    category = db.query(Category).filter(Category.name == category_name).first()
    if category:
        return category

    category = Category(name=category_name)
    db.add(category)
    db.flush()
    return category


def _get_course_or_404(db: Session, course_id: int) -> Course:
    course = (
        db.query(Course)
        .options(selectinload(Course.modules), selectinload(Course.category))
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado.")
    return course


def _commit_or_500(db: Session) -> None:
    try:
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Database commit failed")
        raise HTTPException(status_code=500, detail="Erro ao salvar no banco de dados.")

@router.get("/")
def read_root():
    return {"status": "API Online"}

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY não configurada. Defina no arquivo .env."
            )

        response = model.generate_content(request.message)
        return {"response": response.text}

    except ResourceExhausted:
        raise HTTPException(
            status_code=429,
            detail="Cota da API excedida."
        )
    except (InvalidArgument, PermissionDenied):
        raise HTTPException(
            status_code=401,
            detail="Erro de Autenticação na API Gemini. Verifique sua chave de API."
        )
    except Exception:
        logger.exception("Unexpected error in chat_endpoint")
        raise HTTPException(
            status_code=500,
            detail="Erro interno no servidor."
        )


@router.get("/courses", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    courses = (
        db.query(Course)
        .options(selectinload(Course.modules), selectinload(Course.category))
        .order_by(Course.id.asc())
        .all()
    )
    return [_course_to_out(course) for course in courses]


@router.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = _get_course_or_404(db, course_id)
    return _course_to_out(course)


@router.post("/courses", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    category = _get_or_create_category(db, payload.category)

    course = Course(
        title=payload.title,
        description=payload.description,
        duration_text=payload.duration_text,
        price=payload.price,
        rating=payload.rating,
        category_id=category.id,
    )
    db.add(course)
    db.flush()

    for index, module in enumerate(payload.modules, start=1):
        db.add(
            Module(
                course_id=course.id,
                title=module.title,
                content=module.content,
                position=index,
            )
        )

    _commit_or_500(db)
    db.refresh(course)
    return _course_to_out(_get_course_or_404(db, course.id))


@router.put("/courses/{course_id}", response_model=CourseOut)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = _get_course_or_404(db, course_id)

    if payload.title is not None:
        course.title = payload.title
    if payload.description is not None:
        course.description = payload.description
    if payload.duration_text is not None:
        course.duration_text = payload.duration_text
    if payload.price is not None:
        course.price = payload.price
    if payload.rating is not None:
        course.rating = payload.rating
    if payload.category is not None:
        category = _get_or_create_category(db, payload.category)
        course.category_id = category.id

    if payload.modules is not None:
        course.modules = [
            Module(title=module.title, content=module.content, position=index + 1)
            for index, module in enumerate(payload.modules)
        ]

    _commit_or_500(db)
    db.refresh(course)
    return _course_to_out(_get_course_or_404(db, course.id))


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = _get_course_or_404(db, course_id)
    db.delete(course)
    _commit_or_500(db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
