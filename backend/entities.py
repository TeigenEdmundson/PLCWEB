from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel
from fastapi import UploadFile

#-----------------------------------#
#           database models         #
#-----------------------------------#


class PostInDB(SQLModel, table=True):
    __tablename__="posts"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    num_comments: int
    comments: list["CommentInDB"] = Relationship(back_populates="post")
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    file:Optional[str] = Field(default=None)
    has_file:bool

class CommentInDB(SQLModel, table=True):
    __tablename__="comments"

    post_id: int = Field(foreign_key="posts.id")
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

    post: PostInDB = Relationship(back_populates="comments")


#-----------------------------------#
#           request models          #
#-----------------------------------#

class PostCreate(SQLModel):
    title:str
    content:str
    file: UploadFile | None = None

class CommentCreate(SQLModel):
    content:str
class MediaUpload(BaseModel):
    postId:int
    media:bytes

#-----------------------------------#
#           response models         #
#-----------------------------------#

class Metadata(BaseModel):
    count: int

class Comment(SQLModel):
    post_id:int
    id: int
    content: str
    created_at: datetime

class CommentCollection(BaseModel):
    meta: Metadata
    comments: list[Comment]

class CommentResponse(BaseModel):
    comment: Comment

class Post(SQLModel):
    id: int
    title:str
    content: str
    num_comments: int
    created_at: datetime
    has_file: bool

class PostCollection(BaseModel):
    meta: Metadata
    posts: list[Post]

class PostResponse(BaseModel):
    post: Post   

class PostWithCommentsResponse(BaseModel):
    post: Post
    comments: CommentCollection
class UploadResponse(BaseModel):
    status:str
