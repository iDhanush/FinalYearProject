from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth.api import get_current_user_from_cookie
from global_var import Var

feedback_router = APIRouter()


class FeedBackData(BaseModel):
    feedback: str
    file_uid: str


@feedback_router.post("/send-feedback")
async def send_feedback(feedback_data: FeedBackData, user: Annotated[dict, Depends(get_current_user_from_cookie)]):
    feedback_data = feedback_data.model_dump()
    feedback_data['user_id'] = str(user['_id'])
    await Var.db.feedDB.insert_one(feedback_data)
    return {'':'sdsad'}


@feedback_router.post("/view-feedbacks")
async def send_feedback(user: Annotated[dict, Depends(get_current_user_from_cookie)]):
    if not user.get('is_superuser', False):
        raise HTTPException(401, '')
    return await Var.db.feedDB.find({}, {'_id': 0}).to_list(None)
