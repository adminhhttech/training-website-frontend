import React from 'react';

interface LinkedTextProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

/**
 * A reusable component that renders clickable hyperlinks.
 * Automatically handles URL formatting and opens links in new tabs.
 */
export function LinkedText({ url, children, className = '', style, color }: LinkedTextProps) {
  if (!url) return <>{children}</>;

  // Normalize URL - add protocol if missing
  const normalizedUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:')
    ? url
    : url.includes('@')
      ? `mailto:${url}`
      : `https://${url}`;

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(color ? { color } : {})
  };

  return (
    <a
      href={normalizedUrl}
      target={url.includes('@') || url.startsWith('tel:') ? undefined : '_blank'}
      rel={url.includes('@') || url.startsWith('tel:') ? undefined : 'noopener noreferrer'}
      className={`hover:underline transition-opacity hover:opacity-80 ${className}`}
      style={combinedStyle}
    >
      {children}
    </a>
  );
}

/**
 * Helper to format display text for URLs
 * Removes protocol and trailing slashes
 */
export function formatDisplayUrl(url?: string): string {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}
