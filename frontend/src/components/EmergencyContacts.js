import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Phone, Clock, AlertTriangle, Heart } from 'lucide-react';

const EmergencyContacts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyContacts = [
    {
      name: 'Police (Non-Emergency)',
      number: '101',
      available: '24/7',
      when: 'If death is unexpected, suspicious, or occurs outside of medical care',
      type: 'emergency'
    },
    {
      name: 'NHS Direct',
      number: '111',
      available: '24/7',
      when: 'Medical questions or if you need to speak to a healthcare professional',
      type: 'medical'
    },
    {
      name: 'Samaritans',
      number: '116 123',
      available: '24/7',
      when: 'Emotional support and someone to talk to',
      type: 'support'
    },
    {
      name: 'Cruse Bereavement Care',
      number: '0808 808 1677',
      available: 'Mon-Fri 9:30am-5pm',
      when: 'Grief support and bereavement counselling',
      type: 'support'
    },
    {
      name: 'Age UK Advice Line',
      number: '0800 169 6565',
      available: 'Daily 8am-7pm',
      when: 'Practical advice and support for older people',
      type: 'advice'
    },
    {
      name: 'Citizens Advice',
      number: '0808 223 1133',
      available: 'Mon-Fri 9am-5pm',
      when: 'Legal, financial, and practical advice',
      type: 'advice'
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'advice': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'medical': return <Phone className="w-4 h-4" />;
      case 'support': return <Heart className="w-4 h-4" />;
      case 'advice': return <Phone className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>Emergency Contacts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <span>Emergency & Support Contacts</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              These contacts are available when you need immediate help or support. 
              Don't hesitate to reach out - help is always available.
            </p>
          </div>
          
          {emergencyContacts.map((contact, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    {getTypeIcon(contact.type)}
                    <span>{contact.name}</span>
                  </CardTitle>
                  <Badge className={getTypeColor(contact.type)}>
                    {contact.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-lg text-blue-600">{contact.number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{contact.available}</span>
                    </div>
                  </div>
                  <CardDescription>{contact.when}</CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Important Reminders:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Call 999 only in life-threatening emergencies</li>
              <li>• Keep important documents easily accessible</li>
              <li>• Don't hesitate to ask friends and family for help</li>
              <li>• Take breaks and look after your own wellbeing</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContacts;