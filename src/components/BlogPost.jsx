import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseFrontmatter } from '../utils/parseFrontmatter';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import data from '../myData';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                // First, get the manifest to find the filename
                const publicUrl = process.env.PUBLIC_URL || '';
                const manifestResponse = await fetch(`${publicUrl}/blog/blog-manifest.json`);
                
                if (!manifestResponse.ok) {
                    throw new Error(`Failed to fetch manifest: ${manifestResponse.status} ${manifestResponse.statusText}`);
                }
                
                const manifest = await manifestResponse.json();
                const postInfo = manifest.find(p => p.slug === slug);
                
                if (!postInfo) {
                    setError('Post not found');
                    setLoading(false);
                    return;
                }

                // Load the markdown file
                const response = await fetch(`${publicUrl}/blog/${postInfo.filename}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${postInfo.filename}: ${response.status} ${response.statusText}`);
                }
                const markdown = await response.text();
                const { data: frontmatter, content } = parseFrontmatter(markdown);

                setPost({
                    ...frontmatter,
                    content
                });
                setLoading(false);
            } catch (err) {
                console.error('Error loading blog post:', err);
                setError('Failed to load blog post');
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

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
                        <span className="blog-post-date">
                            {(() => {
                                const date = new Date(post.date);
                                date.setDate(date.getDate() + 1);
                                return date.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                            })()}
                        </span>
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
