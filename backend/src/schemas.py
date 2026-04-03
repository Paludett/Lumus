from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ModuleIn(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)


class ModuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    content: str
    position: int
    created_at: datetime
    updated_at: datetime


class CourseCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=3)
    duration_text: str = Field(min_length=1, max_length=50)
    category: str = Field(min_length=1, max_length=120)
    price: Decimal | None = Field(default=None, ge=0)
    rating: Decimal | None = Field(default=None, ge=0, le=5)
    modules: list[ModuleIn] = Field(default_factory=list)


class CourseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = Field(default=None, min_length=3)
    duration_text: str | None = Field(default=None, min_length=1, max_length=50)
    category: str | None = Field(default=None, min_length=1, max_length=120)
    price: Decimal | None = Field(default=None, ge=0)
    rating: Decimal | None = Field(default=None, ge=0, le=5)
    modules: list[ModuleIn] | None = None


class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    duration_text: str
    category: str
    price: Decimal | None
    rating: Decimal | None
    modules: list[ModuleOut]
    created_at: datetime
    updated_at: datetime
