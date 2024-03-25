from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from backend.routes.posts import posts_router
from backend.database import EntityNotFoundException
from backend.database import create_db_and_tables
#from backend.database import DuplicateEntryException

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="PLC WEB SERVER",
    description="API for a basic chat application",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # change this as appropriate for your setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router)



@app.exception_handler(EntityNotFoundException)
def handle_entity_not_found(
    _request: Request,
    exception: EntityNotFoundException,
) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={
            "detail": {
                "type": "entity_not_found",
                "entity_name": exception.entity_name,
                "entity_id": exception.entity_id,
            },
        },
    )

# @app.exception_handler(DuplicateEntryException)
# def handle_duplicate_entry(
#     _request: Request,
#     exception: DuplicateEntryException,
# ) -> JSONResponse:
#     return JSONResponse(
#         status_code=422,
#         content={
#             "detail": {
#                 "type": "duplicate_entity",
#                 "entity_name": exception.entity_name,
#                 "entity_id": exception.entity_id,
#             },
#         },
#     )


@app.get("/", include_in_schema=False)
def default() -> str:
    return HTMLResponse(
        content=f"""
        <html>
            <body>
                <h1>{app.title}</h1>
                <p>{app.description}</p>
                <h2>API docs</h2>
                <ul>
                    <li><a href="/docs">Swagger</a></li>
                    <li><a href="/redoc">ReDoc</a></li>
                </ul>
            </body>
        </html>
        """,
    )