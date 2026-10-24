import React from 'react';
import { Flame, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const PriorityBadge = ({ priority }) => {
  const p = (priority || '').toLowerCase();

  if (p === 'urgent') {
    return (
      <span className="badge priority-urgent">
        <Flame size={13} />
        Urgent
      </span>
    );
  }
  if (p === 'high') {
    return (
      <span className="badge priority-high">
        <ArrowUp size={13} />
        High
      </span>
    );
  }
  if (p === 'medium') {
    return (
      <span className="badge priority-medium">
        <ArrowRight size={13} />
        Medium
      </span>
    );
  }

  return (
    <span className="badge priority-low">
      <ArrowDown size={13} />
      {priority || 'Low'}
    </span>
  );
};

export default PriorityBadge;
