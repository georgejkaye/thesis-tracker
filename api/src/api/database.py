from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional
from fastapi import HTTPException

import psycopg2

from api.auth import get_env_variable, read_secret


def connect() -> tuple[Any, Any]:
    conn = psycopg2.connect(
        dbname=get_env_variable("DB_NAME"),
        user=get_env_variable("DB_USER"),
        password=read_secret(get_env_variable("DB_PASSWORD")),
        host=get_env_variable("DB_HOST"),
    )
    cur = conn.cursor()
    return (conn, cur)


def disconnect(conn: Any, cur: Any) -> None:
    conn.close()
    cur.close()


@dataclass
class Commit:
    commit_sha: str
    commit_datetime: datetime
    words: int
    pages: int
    diagrams: int
    files: int


def add_commit(new_commit: Commit) -> None:
    (conn, cur) = connect()
    statement = """
        INSERT INTO commit(
            commit_sha, commit_datetime, words, pages, diagrams, files
        ) VALUES (
            %(sha)s, %(dt)s, %(words)s, %(pages)s, %(diagrams)s, %(files)s
        )
    """
    try:
        cur.execute(
            statement,
            {
                "sha": new_commit.commit_sha,
                "dt": new_commit.commit_datetime,
                "words": new_commit.words,
                "pages": new_commit.pages,
                "diagrams": new_commit.diagrams,
                "files": new_commit.files,
            },
        )
        conn.commit()
        disconnect(conn, cur)
    except psycopg2.errors.UniqueViolation:
        raise HTTPException(status_code=400, detail="Commit already exists")


def get_commits_from_db(
    start: Optional[datetime] = None, end: Optional[datetime] = None
) -> list[Commit]:
    (conn, cur) = connect()
    conditions = []
    if start is not None:
        conditions.append("commit_datetime >= %(start)s")
    if end is not None:
        conditions.append("commit_datetime <= %(end)s")
    if len(conditions) == 0:
        conditions_string = ""
    else:
        conditions_string = f"WHERE {' AND '.join(conditions)}"
    statement = f"""
        SELECT commit_sha, commit_datetime, words, pages, diagrams, files FROM commit
        {conditions_string}
        ORDER BY commit_datetime DESC

    """
    cur.execute(statement)
    rows = cur.fetchall()
    commit_objects = list(
        map(lambda b: Commit(b[0], b[1], b[2], b[3], b[4], b[5]), rows)
    )
    conn.close()
    return commit_objects
