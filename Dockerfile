FROM python:3.10-slim

WORKDIR /app

# 複製需求檔案
COPY requirements.txt ./

# 安裝依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製專案檔案
COPY . .

# 切換工作目錄到 run.py 所在位置
WORKDIR /app/src/backend

# 設定環境變數
ENV FLASK_APP=run.py

# 開放 port
EXPOSE 8080

# 啟動 Flask
CMD ["flask", "run.py"]
