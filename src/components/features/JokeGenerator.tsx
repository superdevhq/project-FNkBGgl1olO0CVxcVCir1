
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Joke {
  id: string;
  content: string;
  category: string;
}

interface JokeResponse {
  joke: Joke;
  total: number;
  categories: string[];
}

export function JokeGenerator() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async (category?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url = '/random-joke';
      if (category) {
        url += `?category=${category}`;
      }
      
      const { data, error } = await supabase.functions.invoke<JokeResponse>('random-joke', {
        method: 'GET',
        queryParams: category ? { category } : undefined,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        setJoke(data.joke);
        setCategories(data.categories);
      }
    } catch (err: any) {
      console.error('Error fetching joke:', err);
      setError(err.message || 'Failed to fetch a joke');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a joke on initial load
  useEffect(() => {
    fetchJoke();
  }, []);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      fetchJoke();
    } else {
      setSelectedCategory(category);
      fetchJoke(category);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Random Joke Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        ) : joke ? (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium">{joke.content}</p>
            <div className="mt-2">
              <Badge variant="outline" className="mt-2">
                {joke.category}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            {isLoading ? 'Loading joke...' : 'No joke loaded'}
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Filter by category:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => fetchJoke(selectedCategory || undefined)} 
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
              Loading...
            </span>
          ) : "Get Another Joke"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default JokeGenerator;
