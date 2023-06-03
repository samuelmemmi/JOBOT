
import server

def find_best_job(field):
    collection = server.get_collection_by_field(field)

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
    collection = server.get_collection_by_field(field)

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
    collection = server.get_collection_by_field(field)

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
    find_best_title("healthcare_full_time")
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