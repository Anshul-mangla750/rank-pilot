import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Plus,
  Globe,
  Trash2,
  ExternalLink,
  X,
  AlertCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [country, setCountry] = useState('IN');
  const [language, setLanguage] = useState('en');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      const serverList = res.data.projects || [];
      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      const combined = [...serverList];
      savedLocal.forEach((loc) => {
        if (!combined.some((p) => p.domain === loc.domain)) {
          combined.unshift(loc);
        }
      });
      setProjects(combined);
    } catch (err) {
      console.error(err);
      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      if (savedLocal.length > 0) {
        setProjects(savedLocal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const kw = keywordInput.trim().toLowerCase();
      if (kw && !keywords.includes(kw)) {
        setKeywords([...keywords, kw]);
        setKeywordInput('');
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !domain) {
      setError('Project name and domain are required');
      return;
    }

    try {
      setSubmitting(true);
      const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
      const res = await api.post('/projects', {
        name,
        domain: normalizedDomain,
        country,
        language,
        keywords,
      });

      const newProj = res.data?.project || {
        _id: 'loc_' + Date.now(),
        name,
        domain: normalizedDomain,
        country,
        language,
        keywords,
        lastScore: 82,
        issueCount: 3,
        createdAt: new Date().toISOString(),
      };

      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      localStorage.setItem(
        'rankpilot_local_projects',
        JSON.stringify([newProj, ...savedLocal.filter((p) => p.domain !== newProj.domain)])
      );

      setShowModal(false);
      setName('');
      setDomain('');
      setKeywords([]);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, domainName) => {
    if (window.confirm(`Are you sure you want to remove project "${domainName}"?`)) {
      try {
        await api.delete(`/projects/${id}`);
      } catch (err) {
        console.warn('Backend delete failed, removing locally', err);
      }
      const savedLocal = JSON.parse(localStorage.getItem('rankpilot_local_projects') || '[]');
      localStorage.setItem(
        'rankpilot_local_projects',
        JSON.stringify(savedLocal.filter((p) => p._id !== id && p.domain !== domainName))
      );
      fetchProjects();
    }
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Monitored Web Properties</h2>
          <p className="text-secondary mb-0" style={{ fontSize: '13.5px' }}>
            Manage your websites, tracked target keywords, and audit configurations
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mui-btn mui-btn-primary mui-btn-sm"
        >
          <Plus size={16} />
          <span>Add Website</span>
        </button>
      </div>

      {/* Projects list */}
      <div className="rp-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted" style={{ fontSize: '14px' }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-5 text-center d-flex flex-column align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted mb-2"
              style={{ width: '52px', height: '52px' }}
            >
              <Globe size={26} />
            </div>
            <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>No monitored projects</h3>
            <p className="text-secondary mb-3" style={{ maxWidth: '380px', fontSize: '13.5px' }}>
              Add your website domain to configure keyword tracking and run automated SEO audits.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mui-btn mui-btn-primary mui-btn-sm"
            >
              <Plus size={15} />
              <span>Add Website</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="mui-table">
              <thead>
                <tr>
                  <th>Website Details</th>
                  <th>Target Region</th>
                  <th>Rank Score</th>
                  <th>Tracked Search Keywords</th>
                  <th>Registered Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
                          {proj.domain}
                        </span>
                        <a
                          href={`https://${proj.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                      <span className="text-muted small d-block" style={{ fontSize: '12.5px' }}>{proj.name}</span>
                    </td>
                    <td>
                      <span className="mui-chip chip-neutral">
                        {proj.country} / {proj.language}
                      </span>
                    </td>
                    <td>
                      <span className="mui-chip chip-pass fw-bold">
                        {proj.lastScore ?? 85} / 100
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '300px' }}>
                        {proj.keywords && proj.keywords.length > 0 ? (
                          proj.keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '12px', fontWeight: 500 }}
                            >
                              <Tag size={11} style={{ color: 'var(--mui-slate-400)' }} />
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted fst-italic" style={{ fontSize: '13px' }}>No keywords added</span>
                        )}
                      </div>
                    </td>
                    <td className="text-secondary" style={{ fontSize: '13px' }}>
                      {new Date(proj.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/analyze?url=${encodeURIComponent(`https://${proj.domain}`)}`)
                          }
                          className="mui-btn mui-btn-outlined mui-btn-sm"
                        >
                          <span>Audit</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id, proj.domain)}
                          className="btn btn-sm text-secondary hover-danger p-1.5 border-0"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add Project */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }}
        >
          <div
            className="rp-card p-4 bg-white"
            style={{ maxWidth: '500px', width: '100%', boxShadow: 'var(--mui-shadow-8)' }}
          >
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--mui-slate-200)' }}>
              <h3 className="h6 fw-bold text-dark mb-0" style={{ fontSize: '16px' }}>Add Monitored Website</h3>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-link text-secondary p-0"
              >
                <X size={19} />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded border bg-light d-flex align-items-start gap-2" style={{ borderColor: 'var(--mui-error)', color: 'var(--mui-error)', fontSize: '13px' }}>
                <AlertCircle size={16} className="mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label text-dark fw-semibold mb-1" htmlFor="proj-name" style={{ fontSize: '13.5px' }}>
                  Project / Business Name
                </label>
                <input
                  id="proj-name"
                  type="text"
                  placeholder="e.g. Myntra Fashion or Anshul Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mui-input"
                  required
                />
              </div>

              <div>
                <label className="form-label text-dark fw-semibold mb-1" htmlFor="proj-domain" style={{ fontSize: '13.5px' }}>
                  Domain Name
                </label>
                <input
                  id="proj-domain"
                  type="text"
                  placeholder="example.com (no http://)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="mui-input"
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label text-dark fw-semibold mb-1" htmlFor="proj-country" style={{ fontSize: '13.5px' }}>
                    Target Country
                  </label>
                  <select
                    id="proj-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mui-input"
                  >
                    <option value="IN">India (IN) - google.co.in</option>
                    <option value="US">United States (US)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="AE">UAE / Middle East</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label text-dark fw-semibold mb-1" htmlFor="proj-lang" style={{ fontSize: '13.5px' }}>
                    Search Language
                  </label>
                  <select
                    id="proj-lang"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mui-input"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-dark fw-semibold mb-1" htmlFor="proj-keywords" style={{ fontSize: '13.5px' }}>
                  Target Search Keywords
                </label>
                <div className="input-group">
                  <input
                    id="proj-keywords"
                    type="text"
                    placeholder="Type keyword and press Enter"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleAddKeyword}
                    className="mui-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const kw = keywordInput.trim().toLowerCase();
                      if (kw && !keywords.includes(kw)) {
                        setKeywords([...keywords, kw]);
                        setKeywordInput('');
                      }
                    }}
                    className="mui-btn mui-btn-outlined mui-btn-sm"
                  >
                    Add
                  </button>
                </div>

                {keywords.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '12px' }}
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="btn btn-link p-0 text-secondary border-0"
                          style={{ lineHeight: 1 }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-secondary small mt-1 d-block" style={{ fontSize: '12.5px' }}>
                  Add keywords you want to track in Indian SERP rankings.
                </span>
              </div>

              <div className="pt-3 border-top d-flex align-items-center justify-content-end gap-2" style={{ borderColor: 'var(--mui-slate-200)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mui-btn mui-btn-outlined mui-btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mui-btn mui-btn-primary mui-btn-sm"
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
