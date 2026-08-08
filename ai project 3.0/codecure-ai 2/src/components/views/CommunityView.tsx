import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Sparkles,
  Search,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { CommunityPost } from '../../types';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: CommunityPost) => void;
  onUpvotePost: (id: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onAddPost,
  onUpvotePost,
}) => {
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General Health');

  const topics = ['All Topics', 'Metabolic Health', 'Sleep & Recovery', 'Mental Health', 'Longevity & Biohacking'];

  const filteredPosts = selectedTopic === 'All Topics'
    ? posts
    : posts.filter((p) => {
        const cat = p.category || p.groupCategory || '';
        return cat.toLowerCase().includes(selectedTopic.toLowerCase().slice(0, 5));
      });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: 'You (Patient)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      category,
      title,
      content,
      upvotes: 1,
      commentCount: 0,
      timestamp: 'Just now',
    };

    onAddPost(newPost);
    setTitle('');
    setContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Peer Support & Verified Clinical Forum
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Health Community & Peer Support Groups
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect with verified patient circles, discuss longevity protocols, share recovery strategies, and ask clinical moderators questions.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Start Discussion
        </button>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
        {topics.map((top) => (
          <button
            key={top}
            onClick={() => setSelectedTopic(top)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTopic === top
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {top}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={post.authorName || post.authorAlias || 'User'}
                  className="w-10 h-10 rounded-2xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {post.authorName || post.authorAlias || 'Anonymous'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {post.category || post.groupCategory || 'General'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.timestamp || post.createdAt || 'Recently'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-slate-100 mb-1">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onUpvotePost(post.id)}
                className="flex items-center gap-1.5 hover:text-teal-500 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.upvotes ?? post.likes ?? 0} Upvotes</span>
              </button>

              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentCount ?? post.commentsCount ?? 0} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">
              Create Discussion Thread
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Metabolic Health">Metabolic Health</option>
                  <option value="Sleep Architecture">Sleep Architecture</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Longevity">Longevity & Biohacking</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Experiences with Continuous Glucose Monitors (CGM)?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Content
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details or questions for community members..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600"
                >
                  Publish Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
