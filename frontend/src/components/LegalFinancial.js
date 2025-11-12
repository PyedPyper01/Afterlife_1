import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Scale, ArrowRight, FileText, AlertTriangle } from 'lucide-react';
import { useStepProgress } from '../hooks/useStepProgress';
import { useToast } from '../hooks/use-toast';

// Static data for legal/financial tasks
const legalTasks = {
  documentTasks: [
    {
      title: 'Register the death',
      description: 'Must be done within 5 days. Contact local registrar office with medical certificate.',
      timeframe: 'Within 5 days',
      documents: ['Medical certificate', 'ID', 'Marriage certificate if applicable']
    },
    {
      title: 'Obtain death certificates',
      description: 'Get multiple copies - you\'ll need them for banks, insurance, benefits, etc.',
      timeframe: 'At registration',
      documents: ['Registration forms']
    },
    {
      title: 'Notify HMRC',
      description: 'Inform about death for tax purposes. May need to complete final tax return.',
      timeframe: 'Within 3 months',
      documents: ['Death certificate', 'Tax records', 'P45/P60']
    },
    {
      title: 'Contact employer/pension providers',
      description: 'Notify current or former employers and pension scheme administrators.',
      timeframe: 'Within 1 month',
      documents: ['Death certificate', 'Employment records', 'Pension documents']
    }
  ],
  
  financialTasks: [
    {
      title: 'Contact banks and building societies',
      description: 'Notify all financial institutions where the deceased held accounts.',
      timeframe: 'Within 1 month',
      contact: 'Customer service departments'
    },
    {
      title: 'Notify credit card companies',
      description: 'Close credit card accounts and settle any outstanding balances.',
      timeframe: 'Within 1 month',
      contact: 'Card issuer customer service'
    },
    {
      title: 'Contact insurance companies',
      description: 'Notify life insurance, home insurance, and other policy providers.',
      timeframe: 'Within 1 month',
      contact: 'Policy administration departments'
    },
    {
      title: 'Notify utility companies',
      description: 'Inform gas, electricity, water, phone, and internet providers.',
      timeframe: 'Within 1 month',
      contact: 'Customer service departments'
    }
  ]
};

const LegalFinancial = ({ onComplete, userResponses, sessionId }) => {
  const { toast } = useToast();
  const { progress, saveProgress, loading: progressLoading } = useStepProgress('legal');
  const [completedTasks, setCompletedTasks] = useState(progress?.completed_tasks || {});

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
        title: "Legal & financial progress saved",
        description: "Your progress has been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving legal/financial progress:', error);
      toast({
        title: "Error saving progress",
        description: "There was a problem saving your progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-green-600" />
            <span>Legal & Financial Matters</span>
          </CardTitle>
          <CardDescription>
            Important legal and financial tasks to complete after the funeral. These can often be done over several weeks or months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Important Documents */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Important Documents</span>
              </h3>
              
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  You'll need multiple copies of the death certificate for various organizations. 
                  The registrar can provide these at the time of registration.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {legalTasks.documentTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`doc-${index}`}
                        checked={completedTasks[`doc-${index}`] || false}
                        onCheckedChange={() => handleTaskComplete(`doc-${index}`)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`doc-${index}`} className="font-medium cursor-pointer">
                            {task.title}
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {task.timeframe}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{task.description}</p>
                        {task.documents && (
                          <div className="text-xs text-gray-600">
                            <strong>Documents needed:</strong> {task.documents.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Tasks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Financial Accounts</h3>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Contact financial institutions as soon as possible to freeze accounts and understand what documentation they require.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {legalTasks.financialTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`finance-${index}`}
                        checked={completedTasks[`finance-${index}`] || false}
                        onCheckedChange={() => handleTaskComplete(`finance-${index}`)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`finance-${index}`} className="font-medium cursor-pointer">
                            {task.title}
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {task.timeframe}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{task.description}</p>
                        {task.contact && (
                          <div className="text-xs text-blue-600">
                            <strong>Contact:</strong> {task.contact}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpful Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Remember</h4>
              <p className="text-sm text-blue-800">
                These tasks don't all need to be done immediately. Take your time and don't hesitate to ask for help from family, friends, or professionals like solicitors or financial advisers.
              </p>
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
                    <span>Continue to Support Resources</span>
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

export default LegalFinancial;