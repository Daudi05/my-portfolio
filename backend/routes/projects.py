import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import query_one, query_all, execute

projects_bp = Blueprint("projects", __name__)

@projects_bp.get("")
def list_projects():
    category = request.args.get("category")
    featured = request.args.get("featured")
    search   = request.args.get("search")
    conds, params = [], []
    if category and category != "All": params.append(f"%{category}%"); conds.append("category ILIKE %s")
    if featured: conds.append("featured=TRUE")
    if search: params += [f"%{search}%",f"%{search}%"]; conds.append("(title ILIKE %s OR description ILIKE %s)")
    where = ("WHERE " + " AND ".join(conds)) if conds else ""
    rows = query_all(f"SELECT * FROM projects {where} ORDER BY featured DESC,sort_order,created_at DESC", params)
    return jsonify(success=True, data=[dict(r) for r in rows])

@projects_bp.get("/<slug>")
def get_project(slug):
    row = query_one("SELECT * FROM projects WHERE slug=%s", (slug,))
    if not row: return jsonify(success=False, message="Not found"), 404
    return jsonify(success=True, data=dict(row))

@projects_bp.post("")
@jwt_required()
def create_project():
    d = request.get_json() or {}
    row = query_one("""
        INSERT INTO projects (title,slug,description,long_desc,image_url,demo_url,github_url,technologies,category,featured,challenges,results)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
    """, (d.get("title"),d.get("slug"),d.get("description"),d.get("long_desc"),d.get("image_url"),
          d.get("demo_url"),d.get("github_url"),d.get("technologies",[]),d.get("category","Full Stack"),
          d.get("featured",False),d.get("challenges"),d.get("results")))
    return jsonify(success=True, data=dict(row)), 201

@projects_bp.put("/<int:pid>")
@jwt_required()
def update_project(pid):
    d = request.get_json() or {}
    fields, params = [], []
    for col in ["title","description","long_desc","image_url","demo_url","github_url","technologies","category","featured","challenges","results","live"]:
        if col in d: fields.append(f"{col}=%s"); params.append(d[col])
    if not fields: return jsonify(success=False, message="Nothing to update"), 400
    params.append(pid)
    execute(f"UPDATE projects SET {', '.join(fields)} WHERE id=%s", params)
    return jsonify(success=True, data=dict(query_one("SELECT * FROM projects WHERE id=%s",(pid,))))

@projects_bp.delete("/<int:pid>")
@jwt_required()
def delete_project(pid):
    execute("DELETE FROM projects WHERE id=%s",(pid,))
    return jsonify(success=True, message="Deleted")
