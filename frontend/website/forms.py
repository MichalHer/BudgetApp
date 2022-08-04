from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from. models import User

class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder":"Nazwa Użytkownika"})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder": "Hasło"})
    
    submit = SubmitField("Zarejestruj")
    
    def validate_username(self, username):
        existing_username = User.query.filter_by(
            username=username.data).first()
        if existing_username:
            raise ValidationError("Taki użytkownik już istnieje.")
        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder":"Nazwa Użytkownika"})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder": "Hasło"})
    
    submit = SubmitField("Zaloguj")