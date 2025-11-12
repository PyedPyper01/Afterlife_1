import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Heart, Phone, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { useToast } from '../hooks/use-toast';
import InitialAssessment from './InitialAssessment';
import ImmediatePriorities from './ImmediatePriorities';
import FuneralPlanning from './FuneralPlanning';
import LegalFinancial from './LegalFinancial';
import SupportResources from './SupportResources';
import EmergencyContacts from './EmergencyContacts';
import LoadingSpinner from './LoadingSpinner';

const WhenSomeoneGuide = () => {
  const { session, createSession, updateSession, loading: sessionLoading } = useSession();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 'assessment', title: 'Initial Assessment', component: InitialAssessment },
    { id: 'immediate', title: 'Immediate Priorities', component: ImmediatePriorities },
    { id: 'funeral', title: 'Funeral Planning', component: FuneralPlanning },
    { id: 'legal', title: 'Legal & Financial', component: LegalFinancial },
    { id: 'support', title: 'Support Resources', component: SupportResources }
  ];

  // Initialize session if it doesn't exist
  useEffect(() => {
    if (!session && !sessionLoading) {
      createSession().catch(err => {
        toast({
          title: "Error",
          description: "Failed to initialize session. Please refresh the page.",
          variant: "destructive"
        });
      });
    }
  }, [session, sessionLoading, createSession, toast]);

  // Sync current step with session
  useEffect(() => {
    if (session) {
      setCurrentStep(session.current_step);
      setIsComplete(session.is_complete);
    }
  }, [session]);

  const handleStepComplete = async (stepData) => {
    if (!session) return;
    
    setLoading(true);
    
    try {
      const updatedResponses = {
        ...session.user_responses,
        [steps[currentStep].id]: stepData
      };
      
      const nextStep = currentStep + 1;
      const isLastStep = nextStep >= steps.length;
      
      await updateSession({
        current_step: isLastStep ? currentStep : nextStep,
        is_complete: isLastStep,
        user_responses: updatedResponses
      });
      
      if (isLastStep) {
        setIsComplete(true);
        toast({
          title: "Guidance Complete",
          description: "You have completed all steps. Support resources remain available to you.",
          variant: "default"
        });
      } else {
        setCurrentStep(nextStep);
        toast({
          title: "Progress Saved",
          description: `Moved to ${steps[nextStep].title}`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 0 && session) {
      setLoading(true);
      
      try {
        const prevStep = currentStep - 1;
        await updateSession({
          current_step: prevStep,
          is_complete: false
        });
        
        setCurrentStep(prevStep);
        setIsComplete(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to go back. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep]?.component;

  if (sessionLoading) {
    return <LoadingSpinner message="Initializing guidance session..." />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Connection Issue</CardTitle>
            <CardDescription className="text-center">
              Unable to start your guidance session. Please refresh the page to try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">When Someone Dies</h1>
                <p className="text-sm text-gray-600">A gentle guide through difficult times</p>
              </div>
            </div>
            <EmergencyContacts />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        {!isComplete ? (
          <div className="space-y-6">
            {/* Support Message */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">
                      We understand this is an incredibly difficult time. Take your time with each step, 
                      and remember that help is available whenever you need it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            {CurrentStepComponent && (
              <CurrentStepComponent
                onComplete={handleStepComplete}
                userResponses={session.user_responses}
                sessionId={session.id}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || loading}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-6 h-6" />
                <span>Guidance Complete</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                You have completed all the essential steps. Remember, support is always available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-green-800">
                  Your personalized action plan has been created and saved. 
                  You can return to any section if you need to review or update information.
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handlePrevious()}
                    variant="outline"
                    className="border-green-300 text-green-800 hover:bg-green-100"
                    disabled={loading}
                  >
                    Review Steps
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    Support Resources
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Saving progress...</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WhenSomeoneGuide;