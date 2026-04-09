import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const emptyForm = { name: '', specialization: '', email: '', phone: '', experience: '' };

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    doctorAPI.getAll()
      .then(res => setDoctors(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setError(''); setShowModal(true); };
  const openEdit = (doc) => {
    setForm({ name: doc.name || '', specialization: doc.specialization || '', email: doc.email || '', phone: doc.phone || '', experience: doc.experience || '' });
    setEditId(doc.id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editId) {
        const res = await doctorAPI.updateDoctor(editId, form);
        setDoctors(prev => prev.map(d => d.id === editId ? res.data : d));
        addNotification('Doctor updated successfully', 'success');
      } else {
        const res = await doctorAPI.addDoctor(form);
        setDoctors(prev => [...prev, res.data]);
        addNotification('Doctor added successfully', 'success');
      }
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Save failed.';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await doctorAPI.deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
      addNotification('Doctor deleted successfully', 'success');
    } catch {
      addNotification('Failed to delete doctor', 'error');
    }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-success" />
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold"><i className="bi bi-person-badge text-success me-2"></i>Manage Doctors</h3>
          <p className="text-muted mb-0">{doctors.length} doctor(s) registered</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: 220 }}>
            <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0" placeholder="Search..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1"></i>Add Doctor
          </button>
        </div>
      </div>

      <div className="row g-3">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5 text-muted">
                <i className="bi bi-person-badge fs-1 d-block mb-2"></i>
                No doctors found. <button className="btn btn-link p-0" onClick={openAdd}>Add one now.</button>
              </div>
            </div>
          </div>
        ) : (
          filtered.map(doc => (
            <div className="col-md-6 col-lg-4" key={doc.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="bg-success bg-opacity-10 rounded-3 p-2 flex-shrink-0">
                      <i className="bi bi-person-badge text-success fs-3"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Dr. {doc.name}</h6>
                      <span className="badge bg-success bg-opacity-15 text-success small">{doc.specialization}</span>
                    </div>
                  </div>
                  {doc.email && (
                    <div className="small text-muted mb-1"><i className="bi bi-envelope me-2"></i>{doc.email}</div>
                  )}
                  {doc.phone && (
                    <div className="small text-muted mb-1"><i className="bi bi-telephone me-2"></i>{doc.phone}</div>
                  )}
                  {doc.experience && (
                    <div className="small text-muted"><i className="bi bi-award me-2"></i>{doc.experience} years experience</div>
                  )}
                </div>
                <div className="card-footer bg-white border-0 d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={() => openEdit(doc)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm flex-grow-1" onClick={() => handleDelete(doc.id)}>
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${editId ? 'bi-pencil' : 'bi-plus-circle'} text-success me-2`}></i>
                  {editId ? 'Edit Doctor' : 'Add New Doctor'}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input type="text" className="form-control" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Specialization *</label>
                    <input type="text" className="form-control" value={form.specialization}
                      onChange={e => setForm({ ...form, specialization: e.target.value })}
                      placeholder="e.g. Cardiology" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" className="form-control" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col">
                      <label className="form-label fw-semibold">Phone</label>
                      <input type="text" className="form-control" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="col">
                      <label className="form-label fw-semibold">Experience (years)</label>
                      <input type="number" className="form-control" value={form.experience}
                        onChange={e => setForm({ ...form, experience: e.target.value })} min={0} />
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success px-4" disabled={saving}>
                      {saving ? <span className="spinner-border spinner-border-sm"></span> : (editId ? 'Save Changes' : 'Add Doctor')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
