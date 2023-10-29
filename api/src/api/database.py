from dataclasses import dataclass
from datetime import datetime
from typing import Any

import psycopg2

from api.auth import get_env_variable


def connect() -> tuple[Any, Any]:
    conn = psycopg2.connect(
        dbname=get_env_variable("DB_NAME"),
        user=get_env_variable("DB_USER"),
        password=get_env_variable("DB_PASSWORD"),
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


def add_commit(new_commit: Commit) -> None:
    (conn, cur) = connect()
    statement = """
        INSERT INTO commit(commit_sha, commit_datetime, words, pages)
        VALUES (%(sha)s, %(dt)s, %(words)s, %(pages)s)
    """
    cur.execute(
        statement,
        {
            "sha": new_commit.commit_sha,
            "dt": new_commit.commit_datetime,
            "words": new_commit.words,
            "pages": new_commit.pages,
        },
    )
    conn.commit()
    disconnect(conn, cur)
