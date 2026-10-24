import React from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();

  if (s === 'resolved') {
    return (
      <span className="badge badge-resolved">
        <CheckCircle2 size={13} />
        Resolved
      </span>
    );
  }
  if (s === 'in progress') {
    return (
      <span className="badge badge-inprogress">
        <RefreshCw size={13} className="spin-slow" />
        In Progress
      </span>
    );
  }
  if (s === 'assigned') {
    return (
      <span className="badge badge-assigned">
        <Clock size={13} />
        Assigned
      </span>
    );
  }
  if (s === 'reopened') {
    return (
      <span className="badge badge-reopened">
        <AlertCircle size={13} />
        Reopened
      </span>
    );
  }

  return (
    <span className="badge badge-submitted">
      <Send size={13} />
      {status || 'Submitted'}
    </span>
  );
};

export default StatusBadge;
