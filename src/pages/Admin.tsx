import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ClassForm from '@/components/ClassForm';
import Navigation from '@/components/Navigation';
import { ClassEntry, subscribeToClasses, addClass, updateClass, deleteClass } from '@/lib/firebase';
import { toast } from 'sonner';

const Admin = () => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToClasses((classesData) => {
      setClasses(classesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddClass = async (data: Omit<ClassEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { error } = await addClass(data);
    
    if (error) {
      toast.error('Failed to add class', { description: error });
    } else {
      toast.success('Class added successfully!');
      setShowForm(false);
    }
  };

  const handleUpdateClass = async (data: Omit<ClassEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingClass?.id) return;

    const { error } = await updateClass(editingClass.id, data);
    
    if (error) {
      toast.error('Failed to update class', { description: error });
    } else {
      toast.success('Class updated successfully!');
      setEditingClass(null);
      setShowForm(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!deletingId) return;

    const { error } = await deleteClass(deletingId);
    
    if (error) {
      toast.error('Failed to delete class', { description: error });
    } else {
      toast.success('Class deleted successfully!');
    }
    
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your classroom entries</p>
          </div>
          
          {!showForm && !editingClass && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Class
            </Button>
          )}
        </div>

        {(showForm || editingClass) ? (
          <ClassForm
            initialData={editingClass || undefined}
            onSubmit={editingClass ? handleUpdateClass : handleAddClass}
            onCancel={() => {
              setShowForm(false);
              setEditingClass(null);
            }}
          />
        ) : (
          <div className="space-y-4">
            {classes.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No classes yet. Click "Add New Class" to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              classes.map((classEntry) => (
                <Card key={classEntry.id} className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(classEntry.date)}
                          </Badge>
                          {classEntry.updatedAt && (
                            <Badge variant="outline" className="gap-1.5">
                              <Clock className="h-3 w-3" />
                              Updated: {formatTimestamp(classEntry.updatedAt)}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{classEntry.name}</CardTitle>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingClass(classEntry);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeletingId(classEntry.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Key Points:</p>
                      <ul className="space-y-2">
                        {classEntry.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-bold mt-0.5">{index + 1}.</span>
                            <span className="text-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
