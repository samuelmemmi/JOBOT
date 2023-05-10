from flask import Flask, request, jsonify
from pymongo import MongoClient
import json
from flask import session
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import openai
import time

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
        if ((user_name == "samuel") and (password == "1")) or ((user_name == "rachel") and (password == "123")):
            collection.update_one(
                {"user_name": "samuel", "password": "1"},
                {"$set": {"admin": "Yes"}}
            )
            collection.update_one(
                {"user_name": "rachel", "password": "123"},
                {"$set": {"admin": "Yes"}}
            )
            return jsonify({"success": True, "message": "Admin login success"})

        return jsonify({"success": True, "message": "Client login success"})

    else:
        collection.update_one(
            {"user_name": user_name, "password": password},
            {"$set": {"admin": "No"}}
        )
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


# route for getting cities
@app.route("/cities", methods=["POST"])
def getCities():
    areas = request.json.get("areas")
    citiesObject = {"South": ["Qiryat Gat", "Ashdod"],
                    "North": ["Haifa"],
                    "Central": ["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                                "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                                "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona"]}
    res = []
    for k in areas:
        if k == "All":
            res += citiesObject["South"] + citiesObject["North"] + citiesObject["Central"]
            break
        res += citiesObject[k]
    return jsonify({"success": True, "cities": res})


def first_help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list):
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
    # new_documents = [{k: v for k, v in doc.items() if k != "_id"} for doc in documents]
    # Create a new list of dictionaries with all fields and "id" converted to str
    new_documents = [{k: (str(v) if k == '_id' else v) for k, v in doc.items()} for doc in documents]
    list_jobs = []
    unique_jobs = second_help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list, time, field,
                                             db)

    return jsonify({"success": True, "list_jobs": unique_jobs})


def second_help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list, time, field, db):
    if "I'm open to any company" not in company:
        list_jobs = first_help_get_first_jobs(new_documents, list_jobs, title, company, city, other_list)
        if len(list_jobs) < 15:
            company.append("I'm open to any company")
        else:
            return list_jobs

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
        new_documents2 = [{k: (str(v) if k == '_id' else v) for k, v in doc.items()} for doc in documents2]
        for doc in new_documents2:
            if len(list_jobs) < 15 and doc["job"] != "":
                list_jobs.append(doc)

    seen_jobs = set()
    unique_jobs = []

    for job in list_jobs:
        job_id = (job['job'], job['company'], job['city'])
        if job_id not in seen_jobs:
            seen_jobs.add(job_id)
            unique_jobs.append(job)

    return unique_jobs


@app.route("/getsecondjobs", methods=["POST"])
def get_second_jobs():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]

    second_list = request.json.get("responses")

    field = second_list["field"]
    display_jobs = second_list["displayed jobs"]
    id = 0

    # other _list=the job titles that exist in db
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

    company = second_list["companies"]

    if "additional job title" in second_list:# rachel change
        jobtitle = second_list["additional job title"]
        jobtitle = [jobtitle]+second_list["JobTitles"]
    else:
        jobtitle = second_list["JobTitles"]

    if "experience level" in second_list:
        level = second_list["experience level"]
    else:
        level = second_list["job Types"]
        id = 1

    if "cities" in second_list:
        city = second_list["cities"]
    else:
        areas = second_list["areas"]
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

    if "job Requirements" in second_list:
        requirements = second_list["job Requirements"]
    else:
        requirements = ""

    job = field.lower() + "_" + level[0].lower()
    collection = db[job]
    # Find all documents in the collection
    documents = collection.find()
    # Create a new list of dictionaries with all fields and "id" converted to str
    new_documents = [{k: (str(v) if k == '_id' else v) for k, v in doc.items()} for doc in documents]
    list_jobs = []
    unique_jobs = second_help_get_first_jobs(new_documents, list_jobs, jobtitle, company, city, other_list, level,
                                             field,
                                             db)
    if id == 1:
        for job1 in unique_jobs:
            for job2 in display_jobs:
                if job1["_id"] == job2["_id"]:
                    unique_jobs.remove(job1)

    # return jsonify({"success": True, "list_jobs": unique_jobs})

    # Now use chatgpt to get more precise job (use requirements)

    gpt_list = []
    index = 1
    print("len(): ")
    print(len(unique_jobs))

    lengt=int(len(unique_jobs)/2)*2
    for i in range(0,lengt,2):
        # if job['_id'] != current_id:
        #     job_string += "\n"  # add separator if id changes
        #     current_id = job['_id']
        job_string1 = "This is the " + str(index) + " job\n" + "job title: " + unique_jobs[i]['job'] + ", job description: " + unique_jobs[i]['description'] + "\n"
        job_string2 = "This is the " + str(index+1) + " job\n" + "job title: " + unique_jobs[i+1]['job'] + ", job description: " + unique_jobs[i+1]['description'] + "\n"
        question = "I have a person who his requirements are: '" + requirements +"'" \
               ". Are the jobs below fit for him: " + job_string1 + job_string2 + \
               "Return an answer according to the following template: 'job #: Yes' if this job is fit and 'job #: No' else."

        print("question_gpt: ",question)
        response_gpt = chatgpt(question)
        # print("response_gpt: ",response_gpt)
        if (str(index) + ": Yes") in response_gpt:
            gpt_list.append(unique_jobs[i])
        if (str(index+1) + ": Yes") in response_gpt:
            gpt_list.append(unique_jobs[i+1])
        if(i+1!=(lengt-1)):
            time.sleep(20) #12
        index += 2

    print("iiiiii")
    print(i)
    i+=2
    for i in range(i,len(unique_jobs)):
        job_string = "This is the " + str(index) + " job\n" + "job title: " + unique_jobs[i]['job'] + ", job description: " + unique_jobs[i]['description'] + "\n"
        question = "I have a person who his requirements are: '" + requirements +"'" \
               ". Are the jobs below fit for him: " + job_string + \
               "Return an answer according to the following template: 'job #: Yes' if this job is fit and 'job #: No' else."
    
        print("question_gpt: ",question)
        response_gpt = chatgpt(question)
        # print("response_gpt: ",response_gpt)
        if (str(index) + ": Yes") in response_gpt:
            gpt_list.append(unique_jobs[i])
        
        # break
    #     j_list = [job.strip() for job in response_gpt.split('\n')]

    #     jobs_dict_list = [{'job': job[3:-16], 'company': job.split('at ')[1].split(' in ')[0], 'city': job.split(' in ')[1]}
    #                   for job in j_list]

    # res = "With all the information you provide us, JobBot find for you this top 3 jobs: " + "\n" + response_gpt

    # gpt_list = []
    # for job1 in unique_jobs:
    #     for job2 in jobs_dict_list:
    #         if job1['job'] in job2['job'] and job1['company'] in job2['company']:
    #             gpt_list.append(job1)

    return jsonify({"success": True, "list_jobs": gpt_list})

    # Now use chatgpt to get more precise job (use requirements)

    # city_string = ', '.join(city)
    # job_string = ""
    # current_id = None
    # index = 1

    # for job in unique_jobs:
    #     if job['_id'] != current_id:
    #         job_string += "\n"  # add separator if id changes
    #         current_id = job['_id']
    #     job_string += "This is the " + str(index) + " job" + job['job'] + "," + job['city'] + "," + job['company'] + "," + job['description'] + "\n"
    #     index += 1

    # question = "I have a person who his experience level is: " + level[0] + \
    #            "and want a job that can fit to this job title: " + \
    #            jobtitle[0] + "in this cities: " + city_string + "and this is his requirements: " + requirements + \
    #            "what jobs in this jobs lists can fit for this person: " + job_string + \
    #            "return to me a top 3 of the jobs"

    # response_gpt = chatgpt(question)
    # j_list = [job.strip() for job in response_gpt.split('\n')]

    # jobs_dict_list = [{'job': job[3:-16], 'company': job.split('at ')[1].split(' in ')[0], 'city': job.split(' in ')[1]}
    #                   for job in j_list]

    # res = "With all the information you provide us, JobBot find for you this top 3 jobs: " + "\n" + response_gpt

    # gpt_list = []
    # for job1 in unique_jobs:
    #     for job2 in jobs_dict_list:
    #         if job1['job'] in job2['job'] and job1['company'] in job2['company']:
    #             gpt_list.append(job1)

    # return jsonify({"success": True, "list_jobs": gpt_list})


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


@app.route("/clienthistory", methods=["POST"])
def client_history():
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["users"]

    history = request.json.get("history")
    # define the username and password of the user you want to update
    username = history["client details"]["userName"]
    password = history["client details"]["password"]

    # retrieve the current value of the history field
    result = collection.find_one({"user_name": username, "password": password}, {"history": 1})
    current_history = result.get("history", {})

    # if the current history is a dictionary, convert it to a list with one element
    if isinstance(current_history, dict):
        current_history = [current_history]

    # append the new history to the current history list
    current_history.append(history)

    # update the user document with the merged history
    collection.update_one(
        {"user_name": username, "password": password},
        {"$set": {"history": current_history}}
    )

    return jsonify({"success": True, "message": "update database"})


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
        if "easy" in response or "simple" in response or "simplicity" in response:
            intents.append("easy navigation")
        elif "complicated" in response or "difficult" in response or "hard" in response:
            intents.append("difficult navigation")
    # check for simplicity-related keywords
    if "system" in response:
        if "simple" in response or "easy" in response or "good" in response or "simplicity" in response:
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
        if "not" in response or "enough" in response or "displaying jobs" in response:
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
        elif intent == "jobs good":
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


@app.route("/getIsFeedback", methods=["POST"])
def test_response(responses):
    number = {}
    res = ""
    responses = [request.json.get("message")]
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
            res = response
            print(response)
        print()
    # connexion to the MongoDB database
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db["statistics"]
    number_list = [{'intent': key, 'count': value} for key, value in number.items()]
    collection.insert_many(number_list)
    return jsonify({"success": True, "res": res})


def chatgpt(question):
    API_KEY = open("API_KEY.txt", "r").read().strip()
    openai.api_key = API_KEY
    chat_log = [{"role": "user", "content": question}]
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=chat_log)
    assistant_response = response['choices'][0]['message']['content']
    print("chatgpt: ", assistant_response.strip("\n").strip())
    chat_log.append({"role": "assistant", "content": assistant_response.strip("\n").strip()})
    return assistant_response.strip("\n").strip()


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

    # chatgpt("Is there a gggg job title in the world of jobs? Answer in Yes or No. If Yes correct spelling "
    # "mistakes and send it to me")
