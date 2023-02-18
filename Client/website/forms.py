from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from .models import User

class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"class":"form-control", "aria-label":"Sizing example input", "aria-describedby":"inputGroup-sizing-sm"})
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"class":"form-control", "aria-label":"Sizing example input", "aria-describedby":"inputGroup-sizing-sm"})
    submit = SubmitField("Zarejestruj", render_kw={"type":"submit", "class":"btn btn-primary"})
    def validate_username(self, username):
        existing_username = User.query.filter_by(
            username=username.data).first()
        if existing_username:
            raise ValidationError("Taki użytkownik już istnieje.")
        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"class":"form-control", "aria-label":"Sizing example input", "aria-describedby":"inputGroup-sizing-sm"})
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"class":"form-control", "aria-label":"Sizing example input", "aria-describedby":"inputGroup-sizing-sm"})
    submit = SubmitField("Zaloguj", render_kw={"type":"submit", "class":"btn btn-primary"})