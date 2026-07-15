/**
 * PageBackground — decorative full-screen blur orbs used as a background effect.
 * Accepts up to two orb color variants via Tailwind class strings.
 */
interface PageBackgroundProps {
  orb1?: string;
  orb2?: string;
}

export default function PageBackground({
  orb1 = 'top-1/4 left-1/4 bg-violet-600/8',
  orb2 = 'bottom-1/4 right-1/4 bg-indigo-600/8',
}: PageBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <div className={`absolute w-96 h-96 rounded-full blur-3xl ${orb1}`} />
      {orb2 && <div className={`absolute w-96 h-96 rounded-full blur-3xl ${orb2}`} />}
    </div>
  );
}
