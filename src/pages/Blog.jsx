import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/blogs');
        const data = response.data?.data ?? response.data;
        const blogsArray = Array.isArray(data) ? data : [];

        // Filter only published blog posts
        const publishedBlogs = blogsArray.filter(
          (blog) => blog.published === true || blog.published === 1 || blog.published === 'true'
        );

        setBlogs(publishedBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load blog posts. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Articles & Insights
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Blog{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
              Posts
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Thoughts, tutorials, and perspectives on software engineering, technology, and building modern web applications.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Loading blog posts...</p>
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
            <h3 className="text-white font-semibold text-lg">Unable to load blogs</h3>
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
        {!loading && !error && blogs.length === 0 && (
          <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl">No Blog Posts Yet</h3>
            <p className="text-slate-400 text-sm">
              Check back soon! Published articles will appear right here.
            </p>
          </div>
        )}

        {/* Blog Cards Grid */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const formattedDate = formatDate(blog.published_at || blog.created_at);
              const hasValidImage = blog.image_url && !imageErrors[blog.id];

              return (
                <article
                  key={blog.id || blog.slug || blog.title}
                  className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 shadow-xl group hover:-translate-y-1"
                >
                  {/* Blog Image or Clean Placeholder */}
                  <div className="h-52 w-full bg-slate-800/50 relative overflow-hidden border-b border-slate-800/80">
                    {hasValidImage ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        onError={() => handleImageError(blog.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 p-6">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-2 group-hover:border-sky-500/40 transition-colors">
                          <svg className="w-6 h-6 text-sky-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Article</span>
                      </div>
                    )}
                  </div>

                  {/* Blog Content Details */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Published Date */}
                      {formattedDate && (
                        <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formattedDate}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      {blog.excerpt ? (
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                          {blog.excerpt}
                        </p>
                      ) : blog.content ? (
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                          {blog.content}
                        </p>
                      ) : null}
                    </div>

                    {/* Read More Link / Button */}
                    <div className="pt-4 border-t border-slate-800/80 mt-auto">
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors gap-1.5 group/btn"
                      >
                        <span>Read More</span>
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Read More Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Blog Image */}
              {selectedBlog.image_url && !imageErrors[selectedBlog.id] && (
                <div className="h-64 w-full rounded-xl overflow-hidden bg-slate-800/50">
                  <img
                    src={selectedBlog.image_url}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Modal Date & Title */}
              <div className="space-y-2">
                {(selectedBlog.published_at || selectedBlog.created_at) && (
                  <p className="text-xs font-semibold text-sky-400">
                    Published on {formatDate(selectedBlog.published_at || selectedBlog.created_at)}
                  </p>
                )}
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {selectedBlog.title}
                </h2>
              </div>

              {/* Modal Content / Excerpt */}
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {selectedBlog.content ? (
                  <div className="whitespace-pre-line">{selectedBlog.content}</div>
                ) : (
                  <p>{selectedBlog.excerpt}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Blog;
