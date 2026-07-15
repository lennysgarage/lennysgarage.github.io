import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import data from '../myData';

const formatDate = (dateStr) => {
    // Parse the YYYY-MM-DD frontmatter value as a local date without letting
    // the JS Date constructor shift it across UTC boundaries.
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const pad = (n) => String(n).padStart(2, '0');

const datedUrl = (post) => {
    const [y, m, d] = post.date.split('-');
    return `/blog/${y}/${pad(Number(m))}/${pad(Number(d))}/${post.slug}`;
};

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const publicUrl = process.env.PUBLIC_URL || '';
                const res = await fetch(`${publicUrl}/blog/blog-manifest.json`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
                }
                const manifest = await res.json();
                // Manifest is already sorted newest-first by the build script,
                // but guard against manual edits.
                manifest.sort((a, b) => new Date(b.date) - new Date(a.date));
                setPosts(manifest);
                setLoading(false);
            } catch (err) {
                console.error('Error loading blog posts:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="App">
                <Header name={data.name} />
                <div className="blog-container">
                    <div className="blog-loading">Loading blog posts...</div>
                </div>
                <ScrollToTop />
            </div>
        );
    }

    return (
        <div className="App">
            <Header name={data.name} />
            <div className="blog-container">
                <div className="blog-header">
                    <h1>Blog</h1>
                    <p>
                        Thoughts, experiences, and learnings.{' '}
                        <a href={`${process.env.PUBLIC_URL || ''}/blog/index.xml`} className="blog-feed-link">RSS</a>
                    </p>
                </div>
                {error ? (
                    <div className="blog-error">
                        <p>Error loading blog posts: {error}</p>
                        <p>Please check the browser console for more details.</p>
                    </div>
                ) : (
                    <div className="blog-posts">
                        {posts.length === 0 ? (
                            <div className="blog-empty">No blog posts yet. Check back soon!</div>
                        ) : (
                            posts.map((post) => (
                                <article key={post.slug} className="blog-post-card">
                                    <Link to={datedUrl(post)} className="blog-post-link">
                                        <h2 className="blog-post-title">{post.title}</h2>
                                        <div className="blog-post-meta">
                                            <span className="blog-post-date">{formatDate(post.date)}</span>
                                        </div>
                                        {post.excerpt && (
                                            <p className="blog-post-excerpt">{post.excerpt}</p>
                                        )}
                                    </Link>
                                </article>
                            ))
                        )}
                    </div>
                )}
            </div>
            <ScrollToTop />
        </div>
    );
};

export default Blog;
