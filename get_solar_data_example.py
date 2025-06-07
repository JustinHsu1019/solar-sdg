import requests

API_KEY = '你的API金鑰'
url = f'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0005-001?Authorization={API_KEY}'

resp = requests.get(url)
data = resp.json()
# 解析 data['records']['location'] 取得各測站日照資料
