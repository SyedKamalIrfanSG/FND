import requests

url = "http://127.0.0.1:5000/dashboard/1"

response = requests.get(url)

print("STATUS CODE:", response.status_code)
print("RAW RESPONSE:", response.text)