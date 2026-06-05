import requests

url = "http://127.0.0.1:5000/register"

data = {
    "username": "John",
    "email": "john@gmail.com",
    "password": "1234"
}

response = requests.post(url, json=data)

print(response.json())