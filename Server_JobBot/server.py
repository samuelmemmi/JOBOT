from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)


# route pour la demande de connexion
@app.route("/login", methods=["POST"])
def login():
    # connexion à la base de données MongoDB
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]
    # récupération du nom d'utilisateur et du mot de passe
    user_name = request.json.get("userName")
    password = request.json.get("Password")

    # vérification de l'existence du nom d'utilisateur dans la base de données
    user = collection.find_one({"user_name": user_name, "password": password})
    if user:
        return jsonify({"success": True, "message": "Login success"})
    else:
        return jsonify({"success": False, "message": "Username or password incorrect"})


# route for register
@app.route("/register", methods=["POST"])
def register():
    # connexion à la base de données MongoDB
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]
    # récupération du nom d'utilisateur et du mot de passe
    user_name = request.json.get("user_name")
    password = request.json.get("password")
    # {user_name: user_name}

    # vérification de l'existence de l'utilisateur dans la base de données
    existing_user = collection.find_one({"user_name": user_name})
    if existing_user:
        return jsonify({"success": False, "message": "User name already exists"})

    # création d'un nouvel utilisateur dans la base de données
    collection.insert_one({"user_name": user_name, "password": password})
    return jsonify({"success": True, "message": "Your new user is created"})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
