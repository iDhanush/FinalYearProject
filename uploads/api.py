from typing import Annotated
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from auth.api import get_current_optional_user_from_cookie
from utils import (invoke_uid, image_extensions, video_extensions, is_youtube_url, yt_downloader,
                   is_instagram_url,
                   is_twitter_url, insta_downloader)

upload_router = APIRouter(tags=['uploads'])


@upload_router.post("/file/upload")
async def upload_file(file: UploadFile = File(...),
                      user: Annotated[dict, Depends(get_current_optional_user_from_cookie)] = None):
    if not user:
        userid = 'xxx'
    else:
        userid = str(user['_id'])
    fid = invoke_uid()
    print(file.filename)
    file_name = file.filename
    if file_name.split('.')[-1].lower() in image_extensions:
        file_name = f'{userid}_{fid}.jpg'
    elif file_name.split('.')[-1].lower() in video_extensions:
        file_name = f'{userid}_{fid}.mp4'
    else:
        raise HTTPException(401, '')
    with open(f'assets/{file_name}', "wb") as f:
        f.write(await file.read())
    return {'id': file_name}


@upload_router.get("/link/upload")
async def upload_link(user: Annotated[dict, Depends(get_current_optional_user_from_cookie)], link: str):
    print(link)
    if not user:
        userid = 'xxx'
    else:
        userid = str(user['_id'])
    fid = f'{userid}_{invoke_uid()}.mp4'
    if is_youtube_url(link):
        yt_downloader(link, fid)
    elif is_instagram_url(link):
        insta_downloader(link, fid)
    elif is_twitter_url(link):
        return False
    else:
        return False
    return {'id': fid}
