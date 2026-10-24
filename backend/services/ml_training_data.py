# Multilingual training corpus for College Query Intent Classification
# Languages: English, Tamil, Hindi, Malayalam, Telugu, Kannada
# Intents:
# 1. Academic Support
# 2. Examination and Hall Ticket
# 3. Fees and Scholarships
# 4. Admission and Enrollment
# 5. Technical Support
# 6. Hostel and Transport
# 7. Certificates and Documents
# 8. General Enquiry

TRAINING_DATA = [
    # Academic Support - English
    ("I need the syllabus for semester 4 computer science", "Academic Support"),
    ("When will the class timetable for the third year be updated?", "Academic Support"),
    ("How do I contact my faculty advisor regarding elective course selection?", "Academic Support"),
    ("Can I change my elective subject from AI to Cyber Security?", "Academic Support"),
    ("Where can I find lecture notes and reference textbooks for engineering physics?", "Academic Support"),
    ("I want to apply for academic leave due to medical illness", "Academic Support"),
    ("Attendance shortage query, how do I calculate my current percentage?", "Academic Support"),
    ("Lab manual for microprocessor lab is missing from portal", "Academic Support"),

    # Academic Support - Tamil
    ("4-ஆம் பருவத்திற்கான பாடத்திட்டம் எனக்கு வேண்டும்", "Academic Support"),
    ("வகுப்பு கால அட்டவணை எப்போது வெளியிடப்படும்?", "Academic Support"),
    ("விருப்பப்பாடத்தை மாற்ற நான் பேராசிரியரை எவ்வாறு தொடர்பு கொள்வது?", "Academic Support"),
    ("விரிவுரை குறிப்புகள் மற்றும் புத்தகங்கள் எங்கே கிடைக்கும்?", "Academic Support"),
    ("மருத்துவ காரணங்களால் விடுப்பு விண்ணப்பம் சமர்ப்பிக்க வேண்டும்", "Academic Support"),
    ("வருகை பதிவு குறைவாக உள்ளது, என்ன செய்வது?", "Academic Support"),

    # Academic Support - Hindi
    ("मुझे चौथे सेमेस्टर का सिलेबस चाहिए", "Academic Support"),
    ("कक्षा की समय सारिणी कब जारी होगी?", "Academic Support"),
    ("वैकल्पिक विषय बदलने के लिए प्रोफेसर से कैसे संपर्क करें?", "Academic Support"),
    ("इंजीनियरिंग के नोट्स और किताबें कहां मिलेंगी?", "Academic Support"),
    ("उपस्थिति कम होने पर क्या करना होगा?", "Academic Support"),

    # Academic Support - Malayalam
    ("നാലാം സെമസ്റ്ററിലെ സിലബസ് എനിക്ക് വേണം", "Academic Support"),
    ("ക്ലാസ് ടൈംടേബിൾ എപ്പോഴാണ് പ്രസിദ്ധീകരിക്കുക?", "Academic Support"),
    ("അറ്റൻഡൻസ് കുറവാണ്, എന്തുചെയ്യണം?", "Academic Support"),

    # Academic Support - Telugu
    ("నాకు నాల్గవ సెమిస్టర్ సిలబస్ కావాలి", "Academic Support"),
    ("క్లాస్ టైమ్‌టేబుల్ ఎప్పుడు విడుదల చేస్తారు?", "Academic Support"),
    ("హాజరు శాతం తక్కువగా ఉంది, ఏమి చేయాలి?", "Academic Support"),

    # Academic Support - Kannada
    ("ನನಗೆ ನಾಲ್ಕನೇ ಸೆಮಿಸ್ಟರ್ ಪಠ್ಯಕ್ರಮ ಬೇಕು", "Academic Support"),
    ("ತರಗತಿ ವೇಳಾಪಟ್ಟಿ ಯಾವಾಗ ಪ್ರಕಟವಾಗುತ್ತದೆ?", "Academic Support"),
    ("ಹಾಜರಾತಿ ಕೊರತೆಯಿದೆ, ನಾನು ಏನು ಮಾಡಬೇಕು?", "Academic Support"),

    # Examination and Hall Ticket - English
    ("I need help with my exam hall ticket download", "Examination and Hall Ticket"),
    ("My hall ticket is not generating on the student portal", "Examination and Hall Ticket"),
    ("When will semester exam results and grade cards be announced?", "Examination and Hall Ticket"),
    ("How do I apply for exam revaluation and paper photocopy?", "Examination and Hall Ticket"),
    ("Arrear examination schedule and supplementary exam fee payment", "Examination and Hall Ticket"),
    ("Correction of name in the semester marksheet", "Examination and Hall Ticket"),
    ("There is an exam date clash between two elective papers", "Examination and Hall Ticket"),
    ("Where is my exam center and seat allotment list?", "Examination and Hall Ticket"),

    # Examination and Hall Ticket - Tamil
    ("எனக்கு தேர்வு ஹால் டிக்கெட் வேண்டும்", "Examination and Hall Ticket"),
    ("ஹால் டிக்கெட் பதிவிறக்கம் செய்ய முடியவில்லை", "Examination and Hall Ticket"),
    ("பருவத் தேர்வு முடிவுகள் எப்போது வெளியாகும்?", "Examination and Hall Ticket"),
    ("மறுமதிப்பீட்டிற்கு எவ்வாறு விண்ணப்பிப்பது?", "Examination and Hall Ticket"),
    ("அரியர் தேர்வு கால அட்டவணை மற்றும் கட்டணம்", "Examination and Hall Ticket"),
    ("மதிப்பெண் சான்றிதழில் பெயர் பிழை திருத்தம் செய்ய வேண்டும்", "Examination and Hall Ticket"),

    # Examination and Hall Ticket - Hindi
    ("मुझे परीक्षा का हॉल टिकट चाहिए", "Examination and Hall Ticket"),
    ("हॉल टिकट डाउनलोड करने में समस्या आ रही है", "Examination and Hall Ticket"),
    ("सेमेस्टर परीक्षा का परिणाम कब आएगा?", "Examination and Hall Ticket"),
    ("पुनर्मूल्यांकन के लिए आवेदन कैसे करें?", "Examination and Hall Ticket"),
    ("बैक पेपर और सप्लीमेंट्री परीक्षा की तारीख क्या है?", "Examination and Hall Ticket"),

    # Examination and Hall Ticket - Malayalam
    ("പരീക്ഷ ഹാൾ ടിക്കറ്റ് എങ്ങനെ ഡൗൺലോഡ് ചെയ്യാം?", "Examination and Hall Ticket"),
    ("എക്സാം റിസൾട്ട് എപ്പോഴാണ് വരുന്നത്?", "Examination and Hall Ticket"),
    ("റീവാല്യുവേഷൻ അപേക്ഷ സമർപ്പിക്കാൻ സഹായിക്കുക", "Examination and Hall Ticket"),

    # Examination and Hall Ticket - Telugu
    ("నాకు పరీక్ష హాల్ టికెట్ డౌన్‌లోడ్ కావాలి", "Examination and Hall Ticket"),
    ("సెమిస్టర్ పరీక్ష ఫలితాలు ఎప్పుడు వస్తాయి?", "Examination and Hall Ticket"),
    ("రీవాల్యుయేషన్ కోసం ఎలా దరఖాస్తు చేయాలి?", "Examination and Hall Ticket"),

    # Examination and Hall Ticket - Kannada
    ("ನನ್ನ ಪರೀಕ್ಷಾ ಹಾಲ್ ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಹಾಯ ಬೇಕು", "Examination and Hall Ticket"),
    ("ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು ಯಾವಾಗ ಬರುತ್ತವೆ?", "Examination and Hall Ticket"),
    ("ಮರುಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "Examination and Hall Ticket"),

    # Fees and Scholarships - English
    ("What is the last date for semester tuition fee payment?", "Fees and Scholarships"),
    ("How can I apply for national and state merit scholarships?", "Fees and Scholarships"),
    ("Tuition fee receipt not generated after online payment", "Fees and Scholarships"),
    ("Can I pay my college fee in installments?", "Fees and Scholarships"),
    ("Scholarship amount has not been credited to my bank account", "Fees and Scholarships"),
    ("Fee waiver eligibility criteria for economically backward students", "Fees and Scholarships"),
    ("Payment deducted twice from bank account during fee transaction", "Fees and Scholarships"),

    # Fees and Scholarships - Tamil
    ("கல்விக் கட்டணம் செலுத்துவதற்கான கடைசி தேதி என்ன?", "Fees and Scholarships"),
    ("கல்வி உதவித்தொகைக்கு எவ்வாறு விண்ணப்பிப்பது?", "Fees and Scholarships"),
    ("கட்டணம் செலுத்திய பிறகு ரசீது வரவில்லை", "Fees and Scholarships"),
    ("கல்லூரி கட்டணத்தை தவணை முறையில் செலுத்த முடியுமா?", "Fees and Scholarships"),
    ("வங்கிக் கணக்கில் உதவித்தொகை வரவு வைக்கப்படவில்லை", "Fees and Scholarships"),

    # Fees and Scholarships - Hindi
    ("कॉलेज फीस जमा करने की अंतिम तिथि क्या है?", "Fees and Scholarships"),
    ("छात्रवृत्ति के लिए कैसे आवेदन करें?", "Fees and Scholarships"),
    ("फीस भुगतान के बाद रसीद नहीं मिली", "Fees and Scholarships"),
    ("क्या मैं किस्तों में फीस जमा कर सकता हूँ?", "Fees and Scholarships"),
    ("स्कॉलरशिप की राशि खाते में नहीं आई", "Fees and Scholarships"),

    # Fees and Scholarships - Malayalam
    ("ട്യൂഷൻ ഫീസ് അടയ്ക്കാനുള്ള അവസാന തീയതി എപ്പോഴാണ്?", "Fees and Scholarships"),
    ("സ്കോളർഷിപ്പിന് എങ്ങനെ അപേക്ഷിക്കാം?", "Fees and Scholarships"),
    ("ഫീസ് അടച്ച രസീത് ലഭിച്ചില്ല", "Fees and Scholarships"),

    # Fees and Scholarships - Telugu
    ("కాలేజీ ఫీజు చెల్లించడానికి చివరి తేదీ ఏమిటి?", "Fees and Scholarships"),
    ("స్కాలర్‌షిప్ కోసం ఎలా దరఖాస్తు చేయాలి?", "Fees and Scholarships"),
    ("ఫీజు రసీదు రాలేదు", "Fees and Scholarships"),

    # Fees and Scholarships - Kannada
    ("ಬೋಧನಾ ಶುಲ್ಕ ಪಾವತಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ ಯಾವುದು?", "Fees and Scholarships"),
    ("ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "Fees and Scholarships"),
    ("ಶುಲ್ಕ ಪಾವತಿ ರಸೀದಿ ಬಂದಿಲ್ಲ", "Fees and Scholarships"),

    # Admission and Enrollment - English
    ("What are the eligibility criteria for lateral entry admission?", "Admission and Enrollment"),
    ("How do I confirm my seat allotment in B.Tech engineering?", "Admission and Enrollment"),
    ("Documents required for first year undergraduate enrollment and counseling", "Admission and Enrollment"),
    ("Can I cancel my admission and receive a fee refund?", "Admission and Enrollment"),
    ("College transfer and branch change procedure after first year", "Admission and Enrollment"),
    ("Application status for postgraduate M.Tech admissions", "Admission and Enrollment"),

    # Admission and Enrollment - Tamil
    ("சேர்க்கை மற்றும் பதிவு நடைமுறைகள் என்ன?", "Admission and Enrollment"),
    ("கல்லூரி சேர்க்கைக்கான தகுதி என்ன?", "Admission and Enrollment"),
    ("சேர்க்கையை ரத்து செய்து கட்டணத்தை திரும்பப் பெறுவது எப்படி?", "Admission and Enrollment"),
    ("துறை மாற்றம் மற்றும் கல்லூரி இடமாற்றம்", "Admission and Enrollment"),

    # Admission and Enrollment - Hindi
    ("प्रवेश और नामांकन के लिए पात्रता नियम क्या हैं?", "Admission and Enrollment"),
    ("कॉलेज में सीट आवंटन की पुष्टि कैसे करें?", "Admission and Enrollment"),
    ("एडमिशन रद्द करके फीस वापसी की प्रक्रिया क्या है?", "Admission and Enrollment"),

    # Admission and Enrollment - Malayalam
    ("അഡ്മിഷൻ നടപടികൾ എന്തൊക്കെയാണ്?", "Admission and Enrollment"),
    ("അഡ്മിഷൻ റദ്ദാക്കി ഫീസ് തിരികെ ലഭിക്കുമോ?", "Admission and Enrollment"),

    # Admission and Enrollment - Telugu
    ("అడ్మిషన్ మరియు ఎన్‌రోల్‌మెంట్ ప్రక్రియ ఏమిటి?", "Admission and Enrollment"),
    ("సీటు కేటాయింపు ఎలా కన్ఫర్మ్ చేసుకోవాలి?", "Admission and Enrollment"),

    # Admission and Enrollment - Kannada
    ("ಪ್ರವೇಶ ಮತ್ತು ನೋಂದಣಿ ವಿಧಾನಗಳೇನು?", "Admission and Enrollment"),
    ("ಸೀಟು ಹಂಚಿಕೆಯನ್ನು ದೃಢೀಕರಿಸುವುದು ಹೇಗೆ?", "Admission and Enrollment"),

    # Technical Support - English
    ("I cannot log into my student portal account", "Technical Support"),
    ("Password reset link is not working for college email", "Technical Support"),
    ("Campus Wi-Fi connectivity issue in campus library", "Technical Support"),
    ("College mobile application crashes when opening results", "Technical Support"),
    ("LMS portal moodle account locked after incorrect attempts", "Technical Support"),
    ("Computer lab network connection and printer issue", "Technical Support"),

    # Technical Support - Tamil
    ("மாணவர் போர்ட்டலில் உள்நுழைய முடியவில்லை", "Technical Support"),
    ("வைஃபை இணைய இணைப்பு வேலை செய்யவில்லை", "Technical Support"),
    ("கடவுச்சொல் மீட்டமைக்க உதவி தேவை", "Technical Support"),
    ("கணினி ஆய்வகம் இணைய சிக்கல்", "Technical Support"),

    # Technical Support - Hindi
    ("छात्र पोर्टल में लॉगिन नहीं हो पा रहा है", "Technical Support"),
    ("कैंपस वाई-फाई कनेक्ट नहीं हो रहा है", "Technical Support"),
    ("पासवर्ड रीसेट करने में समस्या आ रही है", "Technical Support"),

    # Technical Support - Malayalam
    ("പോർട്ടൽ ലോഗിൻ ചെയ്യാൻ സാധിക്കുന്നില്ല", "Technical Support"),
    ("വൈഫൈ കണക്റ്റിവിറ്റി പ്രശ്നം", "Technical Support"),
    ("പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യാൻ സഹായിക്കുക", "Technical Support"),

    # Technical Support - Telugu
    ("పోర్టల్ లాగిన్ సమస్య పరిష్కరించండి", "Technical Support"),
    ("వైఫై కనెక్ట్ కావడం లేదు", "Technical Support"),
    ("పాస్‌వర్డ్ రీసెట్ చేయడం ఎలా?", "Technical Support"),

    # Technical Support - Kannada
    ("ಪೋರ್ಟಲ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ", "Technical Support"),
    ("ವೈಫೈ ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇದೆ", "Technical Support"),
    ("ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ಸಹಾಯ ಬೇಕು", "Technical Support"),

    # Hostel and Transport - English
    ("How do I apply for college hostel room allotment?", "Hostel and Transport"),
    ("College bus route timing and bus pass renewal", "Hostel and Transport"),
    ("Hostel mess food quality and room maintenance complaint", "Hostel and Transport"),
    ("Request for changing my hostel room and roommate", "Hostel and Transport"),
    ("New college bus route request for north district route", "Hostel and Transport"),
    ("Hostel fee payment deadline and security deposit refund", "Hostel and Transport"),

    # Hostel and Transport - Tamil
    ("விடுதி அறை ஒதுக்கீட்டிற்கு எவ்வாறு விண்ணப்பிப்பது?", "Hostel and Transport"),
    ("கல்லூரி பேருந்து வழித்தடம் மற்றும் பேருந்து பாஸ் புதுப்பித்தல்", "Hostel and Transport"),
    ("விடுதி உணவு மற்றும் பராமரிப்பு புகார்", "Hostel and Transport"),
    ("விடுதி அறை மாற்றம் செய்ய வேண்டும்", "Hostel and Transport"),

    # Hostel and Transport - Hindi
    ("हॉस्टल रूम आवंटन के लिए कैसे आवेदन करें?", "Hostel and Transport"),
    ("कॉलेज बस रूट और बस पास का नवीनीकरण", "Hostel and Transport"),
    ("हॉस्टल मेस भोजन और कमरे की समस्या", "Hostel and Transport"),

    # Hostel and Transport - Malayalam
    ("ഹോസ്റ്റൽ മുറി ലഭിക്കാൻ എങ്ങനെ അപേക്ഷിക്കണം?", "Hostel and Transport"),
    ("കോളേജ് ബസ് പാസ്സ് പുതുക്കാൻ എന്തുചെയ്യണം?", "Hostel and Transport"),

    # Hostel and Transport - Telugu
    ("హాస్టల్ గది కేటాయింపు కోసం ఎలా దరఖాస్తు చేయాలి?", "Hostel and Transport"),
    ("కాలేజీ బస్సు రూట్ మరియు బస్ పాస్ పునరుద్ధరణ", "Hostel and Transport"),

    # Hostel and Transport - Kannada
    ("ಹಾಸ್ಟೆಲ್ ಕೊಠಡಿ ಹಂಚಿಕೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "Hostel and Transport"),
    ("ಕಾಲೇಜು ಬಸ್ ಮಾರ್ಗ ಮತ್ತು ಬಸ್ ಪಾಸ್ ನವೀಕರಣ", "Hostel and Transport"),

    # Certificates and Documents - English
    ("How to apply for Bonafide certificate for passport verification?", "Certificates and Documents"),
    ("I need my provisional degree certificate and consolidated marksheet", "Certificates and Documents"),
    ("Course completion certificate and transfer certificate (TC) application", "Certificates and Documents"),
    ("Duplicate marksheet request for lost original mark sheet", "Certificates and Documents"),
    ("Medium of instruction certificate in English for higher studies", "Certificates and Documents"),
    ("Transcript application for foreign university admissions", "Certificates and Documents"),

    # Certificates and Documents - Tamil
    ("உண்மைச்சான்றிதழ் (Bonafide certificate) பெறுவது எப்படி?", "Certificates and Documents"),
    ("மாற்றுச் சான்றிதழ் (TC) மற்றும் தற்காலிக பட்டச் சான்றிதழ் தேவை", "Certificates and Documents"),
    ("மதிப்பெண் பட்டியல் தொலைந்துவிட்டது மாற்று நகல் வேண்டும்", "Certificates and Documents"),
    ("படிப்பை முடித்ததற்கான சான்றிதழ் விண்ணப்பம்", "Certificates and Documents"),

    # Certificates and Documents - Hindi
    ("बोनाफाइड सर्टिफिकेट (Bonafide) कैसे प्राप्त करें?", "Certificates and Documents"),
    ("ट्रांसफर सर्टिफिकेट (TC) और प्रोविजनल डिग्री चाहिए", "Certificates and Documents"),
    ("खोई हुई अंकतालिका की डुप्लीकेट कॉपी चाहिए", "Certificates and Documents"),

    # Certificates and Documents - Malayalam
    ("ബോണഫൈഡ് സർട്ടിഫിക്കറ്റ് എങ്ങനെ ലഭിക്കും?", "Certificates and Documents"),
    ("ടിസി (TC) ലഭിക്കുന്നതിന് അപേക്ഷ നൽകണം", "Certificates and Documents"),

    # Certificates and Documents - Telugu
    ("బోనఫైడ్ సర్టిఫికెట్ ఎలా పొందాలి?", "Certificates and Documents"),
    ("ట్రాన్స్‌ఫర్ సర్టిఫికేట్ (TC) మరియు మార్కుల పత్రం కావాలి", "Certificates and Documents"),

    # Certificates and Documents - Kannada
    ("ಬೋನಾಫೈಡ್ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯುವುದು ಹೇಗೆ?", "Certificates and Documents"),
    ("ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ (TC) ಮತ್ತು ಪದವಿ ಪ್ರಮಾಣಪತ್ರ ಬೇಕು", "Certificates and Documents"),

    # General Enquiry - English
    ("What are the working hours of college administrative office?", "General Enquiry"),
    ("When will the college reopen after vacation and summer holidays?", "General Enquiry"),
    ("Where is the lost and found section on campus?", "General Enquiry"),
    ("College annual sports day and cultural festival dates", "General Enquiry"),
    ("General information regarding guest house booking for parents", "General Enquiry"),
    ("Who should I contact for student union club registration?", "General Enquiry"),

    # General Enquiry - Tamil
    ("கல்லூரி அலுவலகத்தின் வேலை நேரம் என்ன?", "General Enquiry"),
    ("விடுமுறைக்குப் பிறகு கல்லூரி எப்போது திறக்கப்படும்?", "General Enquiry"),
    ("கல்லூரி விளையாட்டு மற்றும் கலாச்சார விழா நாட்கள் எப்போது?", "General Enquiry"),
    ("பொதுவான கல்லூரி விவரங்கள் அறிய வேண்டும்", "General Enquiry"),

    # General Enquiry - Hindi
    ("कॉलेज कार्यालय का कार्य समय क्या है?", "General Enquiry"),
    ("छुट्टियों के बाद कॉलेज कब खुलेगा?", "General Enquiry"),
    ("कॉलेज वार्षिक उत्सव और खेल दिवस कब है?", "General Enquiry"),

    # General Enquiry - Malayalam
    ("കോളേജ് പ്രവർത്തിക്കുന്ന സമയം എന്താണ്?", "General Enquiry"),
    ("അവധിക്ക് ശേഷം കോളേജ് എപ്പോൾ തുറക്കും?", "General Enquiry"),

    # General Enquiry - Telugu
    ("కాలేజీ పని వేళలు ఏమిటి?", "General Enquiry"),
    ("సెలవుల తర్వాత కాలేజీ ఎప్పుడు ప్రారంభమవుతుంది?", "General Enquiry"),

    # General Enquiry - Kannada
    ("ಕಾಲೇಜು ಕೆಲಸದ ಸಮಯ ಯಾವುದು?", "General Enquiry"),
    ("ರಜೆಯ ನಂತರ ಕಾಲೇಜು ಯಾವಾಗ ಪುನರಾರಂಭವಾಗುತ್ತದೆ?", "General Enquiry")
]
