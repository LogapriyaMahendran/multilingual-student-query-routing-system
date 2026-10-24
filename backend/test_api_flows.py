import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
from fastapi.testclient import TestClient
from main import app
from database import Base, engine, SessionLocal
from models import User, Query

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "healthy"}
    print("✓ Health check endpoint passed")

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "supported_languages" in data
    assert "Tamil" in data["supported_languages"]
    print("✓ Root discovery endpoint passed")

def test_login():
    # Admin login
    res = client.post("/auth/login", json={"email": "admin@college.edu", "password": "Admin@123"})
    assert res.status_code == 200
    admin_token = res.json()["access_token"]
    assert admin_token is not None
    print("✓ Admin login passed")

    # Student login
    res = client.post("/auth/login", json={"email": "priya.student@college.edu", "password": "Student@123"})
    assert res.status_code == 200
    student_token = res.json()["access_token"]
    assert student_token is not None
    print("✓ Student login passed")

    return admin_token, student_token

def test_student_query_submission_and_multilingual_routing(student_token):
    headers = {"Authorization": f"Bearer {student_token}"}

    # 1. English query
    payload_en = {
        "title": "Semester 6 Exam Hall Ticket",
        "description": "I need help with my exam hall ticket download before next week.",
        "selected_language": "English"
    }
    res_en = client.post("/queries", json=payload_en, headers=headers)
    assert res_en.status_code == 201
    q_en = res_en.json()
    assert q_en["detected_language"] == "English"
    assert q_en["predicted_intent"] == "Examination and Hall Ticket"
    assert q_en["assigned_department"] == "Examination Cell"
    print("✓ English Query classified as 'Examination and Hall Ticket' and routed to 'Examination Cell'")

    # 2. Tamil query
    payload_ta = {
        "title": "உதவித்தொகை விவரம்",
        "description": "எனக்கு இந்த ஆண்டிற்கான கல்வி உதவித்தொகை விண்ணப்பம் மற்றும் பணம் வரவு வைக்கப்படுவது பற்றிய விவரங்கள் தேவை.",
        "selected_language": "Tamil"
    }
    res_ta = client.post("/queries", json=payload_ta, headers=headers)
    assert res_ta.status_code == 201
    q_ta = res_ta.json()
    assert q_ta["detected_language"] == "Tamil"
    assert q_ta["predicted_intent"] == "Fees and Scholarships"
    assert q_ta["assigned_department"] == "Scholarship Office"
    print("✓ Tamil Query classified as 'Fees and Scholarships' and routed to 'Scholarship Office'")

    # 3. Hindi query
    payload_hi = {
        "title": "वाईफाई समस्या",
        "description": "कैंपस लाइब्रेरी में वाई-फाई नेटवर्क कनेक्ट नहीं हो रहा है और पासवर्ड काम नहीं कर रहा।",
        "selected_language": "Hindi"
    }
    res_hi = client.post("/queries", json=payload_hi, headers=headers)
    assert res_hi.status_code == 201
    q_hi = res_hi.json()
    assert q_hi["detected_language"] == "Hindi"
    assert q_hi["predicted_intent"] == "Technical Support"
    assert q_hi["assigned_department"] == "IT Support"
    print("✓ Hindi Query classified as 'Technical Support' and routed to 'IT Support'")

    return q_en["id"]

def test_staff_response_flow(admin_token, query_id):
    # Staff login
    res = client.post("/auth/login", json={"email": "exam.staff@college.edu", "password": "Staff@123"})
    assert res.status_code == 200
    staff_token = res.json()["access_token"]
    staff_headers = {"Authorization": f"Bearer {staff_token}"}

    # Staff view department queries
    res_list = client.get("/staff/queries", headers=staff_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) > 0
    print(f"✓ Staff retrieved {len(res_list.json())} department queries")

    # Staff post response
    res_reply = client.post(
        f"/staff/queries/{query_id}/responses",
        json={"response_text": "Hall ticket is now generated and ready to download in portal.", "response_language": "English"},
        headers=staff_headers
    )
    assert res_reply.status_code == 201
    print("✓ Staff posted response to query")

    # Staff update status to Resolved
    res_status = client.patch(
        f"/staff/queries/{query_id}/status",
        json={"status": "Resolved", "remarks": "Resolved by Examination staff."},
        headers=staff_headers
    )
    assert res_status.status_code == 200
    assert res_status.json()["status"] == "Resolved"
    print("✓ Query status successfully updated to 'Resolved'")

def test_admin_dashboard_and_analytics(admin_token):
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin dashboard
    res_dash = client.get("/admin/dashboard", headers=admin_headers)
    assert res_dash.status_code == 200
    data = res_dash.json()
    assert data["total_queries"] >= 4
    assert "intent_distribution" in data
    assert "language_distribution" in data
    print(f"✓ Admin Dashboard retrieved stats (Total queries: {data['total_queries']}, Students: {data['total_students']})")

    # Admin analytics
    res_ana = client.get("/admin/analytics", headers=admin_headers)
    assert res_ana.status_code == 200
    assert "resolution_rate" in res_ana.json()
    print("✓ Admin Analytics summary retrieved")

def run_all_tests():
    print("Starting Comprehensive Backend API Flow Tests...")
    test_health()
    test_root()
    admin_tok, student_tok = test_login()
    qid = test_student_query_submission_and_multilingual_routing(student_tok)
    test_staff_response_flow(admin_tok, qid)
    test_admin_dashboard_and_analytics(admin_tok)
    print("\nALL BACKEND API FLOW TESTS PASSED SUCCESSFULLY! 🚀")

if __name__ == "__main__":
    run_all_tests()
