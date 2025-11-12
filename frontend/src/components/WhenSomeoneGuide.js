import React, { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import axios from 'axios';
import { ChevronRight, ChevronLeft, CheckCircle2, Phone } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

const STEPS = [
  { id: 1, name: 'Initial Assessment', description: 'Understanding your situation' },
  { id: 2, name: 'Immediate Priorities', description: 'What needs to be done now' },
  { id: 3, name: 'Funeral Planning', description: 'Arranging the service' },
  { id: 4, name: 'Legal & Financial', description: 'Estate administration' },
  { id: 5, name: 'Support Resources', description: 'Help and guidance' }
];

export default function WhenSomeoneGuide() {
  const { sessionId, createSession } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState({
    relationship: '',
    location: '',
    religion: '',
    budget: '',
    preference: 'guided'
  });
  const [guidanceData, setGuidanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      createSession();
    }
  }, [sessionId, createSession]);

  const handleNext = async () => {
    if (currentStep === 0 && assessment.relationship && assessment.location && assessment.religion && assessment.budget) {
      // Save assessment
      try {
        await axios.post(`${API_BASE}/assessments`, {
          session_id: sessionId,
          ...assessment
        });
      } catch (error) {
        console.error('Failed to save assessment:', error);
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const loadGuidance = async (category, filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, ...filters });
      const response = await axios.get(`${API_BASE}/guidance?${params}`);
      setGuidanceData(response.data);
    } catch (error) {
      console.error('Failed to load guidance:', error);
      setGuidanceData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 1 && assessment.location) {
      loadGuidance('immediate', { location: assessment.location });
    } else if (currentStep === 2 && assessment.religion) {
      loadGuidance('funeral', { religion: assessment.religion });
    }
  }, [currentStep, assessment.location, assessment.religion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Emergency Contacts Bar */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Phone className="text-red-600" size={20} />
            <span className="font-semibold text-red-900">Emergency Support:</span>
          </div>
          <div className="flex gap-4 text-sm flex-wrap">
            <a href="tel:116123" className="text-red-700 hover:underline">Samaritans: 116 123</a>
            <a href="https://www.cruse.org.uk" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline">Cruse Bereavement</a>
            <a href="tel:999" className="text-red-700 hover:underline">Emergency: 999</a>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-2 min-w-[600px]">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex flex-col items-center ${idx <= currentStep ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  idx < currentStep ? 'bg-purple-600 border-purple-600' :
                  idx === currentStep ? 'border-purple-600 bg-white' :
                  'border-gray-300 bg-white'
                }`}>
                  {idx < currentStep ? (
                    <CheckCircle2 className="text-white" size={20} />
                  ) : (
                    <span className={idx === currentStep ? 'text-purple-600 font-bold' : 'text-gray-400'}>
                      {step.id}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-[100px] hidden sm:block">{step.name}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-16 mx-2 transition-all ${idx < currentStep ? 'bg-purple-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">{STEPS[currentStep].name}</h2>
        <p className="text-gray-600 mb-6">{STEPS[currentStep].description}</p>

        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Your relationship to the deceased</label>
              <select
                value={assessment.relationship}
                onChange={(e) => setAssessment({...assessment, relationship: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="spouse">Spouse/Partner</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Where did the death occur?</label>
              <select
                value={assessment.location}
                onChange={(e) => setAssessment({...assessment, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="home">At home</option>
                <option value="hospital">Hospital</option>
                <option value="care_home">Care home</option>
                <option value="hospice">Hospice</option>
                <option value="public">Public place</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Religious/cultural preferences</label>
              <select
                value={assessment.religion}
                onChange={(e) => setAssessment({...assessment, religion: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="christian">Christian</option>
                <option value="muslim">Muslim</option>
                <option value="jewish">Jewish</option>
                <option value="hindu">Hindu</option>
                <option value="buddhist">Buddhist</option>
                <option value="sikh">Sikh</option>
                <option value="secular">Secular/Non-religious</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Budget considerations</label>
              <select
                value={assessment.budget}
                onChange={(e) => setAssessment({...assessment, budget: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="low">Low (under £2,000)</option>
                <option value="medium">Medium (£2,000-£4,000)</option>
                <option value="high">High (£4,000-£7,000)</option>
                <option value="premium">Premium (over £7,000)</option>
                <option value="unsure">Unsure</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading guidance...</p>
              </div>
            ) : guidanceData ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-semibold text-blue-900 mb-2">Immediate Actions Required</h3>
                  {guidanceData.data && guidanceData.data.tasks && (
                    <ul className="space-y-2">
                      {guidanceData.data.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <div>
                            <p className="font-medium text-gray-800">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            {task.contact && <p className="text-sm text-blue-700 mt-1">{task.contact}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Select your assessment details to see personalized guidance.</p>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading guidance...</p>
              </div>
            ) : guidanceData ? (
              <div className="space-y-4">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <h3 className="font-semibold text-purple-900 mb-2">Funeral Planning Guidance</h3>
                  {guidanceData.data && guidanceData.data.considerations && (
                    <ul className="space-y-2">
                      {guidanceData.data.considerations.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          <p className="text-gray-700">{item}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Complete the assessment to see personalized funeral planning guidance.</p>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-900 mb-2">Legal & Financial Steps</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Obtain death certificate (multiple copies recommended)</li>
                <li>• Notify banks and financial institutions</li>
                <li>• Contact pension providers</li>
                <li>• Inform insurance companies</li>
                <li>• Apply for probate if estate value exceeds threshold</li>
                <li>• Claim any bereavement benefits</li>
              </ul>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <h3 className="font-semibold text-indigo-900 mb-3">Support Organizations</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800">Cruse Bereavement Support</p>
                  <p className="text-sm text-gray-600">Free bereavement support and counselling</p>
                  <p className="text-sm text-indigo-700">0808 808 1677 | www.cruse.org.uk</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Samaritans</p>
                  <p className="text-sm text-gray-600">24/7 emotional support</p>
                  <p className="text-sm text-indigo-700">116 123 (Free)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Citizens Advice</p>
                  <p className="text-sm text-gray-600">Legal and financial guidance</p>
                  <p className="text-sm text-indigo-700">www.citizensadvice.org.uk</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Age UK</p>
                  <p className="text-sm text-gray-600">Support for older people</p>
                  <p className="text-sm text-indigo-700">0800 678 1602</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === STEPS.length - 1 || (currentStep === 0 && (!assessment.relationship || !assessment.location || !assessment.religion || !assessment.budget))}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">→</span>
            <ChevronRight size={20} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="max-w-4xl mx-auto mt-4 text-center text-sm text-gray-600">
        <p>Your progress is automatically saved. You can return anytime to continue.</p>
      </div>
    </div>
  );
}
