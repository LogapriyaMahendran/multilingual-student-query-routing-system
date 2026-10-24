import sys
from datetime import datetime, timezone, timedelta
from database import engine, SessionLocal, Base
from models import User, Query, Response, QueryHistory, Notification
from services.auth_service import hash_password
from services.nlp_service import nlp_service
from services.routing_service import route_query

def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() > 0:
            print("Database already contains data. Skipping initial seeding.")
            return

        print("Seeding initial users (Admin, Staff, Students)...")
        now = datetime.now(timezone.utc)

        # 1. Admin
        admin = User(
            full_name="College Administrator",
            email="admin@college.edu",
            hashed_password=hash_password("Admin@123"),
            role="admin",
            department="Administration",
            created_at=now - timedelta(days=10)
        )
        db.add(admin)

        # 2. Staff members
        exam_staff = User(
            full_name="Dr. Sundar Rajan",
            email="exam.staff@college.edu",
            hashed_password=hash_password("Staff@123"),
            role="staff",
            department="Examination Cell",
            created_at=now - timedelta(days=9)
        )
        accounts_staff = User(
            full_name="Mrs. Meena Sharma",
            email="accounts.staff@college.edu",
            hashed_password=hash_password("Staff@123"),
            role="staff",
            department="Accounts Department",
            created_at=now - timedelta(days=9)
        )
        it_staff = User(
            full_name="Mr. Rajesh Kumar",
            email="it.staff@college.edu",
            hashed_password=hash_password("Staff@123"),
            role="staff",
            department="IT Support",
            created_at=now - timedelta(days=9)
        )
        academic_staff = User(
            full_name="Prof. Kavitha Raman",
            email="academic.staff@college.edu",
            hashed_password=hash_password("Staff@123"),
            role="staff",
            department="Academic Department",
            created_at=now - timedelta(days=9)
        )
        db.add_all([exam_staff, accounts_staff, it_staff, academic_staff])
        db.flush()

        # 3. Students
        student1 = User(
            full_name="M. Logapriya",
            email="priya.student@college.edu",
            hashed_password=hash_password("Student@123"),
            role="student",
            department="Computer Science and Engineering",
            year_of_study="3rd Year",
            created_at=now - timedelta(days=8)
        )
        student2 = User(
            full_name="Rahul Verma",
            email="rahul.student@college.edu",
            hashed_password=hash_password("Student@123"),
            role="student",
            department="Information Technology",
            year_of_study="2nd Year",
            created_at=now - timedelta(days=7)
        )
        db.add_all([student1, student2])
        db.flush()

        # 4. Sample Queries
        sample_queries_data = [
            {
                "student_id": student1.id,
                "title": "Semester 5 Exam Hall Ticket Not Downloading",
                "desc": "I am trying to download my semester 5 examination hall ticket from the portal, but it displays an error saying 'Record not found'. Please assist.",
                "lang": "English",
                "days_ago": 4
            },
            {
                "student_id": student1.id,
                "title": "ஹால் டிக்கெட் திருத்தம் தேவை",
                "desc": "எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும். என் பெயரில் எழுத்துப் பிழை உள்ளது, அதை உடனடியாக சரிசெய்து தர வேண்டுகிறேன்.",
                "lang": "Tamil",
                "days_ago": 3
            },
            {
                "student_id": student2.id,
                "title": "कॉलेज फीस भुगतान रसीद डाउनलोड नहीं हो रही",
                "desc": "मैंने कल शाम को ऑनलाइन पोर्टल द्वारा सेमेस्टर फीस का भुगतान किया था, लेकिन बैंक से पैसे कटने के बाद भी फीस रसीद जनरेट नहीं हुई है।",
                "lang": "Hindi",
                "days_ago": 2
            },
            {
                "student_id": student2.id,
                "title": "Campus Wi-Fi connectivity and moodle portal login issue",
                "desc": "Unable to connect to college high-speed Wi-Fi network in Library Block B and my LMS portal password is locked.",
                "lang": "English",
                "days_ago": 1
            }
        ]

        print("Seeding sample queries with automated NLP classification and routing...")
        for q_data in sample_queries_data:
            c_res = nlp_service.classify_intent(q_data["title"], q_data["desc"], q_data["lang"])
            r_res = route_query(c_res["predicted_intent"], f"{q_data['title']} {q_data['desc']}", c_res["confidence_score"])

            query = Query(
                student_id=q_data["student_id"],
                title=q_data["title"],
                description=q_data["desc"],
                selected_language=q_data["lang"],
                detected_language=c_res["detected_language"],
                predicted_intent=c_res["predicted_intent"],
                confidence_score=c_res["confidence_score"],
                assigned_department=r_res["assigned_department"],
                priority=c_res["priority"],
                status="Assigned",
                routing_reason=r_res["routing_reason"],
                created_at=now - timedelta(days=q_data["days_ago"])
            )
            db.add(query)
            db.flush()

            # Add History
            db.add(QueryHistory(
                query_id=query.id,
                changed_by=q_data["student_id"],
                old_status="Submitted",
                new_status="Assigned",
                remarks=f"Query automatically classified as '{c_res['predicted_intent']}' and routed to {r_res['assigned_department']}.",
                created_at=query.created_at
            ))

            # Add sample response for the first query
            if q_data["lang"] == "English" and "Exam Hall Ticket" in q_data["title"]:
                query.status = "In Progress"
                resp = Response(
                    query_id=query.id,
                    responder_id=exam_staff.id,
                    response_text="Dear student, we have verified your exam registration. Your hall ticket generation flag has been re-enabled. Kindly log in again and click 'Download Admit Card'.",
                    response_language="English",
                    created_at=now - timedelta(days=3)
                )
                db.add(resp)
                db.add(QueryHistory(
                    query_id=query.id,
                    changed_by=exam_staff.id,
                    old_status="Assigned",
                    new_status="In Progress",
                    remarks="Examination staff verified registration details and responded to student.",
                    created_at=now - timedelta(days=3)
                ))

            # Add sample response for Tamil query
            if q_data["lang"] == "Tamil":
                query.status = "Resolved"
                resp = Response(
                    query_id=query.id,
                    responder_id=exam_staff.id,
                    response_text="வணக்கம், உங்கள் தேர்வு ஹால் டிக்கெட்டில் உள்ள பெயர் பிழை சரிசெய்யப்பட்டது. இப்போது புதிய ஹால் டிக்கெட்டை போர்ட்டலில் இருந்து பதிவிறக்கம் செய்து கொள்ளலாம்.",
                    response_language="Tamil",
                    created_at=now - timedelta(days=1)
                )
                db.add(resp)
                db.add(QueryHistory(
                    query_id=query.id,
                    changed_by=exam_staff.id,
                    old_status="In Progress",
                    new_status="Resolved",
                    remarks="Name correction finalized in academic examination database.",
                    created_at=now - timedelta(days=1)
                ))

            # Student Notification
            db.add(Notification(
                user_id=q_data["student_id"],
                message=f"Your query '{query.title[:35]}' was routed to {query.assigned_department}.",
                is_read=False,
                created_at=query.created_at
            ))

        db.commit()
        print("Database successfully initialized and seeded with demo accounts and queries!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
