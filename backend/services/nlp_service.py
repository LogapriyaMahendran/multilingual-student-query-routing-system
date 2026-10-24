import re
import unicodedata
from typing import Dict, Any, Tuple, Optional
from services.ml_training_data import TRAINING_DATA

# Optional ML model imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

SUPPORTED_LANGUAGES = [
    "English",
    "Tamil",
    "Hindi",
    "Malayalam",
    "Telugu",
    "Kannada"
]

INTENTS = [
    "Academic Support",
    "Examination and Hall Ticket",
    "Fees and Scholarships",
    "Admission and Enrollment",
    "Technical Support",
    "Hostel and Transport",
    "Certificates and Documents",
    "General Enquiry"
]

# Script ranges for language detection
SCRIPT_RANGES = {
    "Tamil": (0x0B80, 0x0BFF),
    "Hindi": (0x0900, 0x097F),
    "Malayalam": (0x0D00, 0x0D7F),
    "Telugu": (0x0C00, 0x0C7F),
    "Kannada": (0x0C80, 0x0CFF)
}

# Multilingual keywords dictionary for fallback / baseline matching
KEYWORD_RULES = {
    "Examination and Hall Ticket": [
        # English
        "exam", "hall ticket", "hallticket", "admit card", "examination", "revaluation",
        "marksheet", "grade card", "result", "arrear", "supplementary", "timetable", "schedule",
        # Tamil
        "தேர்வு", "ஹால் டிக்கெட்", "மதிப்பெண்", "மறுமதிப்பீடு", "அரியர்", "முடிவுகள்",
        # Hindi
        "परीक्षा", "हॉल टिकट", "एडमिट कार्ड", "अंकतालिका", "पुनर्मूल्यांकन", "रिजल्ट", "बैक पेपर",
        # Malayalam
        "പരീക്ഷ", "ഹാൾ ടിക്കറ്റ്", "മാർക്ക്", "റീവാല്യുവേഷൻ", "ഫലം",
        # Telugu
        "పరీక్ష", "హాల్ టికెట్", "మార్కులు", "రీవాల్యుయేషన్", "ఫలితాలు",
        # Kannada
        "ಪರೀಕ್ಷೆ", "ಹಾಲ್ ಟಿಕೆಟ್", "ಅಂಕಪಟ್ಟಿ", "ಮರುಮೌಲ್ಯಮಾಪನ", "ಫಲಿತಾಂಶ"
    ],
    "Fees and Scholarships": [
        # English
        "fee", "fees", "tuition", "scholarship", "receipt", "installment", "payment",
        "dues", "refund", "concession", "waiver", "bank", "transaction", "paid",
        # Tamil
        "கட்டணம்", "கல்விக்கட்டணம்", "உதவித்தொகை", "ரசீது", "தவணை", "பணம்", "செலுத்து",
        # Hindi
        "फीस", "शुल्क", "छात्रवृत्ति", "स्कॉलरशिप", "रसीद", "किस्त", "भुगतान",
        # Malayalam
        "ഫീസ്", "ട്യൂഷൻ ഫീസ്", "സ്കോളർഷിപ്പ്", "രസീത്", "പണം",
        # Telugu
        "ఫీజు", "స్కాలర్‌షిప్", "రసీదు", "చెల్లింపు",
        # Kannada
        "ಶುಲ್ಕ", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "ರಸೀದಿ", "ಪಾವತಿ"
    ],
    "Academic Support": [
        # English
        "syllabus", "curriculum", "attendance", "elective", "course", "subject", "faculty",
        "professor", "notes", "lecture", "leave", "lab manual", "class", "assignment",
        # Tamil
        "பாடத்திட்டம்", "வருகை", "விருப்பப்பாடம்", "விரிவுரை", "விடுப்பு", "பேராசிரியர்",
        # Hindi
        "सिलेबस", "पाठ्यक्रम", "उपस्थिति", "विषय", "कक्षा", "प्रोफेसर", "नोट्स",
        # Malayalam
        "സിലബസ്", "അറ്റൻഡൻസ്", "ക്ലാസ്", "അധ്യാപകൻ",
        # Telugu
        "సిలబస్", "హాజరు", "తరగతి", "సబ్జెక్ట్",
        # Kannada
        "ಪಠ್ಯಕ್ರಮ", "ಹಾಜರಾತಿ", "ತರಗತಿ", "ವಿಷಯ"
    ],
    "Admission and Enrollment": [
        # English
        "admission", "enrollment", "seat", "allotment", "counseling", "lateral entry",
        "branch change", "transfer", "application", "eligibility",
        # Tamil
        "சேர்க்கை", "பதிவு", "இடஒதுக்கீடு", "துறை மாற்றம்",
        # Hindi
        "प्रवेश", "नामांकन", "सीट आवंटन", "काउंसलिंग",
        # Malayalam
        "അഡ്മിഷൻ", "പ്രവേശനം", "സീറ്റ്",
        # Telugu
        "అడ్మిషన్", "సీటు కేటాయింపు",
        # Kannada
        "ಪ್ರವೇಶ", "ದಾಖಲಾತಿ", "ಸೀಟು ಹಂಚಿಕೆ"
    ],
    "Technical Support": [
        # English
        "login", "password", "wifi", "wi-fi", "portal", "lms", "moodle", "app",
        "network", "server", "reset", "email account", "computer lab", "error",
        # Tamil
        "உள்நுழைவு", "கடவுச்சொல்", "வைஃபை", "போர்ட்டல்", "மின்னஞ்சல்", "இணையம்",
        # Hindi
        "लॉगिन", "पासवर्ड", "वाई-फाई", "पोर्टल", "नेटवर्क", "ईमेल",
        # Malayalam
        "ലോഗിൻ", "പാസ്‌വേഡ്", "വൈഫൈ", "പോർട്ടൽ",
        # Telugu
        "లాగిన్", "పాస్‌వర్డ్", "వైఫై", "పోర్టల్",
        # Kannada
        "ಲಾಗಿನ್", "ಪಾಸ್‌ವರ್ಡ್", "ವೈಫೈ", "ಪೋರ್ಟಲ್"
    ],
    "Hostel and Transport": [
        # English
        "hostel", "mess", "room", "food", "bus", "transport", "bus pass", "route",
        "accommodation", "warden", "driver",
        # Tamil
        "விடுதி", "உணவு", "பேருந்து", "போக்குவரத்து", "பஸ் பாஸ்", "அறை",
        # Hindi
        "हॉस्टल", "मेस", "कमरा", "बस", "परिवहन", "बस पास",
        # Malayalam
        "ഹോസ്റ്റൽ", "മുറി", "ഭക്ഷണം", "ബസ്സ്", "യാത്ര",
        # Telugu
        "హాస్టల్", "గది", "భోజనం", "బస్సు", "రవాణా",
        # Kannada
        "ಹಾಸ್ಟೆಲ್", "ಕೊಠಡಿ", "ಊಟ", "ಬಸ್", "ಸಾರಿಗೆ"
    ],
    "Certificates and Documents": [
        # English
        "bonafide", "certificate", "tc", "transfer certificate", "provisional",
        "degree certificate", "marksheet duplicate", "transcript", "document", "verification",
        # Tamil
        "சான்றிதழ்", "உண்மைச்சான்றிதழ்", "மாற்றுச் சான்றிதழ்", "பட்டச் சான்றிதழ்",
        # Hindi
        "प्रमाणपत्र", "बोनाफाइड", "सर्टिफिकेट", "ट्रांसफर सर्टिफिकेट", "डिग्री",
        # Malayalam
        "സർട്ടിഫിക്കറ്റ്", "ബോണഫൈഡ്", "ടിസി",
        # Telugu
        "సర్టిఫికెట్", "బోనఫైడ్", "ట్రాన్స్‌ఫర్ సర్టిఫికేట్",
        # Kannada
        "ಪ್ರಮಾಣಪತ್ರ", "ಬೋನಾಫೈಡ್", "ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ"
    ],
    "General Enquiry": [
        # English
        "working hours", "timing", "reopen", "holiday", "vacation", "sports day",
        "cultural", "contact", "office", "campus", "enquiry", "information",
        # Tamil
        "வேலை நேரம்", "விடுமுறை", "திறக்கப்படும்", "விளையாட்டு", "விவரங்கள்",
        # Hindi
        "कार्य समय", "छुट्टियां", "कार्यालय", "जानकारी", "पूछताछ",
        # Malayalam
        "പ്രവർത്തിക്കുന്ന സമയം", "അവധി", "വിവരം",
        # Telugu
        "పని వేళలు", "సెలవులు", "సమాచారం",
        # Kannada
        "ಕೆಲಸದ ಸಮಯ", "ರಜೆ", "ಮಾಹಿತಿ"
    ]
}

URGENCY_KEYWORDS = [
    # English
    "urgent", "immediately", "emergency", "asap", "deadline today", "tomorrow exam",
    "critical", "locked out", "immediately required", "hurry",
    # Tamil
    "அவசரம்", "உடனடியாக", "நாளை தேர்வு", "முக்கியம்",
    # Hindi
    "तत्काल", "अति आवश्यक", "जल्दी", "कल परीक्षा",
    # Malayalam
    "അടിയന്തിരം", "ഉടൻ തന്നെ",
    # Telugu
    "వెంటనే", "అత్యవసరం",
    # Kannada
    "ತುರ್ತು", "ತಕ್ಷಣವೇ"
]

class MultilingualNLPService:
    def __init__(self):
        self.ml_pipeline = None
        self.is_ml_trained = False
        self._initialize_ml_model()

    def _initialize_ml_model(self):
        """Trains a real TF-IDF + LogisticRegression model on multilingual college dataset."""
        try:
            texts = [item[0] for item in TRAINING_DATA]
            labels = [item[1] for item in TRAINING_DATA]

            # char_wb n-grams (3-5) work effectively across agglutinative Indic scripts and English
            self.ml_pipeline = Pipeline([
                ("tfidf", TfidfVectorizer(
                    analyzer="char_wb",
                    ngram_range=(3, 5),
                    lowercase=True,
                    min_df=1
                )),
                ("classifier", MultinomialNB(alpha=0.1))
            ])
            self.ml_pipeline.fit(texts, labels)
            self.is_ml_trained = True
            print("Successfully initialized and trained Multilingual Naive Bayes Intent Classifier.")
        except Exception as e:
            print(f"Warning: ML Model initialization error: {e}. Fallback keyword matcher active.")
            self.is_ml_trained = False

    def detect_language(self, text: str, user_selected: Optional[str] = None) -> str:
        """
        Detects language using Unicode script blocks with deterministic accuracy for Indic scripts.
        Falls back to user_selected or English.
        """
        if not text or not text.strip():
            return user_selected if user_selected in SUPPORTED_LANGUAGES else "English"

        clean_text = unicodedata.normalize("NFC", text)
        char_counts = {lang: 0 for lang in SCRIPT_RANGES}
        latin_count = 0
        total_letters = 0

        for ch in clean_text:
            if not ch.isalnum():
                continue
            code = ord(ch)
            total_letters += 1

            # Check Indic scripts
            matched_indic = False
            for lang, (start, end) in SCRIPT_RANGES.items():
                if start <= code <= end:
                    char_counts[lang] += 1
                    matched_indic = True
                    break

            if not matched_indic:
                if ('a' <= ch <= 'z') or ('A' <= ch <= 'Z'):
                    latin_count += 1

        if total_letters == 0:
            return user_selected if user_selected in SUPPORTED_LANGUAGES else "English"

        # Check which Indic language dominates
        dominant_indic_lang = max(char_counts, key=char_counts.get)
        dominant_indic_count = char_counts[dominant_indic_lang]

        if dominant_indic_count > 0 and (dominant_indic_count / total_letters) > 0.12:
            return dominant_indic_lang

        # If user explicitly selected an Indic language and text is transliterated or matches
        if user_selected in SUPPORTED_LANGUAGES and user_selected != "English":
            return user_selected

        return "English"

    def detect_priority(self, combined_text: str) -> str:
        """Determines query priority (Urgent, High, Medium, Low)."""
        lower = combined_text.lower()
        for kw in URGENCY_KEYWORDS:
            if kw in lower:
                return "Urgent"

        # High priority indicators
        high_indicators = ["revaluation", "admit card", "payment failed", "marksheet missing", "hall ticket"]
        for ind in high_indicators:
            if ind in lower:
                return "High"

        # Low priority indicators
        low_indicators = ["general enquiry", "sports day", "cultural", "when will college", "vacation"]
        for ind in low_indicators:
            if ind in lower:
                return "Low"

        return "Medium"

    def classify_with_keywords(self, combined_text: str) -> Tuple[str, float]:
        """Baseline keyword-based intent classification."""
        lower_text = combined_text.lower()
        scores = {intent: 0.0 for intent in INTENTS}

        for intent, keywords in KEYWORD_RULES.items():
            for kw in keywords:
                if kw.lower() in lower_text:
                    # Longer keyword matches get slightly higher weight
                    weight = 1.0 + (0.1 * min(len(kw.split()), 3))
                    scores[intent] += weight

        best_intent = max(scores, key=scores.get)
        best_score = scores[best_intent]

        if best_score == 0:
            return "General Enquiry", 0.35

        # Normalize confidence into 0.50 - 0.95 range
        confidence = min(0.95, 0.55 + (best_score * 0.15))
        return best_intent, round(confidence, 2)

    def classify_intent(self, title: str, description: str, selected_lang: Optional[str] = None) -> Dict[str, Any]:
        """
        Classifies the student query into one of 8 intents using real ML inference,
        with keyword fallback and language detection.
        """
        combined_text = f"{title.strip()} {description.strip()}".strip()
        detected_lang = self.detect_language(combined_text, selected_lang)
        priority = self.detect_priority(combined_text)

        ml_predicted_intent = None
        ml_confidence = 0.0
        model_name = "Keyword Pattern Baseline"

        # 1. Try ML Model Inference if available
        if self.is_ml_trained and self.ml_pipeline is not None and len(combined_text) >= 3:
            try:
                probs = self.ml_pipeline.predict_proba([combined_text])[0]
                classes = self.ml_pipeline.classes_
                max_idx = probs.argmax()
                ml_confidence = float(probs[max_idx])
                ml_predicted_intent = classes[max_idx]
                model_name = "TF-IDF + Logistic Regression (Multilingual)"
            except Exception as e:
                print(f"ML inference warning: {e}")
                ml_predicted_intent = None

        # 2. Check keyword baseline
        kw_intent, kw_confidence = self.classify_with_keywords(combined_text)

        # 3. Ensemble / Selection decision:
        # If ML confidence is good (>= 0.40), use ML.
        # If ML confidence is low or uncertain, and keyword score is solid, use keyword or blend.
        if ml_predicted_intent and ml_confidence >= 0.40:
            final_intent = ml_predicted_intent
            final_confidence = round(ml_confidence, 2)
            reasoning = f"Classified by {model_name} with {int(final_confidence * 100)}% confidence score."
        else:
            final_intent = kw_intent
            final_confidence = kw_confidence
            model_name = "Multilingual Rule-based Keyword Engine"
            reasoning = f"Matched via {model_name} targeting college domain semantics."

        return {
            "detected_language": detected_lang,
            "predicted_intent": final_intent,
            "confidence_score": final_confidence,
            "priority": priority,
            "model_used": model_name,
            "reasoning": reasoning
        }

# Global singleton instance
nlp_service = MultilingualNLPService()
