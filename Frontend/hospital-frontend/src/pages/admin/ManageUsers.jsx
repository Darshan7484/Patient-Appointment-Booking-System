import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { getRoleBadgeClass } from '../../utils/format';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    adminAPI.getAllUsers()
      .then(res => setUsers(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    setDeleting(id);
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      addNotification('User deleted successfully', 'success');
    } catch {
      addNotification('Failed to delete user', 'error');
    }
    finally { setDeleting(null); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-danger" />
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold"><i className="bi bi-people text-danger me-2"></i>Manage Users</h3>
          <p className="text-muted mb-0">{users.length} registered users</p>
        </div>
        <div className="input-group" style={{ maxWidth: 260 }}>
          <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text" className="form-control border-start-0"
            placeholder="Search users..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 d-block mb-2"></i>No users found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className={`bg-${getRoleBadgeClass(u.role)} bg-opacity-15 rounded-circle d-flex align-items-center justify-content-center`}
                            style={{ width: 36, height: 36 }}>
                            <i className={`bi bi-person text-${getRoleBadgeClass(u.role)}`}></i>
                          </div>
                          <span className="fw-semibold">{u.name || '—'}</span>
                        </div>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        <span className={`badge bg-${getRoleBadgeClass(u.role)} px-3 py-2`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id || u.role === 'ADMIN'}
                          title={u.role === 'ADMIN' ? 'Cannot delete admin' : 'Delete user'}
                        >
                          {deleting === u.id
                            ? <span className="spinner-border spinner-border-sm"></span>
                            : <><i className="bi bi-trash me-1"></i>Delete</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
