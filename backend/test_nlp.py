import sys
from services.nlp_service import nlp_service

def test():
    test_queries = [
        ("English Exam", "I need help with my exam hall ticket.", "English"),
        ("Tamil Exam", "எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும்.", "Tamil"),
        ("Hindi Exam", "मुझे परीक्षा का हॉल टिकट चाहिए।", "Hindi"),
        ("Malayalam Hostel", "ഹോസ്റ്റൽ മുറി ലഭിക്കാൻ എങ്ങനെ അപേക്ഷിക്കണം?", "Malayalam"),
        ("Telugu Fee", "కాలేజీ ఫీజు చెల్లించడానికి చివరి తేదీ ఏమిటి?", "Telugu"),
        ("Kannada Wifi", "ವೈಫೈ ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇದೆ", "Kannada")
    ]

    for title, desc, expected_lang in test_queries:
        res = nlp_service.classify_intent(title, desc, expected_lang)
        print(f"[{res['detected_language']}] -> Intent: '{res['predicted_intent']}' (Confidence: {res['confidence_score']}, Priority: {res['priority']})")

if __name__ == "__main__":
    test()
