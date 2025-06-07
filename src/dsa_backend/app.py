from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# 讀取模組與公式設定
with open("solar_config/modules.json", encoding="utf-8") as f:
    modules = json.load(f)

with open("solar_config/formulas.json", encoding="utf-8") as f:
    formulas = json.load(f)

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.json
    roof_area_m2 = data["roof_area_m2"]
    coverage_rate = data["coverage_rate"]
    direction = data["orientation"]

    recommendations = []
    for mod in modules:
        local_vars = {
            **data,
            **mod,
            "roof_area_m2": roof_area_m2,
            "coverage_rate": coverage_rate
        }

        # 逐項套用公式
        try:
            for field, expr in formulas.items():
                local_vars[field] = eval(expr, {}, local_vars)
        except Exception as e:
            return jsonify({"error": f"公式計算錯誤: {str(e)}"}), 500

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
            "fit_rate_total": local_vars["fit_rate_total"],
            "annual_revenue_ntd": int(local_vars["annual_revenue_ntd"]),
            "install_cost_ntd": int(local_vars["install_cost_ntd"]),
            "payback_years": round(local_vars["payback_years"], 1),
            "environmental_benefit": local_vars["environmental_benefit"],
            "investment_projection_20yr": [
                {"year": y, "value": round(-local_vars["install_cost_ntd"] + local_vars["annual_revenue_ntd"] * y)}
                for y in range(1, 21)
            ],
            "final_recommendation": local_vars["final_recommendation"],
            "score": local_vars["score"],
            "explanation_text": local_vars["explanation_text"]
        }

        recommendations.append(recommendation)

    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(debug=True)
