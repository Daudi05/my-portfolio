import os, uuid
from flask import Blueprint, send_from_directory
from flask_jwt_extended import jwt_required
from flask import request, jsonify

uploads_bp = Blueprint("uploads", __name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED = {'png','jpg','jpeg','gif','webp','pdf'}

@uploads_bp.post("")
@jwt_required()
def upload():
    if 'file' not in request.files: return jsonify(success=False, message="No file"), 400
    file = request.files['file']
    ext = (file.filename or "").rsplit('.',1)[-1].lower()
    if ext not in ALLOWED: return jsonify(success=False, message="Invalid type"), 400
    filename = f"{uuid.uuid4().hex}.{ext}"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file.save(os.path.join(UPLOAD_FOLDER, filename))
    return jsonify(success=True, data={"url": f"http://localhost:5000/api/uploads/{filename}"}), 201

@uploads_bp.get("/<filename>")
def serve(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
