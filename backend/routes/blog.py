import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import query_one, query_all, execute

blog_bp = Blueprint("blog", __name__)

def slugify(text):
    return re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-')

@blog_bp.get("")
def list_posts():
    category = request.args.get("category")
    tag      = request.args.get("tag")
    search   = request.args.get("search")
    featured = request.args.get("featured")
    conds, params = ["published=TRUE"], []
    if category: params.append(f"%{category}%"); conds.append("category ILIKE %s")
    if tag: params.append(tag); conds.append("%s = ANY(tags)")
    if search: params += [f"%{search}%",f"%{search}%"]; conds.append("(title ILIKE %s OR excerpt ILIKE %s)")
    if featured: conds.append("featured=TRUE")
    rows = query_all(f"SELECT id,title,slug,excerpt,cover_image,category,tags,views,read_time,featured,published_at,created_at FROM blog_posts WHERE {' AND '.join(conds)} ORDER BY featured DESC,published_at DESC", params)
    return jsonify(success=True, data=[dict(r) for r in rows])

@blog_bp.get("/all")
@jwt_required()
def list_all():
    rows = query_all("SELECT * FROM blog_posts ORDER BY created_at DESC")
    return jsonify(success=True, data=[dict(r) for r in rows])

@blog_bp.get("/<slug>")
def get_post(slug):
    execute("UPDATE blog_posts SET views=views+1 WHERE slug=%s AND published=TRUE",(slug,))
    row = query_one("SELECT * FROM blog_posts WHERE slug=%s",(slug,))
    if not row: return jsonify(success=False, message="Not found"), 404
    return jsonify(success=True, data=dict(row))

@blog_bp.post("")
@jwt_required()
def create_post():
    d = request.get_json() or {}
    slug = slugify(d.get("title",""))
    row = query_one("""
        INSERT INTO blog_posts (title,slug,excerpt,content,cover_image,category,tags,published,featured,read_time,published_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,CASE WHEN %s THEN NOW() ELSE NULL END) RETURNING *
    """, (d.get("title"),slug,d.get("excerpt"),d.get("content"),d.get("cover_image"),
          d.get("category"),d.get("tags",[]),d.get("published",False),d.get("featured",False),
          d.get("read_time",5),d.get("published",False)))
    return jsonify(success=True, data=dict(row)), 201

@blog_bp.put("/<int:pid>")
@jwt_required()
def update_post(pid):
    d = request.get_json() or {}
    fields, params = [], []
    for col in ["title","excerpt","content","cover_image","category","tags","published","featured","read_time"]:
        if col in d: fields.append(f"{col}=%s"); params.append(d[col])
    if not fields: return jsonify(success=False, message="Nothing"), 400
    params.append(pid)
    execute(f"UPDATE blog_posts SET {', '.join(fields)} WHERE id=%s", params)
    return jsonify(success=True, data=dict(query_one("SELECT * FROM blog_posts WHERE id=%s",(pid,))))

@blog_bp.delete("/<int:pid>")
@jwt_required()
def delete_post(pid):
    execute("DELETE FROM blog_posts WHERE id=%s",(pid,))
    return jsonify(success=True, message="Deleted")
