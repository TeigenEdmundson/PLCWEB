from sqlmodel import Session, SQLModel, create_engine, select
from backend.entities import (
    PostInDB,
    PostCreate,
    CommentCreate,
    CommentInDB
)

engine = create_engine(
    "sqlite:///backend/plc.db",
    echo=True,
    connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

class EntityNotFoundException(Exception):
    def __init__(self, *, entity_name: str, entity_id: int):
        self.entity_name = entity_name
        self.entity_id = entity_id


#          Posts          #

def get_all_posts(session: Session) -> list[PostInDB]:
    return session.exec(select(PostInDB)).all()

def get_post_by_id(session:Session, post_id:int) -> PostInDB:
    post = session.get(PostInDB, post_id)
    if post:
        return post
    raise EntityNotFoundException(entity_name="Post", entity_id=post_id)

def increase_num_comments(session:Session, post_id:int):
    post = get_post_by_id(session, post_id)
    setattr(post, "num_comments", post.num_comments + 1)
    session.add(post)
    session.commit()
    session.refresh(post)

def create_post(session:Session, post_create: PostCreate, **kwargs) -> PostInDB:
    file = kwargs.get('file', None)
    if file:
        post = PostInDB(**post_create.model_dump(), num_comments=0, file=file, has_file=True)
    else:
        post = PostInDB(**post_create.model_dump(), num_comments=0, has_file=False)
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

def create_comment(session:Session, comment_create: CommentCreate, post_id: int) -> CommentInDB:
    comment = CommentInDB(**comment_create.model_dump(), post_id=post_id)
    increase_num_comments(session, post_id)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

def get_comments_by_post_id(session:Session, post_id:int) -> list[CommentInDB]:
    return session.exec(select(CommentInDB).where(CommentInDB.post_id == post_id)).all()

def save_upload_to_post(session:Session, filepath:str, post_id:int) -> str:

    post= get_post_by_id(session, post_id)
    setattr(post,"file", filepath)
    setattr(post, "has_file", True)
    session.add(post)
    session.commit()
    session.refresh(post)

    return "ok"