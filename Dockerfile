FROM python:3.10-slim

WORKDIR /app

# 複製需求檔案
COPY requirements.txt ./

# 安裝依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製專案檔案
COPY . .

# 設定環境變數
ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0

# 開放 port
EXPOSE 5000

# 啟動 Flask
CMD ["flask", "run"]
