import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';

interface ContactInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  details?: string;
  budget?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: inquiries, isLoading, refetch } = useQuery<ContactInquiry[]>({
    queryKey: ['/api/contact-inquiries'],
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading contact inquiries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Inquiries</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor all contact form submissions - {inquiries?.length || 0} total inquiries
            </p>
          </div>
          <Button onClick={() => refetch()} className="gap-2" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {!inquiries || inquiries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No inquiries yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Contact form submissions will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow" data-testid={`inquiry-${inquiry.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {inquiry.firstName} {inquiry.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(inquiry.createdAt)}
                        </span>
                        {inquiry.budget && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {inquiry.budget}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <a href={`mailto:${inquiry.email}`} className="hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Phone className="h-4 w-4 text-green-500" />
                          <a href={`tel:${inquiry.phone}`} className="hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                      {inquiry.location && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="h-4 w-4 text-red-500" />
                          {inquiry.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {inquiry.details && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Details:</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {inquiry.details}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}