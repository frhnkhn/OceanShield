"use client";

import { useEffect, useState } from "react";
import { fetchSocialPosts, SocialPost } from "@/services/social/socialIntelligenceService";
import { MessageSquare, Flame, TrendingUp, Compass, MessageCircle, AlertTriangle } from "lucide-react";

export default function SocialIntelligenceDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchSocialPosts(keyword);
      setPosts(data);
      if (data.length && !selectedPost) {
        setSelectedPost(data[0]);
      }
    };
    void loadPosts();
  }, [keyword]);

  const trendingHashtags = ["#ChennaiFloods", "#CycloneAlert", "#MarinaBeach", "#Nagapattinam", "#CoastalSafety"];
  const trendingLocations = ["Chennai Port", "Royapuram Bridge", "Mylapore Coast", "Nagapattinam Harbor"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: Hashtags & Scraper Metrics */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Trending Hashtags */}
        <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
          <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3">
            <Flame className="h-4 w-4 text-orange-400 animate-pulse" /> Trending Hashtags
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setKeyword(tag)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 transition-all font-mono"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Locations */}
        <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
          <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2 mb-3">
            <Compass className="h-4 w-4 text-cyan-400" /> Trending Locations
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingLocations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => setKeyword(loc)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Live feed list */}
      <div className="lg:col-span-1 rounded-xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-1">
          <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> Public Alerts Stream
          </h4>
          {keyword && (
            <button onClick={() => setKeyword("")} className="text-[10px] text-cyan-500 hover:underline">
              Clear Filter
            </button>
          )}
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`p-3.5 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                selectedPost?.id === post.id
                  ? "border-cyan-500 bg-slate-900/60"
                  : "border-slate-805 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-400">{post.author} ({post.source})</span>
                <span className={`px-1.5 py-0.5 rounded font-bold text-white ${
                  post.severity === "critical" ? "bg-red-500" : "bg-orange-400"
                }`}>
                  {post.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-white leading-normal line-clamp-2">{post.text}</p>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{post.location}</span>
                <span className="text-cyan-400 font-bold">Credibility: {post.credibilityScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: AI Analysis Panel */}
      <div className="lg:col-span-1">
        {selectedPost ? (
          <div className="rounded-xl border border-cyan-500/20 bg-slate-950/40 p-5 backdrop-blur-md flex flex-col gap-4">
            <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
              <MessageCircle className="h-4 w-4" /> AI Post Analysis
            </h4>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Scraped Post</span>
              <p className="text-xs text-slate-300 leading-normal mt-1 bg-slate-950 p-2.5 rounded border border-slate-900">
                "{selectedPost.text}"
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Disaster Category</span>
                <span className="font-bold text-white">{selectedPost.disasterType}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Credibility Analysis</span>
                <span className="font-bold font-mono text-emerald-400">{selectedPost.credibilityScore}% Confident</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Extracted Location</span>
                <span className="font-bold text-cyan-400">{selectedPost.location}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Sentiment Rating</span>
                <span className="font-bold text-white uppercase">{selectedPost.sentiment}</span>
              </div>

              <div className="mt-2 p-2.5 rounded bg-cyan-500/5 border border-cyan-500/20 text-[11px] text-slate-300">
                <p className="font-bold text-cyan-400 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Recommended EOC Action:</p>
                <p className="mt-1">Flag to local {selectedPost.location} verification team. Update threat risk matrices.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6 backdrop-blur-md text-center text-slate-500 text-xs">
            Select a scraped public alert stream post to inspect detailed AI metadata.
          </div>
        )}
      </div>

    </div>
  );
}
