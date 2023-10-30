from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Annotated, Optional
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from api.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_env_variable,
    validate_token,
)
from api.database import Commit, add_commit, get_commits_from_db


app = FastAPI(
    title="Thesis tracker API",
    summary="API for interacting with the thesis tracker",
    version="1.0.0",
    contact={
        "name": "George Kaye",
        "email": "georgejkaye@gmail.com",
        "url": "https://georgejkaye.com",
    },
    license_info={
        "name": "GNU General Public License v3.0",
        "url": "https://www.gnu.org/licenses/gpl-3.0.en.html",
    },
)


@app.post("/token", summary="Get an auth token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    # Check the username and password
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create an access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/commit", summary="Submit a new commit")
async def post_commit(
    token: Annotated[Optional[str], Depends(validate_token)],
    commit_sha: str,
    commit_datetime: datetime,
    words: int,
    pages: int,
) -> None:
    commit = Commit(commit_sha, commit_datetime, words, pages)
    add_commit(commit)


@app.get("/commits", summary="Get commits")
async def get_commits(
    start: Optional[datetime] = None,
    end: Optional[datetime] = None,
) -> list[Commit]:
    return get_commits_from_db(start, end)


import uvicorn


def start():
    if get_env_variable("API_ENV") == "prod":
        reload = False
    elif get_env_variable("API_ENV") == "dev":
        reload = True
    else:
        print("Invalid environment set")
        exit(1)
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=int(get_env_variable("API_PORT")),
        reload=reload,
    )


if __name__ == "__main__":
    start()
