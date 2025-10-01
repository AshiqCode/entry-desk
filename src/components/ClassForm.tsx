import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClassEntry } from '@/lib/firebase';

interface ClassFormProps {
  initialData?: ClassEntry;
  onSubmit: (data: Omit<ClassEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const ClassForm = ({ initialData, onSubmit, onCancel }: ClassFormProps) => {
  const [date, setDate] = useState(initialData?.date || '');
  const [name, setName] = useState(initialData?.name || '');
  const [keyPoints, setKeyPoints] = useState<string[]>(initialData?.keyPoints || ['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Class name is required';
    } else if (name.length > 200) {
      newErrors.name = 'Class name must be less than 200 characters';
    }

    const validKeyPoints = keyPoints.filter(p => p.trim());
    if (validKeyPoints.length === 0) {
      newErrors.keyPoints = 'At least one key point is required';
    }

    keyPoints.forEach((point, index) => {
      if (point.trim() && point.length > 200) {
        newErrors[`keyPoint${index}`] = `Key point ${index + 1} must be less than 200 characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const validKeyPoints = keyPoints.filter(p => p.trim());
    
    onSubmit({
      date,
      name: name.trim(),
      keyPoints: validKeyPoints
    });
  };

  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  const removeKeyPoint = (index: number) => {
    if (keyPoints.length > 1) {
      setKeyPoints(keyPoints.filter((_, i) => i !== index));
    }
  };

  const updateKeyPoint = (index: number, value: string) => {
    const newKeyPoints = [...keyPoints];
    newKeyPoints[index] = value;
    setKeyPoints(newKeyPoints);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Class' : 'Add New Class'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Calculus — Limits"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{name.length}/200 characters</p>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Points *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addKeyPoint}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Point
              </Button>
            </div>
            
            {errors.keyPoints && <p className="text-sm text-destructive">{errors.keyPoints}</p>}
            
            <div className="space-y-3">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {index + 1}
                      </Badge>
                      <Input
                        type="text"
                        placeholder="Enter a key point..."
                        value={point}
                        onChange={(e) => updateKeyPoint(index, e.target.value)}
                        className={errors[`keyPoint${index}`] ? 'border-destructive' : ''}
                        maxLength={200}
                      />
                      {keyPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeKeyPoint(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {point.trim() && (
                      <p className="text-xs text-muted-foreground ml-12">{point.length}/200</p>
                    )}
                    {errors[`keyPoint${index}`] && (
                      <p className="text-sm text-destructive ml-12">{errors[`keyPoint${index}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? 'Update Class' : 'Add Class'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClassForm;
