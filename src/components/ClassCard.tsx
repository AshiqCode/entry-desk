import { Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassEntry } from '@/lib/firebase';

interface ClassCardProps {
  classEntry: ClassEntry;
}

const ClassCard = ({ classEntry }: ClassCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const visiblePoints = classEntry.keyPoints.slice(0, 3);
  const remainingCount = classEntry.keyPoints.length - visiblePoints.length;

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 animate-fade-in">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1.5">
            <Calendar className="h-3 w-3" />
            {formatDate(classEntry.date)}
          </Badge>
        </div>
        <CardTitle className="flex items-start gap-2 text-xl">
          <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span className="line-clamp-2">{classEntry.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-3">Key Points:</p>
          <ul className="space-y-2">
            {visiblePoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>
          {remainingCount > 0 && (
            <p className="text-sm text-muted-foreground italic mt-3">
              ... +{remainingCount} more point{remainingCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
