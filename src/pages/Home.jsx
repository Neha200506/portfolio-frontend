import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { api } from '../services/api';

export function Home() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/about');
        const data = response.data?.data;
        const aboutRecord = Array.isArray(data) ? data[0] : data;
        setAbout(aboutRecord || null);
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
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-5xl mx-auto text-center space-y-12 w-full">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium tracking-wide">
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
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Hero Header & Name/Title Area */}
        {!loading && (
          <>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
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

            {/* Short Introduction */}
            {about?.bio && (
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
                {about.bio}
              </p>
            )}
          </>
        )}

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button variant="primary" size="lg" onClick={() => alert('View Projects clicked!')}>
            View My Work
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Button>

          <Button variant="secondary" size="lg" onClick={() => alert('Contact clicked!')}>
            Get In Touch
          </Button>

          <Button variant="outline" size="lg" onClick={() => alert('Download Resume clicked!')}>
            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Resume
          </Button>
        </div>

        {/* Quick Tech Stack Highlight */}
        <div className="pt-12 border-t border-slate-800/60 max-w-lg mx-auto">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">Core Stack</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-400">
            {skills.map((skill, index) => (
              <React.Fragment key={skill.id || index}>
                {index > 0 && <span className="text-slate-700">•</span>}
                <span className="hover:text-sky-400 transition-colors">{skill.name}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dynamic Projects Section */}
        {projects.length > 0 && (
          <div className="pt-16 border-t border-slate-800/60 text-left w-full">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Featured Projects</h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                A selection of recent work and projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const techList = Array.isArray(project.technologies)
                  ? project.technologies
                  : typeof project.technologies === 'string'
                  ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                  : [];

                return (
                  <div
                    key={project.id || project.title}
                    className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors shadow-lg"
                  >
                    {/* Project Image or Clean Placeholder */}
                    <div className="h-48 w-full bg-slate-800/50 flex items-center justify-center overflow-hidden border-b border-slate-800">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-600">
                          <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-xs font-medium">No Preview Available</span>
                        </div>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
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
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
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
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

