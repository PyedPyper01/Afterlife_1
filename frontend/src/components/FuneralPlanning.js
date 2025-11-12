import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Church, ArrowRight, AlertTriangle } from 'lucide-react';
import { useFuneralPlanning, useBudgetGuide } from '../hooks/useGuidanceData';
import { useStepProgress } from '../hooks/useStepProgress';
import { useToast } from '../hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

const FuneralPlanning = ({ onComplete, userResponses, sessionId }) => {
  const { toast } = useToast();
  const assessment = userResponses?.assessment || {};
  const { planningInfo, loading: planningLoading, error: planningError } = useFuneralPlanning(assessment.religion);
  const { budgetInfo, loading: budgetLoading, error: budgetError } = useBudgetGuide(assessment.budget);
  const { progress, saveProgress, loading: progressLoading } = useStepProgress('funeral');
  
  const [planningData, setPlanningData] = useState({
    venue: progress?.step_data?.venue || '',
    date: progress?.step_data?.date || '',
    time: progress?.step_data?.time || '',
    celebrant: progress?.step_data?.celebrant || '',
    music: progress?.step_data?.music || '',
    flowers: progress?.step_data?.flowers || '',
    readings: progress?.step_data?.readings || '',
    eulogy: progress?.step_data?.eulogy || '',
    catering: progress?.step_data?.catering || '',
    transport: progress?.step_data?.transport || '',
    specialRequests: progress?.step_data?.specialRequests || ''
  });

  const handleContinue = async () => {
    try {
      const stepData = {
        planningData,
        timestamp: new Date().toISOString()
      };

      // Save progress to database
      await saveProgress(stepData);
      
      // Call onComplete to move to next step
      onComplete(stepData);
      
      toast({
        title: "Funeral planning saved",
        description: "Your funeral planning details have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving funeral planning:', error);
      toast({
        title: "Error saving planning",
        description: "There was a problem saving your funeral planning details. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (planningLoading || budgetLoading) {
    return <LoadingSpinner message="Loading funeral planning guidance..." />;
  }

  if (planningError || budgetError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Unable to load guidance</h3>
            <p className="text-sm text-red-800 mb-4">
              We're having trouble loading the funeral planning guidance. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Church className="w-5 h-5 text-purple-600" />
            <span>Funeral Planning</span>
          </CardTitle>
          <CardDescription>
            Plan the funeral service according to your loved one's wishes and your family's needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="budget">Budget Guide</TabsTrigger>
              <TabsTrigger value="guidance">Guidance</TabsTrigger>
            </TabsList>

            <TabsContent value="planning" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Service Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      placeholder="e.g., St. Mary's Church, Crematorium Chapel"
                      value={planningData.venue}
                      onChange={(e) => setPlanningData({...planningData, venue: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={planningData.date}
                      onChange={(e) => setPlanningData({...planningData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="celebrant">Celebrant/Officiant</Label>
                  <Input
                    id="celebrant"
                    placeholder="e.g., Reverend Smith, Humanist celebrant"
                    value={planningData.celebrant}
                    onChange={(e) => setPlanningData({...planningData, celebrant: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="readings">Readings & Poems</Label>
                  <Textarea
                    id="readings"
                    placeholder="List any specific readings, poems, or passages you'd like included"
                    value={planningData.readings}
                    onChange={(e) => setPlanningData({...planningData, readings: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="music">Music Selections</Label>
                  <Textarea
                    id="music"
                    placeholder="List hymns, songs, or musical pieces for the service"
                    value={planningData.music}
                    onChange={(e) => setPlanningData({...planningData, music: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="flowers">Flower Arrangements</Label>
                  <Textarea
                    id="flowers"
                    placeholder="Describe flower preferences, colors, or specific arrangements"
                    value={planningData.flowers}
                    onChange={(e) => setPlanningData({...planningData, flowers: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="special">Special Requests</Label>
                  <Textarea
                    id="special"
                    placeholder="Any other special requests or considerations"
                    value={planningData.specialRequests}
                    onChange={(e) => setPlanningData({...planningData, specialRequests: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              {budgetInfo ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">{budgetInfo.title}</h4>
                  <p className="text-sm text-green-800 mb-4">{budgetInfo.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Typical Costs Include:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {budgetInfo.costs.map((cost, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                            <span className="text-sm">{cost.item}</span>
                            <span className="text-sm font-medium">{cost.range}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-green-900 mb-2">Money-Saving Tips:</h5>
                      <ul className="text-sm text-green-800 space-y-1">
                        {budgetInfo.tips.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Budget guidance will appear here based on your assessment responses.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="guidance" className="space-y-6">
              {planningInfo ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">{planningInfo.title}</h4>
                  <p className="text-sm text-purple-800 mb-3">{planningInfo.description}</p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-purple-900">Key Considerations:</h5>
                    <ul className="text-sm text-purple-800 space-y-1">
                      {planningInfo.considerations.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Specific guidance will appear here based on your religious/cultural background.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t">
            <Button
              onClick={handleContinue}
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
                  <span>Continue to Legal & Financial</span>
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

export default FuneralPlanning;