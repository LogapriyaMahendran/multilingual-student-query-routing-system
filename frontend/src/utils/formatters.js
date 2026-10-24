/**
 * Utility functions for date formatting, language representations, and badges
 */

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getLanguageBadge = (language) => {
  const map = {
    English: 'English',
    Tamil: 'தமிழ் (Tamil)',
    Hindi: 'हिन्दी (Hindi)',
    Malayalam: 'മലയാളം (Malayalam)',
    Telugu: 'తెలుగు (Telugu)',
    Kannada: 'ಕನ್ನಡ (Kannada)'
  };
  return map[language] || language;
};

export const getIntentColor = (intent) => {
  const map = {
    'Examination and Hall Ticket': '#3b82f6',
    'Fees and Scholarships': '#10b981',
    'Academic Support': '#8b5cf6',
    'Admission and Enrollment': '#f59e0b',
    'Technical Support': '#06b6d4',
    'Hostel and Transport': '#ec4899',
    'Certificates and Documents': '#6366f1',
    'General Enquiry': '#64748b'
  };
  return map[intent] || '#64748b';
};
