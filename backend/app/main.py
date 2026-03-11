from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, jobs, applications, profiles, admin

app = FastAPI(title="DevHire API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["auth"])
app.include_router(jobs.router, tags=["jobs"])
app.include_router(applications.router, tags=["applications"])
app.include_router(profiles.router, tags=["profiles"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/")
def root():
    return {"message": "DevHire API is running!"}


@app.get("/health")
def health():
    return {"status": "healthy"}
