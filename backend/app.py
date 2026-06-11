import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.auth      import auth_bp
from routes.projects  import projects_bp
from routes.blog      import blog_bp
from routes.portfolio import portfolio_bp
from routes.uploads   import uploads_bp

app = Flask(__name__)
app.config["SECRET_KEY"]               = os.getenv("SECRET_KEY","dev")
app.config["JWT_SECRET_KEY"]           = os.getenv("JWT_SECRET_KEY","dev-jwt")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
app.config["MAX_CONTENT_LENGTH"]       = 20 * 1024 * 1024

CORS(app, origins="*", supports_credentials=True)
JWTManager(app)

app.register_blueprint(auth_bp,      url_prefix="/api/auth")
app.register_blueprint(projects_bp,  url_prefix="/api/projects")
app.register_blueprint(blog_bp,      url_prefix="/api/blog")
app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
app.register_blueprint(uploads_bp,   url_prefix="/api/uploads")

@app.get("/api/health")
def health(): return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
