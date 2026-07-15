import { Link } from 'react-router-dom';
import { Shield, Globe, ExternalLink, Heart } from 'lucide-react';
import { ROUTES } from '../../types';

/** Renders a titled list of footer navigation links */
function FooterLinkColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; to: string }> }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FOOTER_LINKS = {
  product: [
    { label: 'Video Chat',      to: ROUTES.CHAT },
    { label: 'AI Moderation',   to: ROUTES.HOME },
    { label: 'Safety Features', to: ROUTES.HOME },
    { label: 'Pricing',         to: ROUTES.HOME },
  ],
  company: [
    { label: 'About Us', to: ROUTES.HOME },
    { label: 'Blog',     to: ROUTES.HOME },
    { label: 'Careers',  to: ROUTES.HOME },
    { label: 'Contact',  to: ROUTES.HOME },
  ],
  legal: [
    { label: 'Privacy Policy',       to: ROUTES.HOME },
    { label: 'Terms of Service',     to: ROUTES.HOME },
    { label: 'Cookie Policy',        to: ROUTES.HOME },
    { label: 'Community Guidelines', to: ROUTES.HOME },
  ],
} as const;

/**
 * Footer — site-wide footer with brand info, navigation links, and legal info.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-950" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-5" id="footer-logo">
              <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2 rounded-xl text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                SafeConnect
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Anonymous video chat powered by AI moderation. Connect with people worldwide in a safe, secure environment.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-violet-500/30 transition-all"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white hover:border-violet-500/30 transition-all"
                aria-label="Social media"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <FooterLinkColumn title="Product" links={FOOTER_LINKS.product} />
          <FooterLinkColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterLinkColumn title="Legal" links={FOOTER_LINKS.legal} />
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} SafeConnect. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for a safer internet
          </p>
        </div>
      </div>
    </footer>
  );
}
