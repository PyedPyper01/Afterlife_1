import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Users, Book, Phone, Globe, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSupportResourcesByCategory } from '../hooks/useSupportResources';
import { useStepProgress } from '../hooks/useStepProgress';
import { useToast } from '../hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

const SupportResources = ({ onComplete, userResponses, sessionId }) => {
  const { toast } = useToast();
  const { resourcesByCategory, loading: resourcesLoading, error: resourcesError } = useSupportResourcesByCategory();
  const { progress, saveProgress, loading: progressLoading } = useStepProgress('support');
  const [selectedResources, setSelectedResources] = useState(progress?.step_data?.selectedResources || []);

  const handleResourceSelect = (resourceId) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleComplete = async () => {
    try {
      const stepData = {
        selectedResources,
        timestamp: new Date().toISOString()
      };

      // Save progress to database
      await saveProgress(stepData);
      
      // Call onComplete to finish the process
      onComplete(stepData);
      
      toast({
        title: "Support resources saved",
        description: "Your selected support resources have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving support resources:', error);
      toast({
        title: "Error saving resources",
        description: "There was a problem saving your selected resources. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (resourcesLoading) {
    return <LoadingSpinner message="Loading support resources..." />;
  }

  if (resourcesError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Unable to load support resources</h3>
            <p className="text-sm text-red-800 mb-4">
              We're having trouble loading support resources. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const emotionalResources = resourcesByCategory.emotional || [];
  const practicalResources = resourcesByCategory.practical || [];
  const financialResources = resourcesByCategory.financial || [];
  const onlineResources = resourcesByCategory.online || [];

  const renderResourceCard = (resource, index, categoryPrefix) => {
    const resourceId = `${categoryPrefix}-${index}`;
    const isSelected = selectedResources.includes(resourceId);
    
    return (
      <Card 
        key={index} 
        className={`hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => handleResourceSelect(resourceId)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span>{resource.name}</span>
            </CardTitle>
            <Badge 
              variant={isSelected ? "default" : "outline"}
              className="text-xs"
            >
              {resource.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <CardDescription>{resource.description}</CardDescription>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{resource.contact}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{resource.availability}</span>
              </div>
            </div>
            {resource.specialties && (
              <div className="flex flex-wrap gap-1 mt-2">
                {resource.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
            {resource.services && (
              <div>
                <h5 className="font-medium text-sm mb-1">Services:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {resource.services.map((service, idx) => (
                    <li key={idx}>• {service}</li>
                  ))}
                </ul>
              </div>
            )}
            {resource.eligibility && (
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                <strong>Eligibility:</strong> {resource.eligibility}
              </div>
            )}
            {resource.features && (
              <div className="flex flex-wrap gap-1 mt-2">
                {resource.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span>Support Resources</span>
          </CardTitle>
          <CardDescription>
            Find support, guidance, and resources to help you through this difficult time and beyond.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="emotional" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="emotional">Emotional</TabsTrigger>
              <TabsTrigger value="practical">Practical</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
            </TabsList>

            <TabsContent value="emotional" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Emotional Support Services</span>
                </h3>
                
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="font-medium text-pink-900 mb-2">Remember</h4>
                  <p className="text-sm text-pink-800">
                    Grief is a natural process and everyone experiences it differently. 
                    There's no "right" way to grieve, and it's important to be patient with yourself.
                  </p>
                </div>

                <div className="space-y-4">
                  {emotionalResources.map((resource, index) => 
                    renderResourceCard(resource, index, 'emotional')
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="practical" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Practical Support</span>
                </h3>
                
                <div className="space-y-4">
                  {practicalResources.map((resource, index) => 
                    renderResourceCard(resource, index, 'practical')
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Book className="w-5 h-5" />
                  <span>Financial Support</span>
                </h3>
                
                <div className="space-y-4">
                  {financialResources.map((resource, index) => 
                    renderResourceCard(resource, index, 'financial')
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="online" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Online Resources</span>
                </h3>
                
                <div className="space-y-4">
                  {onlineResources.map((resource, index) => 
                    renderResourceCard(resource, index, 'online')
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Your Journey</h4>
              <p className="text-sm text-blue-800">
                You have completed all the essential steps in our guide. Remember that grief is a personal journey, 
                and support is always available when you need it. Take care of yourself and don't hesitate to reach out.
              </p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={progressLoading}
              className="w-full flex items-center justify-center space-x-2"
            >
              {progressLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportResources;