from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
from flask import session
import openai
import time
from datetime import date
import copy
import key

SECRET_KEY = 'secret-key-'
app = Flask(__name__)
app.secret_key = SECRET_KEY

# CONSTANTS
MONGODB_CONNECTION_STRING = "mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true&w=majority"
NUMBER_OF_ADMINS = 2
BOT_DECISION_TREE_PATH = '../React_JobBot/src/pages/chatBotLogic/decisionTree.json'
CITIES_AND_AREAS = {"South": ["Qiryat Gat", "Ashdod", "South", "Southern", "Israel"],
                    "North": ["Haifa", "North", "Northern", "Israel"],
                    "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                                "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                                "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona", "Central", "Israel"],
                    "All": ["Haifa", "North", "Northern", "Qiryat Gat", "Ashdod", "South", "Southern", "Herzliya",
                            "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                            "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                            "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona", "Central", "Israel"]}
MAXIMUM_JOBS_FOR_DISPLAYING = 15
CLUSTER_NAME = "chatbot"
MAX_JOBS_FOR_GPT = 6


GENERAL_STATS = {"areas": {"South": 0, "North": 0, "Central": 0}, "job Types": {"Part_time": 0, "Full_time": 0}, \
                   "field": {"Engineering": 0, "Marketing": 0, "Human Resources": 0, "Healthcare": 0,
                             "Arts & Design": 0, "Finance & Accounting": 0, "Other": 0}, \
                   "experience level": {"Intern": 0, "Junior": 0, "Senior": 0, "Other": 0}}
JOBOT_RESPONSE_FOR_FEEDBACK_1 = "I'm glad to hear you found a job"
JOBOT_RESPONSE_FOR_FEEDBACK_2 = "Thanks for the feedback. We are always looking for ways to improve our services."
INTENTS_TO_CHECK = ["I found enough jobs here", "I prefer self job search", "I'm interested in a shorter process"]

MAX_SECONDS_FOR_SLEEPING = 20  # 12

OTHER_LIST_HEALTHCARE = ["medical assistant", "health representative", "production scientist"]
OTHER_LIST_MARKETING = ["product marketing", "data analyst", "marketing designer"]
OTHER_LIST_DESIGN = ["designer", "chip design architect", "front end developer"]
OTHER_LIST_HUMAN = ["digital key account", "global hr planning & operations", "talent acquisition specialist"]
OTHER_LIST_FINANCE = ["vp finance", "business development", "finance controller"]
OTHER_LIST_ENGINEER = ["qa engineer", "network engineer", "software engineer"]

TITLE_MAPPINGS = {
    "Health representative": "representative",
    "Production Scientist": "scientist",
    "Digital Key Account": "account",
    "Global HR Planning & Operations": "HR Planning",
    "Talent Acquisition Specialist": "Talent Specialist",
    "Chip Design Architect": "Chip Design"
}

DESIGN_JOBS = ["design_full_time", "design_part_time", "design_intern", "design_junior", "design_senior"]
ENGINEER_JOBS = ["engineer_full_time", "engineer_part_time", "engineer_intern", "engineer_junior",
                 "engineer_senior"]
FINANCE_JOBS = ["finance_full_time", "finance_part_time", "finance_intern", "finance_junior", "finance_senior"]
HEALTHCARE_JOBS = ["healthcare_full_time", "healthcare_part_time", "healthcare_intern", "healthcare_junior",
                   "healthcare_senior"]
MARKETING_JOBS = ["marketing_full_time", "marketing_part_time", "marketing_intern", "marketing_junior",
                  "marketing_senior"]
HUMAN_JOBS = ["humanresources_full_time", "humanresources_part_time", "humanresources_intern",
              "humanresources_junior", "humanresources_senior"]


def get_collection_by_field(field):
    # connection to the MongoDB database
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]
    collection = db[field]
    return collection


# route for login
@app.route("/login", methods=["POST"])
def login():
    # connection to the MongoDB database
    collection = get_collection_by_field("users")
    # get the username and password
    user_name = request.json.get("userName")
    password = request.json.get("Password")
    # check if the user is already existing
    user = collection.find_one({"user_name": user_name, "password": password})
    if user:
        # check if the user is admin or client
        if "admin" in user and user["admin"] == "Yes":
            return jsonify({"success": True, "message": "Admin login success"})
        else:
            return jsonify({"success": True, "message": "Client login success"})
    else:
        return jsonify({"success": False, "message": "Username or password incorrect"})


# route for register
@app.route("/register", methods=["POST"])
def register():
    # get the username and password
    user_name = request.json.get("user_name")
    password = request.json.get("password")
    # check if username or password are valid
    if user_name == "" or password == "":
        return jsonify({"success": False, "message": "Invalid username or password"})

    # connexion to the MongoDB database
    collection = get_collection_by_field("users")
    # check if the user is already existing
    existing_user = collection.find_one({"user_name": user_name, "password": password})
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
    with open(BOT_DECISION_TREE_PATH, 'w') as f:
        json.dump(json_data, f)
    return jsonify({"success": False, "message": "The decision tree has been updated"})


# route for getting cities
@app.route("/cities", methods=["POST"])
def getCities():
    areas = request.json.get("areas")
    areas_to_remove = ["Central", "North", "Northern", "South", "Southern", "Israel"]
    # TODO: Check for edge cases! something + "All" as unit test
    res = getCitiesFromAreas(areas, areas_to_remove)
    return jsonify({"success": True, "cities": res})


def what_field(field):
    field_mappings = {
        "arts & design": ("design", OTHER_LIST_DESIGN),
        "human resources": ("humanresources", OTHER_LIST_HUMAN),
        "finance & accounting": ("finance", OTHER_LIST_FINANCE),
        "engineering": ("engineer", OTHER_LIST_ENGINEER),
        "healthcare": ("Healthcare", OTHER_LIST_HEALTHCARE)
    }
    lowercase_field = field.lower()
    if lowercase_field in field_mappings:
        field, other_list = field_mappings[lowercase_field]
    else:
        raise ValueError("Invalid field: " + field)

    return other_list, field


def getCitiesFromAreas(areas, areas_to_remove):
    res = []
    if "All" in areas:
        res += list(set(CITIES_AND_AREAS["All"]) - set(areas_to_remove))
    else:
        for area in areas:
            res += CITIES_AND_AREAS[area]
        res = list(set(res) - set(areas_to_remove))
    return res


def is_company_eligible(document, titles, companies, cities, other_list):
    job_words = set(document["job"].lower().split())
    company_doc = document["company"]
    city_doc = document["city"]

    if "Other" in titles:
        if company_doc in companies and city_doc in cities and \
                document["job"].lower() not in other_list:
            return True
    else:
        for job_title in titles:
            title_words = set(job_title.lower().split())
            if company_doc in companies and city_doc in cities:
                if title_words.issubset(job_words) or \
                        all(word in document["description"].lower() for word in title_words):
                    return True
    return False

def filter_jobs_company(new_documents, list_jobs, titles, companies, cities, other_list):
    for document in new_documents:
        if len(list_jobs) >= MAXIMUM_JOBS_FOR_DISPLAYING:
            break

        if is_company_eligible(document, titles, companies, cities, other_list):
            list_jobs.append(document)
    return list_jobs


def help_get_first_jobs_from_gpt(request_details, unique_jobs):
    # connexion to the MongoDB database
    collection = get_collection_by_field("users")
    userDetails = {"user_name": request_details["client details"]["userName"],
                   "password": request_details["client details"]["password"]}
    user = collection.find_one(userDetails)

    # search in client histories if there are his experiance & education in the selected field
    experi_educa = "-"
    if "history" in user:
        histories_list = user["history"]
        # go through the list of histories starting from the most recent history to the oldest
        for history in reversed(histories_list):
            # print(history['field'])
            if history["field"] == request_details["field"]:
                experi_educa = history["experiance & education"]
                if experi_educa != "-":
                    break

    # call chatgpt with the experiance & education we found
    gpt_list = unique_jobs
    if len(unique_jobs) != 0 and experi_educa != "-":
        gpt_list = get_jobs_from_chatGpt(unique_jobs, experi_educa)

    return gpt_list


def str_convert(documents):
    # Create a new list of dictionaries with all fields and "id" converted to str
    new_documents = [{k: (str(v) if k == '_id' else v) for k, v in doc.items()} for doc in documents]
    return new_documents


@app.route("/getfirstjobs", methods=["POST"])
def get_first_jobs():
    request_details = request.json.get("responses")
    field = request_details["field"]
    job_type = request_details["job Types"]

    other_list, field = what_field(field)

    job = field.lower() + "_" + job_type[0].lower()
    collection = get_collection_by_field(job)

    company = request_details["companies"]
    title = request_details["JobTitles"]

    for i in range(len(title)):
        if title[i] in TITLE_MAPPINGS:
            title[i] = TITLE_MAPPINGS[title[i]]

    areas = request_details["areas"]
    citiesByAreas = getCitiesFromAreas(areas, [])

    # connection to the MongoDB database
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]

    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields and "id" converted to str
    new_documents = str_convert(documents)
    list_jobs = []
    unique_jobs = help_get_first_jobs(new_documents, list_jobs, title, company, citiesByAreas, other_list,
                                      job_type, field,
                                      db)
    gpt_list = help_get_first_jobs_from_gpt(request_details, unique_jobs)

    return jsonify({"success": True, "list_jobs": gpt_list})


def is_document_eligible(document, titles, cities, other_list):
    job_words = set(document["job"].lower().split())
    city_doc = document["city"]

    if "Other" in titles:
        if city_doc in cities and document["job"].lower() not in other_list:
            return True
    else:
        for job_title in titles:
            title_words = set(job_title.lower().split())
            if title_words.issubset(job_words) and city_doc in cities:
                return True
            elif all(word in document["description"].lower() for word in title_words) and city_doc in cities:
                return True
    return False


def filter_jobs(new_documents, list_jobs, titles, cities, other_list):
    for document in new_documents:
        if len(list_jobs) >= MAXIMUM_JOBS_FOR_DISPLAYING:
            break

        if is_document_eligible(document, titles, cities, other_list):
            list_jobs.append(document)

    return list_jobs


def help_part_time(field, db, list_jobs):
    job2 = field.lower() + "_" + "intern"
    collection2 = db[job2]
    # Find all documents in the collection
    documents2 = collection2.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents2 = str_convert(documents2)
    for doc in new_documents2:
        if len(list_jobs) < MAXIMUM_JOBS_FOR_DISPLAYING and doc["job"] != "":
            list_jobs.append(doc)
    return list_jobs


def help_get_first_jobs(new_documents, list_jobs, titles, companies, cities, other_list, time, field, db):
    if "I'm open to any company" not in companies:
        list_jobs = filter_jobs_company(new_documents, list_jobs, titles, companies, cities, other_list)

        if len(list_jobs) >= MAXIMUM_JOBS_FOR_DISPLAYING:
            return list_jobs

    list_jobs = filter_jobs(new_documents, list_jobs, titles, cities, other_list)

    if time[0].lower() == "part_time" and len(list_jobs) < MAXIMUM_JOBS_FOR_DISPLAYING:
        list_jobs = help_part_time(field, db, list_jobs)

    set_res = set([job["_id"] for job in list_jobs])
    unique_jobs = []
    for id in set_res:
        for job in list_jobs:
            if job["_id"] == id:
                unique_jobs.append(job)
                break

    return unique_jobs


def getJobString(job,index):
    job_string = "This is the " + str(index) + " job\n" + "job title: " + job['job'] +\
    ", job description: " + job['description'] + "\n"
    return job_string

def getQuestionForGPT(experience_education,jobs_string):
    question = "I have a person who his experience and education are: '" + experience_education + "'" \
            ". Are the description jobs below fit for him: " + jobs_string + \
            "Return an answer according to the following template: 'job #: Yes' if this job is fit and 'job #: No' else."
    return question

def appendApprovedJobs(potential_jobs,index,response_gpt,gpt_list):
    for job in potential_jobs:
        if (str(index) + ": Yes") in response_gpt:
            gpt_list.append(job)
        index+=1

def chatgptConnection(question):
    API_KEY = key.api_key
    openai.api_key = API_KEY
    chat_log = [{"role": "user", "content": question}]
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=chat_log)
    assistant_response = response['choices'][0]['message']['content']
    print("chatgpt: ", assistant_response.strip("\n").strip())
    chat_log.append({"role": "assistant", "content": assistant_response.strip("\n").strip()})
    return assistant_response.strip("\n").strip()

# use chatgpt to get more precise job (use experience and education)
def get_jobs_from_chatGpt(unique_jobs, experience_education):
    print("len of jobs")
    print(len(unique_jobs))
    gpt_list = []
    index = 1
    # If there are more than MAX_JOBS_FOR_GPT jobs, we will not use chatgpt for the last rest jobs
    if len(unique_jobs) > MAX_JOBS_FOR_GPT:
        temp_len = MAX_JOBS_FOR_GPT
    else:
        temp_len = len(unique_jobs)
    lengt = int((temp_len / 2) * 2)
    for i in range(0, lengt, 2):
        if i+1<lengt:
            jobs_string = getJobString(unique_jobs[i],index) + getJobString(unique_jobs[i+1],index+1)
        else:
            jobs_string = getJobString(unique_jobs[i],index)
        question = getQuestionForGPT(experience_education,jobs_string)
        response_gpt = chatgptConnection(question)

        if i+1<lengt:
            potential_jobs=[unique_jobs[i],unique_jobs[i+1]]
            appendApprovedJobs(potential_jobs,index,response_gpt,gpt_list)
            if (i + 1 != (lengt - 1)):
                time.sleep(MAX_SECONDS_FOR_SLEEPING) 
        else:
            potential_jobs=[unique_jobs[i]]
            appendApprovedJobs(potential_jobs,index,response_gpt,gpt_list)
            if (i != (lengt - 1)) :
                time.sleep(MAX_SECONDS_FOR_SLEEPING)
        index += 2

    # if there are more than 6 jobs in unique_jobs we also send to client from the seventh job onwards
    j = MAX_JOBS_FOR_GPT
    for j in range(j, len(unique_jobs)):
        print("rest indexes")
        print(j)
        gpt_list.append(unique_jobs[j])
    return gpt_list


@app.route("/getsecondjobs", methods=["POST"])
def get_second_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]
    second_list = request.json.get("responses")
    field = second_list["field"]
    display_jobs = second_list["displayed jobs"]
    id = 0

    other_list, field = what_field(field)

    company = second_list["companies"]

    if "additional job title" in second_list:
        jobtitle = second_list["additional job title"]
        jobtitle = [jobtitle] + second_list["JobTitles"]
    else:
        jobtitle = second_list["JobTitles"]

    if "experience level" in second_list:
        level = second_list["experience level"]
    else:
        level = second_list["job Types"]
        id = 1

    if "cities" in second_list:
        citiesByAreas = second_list["cities"]
    else:
        areas = second_list["areas"]
        citiesByAreas=getCitiesFromAreas(areas,[])

    if "job Requirements" in second_list:
        requirements = second_list["job Requirements"]
    else:
        requirements = ""

    job = field.lower() + "_" + level[0].lower()
    collection = get_collection_by_field(job)
    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields and "id" converted to str
    new_documents = str_convert(documents)
    list_jobs = []

    unique_jobs = help_get_first_jobs(new_documents, list_jobs, jobtitle, company, citiesByAreas, other_list, level,field,db)

    display_jobs_ids = [job["_id"] for job in display_jobs]
    unique_jobs_second_jobs = [job for job in unique_jobs if job["_id"] not in display_jobs_ids]

    gpt_list = []
    if len(unique_jobs_second_jobs) != 0:
        gpt_list = get_jobs_from_chatGpt(unique_jobs_second_jobs, requirements)
    # UNIT TEST #
    return jsonify({"success": True, "list_jobs": gpt_list})


def get_jobs_from_view(jobs, db):
    listt = []
    for j in jobs:
        collection = db[j]
        # Find all jobs in the design collection
        documents = collection.find()
        # Create a new list of dictionaries with all fields except "id"
        new_documents = str_convert(documents)
        for document in new_documents:
            listt.append(document)
    # Convert each dictionary to a tuple, add all tuples to a set, then convert each tuple back to a dictionary
    listt = [dict(t) for t in set([tuple(d.items()) for d in listt])]
    return listt


@app.route("/viewjobs", methods=["POST"])
def view_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]

    list_design = get_jobs_from_view(DESIGN_JOBS, db)
    list_engineer = get_jobs_from_view(ENGINEER_JOBS, db)
    list_finance = get_jobs_from_view(FINANCE_JOBS, db)
    list_healthcare = get_jobs_from_view(HEALTHCARE_JOBS, db)
    list_marketing = get_jobs_from_view(MARKETING_JOBS, db)
    list_humanresources = get_jobs_from_view(HUMAN_JOBS, db)
    total_list = list_humanresources + list_marketing + list_healthcare + list_design + list_finance + list_engineer
    return jsonify({"success": True, "total_list": total_list})


@app.route("/viewusers", methods=["POST"])
def view_users():
    users_list = []
    collection = get_collection_by_field("users")

    # Find all user in the collection users
    documents = collection.find()
    # Create a new list of dictionaries with all fields except "id"
    new_documents = str_convert(documents)
    for document in new_documents:
        users_list.append(document)

    return jsonify({"success": True, "users_list": users_list})


@app.route("/offeredjobs", methods=["POST"])
def offered_jobs():
    # connexion to the MongoDB database
    collection = get_collection_by_field("users")
    details = request.json.get('clientDetails')
    username = details["userName"]
    password = details["password"]
    user = collection.find_one({'user_name': username, 'password': password})
    size = 0
    if "history" in user:
        size = len(user['history'])
    if size > 0:
        jobs = user['history'][size - 1]['displayed jobs']
        if jobs == "-":
            return jsonify({"success": True, "jobs": []})
        return jsonify({"success": True, "jobs": jobs})
    else:
        return jsonify({"success": True, "jobs": []})  # Return an empty array if no history found


@app.route("/selectededjobs", methods=["POST"])
def selected_jobs():
    # connexion to the MongoDB database
    collection = get_collection_by_field("users")
    details = request.json.get('clientDetails')
    username = details["userName"]
    password = details["password"]
    user = collection.find_one({'user_name': username, 'password': password})
    size = 0
    jobs = []
    if "history" in user:
        size = len(user['history'])
    if size > 0:
        selected_jobs_ids = user['history'][size - 1]['selected jobs']
        if selected_jobs_ids == "-":
            return jsonify({"success": True, "jobs": jobs})
        displayed_jobs = offered_jobs().json.get("jobs")
        if displayed_jobs:
            jobs = [job for job in displayed_jobs if job["_id"] in selected_jobs_ids]
        return jsonify({"success": True, "jobs": jobs})
    else:
        return jsonify({"success": True, "jobs": jobs})  # Return an empty array if no history found


@app.route("/viewhistory", methods=["POST"])
def view_history():
    details = request.json.get('clientDetails')
    username = details["userName"]
    password = details["password"]
    
    collection = get_collection_by_field("users")
    user = collection.find_one({'user_name': username, 'password': password})
    size = 0
    if "history" in user:
        size = len(user['history'])
    if size > 0:
        content = user['history'][size - 1]['conversation content']
        return jsonify({"success": True, "content": content})
    else:
        return jsonify({"success": True, "content": []})



@app.route("/clienthistory", methods=["POST"])
def client_history():
    collection = get_collection_by_field("users")

    history = request.json.get("history")
    # define the username and password of the user you want to update
    username = history["client details"]["userName"]
    password = history["client details"]["password"]

    result = collection.find_one({"user_name": username, "password": password})
    if "history" in result:
        current_history = result['history']
        current_history.append(history)
    else:
        current_history = [history]

    collection.update_one(
        {"user_name": username, "password": password},
        {"$set": {"history": current_history}}
    )

    return jsonify({"success": True, "message": "update database"})

# function to identify user intent based on chatGPT
def identify_intent(response, intents):
    relevant_intents = []
    # intents=["I found enough jobs here","I prefer self job search","I'm interested in a shorter process"]
    question = "For which of the intents in the list " + str(
        intents) + " the sentence '" + response + "' corresponds? Return the indexes (which start from 1) of the corresponding intents according to the following template: 'intent #: Yes', If this intent fits and 'intent #: No' else."

    response_gpt = chatgptConnection(question)
    for i in range(len(intents)):
        if (str(i + 1) + ": Yes") in response_gpt:
            relevant_intents.append(intents[i])
    if len(relevant_intents) == 0:
        relevant_intents.append("Other")
    print("relevant_intents: ", end="")
    print(relevant_intents)
    return relevant_intents


# function to extract relevant information for each intent
def save_intents_in_DB(intents, statName):
    # connexion to the MongoDB database
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]

    collec_users = db["users"]
    users_len = len(list(collec_users.find())) - NUMBER_OF_ADMINS

    today = str(date.today())

    collec_admin_stats = db["admin_statistics"]
    document = collec_admin_stats.find_one({"statName": statName})
    if document:
        prev_intent_info = document["stat"]
    else:
        collec_admin_stats.insert_one({"statName": statName, "stat": {}, "update date": "", "users number": 0})
        document = collec_admin_stats.find_one({"statName": statName})
        prev_intent_info = document["stat"]

    # pass on intents in db and update the counter
    for intent in intents:
        if intent in prev_intent_info:
            prev_intent_info[intent] = prev_intent_info[intent] + 1
        else:
            prev_intent_info[intent] = 1

    collec_admin_stats.update_one(
        {"statName": statName},
        {"$set": {"stat": prev_intent_info, "update date": today, "users number": users_len}}
    )
    for x in collec_admin_stats.find():
        print(x)


def getStatsFromDB(statName):
    collec_admin_stats = get_collection_by_field("admin_statistics")
    document = collec_admin_stats.find_one({"statName": statName})
    del document["_id"]
    return document


def calculateGeneralStats(subjects):
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]
    collec_users = db["users"]
    users_len = len(list(collec_users.find())) - NUMBER_OF_ADMINS

    today = str(date.today())

    genaralStat = copy.deepcopy(GENERAL_STATS)
    for subject in subjects:
        for user in collec_users.find():
            if "history" in user:
                for history in user['history']:
                    if subject != "field":
                        # print(history['selected features'])
                        if subject in history['selected features']:
                            for cat in history['selected features'][subject]:
                                if cat == "All":
                                    genaralStat[subject]["South"] += 1
                                    genaralStat[subject]["North"] += 1
                                    genaralStat[subject]["Central"] += 1
                                else:
                                    genaralStat[subject][cat] += 1
                    else:
                        cat = history['selected features'][subject]
                        genaralStat[subject][cat] += 1

    collec_admin_stats = db["admin_statistics"]
    collec_admin_stats.update_one(
        {"statName": "general_statistics"},
        {"$set": {"stat": genaralStat, "update date": today, "users number": users_len}}
    )
    # print("after update genaralStat")
    # print(collec_admin_stats.find_one({"statName": "general_statistics"}))
    # print("GENERAL_STATS")
    # print(GENERAL_STATS)


def updateAllfeedbacksInDB():
    cluster = MongoClient(MONGODB_CONNECTION_STRING)
    db = cluster[CLUSTER_NAME]
    collec_users = db["users"]

    feedbacks = []
    for user in collec_users.find():
        if "history" in user:
            for history in user['history']:
                # print(history)
                if history['feedback on termination'] != "-":
                    feedbacks.append(history['feedback on termination'])
    # print(feedbacks)

    collec_admin_stats = db["admin_statistics"]

    collec_admin_stats.update_one(
        {"statName": "feedback"},
        {"$set": {"all feedbacks": feedbacks}}
    )

    document = collec_admin_stats.find_one({"statName": "feedback"})
    print(document)


# route for getting statistics
@app.route("/getStatistics", methods=["POST"])
def getStatistics():
    goal = request.json.get("goal")
    # print(goal)
    if goal == "view_general_stats":
        document = getStatsFromDB("general_statistics")
        return jsonify({"success": True, "message": document})
    elif goal == "calculate_general_stats":
        subjects = ["areas", "job Types", "field", "experience level"]
        calculateGeneralStats(subjects)
        updatedDocument = getStatsFromDB("general_statistics")
        return jsonify({"success": True, "message": updatedDocument})
    elif goal == "view_feedback":
        document = getStatsFromDB("feedback")
        return jsonify({"success": True, "message": document})


@app.route("/getIsFeedback", methods=["POST"])
def test_response():
    feedback = request.json.get("message")
    # identify intents using chatGPT
    intents = identify_intent(feedback, INTENTS_TO_CHECK)

    # add the new feedback to the list of feedbacks in db
    collec_admin_stats = get_collection_by_field("admin_statistics")
    document = collec_admin_stats.find_one({"statName": "feedback"})
    document["all feedbacks"].append(feedback)
    collec_admin_stats.update_one(
        {"statName": "feedback"},
        {"$set": {"all feedbacks": document["all feedbacks"]}}
    )

    # save the identified intents in DB
    save_intents_in_DB(intents, "feedback")

    JOBOT_response = ""
    if len(intents) == 1 and intents[0] == "I found enough jobs here":
        JOBOT_response = JOBOT_RESPONSE_FOR_FEEDBACK_1
    else:
        JOBOT_response = JOBOT_RESPONSE_FOR_FEEDBACK_2
    print(f"User response: {feedback}")
    return jsonify({"success": True, "message": JOBOT_response})



def find_best_job(field):
    collection = get_collection_by_field(field)

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
    collection = get_collection_by_field(field)

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
    collection = get_collection_by_field(field)

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

if __name__ == "__main__":
    app.run(port=5000, debug=True)

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
