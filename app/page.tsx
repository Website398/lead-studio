"use client";

import { FormEvent, useState } from "react";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { db } from "../lib/firebase";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [need, setNeed] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const cleanName = name.trim();
    const cleanBusiness = business.trim();
    const cleanNeed = need.trim().slice(0, 500);
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (!cleanName) {
      setMessage("Please enter your name.");
      setMessageType("error");
      return;
    }

    if (cleanPhone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number.");
      setMessageType("error");
      return;
    }

    if (!cleanBusiness) {
      setMessage("Please enter your business name.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const leadRef = push(ref(db, "leads"));

      await set(leadRef, {
        name: cleanName,
        phone: cleanPhone,
        business: cleanBusiness,
        need: cleanNeed,
        source: "lead-page",
        createdAt: serverTimestamp(),
      });

      setName("");
      setPhone("");
      setBusiness("");
      setNeed("");

      setMessage(
        "Your request has been submitted successfully."
      );
      setMessageType("success");
    } catch (error) {
      console.error("Firebase error:", error);

      setMessage(
        "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">✦</div>
          LeadStudio
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#process">How it works</a>
        </div>

        <a
          href="#contact"
          className="nav-button"
        >
          Submit Request
        </a>
      </nav>

      {/* HERO */}

      <section className="hero" id="home">
        <div className="hero-content">

          <div className="top-pill">
            <span className="live-dot" />
            Professional websites for growing businesses
          </div>

          <h1>
            Turn your business
            <br />
            into a{" "}
            <span className="gradient-text">
              professional
            </span>
            <br />
            website.
          </h1>

          <p className="hero-description">
            Get a modern, mobile-friendly website designed
            for your business — starting at just ₹3000.
            Simple, professional and built to help you
            look trustworthy online.
          </p>

          <div className="hero-checks">
            <div>
              <span>✓</span>
              Modern & clean design
            </div>

            <div>
              <span>✓</span>
              Mobile responsive
            </div>

            <div>
              <span>✓</span>
              Fast loading
            </div>

            <div>
              <span>✓</span>
              Professional appearance
            </div>
          </div>

          <div className="price-card">
            <div>
              <small>WEBSITE STARTING AT</small>

              <strong>₹3000</strong>
            </div>

            <a href="#contact">
              Submit Request
              <b>→</b>
            </a>
          </div>

          <div className="mini-trust">
            <div className="trust-icon">
              ✓
            </div>

            <div>
              <strong>
                Simple & transparent
              </strong>

              <span>
                No complicated packages
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div
          className="form-wrapper"
          id="contact"
        >
          <div className="form-glow" />

          <div className="form-card">

            <div className="form-top">
              <div className="form-icon">
                ✦
              </div>

              <div>
                <span className="form-label">
                  GET STARTED
                </span>

                <h2>
                  Tell us about your business.
                </h2>
              </div>

              <div className="secure-badge">
                <span>✓</span>
                Secure
              </div>
            </div>

            <p className="form-intro">
              Fill out this short form and
              tell us what kind of website
              you need.
            </p>

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="field">
                <label htmlFor="name">
                  Your name
                  <span>*</span>
                </label>

                <div className="input-wrap">
                  <span className="input-icon">
                    ◯
                  </span>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. Rahul Sharma"
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="field">
                <label htmlFor="phone">
                  Phone number
                  <span>*</span>
                </label>

                <div className="input-wrap">
                  <span className="country-code">
                    +91
                  </span>

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              {/* BUSINESS */}

              <div className="field">
                <label htmlFor="business">
                  Your business
                  <span>*</span>
                </label>

                <div className="input-wrap">
                  <span className="input-icon">
                    ▣
                  </span>

                  <input
                    id="business"
                    type="text"
                    value={business}
                    onChange={(event) =>
                      setBusiness(event.target.value)
                    }
                    placeholder="e.g. Salon, Coaching, Clothing..."
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              {/* REQUIREMENT */}

              <div className="field">
                <div className="label-row">
                  <label htmlFor="need">
                    What do you need?
                  </label>

                  <span>
                    {need.length}/500
                  </span>
                </div>

                <textarea
                  id="need"
                  value={need}
                  onChange={(event) =>
                    setNeed(event.target.value)
                  }
                  maxLength={500}
                  placeholder="Tell us about your website requirements..."
                  rows={4}
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="main-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <span className="submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>

              {/* MESSAGE */}

              {message && (
                <div
                  className={`form-message ${messageType}`}
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}

              <div className="privacy-note">
                <span>🔒</span>

                <p>
                  Your information is kept private
                  and used only to discuss your
                  website requirements.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}

      <section className="trust-bar">

        <div className="trust-box">
          <div className="trust-round">
            ✓
          </div>

          <div>
            <strong>
              Professional design
            </strong>

            <span>
              Built for your business
            </span>
          </div>
        </div>

        <div className="trust-divider" />

        <div className="trust-box">
          <div className="trust-round">
            ⚡
          </div>

          <div>
            <strong>
              Fast & responsive
            </strong>

            <span>
              Works on every device
            </span>
          </div>
        </div>

        <div className="trust-divider" />

        <div className="trust-box">
          <div className="trust-round">
            ◇
          </div>

          <div>
            <strong>
              Modern technology
            </strong>

            <span>
              Clean & reliable
            </span>
          </div>
        </div>

        <div className="trust-divider" />

        <div className="trust-box">
          <div className="trust-round">
            ₹
          </div>

          <div>
            <strong>
              Starting at ₹3000
            </strong>

            <span>
              Simple pricing
            </span>
          </div>
        </div>

      </section>

      {/* FEATURES */}

      <section
        className="features-section"
        id="features"
      >
        <div className="section-heading">

          <span className="section-pill">
            WHAT YOU GET
          </span>

          <h2>
            Everything you need to
            <br />
            <span>
              look professional online.
            </span>
          </h2>

          <p>
            We keep things simple. You tell us
            what your business needs, and we
            build a website around it.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon blue">
              ✦
            </div>

            <h3>
              Modern Design
            </h3>

            <p>
              A clean and premium design that
              makes your business look
              professional and trustworthy.
            </p>

            <div className="feature-number">
              01
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              ◫
            </div>

            <h3>
              Mobile Responsive
            </h3>

            <p>
              Your website will look great on
              phones, tablets and desktop screens.
            </p>

            <div className="feature-number">
              02
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">
              ⚡
            </div>

            <h3>
              Fast Loading
            </h3>

            <p>
              Lightweight pages designed to load
              quickly and give visitors a smooth
              experience.
            </p>

            <div className="feature-number">
              03
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">
              ◉
            </div>

            <h3>
              Clear Information
            </h3>

            <p>
              Present your services, business
              details and important information
              clearly.
            </p>

            <div className="feature-number">
              04
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon pink">
              ◎
            </div>

            <h3>
              Your Content
            </h3>

            <p>
              Your business name, services,
              images, information and contact
              details.
            </p>

            <div className="feature-number">
              05
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon cyan">
              ✓
            </div>

            <h3>
              Simple Process
            </h3>

            <p>
              No complicated technical process.
              Just tell us what you need and
              we'll guide you.
            </p>

            <div className="feature-number">
              06
            </div>
          </div>

        </div>
      </section>

      {/* PROCESS */}

      <section
        className="process-section"
        id="process"
      >
        <div className="process-inner">

          <div className="process-heading">

            <span className="section-pill dark-pill">
              HOW IT WORKS
            </span>

            <h2>
              From idea to website
              <br />
              <span>
                in a few simple steps.
              </span>
            </h2>

          </div>

          <div className="process-grid">

            <div className="process-item">
              <div className="process-number">
                01
              </div>

              <h3>
                Submit your request
              </h3>

              <p>
                Fill out the short form with
                your business details and
                requirements.
              </p>
            </div>

            <div className="process-line" />

            <div className="process-item">
              <div className="process-number">
                02
              </div>

              <h3>
                Discuss your requirements
              </h3>

              <p>
                We'll review your request and
                understand exactly what you want.
              </p>
            </div>

            <div className="process-line" />

            <div className="process-item">
              <div className="process-number">
                03
              </div>

              <h3>
                Get your website
              </h3>

              <p>
                We build your website and make
                it ready for your customers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="final-cta">

        <div className="cta-glow" />

        <div className="cta-content">

          <span className="section-pill">
            READY TO START?
          </span>

          <h2>
            Give your business
            <br />
            a professional home online.
          </h2>

          <p>
            Tell us what you need and we'll
            get back to you.
          </p>

          <a
            href="#contact"
            className="cta-button"
          >
            Submit Your Request
            <b>→</b>
          </a>

          <small>
            Websites starting from ₹3000
          </small>

        </div>
      </section>

      {/* FOOTER */}

      <footer>

        <div className="footer-top">

          <div className="footer-brand">

            <div className="logo">
              <div className="logo-icon">
                ✦
              </div>

              LeadStudio
            </div>

            <p>
              Simple websites.
              <br />
              Professional presence.
            </p>

          </div>

          <div className="footer-links">
            <a href="#home">
              Home
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#process">
              How it works
            </a>
          </div>

          <a
            href="#contact"
            className="footer-submit"
          >
            Submit Request →
          </a>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 LeadStudio. All rights reserved.
          </span>

          <span>
            Built for growing businesses.
          </span>

        </div>

      </footer>
    </main>
  );
}