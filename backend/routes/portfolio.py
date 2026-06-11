from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import query_one, query_all, execute

portfolio_bp = Blueprint("portfolio", __name__)

# ── Public endpoints ──────────────────────────────────────────────────────────

@portfolio_bp.get("/testimonials")
def testimonials():
    rows = query_all("SELECT * FROM testimonials WHERE featured=TRUE ORDER BY created_at DESC")
    return jsonify(success=True, data=[dict(r) for r in rows])

@portfolio_bp.get("/certifications")
def certifications():
    rows = query_all("SELECT * FROM certifications ORDER BY issue_date DESC")
    return jsonify(success=True, data=[dict(r) for r in rows])

@portfolio_bp.get("/experience")
def experience():
    rows = query_all("SELECT * FROM experiences ORDER BY current DESC,sort_order,start_date DESC")
    return jsonify(success=True, data=[dict(r) for r in rows])

@portfolio_bp.get("/stats")
def stats():
    projects = query_one("SELECT COUNT(*) AS c FROM projects WHERE live=TRUE")["c"]
    posts    = query_one("SELECT COUNT(*) AS c FROM blog_posts WHERE published=TRUE")["c"]
    messages = query_one("SELECT COUNT(*) AS c FROM contact_messages")["c"]
    return jsonify(success=True, data={"projects":projects,"posts":posts,"messages":messages,
                                        "years_experience":3,"clients":20,"coffee_cups":1500})

# ── Contact ───────────────────────────────────────────────────────────────────
@portfolio_bp.post("/contact")
def contact():
    d = request.get_json() or {}
    required = ["name","email","message"]
    if not all(d.get(f) for f in required):
        return jsonify(success=False, message="Name, email and message are required"), 400
    execute("INSERT INTO contact_messages (name,email,company,subject,message) VALUES (%s,%s,%s,%s,%s)",
            (d["name"],d["email"],d.get("company"),d.get("subject"),d["message"]))
    return jsonify(success=True, message="Message sent! I'll reply within 24 hours."), 201

# ── Admin: Messages ───────────────────────────────────────────────────────────
@portfolio_bp.get("/messages")
@jwt_required()
def messages():
    rows = query_all("SELECT * FROM contact_messages ORDER BY created_at DESC")
    return jsonify(success=True, data=[dict(r) for r in rows])

@portfolio_bp.patch("/messages/<int:mid>/read")
@jwt_required()
def mark_read(mid):
    execute("UPDATE contact_messages SET is_read=TRUE WHERE id=%s",(mid,))
    return jsonify(success=True)

# ── Admin: Testimonials ───────────────────────────────────────────────────────
@portfolio_bp.post("/testimonials")
@jwt_required()
def add_testimonial():
    d = request.get_json() or {}
    row = execute("INSERT INTO testimonials (name,role,company,content,avatar_url,rating) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                  (d.get("name"),d.get("role"),d.get("company"),d.get("content"),d.get("avatar_url"),d.get("rating",5)))
    return jsonify(success=True, data=dict(row) if row else {}), 201

@portfolio_bp.delete("/testimonials/<int:tid>")
@jwt_required()
def del_testimonial(tid):
    execute("DELETE FROM testimonials WHERE id=%s",(tid,))
    return jsonify(success=True)

# ── Admin: Experience ─────────────────────────────────────────────────────────
@portfolio_bp.post("/experience")
@jwt_required()
def add_experience():
    d = request.get_json() or {}
    row = query_one("""
        INSERT INTO experiences (company,position,location,start_date,end_date,current,description,achievements,technologies,company_url)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
    """, (d.get("company"),d.get("position"),d.get("location"),d.get("start_date"),
          d.get("end_date"),d.get("current",False),d.get("description"),
          d.get("achievements",[]),d.get("technologies",[]),d.get("company_url")))
    return jsonify(success=True, data=dict(row)), 201

# ── AI Chatbot ────────────────────────────────────────────────────────────────
KNOWLEDGE_BASE = """
You are an AI assistant for David Wege's portfolio website. Answer questions about David accurately using only the information below.

ABOUT DAVID:
- Full Stack Developer based in Nairobi, Kenya
- 3+ years of professional experience
- Specializes in React, Flask, PostgreSQL, Python, and M-Pesa integrations
- Available for freelance and full-time opportunities
- Email: david@davidwege.dev
- GitHub: github.com/davidwege
- LinkedIn: linkedin.com/in/davidwege

SKILLS:
Frontend: React, JavaScript, HTML5, CSS3, Tailwind CSS, Framer Motion
Backend: Flask (Python), Node.js, Express, REST APIs
Database: PostgreSQL, MySQL, MongoDB
Cloud: AWS, Google Cloud, Docker
Tools: Git, Linux, VS Code, Figma
Payments: M-Pesa Daraja API, Stripe

PROJECTS:
1. Lumière Restaurant App - Full-stack restaurant management with M-Pesa payments, React/Flask/PostgreSQL
2. Prestige Academy - School management system for 2,400+ students, 5 user roles
3. AI Portfolio - This portfolio website with AI chatbot, React/Flask
4. Task Manager - Real-time collaborative task management, WebSockets
5. E-commerce Platform - Multi-vendor marketplace with Stripe payments

EXPERIENCE:
- Freelance Full Stack Developer (2022–present): Built 5+ production applications
- Open Source Contributor & Mentor (2021–2022): Nairobi tech community

CERTIFICATIONS:
- AWS Certified Developer – Associate
- Google Cloud Professional Developer
- Meta React Developer Certificate

EDUCATION:
- Computer Science, University of Nairobi

AVAILABILITY: Available for freelance projects and full-time roles starting immediately.
"""

@portfolio_bp.post("/chat")
def chat():
    d = request.get_json() or {}
    message = d.get("message","").strip()
    history = d.get("history",[])
    if not message:
        return jsonify(success=False, message="Message required"), 400

    # Build messages for the AI — using a simple rule-based fallback if no API key
    import os
    # Smart rule-based responses (works without external API)
    msg_lower = message.lower()
    if any(w in msg_lower for w in ["skill","know","technology","tech stack","language","framework"]):
        reply = "David's core stack is **React** on the frontend and **Flask/Python** on the backend with **PostgreSQL** for databases. He's also experienced with Docker, AWS, Google Cloud, and M-Pesa payment integrations. Want me to go deeper on any specific technology?"
    elif any(w in msg_lower for w in ["project","built","made","portfolio","work sample"]):
        reply = "David's featured projects include:\n\n1. **Lumière Restaurant App** — Full-stack restaurant management with M-Pesa payments\n2. **Prestige Academy** — School ERP managing 2,400+ students\n3. **AI Portfolio** — This site with an integrated chatbot\n4. **Task Manager** — Real-time collaborative tool with WebSockets\n\nWhich would you like to know more about?"
    elif any(w in msg_lower for w in ["experience","year","long","work","job"]):
        reply = "David has **3+ years** of professional experience as a Full Stack Developer. He's been freelancing since 2022, building production applications for clients across East Africa. He's handled M-Pesa integrations processing **KES 10M+** in transactions."
    elif any(w in msg_lower for w in ["available","hire","job","freelance","remote","fulltime","full-time"]):
        reply = "David is **available immediately** for both freelance projects and full-time positions. He works remotely and is open to relocation. The best way to reach him is via the contact form or directly at **david@davidwege.dev**."
    elif any(w in msg_lower for w in ["contact","email","reach","talk","meet","schedule"]):
        reply = "You can reach David at:\n\n📧 **david@davidwege.dev**\n💼 linkedin.com/in/davidwege\n🐙 github.com/davidwege\n\nOr use the **Contact** page to send a message — he typically responds within 24 hours!"
    elif any(w in msg_lower for w in ["mpesa","payment","safaricom","daraja","fintech"]):
        reply = "M-Pesa integration is one of David's specialties. He's built STK Push implementations handling **KES 10M+** in transactions, with robust callback handling, polling fallbacks, and PDF receipt generation. He knows the Daraja API inside out."
    elif any(w in msg_lower for w in ["salary","rate","cost","price","charge"]):
        reply = "David's rates vary by project scope and duration. Please reach out via the contact form or email **david@davidwege.dev** to discuss your project and get a custom quote."
    elif any(w in msg_lower for w in ["location","based","nairobi","kenya","where"]):
        reply = "David is based in **Nairobi, Kenya** and works fully remotely. He's comfortable working across time zones and has collaborated with clients in East Africa, Europe, and North America."
    elif any(w in msg_lower for w in ["education","degree","university","school","study"]):
        reply = "David studied **Computer Science** at the University of Nairobi. He supplements his degree with industry certifications including **AWS Certified Developer**, **Google Cloud Professional Developer**, and **Meta React Developer Certificate**."
    elif any(w in msg_lower for w in ["hello","hi","hey","good","how are"]):
        reply = "Hi there! 👋 I'm David's AI assistant. I can answer questions about his **skills**, **projects**, **experience**, **availability**, or how to **contact him**. What would you like to know?"
    else:
        reply = f"Great question! I'm David's AI assistant and I can tell you about his skills, projects, experience, and availability. Could you rephrase or ask something like:\n\n- 'What technologies does David know?'\n- 'What projects has David built?'\n- 'Is David available for hire?'\n- 'How do I contact David?'"

    return jsonify(success=True, data={"reply": reply})
