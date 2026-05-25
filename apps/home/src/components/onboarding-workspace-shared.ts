export const stepLabels = [
  "Basics",
  "Verify & Category",
  "Size",
  "GST",
  "Needs",
  "Payments",
  "Branding",
  "Done",
] as const;

export const stepHelp = [
  {
    title: "Set your business foundation",
    description:
      "These details become the foundation for your account, invoices, and branch identity.",
    highlights: [
      "Correct contact details are important for future login recovery and notifications.",
      "State and city details reduce billing, GST, and branch setup mismatches.",
    ],
  },
  {
    title: "Confirm your contacts and business type",
    description:
      "Review which contact details are already verified and choose the category that best matches your business.",
    highlights: [
      "Google sign-up usually verifies email first, while phone OTP sign-up verifies mobile first.",
      "Your business category helps personalize product defaults and reports.",
    ],
  },
  {
    title: "Match the product to your size",
    description:
      "Understanding your scale helps us tune the dashboard and workflows more accurately.",
    highlights: [
      "The right defaults make onboarding faster.",
      "Volume and team size affect reports and automation suggestions.",
    ],
  },
  {
    title: "Keep GST data clean",
    description:
      "Accurate GST details keep invoices cleaner and reduce compliance mistakes later.",
    highlights: [
      "A wrong GST state or GSTIN can create filing issues later.",
      "Format checks here reduce avoidable data errors early.",
    ],
  },
  {
    title: "Choose only what you need",
    description:
      "This step adjusts dashboard and feature visibility based on how you plan to use the product.",
    highlights: [
      "Your branch model keeps future branch creation simple.",
      "Only the most relevant reports and modules stay prominent.",
    ],
  },
  {
    title: "Set payment basics",
    description:
      "Payment details make your invoices and collection flow more trusted and complete.",
    highlights: [
      "Correct bank details improve customer trust.",
      "Bank dropdowns and IFSC format checks reduce manual errors.",
    ],
  },
  {
    title: "Finish branding",
    description:
      "Your logo and template make invoices feel professional, trusted, and recognizable.",
    highlights: [
      "Consistent branding improves trust in customer-facing documents.",
      "You can always update the logo and template later from settings.",
    ],
  },
  {
    title: "You're ready to go",
    description:
      "Once setup is complete, your dashboard and modules will be ready to use.",
    highlights: [
      "You can now start customer, product, and billing workflows.",
      "You can still update business details later from settings.",
    ],
  },
] as const;

export function extractFirebaseOtpErrorCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code.toLowerCase()
    : "";
}

export function getReadableFirebaseOtpError(error: unknown) {
  const code = extractFirebaseOtpErrorCode(error);
  const message = error instanceof Error ? error.message : String(error || "");
  const normalized = `${code} ${message}`.toLowerCase();

  if (normalized.includes("auth/invalid-verification-code")) {
    return "Incorrect OTP.";
  }

  if (normalized.includes("auth/code-expired")) {
    return "This OTP has expired. Please request a new one.";
  }

  if (normalized.includes("auth/session-expired")) {
    return "This OTP session has expired. Please request a new OTP.";
  }

  if (normalized.includes("auth/too-many-requests")) {
    return "Too many requests. Please wait a moment before trying again.";
  }

  if (normalized.includes("auth/missing-verification-code")) {
    return "Enter the OTP to continue.";
  }

  if (normalized.includes("auth/invalid-phone-number")) {
    return "Enter a valid mobile number in +91XXXXXXXXXX format.";
  }

  if (normalized.includes("auth/captcha-check-failed")) {
    return "Complete the reCAPTCHA again before sending OTP.";
  }

  if (
    normalized.includes("auth/recaptcha-not-enabled") ||
    normalized.includes("auth/missing-recaptcha-token") ||
    normalized.includes("auth/invalid-recaptcha-token") ||
    normalized.includes("auth/invalid-recaptcha-action") ||
    normalized.includes("auth/missing-recaptcha-version") ||
    normalized.includes("auth/invalid-recaptcha-version") ||
    normalized.includes("auth/missing-client-type")
  ) {
    return "Firebase reCAPTCHA protection is not configured correctly for phone OTP yet.";
  }

  if (
    normalized.includes("auth/invalid-app-credential") ||
    normalized.includes("auth/missing-app-credential")
  ) {
    return "Phone verification session expired. Complete the reCAPTCHA again and resend OTP.";
  }

  if (
    normalized.includes("auth/app-not-authorized") ||
    normalized.includes("auth/unauthorized-domain")
  ) {
    return "This website domain is not authorized for Firebase phone OTP yet.";
  }

  if (normalized.includes("auth/auth-domain-config-required")) {
    return "Firebase auth domain is missing from the website configuration.";
  }

  if (normalized.includes("auth/invalid-api-key")) {
    return "Firebase API key configuration is invalid for phone OTP.";
  }

  if (normalized.includes("auth/operation-not-allowed")) {
    return "Firebase phone OTP is not enabled right now.";
  }

  if (normalized.includes("auth/quota-exceeded")) {
    return "Daily OTP quota is exhausted right now. Please try again later.";
  }

  if (normalized.includes("auth/network-request-failed")) {
    return "Network issue while verifying OTP. Please try again.";
  }

  if (normalized.includes("configuration_not_found")) {
    return "Firebase phone OTP configuration is incomplete for this project.";
  }

  if (normalized.includes("billing_not_enabled")) {
    return "Firebase phone OTP billing is not enabled for this project.";
  }

  if (normalized.includes("requests from this domain are blocked")) {
    return "This website domain is blocked for Firebase phone OTP.";
  }

  if (code) {
    return `Could not verify mobile OTP. Firebase returned ${code}.`;
  }

  return "Could not verify mobile OTP.";
}

export const defaultOptions = {
  user_types: ["Individual", "Business Owner", "Company", "Freelancer"],
  business_categories: [
    "Freelancer",
    "Digital Marketing Agency",
    "Web Development / IT Services",
    "Retail Shop",
    "Wholesale Business",
    "Medical / Pharmacy",
    "Restaurant / Cafe",
    "Consultant",
    "Manufacturer",
    "Trader / Distributor",
    "Salon / Beauty",
    "Real Estate",
    "Other",
  ],
  team_sizes: ["Solo", "2-5", "6-10", "11-25", "25+"],
  monthly_invoice_volumes: ["1-10", "11-50", "51-100", "100+", "Just starting"],
  gst_registered_options: ["Yes", "No", "Not Sure", "Applying Soon"],
  gst_type_options: ["Regular", "Composition", "Not Sure"],
  legal_entity_type_options: [
    "Proprietorship",
    "Partnership Firm",
    "Limited Liability Partnership (LLP)",
    "Private Limited Company",
    "Public Limited Company",
    "One Person Company (OPC)",
    "HUF",
    "Cooperative Society",
    "Society",
    "Trust",
    "Section 8 / Non-Profit Company",
    "NGO / Voluntary Organization",
    "Non-Profit Organization",
    "Government Entity",
    "Other",
  ],
  registration_type_options: [
    "GST Registration",
    "MSME / Udyam Registration",
    "Udyog Aadhaar (Legacy UAM)",
    "CIN",
    "LLPIN",
    "PAN",
    "TAN",
    "NGO Darpan",
    "Trust Registration",
    "Society Registration",
    "FSSAI",
    "Import Export Code (IEC)",
    "Professional Tax",
  ],
  invoice_item_types: [
    "Products",
    "Services",
    "Both",
    "Subscription/Recurring",
    "Project Based",
  ],
  yes_no_future_options: ["Yes", "No", "Future"],
  yes_no_options: ["Yes", "No"],
  yes_no_later_options: ["Yes", "No", "Later"],
  required_report_options: [
    "Sales Report",
    "GST Report",
    "Pending Payments",
    "Customer Wise Sales",
    "Product Wise Sales",
    "Monthly Income",
    "Expense Report",
    "Inventory Report",
  ],
  payment_method_options: [
    "Cash",
    "UPI",
    "Bank Transfer",
    "Card",
    "Payment Gateway",
    "Cheque",
  ],
  template_options: [
    "Simple",
    "Professional",
    "GST Format",
    "Modern Branded",
    "Retail Bill Style",
    "Minimal Black & White",
  ],
  show_on_invoice_options: [
    "Logo",
    "GST Number",
    "Legal Business Name",
    "PAN Number",
    "CIN",
    "LLPIN",
    "TAN",
    "MSME / Udyam Registration",
    "Udyog Aadhaar",
    "NGO Darpan",
    "Trust Registration",
    "Society Registration",
    "FSSAI Number",
    "IEC Number",
    "Professional Tax",
    "Bank Details",
    "UPI ID",
    "Terms & Conditions",
    "Signature",
    "Seal",
    "Notes",
  ],
  branch_model_options: ["Single Branch", "Multi-Branch (Multiple Outlets)"],
};

export const defaultForm = {
  required_reports: [],
  payment_methods: [],
  show_on_invoice: [],
  registration_types: [],
  user_type: "Business Owner",
  gst_registered: "No",
  needs_inventory: "No",
  needs_quotation: "Yes",
  needs_payment_tracking: "Yes",
  needs_customer_records: "Yes",
  wants_upi_qr: "Later",
  invoice_template_preference: "Professional",
  branch_model: "Single Branch",
};
