import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Review } from '../types.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Partial<Review>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    onAddReview({
      customerName: name,
      rating,
      comment,
      foodName: favoriteDish || undefined,
      date: new Date().toISOString(),
      verified: true,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setName('');
      setComment('');
      setFavoriteDish('');
    }, 1800);
  };

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-950/80 relative text-left">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Epicurean Testimonials</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100">
              Celebrated by Dining Critics & Guests
            </h2>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/20"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? 'Close Review Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Leave Review Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-12 p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl max-w-2xl mx-auto space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-display font-bold text-lg text-stone-100">Share Your Gastronomic Experience</h3>

            {submitted ? (
              <div className="py-6 text-center text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Thank you! Your review has been published.</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elizabeth Montgomery"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Favorite Dish Ordered</label>
                    <input
                      type="text"
                      value={favoriteDish}
                      onChange={(e) => setFavoriteDish(e.target.value)}
                      placeholder="e.g. Wagyu Ribeye or Truffle Tagliatelle"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setRating(st)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            st <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-amber-400 font-bold ml-2">{rating} of 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the tastes, presentation, ambiance and wine pairings..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="text-right pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800/80 flex flex-col justify-between shadow-xl hover:border-amber-500/30 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-stone-100">{rev.customerName}</div>
                  {rev.foodName && (
                    <div className="text-[10px] text-amber-500">Ordered: {rev.foodName}</div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {rev.customerName.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
