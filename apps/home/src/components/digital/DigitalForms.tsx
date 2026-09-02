"use client";

import { type FormEvent, useState } from "react";
import { digitalApiUrl } from "@/lib/digital-marketing";

type FormState = {
  busy: boolean;
  message: string;
  error: string;
};

const initialState: FormState = { busy: false, message: "", error: "" };

async function submitJson(path: string, payload: Record<string, unknown>) {
  const response = await fetch(digitalApiUrl(path), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
}

export function ContactForm({ source = "/contact" }: { source?: string }) {
  const [state, setState] = useState(initialState);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState({ busy: true, message: "", error: "" });

    try {
      await submitJson("/api/digital/leads/contact", {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        business_name: form.get("business_name"),
        service_interested: form.get("service_interested"),
        message: form.get("message"),
        source_url: source,
      });

      event.currentTarget.reset();
      setState({
        busy: false,
        message: "Message submitted. Our team will contact you.",
        error: "",
      });
    } catch (error) {
      setState({
        busy: false,
        message: "",
        error: error instanceof Error ? error.message : "Submission failed.",
      });
    }
  }

  return (
    <form className="digital-form" onSubmit={onSubmit}>
      <div className="digital-form-grid">
        <label>
          <span>Name</span>
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" placeholder="+91 98765 43210" />
        </label>
        <label>
          <span>Business</span>
          <input name="business_name" placeholder="Company name" />
        </label>
      </div>
      <label>
        <span>Service</span>
        <select name="service_interested" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option value="Lead Generation Ads">Lead Generation Ads</option>
          <option value="Local SEO and GMB">Local SEO and GMB</option>
          <option value="PPC Management">PPC Management</option>
          <option value="Website Design">Website Design</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" placeholder="Tell us what you want to grow." />
      </label>
      <button className="digital-primary" disabled={state.busy} type="submit">
        {state.busy ? "Sending..." : "Send Message"}
      </button>
      {state.message ? (
        <p className="digital-success">{state.message}</p>
      ) : null}
      {state.error ? <p className="digital-error">{state.error}</p> : null}
    </form>
  );
}

export function AuditForm() {
  const [state, setState] = useState(initialState);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState({ busy: true, message: "", error: "" });

    try {
      await submitJson("/api/digital/audits", {
        website_url: form.get("website_url"),
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        location: form.get("location"),
      });

      event.currentTarget.reset();
      setState({ busy: false, message: "Audit request submitted.", error: "" });
    } catch (error) {
      setState({
        busy: false,
        message: "",
        error: error instanceof Error ? error.message : "Submission failed.",
      });
    }
  }

  return (
    <form className="digital-form" onSubmit={onSubmit}>
      <label>
        <span>Website URL</span>
        <input
          name="website_url"
          required
          type="url"
          placeholder="https://example.com"
        />
      </label>
      <div className="digital-form-grid">
        <label>
          <span>Name</span>
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            required
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" placeholder="+91 98765 43210" />
        </label>
        <label>
          <span>Location</span>
          <input name="location" placeholder="City" />
        </label>
      </div>
      <button className="digital-primary" disabled={state.busy} type="submit">
        {state.busy ? "Submitting..." : "Request Free Audit"}
      </button>
      {state.message ? (
        <p className="digital-success">{state.message}</p>
      ) : null}
      {state.error ? <p className="digital-error">{state.error}</p> : null}
    </form>
  );
}

export function JobApplicationForm({ jobId }: { jobId: number }) {
  const [state, setState] = useState(initialState);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState({ busy: true, message: "", error: "" });

    try {
      await submitJson(`/api/digital/jobs/${jobId}/applications`, {
        full_name: form.get("full_name"),
        email: form.get("email"),
        phone_number: form.get("phone_number"),
        linkedin_profile_url: form.get("linkedin_profile_url") || null,
        portfolio_url: form.get("portfolio_url") || null,
        total_experience: form.get("total_experience"),
        skills: form.get("skills"),
        cover_letter: form.get("cover_letter"),
        source_of_application: "saaszo.in",
      });

      event.currentTarget.reset();
      setState({ busy: false, message: "Application submitted.", error: "" });
    } catch (error) {
      setState({
        busy: false,
        message: "",
        error: error instanceof Error ? error.message : "Submission failed.",
      });
    }
  }

  return (
    <form className="digital-form" onSubmit={onSubmit}>
      <div className="digital-form-grid">
        <label>
          <span>Full name</span>
          <input name="full_name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" required type="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone_number" />
        </label>
        <label>
          <span>Experience</span>
          <input name="total_experience" placeholder="2 years" />
        </label>
      </div>
      <label>
        <span>LinkedIn</span>
        <input name="linkedin_profile_url" type="url" />
      </label>
      <label>
        <span>Portfolio</span>
        <input name="portfolio_url" type="url" />
      </label>
      <label>
        <span>Skills</span>
        <textarea name="skills" />
      </label>
      <label>
        <span>Cover letter</span>
        <textarea name="cover_letter" />
      </label>
      <button className="digital-primary" disabled={state.busy} type="submit">
        {state.busy ? "Submitting..." : "Submit Application"}
      </button>
      {state.message ? (
        <p className="digital-success">{state.message}</p>
      ) : null}
      {state.error ? <p className="digital-error">{state.error}</p> : null}
    </form>
  );
}

export function InfluencerForm() {
  const [state, setState] = useState(initialState);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setState({ busy: true, message: "", error: "" });

    try {
      await submitJson("/api/digital/influencers/applications", {
        full_name: form.get("full_name"),
        email: form.get("email"),
        phone_number: form.get("phone_number"),
        whatsapp_number: form.get("whatsapp_number"),
        city: form.get("city"),
        country: form.get("country"),
        primary_platform: form.get("primary_platform"),
        instagram_profile_url: form.get("instagram_profile_url") || null,
        youtube_channel_url: form.get("youtube_channel_url") || null,
        linkedin_profile_url: form.get("linkedin_profile_url") || null,
        content_niche: form.get("content_niche"),
        content_style_description: form.get("content_style_description"),
        campaign_type: form.get("campaign_type"),
      });

      event.currentTarget.reset();
      setState({
        busy: false,
        message: "Creator application submitted.",
        error: "",
      });
    } catch (error) {
      setState({
        busy: false,
        message: "",
        error: error instanceof Error ? error.message : "Submission failed.",
      });
    }
  }

  return (
    <form className="digital-form" onSubmit={onSubmit}>
      <div className="digital-form-grid">
        <label>
          <span>Full name</span>
          <input name="full_name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" required type="email" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone_number" />
        </label>
        <label>
          <span>WhatsApp</span>
          <input name="whatsapp_number" />
        </label>
        <label>
          <span>City</span>
          <input name="city" />
        </label>
        <label>
          <span>Country</span>
          <input name="country" defaultValue="India" />
        </label>
      </div>
      <label>
        <span>Main platform</span>
        <select name="primary_platform" defaultValue="">
          <option value="" disabled>
            Select platform
          </option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <div className="digital-form-grid">
        <label>
          <span>Instagram URL</span>
          <input name="instagram_profile_url" type="url" />
        </label>
        <label>
          <span>YouTube URL</span>
          <input name="youtube_channel_url" type="url" />
        </label>
      </div>
      <label>
        <span>Content niche</span>
        <input name="content_niche" />
      </label>
      <label>
        <span>Content style</span>
        <textarea name="content_style_description" />
      </label>
      <label>
        <span>Campaign type</span>
        <input name="campaign_type" />
      </label>
      <button className="digital-primary" disabled={state.busy} type="submit">
        {state.busy ? "Submitting..." : "Apply Now"}
      </button>
      {state.message ? (
        <p className="digital-success">{state.message}</p>
      ) : null}
      {state.error ? <p className="digital-error">{state.error}</p> : null}
    </form>
  );
}
