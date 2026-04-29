import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HLogo, HAvatar } from '../components/primitives';
import { signIn } from '../auth';

export function PageAuth({ mode = 'signin' }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('demo@handi.com');
  const [password, setPassword] = useState('handi2026');
  const [name, setName] = useState('Maya Chen');
  const [agreed, setAgreed] = useState(true);
  const [touched, setTouched] = useState(false);

  const passwordStrength = (() => {
    if (!password) return null;
    if (password.length < 8) return { label: 'Weak', color: 'var(--rouge)' };
    if (password.length < 12) return { label: 'Medium', color: '#B5852B' };
    return { label: 'Strong', color: '#2E7D5C' };
  })();

  const isValid = (() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (!password || password.length < 8) return false;
    if (isSignup && (!name.trim() || !agreed)) return false;
    return true;
  })();

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    signIn();
    const from = searchParams.get('from');
    navigate(from || '/dashboard');
  };

  const fillDemo = () => {
    setEmail('demo@handi.com');
    setPassword('handi2026');
    if (isSignup) setName('Maya Chen');
  };
  const [forgotSent, setForgotSent] = useState(false);
  const sendForgot = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTouched(true);
      return;
    }
    setForgotSent(true);
  };
  return (
    <div className="h-app" style={{ width: '100%', minHeight: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', minHeight: 900 }}>
        {/* LEFT — form */}
        <div style={{ padding: '40px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/"><HLogo size={22}/></Link>
            <Link to={isSignup ? '/signin' : '/signup'} style={{ fontSize: 13, color: 'var(--ink-2)' }}>{isSignup ? 'Already a member? Sign in →' : 'New here? Create account →'}</Link>
          </div>

          <div style={{ maxWidth: 420 }}>
            <div className="h-eyebrow" style={{ marginBottom: 12 }}>{isSignup ? 'Join the network' : 'Welcome back'}</div>
            <h1 className="h-display" style={{ fontSize: 44, margin: 0, lineHeight: 1.02 }}>{isSignup ? <>Carry the world,<br/><span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>or have it carried.</span></> : <>Sign in to <span style={{ fontStyle: 'italic', color: 'var(--rouge)' }}>handi.</span></>}</h1>
            <p style={{ fontSize: 15, color: 'var(--ink-2)', marginTop: 16, lineHeight: 1.55 }}>
              {isSignup ? 'Free forever. Buyer or carrier — same account.' : 'Pick up where you left off.'}
            </p>

            <div style={{ display: 'grid', gap: 10, marginTop: 32 }}>
              <button style={oauthBtn}><svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4 5.6l6.2 5.2C41.5 35.5 44 30.2 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg> Continue with Google</button>
              <button style={oauthBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> Continue with Apple</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0', color: 'var(--ink-3)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.1em' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--line)' }}/>
              OR EMAIL
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--line)' }}/>
            </div>

            <div style={{ marginTop: 0, marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: 'var(--rouge-soft)', border: '1px solid rgba(139,30,45,.18)', color: 'var(--rouge-deep)', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '.02em', lineHeight: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span><strong>DEMO ACCOUNT</strong> available for testing</span>
              <button type="button" onClick={fillDemo} style={{ border: '1px solid var(--rouge)', background: 'transparent', color: 'var(--rouge-deep)', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.04em', cursor: 'pointer' }}>USE DEMO</button>
            </div>
            <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 12 }}>
              {isSignup && (
                <div>
                  <input className="h-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} aria-invalid={touched && !name.trim()}/>
                  {touched && !name.trim() && <div style={fieldError}>Please enter your full name.</div>}
                </div>
              )}
              <div>
                <input className="h-input" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" aria-invalid={touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}/>
                {touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && <div style={fieldError}>Please enter a valid email address.</div>}
              </div>
              <div>
                <input className="h-input" type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={touched && password.length < 8}/>
                {isSignup && passwordStrength && (
                  <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '.06em', color: passwordStrength.color }}>
                    PASSWORD STRENGTH · {passwordStrength.label.toUpperCase()}
                  </div>
                )}
                {touched && password.length < 8 && <div style={fieldError}>Password must be at least 8 characters.</div>}
              </div>
              {isSignup && (
                <label style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ accentColor: 'var(--rouge)', marginTop: 2 }}/>
                  <span>I agree to the <a style={{ textDecoration: 'underline' }}>Terms</a> and <a style={{ textDecoration: 'underline' }}>Privacy Policy</a>.</span>
                </label>
              )}
              {isSignup && touched && !agreed && <div style={fieldError}>Please accept the Terms to continue.</div>}
              <button type="submit" disabled={!isValid} className="h-btn h-btn-primary h-btn-lg" style={{ marginTop: 8, opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}>{isSignup ? 'Create account' : 'Sign in'} →</button>
            </form>

            {!isSignup && (
              forgotSent ? (
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--rouge-soft)', color: 'var(--rouge-deep)', fontSize: 13, lineHeight: 1.5, textAlign: 'center' }}>
                  Check {email} — we've sent reset instructions.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={sendForgot}
                  style={{ display: 'block', margin: '16px auto 0', padding: 0, background: 'none', border: 'none', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
                >Forgot password?</button>
              )
            )}
          </div>

          <div className="h-mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '.1em' }}>© 2026 HANDI · NYC · TYO · SEL</div>
        </div>

        {/* RIGHT — image testimonial */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=85" loading="lazy" aria-hidden="true" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.9)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(20,17,14,.5), rgba(20,17,14,.1))' }}/>
          <div style={{ position: 'absolute', top: 40, left: 40, color: 'var(--paper)' }}>
            <span className="h-mono" style={{ fontSize: 11, letterSpacing: '.12em', opacity: .8 }}>NOW IN FLIGHT</span>
            <div style={{ fontSize: 14, marginTop: 6 }}>Tokyo → New York · James L. · ★ 5.0</div>
          </div>
          <div style={{ position: 'absolute', bottom: 64, left: 40, right: 40, color: 'var(--paper)' }}>
            <p className="h-serif" style={{ fontSize: 36, fontStyle: 'italic', lineHeight: 1.25, letterSpacing: '-0.02em', margin: 0 }}>
              "I'd been hunting for Pokémon Center plushies for months. Found a traveler heading back from Tokyo — got them at retail in a week."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <HAvatar name="Emily R" size={40}/>
              <div>
                <div style={{ fontSize: 14 }}>Emily R.</div>
                <div className="h-mono" style={{ fontSize: 11, opacity: .7, letterSpacing: '.06em' }}>BUYER · NEW YORK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const oauthBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  padding: '14px 16px', border: '1px solid var(--line-2)', borderRadius: 'var(--r-pill)',
  background: 'var(--paper)', fontSize: 14, color: 'var(--ink)', cursor: 'pointer',
  transition: 'background .15s',
  minHeight: 44,
};

const fieldError = {
  marginTop: 6, fontSize: 12, color: 'var(--rouge)', fontFamily: 'var(--font-sans)',
};
