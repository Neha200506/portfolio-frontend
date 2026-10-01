import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Blog } from './Blog';
import { Experience } from './Experience';

export function Home() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSuccess('');
    setContactError('');

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setContactSubmitting(true);
    try {
      const response = await api.post('/messages', {
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        subject: contactForm.subject.trim(),
        message: contactForm.message.trim(),
      });

      if (response.data && response.data.success) {
        setContactSuccess(response.data.message || 'Thank you! Your message has been sent successfully.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactError(response.data?.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      let errMsg = 'Failed to send message. Please try again.';
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }
      setContactError(errMsg);
    } finally {
      setContactSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/about');
        const data = response.data?.data;
        const aboutRecord = Array.isArray(data) ? data[0] : data;
        setAbout(aboutRecord || null);

        if (aboutRecord?.profile_image_url || aboutRecord?.image_url) {
          setHeroImage(aboutRecord.profile_image_url || aboutRecord.image_url);
        } else {
          try {
            const mediaRes = await api.get('/media');
            const mediaData = mediaRes.data?.data ?? mediaRes.data;
            if (Array.isArray(mediaData) && mediaData.length > 0) {
              const firstImg = mediaData.find(
                (m) =>
                  m.file_url &&
                  (m.file_type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(m.file_url))
              );
              if (firstImg) {
                setHeroImage(firstImg.file_url);
              }
            }
          } catch (mErr) {
            // Ignore if unauthenticated
          }
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        const data = response.data?.data ?? response.data;
        setSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        const data = response.data?.data ?? response.data;
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchAbout();
    fetchSkills();
    fetchProjects();
  }, []);

  return (
    <div className="w-full">

      {/* 1. HOME SECTION */}
      <section id="home" className="scroll-mt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">

          {/* LEFT COLUMN: All Home Information */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              Available for new opportunities
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-slate-400 text-sm font-medium py-4">
                Loading profile information...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md">
                {error}
              </div>
            )}

            {/* Hero Header & Name/Title */}
            {!loading && (
              <>
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    Hi, I'm{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                      {about?.name || 'Developer'}
                    </span>
                  </h1>
                  {about?.title && (
                    <p className="text-xl sm:text-2xl font-medium text-slate-300">
                      {about.title}
                    </p>
                  )}
                </div>

                {/* Short Intro */}
                {about?.bio && (
                  <p className="max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
                    {about.bio}
                  </p>
                )}
              </>
            )}

            {/* Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 transition-all"
              >
                View My Work
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all hover:text-white"
              >
                Get In Touch
              </a>

              <a
                href="/CV%20neha.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-transparent hover:bg-slate-800/60 border border-slate-700 rounded-xl transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Resume
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic Photo Box */}
          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-sm sm:max-w-md">
            <div className="relative group rounded-3xl p-2.5 bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-sm hover:border-slate-700/80 transition-all duration-300 w-full">
              <div className="overflow-hidden rounded-2xl aspect-[4/5] max-h-[460px] w-full bg-slate-800/50 flex items-center justify-center relative">
                {(heroImage || about?.profile_image_url || about?.image_url) ? (
                  <img
                    src={heroImage || about?.profile_image_url || about?.image_url}
                    alt={about?.name || "Profile"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 p-6"
                  style={{
                    display: (heroImage || about?.profile_image_url || about?.image_url) ? 'none' : 'flex'
                  }}
                >
                  <svg className="w-16 h-16 mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Profile Photo</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="scroll-mt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 w-full">
        <div className="max-w-5xl w-full space-y-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
              About Me
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Background &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                Biography
              </span>
            </h2>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl backdrop-blur-sm">
            {about ? (
              <div className="space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg">
                <p className="font-semibold text-white text-xl sm:text-2xl">
                  {about.name} — <span className="text-sky-400">{about.title}</span>
                </p>
                <p className="whitespace-pre-line text-slate-300">{about.bio}</p>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">No biography information available.</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. SKILLS SECTION */}
      <section id="skills" className="scroll-mt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 w-full">
        <div className="max-w-5xl w-full space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
              Technical Proficiency
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Skills &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                Technologies
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Core technologies, frameworks, and tools I use to craft full-stack applications.
            </p>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-3xl mx-auto">
              {skills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 text-slate-200 text-sm font-semibold transition-all hover:text-white shadow-md flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400 group-hover:scale-125 transition-transform"></span>
                  <span>{skill.name}</span>
                  {skill.proficiency && (
                    <span className="text-xs font-normal text-slate-400">({skill.proficiency})</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No skills listed yet.</p>
          )}
        </div>
      </section>

      {/* 4. PROJECTS SECTION */}
      <section id="projects" className="scroll-mt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 w-full">
        <div className="max-w-6xl w-full space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
              Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Projects &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                Applications
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A selection of recent projects built with modern web technologies.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                const techList = Array.isArray(project.technologies)
                  ? project.technologies
                  : typeof project.technologies === 'string'
                    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                    : [];

                return (
                  <article
                    key={project.id || project.title}
                    className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-xl group hover:-translate-y-1"
                  >
                    {/* Project Image or Clean Placeholder */}
                    <div className="h-48 w-full bg-slate-800/50 flex items-center justify-center overflow-hidden border-b border-slate-800">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 p-6 w-full h-full">
                          <svg className="w-10 h-10 mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">No Preview</span>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Technologies */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {techList.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs font-medium rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      {(project.github_url || project.live_url) && (
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80 text-sm font-medium mt-auto">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-slate-400 hover:text-white transition-colors gap-1.5"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                              </svg>
                              GitHub
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors gap-1.5 ml-auto"
                            >
                              Live Demo
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">No projects listed yet.</p>
          )}
        </div>
      </section>

      {/* 5. EXPERIENCE SECTION */}
      <div id="experience" className="scroll-mt-16 border-t border-slate-800/60">
        <Experience />
      </div>

      {/* 6. BLOG SECTION */}
      <div id="blog" className="scroll-mt-16 border-t border-slate-800/60">
        <Blog />
      </div>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="scroll-mt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 w-full text-center">
        <div className="max-w-4xl w-full space-y-8">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Let's Connect &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                Collaborate
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Interested in working together or have any questions? Feel free to reach out.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 max-w-xl mx-auto shadow-xl backdrop-blur-sm text-left">
            {contactSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                {contactSuccess}
              </div>
            )}
            {contactError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium">
                {contactError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Name <span className="text-sky-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email <span className="text-sky-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Subject of your message"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Message <span className="text-sky-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows="4"
                  placeholder="How can I help you?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {contactSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
