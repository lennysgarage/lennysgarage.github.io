import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import data from '../myData';

const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const pad = (n) => String(n).padStart(2, '0');

const BlogPost = () => {
    const { year, month, day, slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const loadPost = async () => {
            try {
                const publicUrl = process.env.PUBLIC_URL || '';
                const res = await fetch(`${publicUrl}/blog/blog-manifest.json`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`);
                }
                const manifest = await res.json();
                const postInfo = manifest.find((p) => p.slug === slug);

                if (!postInfo) {
                    if (!cancelled) setError('Post not found');
                    if (!cancelled) setLoading(false);
                    return;
                }

                // Canonicalize: flat /blog/:slug -> dated URL.
                if (!year) {
                    const [y, m, d] = postInfo.date.split('-');
                    if (!cancelled) setRedirect(`/blog/${y}/${pad(Number(m))}/${pad(Number(d))}/${slug}`);
                    return;
                }

                const mdRes = await fetch(`${publicUrl}/blog/${postInfo.filename}`);
                if (!mdRes.ok) {
                    throw new Error(`Failed to fetch ${postInfo.filename}: ${mdRes.status} ${mdRes.statusText}`);
                }
                const post = await mdRes.json();

                if (!cancelled) {
                    setPost(post);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error loading blog post:', err);
                if (!cancelled) {
                    setError('Failed to load blog post');
                    setLoading(false);
                }
            }
        };

        loadPost();
        return () => { cancelled = true; };
    }, [slug, year, month, day]);

    if (redirect) {
        return <Navigate to={redirect} replace />;
    }

    if (loading) {
        return (
            <div className="App">
                <Header name={data.name} />
                <div className="blog-post-container">
                    <div className="blog-loading">Loading post...</div>
                </div>
                <ScrollToTop />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="App">
                <Header name={data.name} />
                <div className="blog-post-container">
                    <div className="blog-error">
                        <p>{error || 'Post not found'}</p>
                        <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
                    </div>
                </div>
                <ScrollToTop />
            </div>
        );
    }

    return (
        <div className="App">
            <Header name={data.name} />
            <div className="blog-post-container">
                <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
                <article className="blog-post">
                    <header className="blog-post-header">
                        <h1 className="blog-post-title">{post.title}</h1>
                        <div className="blog-post-meta">
                            <span className="blog-post-date">{formatDate(post.date)}</span>
                        </div>
                    </header>
                    <div className="blog-post-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
            <ScrollToTop />
        </div>
    );
};

export default BlogPost;
