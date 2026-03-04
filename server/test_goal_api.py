import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:8000/api/goals/optimize',
    data=b'{"goals":[{"name":"Dream Home","amount":8000000,"years":8,"priority":"High"}],"monthlySavings":80000,"existingCorpus":1500000,"riskProfile":"Moderate"}',
    headers={'Content-Type': 'application/json'}
)
try:
    urllib.request.urlopen(req)
except Exception as e:
    print(e.read().decode())
