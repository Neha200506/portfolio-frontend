import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/experience');
        const data = response.data?.data ?? response.data;
        const expArray = Array.isArray(data) ? data : [];
        
        // Sort experiences by start_date descending (newest first)
        const sorted = expArray.sort((a, b) => {
          if (a.currently_working && !b.currently_working) return -1;
          if (!a.currently_working && b.currently_working) return 1;
          const dateA = new Date(a.start_date || 0);
          const dateB = new Date(b.start_date || 0);
          return dateB - dateA;
        });

        setExperiences(sorted);
      } catch (err) {
        console.error('Error fetching experience data:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load work experience. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Career Timeline
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Work{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
              Experience
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            My professional journey, previous roles, and key contributions across different engineering teams.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Loading experience history...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">Unable to load experience</h3>
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && experiences.length === 0 && (
          <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl">No Experience Listed</h3>
            <p className="text-slate-400 text-sm">
              Work experience items will appear here once added to the portfolio.
            </p>
          </div>
        )}

        {/* Vertical Timeline */}
        {!loading && !error && experiences.length > 0 && (
          <div className="relative border-l-2 border-slate-800/80 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
            {experiences.map((exp, index) => {
              const startDate = formatDate(exp.start_date);
              const endDate = exp.currently_working ? 'Present' : formatDate(exp.end_date) || 'Present';

              return (
                <div key={exp.id || index} className="relative group">
                  {/* Timeline Dot Node */}
                  <span
                    className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 transition-transform duration-300 group-hover:scale-125 ${
                      exp.currently_working
                        ? 'bg-sky-400 ring-4 ring-sky-500/20 shadow-lg shadow-sky-500/50'
                        : 'bg-indigo-500 ring-4 ring-indigo-500/10'
                    }`}
                  ></span>

                  {/* Experience Card */}
                  <div className="bg-slate-900/60 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                    {/* Header Row: Role & Dates */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                          {exp.position}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-semibold text-slate-300">
                            {exp.company}
                          </span>
                          {exp.company_url && (
                            <a
                              href={exp.company_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 hover:text-sky-300 transition-colors p-1"
                              title={`Visit ${exp.company}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Date Badge */}
                      <div className="self-start sm:self-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            exp.currently_working
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {startDate} – {endDate}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line pt-2">
                        {exp.description}
                      </p>
                    )}

                    {/* Company Link Button (if available) */}
                    {exp.company_url && (
                      <div className="pt-2">
                        <a
                          href={exp.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors gap-1.5"
                        >
                          <span>Visit Company Website</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
