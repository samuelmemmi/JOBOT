from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
# import smtplib


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

# route for updating the decision tree
@app.route("/write-json", methods=["POST"])
def writeJson():
    # get the updated decision tree
    json_data=request.json
    # write it to a json file
    with open('../React_JobBot/src/pages/chatBotLogic/decisionTree.json', 'w') as f:
        json.dump(json_data, f)
    return jsonify({"success": False, "message": "The decision tree has been updated"})

# route for sending email to client
# @app.route("/send-email", methods=["POST"])
# def sendEmail():
#     # get the updated decision tree
#     email=request.json.get("email")
#     print(email)

#     # Set up the email server
#     smtp_server = "localhost"
#     smtp_port = 1025  # or 465 for SSL

#     # Login to the email server
#     username = "youremail@gmail.com"
#     password = "yourpassword"
#     sender_email = "youremail@gmail.com"

#     # Create the email message
#     recipient_email = email
#     message_subject = "Test email"
#     message_body = "Hello world!"
#     message = f"Subject: {message_subject}\n\n{message_body}"

#     # Send the email
#     with smtplib.SMTP(smtp_server, smtp_port) as server:
#         server.starttls()
#         server.login(username, password)
#         server.sendmail(sender_email, recipient_email, message)

#     print("Email sent successfully!")
#     return jsonify({"success": False, "message": "The email has been sended"})

# route for getting cities
@app.route("/cities", methods=["POST"])
def getCities():
    areas=request.json.get("areas")
    citiesObject = {"South": ["Ashdod","Qiryat Gat"], "North": ["Haifa"],
        "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                    "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo","Bnei Brak","Holon","Hod HaSharon","Kfar Saba",
                    "Rehovot","Netanya","Ramla","Giv`atayim"]}
    res=[]
    for k in areas:
        if k=="All":
            res+=citiesObject["South"]+citiesObject["North"]+citiesObject["Central"]
            break
        res+=citiesObject[k]    
    return jsonify({"success": True, "cities": res})


def help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list):
    for document in new_documents:
        words2 = set(document["job"].lower().split())

        if len(list_jobs) < 10:
            if len(title) > 1 and len(company) > 1:
                for ti in title:
                    for comp in company:
                        words1 = set(ti.lower().split())
                        are_all_words_present = words1.issubset(words2)
                        if ti != "Other":
                            if document["company"] == comp and are_all_words_present and document[
                                "city"] in city:
                                list_jobs.append(document)
                            elif document["company"] == comp and ti.lower() in document["description"].lower() and \
                                    document["city"] in city:
                                list_jobs.append(document)
                        else:
                            if document["company"] == comp and document["city"] in city:
                                list_jobs.append(document)

            else:
                for comp in company:
                    words1 = set(title[0].lower().split())
                    are_all_words_present = words1.issubset(words2)
                    if title[0] != "Other":
                        if document["company"] == comp and are_all_words_present and document[
                            "city"] in city:
                            list_jobs.append(document)
                    else:
                        if document["company"] == comp and document["job"].lower() not in other_list and document[
                            "city"] in city:
                            list_jobs.append(document)
        else:
            break

    return list_jobs


@app.route("/getfirstjobs", methods=["POST"])
def get_first_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]

    first_list = request.json.get("responses")
    field = first_list["field"]
    time = first_list["job Types"]

    other_list = []
    other_list_healthcare = ["Medical Assistant", "Health representative", "Production Scientist"]
    other_list_marketing = ["Product Marketing", "Data Analyst", "Marketing Designer"]
    other_list_design = ["Designer", "Chip Design Architect", "Front End Developer"]
    other_list_human = ["Digital Key Account", "Global HR Planning & Operations", "Talent Acquisition Specialist"]
    other_list_finance = ["VP Finance", "Business Development", "Finance Controller"]
    other_list_engineer = ["QA Engineer", "Network Engineer", "Software Engineer"]

    if field == "Arts & Design":
        field = "design"
        other_list = other_list_design
    elif field == "Human Resources":
        field = "humanresources"
        other_list = other_list_human
    elif field == "Finance & Accounting":
        field = "finance"
        other_list = other_list_finance
    elif field == "Engineering":
        field = "engineer"
        other_list = other_list_engineer
    elif field == "Healthcare":
        other_list = other_list_healthcare
    else:
        other_list = other_list_marketing

    job = field.lower() + "_" + time[0].lower()
    collection = db[job]

    company = first_list["companies"]
    title = first_list["JobTitles"]

    for i in range(len(title)):
        if title[i] == "Health representative":
            title[i] = "representative"
        elif title[i] == "Production Scientist":
            title[i] = "scientist"
        elif title[i] == "Digital Key Account":
            title[i] = "account"
        elif title[i] == "Global HR Planning & Operations":
            title[i] = "HR Planning"

    areas = first_list["areas"]
    # area_dict = {"South": ["Ashdod", "South"], "North": ["Haifa", "North"],
    #              "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
    #                          "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Central"],
    #              "All": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan", "Rishon LeZiyyon",
    #                      "Tel Aviv", "Tel Aviv-Yafo", "Ashdod", "Haifa", "South", "North", "Central"]}

    area_dict = {"South": ["Ashdod","Qiryat Gat","Southern","South","Israel"], "North": ["Haifa","Northern", "North","Israel"],
                "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                            "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo","Bnei Brak","Holon","Hod HaSharon","Kfar Saba",
                            "Rehovot","Netanya","Ramla","Giv`atayim","Central","Israel"],
                "All": ["All"]}

    city = area_dict[areas[0]]

    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
    list_jobs = []

    if "I'm open to any company" not in company:
        list_jobs = help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list)
        if len(list_jobs) < 10:
            company.append("I'm open to any company")
        else:
            return jsonify({"success": True, "list_jobs": list_jobs})

    for document in new_documents:
        words2 = set(document["job"].lower().split())

        if len(list_jobs) < 10:
            if len(title) > 1 and len(company) > 1:
                for ti in title:
                    for comp in company:
                        words1 = set(ti.lower().split())
                        are_all_words_present = words1.issubset(words2)
                        if ti != "Other":
                            if comp == "I'm open to any company":
                                if are_all_words_present and ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)
                                elif ti.lower() in document["description"].lower() and ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)
                            else:
                                if document["company"] == comp and are_all_words_present and ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)
                                elif document["company"] == comp and ti.lower() in document["description"].lower() and \
                                        ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)
                        else:
                            if comp == "I'm open to any company":
                                if ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)
                            else:
                                if document["company"] == comp and ((document["city"] in city) or (city[0]=="All")):
                                    list_jobs.append(document)

            else:
                for comp in company:
                    words1 = set(title[0].lower().split())
                    are_all_words_present = words1.issubset(words2)
                    if title[0] != "Other":
                        if comp != "I'm open to any company":
                            if document["company"] == comp and are_all_words_present and ((document["city"] in city) or (city[0]=="All")):
                                list_jobs.append(document)
                        else:
                            if are_all_words_present and ((document["city"] in city) or (city[0]=="All")):
                                list_jobs.append(document)
                    else:
                        if comp != "I'm open to any company":
                            if document["company"] == comp and document["job"].lower() not in other_list and ((document["city"] in city) or (city[0]=="All")):
                                list_jobs.append(document)
                        else:
                            if document["job"].lower() not in other_list and ((document["city"] in city) or (city[0]=="All")):
                                list_jobs.append(document)
        else:
            break

    if time[0].lower() == "part_time" and len(list_jobs) < 10:
        job2 = field.lower() + "_" + "intern"
        collection2 = db[job2]
        # Find all documents in the collection
        documents2 = collection2.find()
        # Create a new list of dictionaries with all fields except "id"
        new_documents2 = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents2]
        for doc in new_documents2:
            if len(list_jobs) < 10 and doc["job"] != "":
                list_jobs.append(doc)

    seen_jobs = set()
    unique_jobs = []

    for job in list_jobs:
        job_id = (job['job'], job['company'], job['city'])
        if job_id not in seen_jobs:
            seen_jobs.add(job_id)
            unique_jobs.append(job)

    return jsonify({"success": True, "list_jobs": unique_jobs})


def get_jobs_from_view(jobs, db):
    listt = []
    for j in jobs:
        collection = db[j]
        # Find all jobs in the design collection
        documents = collection.find()
        # Create a new list of dictionaries with all fields except "id"
        new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
        for document in new_documents:
            listt.append(document)
    # Convert each dictionary to a tuple, add all tuples to a set, then convert each tuple back to a dictionary
    listt = [dict(t) for t in set([tuple(d.items()) for d in listt])]
    return listt


@app.route("/viewjobs", methods=["POST"])
def view_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    design_jobs = ["design_full_time", "design_part_time", "design_intern", "design_junior", "design_senior"]
    engineer_jobs = ["engineer_full_time", "engineer_part_time", "engineer_intern", "engineer_junior",
                     "engineer_senior"]
    finance_jobs = ["finance_full_time", "finance_part_time", "finance_intern", "finance_junior", "finance_senior"]
    healthcare_jobs = ["healthcare_full_time", "healthcare_part_time", "healthcare_intern", "healthcare_junior",
                       "healthcare_senior"]
    marketing_jobs = ["marketing_full_time", "marketing_part_time", "marketing_intern", "marketing_junior",
                      "marketing_senior"]
    humanresources_jobs = ["humanresources_full_time", "humanresources_part_time", "humanresources_intern",
                           "humanresources_junior", "humanresources_senior"]

    list_design = get_jobs_from_view(design_jobs, db)
    list_engineer = get_jobs_from_view(engineer_jobs, db)
    list_finance = get_jobs_from_view(finance_jobs, db)
    list_healthcare = get_jobs_from_view(healthcare_jobs, db)
    list_marketing = get_jobs_from_view(marketing_jobs, db)
    list_humanresources = get_jobs_from_view(humanresources_jobs, db)
    total_list = list_humanresources + list_marketing + list_healthcare + list_design + list_finance + list_engineer
    return jsonify({"success": True, "total_list": total_list})


@app.route("/viewusers", methods=["POST"])
def view_users():
    users_list = []
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]

    # Find all user in the collection users
    documents = collection.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
    for document in new_documents:
        users_list.append(document)

    return jsonify({"success": True, "users_list": users_list})


def find_best_job(field):
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db[field]

    # Use aggregation to group by company and count the number of jobs per company
    pipeline = [
        {"$group": {"_id": "$company", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 15}
    ]

    # Execute the pipeline and get the results
    results = list(collection.aggregate(pipeline))

    # Print the top 5 companies
    for result in results:
        print(result["_id"], result["count"])


def find_best_title(field):
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db[field]

    # Use aggregation to group by company and count the number of jobs per company
    pipeline = [
        {"$group": {"_id": "$job", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 15}
    ]

    # Execute the pipeline and get the results
    results = list(collection.aggregate(pipeline))

    # Print the top 5 companies
    for result in results:
        print(result["_id"], result["count"])


if __name__ == "__main__":
    # find_best_title("healthcare_full_time")
    # find_best_title("marketing_full_time")
    # find_best_title("finance_full_time")
    # find_best_title("design_full_time")
    # find_best_title("humanresources_full_time")
    # find_best_title("engineer_full_time")

    # find_best_job("healthcare_full_time")
    # find_best_job("marketing_full_time")
    # find_best_job("finance_full_time")
    # find_best_job("design_full_time")
    # find_best_job("humanresources_full_time")
    # find_best_job("engineer_full_time")

    app.run(port=5000, debug=True)
