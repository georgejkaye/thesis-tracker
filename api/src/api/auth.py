from datetime import timedelta, datetime
import os
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel


def read_secret(file: str) -> Optional[str]:
    if os.path.isfile(file):
        with open(file) as f:
            value = f.readline().replace("\n", "")
        return value
    raise ValueError(f"Secret file {file} does not exist")


def get_env_variable(name: str) -> str:
    var = os.getenv(name)
    if var:
        return var
    else:
        raise ValueError(f"Environment variable {name} not set")


def get_secret_key() -> str:
    return read_secret(get_env_variable("SECRET_KEY"))


ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token", auto_error=False)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    hashed_password = pwd_context.hash(password)
    return hashed_password


def authenticate_user(username: str, password: str) -> bool:
    valid_user = get_env_variable("ADMIN_USER")
    hashed_password = read_secret(get_env_variable("ADMIN_PASSWORD_HASHED"))
    if not (valid_user == username):
        return False
    if not verify_password(password, hashed_password):
        return False
    return True


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, get_secret_key(), algorithm=ALGORITHM)
    return encoded_jwt


async def validate_token(
    token: Annotated[Optional[str], Depends(oauth2_scheme)]
) -> Optional[bool]:
    if token:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            jwt.decode(token, get_secret_key(), algorithms=[ALGORITHM])
            return True
        except JWTError:
            raise credentials_exception
    return None
