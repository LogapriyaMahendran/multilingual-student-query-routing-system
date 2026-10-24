from typing import Dict, Any

DEPARTMENT_MAPPING = {
    "Examination and Hall Ticket": "Examination Cell",
    "Academic Support": "Academic Department",
    "Technical Support": "IT Support",
    "Certificates and Documents": "Certificate & Verification Section",
    "Admission and Enrollment": "Admission Cell",
    "General Enquiry": "Student Support Desk"
}

SCHOLARSHIP_KEYWORDS = [
    "scholarship", "merit", "concession", "waiver",
    "உதவித்தொகை", "छात्रवृत्ति", "स्कॉलरशिप", "സ്കോളർഷിപ്പ്", "స్కాలర్‌షిప్", "ವಿದ್ಯಾರ್ಥಿವೇತನ"
]

TRANSPORT_KEYWORDS = [
    "bus", "transport", "bus pass", "bus route", "driver",
    "பேருந்து", "போக்குவரத்து", "பஸ் பாஸ்",
    "बस", "परिवहन", "बस पास",
    "ബസ്സ്", "യാത്ര",
    "బస్సు", "రవాణా",
    "ಬಸ್", "ಸಾರಿಗೆ"
]

def route_query(intent: str, text: str, confidence_score: float) -> Dict[str, str]:
    """
    Intelligently routes a query to the appropriate college department
    based on predicted intent, keyword disambiguation, and confidence threshold.
    """
    lower_text = text.lower()

    # Rule 1: Fallback for low confidence (< 0.35)
    if confidence_score < 0.35:
        return {
            "assigned_department": "Student Support Desk",
            "routing_reason": "Low classification confidence (< 35%); routed to General Student Support for manual triage."
        }

    # Rule 2: Fees vs Scholarship disambiguation
    if intent == "Fees and Scholarships":
        is_scholarship = any(kw in lower_text for kw in SCHOLARSHIP_KEYWORDS)
        if is_scholarship:
            return {
                "assigned_department": "Scholarship Office",
                "routing_reason": "Routed to Scholarship Office based on detected scholarship query parameters."
            }
        else:
            return {
                "assigned_department": "Accounts Department",
                "routing_reason": "Routed to Accounts Department based on tuition fee and payment parameters."
            }

    # Rule 3: Hostel vs Transport disambiguation
    if intent == "Hostel and Transport":
        is_transport = any(kw in lower_text for kw in TRANSPORT_KEYWORDS)
        if is_transport:
            return {
                "assigned_department": "Transport Office",
                "routing_reason": "Routed to Transport Office based on campus bus and route requirements."
            }
        else:
            return {
                "assigned_department": "Hostel Administration",
                "routing_reason": "Routed to Hostel Administration based on student housing and mess parameters."
            }

    # Standard routing for other intents
    assigned_dept = DEPARTMENT_MAPPING.get(intent, "Student Support Desk")
    routing_reason = f"Automatically routed to {assigned_dept} based on predicted intent '{intent}'."

    return {
        "assigned_department": assigned_dept,
        "routing_reason": routing_reason
    }
