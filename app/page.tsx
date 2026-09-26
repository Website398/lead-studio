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
  const [messageType, setMessageType] = useState<"success" | "error" | "">(
    ""
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      setMessage("Your request has been submitted successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Firebase error:", error);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="site">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="nav-container">

          <a href="/" className="brand">
            LeadStudio
          </a>

          <a href="#request" className="nav-button">
            Get Started
          </a>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="container hero-grid">

          <div className="hero-content">

            <div className="eyebrow">
              Professional websites for growing businesses
            </div>

            <h1>
              Turn your business into a
              <span> professional website.</span>
            </h1>

            <p className="hero-description">
              Get a clean, modern and mobile-friendly website designed
              specifically for your business without spending a huge amount.
            </p>

            <div className="hero-actions">

              <a href="#request" className="primary-button">
                Start Your Website
              </a>

              <div className="price-text">
                Starting at <strong>₹3000</strong>
              </div>

            </div>

            <div className="trust-points">

              <div>
                <span>✓</span>
                Mobile Friendly
              </div>

              <div>
                <span>✓</span>
                Clean Design
              </div>

              <div>
                <span>✓</span>
                Fast Delivery
              </div>

            </div>

          </div>


          {/* HERO PRICE CARD */}

          <div className="hero-card">

            <div className="price-card">

              <div className="price-card-top">
                <div className="small-label">
                  WEBSITE PACKAGE
                </div>

                <h2>
                  Business Website
                </h2>

                <div className="price">
                  ₹3000
                  <small> starting</small>
                </div>
              </div>

              <div className="divider" />

              <div className="package-list">

                <div>
                  <span>✓</span>
                  Professional modern design
                </div>

                <div>
                  <span>✓</span>
                  Mobile responsive
                </div>

                <div>
                  <span>✓</span>
                  Business information
                </div>

                <div>
                  <span>✓</span>
                  Services / products section
                </div>

                <div>
                  <span>✓</span>
                  Contact section
                </div>

                <div>
                  <span>✓</span>
                  Deployment assistance
                </div>

              </div>

              <a href="#request" className="card-button">
                Submit Your Requirement
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* ================= TRUST BAR ================= */}

      <section className="trust-bar">

        <div className="container trust-bar-inner">

          <div>
            Professional Design
          </div>

          <div>
            Mobile First
          </div>

          <div>
            Business Focused
          </div>

          <div>
            Affordable Pricing
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="section features-section">

        <div className="container">

          <div className="section-heading">

            <div className="section-label">
              EVERYTHING YOU NEED
            </div>

            <h2>
              A website built for your business
            </h2>

            <p>
              Your website should make it easy for customers to understand
              your business, trust your brand and contact you.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-number">
                01
              </div>

              <h3>
                Professional Design
              </h3>

              <p>
                A clean and modern website designed around your business,
                services and brand identity.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                02
              </div>

              <h3>
                Mobile Friendly
              </h3>

              <p>
                Your website will look good and remain easy to use on
                phones, tablets and desktop computers.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">
                03
              </div>

              <h3>
                Simple & Fast
              </h3>

              <p>
                Focused pages that help your customers quickly find
                information about your business.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= WHY WEBSITE ================= */}

      <section className="section why-section">

        <div className="container why-grid">

          <div className="why-content">

            <div className="section-label">
              WHY A WEBSITE?
            </div>

            <h2>
              Give your business a professional online presence.
            </h2>

            <p>
              Social media is useful, but a website gives your business
              a place that you control and that customers can visit
              whenever they want.
            </p>

          </div>


          <div className="why-list">

            <div className="why-item">

              <div className="why-icon">
                01
              </div>

              <div>
                <h3>
                  Build Trust
                </h3>

                <p>
                  Give potential customers a professional place to
                  learn about your business.
                </p>
              </div>

            </div>


            <div className="why-item">

              <div className="why-icon">
                02
              </div>

              <div>
                <h3>
                  Show Your Services
                </h3>

                <p>
                  Clearly present your services, products, work and
                  business information.
                </p>
              </div>

            </div>


            <div className="why-item">

              <div className="why-icon">
                03
              </div>

              <div>
                <h3>
                  Make Contact Easy
                </h3>

                <p>
                  Customers can quickly find the information they need
                  to contact your business.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PROCESS ================= */}

      <section className="section process-section">

        <div className="container">

          <div className="section-heading left">

            <div className="section-label">
              SIMPLE PROCESS
            </div>

            <h2>
              From idea to website
            </h2>

            <p>
              Getting your business online doesn't have to be complicated.
            </p>

          </div>


          <div className="process-grid">

            <div className="process-card">

              <div className="process-number">
                01
              </div>

              <h3>
                Tell us what you need
              </h3>

              <p>
                Submit your business details and tell us what you want
                your website to include.
              </p>

            </div>


            <div className="process-card">

              <div className="process-number">
                02
              </div>

              <h3>
                We build your website
              </h3>

              <p>
                Your website is designed around your business and the
                information you provide.
              </p>

            </div>


            <div className="process-card">

              <div className="process-number">
                03
              </div>

              <h3>
                Go online
              </h3>

              <p>
                Once everything is ready, your website can be published
                online for customers to visit.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= REQUEST FORM ================= */}

      <section
        id="request"
        className="section request-section"
      >

        <div className="container request-container">

          <div className="section-heading">

            <div className="section-label">
              START YOUR PROJECT
            </div>

            <h2>
              Tell us about your business
            </h2>

            <p>
              Fill in the details below and we'll review your requirement.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="request-form"
          >

            <div className="form-grid">

              {/* NAME */}

              <div className="form-field">

                <label htmlFor="name">
                  Your Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                />

              </div>


              {/* PHONE */}

              <div className="form-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                />

              </div>


              {/* BUSINESS */}

              <div className="form-field full">

                <label htmlFor="business">
                  Business Name
                </label>

                <input
                  id="business"
                  type="text"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="Your business name"
                  autoComplete="organization"
                />

              </div>


              {/* NEED */}

              <div className="form-field full">

                <label htmlFor="need">
                  What do you need?
                </label>

                <textarea
                  id="need"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Tell us about the website you want..."
                  rows={6}
                  maxLength={500}
                />

                <div className="character-count">
                  {need.length}/500
                </div>

              </div>

            </div>


            {/* MESSAGE */}

            {message && (

              <div
                className={`form-message ${
                  messageType === "success"
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>

            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="main-submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Request"}
            </button>


            <p className="form-note">
              We'll review your requirement and contact you.
            </p>

          </form>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="final-cta">

        <div className="container">

          <div className="final-cta-box">

            <div className="section-label">
              GET STARTED
            </div>

            <h2>
              Ready to build your website?
            </h2>

            <p>
              Give your business a professional online presence
              starting at ₹3000.
            </p>

            <a
              href="#request"
              className="cta-button"
            >
              Submit Your Requirement
            </a>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="container">

          <div className="footer-main">

            <div className="footer-brand">

              <a href="/" className="footer-logo">
                LeadStudio
              </a>

              <p>
                Professional websites for growing businesses.
              </p>

            </div>


            {/* ADMIN LOGIN AT THE VERY BOTTOM */}

            <a
              href="/admin/login"
              className="admin-login"
            >
              Admin Login
            </a>

          </div>


          <div className="footer-bottom">

            <span>
              © 2026 LeadStudio. All rights reserved.
            </span>

          </div>

        </div>

      </footer>

    </main>
  );
}