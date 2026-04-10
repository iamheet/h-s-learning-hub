import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff, PlusCircle, LogOut, Mail, MessageSquare, Lock, Pencil, Crown } from "lucide-react";

interface Post {
  id: string;
  title: string;
  category: string;
  published: boolean;
  is_premium: boolean;
  created_at: string;
}

interface PremiumUser {
  id: string;
  email: string;
  plan: string;
  razorpay_payment_id: string;
  created_at: string;
  expires_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const CATEGORIES = [
  "Investing", "Stock Market", "Personal Finance",
  "Crypto", "Real Estate", "Wealth Building", "Tax Planning",
];

const emptyForm = { title: "", excerpt: "", content: "", category: "Investing", read_time: "", published: false, is_premium: false };
const ADMIN_EMAIL = "admin@gmail.com";

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "manage" | "subscribers" | "messages" | "premium">("write");
  const [filter, setFilter] = useState<"all" | "live" | "drafts">("all");
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

  const filteredPosts = posts.filter(p =>
    filter === "all" ? true : filter === "live" ? p.published : !p.published
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setAuthed(true);
        fetchAll();
      }
      setChecking(false);
    });
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    if (!authed) return;

    const subChannel = supabase
      .channel("realtime-subscribers")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "subscribers" }, (payload) => {
        setSubscribers((prev) => [payload.new as Subscriber, ...prev]);
        toast.success(`📧 New subscriber: ${(payload.new as Subscriber).email}`, { duration: 5000 });
      })
      .subscribe();

    const msgChannel = supabase
      .channel("realtime-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev]);
        toast.success(`💬 New message from ${(payload.new as Message).name}`, { duration: 5000 });
      })
      .subscribe();

    const premiumChannel = supabase
      .channel("realtime-premium")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "premium_users" }, (payload) => {
        setPremiumUsers((prev) => [payload.new as PremiumUser, ...prev]);
        toast.success(`👑 New premium user: ${(payload.new as PremiumUser).email}`, { duration: 5000 });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subChannel);
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(premiumChannel);
    };
  }, [authed]);

  const fetchAll = () => {
    fetchPosts();
    fetchSubscribers();
    fetchMessages();
    fetchPremiumUsers();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      toast.error("Access denied. Not an admin account.");
      return;
    }
    setAuthed(true);
    fetchAll();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setEmail("");
    setPassword("");
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("id, title, category, published, is_premium, created_at").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  const fetchSubscribers = async () => {
    const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    if (data) setSubscribers(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const fetchPremiumUsers = async () => {
    const { data } = await supabase.from("premium_users").select("*").order("created_at", { ascending: false });
    if (data) setPremiumUsers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("posts").update(form).eq("id", editingId);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Post updated!");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("posts").insert([form]);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Post saved!");
    }
    setForm(emptyForm);
    fetchPosts();
    setTab("manage");
  };

  const editPost = async (id: string) => {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error || !data) { toast.error("Failed to load post"); return; }
    setForm({
      title: data.title,
      excerpt: data.excerpt || "",
      content: data.content,
      category: data.category,
      read_time: data.read_time || "",
      published: data.published,
      is_premium: data.is_premium,
    });
    setEditingId(id);
    setTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("posts").update({ published: !current }).eq("id", id);
    toast.success(current ? "Post unpublished" : "Post published!");
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
    toast.success("Post deleted");
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("subscribers").delete().eq("id", id);
    fetchSubscribers();
    toast.success("Subscriber removed");
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    fetchMessages();
    toast.success("Message deleted");
  };

  if (checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-emerald flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary-foreground">A</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">H&S Learning Hub</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 card-shadow glow-emerald">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gmail.com"
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full bg-gradient-emerald text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-2">
              {loginLoading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { key: "write", label: "✍️ Write" },
    { key: "manage", label: `📋 Posts (${posts.length})` },
    { key: "subscribers", label: `📧 Subscribers (${subscribers.length})` },
    { key: "messages", label: `💬 Messages (${messages.length})` },
    { key: "premium", label: `👑 Premium (${premiumUsers.length})` },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-emerald flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-display font-bold text-gradient-emerald">Admin Panel</span>
            <span className="text-xs text-muted-foreground hidden sm:block">· H&S Learning Hub</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-muted">
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 pb-3">
          <div className="flex gap-1 bg-muted rounded-lg p-1 overflow-x-auto">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-md font-medium transition whitespace-nowrap ${tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl">

        {/* Write Tab */}
        {tab === "write" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-display font-bold text-foreground">{editingId ? "Edit Post" : "New Post"}</h2>
              {editingId && (
                <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-muted">
                  ✕ Cancel Edit
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title..."
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Read Time</label>
                <input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="e.g. 5 min read"
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Excerpt <span className="text-xs opacity-60">(shown on homepage cards)</span></label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short 1-2 sentence summary..." rows={2}
                className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Content <span className="text-xs opacity-60">(full article)</span></label>
              <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={"Write your full article here...\n\nUse blank lines to separate paragraphs."} rows={20}
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-y text-sm leading-relaxed" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-primary w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Publish immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} className="accent-yellow-400 w-4 h-4" />
                  <span className="text-sm text-yellow-400 flex items-center gap-1"><Lock size={12} /> Premium only</span>
                </label>
              </div>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-gradient-emerald text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
                <PlusCircle size={16} />
                {saving ? "Saving..." : editingId ? "Update Post" : "Save Post"}
              </button>
            </div>
          </form>
        )}

        {/* Manage Posts Tab */}
        {tab === "manage" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">All Posts</h2>
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {(["all", "live", "drafts"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition capitalize ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    {f === "all" && `All (${posts.length})`}
                    {f === "live" && `● Live (${posts.filter(p => p.published).length})`}
                    {f === "drafts" && `○ Drafts (${posts.filter(p => !p.published).length})`}
                  </button>
                ))}
              </div>
            </div>
            {posts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="mb-3">No posts yet.</p>
                <button onClick={() => setTab("write")} className="text-primary text-sm hover:underline">Write your first post →</button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p>No {filter === "live" ? "published" : "draft"} posts.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-emerald transition">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{post.category} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${post.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {post.published ? "● Live" : "○ Draft"}
                      </span>
                      {post.is_premium && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 flex items-center gap-1">
                          <Lock size={10} /> Premium
                        </span>
                      )}
                      <button onClick={() => togglePublish(post.id, post.published)} className="text-muted-foreground hover:text-primary transition">
                        {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => editPost(post.id)} title="Edit" className="text-muted-foreground hover:text-primary transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deletePost(post.id)} className="text-muted-foreground hover:text-destructive transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscribers Tab */}
        {tab === "subscribers" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Subscribers</h2>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{subscribers.length} total</span>
            </div>
            {subscribers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Mail size={36} className="mx-auto mb-3 text-primary/20" />
                <p>No subscribers yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-3.5 hover:border-emerald transition">
                    <div>
                      <p className="text-sm text-foreground">{sub.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Joined {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <button onClick={() => deleteSubscriber(sub.id)} className="text-muted-foreground hover:text-destructive transition ml-4">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {tab === "messages" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Messages</h2>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{messages.length} total</span>
            </div>
            {messages.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <MessageSquare size={36} className="mx-auto mb-3 text-primary/20" />
                <p>No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-card border border-border rounded-xl px-5 py-4 hover:border-emerald transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{msg.name}</p>
                          <span className="text-muted-foreground/40">·</span>
                          <p className="text-xs text-muted-foreground">{msg.email}</p>
                        </div>
                        <p className={`text-sm text-muted-foreground ${expandedMsg === msg.id ? "" : "line-clamp-2"}`}>{msg.message}</p>
                        {msg.message.length > 100 && (
                          <button onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)} className="text-xs text-primary mt-1 hover:underline">
                            {expandedMsg === msg.id ? "Show less" : "Read more"}
                          </button>
                        )}
                        <p className="text-xs text-muted-foreground/60 mt-2">{new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <button onClick={() => deleteMessage(msg.id)} className="text-muted-foreground hover:text-destructive transition flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Premium Users Tab */}
        {tab === "premium" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Premium Users</h2>
              <div className="flex gap-3">
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {premiumUsers.filter(u => new Date(u.expires_at) > new Date()).length} active
                </span>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {premiumUsers.length} total
                </span>
              </div>
            </div>
            {premiumUsers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Crown size={36} className="mx-auto mb-3 text-yellow-400/30" />
                <p>No premium users yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {premiumUsers.map((u) => {
                  const isActive = new Date(u.expires_at) > new Date();
                  return (
                    <div key={u.id} className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-emerald transition">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{u.email}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isActive ? "bg-yellow-500/10 text-yellow-400" : "bg-muted text-muted-foreground"
                          }`}>
                            {isActive ? "● Active" : "○ Expired"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="capitalize">{u.plan} plan</span>
                          <span>·</span>
                          <span>Joined {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>·</span>
                          <span>Expires {new Date(u.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        {u.razorpay_payment_id && (
                          <p className="text-xs text-muted-foreground/50 mt-0.5">Payment ID: {u.razorpay_payment_id}</p>
                        )}
                      </div>
                      <Crown size={16} className={isActive ? "text-yellow-400 ml-4" : "text-muted-foreground ml-4"} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
