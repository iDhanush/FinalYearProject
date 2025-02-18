from datetime import timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

from global_var import Var
from .utils import verify_password, get_password_hash, create_access_token, get_user_from_token

# Router setup
auth_router = APIRouter()

# JWT Settings
SECRET_KEY = Var.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(None, min_length=1)


class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str
    full_name: str = None
    disabled: bool = False


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str = None


class Token(BaseModel):
    access_token: str
    token_type: str


# Helper function to get current user from cookie
async def get_current_user_from_cookie(
        access_token: Annotated[Optional[str], Cookie()] = None
) -> dict:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await get_user_from_token(access_token)
    return user


async def get_current_optional_user_from_cookie(
        access_token: Annotated[Optional[str], Cookie()] = None
) -> [dict, None]:
    if access_token is None:
        return

    user = await get_user_from_token(access_token)
    return user


# Routes
@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    # Check if username already exists
    if await Var.db.userDB.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists
    if await Var.db.userDB.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user_dict = user.model_dump()
    hashed_password = get_password_hash(user.password)

    user_in_db = UserInDB(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )

    result = await Var.db.userDB.insert_one(user_in_db.model_dump())

    created_user = await Var.db.userDB.find_one({"_id": result.inserted_id})

    return UserResponse(
        id=str(created_user["_id"]),
        username=created_user["username"],
        email=created_user["email"],
        full_name=created_user.get("full_name")
    )


@auth_router.post("/login", response_model=Token)
async def login(
        response: Response,
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    # Find user by username
    user = await Var.db.userDB.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is disabled
    if user.get("disabled", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )

    # Set cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,  # Prevents JavaScript access
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,  # Requires HTTPS
        samesite="lax"  # Provides CSRF protection
    )

    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[dict, Depends(get_current_user_from_cookie)]):
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        email=current_user["email"],
        full_name=current_user.get("full_name")
    )


@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}
