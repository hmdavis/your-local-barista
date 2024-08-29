'use client'

import { Music } from 'lucide-react'

export default function SpotifyEmbed() {
    return (
      <section className="mb-8 bg-black border border-gray-700 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center text-white">
          <Music className="mr-2 text-green-400" /> Now Playing
        </h3>
        <div className="bg-black rounded-lg p-4">
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
