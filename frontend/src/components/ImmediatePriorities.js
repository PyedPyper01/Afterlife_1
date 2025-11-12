import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Clock, AlertTriangle, CheckCircle, ArrowRight, Phone, FileText, Heart } from 'lucide-react';
import { useImmediateTasks } from '../hooks/useGuidanceData';
import { useStepProgress } from '../hooks/useStepProgress';
import { useToast } from '../hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

const ImmediatePriorities = ({ onComplete, userResponses, sessionId }) => {
  const { toast } = useToast();
  const assessment = userResponses?.assessment || {};
  const { tasks, loading: tasksLoading, error: tasksError } = useImmediateTasks(assessment.location);
  const { progress, saveProgress, loading: progressLoading } = useStepProgress('immediate');
  
  const [completedTasks, setCompletedTasks] = useState(
    progress?.completed_tasks || {}
  );

  const handleTaskComplete = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleContinue = async () => {
    try {
      const stepData = {
        completedTasks,
        timestamp: new Date().toISOString()
      };

      // Save progress to database
      await saveProgress(stepData);
      
      // Call onComplete to move to next step
      onComplete(stepData);
      
      toast({
        title: "Progress saved",
        description: "Your task progress has been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error saving progress",
        description: "There was a problem saving your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (tasksLoading) {
    return <LoadingSpinner message="Loading immediate priorities..." />;
  }

  if (tasksError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Unable to load guidance</h3>
            <p className="text-sm text-red-800 mb-4">
              We're having trouble loading the immediate priorities for your situation. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tasks) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-900 mb-2">No specific guidance available</h3>
            <p className="text-sm text-yellow-800 mb-4">
              We don't have specific guidance for your situation yet. Please contact our support team for assistance.
            </p>
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
            <Clock className="w-5 h-5 text-red-600" />
            <span>Immediate Priorities (First 24-48 Hours)</span>
          </CardTitle>
          <CardDescription>
            These are the most urgent tasks that need to be completed soon. Take your time, and don't hesitate to ask for help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Critical Tasks */}
            {tasks.critical && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Critical (Within 24 Hours)</span>
                </h3>
                <div className="space-y-3">
                  {tasks.critical.map((task, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`critical-${index}`}
                          checked={completedTasks[`critical-${index}`] || false}
                          onCheckedChange={() => handleTaskComplete(`critical-${index}`)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`critical-${index}`} className="font-medium cursor-pointer">
                              {task.title}
                            </label>
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{task.description}</p>
                          {task.contact && (
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <Phone className="w-4 h-4" />
                              <span>{task.contact}</span>
                            </div>
                          )}
                          {task.notes && (
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <FileText className="w-4 h-4 mt-0.5" />
                              <span>{task.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Tasks */}
            {tasks.important && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-orange-700 flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Important (Within 48 Hours)</span>
                </h3>
                <div className="space-y-3">
                  {tasks.important.map((task, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`important-${index}`}
                          checked={completedTasks[`important-${index}`] || false}
                          onCheckedChange={() => handleTaskComplete(`important-${index}`)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`important-${index}`} className="font-medium cursor-pointer">
                              {task.title}
                            </label>
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Important</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{task.description}</p>
                          {task.contact && (
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <Phone className="w-4 h-4" />
                              <span>{task.contact}</span>
                            </div>
                          )}
                          {task.notes && (
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <FileText className="w-4 h-4 mt-0.5" />
                              <span>{task.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Reminder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Remember</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    It's normal to feel overwhelmed. You don't have to do everything yourself - 
                    friends, family, and professionals are there to help you through this difficult time.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
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
                    <span>Continue to Funeral Planning</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImmediatePriorities;