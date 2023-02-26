from bs4 import BeautifulSoup
import json
import requests
import pymongo
from pymongo import MongoClient


def scrap(name):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/50.0.2661.102 Safari/537.36'}
    # Read file
    file = name + ".html"
    with open(file, "r", encoding="utf-8") as f:
        html = f.read()

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    divs1 = soup.find_all("div", class_="d-flex flex-column pl-sm css-3g3psg css-1of6cnp e1rrn5ka4")
    divs2 = soup.find_all("div", class_="d-flex flex-column css-x75kgh e1rrn5ka3")
    # Initialize an empty list to store the data
    data = []

    # Iterate over each div
    for div1, div2 in zip(divs1, divs2):
        # Try to find an 'a' tag with class "css-l2wjgv e1n63ojh0 jobLink"
        try:
            company_a = div1.find("a", class_="css-l2wjgv e1n63ojh0 jobLink")
            company = company_a.text
        except:
            company = ""

        # Try to find an 'a' tag with class "css-nodxsq jobLink css-1rd3saf eigr9kq3"
        try:
            job_a = div1.find("a", class_="jobLink css-1rd3saf eigr9kq3")
            if job_a is None:
                job_a = div1.find("a", class_="css-nodxsq jobLink css-1rd3saf eigr9kq3")
                if job_a is None:
                    job_a = div1.find("a", class_="jobLink css-1rd3saf eigr9kq2")
            job = job_a.text
        except:
            job = ""

        # Try to find a 'span' tag with class "css-3g3psg pr-xxsm css-iii9i8 e1rrn5ka0"
        try:
            city_span = div1.find("span", class_="css-3g3psg pr-xxsm css-iii9i8 e1rrn5ka0")
            city = city_span.text
        except:
            city = ""

        try:
            date_d = div1.find("div", class_="d-flex align-items-end pl-std css-1vfumx3")
            date = date_d.text
        except:
            date = ""

        try:
            rating_span = div2.find("span", class_="css-2lqh28 e1cjmv6j1")
            rating = rating_span.text
        except:
            rating = ""

        a = div1.find('a')
        href = a['href']
        response2 = requests.get(href, headers=headers)
        if response2.status_code == 200:
            so = BeautifulSoup(response2.content, 'html.parser')
            try:
                desc = so.find_all("div", class_="css-1lkoiaj e1eh6fgm1")
                description = desc[0].text
            except:
                description = ""
            try:
                site_div = so.find_all("div", class_="css-0 e1h54cx80")
                apply = site_div[0].text
                if apply == "Apply on employer site":
                    # site = site_div[0].find("a", class_="gd-ui-button applyButton e1ulk49s0 css-5xi56s evpplnh0")
                    site = site_div[0].find("a", class_="gd-ui-button d-flex align-items-center css-oojfh0 e1ulk49s0 "
                                                        "job-view-1rp50a3 evpplnh1")
                    link = "https://www.glassdoor.com" + site['href']
                else:
                    link = ""
            except:
                link = ""
        else:
            print(f"Request was not successful. Status code: {response2.status_code}")
            description = ""
            link = ""

        # Append the data to the list
        data.append(
            {"company": company, "job": job, "city": city, "date": date, "rating": rating, "link": link,
             "description": description})

    # Open data.json and write the data
    js = name + ".json"
    with open(js, "w") as file:
        json.dump(data, file)


def merge_json_files(filess, output_file):
    result = []
    for fi in filess:
        with open(fi, 'r') as ff:
            dataa = json.load(ff)
            result.append(dataa)

    with open(output_file, 'w') as fff:
        json.dump(result, fff)


def insert_db(file):
    cluster = MongoClient("mongodb+srv://samuelmemmi:1234@cluster0.e4sf8mm.mongodb.net/?retryWrites=true"
                          "&w=majority")
    db = cluster["chatbot"]
    collection = db[file]
    file = file + ".json"
    with open(file, 'r') as ffff:
        da = json.load(ffff)
        data_len = len(da)
        if data_len < 4:
            for i in range(data_len):
                collection.insert_many(da[i])
        else:
            collection.insert_many(da)


if __name__ == "__main__":
    """scrap("marketing_full_time1")
    scrap("marketing_full_time2")
    scrap("marketing_full_time3")
    scrap("marketing_part_time")
    scrap("marketing_intern")
    scrap("marketing_junior1")
    scrap("marketing_junior2")
    scrap("marketing_senior1")
    scrap("marketing_senior2")
    scrap("marketing_senior3")
    scrap("healthcare_full_time1")
    scrap("healthcare_full_time2")
    scrap("healthcare_full_time3")
    scrap("healthcare_part_time")
    scrap("healthcare_intern")
    scrap("healthcare_junior")
    scrap("healthcare_senior1")
    scrap("healthcare_senior2")
    scrap("healthcare_senior3")
    scrap("humanresources_full_time1")
    scrap("humanresources_full_time2")
    scrap("humanresources_part_time")
    scrap("humanresources_intern")
    scrap("humanresources_junior")
    scrap("humanresources_senior1")
    scrap("humanresources_senior2")
    scrap("design_full_time1")
    scrap("design_full_time2")
    scrap("design_full_time3")
    scrap("design_part_time")
    scrap("design_intern")
    scrap("design_junior")
    scrap("design_senior1")
    scrap("design_senior2")
    scrap("design_senior3")
    scrap("engineer_full_time1")
    scrap("engineer_full_time2")
    scrap("engineer_full_time3")
    scrap("engineer_part_time")
    scrap("engineer_intern")
    scrap("engineer_junior1")
    scrap("engineer_junior2")
    scrap("engineer_junior3")
    scrap("engineer_senior1")
    scrap("engineer_senior2")
    scrap("engineer_senior3")
    scrap("finance_full_time1")
    scrap("finance_full_time2")
    scrap("finance_full_time3")
    scrap("finance_part_time")
    scrap("finance_intern")
    scrap("finance_junior1")
    scrap("finance_junior2")
    scrap("finance_senior1")
    scrap("finance_senior2")
    scrap("finance_senior3")

    fil1 = ['design_full_time1.json', 'design_full_time2.json', 'design_full_time3.json']
    merge_json_files(fil1, 'design_full_time.json')

    fil2 = ['design_senior1.json', 'design_senior2.json', 'design_senior3.json']
    merge_json_files(fil2, 'design_senior.json')

    fil3 = ['engineer_full_time1.json', 'engineer_full_time2.json', 'engineer_full_time3.json']
    merge_json_files(fil3, 'engineer_full_time.json')

    fil4 = ['engineer_junior1.json', 'engineer_junior2.json', 'engineer_junior3.json']
    merge_json_files(fil4, 'engineer_junior.json')

    fil5 = ['engineer_senior1.json', 'engineer_senior2.json', 'engineer_senior3.json']
    merge_json_files(fil5, 'engineer_senior.json')

    fil6 = ['finance_full_time1.json', 'finance_full_time2.json', 'finance_full_time3.json']
    merge_json_files(fil6, 'finance_full_time.json')

    fil7 = ['finance_junior1.json', 'finance_junior2.json']
    merge_json_files(fil7, 'finance_junior.json')

    fil8 = ['finance_senior1.json', 'finance_senior2.json', 'finance_senior3.json']
    merge_json_files(fil8, 'finance_senior.json')

    fil9 = ['healthcare_full_time1.json', 'healthcare_full_time2.json', 'healthcare_full_time3.json']
    merge_json_files(fil9, 'healthcare_full_time.json')

    fil10 = ['healthcare_senior1.json', 'healthcare_senior2.json', 'healthcare_senior3.json']
    merge_json_files(fil10, 'healthcare_senior.json')

    fil11 = ['humanresources_full_time1.json', 'humanresources_full_time2.json']
    merge_json_files(fil11, 'humanresources_full_time.json')

    fil12 = ['humanresources_senior1.json', 'humanresources_senior2.json']
    merge_json_files(fil12, 'humanresources_senior.json')

    fil13 = ['marketing_full_time1.json', 'marketing_full_time2.json', 'marketing_full_time3.json']
    merge_json_files(fil13, 'marketing_full_time.json')

    fil14 = ['marketing_junior1.json', 'marketing_junior2.json']
    merge_json_files(fil14, 'marketing_junior.json')

    fil15 = ['marketing_senior1.json', 'marketing_senior2.json', 'marketing_senior3.json']
    merge_json_files(fil15, 'marketing_senior.json')

    insert_db('design_full_time')
    insert_db('design_intern')
    insert_db('design_junior')
    insert_db('design_part_time')
    insert_db('design_senior')

    insert_db('marketing_full_time')
    insert_db('marketing_intern')
    insert_db('marketing_junior')
    insert_db('marketing_part_time')
    insert_db('marketing_senior')

    insert_db('healthcare_full_time')
    insert_db('healthcare_intern')
    insert_db('healthcare_junior')
    insert_db('healthcare_part_time')
    insert_db('healthcare_senior')

    insert_db('humanresources_full_time')
    insert_db('humanresources_intern')
    insert_db('humanresources_junior')
    insert_db('humanresources_part_time')
    insert_db('humanresources_senior')

    insert_db('engineer_full_time')
    insert_db('engineer_intern')
    insert_db('engineer_junior')
    insert_db('engineer_part_time')
    insert_db('engineer_senior')

    insert_db('finance_full_time')
    insert_db('finance_intern')
    insert_db('finance_junior')
    insert_db('finance_part_time')
    insert_db('finance_senior')"""
