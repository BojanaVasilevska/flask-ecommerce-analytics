import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import app, db, mongo, UserInfo, UserSpending

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    with app.app_context():
        db.create_all()
        yield client
        db.drop_all()

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Hello Flask!" in response.data

def test_all_users(client):
    user1 = UserInfo(user_id=1, name='Somenthing', email='something@example.com', age=25)
    user2 = UserInfo(user_id=2, name='Nothing', email='nothing@example.com', age=30)
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    response = client.get('/all_users')
    assert response.status_code == 200
    assert b"Somenthing" in response.data
    assert b"Nothing" in response.data

def test_average_spending_by_age(client):
    spending1 = UserSpending(user_id=1, money_spent=100, year=2023)
    spending2 = UserSpending(user_id=2, money_spent=200, year=2023)
    db.session.add(spending1)
    db.session.add(spending2)
    db.session.commit()

    response = client.get('/average_spending_by_age/1')
    assert response.status_code == 200
    assert b"100.0" in response.data

def test_average_spending_by_age_range(client):
    user1 = UserInfo(user_id=1, name='Somenthing', email='somenthing@example.com', age=20)
    user2 = UserInfo(user_id=2, name='Nothing', email='nothing@example.com', age=30)
    db.session.add(user1)
    db.session.add(user2)

    spending1 = UserSpending(user_id=1, money_spent=100, year=2023)
    spending2 = UserSpending(user_id=2, money_spent=200, year=2023)
    db.session.add(spending1)
    db.session.add(spending2)

    db.session.commit()

    response = client.get('/average_spending_by_age_range')
    assert response.status_code == 200
    assert b"18-24" in response.data
    assert b"25-30" in response.data

def test_write_to_mongodb(client):
    data = {
        'key': 'value'
    }

    response = client.post('/write_to_mongodb', json=data)
    assert response.status_code == 201

def test_user_spending_records(client):
    response = client.get('/user_spending_records')
    assert response.status_code == 404
    assert b"No user spending records found." in response.data

    mock_data = [
        {"user_id": 1, "money_spent": 100, "year": 2023},
        {"user_id": 2, "money_spent": 200, "year": 2023}
    ]
    mongo.db.user_spending.insert_many(mock_data)

    response = client.get('/user_spending_records')
    assert response.status_code == 200

    expected_response = {
        "user_spending_records": [
            {"user_id": 1, "money_spent": 100, "year": 2023},
            {"user_id": 2, "money_spent": 200, "year": 2023}
        ]
    }
    assert response.json == expected_response

def test_github_user_data(client):
    response = client.get('/github_user_data')
    assert response.status_code == 404
    assert b"Failed to fetch GitHub user data." in response.data