
import os
from dotenv import load_dotenv
load_dotenv()
import bcrypt
from database import db

if __name__ == "__main__":
    with db() as conn:
        with conn.cursor() as cur:
            # Admin user
            pw = bcrypt.hashpw(os.getenv("ADMIN_PASSWORD","admin123").encode(), bcrypt.gensalt()).decode()
            cur.execute("INSERT INTO admin_users (email,password) VALUES (%s,%s) ON CONFLICT (email) DO NOTHING",
                       (os.getenv("ADMIN_EMAIL","admin@portfolio.dev"), pw))

            # Projects
            projects = [
                ("Lumière Restaurant App","lumiere-restaurant","Full-stack restaurant management system with M-Pesa payment integration, real-time order tracking, admin dashboard with analytics, and PDF receipt generation.",
                 "Built a complete restaurant management platform handling the entire customer journey from browsing to payment. Includes role-based access control (manager/customer/guest), real-time cart management, M-Pesa STK Push integration with payment confirmation polling, and automated PDF receipt generation using ReportLab.",
                 "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
                 "https://lumiere.davidwege.dev","https://github.com/davidwege/lumiere",
                 ["React","Flask","PostgreSQL","M-Pesa API","ReportLab","JWT","Python"],
                 "Full Stack","The main challenge was implementing reliable M-Pesa payment confirmation since the STK Push callback depends on network availability. I built a polling mechanism that checks payment status every 4 seconds as a fallback.",
                 "Reduced restaurant order processing time by 60%. Achieved 99.9% payment success rate after implementing dual confirmation (callback + polling).", True),
                ("Prestige Academy School Management","prestige-academy","Enterprise school management system with student/parent/teacher portals, admissions workflow, fee payment via M-Pesa, and comprehensive admin dashboard.",
                 "Built an enterprise-grade school ERP system managing 2,400+ students. Features include role-based portals for 5 user types, automated attendance tracking, real-time grade management, fee collection with M-Pesa integration, and a analytics dashboard with Recharts visualizations.",
                 "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
                 "https://academy.davidwege.dev","https://github.com/davidwege/prestige-academy",
                 ["React","Flask","PostgreSQL","M-Pesa","JWT","Recharts","Python"],
                 "Full Stack","Designing a permissions system flexible enough to handle 5 different roles (super_admin, admin, teacher, parent, student) with granular access control to 20+ database tables while keeping the API clean.",
                 "System adopted by a real school managing 2,400 students. Reduced administrative workload by 40% and improved fee collection rate from 72% to 94%.", True),
                ("AI-Powered Portfolio with Chatbot","ai-portfolio","Personal portfolio with integrated AI assistant that answers recruiter questions about skills, projects, and availability in real-time.",
                 "Built this very portfolio with an AI chatbot that uses context-aware responses to answer questions about my background, skills, and projects. Features dark/light mode, smooth Framer Motion animations, blog system with syntax highlighting, and admin CMS.",
                 "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                 "https://davidwege.dev","https://github.com/davidwege/portfolio",
                 ["React","Flask","PostgreSQL","Framer Motion","Python"],
                 "Full Stack","Building a context-aware AI chatbot that gives accurate, specific answers about my background without hallucinating. Used a curated knowledge base injected into each prompt rather than fine-tuning.",
                 "Portfolio generates 3-5 recruiter contacts per week. AI chatbot handles 80% of initial recruiter questions automatically.", True),
                ("Real-time Task Manager","task-manager","Collaborative task management app with real-time updates, team workspaces, kanban boards, and productivity analytics.",
                 "Full-featured project management tool inspired by Linear and Notion. Supports team workspaces, kanban/list/timeline views, file attachments, comments, @mentions, and automated status workflows.",
                 "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
                 "https://tasks.davidwege.dev","https://github.com/davidwege/task-manager",
                 ["React","Flask","PostgreSQL","WebSockets","Redis","Python"],
                 "Web App",None,None,False),
                ("E-commerce Platform","ecommerce-platform","Production-ready e-commerce platform with multi-vendor support, inventory management, Stripe payments, and real-time order tracking.",
                 "Built a scalable multi-vendor marketplace with product catalog management, cart and wishlist, Stripe checkout integration, order fulfillment workflows, seller dashboards, and customer analytics.",
                 "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
                 None,"https://github.com/davidwege/ecommerce",
                 ["React","Flask","PostgreSQL","Stripe","Redis","Celery","Python"],
                 "Web App",None,None,False),
            ]
            for p in projects:
                cur.execute("""
                    INSERT INTO projects (title,slug,description,long_desc,image_url,demo_url,github_url,technologies,category,challenges,results,featured)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (slug) DO NOTHING
                """, p)

            # Blog posts
            posts = [
                ("Building a Production-Ready M-Pesa Integration with Flask","building-mpesa-flask",
                 "A comprehensive guide to integrating M-Pesa STK Push into your Flask application, covering authentication, STK push, callback handling, and payment verification.",
                 """# Building a Production-Ready M-Pesa Integration with Flask

M-Pesa is Kenya's dominant mobile payment platform. Integrating it properly requires handling OAuth tokens, STK Push requests, asynchronous callbacks, and payment verification. Here's how I built a robust integration.

## Getting Started

First, register at [Safaricom Daraja](https://developer.safaricom.co.ke) and create an app.

## Authentication

```python
def get_access_token():
    creds = base64.b64encode(f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode()).decode()
    res = requests.get(
        f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {creds}"},
        timeout=10
    )
    return res.json()["access_token"]
```

## STK Push

The STK Push sends a payment prompt to the customer's phone. Key parameters:

- `BusinessShortCode`: Your paybill/till number
- `Password`: Base64(shortcode + passkey + timestamp)
- `CallBackURL`: Must be publicly accessible HTTPS URL

## Handling Callbacks

Safaricom calls your callback URL asynchronously. Always return 200 immediately:

```python
@app.post("/mpesa/callback")
def callback():
    data = request.get_json()
    # Process in background
    return {"ResultCode": 0, "ResultDesc": "Accepted"}
```

## Production Tips

1. Use ngrok for local testing
2. Store checkout_request_id to correlate callbacks
3. Implement polling as fallback for missed callbacks
4. Always validate amounts on callback vs original request
                 """,
                 "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
                 "Backend","Flask,Python,M-Pesa,Fintech", True),
                ("From Zero to Production: My Flask + React Architecture","flask-react-architecture",
                 "How I structure large Flask applications for maintainability, scalability, and developer experience — lessons from building 5+ production apps.",
                 """# Flask + React Architecture That Scales

After building multiple production applications with Flask and React, I've settled on an architecture that balances simplicity with scalability.

## Project Structure
## Key Decisions

### 1. Context Manager for DB Connections
Using Python's `contextmanager` ensures connections are always closed:

```python
@contextmanager
def db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except:
        conn.rollback()
        raise
    finally:
        conn.close()
```

### 2. Role-Based Middleware

```python
def roles(*allowed):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*a, **kw):
            user = get_identity()
            if user.get("role") not in allowed:
                return error("Access denied", 403)
            return fn(*a, **kw)
        return wrapper
    return decorator
```

## Lessons Learned

- Keep routes thin, business logic in services
- Use blueprints for every feature domain
- Never put DB queries in routes directly
                """,
                 "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
                 "Architecture","Flask,React,PostgreSQL,Architecture", True),
                ("CSS Grid vs Flexbox: When to Use Each","css-grid-vs-flexbox",
                 "A practical guide to choosing between CSS Grid and Flexbox, with real-world examples from my portfolio projects.",
                 "# CSS Grid vs Flexbox\n\nBoth are powerful layout tools but excel in different scenarios.\n\n## Flexbox: One Dimension\nUse Flexbox when laying out items in a **single direction** — a navbar, a row of buttons, or a card's internal layout.\n\n## Grid: Two Dimensions\nUse Grid when you need control over **both rows and columns** — page layouts, image galleries, dashboards.\n\n## My Rule of Thumb\n- Component internals → Flexbox\n- Page-level layouts → Grid\n- Card grids → Grid\n- Navigation → Flexbox",
                 "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                 "Frontend","CSS,Web Development,Frontend", False),
            ]
            for p in posts:
                title,slug,excerpt,content,cover,cat,tags,featured = p
                tag_array = tags.split(',')
                cur.execute("""
                    INSERT INTO blog_posts (title,slug,excerpt,content,cover_image,category,tags,published,featured,read_time,published_at)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,TRUE,%s,5,NOW()) ON CONFLICT (slug) DO NOTHING
                """, (title,slug,excerpt,content,cover,cat,tag_array,featured))

            # Experiences
            experiences = [
                ("Freelance / Self-Employed","Full Stack Developer","Nairobi, Kenya","2022-01-01",None,True,
                 "Building production-ready web applications for clients across East Africa and globally. Specializing in React frontends, Flask/Python backends, and PostgreSQL databases with M-Pesa payment integrations.",
                 ["Built 5+ production applications serving real users","Integrated M-Pesa payment processing handling KES 10M+ in transactions","Reduced client operational costs by 40% through automation","Maintained 99.9% uptime across all deployed applications"],
                 ["React","Flask","PostgreSQL","Python","M-Pesa","Docker"],None,None,0),
                ("Tech Community Nairobi","Open Source Contributor & Mentor","Nairobi, Kenya","2021-06-01","2022-01-01",False,
                 "Contributed to open source projects and mentored junior developers in the Nairobi tech community. Organized monthly code reviews and pair programming sessions.",
                 ["Mentored 15+ junior developers","Contributed to 3 open source projects","Organized 12 monthly meetups with 50+ attendees"],
                 ["Python","JavaScript","React","Git"],None,None,1),
            ]
            for exp in experiences:
                cur.execute("""
                    INSERT INTO experiences (company,position,location,start_date,end_date,current,description,achievements,technologies,company_url,logo_url,sort_order)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING
                """, exp)

            # Testimonials
            testimonials = [
                ("Sarah Mitchell","Product Manager","TechCorp Kenya","David delivered our restaurant management system 2 weeks ahead of schedule. The M-Pesa integration worked flawlessly from day one. His code is clean, well-documented, and the admin dashboard exceeded our expectations. Highly recommend!",None,5),
                ("James Otieno","CTO","Prestige Academy","We hired David to build our school management system and he delivered an enterprise-grade solution that now manages 2,400+ students. His attention to detail and ability to translate complex requirements into elegant code is exceptional.",None,5),
                ("Amina Hassan","Startup Founder","EduTech Nairobi","David built our e-learning platform from scratch in 3 months. He proposed several improvements we hadn't considered that significantly improved the user experience. Professional, communicative, and highly skilled.",None,5),
            ]
            for t in testimonials:
                cur.execute("INSERT INTO testimonials (name,role,company,content,avatar_url,rating) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING", t)

            # Certifications
            certs = [
                ("AWS Certified Developer – Associate","Amazon Web Services","2023-06-01",None,"https://aws.amazon.com/certification/"),
                ("Google Cloud Professional Developer","Google Cloud","2023-03-01",None,"https://cloud.google.com/certification/"),
                ("Meta React Developer Certificate","Meta","2022-11-01",None,"https://www.coursera.org/"),
                ("PostgreSQL Administration","PostgreSQL Global Development Group","2022-08-01",None,"https://www.postgresql.org/"),
            ]
            for c in certs:
                cur.execute("INSERT INTO certifications (title,issuer,issue_date,expiry_date,credential_url) VALUES (%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING", c)

    print("✅ Seed complete — Admin: admin@portfolio.dev / admin123")
