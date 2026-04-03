import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {/* 404 Icon */}
      <div className="flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-hover mb-6 animate-bounce">
        <MdErrorOutline className="w-10 h-10 text-primary-foreground" />
      </div>

      {/* Animated 404 Text */}
      <h1 className="text-6xl md:text-8xl font-extrabold text-center text-gradient mb-4 animate-pulse">
        404
      </h1>

      {/* Message */}
      <p className="text-lg md:text-2xl text-muted-foreground text-center mb-6 max-w-lg animate-fade-in">
        Oops! The page you’re looking for doesn’t exist. Maybe it’s on a different path, or got removed.
      </p>

      {/* Return Home Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;