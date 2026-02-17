import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Chrome } from 'lucide-react';
import heroImg from '../assets/AuthModel2.jpg';
import { AuthContext } from '../context/AuthContext.jsx';

export function AuthModal() {
    const { authOpen, closeAuth, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [authOpen]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setOtpSent(true);
                setTimer(60);
                setOtp('');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Make sure the server is running.');
            console.error('Error sending OTP:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                setUser({ email });
                closeAuth();
                navigate('/dashboard');
            } else {
                setError(data.message || 'Failed to verify OTP');
            }
        } catch (err) {
            setError('Failed to verify OTP. Make sure the server is running.');
            console.error('Error verifying OTP:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setTimer(60);
                setOtp('');
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Failed to resend OTP. Make sure the server is running.');
            console.error('Error resending OTP:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!authOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-5xl h-screen bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left imagery (desktop only) */}
                <div className="hidden md:block h-full">
                    <img src={heroImg} alt="Welcome illustration" className="w-full h-full object-cover" />
                </div>

                {/* Right: form content */}
                <div className="relative h-full overflow-auto">
                    {/* Fixed Close Button */}
                    <button
                        onClick={closeAuth}
                        aria-label="Close"
                        className="absolute top-6 right-6 text-foreground/60 hover:text-foreground z-10 cursor-pointer"
                    >
                        ✕
                    </button>

                    {/* Centered Content */}
                    <div className="flex items-start justify-center min-h-full px-6 md:px-10 pt-20">
                        <div className="w-full max-w-md">
                            <div className="pb-8">
                                <h2 className="text-2xl font-bold">Sign in / Sign up</h2>
                                <p className="mt-2 mb-4 text-sm text-foreground/70">
                                    We'll sign you in or create an account if <br></br>you don't have one yet.
                                </p>
                            </div>
                            <div className="space-y-10">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                                >
                                    <Chrome size={18} className="text-blue-500" />
                                    <span className="text-sm">Continue with Google</span>
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-border flex-1" />
                                    <span className="text-sm text-foreground/60">OR</span>
                                    <div className="h-px bg-border flex-1" />
                                </div>
                                <form onSubmit={!otpSent ? handleEmailSubmit : handleOtpSubmit} className="space-y-3">
                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    {!otpSent ? (
                                        <>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your work or personal email"
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 rounded-lg border disabled:opacity-50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={loading || !email}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-lg bg-primary text-white font-medium cursor-pointer hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed",
                                                    email ? "opacity-100" : "opacity-60"
                                                )}
                                            >
                                                {loading ? 'Sending...' : 'Continue'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-sm text-foreground/70 mb-3">
                                                    Enter the 6-digit OTP sent to <strong>{email}</strong>
                                                </p>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        placeholder="Enter your OTP"
                                                        maxLength="6"
                                                        disabled={loading}
                                                        className="w-full px-4 py-3 rounded-lg border text-center text-md text-left tracking-widest pr-20 disabled:opacity-50"
                                                    />
                                                    <span className={cn(
                                                        "absolute right-4 top-1/2 transform -translate-y-1/2 font-medium text-sm",
                                                        timer > 0 ? "text-orange-500" : "text-red-500"
                                                    )}>
                                                        {timer > 0 ? `${formatTime(timer)}` : "Expired"}
                                                    </span>
                                                </div>
                                            </div>
                                            {timer === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={loading}
                                                    className="w-full text-sm text-primary hover:underline cursor-pointer disabled:opacity-50"
                                                >
                                                    {loading ? 'Sending...' : 'Resend OTP'}
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={otp.length !== 6 || loading}
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-lg bg-primary text-white font-medium cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed",
                                                    otp.length === 6 ? "hover:bg-primary/90 opacity-100" : "opacity-60"
                                                )}
                                            >
                                                {loading ? 'Verifying...' : 'Verify OTP'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtp('');
                                                    setTimer(0);
                                                    setError('');
                                                }}
                                                disabled={loading}
                                                className="w-full text-sm text-primary hover:underline cursor-pointer disabled:opacity-50"
                                            >
                                                Change Email
                                            </button>
                                        </>
                                    )}
                                    <p className=" text-xs text-foreground/60">
                                        By signing up or signing in, you agree to our{" "}
                                        <a href="/terms" className="text-primary underline">
                                            Terms
                                        </a>&nbsp;
                                        and &nbsp;
                                        <a href="/privacy" className="text-primary underline">
                                            Privacy Policy
                                        </a>.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
