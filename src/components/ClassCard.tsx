import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { ClassEntry } from '@/lib/firebase';

interface Props {
  classEntry: ClassEntry;
}

const ClassCard = ({ classEntry }: Props) => {
  // ✅ Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // ✅ Regex for URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  // ✅ Normalize URL
  const normalizeUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // ✅ Convert text → clickable links
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={normalizeUrl(part)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader>
        <div className="space-y-2">
          <Badge variant="secondary" className="gap-1.5 w-fit">
            <Calendar className="h-3 w-3" />
            {formatDate(classEntry.date)}
          </Badge>

          <CardTitle className="text-lg">
            {classEntry.name}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4">
          {classEntry.keyPoints.map((point, index) => {
            const urls = point.match(urlRegex) || [];

            return (
              <li key={index} className="text-sm">
                <div className="flex gap-2">
                  <span className="font-bold text-primary">
                    {index + 1}.
                  </span>

                  <div className="flex-1 space-y-2">
                    {/* ✅ Clickable text */}
                    <div className="break-words">
                      {renderTextWithLinks(point)}
                    </div>

                    {/* ✅ Open Link buttons
                    {urls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {urls.map((url, i) => (
                          <a
                            key={i}
                            href={normalizeUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-500 underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open Link
                          </a>
                        ))}
                      </div>
                    )} */}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ClassCard;