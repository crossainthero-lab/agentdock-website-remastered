import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import mermaid from 'mermaid';
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Save,
  Send,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Upload,
} from 'lucide-react';
import { Mermaid } from '../components/Mermaid';
import { MarkdownContent } from '../components/MarkdownContent';
import { parseMarkdownImport, slugify } from '../lib/contentImport';
import type {
  ApiResponse,
  BlogPost,
  BlogPostInput,
  BlogPostStatus,
  TechnicalSection,
  TechnicalSectionInput,
} from '../types/cms';

type AdminView = 'dashboard' | 'blog' | 'technical';

const emptyBlogDraft: BlogPostInput = {
  title: '',
  slug: '',
  description: '',
  category: '',
  coverImage: '',
  contentMarkdown: '',
  status: 'draft',
  publishedAt: null,
};

const emptyTechnicalDraft: TechnicalSectionInput = {
  sectionKey: '',
  title: '',
  contentMarkdown: '',
  mermaidSource: '',
  sortOrder: 0,
  isVisible: true,
};

export function Admin() {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'anonymous'>('checking');
  const [view, setView] = useState<AdminView>('dashboard');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth/me', { credentials: 'include' })
      .then((response) => {
        setAuthStatus(response.ok ? 'authenticated' : 'anonymous');
      })
      .catch(() => setAuthStatus('anonymous'));
  }, []);

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' });
    setAuthStatus('anonymous');
    setMessage('');
  };

  if (authStatus === 'checking') {
    return <AdminShell>Checking admin session...</AdminShell>;
  }

  if (authStatus === 'anonymous') {
    return <LoginScreen onLogin={() => setAuthStatus('authenticated')} />;
  }

  return (
    <AdminShell>
      <div className="min-h-screen grid lg:grid-cols-[16rem_1fr]">
        <aside className="border-b lg:border-b-0 lg:border-r border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] p-4 lg:min-h-screen">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-[var(--color-ad-text-muted)] mb-2">AgentDock</p>
            <h1 className="text-xl font-bold text-white">Content Admin</h1>
          </div>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto">
            <AdminNavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            <AdminNavButton active={view === 'blog'} onClick={() => setView('blog')} icon={<FileText className="w-4 h-4" />} label="Blog" />
            <AdminNavButton active={view === 'technical'} onClick={() => setView('technical')} icon={<Pencil className="w-4 h-4" />} label="AIgency Technical" />
          </nav>
          <button onClick={logout} className="mt-8 inline-flex items-center gap-2 rounded-md border border-[var(--color-ad-border)] px-3 py-2 text-sm text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface-hover)]">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </aside>

        <section className="p-4 md:p-8 max-w-[90rem] w-full">
          {message && (
            <div className="mb-5 rounded-md border border-[var(--color-accent-green-border)] bg-[var(--color-accent-green-soft)] px-4 py-3 text-sm text-[var(--color-accent-green)]">
              {message}
            </div>
          )}
          {view === 'dashboard' && <Dashboard />}
          {view === 'blog' && <BlogAdmin onMessage={setMessage} />}
          {view === 'technical' && <TechnicalAdmin onMessage={setMessage} />}
        </section>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[var(--color-ad-bg)] text-[var(--color-ad-text)]">{children}</div>;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiRequest<{ authenticated: boolean }>('/api/admin/auth/login', {
        method: 'POST',
        body: { password },
      });
      if (response.ok) {
        setPassword('');
        onLogin();
      } else if ('error' in response) {
        setError(response.error);
      }
    } catch {
      setError('Login failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <div className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Admin login</h1>
          <p className="text-sm text-[var(--color-ad-text-muted)] mb-6">Enter the single-admin password.</p>
          <label className="block text-sm font-medium text-white mb-2" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] px-3 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
            autoComplete="current-password"
          />
          {error && <p className="mt-3 text-sm text-[var(--color-accent-amber)]">{error}</p>}
          <button disabled={isSubmitting} className="mt-6 w-full rounded-md bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-accent-purple-hover)] disabled:opacity-60">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-3">Dashboard</h2>
      <p className="text-[var(--color-ad-text-muted)] max-w-2xl">
        Manage published blog content and the structured AIgency Technical Architecture page. Blog publishing is explicit; technical architecture saves go live immediately.
      </p>
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] p-5">
          <h3 className="font-bold text-white mb-2">Blog posts</h3>
          <p className="text-sm text-[var(--color-ad-text-muted)]">Create drafts, preview articles, publish, unpublish, or delete posts.</p>
        </div>
        <div className="rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] p-5">
          <h3 className="font-bold text-white mb-2">AIgency Technical Architecture</h3>
          <p className="text-sm text-[var(--color-ad-text-muted)]">Edit structured sections, Mermaid diagrams, visibility, and ordering.</p>
        </div>
      </div>
    </div>
  );
}

function BlogAdmin({ onMessage }: { onMessage: (message: string) => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedId, setSelectedId] = useState<number | 'new' | null>(null);
  const [draft, setDraft] = useState<BlogPostInput>(emptyBlogDraft);
  const [loadedSnapshot, setLoadedSnapshot] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedPost = posts.find((post) => post.id === selectedId);
  const isNew = selectedId === 'new';
  const isDirty = JSON.stringify(draft) !== loadedSnapshot;

  useUnsavedWarning(isDirty);

  const loadPosts = async () => {
    setIsLoading(true);
    setError('');
    const response = await apiRequest<BlogPost[]>('/api/admin/blog');
    if (response.ok) {
      setPosts(response.data);
      if (!selectedId && response.data.length > 0) {
        selectPost(response.data[0]);
      }
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const selectPost = (post: BlogPost) => {
    const nextDraft = toBlogInput(post);
    setSelectedId(post.id);
    setDraft(nextDraft);
    setLoadedSnapshot(JSON.stringify(nextDraft));
    setError('');
  };

  const createNew = () => {
    setSelectedId('new');
    setDraft(emptyBlogDraft);
    setLoadedSnapshot(JSON.stringify(emptyBlogDraft));
    setError('');
  };

  const updateDraft = (patch: Partial<BlogPostInput>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const onTitleChange = (title: string) => {
    const shouldSuggestSlug = isNew && (!draft.slug || draft.slug === suggestSlug(draft.title));
    updateDraft({ title, ...(shouldSuggestSlug ? { slug: suggestSlug(title) } : {}) });
  };

  const save = async (status: BlogPostStatus) => {
    setIsSaving(true);
    setError('');
    const payload = {
      ...draft,
      status,
      confirmSlugChange: selectedPost?.status === 'published' && selectedPost.slug !== draft.slug
        ? window.confirm('Changing a published slug can break existing links. Continue?')
        : false,
    };

    if (selectedPost?.status === 'published' && selectedPost.slug !== draft.slug && !payload.confirmSlugChange) {
      setIsSaving(false);
      return;
    }

    const response = await apiRequest<BlogPost>(
      isNew ? '/api/admin/blog' : `/api/admin/blog/${selectedId}`,
      {
        method: isNew ? 'POST' : 'PUT',
        body: payload,
      },
    );

    if (response.ok) {
      onMessage(status === 'published' ? 'Blog post published.' : 'Blog post saved as draft.');
      await loadPosts();
      if (response.data) {
        selectPost(response.data);
      }
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsSaving(false);
  };

  const deleteCurrent = async () => {
    if (!selectedId || selectedId === 'new') {
      createNew();
      return;
    }

    if (!window.confirm('Delete this blog post permanently?')) {
      return;
    }

    setIsSaving(true);
    const response = await apiRequest<{ deleted: boolean }>(`/api/admin/blog/${selectedId}`, { method: 'DELETE' });
    if (response.ok) {
      onMessage('Blog post deleted.');
      setSelectedId(null);
      setDraft(emptyBlogDraft);
      setLoadedSnapshot(JSON.stringify(emptyBlogDraft));
      await loadPosts();
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Blog</h2>
          <p className="text-sm text-[var(--color-ad-text-muted)]">Saving does not publish unless you choose Publish.</p>
        </div>
        <button onClick={createNew} className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-accent-purple-hover)]">
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      {error && <AdminError error={error} />}
      {isLoading ? (
        <p className="text-[var(--color-ad-text-muted)]">Loading blog posts...</p>
      ) : (
        <div className="grid xl:grid-cols-[minmax(20rem,28rem)_1fr] gap-6">
          <div className="rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] overflow-hidden">
            {posts.length === 0 ? (
              <div className="p-6 text-sm text-[var(--color-ad-text-muted)]">No blog posts exist yet. Create a draft to get started.</div>
            ) : (
              <div className="divide-y divide-[var(--color-ad-border)]">
                {posts.map((post) => (
                  <div key={post.id} className={`p-4 ${selectedId === post.id ? 'bg-[var(--color-accent-purple-soft)]' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <button onClick={() => selectPost(post)} className="text-left">
                        <p className="font-bold text-white">{post.title}</p>
                        <p className="text-xs text-[var(--color-ad-text-muted)]">{post.slug}</p>
                      </button>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--color-ad-text-muted)]">
                      <span>{post.category || 'No category'}</span>
                      <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}</span>
                      <span className="col-span-2">Updated {formatDate(post.updatedAt)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button onClick={() => selectPost(post)} className="admin-mini-button"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                      <button onClick={() => selectPost(post)} className="admin-mini-button"><Eye className="w-3.5 h-3.5" /> Preview</button>
                      <button onClick={() => { selectPost(post); void save(post.status === 'published' ? 'draft' : 'published'); }} className="admin-mini-button">
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid 2xl:grid-cols-2 gap-6">
            <EditorPanel title={isNew ? 'Create post' : 'Edit post'}>
              <BlogEditor draft={draft} selectedPost={selectedPost} onChange={updateDraft} onTitleChange={onTitleChange} />
              <div className="mt-5 flex flex-wrap gap-3">
                <button disabled={isSaving} onClick={() => save('draft')} className="admin-primary-button"><Save className="w-4 h-4" /> Save draft</button>
                <button disabled={isSaving} onClick={() => save('published')} className="admin-primary-button"><Send className="w-4 h-4" /> Publish</button>
                {selectedPost?.status === 'published' && (
                  <button disabled={isSaving} onClick={() => save('draft')} className="admin-secondary-button"><EyeOff className="w-4 h-4" /> Unpublish</button>
                )}
                <button disabled={isSaving} onClick={deleteCurrent} className="admin-danger-button"><Trash2 className="w-4 h-4" /> Delete</button>
              </div>
              {isDirty && <p className="mt-3 text-xs text-[var(--color-accent-amber)]">Unsaved changes</p>}
            </EditorPanel>

            <EditorPanel title="Live preview">
              <BlogPreview draft={draft} />
            </EditorPanel>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogEditor({
  draft,
  selectedPost,
  onChange,
  onTitleChange,
}: {
  draft: BlogPostInput;
  selectedPost?: BlogPost;
  onChange: (patch: Partial<BlogPostInput>) => void;
  onTitleChange: (title: string) => void;
}) {
  const publishedSlugChanged = selectedPost?.status === 'published' && selectedPost.slug !== draft.slug;
  const [importError, setImportError] = useState('');

  const importMarkdown = async (file: File) => {
    try {
      const imported = parseMarkdownImport(await readTextFile(file), file.name);
      onChange({
        title: draft.title || imported.title || '',
        slug: draft.slug || suggestSlug(imported.slug ?? imported.title ?? ''),
        description: draft.description || imported.description || '',
        category: draft.category || imported.category || '',
        coverImage: draft.coverImage || imported.coverImage || '',
        contentMarkdown: imported.markdown,
      });
      setImportError('');
    } catch (error) {
      setImportError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4">
      <AdminField label="Title">
        <input value={draft.title} onChange={(event) => onTitleChange(event.target.value)} className="admin-input" />
      </AdminField>
      <AdminField label="Slug">
        <input value={draft.slug} onChange={(event) => onChange({ slug: suggestSlug(event.target.value) })} className="admin-input font-mono" />
        {publishedSlugChanged && <p className="mt-2 text-xs text-[var(--color-accent-amber)]">Changing a published slug can break existing links.</p>}
      </AdminField>
      <AdminField label="Description">
        <textarea value={draft.description} onChange={(event) => onChange({ description: event.target.value })} className="admin-textarea h-24" />
      </AdminField>
      <div className="grid md:grid-cols-2 gap-4">
        <AdminField label="Category">
          <input value={draft.category ?? ''} onChange={(event) => onChange({ category: event.target.value })} className="admin-input" />
        </AdminField>
        <AdminField label="Cover image">
          <input value={draft.coverImage ?? ''} onChange={(event) => onChange({ coverImage: event.target.value })} className="admin-input" placeholder="/agentdock-screenshot.png or https://..." />
        </AdminField>
      </div>
      <AdminField label="Markdown content">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-ad-text-muted)]">Import a `.md` or `.markdown` file. Front matter can set title, slug, description, category, and cover image.</p>
          <FileImportButton accept=".md,.markdown,.txt,text/markdown,text/plain" label="Import Markdown" onFile={importMarkdown} />
        </div>
        <textarea value={draft.contentMarkdown} onChange={(event) => onChange({ contentMarkdown: event.target.value })} className="admin-textarea min-h-[28rem] font-mono text-sm" />
        {importError && <p className="mt-2 rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-3 py-2 text-xs text-[var(--color-accent-amber)]">{importError}</p>}
      </AdminField>
    </div>
  );
}

function BlogPreview({ draft }: { draft: BlogPostInput }) {
  return (
    <article>
      {draft.coverImage && <img src={draft.coverImage} alt="" className="mb-6 w-full rounded-lg border border-[var(--color-ad-border)] object-cover max-h-72" />}
      <div className="mb-4 flex items-center gap-3 text-xs text-[var(--color-ad-text-muted)]">
        <span className="rounded-full bg-[var(--color-ad-border)] px-2.5 py-0.5 text-white">{draft.category || 'Update'}</span>
        <span>{draft.publishedAt ? formatDate(draft.publishedAt) : 'Draft preview'}</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">{draft.title || 'Untitled post'}</h1>
      <p className="text-[var(--color-ad-text-muted)] mb-8">{draft.description || 'No description yet.'}</p>
      <MarkdownContent markdown={draft.contentMarkdown || 'Start writing to preview the article.'} />
    </article>
  );
}

function TechnicalAdmin({ onMessage }: { onMessage: (message: string) => void }) {
  const [sections, setSections] = useState<TechnicalSection[]>([]);
  const [selectedId, setSelectedId] = useState<number | 'new' | null>(null);
  const [draft, setDraft] = useState<TechnicalSectionInput>(emptyTechnicalDraft);
  const [loadedSnapshot, setLoadedSnapshot] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [diagramError, setDiagramError] = useState('');
  const [importError, setImportError] = useState('');
  const selectedSection = sections.find((section) => section.id === selectedId);
  const isNew = selectedId === 'new';
  const isDirty = JSON.stringify(draft) !== loadedSnapshot;

  useUnsavedWarning(isDirty);

  const loadSections = async () => {
    setIsLoading(true);
    const response = await apiRequest<TechnicalSection[]>('/api/admin/technical-architecture');
    if (response.ok) {
      setSections(response.data);
      if (!selectedId && response.data.length > 0) {
        selectSection(response.data[0]);
      }
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadSections();
  }, []);

  const selectSection = (section: TechnicalSection) => {
    const nextDraft = toTechnicalInput(section);
    setSelectedId(section.id);
    setDraft(nextDraft);
    setLoadedSnapshot(JSON.stringify(nextDraft));
    setError('');
    setDiagramError('');
    setImportError('');
  };

  const createNew = () => {
    const maxOrder = sections.reduce((max, section) => Math.max(max, section.sortOrder), 0);
    const nextDraft = { ...emptyTechnicalDraft, sortOrder: maxOrder + 10 };
    setSelectedId('new');
    setDraft(nextDraft);
    setLoadedSnapshot(JSON.stringify(nextDraft));
    setError('');
    setDiagramError('');
    setImportError('');
  };

  const updateDraft = (patch: Partial<TechnicalSectionInput>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const validateDiagram = async (): Promise<boolean> => {
    const source = draft.mermaidSource?.trim();
    setDiagramError('');
    if (!source) {
      return true;
    }

    try {
      await mermaid.parse(source);
      return true;
    } catch (err) {
      setDiagramError(err instanceof Error ? err.message : 'Mermaid syntax could not be parsed.');
      return false;
    }
  };

  const importMarkdown = async (file: File) => {
    try {
      const imported = parseMarkdownImport(await readTextFile(file), file.name, { extractMermaid: true });
      updateDraft({
        title: draft.title || imported.title || '',
        sectionKey: draft.sectionKey || suggestSlug(imported.slug ?? imported.title ?? ''),
        contentMarkdown: imported.markdown,
        mermaidSource: imported.mermaidSource ?? draft.mermaidSource ?? '',
      });

      if (imported.mermaidSource) {
        const mermaidImportError = await validateMermaidText(imported.mermaidSource);
        setDiagramError(mermaidImportError);
      } else {
        setDiagramError('');
      }

      setImportError('');
    } catch (error) {
      setImportError(getErrorMessage(error));
    }
  };

  const importMermaid = async (file: File) => {
    try {
      const source = await readTextFile(file);
      updateDraft({ mermaidSource: source.trim() });
      setDiagramError(await validateMermaidText(source));
      setImportError('');
    } catch (error) {
      setImportError(getErrorMessage(error));
    }
  };

  const save = async () => {
    if (!(await validateDiagram())) {
      return;
    }

    setIsSaving(true);
    setError('');
    const response = await apiRequest<TechnicalSection | TechnicalSection[]>(
      isNew ? '/api/admin/technical-architecture' : `/api/admin/technical-architecture/${selectedId}`,
      {
        method: isNew ? 'POST' : 'PUT',
        body: draft,
      },
    );

    if (response.ok) {
      onMessage('Technical Architecture saved. Changes are live on the public page.');
      await loadSections();
      if (!isNew && response.data && !Array.isArray(response.data)) {
        selectSection(response.data);
      }
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsSaving(false);
  };

  const deleteCurrent = async () => {
    if (!selectedId || selectedId === 'new') {
      createNew();
      return;
    }

    if (!window.confirm('Delete this technical section permanently?')) {
      return;
    }

    setIsSaving(true);
    const response = await apiRequest<{ deleted: boolean }>(`/api/admin/technical-architecture/${selectedId}`, { method: 'DELETE' });
    if (response.ok) {
      onMessage('Technical section deleted.');
      setSelectedId(null);
      await loadSections();
    } else if ('error' in response) {
      setError(response.error);
    }
    setIsSaving(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">AIgency Technical Architecture</h2>
          <p className="text-sm text-[var(--color-accent-amber)]">Saving updates the public technical page immediately.</p>
        </div>
        <button onClick={createNew} className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-purple)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-accent-purple-hover)]">
          <Plus className="w-4 h-4" /> New section
        </button>
      </div>

      {error && <AdminError error={error} />}
      {isLoading ? (
        <p className="text-[var(--color-ad-text-muted)]">Loading sections...</p>
      ) : (
        <div className="grid xl:grid-cols-[minmax(18rem,24rem)_1fr] gap-6">
          <div className="rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] divide-y divide-[var(--color-ad-border)] overflow-hidden">
            {sections.map((section) => (
              <button key={section.id} onClick={() => selectSection(section)} className={`w-full p-4 text-left ${selectedId === section.id ? 'bg-[var(--color-accent-blue-soft)]' : ''}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-white">{section.title}</p>
                  {section.isVisible ? <Eye className="w-4 h-4 text-[var(--color-accent-green)]" /> : <EyeOff className="w-4 h-4 text-[var(--color-ad-text-muted)]" />}
                </div>
                <p className="mt-1 text-xs font-mono text-[var(--color-ad-text-muted)]">{section.sectionKey}</p>
                <p className="mt-1 text-xs text-[var(--color-ad-text-muted)]">Order {section.sortOrder} · Updated {formatDate(section.updatedAt)}</p>
              </button>
            ))}
          </div>

          <div className="grid 2xl:grid-cols-2 gap-6">
            <EditorPanel title={isNew ? 'Create section' : 'Edit section'}>
              <div className="space-y-4">
                <div className="rounded-md border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[var(--color-ad-text-muted)]">Import one section from Markdown, or import a separate Mermaid file into the diagram field.</p>
                    <div className="flex flex-wrap gap-2">
                      <FileImportButton accept=".md,.markdown,.txt,text/markdown,text/plain" label="Import Markdown" onFile={importMarkdown} />
                      <FileImportButton accept=".mmd,.mermaid,.txt,text/plain" label="Import Mermaid" onFile={importMermaid} />
                    </div>
                  </div>
                  {importError && <p className="mt-2 rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-3 py-2 text-xs text-[var(--color-accent-amber)]">{importError}</p>}
                </div>
                <AdminField label="Section key">
                  <input value={draft.sectionKey} onChange={(event) => updateDraft({ sectionKey: suggestSlug(event.target.value) })} className="admin-input font-mono" />
                </AdminField>
                <AdminField label="Title">
                  <input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} className="admin-input" />
                </AdminField>
                <div className="grid md:grid-cols-2 gap-4">
                  <AdminField label="Sort order">
                    <input type="number" value={draft.sortOrder} onChange={(event) => updateDraft({ sortOrder: Number(event.target.value) })} className="admin-input" />
                  </AdminField>
                  <label className="flex items-center gap-3 rounded-md border border-[var(--color-ad-border)] bg-[var(--color-ad-bg)] px-3 py-2 text-sm text-white">
                    <input type="checkbox" checked={draft.isVisible} onChange={(event) => updateDraft({ isVisible: event.target.checked })} />
                    Visible publicly
                  </label>
                </div>
                <AdminField label="Markdown body">
                  <textarea value={draft.contentMarkdown} onChange={(event) => updateDraft({ contentMarkdown: event.target.value })} className="admin-textarea min-h-[18rem] font-mono text-sm" />
                </AdminField>
                <AdminField label="Mermaid source">
                  <textarea value={draft.mermaidSource ?? ''} onChange={(event) => updateDraft({ mermaidSource: event.target.value })} className="admin-textarea min-h-[14rem] font-mono text-sm" />
                  {diagramError && <p className="mt-2 rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-3 py-2 text-xs text-[var(--color-accent-amber)]">{diagramError}</p>}
                </AdminField>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button disabled={isSaving} onClick={save} className="admin-primary-button"><Save className="w-4 h-4" /> Save live changes</button>
                <button disabled={isSaving} onClick={() => selectedSection ? selectSection(selectedSection) : createNew()} className="admin-secondary-button"><RotateCcw className="w-4 h-4" /> Reset unsaved</button>
                <button disabled={isSaving} onClick={deleteCurrent} className="admin-danger-button"><Trash2 className="w-4 h-4" /> Delete</button>
              </div>
              {isDirty && <p className="mt-3 text-xs text-[var(--color-accent-amber)]">Unsaved changes</p>}
            </EditorPanel>

            <EditorPanel title="Section preview">
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">{draft.title || 'Untitled section'}</h2>
                <MarkdownContent markdown={draft.contentMarkdown || 'Section preview will appear here.'} className={draft.mermaidSource ? 'mb-8' : ''} />
                {draft.mermaidSource?.trim() && <Mermaid chart={draft.mermaidSource} />}
              </section>
            </EditorPanel>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${active ? 'bg-[var(--color-accent-purple-soft)] text-white' : 'text-[var(--color-ad-text-muted)] hover:text-white hover:bg-[var(--color-ad-surface-hover)]'}`}
    >
      {icon} {label}
    </button>
  );
}

function EditorPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--color-ad-border)] bg-[var(--color-ad-surface)] p-5 min-w-0">
      <h3 className="font-bold text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      {children}
    </label>
  );
}

function FileImportButton({
  accept,
  label,
  onFile,
}: {
  accept: string;
  label: string;
  onFile: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setIsImporting(true);
    try {
      await onFile(file);
    } finally {
      setIsImporting(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <button type="button" disabled={isImporting} onClick={() => inputRef.current?.click()} className="admin-mini-button">
        <Upload className="w-3.5 h-3.5" /> {isImporting ? 'Importing...' : label}
      </button>
    </>
  );
}

function AdminError({ error }: { error: string }) {
  return (
    <div className="mb-5 rounded-md border border-[var(--color-accent-amber-border)] bg-[var(--color-accent-amber-soft)] px-4 py-3 text-sm text-[var(--color-accent-amber)]">
      {error}
    </div>
  );
}

function StatusBadge({ status }: { status: BlogPostStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status === 'published' ? 'bg-[var(--color-accent-green-soft)] text-[var(--color-accent-green)]' : 'bg-[var(--color-ad-border)] text-[var(--color-ad-text-muted)]'}`}>
      {status}
    </span>
  );
}

function toBlogInput(post: BlogPost): BlogPostInput {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    category: post.category ?? '',
    coverImage: post.coverImage ?? '',
    contentMarkdown: post.contentMarkdown,
    status: post.status,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  };
}

function toTechnicalInput(section: TechnicalSection): TechnicalSectionInput {
  return {
    sectionKey: section.sectionKey,
    title: section.title,
    contentMarkdown: section.contentMarkdown,
    mermaidSource: section.mermaidSource ?? '',
    sortOrder: section.sortOrder,
    isVisible: section.isVisible,
    updatedAt: section.updatedAt,
  };
}

async function apiRequest<T>(url: string, init?: { method?: string; body?: unknown }): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: init?.method ?? 'GET',
    credentials: 'include',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  const body = await response.json() as ApiResponse<T>;
  if (!response.ok && body.ok) {
    return { ok: false, error: 'Request failed.' };
  }
  return body;
}

function suggestSlug(value: string): string {
  return slugify(value);
}

async function readTextFile(file: File): Promise<string> {
  if (file.size > 512 * 1024) {
    throw new Error('Imported files must be 512 KB or smaller.');
  }

  return file.text();
}

async function validateMermaidText(source: string): Promise<string> {
  const trimmed = source.trim();
  if (!trimmed) {
    return '';
  }

  try {
    await mermaid.parse(trimmed);
    return '';
  } catch (error) {
    return getErrorMessage(error) || 'Mermaid syntax could not be parsed.';
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Import failed.';
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function useUnsavedWarning(isDirty: boolean) {
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
