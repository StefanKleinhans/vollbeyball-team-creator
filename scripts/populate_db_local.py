import requests
from faker import Faker
import random

API_URL: str = "http://127.0.0.1:8000"
TEMPLATE_BODY: dict = {
  "name": "string",
  "age": 0,
  "defence_rating": 0,
  "offense_rating": 0,
  "teamplay_rating": 0,
  "serve_rating": 0,
  "available": True,
  "assigned_team": "string",
  "gender": "string"
}
faker = Faker()

for i in range(12):
  TEMPLATE_BODY["name"] = faker.name()
  TEMPLATE_BODY["age"] = random.randint(18, 60)
  TEMPLATE_BODY["defence_rating"] = round(random.random() * 10, 2)
  TEMPLATE_BODY["offense_rating"] = round(random.random() * 10, 2)
  TEMPLATE_BODY["teamplay_rating"] = round(random.random() * 10, 2)
  TEMPLATE_BODY["serve_rating"] = round(random.random() * 10, 2)
  TEMPLATE_BODY["available"] = random.choice([True, False])
  TEMPLATE_BODY["assigned_team"] = random.choice(["A", "B"])
  TEMPLATE_BODY["gender"] = random.choice(["M", "F"])

  requests.post(f"{API_URL}/player/new", json=TEMPLATE_BODY)