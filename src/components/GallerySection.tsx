import React, { useState } from 'react';
import { Camera, Sparkles, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const gallery = [
    {
      title: 'White Oak Woodfire Hearth',
      category: 'The Kitchen',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      span: 'col-span-1 md:col-span-2 row-span-2',
    },
    {
      title: 'Sommelier Wine Mezzanine',
      category: 'The Cellar',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      title: 'Grand Hearth Dining Room',
      category: 'Ambiance',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      title: 'Truffle Tagliatelle Plating',
      category: 'Artisanal Pasta',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1',
    },
    {
      title: 'Starry Garden Courtyard',
      category: 'Outdoor Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      span: 'col-span-1 md:col-span-2',
    },
  ];

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-950 text-left relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 mb-3">
            Atmosphere & Gastronomy
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm">
            Step inside our architectural sanctuary designed for the modern connoisseur.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {gallery.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(item.image)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-stone-800 shadow-xl ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {item.category}
                </span>
                <h3 className="font-display font-semibold text-base sm:text-lg text-stone-100">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedPhoto}
            alt="Enlarged view"
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
