import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { dirOf, tr } from '@/gvpro/ui';
import { colourOf } from '@/gvpro/theme';
import Footer from '@/components/gvpro/Footer';
import '@/gvpro.css';

const STATUSES = ['new', 'contacted', 'won', 'lost'];
const STATUS_KEY = { new: 'stNew', contacted: 'stContacted', won: 'stWon', lost: 'stLost' };

/* The studio's own page: who asked, for what, in which colour, and where it stands.
   The door is guarded twice — the page only renders for a signed-in user with role admin, and
   the Lead entity's own read rule refuses everyone else. The second one is the real lock; this
   one only keeps the page from flashing a table it cannot fill. */
export default function Admin() {
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const lang = document.documentElement.lang || 'he';
  const t = useCallback((k) => tr(lang, k), [lang]);
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');

  const isAdmin = !!user && user.role === 'admin';

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) { navigateToLogin(); return; }
    if (!isAdmin) return;
    base44.entities.Lead.list('-created_date', 200)
      .then(setRows)
      .catch((e) => setErr(e?.message || 'error'));
  }, [isLoadingAuth, isAuthenticated, isAdmin, navigateToLogin]);

  async function setStatus(id, status) {
    setRows((old) => old.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await base44.entities.Lead.update(id, { status });
    } catch (e) {
      setErr(e?.message || 'error');
    }
  }

  if (isLoadingAuth) return null;
  if (!isAdmin) {
    return (
      <div className="gv" dir={dirOf(lang)}>
        <div className="gv-admin"><p>{t('adminOnly')}</p></div>
        <Footer lang={lang} />
      </div>
    );
  }

  return (
    <div className="gv" dir={dirOf(lang)}>
      <div className="gv-admin">
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>{t('admin')}</h1>
        {err ? <p className="gv-err">{err}</p> : null}
        {rows && rows.length === 0 ? <p>{t('empty')}</p> : null}
        {rows && rows.length ? (
          <table data-testid="leads-table">
            <thead>
              <tr>
                <th>{t('thWhen')}</th><th>{t('thName')}</th><th>{t('thBiz')}</th><th>{t('thWa')}</th>
                <th>{t('thJob')}</th><th>{t('thColour')}</th><th>{t('thPkg')}</th><th>{t('thLang')}</th>
                <th>{t('thNote')}</th><th>{t('thStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{String(r.created_date || '').slice(0, 16).replace('T', ' ')}</td>
                  <td>{r.name}</td>
                  <td>{r.business_name}</td>
                  <td dir="ltr"><a href={'https://wa.me/' + r.whatsapp} target="_blank" rel="noopener noreferrer">{r.whatsapp}</a></td>
                  <td>{r.job ? t('job_' + r.job) : ''}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {r.colour ? <><i className="gv-dot" style={{ background: colourOf(r.colour).hex }} /> {r.colour}</> : ''}
                  </td>
                  <td>{r.package}</td>
                  <td>{r.lang}</td>
                  <td style={{ maxWidth: 260 }}>{r.note}</td>
                  <td>
                    <select
                      value={r.status || 'new'}
                      aria-label={t('thStatus')}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{t(STATUS_KEY[s])}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
      <Footer lang={lang} />
    </div>
  );
}
