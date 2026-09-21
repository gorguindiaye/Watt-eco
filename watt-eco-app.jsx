import React, { useState } from "react";
import splashImage from "./acceuil.png";
import {
  Zap, Leaf, Flame, Calendar, Clock, TrendingUp, AlertTriangle, BatteryWarning,
  Info, Phone, Mail, Lock, Eye, EyeOff, User, ChevronRight, ChevronLeft, Home,
  Activity, Cpu, Wallet, History, Bell, Settings, LogOut, Plus, Check, Menu,
  Moon, Globe, HelpCircle, X, Wind, Snowflake, Tv, Lightbulb, CheckCircle2,
  Smartphone, ArrowRight, ChevronDown
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

/* ---------------------------------- DATA ---------------------------------- */

const USER = {
  firstName: "Mamadou",
  fullName: "Mamadou Diallo",
  initials: "MD",
  phone: "+221 77 123 45 67",
  email: "mamadou.diallo@example.com",
  meter: "SN-0192837465",
};

function normalizeMeter(value) {
  return (value || "").trim().toUpperCase();
}

const CREDIT = {
  remainingKwh: 73.6,
  percent: 73,
  initialKwh: 100,
  remainingValueFcfa: 9200,
  autonomyDays: 17,
  exhaustionDate: "25 septembre 2026",
};

const TODAY_KWH = 4.8;
const AVG_KWH = 4.2;

const WEEKLY = [
  { day: "Lun", v: 3.8 },
  { day: "Mar", v: 4.1 },
  { day: "Mer", v: 4.5 },
  { day: "Jeu", v: 6.2 },
  { day: "Ven", v: 4.0 },
  { day: "Sam", v: 4.6 },
  { day: "Dim", v: 3.9 },
];

const HOURLY = Array.from({ length: 25 }, (_, h) => {
  const base = 0.1 + 0.12 * Math.sin((h / 24) * Math.PI * 2 - 1) + 0.12;
  const bump = h >= 12 && h <= 14 ? 0.15 : h >= 19 && h <= 22 ? 0.22 : 0;
  return { h: `${String(h).padStart(2, "0")}h`, v: Math.max(0.05, +(base + bump).toFixed(2)) };
});

const SCENARIOS = [
  { key: "eco", name: "Économie", Icon: Leaf, color: "var(--primary)", bg: "var(--primary-light)", rate: "3 kWh/j", days: "24 jours" },
  { key: "hab", name: "Habituelle", Icon: Zap, color: "var(--blue)", bg: "var(--blue-bg)", rate: "4,2 kWh/j", days: "17 jours", highlighted: true },
  { key: "forte", name: "Forte consommation", Icon: Flame, color: "var(--red)", bg: "var(--red-bg)", rate: "6 kWh/j", days: "12 jours" },
];

const ALERTS = [
  { id: 1, tone: "red", cat: "Alerte", Icon: AlertTriangle, title: "Consommation anormale", desc: "Votre consommation est 90% supérieure à votre moyenne habituelle.", time: "Il y a 2 heures" },
  { id: 2, tone: "orange", cat: "Alerte", Icon: BatteryWarning, title: "Bientôt épuisé", desc: "Votre crédit passera sous 20 kWh dans environ 4 jours.", time: "Il y a 5 heures" },
  { id: 3, tone: "green", cat: "Info", Icon: Leaf, title: "Conseil économie", desc: "Réduire 1h d'usage du climatiseur peut économiser jusqu'à 15%.", time: "Hier" },
  { id: 4, tone: "blue", cat: "Info", Icon: Info, title: "Nouvel achat", desc: "50 kWh ont été activés sur votre compteur.", time: "Il y a 2 jours" },
];

const EXPENSES_MONTHLY = [
  { m: "Avr", v: 15200 }, { m: "Mai", v: 16000 }, { m: "Juin", v: 14200 },
  { m: "Juil", v: 17400 }, { m: "Août", v: 18200 }, { m: "Sept", v: 16800 },
];

const EXPENSE_DETAIL = [
  { label: "Électricité consommée", value: 12400, Icon: Zap, color: "var(--primary)", bg: "var(--primary-light)" },
  { label: "Achat de crédit (estimation)", value: 15000, Icon: Wallet, color: "var(--blue)", bg: "var(--blue-bg)" },
  { label: "Économie réalisée", value: -2200, Icon: Leaf, color: "var(--primary)", bg: "var(--primary-light)" },
];

const PURCHASE_HISTORY = [
  { kwh: 50, date: "12 sept. 2026", method: "Mobile Money", cat: "Mobile Money", amount: 7500, ref: "WE-931827" },
  { kwh: 30, date: "28 août 2026", method: "Wave", cat: "Mobile Money", amount: 4500, ref: "WE-918204" },
  { kwh: 40, date: "14 août 2026", method: "Orange Money", cat: "Mobile Money", amount: 6000, ref: "WE-902173" },
  { kwh: 100, date: "2 août 2026", method: "CFE", cat: "CFE", amount: 15000, ref: "WE-887440" },
];

const ONBOARDING = [
  {
    pill: "1/6",
    title: "Suivez votre crédit en temps réel",
    text: "Visualisez à tout moment combien de kWh il vous reste et leur équivalent en FCFA, directement depuis votre téléphone.",
    illustration: "credit",
  },
  {
    pill: "2/6",
    title: "Anticipez la durée de votre crédit",
    text: "WATT'ÉCO estime votre autonomie et vous montre comment elle change selon votre rythme de consommation.",
    illustration: "scenarios",
  },
  {
    pill: "3/6",
    title: "Recevez des alertes intelligentes",
    text: "Trois niveaux d'alerte — conseil, attention, urgence — pour ne jamais être surpris par une coupure.",
    illustration: "alerts",
  },
  {
    pill: "4/5",
    title: "Maîtrisez vos dépenses en FCFA",
    text: "Suivez l'évolution de vos dépenses d'électricité mois après mois et repérez les économies réalisées.",
    illustration: "expenses",
  },
  {
    pill: "5/5",
    title: "Prêt à prendre le contrôle ?",
    text: "Créez votre compte pour commencer à suivre votre consommation dès aujourd'hui.",
    illustration: "final",
  },
];

/* ------------------------------- UI PRIMITIVES ------------------------------ */

const iconBtnStyle = {
  width: 38, height: 38, borderRadius: 12, border: "1px solid var(--border)",
  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 4px 12px rgba(11,43,31,0.06)", cursor: "pointer",
};

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--surface)", borderRadius: 26, padding: 20,
      boxShadow: "0 12px 28px rgba(11,43,31,0.09)", border: "1px solid var(--border)",
      ...style,
    }}>{children}</div>
  );
}

function CardFlat({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "var(--surface)", borderRadius: 18, padding: 16,
      border: "1px solid var(--border)", ...style,
    }}>{children}</div>
  );
}

function IconChip({ Icon, bg, fg, size = 40, iconSize = 18, radius = 9999 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={iconSize} color={fg} />
    </div>
  );
}

function Pill({ children, tone = "green", style = {} }) {
  const map = {
    green: { bg: "var(--primary-light)", fg: "var(--primary)" },
    yellow: { bg: "var(--yellow-bg)", fg: "var(--yellow)" },
    orange: { bg: "var(--orange-bg)", fg: "var(--orange)" },
    red: { bg: "var(--red-bg)", fg: "var(--red)" },
    blue: { bg: "var(--blue-bg)", fg: "var(--blue)" },
    dark: { bg: "rgba(255,255,255,0.18)", fg: "#fff" },
  };
  const c = map[tone] || map.green;
  return (
    <span style={{
      background: c.bg, color: c.fg, borderRadius: 9999, padding: "6px 14px",
      fontWeight: 600, fontSize: 12.5, display: "inline-block", whiteSpace: "nowrap",
      ...style,
    }}>{children}</span>
  );
}

function PrimaryButton({ children, onClick, full = true, style = {}, height = 54, disabled, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      height, width: full ? "100%" : "auto", minWidth: full ? undefined : 150,
      borderRadius: 17, border: "none",
      background: "linear-gradient(135deg, var(--primary-2), var(--primary))",
      color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15,
      boxShadow: "0 10px 20px rgba(30,132,73,0.28)", cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      opacity: disabled ? 0.55 : 1, ...style,
    }}>{children}</button>
  );
}

function OutlineButton({ children, onClick, full = true, dark = false, style = {}, height = 54 }) {
  return (
    <button onClick={onClick} style={{
      height, width: full ? "100%" : "auto", borderRadius: 17,
      background: dark ? "transparent" : "var(--surface)",
      border: dark ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid var(--border)",
      color: dark ? "#fff" : "var(--text)", fontWeight: 600, fontSize: 15,
      fontFamily: "Inter, sans-serif", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...style,
    }}>{children}</button>
  );
}

function FormInput({ Icon, type = "text", placeholder, value, onChange, trailing }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, border: "1.5px solid var(--border)",
      borderRadius: 14, padding: "14px 16px", background: "#fff",
    }}>
      {Icon && <Icon size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          border: "none", outline: "none", flex: 1, fontFamily: "Inter, sans-serif",
          fontSize: 14.5, color: "var(--text)", background: "transparent", minWidth: 0,
        }}
      />
      {trailing}
    </div>
  );
}

function Tabs({ options, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, marginBottom: 18 }}>
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: "8px 16px", borderRadius: 9999, border: "none", cursor: "pointer",
          whiteSpace: "nowrap", fontWeight: 600, fontSize: 13, fontFamily: "Inter, sans-serif",
          background: active === opt ? "var(--primary-light)" : "transparent",
          color: active === opt ? "var(--primary)" : "var(--text-muted)",
          flexShrink: 0,
        }}>{opt}</button>
      ))}
    </div>
  );
}

function TopBarBack({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <button onClick={onBack} style={iconBtnStyle} aria-label="Retour"><ChevronLeft size={18} color="var(--text)" /></button>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 16 }}>{title || ""}</div>
      <div style={{ width: 38 }} />
    </div>
  );
}

function TopBarTitle({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}

function AlertBanner({ text }) {
  return (
    <div style={{
      display: "flex", gap: 10, background: "var(--yellow-bg)", borderRadius: 16,
      padding: 14, alignItems: "flex-start", marginTop: 18,
    }}>
      <AlertTriangle size={18} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function BottomNav({ active, onNav, onMore, onPurchase }) {
  const items = [
    { key: "dashboard", label: "Accueil", Icon: Home },
    { key: "consumption", label: "Consommation", Icon: Activity },
    { key: "purchase", label: "Acheter du courant", Icon: Plus },
  ];
  return (
    <div style={{
      background: "#fff", borderTop: "1px solid var(--border)", display: "flex",
      padding: "10px 8px 16px", flexShrink: 0,
    }}>
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button key={it.key} onClick={() => {
            if (it.key === "purchase") {
              onPurchase ? onPurchase() : onMore();
              return;
            }
            onNav(it.key);
          }} style={{
            flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 4, cursor: "pointer", padding: 4,
          }}>
            <it.Icon size={20} color={isActive ? "var(--primary)" : "var(--text-muted)"} />
            <span style={{ fontSize: 11, color: isActive ? "var(--primary)" : "var(--text-muted)", fontWeight: isActive ? 600 : 500 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function fcfa(n) {
  const sign = n < 0 ? "-" : "";
  return sign + Math.abs(n).toLocaleString("fr-FR") + " FCFA";
}

function ScreenScroll({ children, pad = "24px 24px 16px" }) {
  return <div style={{ flex: 1, overflowY: "auto", padding: pad }}>{children}</div>;
}

/* ---------------------------------- SCREENS --------------------------------- */

function Logo({ compact = false, dark = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
      <div style={{
        width: compact ? 32 : 44, height: compact ? 32 : 44, borderRadius: 14,
        background: "linear-gradient(135deg, var(--primary-2), var(--primary))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 16px rgba(30,132,73,0.3)",
      }}>
        <Zap size={compact ? 16 : 22} color="#fff" fill="#fff" />
      </div>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: compact ? 16 : 20, color: dark ? "#fff" : "var(--text)" }}>
        WATT'<span style={{ color: "var(--primary-2)" }}>ÉCO</span>
      </div>
    </div>
  );
}

function SplashScreen({ onStart, onLogin }) {
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden", background: "#edf6f0" }}>
      <img
        src={splashImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.15) 100%)" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ height: 18 }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 28, textAlign: "center" }} />

        <div style={{ marginTop: "auto", padding: "0 14px 18px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              onClick={onStart}
              style={{
                flex: 1,
                border: "none",
                borderRadius: 14,
                background: "linear-gradient(135deg, #0f3a28, #1e8449)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 14px",
                cursor: "pointer",
                boxShadow: "0 10px 18px rgba(17, 62, 42, 0.14)",
              }}
            >
              Démarrer
            </button>
            <button
              onClick={onLogin}
              style={{
                flex: 1,
                border: "1px solid rgba(17, 62, 42, 0.12)",
                borderRadius: 14,
                background: "rgba(255,255,255,0.72)",
                color: "#0d2b1f",
                fontWeight: 600,
                fontSize: 15,
                padding: "12px 14px",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingIllustration({ kind }) {
  if (kind === "credit") {
    return (
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <IconChip Icon={Zap} bg="var(--primary-light)" fg="var(--primary)" size={44} iconSize={20} />
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Crédit restant</div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26 }}>73,6 kWh</div>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 8, background: "var(--border)", overflow: "hidden" }}>
          <div style={{ width: "73%", height: "100%", background: "linear-gradient(90deg, var(--primary-2), var(--primary))" }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>≈ 9 200 FCFA restants</div>
      </Card>
    );
  }
  if (kind === "scenarios") {
    return (
      <>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconChip Icon={Calendar} bg="var(--primary-light)" fg="var(--primary)" size={44} iconSize={20} />
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Autonomie estimée</div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26 }}>17 jours</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Jusqu'au 25 septembre 2026</div>
            </div>
          </div>
        </Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Scénarios de consommation</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SCENARIOS.map((s) => (
            <CardFlat key={s.key} style={s.highlighted ? { border: "1.5px solid var(--primary)" } : {}}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconChip Icon={s.Icon} bg={s.bg} fg={s.color} size={36} iconSize={16} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{s.rate} → {s.days}</div>
                </div>
                {s.highlighted && <Check size={18} color="var(--primary)" />}
              </div>
            </CardFlat>
          ))}
        </div>
      </>
    );
  }
  if (kind === "alerts") {
    const rows = [
      { tone: "red", Icon: AlertTriangle, label: "Consommation anormale" },
      { tone: "orange", Icon: BatteryWarning, label: "Crédit bientôt épuisé" },
      { tone: "green", Icon: Leaf, label: "Conseil pour économiser" },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r) => (
          <CardFlat key={r.label}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconChip Icon={r.Icon} bg={`var(--${r.tone}-bg)`} fg={`var(--${r.tone})`} size={40} iconSize={18} />
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.label}</div>
            </div>
          </CardFlat>
        ))}
      </div>
    );
  }
  if (kind === "expenses") {
    return (
      <Card>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Dépense estimée ce mois</div>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, marginBottom: 10 }}>16 800 FCFA</div>
        <div style={{ height: 90 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EXPENSES_MONTHLY}>
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="var(--primary-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{
        width: 96, height: 96, borderRadius: "50%", margin: "0 auto 20px",
        background: "linear-gradient(135deg, var(--primary-2), var(--primary))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 16px 32px rgba(30,132,73,0.3)",
      }}>
        <CheckCircle2 size={44} color="#fff" />
      </div>
    </div>
  );
}

function OnboardingScreen({ step, setStep, onSkip, onFinishSignup, onFinishLogin }) {
  const data = ONBOARDING[step];
  const isLast = step === ONBOARDING.length - 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 26px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Pill tone="dark" style={{ background: "var(--dark-2)", color: "#fff" }}>{data.pill}</Pill>
        {!isLast && (
          <button onClick={onSkip} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            Passer
          </button>
        )}
      </div>

      <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 21, margin: "0 0 10px", lineHeight: 1.3 }}>
        {data.title}
      </h1>
      <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 22px" }}>{data.text}</p>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <OnboardingIllustration kind={data.illustration} />
      </div>

      {!isLast ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {ONBOARDING.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6, height: 6, borderRadius: 4,
                background: i === step ? "var(--primary)" : "var(--border)", transition: "width 0.2s",
              }} />
            ))}
          </div>
          <PrimaryButton full={false} onClick={() => setStep(step + 1)} height={50}>
            Suivant <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <PrimaryButton onClick={onFinishSignup} style={{ marginBottom: 10 }}>Créer un compte</PrimaryButton>
          <button onClick={onFinishLogin} style={{ width: "100%", background: "none", border: "none", color: "var(--text-muted)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", padding: "6px 0" }}>
            Se connecter
          </button>
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onBack, onLogin, onSignup }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <ScreenScroll>
      <TopBarBack onBack={onBack} />
      <div style={{ margin: "8px 0 22px" }}><Logo compact /></div>
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 21, margin: "0 0 6px" }}>Bienvenue !</h1>
      <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 22px" }}>Connectez-vous pour retrouver votre tableau de bord énergétique.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 14 }}>
        <FormInput Icon={Phone} placeholder="Téléphone ou email" />
        <FormInput
          Icon={Lock} type={showPw ? "text" : "password"} placeholder="Mot de passe"
          trailing={
            <button onClick={() => setShowPw((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              {showPw ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
            </button>
          }
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-muted)", cursor: "pointer" }}>
          <input type="checkbox" style={{ accentColor: "#1E8449" }} /> Se souvenir de moi
        </label>
        <button style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
          Mot de passe oublié ?
        </button>
      </div>

      <PrimaryButton onClick={onLogin} style={{ marginBottom: 18 }}>Se connecter</PrimaryButton>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 18px" }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>ou</span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <OutlineButton onClick={onSignup}>Créer un compte</OutlineButton>
    </ScreenScroll>
  );
}

function SignupScreen({ onBack, onSignup, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", meter: "" });

  const handleSignup = () => {
    const meter = normalizeMeter(form.meter);
    if (!meter) return;
    onSignup(meter);
  };

  return (
    <ScreenScroll>
      <TopBarBack onBack={onBack} />
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 21, margin: "12px 0 6px" }}>Créer un compte</h1>
      <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 22px" }}>
        Rejoignez WATT'ÉCO et prenez le contrôle de votre consommation.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
        <FormInput Icon={User} placeholder="Nom complet" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <FormInput Icon={Phone} placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <FormInput Icon={Mail} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormInput Icon={Cpu} placeholder="Numéro de compteur" value={form.meter} onChange={(e) => setForm({ ...form, meter: e.target.value })} />
        <FormInput
          Icon={Lock} type={showPw ? "text" : "password"} placeholder="Mot de passe" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          trailing={
            <button onClick={() => setShowPw((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
              {showPw ? <EyeOff size={18} color="var(--text-muted)" /> : <Eye size={18} color="var(--text-muted)" />}
            </button>
          }
        />
      </div>

      <PrimaryButton onClick={handleSignup} style={{ marginBottom: 16 }}>S'inscrire</PrimaryButton>

      <div style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>
        Déjà un compte ?{" "}
        <button onClick={onLogin} style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Se connecter
        </button>
      </div>
    </ScreenScroll>
  );
}

function DashboardScreen({ onNav, onMore, onOpenPurchase, onOpenMeters, activeMeter, credit }) {
  const [period, setPeriod] = useState("Semaine");
  const overAvg = Math.round(((TODAY_KWH - AVG_KWH) / AVG_KWH) * 100);
  const percent = Math.min(100, Math.max(0, credit.percent));

  return (
    <>
      <ScreenScroll>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 18 }}>Bonjour, {USER.firstName} 👋</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Voici un aperçu de votre consommation.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={onMore} style={{
              border: "1px solid var(--border)", background: "#fff", color: "var(--text)",
              borderRadius: 12, fontWeight: 700, fontSize: 12.5, padding: "10px 12px", cursor: "pointer",
            }}>
              Plus
            </button>
            <button onClick={onOpenMeters} style={{ border: "none", background: "none", cursor: "pointer" }}>
              <IconChip Icon={User} bg="var(--primary-light)" fg="var(--primary)" size={42} iconSize={19} />
            </button>
          </div>
        </div>

        <div style={{
          borderRadius: 26, padding: 22, marginBottom: 18,
          background: "linear-gradient(135deg, var(--dark-2), var(--primary))",
          boxShadow: "0 14px 30px rgba(11,43,31,0.25)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12.5 }}>Crédit restant</div>
            <Pill tone="dark">{percent}%</Pill>
          </div>
          <div style={{ color: "#fff", fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 30, margin: "4px 0 12px" }}>
            {credit.remainingKwh.toFixed(1)} kWh
          </div>
          <div style={{ height: 8, borderRadius: 8, background: "rgba(255,255,255,0.22)", overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${percent}%`, height: "100%", background: "#fff" }} />
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)" }}>
            Achat initial {credit.initialKwh.toFixed(1)} kWh
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Conso. aujourd'hui", value: `${TODAY_KWH} kWh`, Icon: Zap, tone: "green" },
            { label: "Conso. moyenne", value: `${AVG_KWH} kWh/jour`, Icon: TrendingUp, tone: "blue" },
            { label: "Autonomie restante", value: `${credit.autonomyDays} jours`, Icon: Clock, tone: "yellow" },
            { label: "Épuisement estimé", value: credit.exhaustionDate, Icon: Calendar, tone: "orange" },
          ].map((s) => (
            <CardFlat key={s.label}>
              <IconChip Icon={s.Icon} bg={`var(--${s.tone}-bg)`} fg={`var(--${s.tone})`} size={34} iconSize={16} radius={12} />
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "10px 0 2px" }}>{s.label}</div>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15 }}>{s.value}</div>
            </CardFlat>
          ))}
        </div>

        <Card style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Évolution de votre consommation</div>
            <div style={{ display: "flex", gap: 4, background: "var(--bg)", padding: 4, borderRadius: 9999 }}>
              {["Semaine", "Mois"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  border: "none", borderRadius: 9999, padding: "6px 12px", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  background: period === p ? "var(--primary-light)" : "transparent",
                  color: period === p ? "var(--primary)" : "var(--text-muted)",
                }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#71857B" }} />
                <Tooltip cursor={{ fill: "rgba(30,132,73,0.06)" }} formatter={(v) => [`${v} kWh`, "Consommation"]} />
                <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                  {WEEKLY.map((d, i) => <Cell key={i} fill={d.day === "Jeu" ? "#1E8449" : "#27A85B"} fillOpacity={d.day === "Jeu" ? 1 : 0.55} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <AlertBanner text={<>Votre consommation est <strong>{overAvg}% supérieure</strong> à votre moyenne habituelle.</>} />
      </ScreenScroll>
      <BottomNav active="dashboard" onNav={onNav} onMore={onMore} onPurchase={onOpenPurchase} />
    </>
  );
}

function ConsumptionScreen({ onNav, onMore, onOpenPurchase }) {
  const [tab, setTab] = useState("Jour");
  return (
    <>
      <ScreenScroll>
        <TopBarTitle title="Consommation" />
        <Tabs options={["Jour", "Semaine", "Mois", "Année"]} active={tab} onChange={setTab} />

        {tab === "Jour" ? (
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Aujourd'hui</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
              <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26 }}>{TODAY_KWH} kWh</div>
              <Pill tone="green">+12% vs hier</Pill>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY}>
                  <defs>
                    <linearGradient id="cons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#27A85B" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#27A85B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="h" ticks={["00h", "06h", "12h", "18h", "24h"]} interval={0} axisLine={false} tickLine={false} style={{ fontSize: 10, fill: "#71857B" }} />
                  <Tooltip formatter={(v) => [`${v} kWh`, ""]} />
                  <Area type="monotone" dataKey="v" stroke="#1E8449" strokeWidth={2} fill="url(#cons)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <Card style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{tab}</div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tab === "Semaine" ? WEEKLY : EXPENSES_MONTHLY.map((e) => ({ day: e.m, v: +(e.v / 3500).toFixed(1) }))}>
                  <XAxis dataKey={tab === "Semaine" ? "day" : "day"} axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#71857B" }} />
                  <Tooltip formatter={(v) => [`${v} kWh`, ""]} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#27A85B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Détail par période</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Aujourd'hui", value: "4,8 kWh" },
            { label: "Cette semaine", value: "31,1 kWh" },
            { label: "Ce mois", value: "128,4 kWh" },
          ].map((r) => (
            <CardFlat key={r.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13.5 }}>{r.label}</span>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{r.value}</span>
              </div>
            </CardFlat>
          ))}
        </div>

        <AlertBanner text={<>Votre consommation est <strong>12% supérieure</strong> à votre moyenne habituelle.</>} />
      </ScreenScroll>
      <BottomNav active="consumption" onNav={onNav} onMore={onMore} onPurchase={onOpenPurchase} />
    </>
  );
}

function AlertsScreen({ onBack }) {
  const [tab, setTab] = useState("Toutes");
  const filtered = ALERTS.filter((a) => tab === "Toutes" || a.cat === tab);
  return (
    <ScreenScroll>
      <TopBarTitle title="Alertes & Notifications" />
      <Tabs options={["Toutes", "Alerte", "Info"]} active={tab} onChange={setTab} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((a) => (
          <Card key={a.id}>
            <div style={{ display: "flex", gap: 12 }}>
              <IconChip Icon={a.Icon} bg={`var(--${a.tone}-bg)`} fg={`var(--${a.tone})`} size={40} iconSize={18} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 6 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScreenScroll>
  );
}

function ExpensesScreen({ onBack, onOpenPurchase }) {
  const [tab, setTab] = useState("Ce mois");
  return (
    <ScreenScroll>
      <TopBarTitle title="Dépenses" />
      <Tabs options={["Ce mois", "3 mois", "6 mois", "1 an"]} active={tab} onChange={setTab} />
      <Card style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Dépense totale</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 14px" }}>
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26 }}>16 800 FCFA</div>
          <Pill tone="red">-8% vs mois préc.</Pill>
        </div>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EXPENSES_MONTHLY}>
              <XAxis dataKey="m" axisLine={false} tickLine={false} style={{ fontSize: 11, fill: "#71857B" }} />
              <Tooltip formatter={(v) => [fcfa(v), ""]} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#27A85B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Détail des dépenses</div>
      <CardFlat>
        {EXPENSE_DETAIL.map((e, i) => (
          <div key={e.label} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderBottom: i < EXPENSE_DETAIL.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <IconChip Icon={e.Icon} bg={e.bg} fg={e.color} size={34} iconSize={15} radius={11} />
            <div style={{ flex: 1, fontSize: 13 }}>{e.label}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: e.value < 0 ? "var(--primary)" : "var(--text)" }}>
              {fcfa(e.value)}
            </div>
          </div>
        ))}
      </CardFlat>

      <div style={{ marginTop: 18 }}>
        <PrimaryButton onClick={onOpenPurchase}><Plus size={17} /> Acheter du courant</PrimaryButton>
      </div>
    </ScreenScroll>
  );
}

function PurchaseHistoryScreen({ onBack, purchases }) {
  const [tab, setTab] = useState("Tous");
  const filtered = purchases.filter((p) => tab === "Tous" || p.cat === tab);
  return (
    <ScreenScroll>
      <TopBarTitle title="Historique des achats" />
      <Tabs options={["Tous", "CFE", "Mobile Money"]} active={tab} onChange={setTab} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((p) => (
          <CardFlat key={`${p.ref}-${p.date}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IconChip Icon={Zap} bg="var(--primary-light)" fg="var(--primary)" size={40} iconSize={18} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.kwh} kWh</div>
                  <div style={{ fontSize: 11.5, color: "var(--primary)", fontWeight: 700 }}>{p.status || "Réussi"}</div>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{p.date} · {p.method}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{fcfa(p.amount)}</div>
            </div>
          </CardFlat>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, padding: "40px 0" }}>
            Aucune transaction dans cette catégorie.
          </div>
        )}
      </div>
    </ScreenScroll>
  );
}

function PurchaseNewScreen({ onClose, onDone, onPurchaseComplete, meterRef }) {
  const [step, setStep] = useState("amount");
  const [amountChoice, setAmountChoice] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("Wave");
  const [result, setResult] = useState(null);

  const quick = [1000, 2000, 5000, 10000];
  const selectedAmount = customAmount !== "" ? Number(customAmount) : amountChoice;
  const rate = 150;
  const estimatedKwh = ((selectedAmount || 0) / rate).toFixed(1);
  const fees = Math.round((selectedAmount || 0) * 0.015);
  const total = (selectedAmount || 0) + fees;

  const handleStartPayment = () => {
    if (!selectedAmount || selectedAmount <= 0) return;
    setStep("payment");
  };

  const handleFinalConfirm = () => {
    const reference = `WE-${Math.floor(100000 + Math.random() * 899999)}`;
    const nextResult = {
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      amount: selectedAmount,
      method,
      kwh: Number(estimatedKwh),
      ref: reference,
      status: "Réussi",
      cat: method === "Wave" || method === "Orange Money" ? "Mobile Money" : "CFE",
      fees,
      total,
      meter: meterRef || USER.meter,
    };
    setResult(nextResult);
    setStep("loading");
    window.setTimeout(() => {
      onPurchaseComplete(nextResult);
      setStep("success");
    }, 1800);
  };

  if (step === "loading") {
    return (
      <ScreenScroll>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 620, textAlign: "center" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: "4px solid var(--primary)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
          </div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Traitement du paiement</div>
          <div style={{ fontSize: 13.5, color: "var(--text-muted)", maxWidth: 260, lineHeight: 1.5 }}>
            Vérification du paiement, mise à jour du crédit et ajout à l'historique en cours.
          </div>
        </div>
      </ScreenScroll>
    );
  }

  if (step === "success") {
    return (
      <ScreenScroll>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 30 }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", marginBottom: 22,
            background: "linear-gradient(135deg, var(--primary-2), var(--primary))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 16px 32px rgba(30,132,73,0.3)",
          }}>
            <CheckCircle2 size={48} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 20, margin: "0 0 8px" }}>Paiement réussi</h1>
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 22px" }}>
            {result?.kwh} kWh ont été ajoutés à votre crédit.
          </p>
          <Card style={{ width: "100%", marginBottom: 22, textAlign: "left" }}>
            <Row label="Montant" value={fcfa(result?.amount || 0)} />
            <Row label="Moyen de paiement" value={result?.method} />
            <Row label="kWh estimés" value={`${result?.kwh || 0} kWh`} />
            <Row label="Référence" value={result?.ref || ""} />
            <Row label="Total" value={fcfa(result?.total || 0)} last />
          </Card>
          <PrimaryButton onClick={() => onDone("purchaseHistory")} style={{ marginBottom: 10 }}>Voir l'historique</PrimaryButton>
          <OutlineButton onClick={() => onDone("dashboard")}>Retour à l'accueil</OutlineButton>
        </div>
      </ScreenScroll>
    );
  }

  if (step === "payment") {
    return (
      <ScreenScroll>
        <TopBarBack title="Moyen de paiement" onBack={() => setStep("amount")} />
        <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>Choisissez votre moyen de paiement</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
          {[
            { key: "Wave", label: "Payer avec Wave", bg: "#EAF6FE", fg: "#0A9BD8", desc: "Paiement instantané via l'application Wave" },
            { key: "Orange Money", label: "Payer avec Orange Money", bg: "#FFF1E5", fg: "#FF7900", desc: "Paiement sécurisé avec Orange Money" },
          ].map((m) => (
            <CardFlat key={m.key} onClick={() => setMethod(m.key)} style={{
              cursor: "pointer", border: method === m.key ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconChip Icon={Smartphone} bg={m.bg} fg={m.fg} size={42} iconSize={19} radius={12} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{m.desc}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", border: `2px solid ${method === m.key ? "var(--primary)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {method === m.key && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />}
                </div>
              </div>
            </CardFlat>
          ))}
        </div>

        <Card style={{ marginBottom: 22 }}>
          <Row label="Montant" value={fcfa(selectedAmount)} />
          <Row label="kWh estimés" value={`${estimatedKwh} kWh`} />
          <Row label="Frais" value={fcfa(fees)} />
          <Row label="Montant total" value={fcfa(total)} last />
        </Card>

        <PrimaryButton onClick={() => setStep("confirm")}>Continuer <ArrowRight size={16} /></PrimaryButton>
      </ScreenScroll>
    );
  }

  if (step === "confirm") {
    return (
      <ScreenScroll>
        <TopBarBack title="Confirmation" onBack={() => setStep("payment")} />
        <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>Vérifiez les détails avant le paiement</div>
        <Card style={{ marginBottom: 22 }}>
          <Row label="Montant" value={fcfa(selectedAmount)} />
          <Row label="Moyen de paiement" value={method} />
          <Row label="kWh estimés" value={`${estimatedKwh} kWh`} />
          <Row label="N° compteur" value={meterRef || USER.meter} />
          <Row label="Frais" value={fcfa(fees)} />
          <Row label="Montant total" value={fcfa(total)} last />
        </Card>
        <PrimaryButton onClick={handleFinalConfirm}>Confirmer le paiement</PrimaryButton>
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <TopBarBack title="Acheter du courant" onBack={onClose} />
      <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 16 }}>Sélectionnez le montant à recharger</div>

      <Card style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Montant</div>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 30, margin: "6px 0 4px" }}>{fcfa(selectedAmount)}</div>
        <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>≈ {estimatedKwh} kWh estimés</div>
        <div style={{ marginTop: 14 }}>
          <input
            type="number"
            min={1000}
            step={500}
            value={customAmount}
            placeholder="Montant personnalisé"
            onChange={(e) => {
              const value = e.target.value;
              setCustomAmount(value);
              if (value) setAmountChoice(Number(value));
            }}
            style={{
              width: "100%", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px",
              fontSize: 14, outline: "none", background: "#fff",
            }}
          />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {quick.map((q) => (
          <button key={q} onClick={() => { setCustomAmount(""); setAmountChoice(q); }} style={{
            padding: "12px 0", borderRadius: 14, cursor: "pointer",
            border: Number(customAmount || amountChoice) === q ? "1.5px solid var(--primary)" : "1px solid var(--border)",
            background: Number(customAmount || amountChoice) === q ? "var(--primary-light)" : "#fff",
            color: Number(customAmount || amountChoice) === q ? "var(--primary)" : "var(--text)", fontWeight: 700, fontSize: 13,
          }}>{fcfa(q)}</button>
        ))}
      </div>

      <PrimaryButton onClick={handleStartPayment}>Continuer <ArrowRight size={16} /></PrimaryButton>
    </ScreenScroll>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function ProfileScreen({ onBack, onLogout, activeMeter }) {
  const rows = [
    { label: "Informations personnelles", Icon: User },
    { label: "Mon compteur", Icon: Cpu, value: activeMeter || USER.meter },
    { label: "Notifications", Icon: Bell },
    { label: "Mode sombre", Icon: Moon },
    { label: "Langue", Icon: Globe, value: "Français" },
    { label: "Aide & Support", Icon: HelpCircle },
    { label: "À propos de WATT'ÉCO", Icon: Info },
  ];
  return (
    <ScreenScroll>
      <TopBarTitle title="Profil & Paramètres" />
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconChip Icon={User} bg="var(--primary-light)" fg="var(--primary)" size={54} iconSize={24} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{USER.fullName}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{USER.phone}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{USER.email}</div>
          </div>
        </div>
      </Card>

      <CardFlat style={{ marginBottom: 22 }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
            borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer",
          }}>
            <r.Icon size={18} color="var(--text-muted)" />
            <div style={{ flex: 1, fontSize: 13.5 }}>{r.label}</div>
            {r.value && <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{r.value}</div>}
            <ChevronRight size={16} color="var(--text-muted)" />
          </div>
        ))}
      </CardFlat>

      <button onClick={onLogout} style={{
        width: "100%", height: 50, borderRadius: 17, border: "none", background: "var(--red-bg)",
        color: "var(--red)", fontWeight: 700, fontSize: 14, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <LogOut size={17} /> Se déconnecter
      </button>
    </ScreenScroll>
  );
}

function MeterSwitcher({ isOpen, onClose, meters, activeMeter, onSelectMeter, onAddMeter, onDisconnectMeter, onLogout }) {
  const [draft, setDraft] = useState("");

  if (!isOpen) return null;

  const submitMeter = () => {
    const meter = normalizeMeter(draft);
    if (!meter) return;
    onAddMeter(meter);
    setDraft("");
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 30, background: "rgba(11,43,31,0.18)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 22, right: 18, width: 280,
        background: "#fff", borderRadius: 22, border: "1px solid var(--border)",
        boxShadow: "0 24px 50px rgba(11,43,31,0.18)", padding: 16,
      }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Mes compteurs</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {meters.map((meter) => {
            const connected = meter === activeMeter;
            return (
              <div key={meter} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 8, padding: "10px 12px", borderRadius: 12, background: connected ? "var(--primary-light)" : "#F7FAF8",
                border: connected ? "1px solid rgba(30,132,73,0.2)" : "1px solid var(--border)",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis" }}>{meter}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{connected ? "Actif" : "Disponible"}</div>
                </div>
                {!connected ? (
                  <button onClick={() => onSelectMeter(meter)} style={{ border: "none", background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 700 }}>
                    Connecter
                  </button>
                ) : (
                  <button onClick={() => onDisconnectMeter(meter)} style={{ border: "none", background: "var(--red-bg)", color: "var(--red)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 700 }}>
                    Déconnecter
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="N° compteur"
            style={{
              flex: 1, borderRadius: 12, border: "1px solid var(--border)", background: "#fff",
              padding: "10px 12px", fontSize: 12.5, outline: "none",
            }}
          />
          <button onClick={submitMeter} style={{ border: "none", background: "var(--primary)", color: "#fff", borderRadius: 12, padding: "10px 12px", cursor: "pointer", fontWeight: 700 }}>
            Ajouter
          </button>
        </div>

        <button onClick={onLogout} style={{ width: "100%", border: "none", background: "var(--red-bg)", color: "var(--red)", borderRadius: 12, padding: "11px 12px", cursor: "pointer", fontWeight: 700 }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

function SideDrawer({ open, onClose, onNav }) {
  const links = [
    { key: "dashboard", label: "Accueil", Icon: Home },
    { key: "consumption", label: "Consommation", Icon: Activity },
    { key: "expenses", label: "Dépenses", Icon: Wallet },
    { key: "purchaseHistory", label: "Historique des achats", Icon: History },
    { key: "alerts", label: "Alertes", Icon: Bell },
    { key: "profile", label: "Profil & Paramètres", Icon: Settings },
  ];
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20, display: open ? "block" : "none",
    }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(11,43,31,0.45)" }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "80%", maxWidth: 320,
        background: "var(--dark)", padding: "28px 22px", overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ marginBottom: 26 }}><Logo compact dark /></div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14,
          }}>{USER.initials}</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{USER.fullName}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{USER.phone}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {links.map((l) => (
            <button key={l.key} onClick={() => onNav(l.key)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 14,
              background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <l.Icon size={18} color="#fff" />
              <span style={{ color: "#fff", fontSize: 13.5, fontWeight: 500 }}>{l.label}</span>
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <HelpCircle size={18} color="rgba(255,255,255,0.7)" />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5 }}>Aide & Support</span>
          </button>
          <button onClick={() => onNav("splash")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 14, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <LogOut size={18} color="#E15252" />
            <span style={{ color: "#E15252", fontSize: 13.5, fontWeight: 600 }}>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- APP ----------------------------------- */

export default function WattEcoApp() {
  const [screen, setScreen] = useState("splash");
  const [obStep, setObStep] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [meterMenuOpen, setMeterMenuOpen] = useState(false);
  const [meters, setMeters] = useState([USER.meter]);
  const [activeMeter, setActiveMeter] = useState(USER.meter);
  const [credit, setCredit] = useState({
    remainingKwh: CREDIT.remainingKwh,
    percent: CREDIT.percent,
    initialKwh: CREDIT.initialKwh,
    remainingValueFcfa: CREDIT.remainingValueFcfa,
    autonomyDays: CREDIT.autonomyDays,
    exhaustionDate: CREDIT.exhaustionDate,
  });
  const [purchaseHistory, setPurchaseHistory] = useState(PURCHASE_HISTORY);

  const goto = (s) => { setScreen(s); setDrawerOpen(false); setMeterMenuOpen(false); };

  const connectMeter = (meterValue) => {
    const normalized = normalizeMeter(meterValue);
    if (!normalized) return;
    setMeters((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setActiveMeter(normalized);
    setMeterMenuOpen(false);
  };

  const disconnectMeter = (meterValue) => {
    const remaining = meters.filter((m) => m !== meterValue);
    if (remaining.length === 0) return;
    setMeters(remaining);
    if (activeMeter === meterValue) {
      setActiveMeter(remaining[0]);
    }
  };

  const handleLogout = () => {
    setMeters([USER.meter]);
    setActiveMeter(USER.meter);
    setMeterMenuOpen(false);
    goto("splash");
  };

  const handlePurchaseComplete = (purchase) => {
    setPurchaseHistory((prev) => [{ ...purchase, cat: purchase.method === "Wave" || purchase.method === "Orange Money" ? "Mobile Money" : "CFE" }, ...prev]);
    setCredit((prev) => {
      const nextRemaining = +(prev.remainingKwh + purchase.kwh).toFixed(1);
      const nextInitial = +(prev.initialKwh + purchase.kwh).toFixed(1);
      const nextPercent = Math.min(100, Math.max(0, Math.round((nextRemaining / nextInitial) * 100)));
      const nextAutonomy = Math.max(1, Math.round(nextRemaining / AVG_KWH));
      const nextExhaustionDate = new Date(Date.now() + nextAutonomy * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      });

      return {
        remainingKwh: nextRemaining,
        percent: nextPercent,
        initialKwh: nextInitial,
        remainingValueFcfa: Math.round(nextRemaining * 125),
        autonomyDays: nextAutonomy,
        exhaustionDate: nextExhaustionDate,
      };
    });
  };

  const bottomNavScreens = ["dashboard", "consumption"];
  const drawerOnlyScreens = ["alerts", "expenses", "purchaseHistory", "profile"];

  let content = null;
  switch (screen) {
    case "splash":
      content = <SplashScreen onStart={() => { setObStep(0); goto("onboarding"); }} onLogin={() => goto("login")} />;
      break;
    case "onboarding":
      content = (
        <OnboardingScreen
          step={obStep} setStep={setObStep}
          onSkip={() => goto("login")}
          onFinishSignup={() => goto("signup")}
          onFinishLogin={() => goto("login")}
        />
      );
      break;
    case "login":
      content = <LoginScreen onBack={() => goto("splash")} onLogin={() => goto("dashboard")} onSignup={() => goto("signup")} />;
      break;
    case "signup":
      content = <SignupScreen onBack={() => goto("splash")} onSignup={(meter) => { connectMeter(meter); goto("dashboard"); }} onLogin={() => goto("login")} />;
      break;
    case "dashboard":
      content = <DashboardScreen onNav={goto} onMore={() => setDrawerOpen(true)} onOpenMeters={() => setMeterMenuOpen((v) => !v)} onOpenPurchase={() => goto("purchaseNew")} activeMeter={activeMeter} credit={credit} />;
      break;
    case "consumption":
      content = <ConsumptionScreen onNav={goto} onMore={() => setDrawerOpen(true)} onOpenPurchase={() => goto("purchaseNew")} />;
      break;
    case "alerts":
      content = <AlertsScreen onBack={() => goto("dashboard")} />;
      break;
    case "expenses":
      content = <ExpensesScreen onBack={() => goto("dashboard")} onOpenPurchase={() => goto("purchaseNew")} />;
      break;
    case "purchaseNew":
      content = <PurchaseNewScreen onClose={() => goto("dashboard")} onDone={goto} onPurchaseComplete={handlePurchaseComplete} meterRef={USER.meter} />;
      break;
    case "purchaseHistory":
      content = <PurchaseHistoryScreen onBack={() => goto("dashboard")} purchases={purchaseHistory} />;
      break;
    case "profile":
      content = <ProfileScreen onBack={() => goto("dashboard")} onLogout={handleLogout} activeMeter={activeMeter} />;
      break;
    default:
      content = null;
  }

  const showDrawerNav = drawerOnlyScreens.includes(screen);

  return (
    <div style={{ minHeight: "100vh", background: "#EDF3EE", display: "flex", justifyContent: "center", padding: "24px 12px", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        :root {
          --dark:#0B2B1F; --dark-2:#0F3A28; --dark-3:#123524;
          --primary:#1E8449; --primary-2:#27A85B; --primary-light:#E7F6EC;
          --bg:#F5FAF6; --surface:#FFFFFF;
          --text:#12241B; --text-muted:#71857B; --border:#E5EEE8;
          --yellow:#F2A93B; --yellow-bg:#FEF6E8;
          --orange:#E8734A; --orange-bg:#FDEEE7;
          --red:#E15252; --red-bg:#FCEAEA;
          --blue:#3B82C4; --blue-bg:#EAF2FA;
        }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        input[type=range] { height: 4px; border-radius: 4px; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      <div style={{
        width: 390, maxWidth: "100%", background: "var(--bg)", height: 844, maxHeight: "92vh",
        borderRadius: 36, overflow: "hidden", boxShadow: "0 24px 60px rgba(11,43,31,0.18), 0 0 0 8px #0B2B1F",
        display: "flex", flexDirection: "column", position: "relative",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
          {content}
        </div>

        {(showDrawerNav) && (
          <BottomNav active="purchase" onNav={goto} onMore={() => setDrawerOpen(true)} onPurchase={() => goto("purchaseNew")} />
        )}

        <MeterSwitcher
          isOpen={meterMenuOpen}
          onClose={() => setMeterMenuOpen(false)}
          meters={meters}
          activeMeter={activeMeter}
          onSelectMeter={(meter) => { setActiveMeter(meter); setMeterMenuOpen(false); }}
          onAddMeter={connectMeter}
          onDisconnectMeter={disconnectMeter}
          onLogout={handleLogout}
        />

        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNav={goto} />
      </div>
    </div>
  );
}
