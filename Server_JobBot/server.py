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


@app.route("/getfirstjobs", methods=["POST"])
def get_first_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]

    first_list = request.json.get("responses")
    field = first_list["field"]
    time = first_list["job Types"]

    if field == "Arts & Design":
        field = "design"
    if field == "Human Resources":
        field = "humanresources"
    if field == "Finance & Accounting":
        field = "finance"
    if field == "Engineering":
        field = "engineer"

    job = field.lower() + "_" + time[0].lower()
    collection = db[job]

    company = first_list["companies"]
    title = first_list["JobTitles"]
    areas = first_list["areas"]
    area_dict = {"South": "Ashdod", "North": "Haifa",
                 "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                             "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo"],
                 "All": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan", "Rishon LeZiyyon",
                         "Tel Aviv", "Tel Aviv-Yafo", "Ashdod", "Haifa"]}

    city = area_dict[areas[0]]

    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
    list_jobs = []

    for document in new_documents:

        if len(list_jobs) < 15:
            if "Other" in company and "Other" in title:
                if document["city"] in city:
                    list_jobs.append(document)
            else:
                if len(title) > 1 and len(company) > 1:
                    for ti, comp in zip(title, company):
                        if "Other" in title and "Other" not in company:
                            if document["company"] == comp and document["city"] in city:
                                list_jobs.append(document)
                        elif "Other" in company and "Other" not in title:
                            if ti.lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)
                        else:
                            if document["company"] == comp and ti.lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)

                elif len(title) == 1 and len(company) > 1:
                    for comp in company:
                        if "Other" in title and "Other" not in company:
                            if document["company"] == comp and document["city"] in city:
                                list_jobs.append(document)
                        elif "Other" in company and "Other" not in title:
                            if title[0].lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)
                        else:
                            if document["company"] == comp and title[0].lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)

                elif len(title) > 1 and len(company) == 1:
                    for ti in title:
                        if "Other" in title and "Other" not in company:
                            if document["company"] == company[0] and document["city"] in city:
                                list_jobs.append(document)
                        elif "Other" in company and "Other" not in title:
                            if ti.lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)
                        else:
                            if document["company"] == company[0] and ti.lower() in document["job"].lower() and document["city"] in city:
                                list_jobs.append(document)

                else:
                    if title[0] == "Other" and company[0] != "Other":
                        if document["company"] == company[0] and document["city"] in city:
                            list_jobs.append(document)
                    elif company[0] == "Other" and title[0] != "Other":
                        if title[0].lower() in document["job"].lower() and document["city"] in city:
                            list_jobs.append(document)
                    else:
                        if document["company"] == company[0] and title[0].lower() in document["job"].lower() and document["city"] in city:
                            list_jobs.append(document)
        else:
            break

    # Return the list of matching jobs to the client
    return jsonify({"success": True, "list_jobs": list_jobs})


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
