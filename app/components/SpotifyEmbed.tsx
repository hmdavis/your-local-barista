'use client'

import { Music } from 'lucide-react'

export default function SpotifyEmbed() {
  return (
    <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
      <h3 className="text-2xl font-bold mb-4 flex items-center text-yellow-700">
        <Music className="mr-2 text-pink-500" /> Now Playing
      </h3>
      <div className="bg-yellow-50 rounded-lg p-4">
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/1MXZfprSkutHtpt81xgt4x?utm_source=generator&theme=0"
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
