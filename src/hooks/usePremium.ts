import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const usePremium = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPremium = async () => {
    if (!user) { setIsPremium(false); setLoading(false); return; }
    const { data } = await supabase
      .from("premium_users")
      .select("expires_at")
      .eq("user_id", user.id)
      .gt("expires_at", new Date().toISOString())
      .limit(1);
    setIsPremium(!!(data && data.length > 0));
    setLoading(false);
  };

  useEffect(() => { checkPremium(); }, [user]);

  return { isPremium, loading, refetch: checkPremium };
};
