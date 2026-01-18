import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parseFrontmatter } from '../utils/parseFrontmatter';
import Header from './Header';
import ScrollToTop from './ScrollToTop';
import data from '../myData';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Fetch the blog manifest
                const publicUrl = process.env.PUBLIC_URL || '';
                const manifestResponse = await fetch(`${publicUrl}/blog/blog-manifest.json`);
                
                if (!manifestResponse.ok) {
                    throw new Error(`Failed to fetch manifest: ${manifestResponse.status} ${manifestResponse.statusText}`);
                }
                
                const manifest = await manifestResponse.json();
                console.log('Manifest loaded:', manifest);

                // Load and parse each blog post
                const postsData = await Promise.all(
                    manifest.map(async (postInfo) => {
                        const response = await fetch(`${publicUrl}/blog/${postInfo.filename}`);
                        
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${postInfo.filename}: ${response.status} ${response.statusText}`);
                        }
                        
                        const markdown = await response.text();
                        const { data: frontmatter, content } = parseFrontmatter(markdown);
                        
                        return {
                            slug: postInfo.slug,
                            ...frontmatter,
                            excerpt: frontmatter.excerpt || content.substring(0, 150) + '...'
                        };
                    })
                );

                // Sort posts by date (newest first)
                postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                console.log('Posts loaded:', postsData);
                setPosts(postsData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading blog posts:', error);
                setError(error.message);
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
                    <p>Thoughts, experiences, and learnings</p>
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
                                    <Link to={`/blog/${post.slug}`} className="blog-post-link">
                                        <h2 className="blog-post-title">{post.title}</h2>
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
                                        <p className="blog-post-excerpt">{post.excerpt}</p>
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
