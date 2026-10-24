import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  GraduationCap,
  Building,
  Mail,
  Calendar,
  ShieldAlert
} from 'lucide-react';

const DEPARTMENTS = [
  "Examination Cell",
  "Accounts Department",
  "Scholarship Office",
  "IT Support",
  "Academic Department",
  "Hostel Administration",
  "Transport Office",
  "Certificate & Verification Section",
  "Admission Cell",
  "Student Support Desk"
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // New staff modal
  const [showModal, setShowModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    email: '',
    password: '',
    department: DEPARTMENTS[0],
    role: 'staff'
  });
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [feedback, setFeedback] = useState({ success: '', error: '' });

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.full_name || !newStaff.email || !newStaff.password) {
      setFeedback({ success: '', error: 'All fields are required.' });
      return;
    }

    setSubmittingStaff(true);
    setFeedback({ success: '', error: '' });
    try {
      await authAPI.register({
        full_name: newStaff.full_name,
        email: newStaff.email,
        password: newStaff.password,
        role: 'staff',
        department: newStaff.department
      });

      setFeedback({ success: `Staff member '${newStaff.full_name}' created successfully!`, error: '' });
      setShowModal(false);
      setNewStaff({
        full_name: '',
        email: '',
        password: '',
        department: DEPARTMENTS[0],
        role: 'staff'
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setFeedback({ success: '', error: err.response?.data?.detail || 'Failed to create staff member.' });
    } finally {
      setSubmittingStaff(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="page-wrapper">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            User Directory & Permissions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage campus students, authorized department staff, and system administrators
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <UserPlus size={18} /> Add Department Staff
        </button>
      </div>

      {feedback.success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{feedback.success}</span>
        </div>
      )}
      {feedback.error && (
        <div className="alert alert-danger">
          <ShieldAlert size={18} />
          <span>{feedback.error}</span>
        </div>
      )}

      <div className="card">
        {/* Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-select"
              style={{ width: '160px', fontSize: '0.85rem' }}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="staff">Department Staff</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading users...
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department / Study Year</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td><strong>#{u.id}</strong></td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {u.full_name}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.email}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: u.role === 'admin' ? '#fee2e2' : u.role === 'staff' ? '#e0f2fe' : '#ecfdf5',
                          color: u.role === 'admin' ? '#991b1b' : u.role === 'staff' ? '#0369a1' : '#166534'
                        }}
                      >
                        {u.role === 'admin' && <Shield size={12} />}
                        {u.role === 'staff' && <Building size={12} />}
                        {u.role === 'student' && <GraduationCap size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {u.department || 'N/A'}{u.year_of_study ? ` (${u.year_of_study})` : ''}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating Staff Account */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div className="card" style={{ maxWidth: '480px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Register Department Staff Member
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Authorize a staff member to handle queries for a designated college department
            </p>

            <form onSubmit={handleCreateStaff}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dr. Ananya Sen"
                  value={newStaff.full_name}
                  onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official College Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., ananya.sen@college.edu"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Department *</label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="form-select"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStaff}
                  className="btn btn-primary"
                >
                  {submittingStaff ? 'Creating...' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
