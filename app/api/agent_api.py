import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE_PATH = os.path.join(BASE_DIR, "sample.json")

class User(BaseModel):
    id: str
    name: str
    unitId: str
    jobRole: str
    instructions: str
    profileIcon: str

class UserUpdate(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    unitId: Optional[str] = None
    jobRole: Optional[str] = None
    instructions: Optional[str] = None
    profileIcon: Optional[str] = None

@app.get("/agents")
def get_users():
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)
        return data
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/agents/{user_id}")
def get_user(user_id: str):
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
            users = json.load(file)

        for user in users:
            if user["id"] == user_id:
                return user

        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        return {"error": str(e)}


@app.patch("/agents/{user_id}")
def update_user(user_id: str, user_update: UserUpdate):
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
            users = json.load(file)
        
        for user in users:
            if user["id"] == user_id:
                for key, value in user_update.dict(exclude_unset=True).items():
                    user[key] = value  
                with open(JSON_FILE_PATH, "w", encoding="utf-8") as file:
                    json.dump(users, file, indent=4)
                return {"message": "User updated successfully"}
        
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        return {"error": str(e)}
    
@app.delete("/agents/{user_id}")
def delete_user(user_id: str):
    try:
        with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
            users = json.load(file)
        
        users = [user for user in users if user["id"] != user_id]
        
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as file:
            json.dump(users, file, indent=4)
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        return {"error": str(e)}

