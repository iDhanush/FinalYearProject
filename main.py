import uvicorn
from fastapi import FastAPI
from auth.api import auth_router
from certification.api import cert_router
from unmask.api import unmask_router
from uploads.api import upload_router
from starlette.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(unmask_router, prefix="/api")
app.include_router(cert_router, prefix="/api")


app.mount("/api/dwd", StaticFiles(directory="assets"), name="assets")
app.mount("/api/certificate", StaticFiles(directory="certificates"), name="certificates")
# app.mount("/", StaticFiles(directory="dist"), name="index.html")

uvicorn.run(app, host="localhost", port=8000)
