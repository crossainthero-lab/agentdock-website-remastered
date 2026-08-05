import { useEffect, useState, type FormEvent } from 'react';
import { Download, LogOut, RefreshCw, Save } from 'lucide-react';
import { MarkdownContent } from '../components/MarkdownContent';

type Tab = 'join' | 'contact' | 'analytics' | 'blog';
type JoinRequest = {
  id: string;
  name: string;
  email: string;
  intendedUse?: string;
  intended_use?: string;
  selectedAgents?: string[];
  message?: string;
  sourcePage?: string;
  status: string;
  internalNotes?: string;
  created_at: string;
};
type ContactRequest = {
  id: string;
  name: string;
  email: string;
  contactReason?: string;
  contact_reason?: string;
  message: string;
  sourcePage?: string;
  status: string;
  internalNotes?: string;
  created_at: string;
};
type AnalyticsSummary = {
  totals: Record<string, number>;
  groupedByPage: Array<Record<string, string | number>>;
  groupedByDay: Array<Record<string, string | number>>;
};
type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  contentMarkdown?: string;
  status: 'draft' | 'published' | 'archived';
};

const joinStatuses = ['New', 'Contacted', 'Accepted', 'Rejected', 'Archived'];
const contactStatuses = ['New', 'Contacted', 'Resolved', 'Archived'];

async function api<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json', ...(init.headers || {}) } : init?.headers,
    ...init,
  });
  const body = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) throw new Error(body.message || 'Request failed.');
  return body;
}

export function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/session')
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
      setPassword('');
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    }
  };

  if (authenticated === null) return <AdminShell>Checking admin session...</AdminShell>;
  if (!authenticated) {
    return (
      <AdminShell>
        <form onSubmit={login} className="mx-auto mt-32 max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="mb-2 text-2xl font-semibold text-white">AgentDock admin</h1>
          <p className="mb-6 text-sm text-gray-400">Sign in to manage requests, analytics, and blog posts.</p>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" autoComplete="current-password" />
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <button className="mt-5 w-full rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-gray-100">Sign in</button>
        </form>
      </AdminShell>
    );
  }

  return <AdminApp onLogout={() => setAuthenticated(false)} />;
}

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('join');
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    onLogout();
  };
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">AgentDock admin</p>
            <h1 className="text-3xl font-semibold text-white">Management</h1>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>
        <nav className="mb-6 flex flex-wrap gap-2">
          {[
            ['join', 'AgentDock Pro'],
            ['contact', 'Contact'],
            ['analytics', 'Analytics'],
            ['blog', 'Blog'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as Tab)} className={`rounded-lg px-4 py-2 text-sm ${tab === key ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {label}
            </button>
          ))}
        </nav>
        {tab === 'join' && <JoinAdmin />}
        {tab === 'contact' && <ContactAdmin />}
        {tab === 'analytics' && <AnalyticsAdmin />}
        {tab === 'blog' && <BlogAdmin />}
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#05050A] text-white">{children}</main>;
}

function JoinAdmin() {
  const [items, setItems] = useState<JoinRequest[]>([]);
  const [query, setQuery] = useState('');
  const load = async () => {
    const body = await api<{ requests: JoinRequest[] }>('/api/admin/join-pro');
    setItems(body.requests);
  };
  useEffect(() => void load(), []);
  const filtered = items.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <Panel title="AgentDock Pro requests" action={<a href="/api/admin/join-pro/export" className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-black"><Download className="h-4 w-4" /> CSV</a>}>
      <input placeholder="Search name or email" value={query} onChange={(event) => setQuery(event.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-blue-500" />
      <div className="space-y-3">
        {filtered.map((item) => <JoinCard key={item.id} item={item} onSaved={load} />)}
        {!filtered.length && <Empty />}
      </div>
    </Panel>
  );
}

function JoinCard({ item, onSaved }: { item: JoinRequest; onSaved: () => void }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.internalNotes || '');
  const save = async () => {
    await api(`/api/admin/join-pro/${item.id}`, { method: 'PATCH', body: JSON.stringify({ status, internalNotes: notes }) });
    onSaved();
  };
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div>
          <h3 className="font-semibold text-white">{item.name} <span className="text-blue-200">{item.email}</span></h3>
          <p className="mt-1 text-sm text-gray-400">{item.intendedUse || item.intended_use}</p>
          <p className="mt-1 text-xs text-gray-500">{(item.selectedAgents || []).join(', ')} - {item.sourcePage || '-'}</p>
          {item.message && <p className="mt-2 text-sm text-gray-300">{item.message}</p>}
        </div>
        <div className="min-w-56 space-y-2">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
            {joinStatuses.map((option) => <option key={option}>{option}</option>)}
          </select>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Internal notes" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
          <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-black"><Save className="h-4 w-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}

function ContactAdmin() {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const load = async () => {
    const body = await api<{ contacts: ContactRequest[] }>('/api/admin/contact');
    setItems(body.contacts);
  };
  useEffect(() => void load(), []);
  return (
    <Panel title="Contact requests">
      <div className="space-y-3">
        {items.map((item) => <ContactCard key={item.id} item={item} onSaved={load} />)}
        {!items.length && <Empty />}
      </div>
    </Panel>
  );
}

function ContactCard({ item, onSaved }: { item: ContactRequest; onSaved: () => void }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.internalNotes || '');
  const save = async () => {
    await api(`/api/admin/contact/${item.id}`, { method: 'PATCH', body: JSON.stringify({ status, internalNotes: notes }) });
    onSaved();
  };
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="font-semibold text-white">{item.name} <span className="text-blue-200">{item.email}</span></h3>
      <p className="mt-1 text-sm text-blue-200">{item.contactReason || item.contact_reason}</p>
      <p className="mt-2 text-sm text-gray-300">{item.message}</p>
      <p className="mt-1 text-xs text-gray-500">{item.sourcePage || '-'}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[12rem_1fr_auto]">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
          {contactStatuses.map((option) => <option key={option}>{option}</option>)}
        </select>
        <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Internal notes" className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
        <button onClick={save} className="rounded-lg bg-white px-3 py-2 text-sm text-black">Save</button>
      </div>
    </div>
  );
}

function AnalyticsAdmin() {
  const [range, setRange] = useState('7d');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    api<AnalyticsSummary>(`/api/admin/analytics/summary?range=${range}`).then(setSummary).catch(() => setSummary(null));
  }, [range]);
  const totals = summary?.totals || {};
  return (
    <Panel title="Funnel analytics" action={<button onClick={() => api<AnalyticsSummary>(`/api/admin/analytics/summary?range=${range}`).then(setSummary)} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white"><RefreshCw className="h-4 w-4" /></button>}>
      <div className="mb-4 flex gap-2">
        {['7d', '30d', 'all'].map((option) => <button key={option} onClick={() => setRange(option)} className={`rounded-lg px-3 py-2 text-sm ${range === option ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>{option}</button>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Contact CTA clicks', totals.contactCtaClicks],
          ['Contact opens', totals.contactFlowOpens],
          ['Final-step sessions', totals.contactFinalStepSessions],
          ['Contact submissions', totals.contactSubmissions],
          ['Final-step abandoned', totals.contactFinalStepAbandonedSessions],
          ['Abandonment rate', `${Math.round((totals.contactFinalStepAbandonmentRate || 0) * 100)}%`],
          ['Join clicks', totals.joinProCtaClicks],
          ['Join conversion', `${Math.round((totals.joinProConversionRate || 0) * 100)}%`],
        ].map(([label, value]) => <Metric key={label} label={String(label)} value={value ?? 0} />)}
      </div>
      <h3 className="mt-6 mb-2 font-semibold">By page</h3>
      <DataRows rows={summary?.groupedByPage || []} />
      <h3 className="mt-6 mb-2 font-semibold">By day</h3>
      <DataRows rows={summary?.groupedByDay || []} />
    </Panel>
  );
}

function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState({ slug: '', title: '', excerpt: '', contentMarkdown: '', status: 'draft' });
  const load = async () => {
    const body = await api<{ posts: BlogPost[] }>('/api/admin/blog');
    setPosts(body.posts);
  };
  useEffect(() => void load(), []);
  const editPost = async (id: string) => {
    const body = await api<{ post: BlogPost }>(`/api/admin/blog/${id}`);
    setEditingId(id);
    setDraft({
      slug: body.post.slug,
      title: body.post.title,
      excerpt: body.post.excerpt || '',
      contentMarkdown: body.post.contentMarkdown || '',
      status: body.post.status,
    });
  };
  const reset = () => {
    setEditingId('');
    setDraft({ slug: '', title: '', excerpt: '', contentMarkdown: '', status: 'draft' });
  };
  const save = async () => {
    await api(editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog', {
      method: editingId ? 'PATCH' : 'POST',
      body: JSON.stringify(draft),
    });
    reset();
    await load();
  };
  const addVideo = () => setDraft((current) => ({ ...current, contentMarkdown: `${current.contentMarkdown}\n\n\`\`\`video\n${JSON.stringify({ type: 'video', url: 'https://example.com/demo.mp4', title: 'Demo', controls: true }, null, 2)}\n\`\`\`\n` }));
  const addMermaid = () => setDraft((current) => ({ ...current, contentMarkdown: `${current.contentMarkdown}\n\n\`\`\`mermaid\nflowchart TD\n  A[Prompt] --> B[AIgency]\n  B --> C[Claude]\n  B --> D[Codex]\n\`\`\`\n` }));
  return (
    <Panel title="Blog editor">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <input placeholder="Slug" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} className="admin-input-lite" />
          <input placeholder="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="admin-input-lite" />
          <input placeholder="Excerpt" value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} className="admin-input-lite" />
          <textarea placeholder="Markdown" value={draft.contentMarkdown} onChange={(event) => setDraft({ ...draft, contentMarkdown: event.target.value })} rows={12} className="admin-input-lite font-mono" />
          <div className="flex flex-wrap gap-2">
            <button onClick={addVideo} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">Add video block</button>
            <button onClick={addMermaid} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">Add Mermaid block</button>
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <button onClick={save} className="rounded-lg bg-white px-3 py-2 text-sm text-black">{editingId ? 'Save changes' : 'Save post'}</button>
            {editingId && <button onClick={reset} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white">New post</button>}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h3 className="mb-3 font-semibold">Preview</h3>
          <MarkdownContent markdown={draft.contentMarkdown || 'Post preview will appear here.'} />
        </div>
      </div>
      <h3 className="mt-6 mb-2 font-semibold">Existing posts</h3>
      <div className="space-y-2">
        {posts.map((post) => (
          <button key={post.id} onClick={() => void editPost(post.id)} className="block w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm hover:bg-white/[0.06]">
            {post.title} <span className="text-gray-500">/{post.slug} - {post.status}</span>
          </button>
        ))}
        {!posts.length && <Empty />}
      </div>
    </Panel>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-white/10 bg-black/30 p-4"><p className="text-sm text-gray-400">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p></div>;
}

function DataRows({ rows }: { rows: Array<Record<string, string | number>> }) {
  if (!rows.length) return <Empty />;
  return <pre className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-300">{JSON.stringify(rows, null, 2)}</pre>;
}

function Empty() {
  return <div className="rounded-xl border border-white/10 bg-black/20 p-6 text-center text-sm text-gray-500">No data yet.</div>;
}
