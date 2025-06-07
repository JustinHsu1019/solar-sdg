from flask import Flask, request, jsonify
import json
import openai
import os
import re

app = Flask(__name__)

with open("solar_config/modules.json", encoding="utf-8") as f:
    modules = json.load(f)

with open("solar_config/formulas.json", encoding="utf-8") as f:
    formulas = json.load(f)

with open("solar_config/city_to_kwh_day.json", encoding="utf-8") as f:
    city_to_kwh_day = json.load(f)

with open("solar_config/fit_rate_table.json", encoding="utf-8") as f:
    fit_rate_table = json.load(f)

with open("solar_config/region_bonus.json", encoding="utf-8") as f:
    region_bonus = json.load(f)

openai.api_key = os.environ.get("OPENAI_API_KEY")

def get_fit_rate(capacity_kw, efficiency_level, city):
    base_rate = None
    for tier in fit_rate_table:
        max_kw = tier["max_kw"] if tier["max_kw"] is not None else float("inf")
        if tier["min_kw"] <= capacity_kw < max_kw:
            base_rate = tier["high_eff"] if efficiency_level == "高效" else tier["standard"]
            break
    if base_rate is None:
        base_rate = 3.5
    bonus_ratio = region_bonus.get(city, 0)
    return round(base_rate * (1 + bonus_ratio), 4)

# 智能解析 LLM 回應為 JSON
def parse_llm_output(text):
    try:
        # 嘗試直接 json 解析
        return json.loads(text)
    except:
        # 嘗試從 code block 中提取 json
        match = re.search(r'```json\\n(.*?)```', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except:
                pass
        match = re.search(r'```(.*?)```', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except:
                pass
        match = re.search(r'{.*}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                pass
    return {"final_recommendation": "", "score": 0, "explanation_text": "解析失敗"}

def generate_llm_outputs(summary):
    prompt = f"""
你是一位太陽能投資顧問。以下是客戶的模擬數據摘要：

{summary}

請根據以上內容提供：
1. final_recommendation（推薦安裝/保守觀望）
2. score（0~1，代表推薦程度）
3. explanation_text（一句話說明評估理由）

請以 JSON 格式輸出，如：
{{
  "final_recommendation": "...",
  "score": 0.78,
  "explanation_text": "..."
}}
"""
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}]
    )
    return parse_llm_output(response.choices[0].message.content)

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.json
    roof_area_m2 = data["roof_area_m2"]
    coverage_rate = data["coverage_rate"]
    address = data["address"]

    recommendations = []
    for mod in modules:
        local_vars = {
            **data,
            **mod,
            "roof_area_m2": roof_area_m2,
            "coverage_rate": coverage_rate,
            "address": address,
            "city_to_kwh_day": city_to_kwh_day,
            "get_fit_rate": lambda cap, eff: get_fit_rate(cap, eff, address)
        }

        try:
            for field, expr in formulas.items():
                if field in ["final_recommendation", "score", "explanation_text"]:
                    continue
                local_vars[field] = eval(expr, {}, local_vars)
        except Exception as e:
            return jsonify({"error": f"公式計算錯誤: {str(e)}"}), 500

        summary = f"""
模組名稱：{mod["module_name"]}
模組效率：{mod["efficiency_percent"]}%
模組等級：{mod["efficiency_level"]}
裝置容量：{round(local_vars["capacity_kw"], 2)} 瓩
地點：{address}
年發電量：約 {int(local_vars["annual_generation_kwh"])} 度
建置成本：約 {int(local_vars["install_cost_ntd"])} 元
年收入：約 {int(local_vars["annual_revenue_ntd"])} 元
回本年限：約 {round(local_vars["payback_years"], 1)} 年
"""

        llm_result = generate_llm_outputs(summary)

        recommendation = {
            "module_id": mod["module_id"],
            "module_name": mod["module_name"],
            "efficiency_percent": mod["efficiency_percent"],
            "efficiency_level": mod["efficiency_level"],
            "brand": mod["brand"],
            "type": mod["type"],
            "capacity_kw": round(local_vars["capacity_kw"], 2),
            "daily_kwh_per_kw": round(local_vars["daily_kwh_per_kw"], 2),
            "annual_generation_kwh": int(local_vars["annual_generation_kwh"]),
            "fit_rate_total": round(local_vars["fit_rate_total"], 4),
            "annual_revenue_ntd": int(local_vars["annual_revenue_ntd"]),
            "install_cost_ntd": int(local_vars["install_cost_ntd"]),
            "payback_years": round(local_vars["payback_years"], 1),
            "environmental_benefit": local_vars["environmental_benefit"],
            "investment_projection_20yr": [
                {"year": y, "value": round(-local_vars["install_cost_ntd"] + local_vars["annual_revenue_ntd"] * y)}
                for y in range(1, 21)
            ],
            "final_recommendation": llm_result.get("final_recommendation", ""),
            "score": llm_result.get("score", 0),
            "explanation_text": llm_result.get("explanation_text", "")
        }

        recommendations.append(recommendation)

    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(debug=True)
