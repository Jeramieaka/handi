import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/8">
      <div className="wrap py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-0.5 mb-5">
              <span className="text-xl font-black tracking-tight text-white">handi</span>
              <span className="w-[5px] h-[5px] rounded-full bg-accent mb-2.5" />
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-7">
              The peer-to-peer cross-city carry platform. Carry the world for someone.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="X / Twitter"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.738-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.8 1.54V6.79a4.85 4.85 0 01-1.03-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-5">Platform</p>
            <ul className="space-y-3.5">
              {[
                { label: "Browse", href: "/browse" },
                { label: "Buyer Requests", href: "/requests" },
                { label: "Post a Trip", href: "/post-trip" },
                { label: "How It Works", href: "/how-it-works" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-5">Account</p>
            <ul className="space-y-3.5">
              {[
                { label: "Sign in", href: "/signin" },
                { label: "Register", href: "/signup" },
                { label: "Your cart", href: "/cart" },
                { label: "Orders", href: "/membership" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-white/25 mb-5">Company</p>
            <ul className="space-y-3.5">
              {["About us", "Privacy Policy", "Terms of Service", "Buyer Protection"].map(l => (
                <li key={l}>
                  <span className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs text-white/25">© 2025 handi, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs text-white/25">
              <span>🔒</span> Escrow payments
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/25">
              <span>✅</span> Buyer protection
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/25">
              <span>🌍</span> Global coverage
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
