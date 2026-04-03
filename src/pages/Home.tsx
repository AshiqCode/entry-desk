import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import ClassCard from '@/components/ClassCard';
import SearchFilters from '@/components/SearchFilters';
import Navigation from '@/components/Navigation';
import { MdEmail, MdMail } from "react-icons/md";
import { ClassEntry, subscribeToClasses } from '@/lib/firebase';
import Contactus from '..//pages/ContactUs'

const Home = () => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToClasses((classesData) => {
      setClasses(classesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...classes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.date.includes(query)
      );
    }

    // Apply sorting
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredClasses(filtered);
  }, [classes, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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

        {/* Search and Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {/* Classes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading classes...</p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery ? 'No classes found matching your search.' : 'No classes yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classEntry) => (
              <ClassCard key={classEntry.id} classEntry={classEntry} />
            ))}
          </div>

        )}
        <div className="text-center mt-7 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-hover ">
            <MdMail className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Contact Me
          </h1>
        </div>

        <Contactus />
      </main>

      <footer className="mt-16 py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ClassTrack © {new Date().getFullYear()} - Manage your classroom entries efficiently</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
