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
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
            <Flame className="h-4 w-4 text-orange-600" /> Trending Hashtags
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setKeyword(tag)}
                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-slate-350 text-xs text-slate-700 transition-all font-mono"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Locations */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
            <Compass className="h-4 w-4 text-slate-550" /> Trending Locations
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingLocations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => setKeyword(loc)}
                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-slate-350 text-xs text-slate-700 transition-all"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Live feed list */}
      <div className="lg:col-span-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-1">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-slate-500" /> Public Alerts Stream
          </h4>
          {keyword && (
            <button onClick={() => setKeyword("")} className="text-[10px] text-blue-900 hover:underline font-bold">
              Clear Filter
            </button>
          )}
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`p-3.5 rounded border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                selectedPost?.id === post.id
                  ? "border-blue-900 bg-blue-50/30 text-slate-900 font-bold"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-450">{post.author} ({post.source})</span>
                <span className={`px-1.5 py-0.5 rounded font-bold text-white ${
                  post.severity === "critical" ? "bg-red-650" : "bg-orange-500"
                }`}>
                  {post.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-normal line-clamp-2">{post.text}</p>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{post.location}</span>
                <span className="text-blue-900 font-bold">Credibility: {post.credibilityScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: AI Analysis Panel */}
      <div className="lg:col-span-1">
        {selectedPost ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MessageCircle className="h-4 w-4 text-slate-500" /> AI Post Analysis
            </h4>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Scraped Post</span>
              <p className="text-xs text-slate-800 leading-normal mt-1 bg-slate-50 p-2.5 rounded border border-slate-200">
                "{selectedPost.text}"
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Disaster Category</span>
                <span className="font-bold text-slate-900">{selectedPost.disasterType}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Credibility Analysis</span>
                <span className="font-bold font-mono text-emerald-700">{selectedPost.credibilityScore}% Confident</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Extracted Location</span>
                <span className="font-bold text-blue-900">{selectedPost.location}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Sentiment Rating</span>
                <span className="font-bold text-slate-900 uppercase">{selectedPost.sentiment}</span>
              </div>

              <div className="mt-2 p-2.5 rounded bg-blue-50 border border-blue-200 text-[11px] text-slate-800">
                <p className="font-bold text-blue-900 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Recommended EOC Action:</p>
                <p className="mt-1">Flag to local {selectedPost.location} verification team. Update threat risk matrices.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-center text-slate-500 text-xs">
            Select a scraped public alert stream post to inspect detailed AI metadata.
          </div>
        )}
      </div>

    </div>
  );
}
