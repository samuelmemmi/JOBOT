import pytest
from server import getCitiesFromAreas
# getCitiesFromAreas(areas, areas_to_remove)
def test_get_cities_from_areas():
    assert sorted(getCitiesFromAreas(["South"], ["South", "Southern", "Israel"])) == sorted(["Qiryat Gat","Ashdod"])
    assert sorted(getCitiesFromAreas(["North"], ["North", "Northern", "Israel"])) == sorted(["Haifa"])
    assert sorted(getCitiesFromAreas(["Central"], ["Central", "Israel"])) == sorted(["Herzliya", "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan",
                        "Rishon LeZiyyon", "Tel Aviv", "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                        "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona"])
    assert sorted(getCitiesFromAreas(["All"], ["North", "Northern","South", "Southern","Central", "Israel"])) == sorted(["Haifa", "Qiryat Gat","Ashdod", "Herzliya",
                        "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan","Rishon LeZiyyon", "Tel Aviv",
                        "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                        "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona"])
    assert sorted(getCitiesFromAreas(["North"], ["All","Haifa","North", "Northern", "Israel"])) == []
    assert sorted(getCitiesFromAreas(["North","All"], ["North", "Northern","South", "Southern","Central", "Israel"])) == sorted(["Haifa", "Qiryat Gat","Ashdod", "Herzliya",
                        "Jerusalem", "Netanya", "Petah Tikva", "Raanana", "Ramat Gan","Rishon LeZiyyon", "Tel Aviv",
                        "Tel Aviv-Yafo", "Kfar Saba", "Rehovot", "Hod HaSharon",
                        "Bnei Brak", "Giv`atayim", "Lod", "Holon", "Yavne", "Ness Ziona"])
    assert sorted(getCitiesFromAreas(["North"],[]))==sorted(["Haifa","Israel","North", "Northern"])
    assert sorted(getCitiesFromAreas([],["North", "Northern","South", "Southern","Central", "Israel"]))==[]
    assert sorted(getCitiesFromAreas([],[]))==[]
    assert sorted(getCitiesFromAreas(None,None))==[]


if __name__ == '__main__':
    pytest.main()
