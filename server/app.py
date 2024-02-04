from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/users_vouchers'
mongo = PyMongo(app)

db = mongo.db.users_vouchers
@app.route("/")
def index():
    return '<h1>Hello Flask!</h1>'

if __name__ == '__main__':
    app.run(debug=True)
