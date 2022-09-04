from flask import Flask
from website import create_app

app = create_app()
app.debug = True

if __name__ == "__main__":
    app.run(host = '0.0.0.0')