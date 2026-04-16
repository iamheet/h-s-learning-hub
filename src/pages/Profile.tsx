import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LogOut, Crown, Pencil, Check, X, Receipt, Calendar, CreditCard, Mail, User, Copy } from "lucide-react";

interface PremiumRecord {
  id: string;
  plan: string;
  razorpay_payment_id: string;
  created_at: string;
  expires_at: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState<PremiumRecord[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<PremiumRecord | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    supabase
      .from("premium_users")
      .select("id, plan, razorpay_payment_id, created_at, expires_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTransactions(data ?? []);
        setTxLoading(false);
      });
  }, [user]);

  if (!user) return null;

  const now = new Date();
  const activePremium = transactions.find((t) => new Date(t.expires_at) > now);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      ...(name !== user.user_metadata?.full_name ? { data: { full_name: name } } : {}),
      ...(email !== user.email ? { email } : {}),
    });
    setSaving(false);
    if (error) { toast.error(error.message); }
    else { toast.success("Profile updated!"); setEditing(false); }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const avatar = user.user_metadata?.avatar_url;
  const initials = (name || email).slice(0, 2).toUpperCase();
  const joinedAt = new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Profile Card ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden card-shadow">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-emerald-900/60 via-emerald-800/40 to-transparent relative">
            {activePremium && (
              <span className="absolute top-3 right-4 flex items-center gap-1.5 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full">
                <Crown size={12} /> Premium
              </span>
            )}
          </div>

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-emerald flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-card shadow-lg">
                    {initials}
                  </div>
                )}
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border bg-muted px-3 py-1.5 rounded-lg hover:bg-muted/70 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {/* Name & email */}
            {editing ? (
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-gradient-emerald text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Check size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setName(user.user_metadata?.full_name ?? ""); setEmail(user.email ?? ""); }}
                    className="flex items-center gap-1.5 bg-muted border border-border text-foreground text-sm px-4 py-2 rounded-lg hover:bg-muted/70 transition"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-5">
                <h2 className="text-xl font-bold text-foreground">{name || "No name set"}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{email}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Member since</p>
                  <p className="text-xs font-semibold text-foreground">{joinedAt}</p>
                </div>
              </div>

              <div className="bg-muted/50 border border-border rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Auth provider</p>
                  <p className="text-xs font-semibold text-foreground capitalize">
                    {user.app_metadata?.provider ?? "email"}
                  </p>
                </div>
              </div>

              {activePremium && (
                <div className="col-span-2 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                    <Crown size={15} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-yellow-400/70">Premium expires</p>
                    <p className="text-xs font-semibold text-yellow-300">
                      {new Date(activePremium.expires_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full capitalize">
                    {activePremium.plan}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Transactions Card ── */}
        <div className="bg-card border border-border rounded-2xl card-shadow">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
            <Receipt size={16} className="text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Transaction History</h3>
          </div>

          {txLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CreditCard size={32} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => {
                const isActive = new Date(tx.expires_at) > now;
                return (
                  <div key={tx.id} className="px-6 py-4 flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-yellow-400/10" : "bg-muted"}`}>
                      <Crown size={16} className={isActive ? "text-yellow-400" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground capitalize">{tx.plan} Premium</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar size={10} />
                          {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        {tx.razorpay_payment_id && (
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="text-[11px] text-primary font-mono truncate max-w-[120px] hover:underline"
                          >
                            {tx.razorpay_payment_id}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        ₹{tx.plan === "monthly" ? "30" : "299"}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {isActive ? "Active" : "Expired"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Transaction Detail Modal ── */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 card-shadow z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-primary" />
                  <h3 className="font-semibold text-foreground">Transaction Details</h3>
                </div>
                <button onClick={() => setSelectedTx(null)} className="text-muted-foreground hover:text-foreground transition">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Payment ID", value: selectedTx.razorpay_payment_id, copy: true },
                  { label: "Plan", value: `${selectedTx.plan.charAt(0).toUpperCase() + selectedTx.plan.slice(1)} Premium` },
                  { label: "Amount", value: `₹${selectedTx.plan === "monthly" ? "30" : "299"}` },
                  { label: "Status", value: new Date(selectedTx.expires_at) > now ? "Active" : "Expired" },
                  { label: "Purchased on", value: new Date(selectedTx.created_at).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
                  { label: "Valid until", value: new Date(selectedTx.expires_at).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
                  { label: "Transaction ref", value: selectedTx.id, copy: true },
                ].map(({ label, value, copy }) => (
                  <div key={label} className="flex items-center justify-between bg-muted/50 border border-border rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground font-mono break-all">{value}</p>
                    </div>
                    {copy && (
                      <button onClick={() => copyToClipboard(value)} className="ml-3 flex-shrink-0 text-muted-foreground hover:text-foreground transition">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>


            </div>
          </div>
        )}

        {/* ── Sign Out ── */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-400 border border-red-400/30 bg-red-400/5 py-3 rounded-2xl hover:bg-red-400/10 transition font-medium"
        >
          <LogOut size={15} /> Sign Out
        </button>

      </div>
    </div>
  );
};

export default Profile;
