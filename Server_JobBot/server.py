from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
from flask import session
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import openai

# initialize NLTK libraries
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

app = Flask(__name__)
app.secret_key = 'secret-key-'


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


@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, no-store'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    response = jsonify({'success': True})
    response.delete_cookie('session')
    return response


# route for updating the decision tree
@app.route("/write-json", methods=["POST"])
def writeJson():
    # get the updated decision tree
    json_data = request.json
    # write it to a json file
    with open('../React_JobBot/src/pages/chatBotLogic/decisionTree.json', 'w') as f:
        json.dump(json_data, f)
    return jsonify({"success": False, "message": "The decision tree has been updated"})


def help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list):
    for document in new_documents:
        words2 = set(document["job"].lower().split())

        if len(list_jobs) < 15:
            if len(title) > 1 and len(company) > 1:
                for ti in title:
                    for comp in company:
                        words1 = set(ti.lower().split())
                        are_all_words_present = words1.issubset(words2)
                        if ti != "Other":
                            if document["company"] == comp and are_all_words_present and document[
                                "city"] in city:
                                list_jobs.append(document)
                            elif document["company"] == comp and ti.lower() in all(
                                    word in document["description"].lower() for word in words1) and \
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
                        elif all(word in document["description"].lower() for word in words1) and document[
                            "company"] == comp and document[
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
        elif title[i] == "Talent Acquisition Specialist":
            title[i] = "Talent Specialist"
        elif title[i] == "Chip Design Architect":
            title[i] = "Chip Design"

    areas = first_list["areas"]
    area_dict = {"South": ["Qiryat Gat", "Ashdod", "South", "Southern", "Israel"],
                 "North": ["Haifa", "North", "Northern", "Israel"],
                 "Central": ["Central", "Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                             "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                             "Bnei Brak", "Giv`atayim", "Israel", "Lod", "Holon", "Yavne", "Ness Ziona"],
                 "All": ["Haifa", "North", "Northern", "Ashdod", "South", "Southern", "Central", "Herzliya",
                         "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                         "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                         "Bnei Brak", "Giv`atayim", "Israel", "Lod", "Holon", "Yavne", "Ness Ziona"]}

    city = []
    for i in range(len(areas)):
        city.append(area_dict[areas[i]])
    city = [item for sublist in city for item in sublist]

    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
    list_jobs = []

    if "I'm open to any company" not in company:
        list_jobs = help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list)
        if len(list_jobs) < 15:
            company.append("I'm open to any company")
        else:
            return jsonify({"success": True, "list_jobs": list_jobs})

    for document in new_documents:
        words2 = set(document["job"].lower().split())

        if len(list_jobs) < 15:
            if len(title) > 1 and len(company) > 1:
                for ti in title:
                    for comp in company:
                        words1 = set(ti.lower().split())
                        are_all_words_present = words1.issubset(words2)
                        if ti != "Other":
                            if comp == "I'm open to any company":
                                if are_all_words_present and document["city"] in city:
                                    list_jobs.append(document)
                                elif all(word in document["description"].lower() for word in words1) and document[
                                    "city"] in city:
                                    list_jobs.append(document)
                            else:
                                if document["company"] == comp and are_all_words_present and document[
                                    "city"] in city:
                                    list_jobs.append(document)
                                elif document["company"] == comp and all(
                                        word in document["description"].lower() for word in words1) and \
                                        document["city"] in city:
                                    list_jobs.append(document)
                        else:
                            if comp == "I'm open to any company":
                                if document["city"] in city:
                                    list_jobs.append(document)
                            else:
                                if document["company"] == comp and document["city"] in city:
                                    list_jobs.append(document)

            else:
                for comp in company:
                    words1 = set(title[0].lower().split())
                    are_all_words_present = words1.issubset(words2)
                    if title[0] != "Other":
                        if comp != "I'm open to any company":
                            if document["company"] == comp and are_all_words_present and document[
                                "city"] in city:
                                list_jobs.append(document)
                            elif document["company"] == comp and all(
                                    word in document["description"].lower() for word in words1) and document[
                                "city"] in city:
                                list_jobs.append(document)
                        else:
                            if are_all_words_present and document["city"] in city:
                                list_jobs.append(document)
                            elif all(word in document["description"].lower() for word in words1) and document[
                                "city"] in city:
                                list_jobs.append(document)
                    else:
                        if comp != "I'm open to any company":
                            if document["company"] == comp and document["job"].lower() not in other_list and document[
                                "city"] in city:
                                list_jobs.append(document)
                        else:
                            if document["job"].lower() not in other_list and document["city"] in city:
                                list_jobs.append(document)
        else:
            break

    if time[0].lower() == "part_time" and len(list_jobs) < 15:
        job2 = field.lower() + "_" + "intern"
        collection2 = db[job2]
        # Find all documents in the collection
        documents2 = collection2.find()
        # Create a new list of dictionaries with all fields except "id"
        new_documents2 = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents2]
        for doc in new_documents2:
            if len(list_jobs) < 15 and doc["job"] != "":
                list_jobs.append(doc)

    seen_jobs = set()
    unique_jobs = []
    counter = 0

    for job in list_jobs:
        job_id = (job['job'], job['company'], job['city'])
        if job_id not in seen_jobs:
            seen_jobs.add(job_id)
            counter += 1
            job['id'] = counter
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


def find_best_city(field):
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db[field]

    # Use aggregation to group by company and count the number of jobs per company
    pipeline = [
        {"$group": {"_id": "$city", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 15}
    ]

    # Execute the pipeline and get the results
    results = list(collection.aggregate(pipeline))

    # Print the top 5 companies
    for result in results:
        print(result["_id"], result["count"])


# preprocess user response
def preprocess(response):
    # tokenize user response
    tokens = nltk.word_tokenize(response.lower())
    # remove stop words
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [token for token in tokens if token not in stop_words]
    # apply lemmatization
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
    # return preprocessed response
    return " ".join(lemmatized_tokens)


# function to identify user intent based on keywords
def identify_intent(response):
    # initialize list of identified intents
    intents = []
    # check for navigation-related keywords
    if "navigation" in response:
        if "easy" in response or "simple" in response:
            intents.append("easy navigation")
        elif "complicated" in response or "difficult" in response or "hard" in response:
            intents.append("difficult navigation")
    # check for simplicity-related keywords
    if "system" in response:
        if "simple" in response or "easy" in response or "good" in response:
            intents.append("simple system")
        elif "complicated" in response or "difficult" in response or "hard" in response:
            intents.append("complicated system")
    # check for display-related keywords
    if "displaying jobs" in response:
        if "attractive" in response or "nice" in response or "good" in response:
            intents.append("attractive display")
        elif "grotesque" in response or "ugly" in response or "unattractive" in response:
            intents.append("ugly display")
    if "job" in response:
        if "not" in response or "enough" in response:
            intents.append("jobs problems")
        else:
            intents.append("jobs good")
    if "search" in response:
        if "not relevant" in response or "accurate enough" in response:
            intents.append("search problems")
    # return list of identified intents
    return intents


# function to extract relevant information for each intent
def extract_info(intents, number):
    # initialize dictionary to store extracted information
    info = {}
    # extract relevant information for each identified intent
    for intent in intents:
        if intent == "easy navigation":
            info[intent] = "Great! I'm glad you find the navigation easy."
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "difficult navigation":
            info[intent] = "I'm sorry to hear that you find the navigation difficult. Have you tried using the search " \
                           "function to find job offers? "
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "simple system":
            info[intent] = "That's great to hear! We always strive to make our system simple and easy to use."
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "complicated system":
            info[
                intent] = "I'm sorry to hear that. We are constantly working on improving our system to make it more " \
                          "user-friendly. "
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "attractive display":
            info[
                intent] = "That's great to hear! We always try to make our job displays as attractive and informative " \
                          "as possible. "
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "ugly display":
            info[intent] = "I'm sorry to hear that. We are always looking for ways to improve our job displays."
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "jobs goods":
            info[
                intent] = "That's great to hear! We always try to make our job as attractive and informative " \
                          "as possible. "
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "jobs problems":
            info[intent] = "I'm sorry to hear that. We are always looking for ways to improve our job displays."
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
        elif intent == "search problems":
            info[intent] = "I'm sorry to hear that. We are always looking for ways to improve our search displays."
            if intent in number:
                number[intent] += 1
            else:
                number[intent] = 1
    # return dictionary of extracted information
    return info


def test_response(responses):
    number = {}
    # iterate over each response in the list
    for response in responses:
        # preprocess response
        # preprocessed_response = preprocess(response)
        # identify intent based on preprocessed response
        intents = identify_intent(response)
        # extract relevant information for each intent
        info = extract_info(intents, number)
        # print extracted information for each response
        print(f"User response: {response}")
        for intent, response in info.items():
            print(response)
        print()
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                              "&w=majority")
    db = cluster["chatbot"]
    collection = db["statistics"]
    number_list = [{'intent': key, 'count': value} for key, value in number.items()]
    collection.insert_many(number_list)


def chatgpt(question):
    API_KEY = open("API_KEY.txt", "r").read().strip()
    openai.api_key = API_KEY
    chat_log = [{"role": "user", "content": question}]
    response = openai.ChatCompletion.create(model="davinci", messages=chat_log)
    assistant_response = response['choices'][0]['message']['content']
    print("chatgpt: ", assistant_response.strip("\n").strip())
    chat_log.append({"role": "assistant", "content": assistant_response.strip("\n").strip()})


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

    # find_best_city("healthcare_full_time")
    # find_best_city("marketing_full_time")
    # find_best_city("finance_full_time")
    # find_best_city("design_full_time")
    # find_best_city("humanresources_full_time")
    # find_best_city("engineer_full_time")
    app.run(port=5000, debug=True)
    # example usage
    # "Why don't you want offers anymore?
    # (Type in terms of easy/difficult navigation, simplicity of the system, displaying jobs)"

    """responses = ["The navigation is confusing and difficult to use.",
                 "I'm having trouble finding what I'm looking for on the site.",
                 "The system is too complicated and hard to navigate.",
                 "The job postings are not clear or informative enough.",
                 "The site is too cluttered and overwhelming to use.",
                 "I'm not finding the information I need on the job postings.",
                 "The site is not user-friendly and needs improvement.",
                 "The job descriptions are not detailed enough.", "The site is slow and unresponsive.",
                 "The site layout is confusing and hard to follow.",
                 "The job postings are not visually appealing or well-designed.",
                 "The search results are not relevant or accurate enough.", "The navigation is difficult but the "
                                                                            "system is quite good", "The navigation is easy"]

    test_response(responses)"""

    # chatgpt("Is python a interpreter language?")