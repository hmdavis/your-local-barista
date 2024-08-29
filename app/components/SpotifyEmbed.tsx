'use client'

export default function SpotifyEmbed() {
    return (
      <iframe 
        style={{ borderRadius: '12px', width: '35%', height: '100px' }} 
        src="https://open.spotify.com/embed/playlist/1MXZfprSkutHtpt81xgt4x?utm_source=generator" 
        width="100%" 
        height="352" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
      ></iframe>
    );
  }
