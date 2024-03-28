from datetime import date
from typing import Literal, Annotated
import os
import uuid
import time
import shutil

from starlette.datastructures import UploadFile
import mimetypes

from pathlib import Path
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session
from backend.entities import (
    CommentCreate,
    Comment,
    CommentResponse,
    CommentCollection,
    PostCreate,
    Post,
    PostCollection,
    PostResponse,
    PostWithCommentsResponse,
    UploadResponse,
)

from backend import database as db

UPLOAD_DIR="uploads"
posts_router = APIRouter(prefix="/api/posts", tags=["Posts"])
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/ogg"}

def generate_unique_filename(filename):
    # Extract file extension
    file_ext = os.path.splitext(filename)[1]
    # Generate a unique filename using timestamp and random string
    unique_filename = f"{int(time.time())}_{uuid.uuid4().hex}{file_ext}"
    return unique_filename

@posts_router.get("", response_model=PostCollection)
def get_posts(session: Session = Depends(db.get_session)):
    posts = db.get_all_posts(session)

    return PostCollection(
        meta={"count": len(posts)},
        posts=posts
    )


@posts_router.post("", response_model=PostResponse)
def create_post(
    post_create: PostCreate,
    session: Session = Depends(db.get_session)
    ):
    return PostResponse(post=db.create_post(session, post_create))

@posts_router.post("/uploads")
async def upload_file(
    post_id: int = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(db.get_session)
):
    unique_filename = "none"
    try:
        if file.content_type in ALLOWED_IMAGE_TYPES or file.content_type in ALLOWED_VIDEO_TYPES:
            os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the upload directory exists

            unique_filename = generate_unique_filename(file.filename)  # Generate unique filename
            file_path = os.path.join(UPLOAD_DIR, unique_filename)  # Construct full path to save file

            # Save the file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Update post creation data with file information if needed
            return UploadResponse(status=db.save_upload_to_post(session, file_path, post_id))
        else:
            raise HTTPException(status_code=400, detail="Only images and videos are allowed")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")

@posts_router.post("/{post_id}", response_model=CommentResponse)
def create_comment(post_id:int,
    comment_create: CommentCreate,
    session: Session = Depends(db.get_session),
    ):
    return CommentResponse(comment=db.create_comment(session, comment_create, post_id))

@posts_router.get("/{post_id}", response_model=PostWithCommentsResponse)
def get_post(post_id:int,
             session: Session = Depends(db.get_session)):
    post = db.get_post_by_id(session, post_id)
    comments = db.get_comments_by_post_id(session, post_id)
    coll = CommentCollection(
        meta = {"count":len(comments)},
        comments = comments
        )
    return PostWithCommentsResponse(
        post = post,
        comments = coll
    )

@posts_router.get("/uploads/{post_id}")
async def get_post_image(post_id: int,
                         session: Session = Depends(db.get_session)):
    post = db.get_post_by_id(session, post_id)
    image_path = Path(post.file)
    if not image_path.is_file():
        return {"error": "Image not found on the server"}
    return FileResponse(image_path)