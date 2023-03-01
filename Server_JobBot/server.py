from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)


# route for login
@app.route("/login", methods=["POST"])
def login():
    # login to the MongoDB
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]

    # get the username and password
    user_name = request.json.get("userName")
    password = request.json.get("Password")

    # check if the user is already existing
    user = collection.find_one({"user_name": user_name, "password": password})

    if user:
        # check if the user is admin or client
        if user_name == "samuel" or user_name == "rachel":
            return jsonify({"success": True, "message": "Admin login success"})

        return jsonify({"success": True, "message": "Client login success"})

    else:
        return jsonify({"success": False, "message": "Username or password incorrect"})


# route for register
@app.route("/register", methods=["POST"])
def register():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]

    # get the username and password
    user_name = request.json.get("user_name")
    password = request.json.get("password")

    # check if the user is already existing
    existing_user = collection.find_one({"user_name": user_name})
    if existing_user:
        return jsonify({"success": False, "message": "User name already exists"})

    # this user is new, so we add him to the DB
    collection.insert_one({"user_name": user_name, "password": password})
    return jsonify({"success": True, "message": "Your new user is created"})


def get_first_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]

    """first_list = get
    field = first_list["job"]
    time = first_list["time"]
    job = field + "_" + time
    collection = db[job]

    company = first_list["com"]
    title = first_list["title"]
    city = first_list["city"]

    # Find all documents in the collection
    documents = collection.find()
    for document in documents:
        print(document)

    # Find a document with a specific ID
    document = collection.find_one({"company": company, "job": title, "city": city})"""


def view_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    design_jobs = ["design_full_time", "design_part_time", "design_intern", "design_junior", "design_senior"]

    for design in design_jobs:
        collection = db[design]
        # Find all jobs in the design collection
        documents = collection.find()
        for document in documents:
            print(document)

    engineer_jobs = ["engineer_full_time", "engineer_part_time", "engineer_intern", "engineer_junior",
                     "engineer_senior"]
    finance_jobs = ["finance_full_time", "finance_part_time", "finance_intern", "finance_junior", "finance_senior"]
    healthcare_jobs = ["healthcare_full_time", "healthcare_part_time", "healthcare_intern", "healthcare_junior",
                       "healthcare_senior"]
    marketing_jobs = ["marketing_full_time", "marketing_part_time", "marketing_intern", "marketing_junior",
                      "marketing_senior"]
    humanresources_jobs = ["humanresources_full_time", "humanresources_part_time", "humanresources_intern",
                           "humanresources_junior", "humanresources_senior"]


def view_clients():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]

    # Find all user in the collection users
    documents = collection.find()
    for document in documents:
        print(document)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
