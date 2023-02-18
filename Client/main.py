from flask import Flask
from website import create_app

app = create_app()

if __name__ == "__main__":
    app.debug = True
    app.run(host = '0.0.0.0')