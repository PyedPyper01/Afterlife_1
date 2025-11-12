import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { assessmentApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

// Static data for form options
const formOptions = {
  relationships: [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'child', label: 'Child' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other family member' },
    { value: 'professional', label: 'Professional (lawyer, carer, etc.)' }
  ],
  locations: [
    { value: 'home', label: 'At home' },
    { value: 'hospital', label: 'In hospital' },
    { value: 'care_home', label: 'In care home' },
    { value: 'hospice', label: 'In hospice' },
    { value: 'public', label: 'In public place' },
    { value: 'other', label: 'Other location' }
  ],
  religions: [
    { value: 'christian', label: 'Christian' },
    { value: 'muslim', label: 'Muslim' },
    { value: 'jewish', label: 'Jewish' },
    { value: 'hindu', label: 'Hindu' },
    { value: 'buddhist', label: 'Buddhist' },
    { value: 'sikh', label: 'Sikh' },
    { value: 'secular', label: 'Secular/Non-religious' },
    { value: 'other', label: 'Other' }
  ],
  budgets: [
    { value: 'low', label: 'Under £3,000' },
    { value: 'medium', label: '£3,000 - £6,000' },
    { value: 'high', label: '£6,000 - £10,000' },
    { value: 'premium', label: 'Over £10,000' },
    { value: 'unsure', label: 'Not sure yet' }
  ],
  preferences: [
    { value: 'burial', label: 'Burial' },
    { value: 'cremation', label: 'Cremation' },
    { value: 'unsure', label: 'Not sure yet' },
    { value: 'no_preference', label: 'No preference' }
  ],
  timelines: [
    { value: 'asap', label: 'As soon as possible' },
    { value: 'week', label: 'Within a week' },
    { value: 'two_weeks', label: 'Within two weeks' },
    { value: 'month', label: 'Within a month' },
    { value: 'flexible', label: 'Flexible timing' }
  ]
};

const InitialAssessment = ({ onComplete, userResponses, sessionId }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    relationship: userResponses?.assessment?.relationship || '',
    location: userResponses?.assessment?.location || '',
    religion: userResponses?.assessment?.religion || '',
    budget: userResponses?.assessment?.budget || '',
    preference: userResponses?.assessment?.preference || '',
    timeline: userResponses?.assessment?.timeline || '',
    specialCircumstances: userResponses?.assessment?.specialCircumstances || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.relationship || !formData.location || !formData.religion || !formData.budget || !formData.preference) {
      toast({
        title: "Please complete all required fields",
        description: "All fields except timeline and special circumstances are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Save assessment to database
      const assessmentData = {
        session_id: sessionId,
        relationship: formData.relationship,
        location: formData.location,
        religion: formData.religion,
        budget: formData.budget,
        preference: formData.preference,
        timeline: formData.timeline,
        special_circumstances: formData.specialCircumstances
      };

      await assessmentApi.create(assessmentData);
      
      // Call onComplete with the form data
      onComplete(formData);
      
      toast({
        title: "Assessment saved",
        description: "Your responses have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error saving assessment",
        description: "There was a problem saving your responses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.relationship && formData.location && formData.religion && formData.budget && formData.preference;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Initial Assessment</span>
          </CardTitle>
          <CardDescription>
            Please answer a few questions to help us provide you with the most relevant guidance for your situation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Relationship */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What is your relationship to the deceased?</Label>
            <RadioGroup value={formData.relationship} onValueChange={(value) => setFormData({...formData, relationship: value})}>
              {formOptions.relationships.map(rel => (
                <div key={rel.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={rel.value} id={rel.value} />
                  <Label htmlFor={rel.value} className="cursor-pointer">{rel.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Where did the death occur?</Label>
            <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.locations.map(loc => (
                  <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Religion */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Religious or cultural background</Label>
            <Select value={formData.religion} onValueChange={(value) => setFormData({...formData, religion: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select religious or cultural background" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.religions.map(rel => (
                  <SelectItem key={rel.value} value={rel.value}>{rel.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Approximate budget for funeral arrangements</Label>
            <RadioGroup value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
              {formOptions.budgets.map(budget => (
                <div key={budget.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={budget.value} id={budget.value} />
                  <Label htmlFor={budget.value} className="cursor-pointer">{budget.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Preference */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Burial or cremation preference</Label>
            <RadioGroup value={formData.preference} onValueChange={(value) => setFormData({...formData, preference: value})}>
              {formOptions.preferences.map(pref => (
                <div key={pref.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={pref.value} id={pref.value} />
                  <Label htmlFor={pref.value} className="cursor-pointer">{pref.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <Label className="text-base font-medium">When would you like to hold the funeral? (Optional)</Label>
            <RadioGroup value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
              {formOptions.timelines.map(time => (
                <div key={time.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={time.value} id={time.value} />
                  <Label htmlFor={time.value} className="cursor-pointer">{time.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Special Circumstances */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Any special circumstances or concerns? (Optional)</Label>
            <Textarea
              placeholder="Please describe any special circumstances, health concerns, or specific wishes..."
              value={formData.specialCircumstances}
              onChange={(e) => setFormData({...formData, specialCircumstances: e.target.value})}
              className="min-h-20"
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue to Immediate Priorities</span>
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

export default InitialAssessment;