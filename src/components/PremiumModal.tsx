import { useState } from "react";
import { X, Zap, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    key: "monthly",
    label: "Monthly",
    price: 30,
    paise: 3000,
    desc: "Billed every month",
    badge: null,
  },
  {
    key: "yearly",
    label: "Yearly",
    price: 299,
    paise: 29900,
    desc: "Billed once a year",
    badge: "Save 17%",
  },
];

const PremiumModal = ({ onClose, onSuccess }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in first to subscribe.");
      navigate("/login");
      return;
    }

    const plan = PLANS.find((p) => p.key === selectedPlan)!;
    setLoading(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: plan.paise,
      currency: "INR",
      name: "H&S Learning Hub",
      description: `${plan.label} Premium Subscription`,
      handler: async (response: any) => {
        // Save premium user to Supabase
        const expiresAt = new Date();
        if (selectedPlan === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
        else expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const { error } = await supabase.from("premium_users").insert([{
          user_id: user.id,
          email: user.email,
          plan: selectedPlan,
          razorpay_payment_id: response.razorpay_payment_id,
          expires_at: expiresAt.toISOString(),
        }]);

        if (error) {
          toast.error("Payment recorded but failed to activate. Contact support.");
        } else {
          toast.success("🎉 Welcome to Premium!");
          onSuccess();
          onClose();
        }
        setLoading(false);
      },
      prefill: { email: user.email },
      theme: { color: "#34d399" },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 card-shadow glow-emerald">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition">
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-emerald flex items-center justify-center mx-auto mb-3">
            <Zap size={22} className="text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Go Premium</h2>
          <p className="text-muted-foreground text-sm mt-1">Unlock all exclusive articles & insights</p>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {["Access all premium articles", "In-depth market analysis", "Exclusive wealth building guides", "Early access to new content"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check size={14} className="text-primary flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>

        {/* Plans */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PLANS.map((plan) => (
            <button
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key as "monthly" | "yearly")}
              className={`relative rounded-xl border p-4 text-left transition ${selectedPlan === plan.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              {plan.badge && (
                <span className="absolute -top-2 right-2 text-[10px] font-bold bg-gradient-emerald text-primary-foreground px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <p className="text-sm font-semibold text-foreground">{plan.label}</p>
              <p className="text-xl font-bold text-primary mt-1">₹{plan.price}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{plan.desc}</p>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-emerald text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          {loading ? "Opening payment..." : `Subscribe for ₹${PLANS.find(p => p.key === selectedPlan)?.price}`}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-3">Secured by Razorpay · Cancel anytime</p>
      </div>
    </div>
  );
};

export default PremiumModal;
