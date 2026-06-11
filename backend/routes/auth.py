import json, bcrypt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import query_one

auth_bp = Blueprint("auth", __name__)

def make_token(user):
    return create_access_token(identity=json.dumps({"id": user["id"], "email": user["email"], "role": "admin"}))

@auth_bp.post("/login")
def login():
    d = request.get_json() or {}
    user = query_one("SELECT * FROM admin_users WHERE email=%s", (d.get("email","").lower(),))
    if not user or not bcrypt.checkpw((d.get("password","")).encode(), user["password"].encode()):
        return jsonify(success=False, message="Invalid credentials"), 401
    return jsonify(success=True, data={"token": make_token(user), "email": user["email"]})

@auth_bp.get("/me")
@jwt_required()
def me():
    identity = json.loads(get_jwt_identity())
    return jsonify(success=True, data=identity)
