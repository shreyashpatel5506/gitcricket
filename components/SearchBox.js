'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Sparkles } from 'lucide-react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();

  // Load count of scanned profiles on mount
  useEffect(() => {
    async function loadCount() {
      try {
        const response = await fetch('/api/search/count');
        const result = await response.json();
        if (result.success) {
          setTotalCount(result.count);
        }
      } catch (err) {
        console.warn('Failed to load scanned count:', err);
      }
    }
    loadCount();
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const result = await response.json();
        if (result.success) {
          setSuggestions(result.suggestions);
          setIsOpen(result.suggestions.length > 0);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle Search Submission
  const handleSubmit = (username) => {
    const target = username || query.trim();
    if (!target) return;

    // Basic username validation: alphanumeric and hyphens only
    const isValid = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(target);
    if (!isValid) {
      setError('Invalid username format');
      return;
    }

    setIsOpen(false);
    // Redirect to card page
    router.push(`/card/${encodeURIComponent(target.toLowerCase())}`);
  };

  // Keyboard navigation inside suggestions list
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const selectedUser = suggestions[activeIndex].github_username;
        setQuery(selectedUser);
        handleSubmit(selectedUser);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl" id="search-hero">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="group relative flex items-center"
      >
        {/* Username input with @ prefix */}
        <div className="relative flex w-full items-center rounded-xl bg-bg-surface-1 border border-border-hairline shadow-lg transition-all focus-within:border-green-core/50 focus-within:shadow-[0_0_20px_rgba(23,232,143,0.08)]">
          <span className="pl-4 text-sm font-semibold text-text-tertiary select-none">@</span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value.replace(/\s+/g, '')); // remove spaces
              setError('');
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="enter github username (e.g. torvalds)"
            className="w-full bg-transparent px-2 py-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />

          {/* Loader or search icon */}
          <div className="pr-4 flex items-center">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-green-core animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-text-tertiary group-focus-within:text-green-core transition-colors" />
            )}
          </div>

          <button
            type="submit"
            className="mr-2 rounded-lg bg-green-core px-5 py-2.5 text-xs font-bold text-bg-void hover:bg-green-core/90 transition-all active:scale-95"
          >
            Generate
          </button>
        </div>
      </form>

      {/* Inline validator feedback */}
      {error && (
        <div className="absolute left-0 right-0 mt-2 px-1 text-xs font-semibold text-error">
          ⚠️ {error}
        </div>
      )}

      {/* Autocomplete suggestion drop panel */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl glass-panel shadow-2xl overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-border-hairline bg-bg-surface-1/40 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Quick Select (Cached Profiles)</span>
            <Sparkles className="w-3.5 h-3.5 text-green-core" />
          </div>
          <ul className="divide-y divide-border-hairline max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.github_username}
                onClick={() => {
                  setQuery(suggestion.github_username);
                  handleSubmit(suggestion.github_username);
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  index === activeIndex ? 'bg-bg-surface-3' : 'hover:bg-bg-surface-2'
                }`}
              >
                {/* User Avatar */}
                <img
                  src={suggestion.avatar_url}
                  alt={suggestion.name}
                  className="w-8 h-8 rounded-full border border-border-hairline object-cover"
                />
                
                {/* Username details */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">
                    @{suggestion.github_username}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {suggestion.name || suggestion.github_username}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dynamic Scanned Profile Count Social Proof */}
      {totalCount > 0 && (
        <div className="mt-3 flex items-center justify-center lg:justify-start gap-1.5 text-xs text-text-tertiary select-none">
          <Sparkles className="w-3.5 h-3.5 text-green-core fill-current animate-pulse" />
          <span>Join <strong className="font-mono text-text-secondary">{totalCount}</strong> developers who have scanned their profiles</span>
        </div>
      )}
    </div>
  );
}
