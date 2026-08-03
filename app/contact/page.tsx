'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your network or try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-text-primary">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          
          {/* Page Headers */}
          <div className="text-center mb-16">
            <span className="rounded-full bg-blue-glow px-3 py-1 text-xs font-semibold text-blue-core border border-blue-core/20 tracking-wider uppercase">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider mt-4 leading-tight">
              Contact <span className="text-gradient-green-blue">GitCric Support</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
              Have questions about ratings, dynamic leagues, integrations, or need data cached profile deletions? Drop us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Info Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-green-glow border border-green-core/20 flex items-center justify-center text-green-core shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Email Address</h3>
                  <a href="mailto:shreyashpatel5506@gmail.com" className="text-xs text-text-secondary hover:text-green-core transition-colors">
                    shreyashpatel5506@gmail.com
                  </a>
                  <span className="text-[10px] text-text-tertiary mt-0.5">Average reply time: 24-48 hours.</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-glow border border-blue-core/20 flex items-center justify-center text-blue-core shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider">GitHub Community</h3>
                  <a 
                    href="https://github.com/shreyashpatel5506/gitcricket" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-text-secondary hover:text-blue-core transition-colors flex items-center gap-1"
                  >
                    shreyashpatel5506/gitcricket
                  </a>
                  <span className="text-[10px] text-text-tertiary mt-0.5">File issues or request profile cards updates directly.</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-bg-surface-2 border border-border-hairline flex items-center justify-center text-text-secondary shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider">Data Removal Requests</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Want your profile cached results or achievements badges deleted? Send us your GitHub username, and we'll process it within 24 hours.
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-8 rounded-2xl border border-border-hairline relative overflow-hidden">
                
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4 animate-scale-in">
                    <CheckCircle2 className="w-16 h-16 text-green-core animate-bounce" />
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-lg font-black uppercase tracking-wider text-green-core">Message Sent</h3>
                      <p className="text-xs text-text-secondary max-w-sm">
                        Thank you for reaching out! Your message was received, and we will get back to you shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-bg-surface-2 border border-border-hairline px-6 text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-bg-surface-3 transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Send a Message</h3>
                    
                    {error && (
                      <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-xs font-semibold text-error">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                          Your Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. MS Dhoni"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                          Email Address <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="e.g. captain@gitcric.me"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Card Skin Idea / Rating Bug"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                        Message <span className="text-error">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Type your message details here..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-bg-surface-1 border border-border-hairline outline-none focus:border-green-core/40 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex h-10 items-center justify-center gap-1.5 rounded-xl bg-green-core hover:bg-green-core/90 text-xs font-bold text-bg-void transition-colors cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
