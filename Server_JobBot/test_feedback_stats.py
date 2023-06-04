import pytest
from server import incIntents

def test_inc_intents():
    assert incIntents(None, None) == {}
    assert incIntents({}, []) == {}
    assert incIntents({"found jobs":7}, []) == {"found jobs":7}
    assert incIntents({}, ["found jobs","too long","self search"]) == {"found jobs":1,"too long":1,"self search":1}
    assert incIntents({"found jobs":7}, ["found jobs","too long","self search"]) == {"found jobs":8,"too long":1,"self search":1} 
    assert incIntents({"found jobs":-2,"too long":0}, ["found jobs","too long","self search"]) == {"found jobs":-1,"too long":1,"self search":1} 

if __name__ == '__main__':
    pytest.main()
