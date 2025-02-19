import datetime
from typing import Annotated

from PIL import Image
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth.api import get_current_optional_user_from_cookie, get_current_user_from_cookie
from certification.certificate import create_certificate
from global_var import Var
from unmask.unmasker import unmask_image
from utils import file_to_sha256, invoke_uid

cert_router = APIRouter(tags=['bchain'])


class PostData(BaseModel):
    file_uid: str


class CertificateData(BaseModel):
    certificate_uid: str
    user_id: str
    prediction: dict


@cert_router.post('/mint_certificate')
async def mint_certificate(post_data: PostData,
                           user: Annotated[dict, Depends(get_current_optional_user_from_cookie)] = None):
    if user:
        userid = str(user.get('_id'))
    else:
        userid = 'xxx'
    prediction = unmask_image(Image.open(f'assets/{post_data.file_uid}'))
    file_hash = file_to_sha256(f'assets/{post_data.file_uid}')
    certificate_uid = f"{userid}_{invoke_uid()}.png"
    create_certificate(
        round(prediction.get('real') * 100, 2),
        round(prediction.get('fake') * 100, 2),
        file_hash, userid,
        certificate_uid, datetime.datetime.now().date(), certificate_uid)
    certificate_data = CertificateData(certificate_uid=certificate_uid,
                                       user_id=userid,
                                       prediction=prediction)
    await Var.db.certDB.insert_one(certificate_data.model_dump())
    return certificate_data.model_dump()

@cert_router.get('/my_certificates')
async def my_certificates(user: Annotated[dict, Depends(get_current_user_from_cookie)] = None):
    if user:
        userid = str(user.get('_id'))
    else:
        userid = 'xxx'
    return await Var.db.certDB.find({'user_id': userid}).to_list(length=None)
