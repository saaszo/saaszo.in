"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toAbsoluteApiUrl } from "@/lib/config";
import { apiErrorMessage, authedRequest } from "@/lib/workspace-action-client";
import { getDeviceId, readAccessToken, navigateTo } from "@/lib/auth-client";
import { getVerificationAuth } from "@/lib/firebase";
import { CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, Hexagon, Loader2, Mail, Smartphone, X } from "lucide-react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "./ui/searchable-select";
import { useLocations } from "@/lib/shared-masters";
import { useAuthSession } from "./AuthProvider";

type OnboardingProfile = {
  owner_name?: string; business_name?: string; email?: string; phone?: string;
  city?: string; state?: string; user_type?: string; business_category?: string;
  other_business_category?: string; team_size?: string; monthly_invoice_volume?: string;
  gst_registered?: string; gst_number?: string; legal_business_name?: string;
  gst_state?: string; gst_type?: string; legal_entity_type?: string; registration_types?: string[];
  pan_number?: string; cin_number?: string; llpin_number?: string; tan_number?: string;
  udyam_registration_number?: string; udyog_aadhaar_number?: string; ngo_darpan_id?: string;
  trust_registration_number?: string; society_registration_number?: string; fssai_number?: string;
  iec_number?: string; professional_tax_number?: string; invoice_item_type?: string; needs_inventory?: string;
  needs_quotation?: string; needs_payment_tracking?: string; needs_customer_records?: string;
  required_reports?: string[]; payment_methods?: string[]; wants_upi_qr?: string;
  upi_id?: string; bank_details?: string; bank_account_holder_name?: string; bank_name?: string;
  bank_account_number?: string; bank_ifsc?: string; bank_swift_code?: string; bank_micr_code?: string;
  bank_branch_name?: string; bank_account_type?: string; bank_notes?: string; logo_path?: string; logo_url?: string;
  invoice_template_preference?: string; show_on_invoice?: string[]; branch_model?: string;
  setup_completed?: boolean; setup_skipped?: boolean; current_step?: number; first_invoice_created_at?: string | null;
};

type OnboardingOptions = {
  user_types: string[]; business_categories: string[]; team_sizes: string[]; monthly_invoice_volumes: string[];
  gst_registered_options: string[]; gst_type_options: string[]; invoice_item_types: string[];
  legal_entity_type_options: string[]; registration_type_options: string[];
  yes_no_future_options: string[]; yes_no_options: string[]; yes_no_later_options: string[];
  required_report_options: string[]; payment_method_options: string[]; template_options: string[];
  show_on_invoice_options: string[]; branch_model_options: string[];
};

type Personalization = {
  segment?: string; headline?: string; focus?: string[]; reminder?: string | null;
  show_gst_reports?: boolean; show_hsn_sac?: boolean; show_batch_fields?: boolean;
  show_upi_qr?: boolean; business_profile?: any;
};

type OnboardingResponse = {
  success?: boolean; message?: string; profile?: OnboardingProfile | null;
  options?: OnboardingOptions; personalization?: Personalization;
};

const stepLabels = ["Basics", "Verify & Category", "Size", "GST", "Needs", "Payments", "Branding", "Done"];
const stepHelp = [
  {
    title: "Set your business foundation",
    description: "Ye details aapke account, invoices aur branch identity ka base banengi.",
    highlights: [
      "Correct contact details future login recovery aur notifications ke liye zaroori hain.",
      "State aur city billing, GST aur branch setup me mismatch kam karte hain.",
    ],
  },
  {
    title: "Confirm your contacts and business type",
    description: "Review which contact details are already verified and choose the category that best matches your business.",
    highlights: [
      "Google sign-up usually verifies email first, while phone OTP sign-up verifies mobile first.",
      "Your business category helps personalize product defaults and reports.",
    ],
  },
  {
    title: "Match the product to your size",
    description: "Scale samajhne se dashboard aur workflows ko better tune kiya ja sakta hai.",
    highlights: [
      "Right defaults se onboarding fast hota hai.",
      "Volume aur team size reports aur automations ko influence karte hain.",
    ],
  },
  {
    title: "Keep GST data clean",
    description: "GST details invoice accuracy aur compliance ke liye important hain.",
    highlights: [
      "Galat GST state ya GSTIN future filing issues create kar sakta hai.",
      "Valid format checks abhi se errors ko reduce karte hain.",
    ],
  },
  {
    title: "Choose only what you need",
    description: "Is step se dashboard aur feature visibility aapke use case ke hisab se set hoti hai.",
    highlights: [
      "Branch model baad ki branch creation ko simple banata hai.",
      "Relevant reports aur modules hi zyada visible rahenge.",
    ],
  },
  {
    title: "Set payment basics",
    description: "Payment details aapke invoices aur collection flow ko trust-ready banate hain.",
    highlights: [
      "Correct bank info customer trust improve karti hai.",
      "Bank dropdown aur IFSC format checks manual errors kam karte hain.",
    ],
  },
  {
    title: "Finish branding",
    description: "Template aur logo se aapka invoice professional aur recognizable hota hai.",
    highlights: [
      "Customer-facing documents me consistent brand important hota hai.",
      "Logo aur template baad me settings se update ho sakte hain.",
    ],
  },
  {
    title: "You're ready to go",
    description: "Setup complete hone ke baad dashboard aur modules use ke liye ready ho jayenge.",
    highlights: [
      "Ab aap product, customer aur invoice workflows start kar sakte ho.",
      "Skipped info later settings se fill ho sakti hai.",
    ],
  },
] as const;
const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const OTHER_BANK_VALUE = "__other_bank__";
const BANK_OPTIONS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
  "Indian Overseas Bank",
  "IDBI Bank",
  "IDFC FIRST Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "Federal Bank",
  "South Indian Bank",
  "RBL Bank",
  "AU Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Equitas Small Finance Bank",
  "Bandhan Bank",
  "Karnataka Bank",
  "Karur Vysya Bank",
  "City Union Bank",
  "DCB Bank",
  "Tamilnad Mercantile Bank",
  "CSB Bank",
  "DBS Bank India",
  "Standard Chartered Bank",
  "HSBC",
  "Citi Bank",
  "Other bank",
].map((bank) => ({
  label: bank,
  value: bank === "Other bank" ? OTHER_BANK_VALUE : bank,
}));

function sanitizeText(value: string, maxLength = 255) {
  return value.replace(/[^a-zA-Z0-9&(),./' -]/g, "").slice(0, maxLength);
}

function sanitizeLetters(value: string, maxLength = 120) {
  return value.replace(/[^a-zA-Z .'-]/g, "").replace(/\s{2,}/g, " ").slice(0, maxLength);
}

function sanitizeEmail(value: string, maxLength = 255) {
  return value.replace(/\s/g, "").toLowerCase().slice(0, maxLength);
}

function sanitizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("91") ? digits.slice(2) : digits;
  return `+91${local.slice(0, 10)}`;
}

function normalizeIndianPhone(value: string | null | undefined) {
  const raw = (value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length >= 12 && digits.startsWith("91")) {
    return `+91${digits.slice(2, 12)}`;
  }

  return sanitizeIndianPhone(raw);
}

function sanitizeAlphaNumeric(value: string, maxLength = 80) {
  return value.toUpperCase().replace(/[^A-Z0-9/-]/g, "").slice(0, maxLength);
}

function sanitizeDigits(value: string, maxLength = 20) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function sanitizeUpiId(value: string, maxLength = 255) {
  return value.replace(/[^a-zA-Z0-9._@-]/g, "").toLowerCase().slice(0, maxLength);
}

const defaultOptions: OnboardingOptions = {
  user_types: ["Individual", "Business Owner", "Company", "Freelancer"],
  business_categories: ["Freelancer", "Digital Marketing Agency", "Web Development / IT Services", "Retail Shop", "Wholesale Business", "Medical / Pharmacy", "Restaurant / Cafe", "Consultant", "Manufacturer", "Trader / Distributor", "Salon / Beauty", "Real Estate", "Other"],
  team_sizes: ["Solo", "2-5", "6-10", "11-25", "25+"],
  monthly_invoice_volumes: ["1-10", "11-50", "51-100", "100+", "Just starting"],
  gst_registered_options: ["Yes", "No", "Not Sure", "Applying Soon"],
  gst_type_options: ["Regular", "Composition", "Not Sure"],
  legal_entity_type_options: ["Proprietorship", "Partnership Firm", "Limited Liability Partnership (LLP)", "Private Limited Company", "Public Limited Company", "One Person Company (OPC)", "HUF", "Cooperative Society", "Society", "Trust", "Section 8 / Non-Profit Company", "NGO / Voluntary Organization", "Non-Profit Organization", "Government Entity", "Other"],
  registration_type_options: ["GST Registration", "MSME / Udyam Registration", "Udyog Aadhaar (Legacy UAM)", "CIN", "LLPIN", "PAN", "TAN", "NGO Darpan", "Trust Registration", "Society Registration", "FSSAI", "Import Export Code (IEC)", "Professional Tax"],
  invoice_item_types: ["Products", "Services", "Both", "Subscription/Recurring", "Project Based"],
  yes_no_future_options: ["Yes", "No", "Future"],
  yes_no_options: ["Yes", "No"],
  yes_no_later_options: ["Yes", "No", "Later"],
  required_report_options: ["Sales Report", "GST Report", "Pending Payments", "Customer Wise Sales", "Product Wise Sales", "Monthly Income", "Expense Report", "Inventory Report"],
  payment_method_options: ["Cash", "UPI", "Bank Transfer", "Card", "Payment Gateway", "Cheque"],
  template_options: ["Simple", "Professional", "GST Format", "Modern Branded", "Retail Bill Style", "Minimal Black & White"],
  show_on_invoice_options: ["Logo", "GST Number", "Bank Details", "UPI ID", "Terms & Conditions", "Signature", "Seal", "Notes"],
  branch_model_options: ["Single Branch", "Multi-Branch (Multiple Outlets)"],
};

const defaultForm: OnboardingProfile = {
  required_reports: [], payment_methods: [], show_on_invoice: [], registration_types: [], user_type: "Business Owner",
  gst_registered: "No", needs_inventory: "No", needs_quotation: "Yes", needs_payment_tracking: "Yes",
  needs_customer_records: "Yes", wants_upi_qr: "Later", invoice_template_preference: "Professional", branch_model: "Single Branch",
};

function toggleArrayValue(values: string[] | undefined, value: string) {
  const safeValues = values || [];
  return safeValues.includes(value) ? safeValues.filter((item) => item !== value) : [...safeValues, value];
}

function syncGstRegistrationType(values: string[] | undefined, gstStatus: string) {
  const safeValues = values || [];
  if (gstStatus === "Yes" && !safeValues.includes("GST Registration")) {
    return ["GST Registration", ...safeValues];
  }
  return safeValues;
}

export function OnboardingWorkspace() {
  const [form, setForm] = useState<OnboardingProfile>(defaultForm);
  const [options, setOptions] = useState<OnboardingOptions>(defaultOptions);
  const [personalization, setPersonalization] = useState<Personalization | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [started, setStarted] = useState(false);
  const [useCustomBank, setUseCustomBank] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpSending, setEmailOtpSending] = useState(false);
  const [emailOtpVerifying, setEmailOtpVerifying] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpSending, setPhoneOtpSending] = useState(false);
  const [phoneOtpVerifying, setPhoneOtpVerifying] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [verificationConfirmation, setVerificationConfirmation] = useState<ConfirmationResult | null>(null);
  const [phoneVerifier, setPhoneVerifier] = useState<RecaptchaVerifier | null>(null);
  const [verificationModal, setVerificationModal] = useState<"email" | "phone" | null>(null);
  const [verificationNotice, setVerificationNotice] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const { states, isLoading: locationsLoading } = useLocations();
  const { user, profile, auth } = useAuthSession();

  const stateOptions = useMemo(
    () => states.map((s) => ({ label: s.label, value: s.state_name })),
    [states],
  );
  const businessCategoryOptions = useMemo(
    () => options.business_categories.map((category) => ({ label: category, value: category })),
    [options.business_categories],
  );

  const gstNumberNormalized = (form.gst_number || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
  const gstFormatMessage = !gstNumberNormalized
    ? "GSTIN format: 2 digits + PAN + entity code + Z + checksum. Example: 22AAAAA0000A1Z5"
    : GSTIN_REGEX.test(gstNumberNormalized)
      ? "GSTIN format looks valid."
      : "Enter a valid 15-character GSTIN like 22AAAAA0000A1Z5.";

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await authedRequest<OnboardingResponse>("/api/auth/onboarding");
      if (!active) return;
      if (!result.ok || !result.data.success) {
        setError(apiErrorMessage("Could not load onboarding setup.", result.data));
        setLoading(false);
        return;
      }
      const profile = result.data.profile || {};
      setOptions(result.data.options || defaultOptions);
      // Filter null values from profile so they don't override defaultForm defaults
      // This prevents null DB fields (e.g. needs_quotation: null) from causing 422 on save
      const safeProfile = Object.fromEntries(
        Object.entries(profile).filter(([, v]) => v !== null && v !== undefined)
      );
      setForm({
        ...defaultForm,
        ...safeProfile,
        email: sanitizeEmail(String(profile.email || defaultForm.email || "")),
        phone: normalizeIndianPhone(profile.phone || defaultForm.phone || ""),
        required_reports: profile.required_reports || [],
        payment_methods: profile.payment_methods || [],
        show_on_invoice: profile.show_on_invoice || [],
        registration_types: profile.registration_types || [],
      });
      setPersonalization(result.data.personalization || null);
      if (profile.setup_completed) {
        navigateTo("/dashboard/settings");
        return;
      }
      setStarted(Boolean(profile.current_step || profile.setup_completed || profile.setup_skipped));
      setCurrentStep(profile.setup_completed ? 8 : Math.max(1, Math.min(profile.current_step || 1, 8)));
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!form.bank_name) {
      setUseCustomBank(false);
      return;
    }
    const hasPresetBank = BANK_OPTIONS.some((option) => option.value !== OTHER_BANK_VALUE && option.value === form.bank_name);
    setUseCustomBank(!hasPresetBank);
  }, [form.bank_name]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      email: sanitizeEmail(current.email || auth?.email || profile?.email || ""),
      phone: normalizeIndianPhone(current.phone || auth?.phone || profile?.phone || ""),
    }));
  }, [auth?.email, auth?.phone, profile?.email, profile?.phone]);

  const firebaseProviderIds = useMemo(
    () => (user?.providerData || []).map((provider) => provider.providerId).filter(Boolean),
    [user],
  );

  const signedInWithGoogle = firebaseProviderIds.includes("google.com");
  const signedInWithPhoneOtp = firebaseProviderIds.includes("phone");

  const emailVerified = useMemo(() => {
    if (emailOtpVerified) {
      return true;
    }

    if (signedInWithGoogle && (auth?.email || profile?.email || user?.email)) {
      return true;
    }

    if (user?.emailVerified && (auth?.email || profile?.email || user?.email)) {
      return true;
    }

    return false;
  }, [auth?.email, emailOtpVerified, profile?.email, signedInWithGoogle, user]);

  const phoneVerified = useMemo(() => {
    if (phoneOtpVerified) {
      return true;
    }

    if (signedInWithPhoneOtp && normalizeIndianPhone(auth?.phone || profile?.phone || user?.phoneNumber || "")) {
      return true;
    }

    return false;
  }, [auth?.phone, phoneOtpVerified, profile?.phone, signedInWithPhoneOtp, user?.phoneNumber]);

  const emailVerificationLabel = emailVerified
    ? signedInWithGoogle
      ? "Verified by Google sign-in"
      : emailOtpVerified
        ? "Verified by email OTP"
        : "Verified"
    : "Pending verification";

  const phoneVerificationLabel = phoneVerified
    ? "Verified by mobile OTP sign-in"
    : "Pending verification";

  const contactsFullyVerified = emailVerified && phoneVerified;

  useEffect(() => {
    if (!started || form.setup_completed) return;
    const handleUnload = () => {
      const token = readAccessToken();
      if (!token) return;
      const payload = JSON.stringify({ event_name: "setup_abandoned", step: currentStep, meta: { source: "browser-unload" } });
      void fetch(toAbsoluteApiUrl("/api/auth/onboarding/track"), {
        method: "POST", keepalive: true, credentials: "include",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}`, "X-Device-ID": getDeviceId() },
        body: payload,
      });
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [currentStep, form.setup_completed, started]);

  useEffect(() => {
    return () => {
      if (phoneVerifier) {
        try {
          phoneVerifier.clear();
        } catch {}
      }
    };
  }, [phoneVerifier]);

  useEffect(() => {
    if (emailResendTimer <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setEmailResendTimer((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [emailResendTimer]);

  useEffect(() => {
    if (phoneResendTimer <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPhoneResendTimer((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phoneResendTimer]);

  useEffect(() => {
    if (currentStep !== 2 || phoneVerified) {
      return;
    }

    void ensurePhoneVerifier().catch(() => null);
  }, [currentStep, phoneVerified]);

  function setValue<K extends keyof OnboardingProfile>(key: K, value: OnboardingProfile[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleGstinChange(value: string) {
    setValue("gst_number", value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15));
  }

  function handleBankSelect(value: string) {
    if (value === OTHER_BANK_VALUE) {
      setUseCustomBank(true);
      setValue("bank_name", "" as OnboardingProfile["bank_name"]);
      return;
    }
    setUseCustomBank(false);
    setValue("bank_name", value);
  }

  function handleTextField<K extends keyof OnboardingProfile>(key: K, value: string, maxLength?: number) {
    setValue(key, sanitizeText(value, maxLength) as OnboardingProfile[K]);
  }

  function handleLetterField<K extends keyof OnboardingProfile>(key: K, value: string, maxLength?: number) {
    setValue(key, sanitizeLetters(value, maxLength) as OnboardingProfile[K]);
  }

  function handleAlphaNumericField<K extends keyof OnboardingProfile>(key: K, value: string, maxLength?: number) {
    setValue(key, sanitizeAlphaNumeric(value, maxLength) as OnboardingProfile[K]);
  }

  function handleDigitsField<K extends keyof OnboardingProfile>(key: K, value: string, maxLength?: number) {
    setValue(key, sanitizeDigits(value, maxLength) as OnboardingProfile[K]);
  }

  function validateStepBeforeSave(step: number) {
    if (step === 2) {
      if (!contactsFullyVerified) {
        return "Please verify both your email and mobile number before continuing.";
      }

      if (!(form.business_category || "").trim()) {
        return "Select the category that best describes your business.";
      }

      return null;
    }

    if (step !== 1) return null;

    const email = (form.email || "").trim();
    const phone = (form.phone || "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address with @ and domain.";
    }

    if (!phone || !/^\+91\d{10}$/.test(phone)) {
      return "Enter mobile number in +91XXXXXXXXXX format.";
    }

    if (!(form.state || "").trim()) {
      return "Select your state.";
    }

    if (!(form.city || "").trim()) {
      return "Enter your city.";
    }

    return null;
  }

  function stepPayload(step: number): Record<string, unknown> {
    switch (step) {
      case 1: return { owner_name: form.owner_name || "", business_name: form.business_name || "", email: form.email || "", phone: form.phone || null, city: form.city || null, state: form.state || null, user_type: form.user_type || "" };
      case 2: return { business_category: form.business_category || "", other_business_category: form.other_business_category || null };
      case 3: return { team_size: form.team_size || "", monthly_invoice_volume: form.monthly_invoice_volume || "" };
      case 4: return {
        gst_registered: form.gst_registered || "",
        gst_number: form.gst_number || null,
        legal_business_name: form.legal_business_name || null,
        gst_state: form.gst_state || null,
        gst_type: form.gst_type || null,
        legal_entity_type: form.legal_entity_type || null,
        registration_types: form.registration_types || [],
        pan_number: form.pan_number || null,
        cin_number: form.cin_number || null,
        llpin_number: form.llpin_number || null,
        tan_number: form.tan_number || null,
        udyam_registration_number: form.udyam_registration_number || null,
        udyog_aadhaar_number: form.udyog_aadhaar_number || null,
        ngo_darpan_id: form.ngo_darpan_id || null,
        trust_registration_number: form.trust_registration_number || null,
        society_registration_number: form.society_registration_number || null,
        fssai_number: form.fssai_number || null,
        iec_number: form.iec_number || null,
        professional_tax_number: form.professional_tax_number || null,
      };
      case 5: return { invoice_item_type: form.invoice_item_type || "", needs_inventory: form.needs_inventory || "", needs_quotation: form.needs_quotation || "", needs_payment_tracking: form.needs_payment_tracking || "", needs_customer_records: form.needs_customer_records || "", required_reports: form.required_reports || [], branch_model: form.branch_model || null };
      case 6: return {
        payment_methods: form.payment_methods || [],
        wants_upi_qr: form.wants_upi_qr || "",
        upi_id: form.upi_id || null,
        bank_details: form.bank_details || null,
        bank_account_holder_name: form.bank_account_holder_name || null,
        bank_name: form.bank_name || null,
        bank_account_number: form.bank_account_number || null,
        bank_ifsc: form.bank_ifsc || null,
        bank_swift_code: form.bank_swift_code || null,
        bank_micr_code: form.bank_micr_code || null,
        bank_branch_name: form.bank_branch_name || null,
        bank_account_type: form.bank_account_type || null,
        bank_notes: form.bank_notes || null,
      };
      case 7: return { logo_path: form.logo_path || null, logo_url: form.logo_url || null, invoice_template_preference: form.invoice_template_preference || "", show_on_invoice: form.show_on_invoice || [] };
      default: return {};
    }
  }

  async function saveStep(step: number, moveNext = false) {
    setSaving(true); setError(""); setSuccess("");
    const stepError = validateStepBeforeSave(step);
    if (stepError) {
      setSaving(false);
      setError(stepError);
      return;
    }
    const result = await authedRequest<OnboardingResponse>("/api/auth/onboarding/save", {
      method: "POST", body: JSON.stringify({ step, payload: stepPayload(step) }),
    });
    setSaving(false);
    if (!result.ok || !result.data.success) { setError(apiErrorMessage("Could not save onboarding step.", result.data)); return; }
    setStarted(true);
    setSuccess(result.data.message || "Progress saved.");
    if (result.data.profile) {
      setForm((current) => ({
        ...current, ...result.data.profile,
        required_reports: result.data.profile?.required_reports || current.required_reports || [],
        payment_methods: result.data.profile?.payment_methods || current.payment_methods || [],
        show_on_invoice: result.data.profile?.show_on_invoice || current.show_on_invoice || [],
        registration_types: result.data.profile?.registration_types || current.registration_types || [],
      }));
    }
    if (result.data.personalization) setPersonalization(result.data.personalization);
    if (moveNext && step < 8) setCurrentStep(step + 1);
  }

  async function sendEmailVerificationOtp() {
    if (!form.email) {
      setVerificationError("Enter your email address first.");
      return;
    }

    setVerificationError("");
    setVerificationNotice("");
    setEmailOtpSending(true);

    const result = await authedRequest<{ success?: boolean; message?: string }>("/api/auth/account/send-email-otp", {
      method: "POST",
      body: JSON.stringify({
        purpose: "current_email",
        email: sanitizeEmail(form.email || ""),
      }),
    });

    setEmailOtpSending(false);

    if (!result.ok || !result.data.success) {
      setVerificationError(apiErrorMessage("Could not send email OTP.", result.data));
      return;
    }

    setEmailOtpSent(true);
    setEmailResendTimer(60);
    setVerificationNotice(result.data.message || "Email OTP sent successfully.");
  }

  async function verifyEmailVerificationOtp() {
    if (emailOtp.length !== 4) {
      setVerificationError("Enter the 4-digit email OTP.");
      return;
    }

    setVerificationError("");
    setVerificationNotice("");
    setEmailOtpVerifying(true);

    const result = await authedRequest<{ success?: boolean; message?: string }>("/api/auth/account/verify-email-otp", {
      method: "POST",
      body: JSON.stringify({
        purpose: "current_email",
        email: sanitizeEmail(form.email || ""),
        otp: emailOtp,
      }),
    });

    setEmailOtpVerifying(false);

    if (!result.ok || !result.data.success) {
      setVerificationError(apiErrorMessage("Could not verify email OTP.", result.data));
      return;
    }

    setEmailOtp("");
    setEmailOtpSent(false);
    setEmailResendTimer(0);
    setEmailOtpVerified(true);
    setVerificationModal(null);
    setSuccess(result.data.message || "Email verified successfully.");
  }

  async function ensurePhoneVerifier() {
    if (phoneVerifier) {
      return phoneVerifier;
    }

    const verificationAuth = getVerificationAuth();
    if (!verificationAuth) {
      throw new Error("Phone verification is not available right now.");
    }

    const verifier = new RecaptchaVerifier(verificationAuth, "onboarding-phone-recaptcha", {
      size: "invisible",
      callback: () => {
        setError("");
      },
      "expired-callback": () => {
        setError("Phone verification CAPTCHA expired. Please complete it again.");
      },
    });

    await verifier.render();
    setPhoneVerifier(verifier);
    return verifier;
  }

  async function sendPhoneVerificationOtp() {
    if (!/^\+91\d{10}$/.test(form.phone || "")) {
      setVerificationError("Enter a valid mobile number in +91XXXXXXXXXX format first.");
      return;
    }

    setVerificationError("");
    setVerificationNotice("");
    setPhoneOtpSending(true);

    try {
      const verificationAuth = getVerificationAuth();
      if (!verificationAuth) {
        throw new Error("Phone verification is not available right now.");
      }

      try {
        await signOut(verificationAuth);
      } catch {}

      const verifier = await ensurePhoneVerifier();
      const confirmation = await signInWithPhoneNumber(verificationAuth, form.phone || "", verifier);
      setVerificationConfirmation(confirmation);
      setPhoneOtpSent(true);
      setPhoneResendTimer(60);
      setVerificationNotice("Mobile OTP sent successfully.");
    } catch (verificationError: any) {
      setVerificationError(verificationError?.message || "Could not send mobile OTP.");
      try {
        phoneVerifier?.clear();
      } catch {}
      setPhoneVerifier(null);
    } finally {
      setPhoneOtpSending(false);
    }
  }

  async function verifyPhoneVerificationOtp() {
    if (!verificationConfirmation) {
      setVerificationError("Please send the mobile OTP first.");
      return;
    }

    if (phoneOtp.length !== 6) {
      setVerificationError("Enter the 6-digit mobile OTP.");
      return;
    }

    setVerificationError("");
    setVerificationNotice("");
    setPhoneOtpVerifying(true);

    try {
      const verificationAuth = getVerificationAuth();
      if (!verificationAuth) {
        throw new Error("Phone verification is not available right now.");
      }

      const verifiedUser = await verificationConfirmation.confirm(phoneOtp);
      const idToken = await verifiedUser.user.getIdToken();

      const result = await authedRequest<{ success?: boolean; message?: string; verified_phone?: string }>("/api/auth/account/verify-phone", {
        method: "POST",
        body: JSON.stringify({
          purpose: "current_phone",
          expected_phone: form.phone,
          id_token: idToken,
        }),
      });

      if (!result.ok || !result.data.success) {
        throw new Error(apiErrorMessage("Could not verify mobile OTP.", result.data));
      }

      setPhoneOtp("");
      setPhoneOtpSent(false);
      setPhoneResendTimer(0);
      setVerificationConfirmation(null);
      setPhoneOtpVerified(true);
      setVerificationModal(null);
      setSuccess(result.data.message || "Mobile verified successfully.");
      await signOut(verificationAuth);
      try {
        phoneVerifier?.clear();
      } catch {}
      setPhoneVerifier(null);
    } catch (verificationError: any) {
      setVerificationError(verificationError?.message || "Could not verify mobile OTP.");
    } finally {
      setPhoneOtpVerifying(false);
    }
  }

  function openVerificationDialog(kind: "email" | "phone") {
    setError("");
    setSuccess("");
    setVerificationError("");
    setVerificationNotice("");
    setVerificationModal(kind);
  }

  async function handleComplete() {
    setSaving(true); setError(""); setSuccess("");
    const result = await authedRequest<OnboardingResponse>("/api/auth/onboarding/complete", {
      method: "POST", body: JSON.stringify({ payload: form }),
    });
    setSaving(false);
    if (!result.ok || !result.data.success) { setError(apiErrorMessage("Could not complete onboarding.", result.data)); return; }
    setStarted(true); setCurrentStep(8);
    setForm((current) => ({ ...current, ...(result.data.profile || {}), setup_completed: true }));
    setPersonalization(result.data.personalization || null);
    setSuccess(result.data.message || "Setup completed.");
  }

  async function handleSkip() {
    setSaving(true); setError(""); setSuccess("");
    const result = await authedRequest<OnboardingResponse>("/api/auth/onboarding/skip", { method: "POST" });
    setSaving(false);
    if (!result.ok || !result.data.success) { setError(apiErrorMessage("Could not skip setup right now.", result.data)); return; }
    setStarted(true);
    setForm((current) => ({ ...current, ...(result.data.profile || {}), setup_skipped: true }));
    setSuccess(result.data.message || "Setup skipped.");
    navigateTo("/dashboard");
  }

  function skipCurrentStep() {
    if (currentStep <= 1 || currentStep >= 8) return;
    setError("");
    setSuccess("Current step skipped. You can complete it later.");
    setCurrentStep((step) => Math.min(step + 1, 8));
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData(); body.append("file", file); body.append("folder", "branding/logos");
    setUploading(true); setError("");
    const result = await authedRequest<{ file_path?: string; public_url?: string; message?: string; success?: boolean }>("/api/files/upload", { method: "POST", body });
    setUploading(false); event.target.value = "";
    if (!result.ok || !result.data.success) { setError(apiErrorMessage("Logo upload failed.", result.data)); return; }
    setValue("logo_path", result.data.file_path || ""); setValue("logo_url", result.data.public_url || "");
    setSuccess("Logo uploaded successfully.");
  }

  function renderPills(items: string[], activeValue: string | undefined, onPick: (value: string) => void, gridClassName?: string) {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", gridClassName)}>
        {items.map((item) => (
          <button
            key={item} type="button" onClick={() => onPick(item)}
            className={cn(
              "flex items-center justify-center p-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 text-center",
              activeValue === item 
                ? "border-primary bg-primary/10 text-primary shadow-sm" 
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Preparing your setup wizard...</p>
        </div>
      </div>
    );
  }

  const currentStepHelp = stepHelp[currentStep - 1] || stepHelp[0];

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden">
      
      {/* LEFT PANE - Hero & Context */}
      <div className="hidden lg:flex flex-col w-[360px] xl:w-[420px] bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white flex-shrink-0 relative overflow-hidden">
        {/* Abstract graphics */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[10%] left-[-20%] w-80 h-80 bg-white rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Hexagon className="w-6 h-6 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SaaSzo</span>
          </div>

          <div className="mt-auto mb-auto">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">
              {currentStep === 8 ? "You're all set!" : "Let's set up your business."}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-3">
              {currentStepHelp.title}
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {currentStepHelp.description}
            </p>

            <div className="flex flex-col gap-4">
              {currentStepHelp.highlights.map((item) => (
              <div key={item} className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-bold">Why this matters</div>
                  <div className="text-xs text-white/70">{item}</div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Form & Wizard */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 md:px-8 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="font-bold text-slate-900">SaaSzo</span>
          </div>
          
          <div className="hidden lg:flex flex-1 items-center gap-2 max-w-2xl mx-auto px-4">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                  currentStep > idx + 1 ? "bg-green-500 text-white" :
                  currentStep === idx + 1 ? "bg-primary text-white ring-4 ring-primary/20" : "bg-slate-200 text-slate-500"
                )}>
                  {currentStep > idx + 1 ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                {idx < stepLabels.length - 1 && (
                  <div className={cn("flex-1 h-1 rounded-full", currentStep > idx + 1 ? "bg-green-500" : "bg-slate-200")} />
                )}
              </div>
            ))}
          </div>

          <div className="w-24" />
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-visible p-4 md:px-8 md:py-5">
          <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
            
            {/* Error/Success Messages */}
            {(error || success) && (
              <div className={cn(
                "p-4 rounded-xl mb-8 font-medium text-sm flex items-start gap-3",
                error ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
              )}>
                {error || success}
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-visible">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{stepLabels[currentStep - 1]}</h2>
              <p className="text-slate-500 mb-5 font-medium text-base">Please provide the necessary details below.</p>

              {currentStep === 1 && (
                <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <Label className="text-slate-700">Owner Name <span className="text-red-500">*</span></Label>
                    <Input className="h-12 bg-white" value={form.owner_name || ""} placeholder="Pankaj Kumar" maxLength={255} onChange={e => handleLetterField("owner_name", e.target.value, 255)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Business Name <span className="text-red-500">*</span></Label>
                    <Input className="h-12 bg-white" value={form.business_name || ""} placeholder="SaaSzo Digital" maxLength={255} onChange={e => handleTextField("business_name", e.target.value, 255)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Email Address <span className="text-red-500">*</span></Label>
                    <Input className="h-12 bg-white" type="email" inputMode="email" autoCapitalize="none" value={form.email || ""} placeholder="name@business.com" maxLength={255} readOnly={emailVerified} onChange={e => setValue("email", sanitizeEmail(e.target.value) as OnboardingProfile["email"])} />
                    <p className={cn("text-xs", emailVerified ? "text-emerald-600" : "text-amber-600")}>{emailVerificationLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">Mobile Number <span className="text-red-500">*</span></Label>
                    <Input className="h-12 bg-white" type="tel" inputMode="numeric" value={form.phone || ""} placeholder="+919876543210" maxLength={13} readOnly={phoneVerified} onChange={e => setValue("phone", sanitizeIndianPhone(e.target.value) as OnboardingProfile["phone"])} />
                    <p className={cn("text-xs", phoneVerified ? "text-emerald-600" : "text-amber-600")}>{phoneVerificationLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">State <span className="text-red-500">*</span></Label>
                    <SearchableSelect
                      options={stateOptions}
                      value={form.state || ""}
                      onChange={(val) => setValue("state", val)}
                      emptyMessage={locationsLoading ? "Loading states..." : "No states found."}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">City <span className="text-red-500">*</span></Label>
                    <Input className="h-12 bg-white" value={form.city || ""} placeholder="Enter city name" maxLength={120} onChange={e => handleLetterField("city", e.target.value, 120)} />
                  </div>
                  <div className="col-span-full space-y-3 mt-4">
                    <Label className="text-slate-700">Who are you? <span className="text-red-500">*</span></Label>
                    {renderPills(options.user_types, form.user_type, val => setValue("user_type", val), "lg:grid-cols-4")}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                  <div id="onboarding-phone-recaptcha" className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0" />

                  <div className="grid xl:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => !emailVerified && openVerificationDialog("email")}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all shadow-sm",
                        emailVerified
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-red-200 bg-red-50 hover:border-red-300",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            emailVerified ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600",
                          )}>
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Email</div>
                            <div className={cn("text-xs font-medium", emailVerified ? "text-emerald-700" : "text-red-700")}>
                              {emailVerified ? "Verified" : "Verify now"}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className={cn("h-5 w-5", emailVerified ? "text-emerald-500" : "text-red-500")} />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => !phoneVerified && openVerificationDialog("phone")}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all shadow-sm",
                        phoneVerified
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-red-200 bg-red-50 hover:border-red-300",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl",
                            phoneVerified ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600",
                          )}>
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">Mobile</div>
                            <div className={cn("text-xs font-medium", phoneVerified ? "text-emerald-700" : "text-red-700")}>
                              {phoneVerified ? "Verified" : "Verify now"}
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className={cn("h-5 w-5", phoneVerified ? "text-emerald-500" : "text-red-500")} />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">What describes your business best? <span className="text-red-500">*</span></Label>
                    <SearchableSelect
                      placeholder="Select business category..."
                      options={businessCategoryOptions}
                      value={form.business_category || ""}
                      onChange={(val) => setValue("business_category", val)}
                      emptyMessage="No category found."
                    />
                  </div>
                  {form.business_category === "Other" && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95">
                      <Label className="text-slate-700">Specify Category</Label>
                      <Input className="h-12 bg-white" value={form.other_business_category || ""} placeholder="E.g. Event Management" maxLength={255} onChange={e => handleTextField("other_business_category", e.target.value, 255)} />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[calc(100dvh-220px)] pr-2">
                  <div className="space-y-3">
                    <Label className="text-slate-700">Team Size <span className="text-red-500">*</span></Label>
                    {renderPills(options.team_sizes, form.team_size, val => setValue("team_size", val))}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-slate-700">Monthly Invoice Volume <span className="text-red-500">*</span></Label>
                    {renderPills(options.monthly_invoice_volumes, form.monthly_invoice_volume, val => setValue("monthly_invoice_volume", val))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[calc(100dvh-220px)] pr-2">
                  <div className="space-y-3">
                    <Label className="text-slate-700">Are you GST Registered? <span className="text-red-500">*</span></Label>
                    {renderPills(options.gst_registered_options, form.gst_registered, val => {
                      setValue("gst_registered", val);
                      setValue("registration_types", syncGstRegistrationType(form.registration_types, val));
                    })}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Business / Legal Entity Type</Label>
                    {renderPills(options.legal_entity_type_options, form.legal_entity_type, val => setValue("legal_entity_type", val))}
                    <p className="text-xs text-slate-500">Select NGO, Trust, Society, Section 8, LLP, company, proprietorship, ya jo bhi aapke business ka legal structure hai.</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Registrations You Have (Select multiple)</Label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {options.registration_type_options.map(opt => (
                        <label key={opt} className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                          (form.registration_types || []).includes(opt) ? "bg-primary/5 border-primary text-primary font-medium" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                          <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                            checked={(form.registration_types || []).includes(opt)}
                            onChange={() => setValue("registration_types", toggleArrayValue(form.registration_types, opt))}
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {form.gst_registered === "Yes" && (
                    <Card className="p-6 bg-white border-slate-200 shadow-sm animate-in fade-in zoom-in-95 grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>GST Number <span className="text-red-500">*</span></Label>
                        <Input className="h-11 bg-slate-50 uppercase tracking-wide" value={form.gst_number || ""} placeholder="22AAAAA0000A1Z5" onChange={e => handleGstinChange(e.target.value)} maxLength={15} inputMode="text" autoCapitalize="characters" />
                        <p className={cn("text-xs", gstNumberNormalized && !GSTIN_REGEX.test(gstNumberNormalized) ? "text-red-500" : "text-slate-500")}>
                          {gstFormatMessage}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Legal Business Name <span className="text-red-500">*</span></Label>
                        <Input className="h-11 bg-slate-50" value={form.legal_business_name || ""} placeholder="Legal Entity Name" maxLength={255} onChange={e => handleTextField("legal_business_name", e.target.value, 255)} />
                      </div>
                      <div className="space-y-2">
                        <Label>GST State <span className="text-red-500">*</span></Label>
                        <SearchableSelect
                          options={states.map((s) => ({ label: s.label, value: s.state_name }))}
                          value={form.gst_state || ""}
                          onChange={(val) => setValue("gst_state", val)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GST Type <span className="text-red-500">*</span></Label>
                        {renderPills(options.gst_type_options, form.gst_type, val => setValue("gst_type", val))}
                      </div>
                    </Card>
                  )}

                  <Card className="p-6 bg-white border-slate-200 shadow-sm grid sm:grid-cols-2 gap-6">
                    {(form.registration_types || []).includes("PAN") && (
                      <div className="space-y-2">
                        <Label>PAN Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.pan_number || ""} placeholder="ABCDE1234F" maxLength={10} onChange={e => handleAlphaNumericField("pan_number", e.target.value, 10)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("CIN") && (
                      <div className="space-y-2">
                        <Label>CIN Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.cin_number || ""} placeholder="U12345DL2020PTC123456" maxLength={50} onChange={e => handleAlphaNumericField("cin_number", e.target.value, 50)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("LLPIN") && (
                      <div className="space-y-2">
                        <Label>LLPIN Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.llpin_number || ""} placeholder="ABC-1234" maxLength={50} onChange={e => handleAlphaNumericField("llpin_number", e.target.value, 50)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("TAN") && (
                      <div className="space-y-2">
                        <Label>TAN Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.tan_number || ""} placeholder="DELA12345B" maxLength={10} onChange={e => handleAlphaNumericField("tan_number", e.target.value, 10)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("MSME / Udyam Registration") && (
                      <div className="space-y-2">
                        <Label>Udyam Registration Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.udyam_registration_number || ""} placeholder="UDYAM-XX-00-0000000" maxLength={80} onChange={e => handleAlphaNumericField("udyam_registration_number", e.target.value, 80)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("Udyog Aadhaar (Legacy UAM)") && (
                      <div className="space-y-2">
                        <Label>Udyog Aadhaar / UAM Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.udyog_aadhaar_number || ""} placeholder="Legacy UAM number" maxLength={80} onChange={e => handleAlphaNumericField("udyog_aadhaar_number", e.target.value, 80)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("NGO Darpan") && (
                      <div className="space-y-2">
                        <Label>NGO Darpan ID</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.ngo_darpan_id || ""} placeholder="NITI Aayog Darpan ID" maxLength={80} onChange={e => handleAlphaNumericField("ngo_darpan_id", e.target.value, 80)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("Trust Registration") && (
                      <div className="space-y-2">
                        <Label>Trust Registration Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.trust_registration_number || ""} placeholder="Trust deed / registration no." maxLength={120} onChange={e => handleAlphaNumericField("trust_registration_number", e.target.value, 120)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("Society Registration") && (
                      <div className="space-y-2">
                        <Label>Society Registration Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.society_registration_number || ""} placeholder="Society registration no." maxLength={120} onChange={e => handleAlphaNumericField("society_registration_number", e.target.value, 120)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("FSSAI") && (
                      <div className="space-y-2">
                        <Label>FSSAI Number</Label>
                        <Input className="h-11 bg-slate-50" inputMode="numeric" value={form.fssai_number || ""} placeholder="Food license no." maxLength={14} onChange={e => handleDigitsField("fssai_number", e.target.value, 14)} />
                      </div>
                    )}
                    {(form.registration_types || []).includes("Import Export Code (IEC)") && (
                      <div className="space-y-2">
                        <Label>IEC Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.iec_number || ""} placeholder="Import Export Code" maxLength={10} onChange={e => handleAlphaNumericField("iec_number", e.target.value, 10)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).includes("Professional Tax") && (
                      <div className="space-y-2">
                        <Label>Professional Tax Number</Label>
                        <Input className="h-11 bg-slate-50 uppercase" value={form.professional_tax_number || ""} placeholder="State professional tax no." maxLength={80} onChange={e => handleAlphaNumericField("professional_tax_number", e.target.value, 80)} autoCapitalize="characters" />
                      </div>
                    )}
                    {(form.registration_types || []).length === 0 && (
                      <p className="sm:col-span-2 text-sm text-slate-500">Agar abhi registration details nahi hain to blank chhod sakte hain. Baad mein settings se update ho jayega.</p>
                    )}
                  </Card>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[calc(100dvh-220px)] pr-2">
                  <div className="space-y-3">
                    <Label className="text-slate-700">Invoice Item Type <span className="text-red-500">*</span></Label>
                    {renderPills(options.invoice_item_types, form.invoice_item_type, val => setValue("invoice_item_type", val))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700">Need Inventory? <span className="text-red-500">*</span></Label>
                      {renderPills(options.yes_no_future_options, form.needs_inventory, val => setValue("needs_inventory", val))}
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-700">Need Payment Tracking? <span className="text-red-500">*</span></Label>
                      {renderPills(options.yes_no_options, form.needs_payment_tracking, val => setValue("needs_payment_tracking", val))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Branch Model <span className="text-red-500">*</span></Label>
                    {renderPills(options.branch_model_options, form.branch_model, val => setValue("branch_model", val))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Required Reports (Select multiple)</Label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {options.required_report_options.map(opt => (
                        <label key={opt} className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                          (form.required_reports || []).includes(opt) ? "bg-primary/5 border-primary text-primary font-medium" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                          <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                            checked={(form.required_reports || []).includes(opt)}
                            onChange={() => setValue("required_reports", toggleArrayValue(form.required_reports, opt))}
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[calc(100dvh-220px)] pr-2">
                  <div className="space-y-3">
                    <Label className="text-slate-700">Payment Methods Accepted <span className="text-red-500">*</span></Label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {options.payment_method_options.map(opt => (
                        <label key={opt} className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                          (form.payment_methods || []).includes(opt) ? "bg-primary/5 border-primary text-primary font-medium" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                          <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                            checked={(form.payment_methods || []).includes(opt)}
                            onChange={() => setValue("payment_methods", toggleArrayValue(form.payment_methods, opt))}
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Accept UPI Payments?</Label>
                    {renderPills(options.yes_no_later_options, form.wants_upi_qr, val => setValue("wants_upi_qr", val))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700">UPI ID</Label>
                      <Input className="h-12 bg-white" inputMode="email" autoCapitalize="none" value={form.upi_id || ""} placeholder="business@okbank" maxLength={255} onChange={e => setValue("upi_id", sanitizeUpiId(e.target.value) as OnboardingProfile["upi_id"])} />
                    </div>
                  </div>

                  <Card className="p-6 bg-white border-slate-200 shadow-sm">
                    <div className="mb-5">
                      <h3 className="text-lg font-bold text-slate-900">Bank Details</h3>
                      <p className="text-sm text-slate-500 mt-1">Invoice payment ke liye proper bank fields add karein. Jo fields optional hain unhe blank chhod sakte hain.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-700">Account Holder Name</Label>
                        <Input className="h-12 bg-slate-50" value={form.bank_account_holder_name || ""} placeholder="Business / account holder name" maxLength={255} onChange={e => handleTextField("bank_account_holder_name", e.target.value, 255)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Bank Name</Label>
                        {useCustomBank ? (
                          <div className="space-y-2">
                            <Input className="h-12 bg-slate-50" value={form.bank_name || ""} placeholder="Type bank name" maxLength={255} onChange={e => handleTextField("bank_name", e.target.value, 255)} />
                            <button
                              type="button"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => {
                                setUseCustomBank(false);
                                setValue("bank_name", "" as OnboardingProfile["bank_name"]);
                              }}
                            >
                              Select bank from dropdown
                            </button>
                          </div>
                        ) : (
                          <SearchableSelect
                            placeholder="Select bank..."
                            options={BANK_OPTIONS}
                            value={form.bank_name || ""}
                            onChange={handleBankSelect}
                            emptyMessage="No bank found. Choose Other bank."
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Account Number</Label>
                        <Input className="h-12 bg-slate-50" inputMode="numeric" value={form.bank_account_number || ""} placeholder="123456789012" maxLength={20} onChange={e => handleDigitsField("bank_account_number", e.target.value, 20)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">IFSC Code</Label>
                        <Input className="h-12 bg-slate-50 uppercase" value={form.bank_ifsc || ""} placeholder="HDFC0001234" maxLength={11} onChange={e => handleAlphaNumericField("bank_ifsc", e.target.value, 11)} autoCapitalize="characters" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">SWIFT Code</Label>
                        <Input className="h-12 bg-slate-50 uppercase" value={form.bank_swift_code || ""} placeholder="HDFCINBBXXX" maxLength={11} onChange={e => handleAlphaNumericField("bank_swift_code", e.target.value, 11)} autoCapitalize="characters" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">MICR Code</Label>
                        <Input className="h-12 bg-slate-50" inputMode="numeric" value={form.bank_micr_code || ""} placeholder="302240001" maxLength={9} onChange={e => handleDigitsField("bank_micr_code", e.target.value, 9)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Bank Branch</Label>
                        <Input className="h-12 bg-slate-50" value={form.bank_branch_name || ""} placeholder="Jaipur Main Branch" maxLength={255} onChange={e => handleTextField("bank_branch_name", e.target.value, 255)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700">Account Type</Label>
                        <Input className="h-12 bg-slate-50" value={form.bank_account_type || ""} placeholder="Current / Savings / OD" maxLength={50} onChange={e => handleTextField("bank_account_type", e.target.value, 50)} />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="text-slate-700">Other Bank Notes</Label>
                        <Input className="h-12 bg-slate-50" value={form.bank_notes || form.bank_details || ""} placeholder="Any extra payment instruction or old bank detail text" maxLength={500} onChange={e => { const value = sanitizeText(e.target.value, 500); setValue("bank_notes", value); setValue("bank_details", value); }} />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto max-h-[calc(100dvh-220px)] pr-2">
                  
                  <div className="space-y-4">
                    <Label className="text-slate-700">Brand Logo</Label>
                    <div className="flex items-center gap-6 p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:border-primary/50 transition-colors">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {form.logo_url ? (
                          <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <UploadCloud className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="logo-upload" className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer inline-block text-sm font-semibold hover:bg-primary/90">
                          {uploading ? "Uploading..." : "Choose File"}
                        </Label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                        <p className="text-xs text-slate-500">Square PNG or JPG recommended. Max 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Invoice Template <span className="text-red-500">*</span></Label>
                    {renderPills(options.template_options, form.invoice_template_preference, val => setValue("invoice_template_preference", val))}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Show on Invoice</Label>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {options.show_on_invoice_options.map(opt => (
                        <label key={opt} className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                          (form.show_on_invoice || []).includes(opt) ? "bg-primary/5 border-primary text-primary font-medium" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}>
                          <input type="checkbox" className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary"
                            checked={(form.show_on_invoice || []).includes(opt)}
                            onChange={() => setValue("show_on_invoice", toggleArrayValue(form.show_on_invoice, opt))}
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div className="space-y-8 animate-in zoom-in duration-500 flex flex-col items-center text-center py-12">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900">Your workspace is ready.</h2>
                  <p className="text-lg text-slate-500 mt-2 max-w-md">
                    {personalization?.headline || "We have configured SaaSzo specifically for your business operations."}
                  </p>
                  
                  <div className="w-full max-w-md mt-8 grid gap-4">
                    <Button size="lg" className="h-14 text-base w-full shadow-lg" onClick={() => navigateTo("/dashboard")}>
                      Enter Dashboard
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-12 w-full" onClick={() => navigateTo("/dashboard/invoices")}>Create Bill</Button>
                      <Button variant="outline" className="h-12 w-full" onClick={() => navigateTo("/dashboard/products")}>Add Products</Button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            {currentStep < 8 && (
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-200 shrink-0">
                <Button 
                  variant="ghost" 
                  className="text-slate-600 font-semibold"
                  onClick={() => setCurrentStep(s => Math.max(1, s - 1))} 
                  disabled={currentStep === 1 || saving}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                
                <div className="flex gap-3">
                  {currentStep > 1 && currentStep < 8 && currentStep !== 2 && (
                    <Button variant="outline" onClick={skipCurrentStep} disabled={saving}>
                      Skip this step
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => saveStep(currentStep, false)} disabled={saving}>
                    {saving ? "Saving..." : "Save Progress"}
                  </Button>
                  
                  {currentStep < 7 ? (
                    <Button onClick={() => saveStep(currentStep, true)} disabled={saving} className="px-8 shadow-md">
                      {saving ? "Saving..." : "Continue"} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={handleComplete} disabled={saving} className="px-8 shadow-md bg-green-600 hover:bg-green-700">
                      {saving ? "Completing..." : "Complete Setup"} <CheckCircle2 className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {verificationModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {verificationModal === "email" ? "Verify email" : "Verify mobile"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {verificationModal === "email"
                    ? "Send an OTP to your email and confirm it here."
                    : "Send an OTP to your mobile number and confirm it here."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVerificationModal(null)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {verificationError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {verificationError}
              </div>
            )}

            {verificationNotice && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {verificationNotice}
              </div>
            )}

            {verificationModal === "email" ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {form.email || "No email added"}
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={sendEmailVerificationOtp} disabled={emailOtpSending || emailOtpVerifying || emailResendTimer > 0} className="flex-1">
                    {emailOtpSending ? "Sending..." : emailResendTimer > 0 ? `Resend in ${emailResendTimer}s` : emailOtpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    className="h-11 bg-white"
                    value={emailOtp}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    inputMode="numeric"
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                  <Button type="button" variant="outline" onClick={verifyEmailVerificationOtp} disabled={emailOtpVerifying || emailOtp.length !== 4}>
                    {emailOtpVerifying ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {form.phone || "No mobile number added"}
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={sendPhoneVerificationOtp} disabled={phoneOtpSending || phoneOtpVerifying || phoneResendTimer > 0} className="flex-1">
                    {phoneOtpSending ? "Sending..." : phoneResendTimer > 0 ? `Resend in ${phoneResendTimer}s` : phoneOtpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    className="h-11 bg-white"
                    value={phoneOtp}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <Button type="button" variant="outline" onClick={verifyPhoneVerificationOtp} disabled={phoneOtpVerifying || phoneOtp.length !== 6 || !phoneOtpSent}>
                    {phoneOtpVerifying ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
