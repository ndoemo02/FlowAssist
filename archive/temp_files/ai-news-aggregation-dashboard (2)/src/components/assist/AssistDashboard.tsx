import { useState } from 'react';
import {
  Youtube,
  Github,
  RefreshCw,
  TrendingUp,
  Zap,
  Star,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

const mockFeed = [
  {
    id: '1',
    source: 'youtube',
    title: 'Claude 3.5 Sonnet - Complete Review & Testing',
    channel: 'AI Explained',
    time: '2 godziny temu',
    views: '45K wyświetleń',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
  },
  {
    id: '2',
    source: 'reddit',
    title: '[D] New paper shows 10x improvement in inference speed for LLMs',
    subreddit: 'r/MachineLearning',
    time: '4 godziny temu',
    upvotes: '2.4k upvotes',
  },
  {
    id: '3',
    source: 'github',
    title: 'ollama/ollama - Get up and running with large language models',
    stars: '78.2k',
    time: 'Zaktualizowano dzisiaj',
    language: 'Go',
  },
  {
    id: '4',
    source: 'youtube',
    title: 'The Future of AI Agents - 2024 Predictions',
    channel: 'Two Minute Papers',
    time: '6 godzin temu',
    views: '120K wyświetleń',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
  },
];

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z" />
  </svg>
);

export function AssistDashboard() {
  const { addKnowledgeItem, setAssistTab, assist } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'youtube' | 'reddit' | 'github'>('all');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleSaveToCollection = (item: typeof mockFeed[0]) => {
    addKnowledgeItem({
      url: `https://${item.source}.com/${item.id}`,
      title: item.title,
      description: 'channel' in item ? item.channel : 'subreddit' in item ? item.subreddit : item.language,
      category: item.source as 'youtube' | 'reddit' | 'github',
      source: item.source as 'youtube' | 'reddit' | 'github',
      thumbnail: 'thumbnail' in item ? item.thumbnail : undefined,
      tags: [],
      isFavorite: false,
    });
  };

  const filteredFeed = filter === 'all' ? mockFeed : mockFeed.filter((item) => item.source === filter);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'reddit':
        return <div className="text-orange-500"><RedditIcon /></div>;
      case 'github':
        return <Github className="h-5 w-5 text-slate-900" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Knowledge Dashboard</h1>
          <p className="text-sm text-slate-500 sm:text-base">Najnowsze newsy i research ze świata AI</p>
        </div>
        <button
          onClick={handleRefresh}
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl',
            isRefreshing && 'opacity-75'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          <span>{isRefreshing ? 'Odświeżanie...' : 'Odśwież feed'}</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-3 sm:rounded-2xl sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-red-500 p-2 sm:rounded-xl sm:p-2.5">
              <Youtube className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">12</p>
              <p className="text-xs text-slate-600 sm:text-sm">YouTube</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:rounded-2xl sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-orange-500 p-2 text-white sm:rounded-xl sm:p-2.5">
              <RedditIcon />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">28</p>
              <p className="text-xs text-slate-600 sm:text-sm">Reddit</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:rounded-2xl sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-slate-900 p-2 sm:rounded-xl sm:p-2.5">
              <Github className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">8</p>
              <p className="text-xs text-slate-600 sm:text-sm">GitHub</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 p-3 sm:rounded-2xl sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-violet-500 p-2 sm:rounded-xl sm:p-2.5">
              <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 sm:text-2xl">{assist.knowledgeItems.length}</p>
              <p className="text-xs text-slate-600 sm:text-sm">Zapisanych</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'Wszystkie', icon: Zap },
          { id: 'youtube', label: 'YouTube', icon: Youtube },
          { id: 'reddit', label: 'Reddit', icon: () => <RedditIcon /> },
          { id: 'github', label: 'GitHub', icon: Github },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as typeof filter)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:rounded-xl sm:px-4',
                filter === item.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {filteredFeed.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100 sm:rounded-2xl sm:p-4"
          >
            <div className="flex gap-3 sm:gap-4">
              {'thumbnail' in item && item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="hidden h-20 w-32 rounded-lg object-cover xs:block sm:h-24 sm:w-40 sm:rounded-xl"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(item.source)}
                    <span className="truncate text-xs font-medium text-slate-500">
                      {'channel' in item && item.channel}
                      {'subreddit' in item && item.subreddit}
                      {'language' in item && item.language}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSaveToCollection(item)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-violet-100 hover:text-violet-600"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-slate-900 line-clamp-2 sm:mt-2 sm:text-base">
                  {item.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:mt-2 sm:gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                  {'views' in item && <span className="hidden sm:inline">{item.views}</span>}
                  {'upvotes' in item && <span className="hidden sm:inline">{item.upvotes}</span>}
                  {'stars' in item && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {item.stars}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 flex gap-2 sm:mt-3">
              <button
                onClick={() => setAssistTab('ai-chat')}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-50 px-2 py-1.5 text-xs font-medium text-violet-600 transition-all hover:bg-violet-100"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Podsumuj z AI
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-200">
                <ExternalLink className="h-3.5 w-3.5" />
                Otwórz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
