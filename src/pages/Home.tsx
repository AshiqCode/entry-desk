import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import ClassCard from '@/components/ClassCard';
import SearchFilters from '@/components/SearchFilters';
import Navigation from '@/components/Navigation';
import { MdMail } from "react-icons/md";
import { ClassEntry, subscribeToClasses } from '@/lib/firebase';
import Contactus from '..//pages/ContactUs';

const Home = () => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [loading, setLoading] = useState(true);

  // 🔒 Auth states
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [error, setError] = useState('');

  const handlePasswordSubmit = () => {
    if (inputPassword === 'code6') {
      setError('');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToClasses((classesData) => {
      setClasses(classesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...classes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.date.includes(query)
      );
    }

    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredClasses(filtered);
  }, [classes, searchQuery, sortOrder]);

  // 🔒 PRO POPUP LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">

        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-2xl">

          {/* Header */}
          <div className="border-b border-white/10 px-8 py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white">
              Protected Access
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Enter password to continue
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>

            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
            />

            {/* Error Message */}
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-pulse">
                {error}
              </p>
            )}

            <button
              onClick={handlePasswordSubmit}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/40 active:scale-[0.98]"
            >
              Unlock Access
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Authorized users only
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔓 MAIN CONTENT
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-hover mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Classroom Entries
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track and manage all your classroom sessions, key learnings, and educational progress
          </p>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* Classes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery ? 'No classes found.' : 'No classes yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classEntry) => (
              <ClassCard key={classEntry.id} classEntry={classEntry} />
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="text-center mt-7">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-hover">
            <MdMail className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Contact Me
          </h1>
        </div>

        <Contactus />
      </main>

      <footer className="mt-16 py-8 border-t bg-muted/30 text-center text-sm text-muted-foreground">
         This website is for informational purposes only.
<br />
 Any misuse of this platform is not my responsibility. 
<br />
Regards, Muhammad Ashiq
      </footer>
    </div>
  );
};

export default Home;