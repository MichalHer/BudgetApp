from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from os import path

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
DB_NAME = "database.db"
def create_db(app):
    with app.app_context():
        if not path.exists(f'website/{DB_NAME}'):
            db.create_all()
        
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'gfsadfdfdsas56fds69f84ds8f4'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    from .auth import auth
    from .views import views
    from .budgetapp import budgetapp
    from .api_connection import api_connection
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(budgetapp, url_prefix='/budgetapp')
    app.register_blueprint(api_connection, url_prefix='/api_connection')
    from .models import User
    create_db(app)
    return app