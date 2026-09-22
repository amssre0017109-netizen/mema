import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronDown,
  MapPin,
  Clock,
  Users,
  Zap,
  Building,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsSafetyModalOpen, setIsCreateRequestModalOpen, setSelectedCategory } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const realExamples = [
    {
      icon: '⚽',
      title: 'Football Partner Needed',
      time: 'Today • 6:00 PM',
      location: 'DTU Main Sports Ground',
      badge: 'Need 2 players',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: '💃',
      title: 'Bhangra Performer Needed',
      time: 'Tomorrow • 4:00 PM',
      location: 'College Auditorium Stage',
      badge: 'Need 1 dancer',
      category: 'Dance',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: '📚',
      title: 'Physics & Electromagnetism Partner',
      time: 'Today • 7:00 PM',
      location: 'Central Library 2nd Floor',
      badge: 'Midsem Prep',
      category: 'Study',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: '💻',
      title: 'React Dev for Hackathon Team',
      time: 'This Weekend',
      location: 'Tech Commons / Discord',
      badge: 'Team of 4',
      category: 'Coding',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: '🏋️',
      title: 'Gym Buddy for Leg Day',
      time: 'Today • 5:15 PM',
      location: 'Campus Fitness Center',
      badge: 'PR Spotting',
      category: 'Gym',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
    },
    {
      icon: '🏏',
      title: 'Box Cricket Match',
      time: 'Today • 5:45 PM',
      location: 'Hostel Practice Oval',
      badge: 'Need 3 players',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const faqs = [
    {
      q: 'Is MEMA a dating app?',
      a: 'No. MEMA is strictly an activity, skill, and team partner finder. It is built for finding teammates, study partners, gym buddies, performers, and players for sports.'
    },
    {
      q: 'How does skill matching work?',
      a: 'When you create your profile, select your skills (e.g. Bhangra, Physics, Football, React). When someone nearby posts a need requiring that skill, you get prioritized alerts.'
    },
    {
      q: 'Is my exact GPS address or home location shown?',
      a: 'Never. MEMA strictly protects your privacy and never exposes exact live GPS coordinates or precise street addresses. We only display approximate distance bands (e.g. Nearby ~500m, ~Within 1 km) and generalized campus areas.'
    },
    {
      q: 'Is MEMA free to use?',
      a: 'Yes! Posting requests, browsing feeds, matching skills, sending interest, and chatting are 100% free.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] dark:bg-[#0A0F1D] text-[#172033] dark:text-[#F1F5F9] pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
          <span>Activity, Plan & Skill Network</span>
          <span className="text-[#64748B] dark:text-slate-400 font-normal">• Find Partners Nearby</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-[#172033] dark:text-white leading-[1.08]">
          Post What You Need. <br />
          <span className="text-[#2563EB] dark:text-blue-400">
            Find The Right Person Nearby.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#64748B] dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Need a football player at 6 PM? A dance partner for rehearsal? A study buddy or hackathon coder? Connect with verified people in your area in seconds.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Explore Campus Needs</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCreateRequestModalOpen(true)}
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white dark:bg-slate-900 hover:bg-[#F8FBFF] dark:hover:bg-slate-800 border border-[#DCE8F7] dark:border-slate-800 text-[#172033] dark:text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>+ Post a Request (30 Sec)</span>
          </button>
        </div>

        {/* Live Needs Showcase Grid */}
        <div className="mt-14 max-w-5xl mx-auto space-y-6 text-left">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-blue-400">
              Live Campus Requests Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white font-display mt-1">
              Real Needs Happening Right Now
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {realExamples.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCategory(item.category as any);
                  setCurrentView('home');
                }}
                className="rounded-3xl border border-[#DCE8F7] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 hover:border-[#2563EB] dark:hover:border-blue-500 hover:scale-102 cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div className="relative aspect-video bg-[#F0F6FF] dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-black uppercase shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-extrabold text-sm text-[#172033] dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <div className="text-xs text-[#64748B] dark:text-slate-400 space-y-1 pt-1 border-t border-[#F0F6FF] dark:border-slate-800">
                    <div className="flex items-center gap-1 font-semibold text-[#172033] dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2 rounded-full bg-[#F8FBFF] dark:bg-slate-800 hover:bg-[#2563EB] dark:hover:bg-blue-600 text-[#172033] dark:text-slate-200 hover:text-white font-bold text-xs border border-[#DCE8F7] dark:border-slate-700 transition-colors"
                  >
                    View Need
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#DCE8F7] dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] dark:text-white font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-[#DCE8F7] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#172033] dark:text-white flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#64748B] dark:text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#64748B] dark:text-slate-400 leading-relaxed border-t border-[#F0F6FF] dark:border-slate-800 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
