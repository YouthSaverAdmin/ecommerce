import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/check/`, {
          credentials: "include",
        });
        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold tracking-tight">MyCoolSite</h1>
        <nav className="space-x-6 text-lg">
          <a href="#features" className="hover:text-purple-400 transition">
            Features
          </a>
          <a href="#about" className="hover:text-purple-400 transition">
            About
          </a>
          <a href="#contact" className="hover:text-purple-400 transition">
            Contact
          </a>

          {/* Show these links only if NOT authenticated */}
          {!authenticated && (
            <>
              <Link to="/login" className="hover:text-purple-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-purple-400 transition">
                Register
              </Link>
            </>
          )}

          {/* If authenticated, show dashboard link */}
          {authenticated && (
            <Link to="/dashboard" className="hover:text-purple-400 transition">
              Dashboard
            </Link>
          )}
        </nav>
      </header>

      <section className="h-[90vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-500">
          Welcome to the Next Generation
        </h2>
        <p className="mt-6 text-xl text-gray-300 max-w-2xl">
          We’re redefining cool. Build faster, launch smarter, and impress every
          user.
        </p>

        {/* Get Started button: if authenticated -> dashboard, else -> login */}
        <button
          onClick={() =>
            navigate(authenticated ? "/dashboard" : "/login")
          }
          className="mt-10 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg font-semibold transition-all shadow-md"
        >
          Get Started
        </button>
      </section>

      <section id="features" className="py-20 px-6">
        <h3 className="text-4xl font-bold text-center mb-12">🔥 Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white/5 rounded-xl p-6 hover:bg-purple-800 transition-all">
            <h4 className="text-xl font-semibold mb-2">Fast</h4>
            <p className="text-gray-300">
              Built with Vite and React for blazing-fast performance.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 hover:bg-purple-800 transition-all">
            <h4 className="text-xl font-semibold mb-2">Stylish</h4>
            <p className="text-gray-300">
              Tailwind CSS + custom styles for modern design.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 hover:bg-purple-800 transition-all">
            <h4 className="text-xl font-semibold mb-2">Scalable</h4>
            <p className="text-gray-300">
              Built for growth with a clean codebase structure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
