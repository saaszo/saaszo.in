"use client";

import { useMemo, useState } from "react";
import { digitalApiUrl } from "@/lib/digital-marketing";

type ToolType = "certificate" | "letter" | "vcard" | "icard";

type ToolConfig = {
  title: string;
  description: string;
  submitLabel: string;
  fields: Array<{
    name: string;
    label: string;
    type?: "text" | "email" | "tel" | "date" | "url" | "textarea";
    required?: boolean;
    placeholder?: string;
  }>;
};

const toolConfigs: Record<ToolType, ToolConfig> = {
  certificate: {
    title: "Certificate Tool",
    description: "Generate a certificate document from the new SaaSzo API.",
    submitLabel: "Generate Certificate",
    fields: [
      { name: "title", label: "Certificate Title", required: true, placeholder: "Certificate of Appreciation" },
      { name: "name", label: "Recipient Name", required: true },
      { name: "body", label: "Certificate Text", type: "textarea", required: true },
      { name: "issuer", label: "Issued By", placeholder: "SaaSzo Digital" },
      { name: "date", label: "Date", type: "date" },
      { name: "filename", label: "File Name", placeholder: "certificate" },
    ],
  },
  letter: {
    title: "Letter Tool",
    description: "Create a downloadable letter through the migrated backend.",
    submitLabel: "Generate Letter",
    fields: [
      { name: "title", label: "Letter Title", required: true, placeholder: "Business Letter" },
      { name: "recipient", label: "Recipient Name", required: true },
      { name: "body", label: "Letter Body", type: "textarea", required: true },
      { name: "issuer", label: "Sender / Company", placeholder: "SaaSzo Digital" },
      { name: "date", label: "Date", type: "date" },
      { name: "filename", label: "File Name", placeholder: "letter" },
    ],
  },
  vcard: {
    title: "VCard Tool",
    description: "Build and download a contact file for phones and email apps.",
    submitLabel: "Download VCard",
    fields: [
      { name: "name", label: "Full Name", required: true },
      { name: "company", label: "Company" },
      { name: "title", label: "Designation" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      { name: "website", label: "Website", type: "url" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "filename", label: "File Name", placeholder: "contact" },
    ],
  },
  icard: {
    title: "ICard Tool",
    description: "Generate an ID card document using the new API system.",
    submitLabel: "Generate ICard",
    fields: [
      { name: "title", label: "Card Title", required: true, placeholder: "Employee ID Card" },
      { name: "name", label: "Name", required: true },
      { name: "body", label: "Details", type: "textarea", required: true, placeholder: "Employee ID, department, validity, address..." },
      { name: "issuer", label: "Company", placeholder: "SaaSzo Digital" },
      { name: "date", label: "Date", type: "date" },
      { name: "filename", label: "File Name", placeholder: "id-card" },
    ],
  },
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

function filenameFromDisposition(disposition: string | null, fallback: string) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

export function DigitalToolBuilder({ type }: { type: ToolType }) {
  const config = toolConfigs[type];
  const [form, setForm] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const endpoint = useMemo(() => digitalApiUrl(`/api/digital/tools/${type}`), [type]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Generating document...");
    setError("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(form),
    }).catch(() => null);

    if (!response?.ok) {
      const payload = await response?.json().catch(() => null);
      setStatus("");
      setError(payload?.message || "Tool document could not be generated.");
      return;
    }

    const blob = await response.blob();
    downloadBlob(blob, filenameFromDisposition(response.headers.get("Content-Disposition"), `${type}.html`));
    setStatus("Document generated.");
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <form className="digital-tool-panel" onSubmit={handleSubmit}>
        <div className="digital-tool-head">
          <div>
            <p className="section-kicker">SaaSzo Tool</p>
            <h2>{config.title}</h2>
            <span>{config.description}</span>
          </div>
          <a href="/tools">All Tools</a>
        </div>

        {error ? <p className="digital-tool-error">{error}</p> : null}
        {status ? <p className="digital-tool-status">{status}</p> : null}

        <div className="digital-tool-grid">
          {config.fields.map((field) => (
            <label className={field.type === "textarea" ? "digital-tool-field wide" : "digital-tool-field"} key={field.name}>
              <span>{field.label}{field.required ? " *" : ""}</span>
              {field.type === "textarea" ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={form[field.name] || ""}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              ) : (
                <input
                  required={field.required}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name] || ""}
                  onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                />
              )}
            </label>
          ))}
        </div>

        <button className="digital-primary" type="submit">
          {config.submitLabel}
          <span className="material-symbols-rounded text-base">download</span>
        </button>
      </form>
    </section>
  );
}

export function isDigitalToolType(value: string): value is ToolType {
  return ["certificate", "letter", "vcard", "icard"].includes(value);
}
