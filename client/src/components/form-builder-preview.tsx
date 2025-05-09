import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FormBuilderPreview({ onEditForms = () => {} }) {
  const formComponents = [
    { 
      icon: 'fa-font', 
      label: 'Short Text',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-align-left', 
      label: 'Long Text',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-star', 
      label: 'Star Rating',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-sliders-h', 
      label: 'Scale Rating',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-check-square', 
      label: 'Multiple Choice',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-image', 
      label: 'Image Upload',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-video', 
      label: 'Video Upload',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-user', 
      label: 'Contact Info',
      color: 'bg-primary-100 text-primary-600'
    },
    { 
      icon: 'fa-paper-plane', 
      label: 'Submit Button',
      color: 'bg-primary-100 text-primary-600'
    }
  ];
  
  return (
    <Card className="bg-white mb-8">
      <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="font-semibold text-gray-800">Form Builder</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Create custom feedback forms with drag-and-drop</p>
        </div>
        <Button 
          className="inline-flex items-center justify-center bg-primary-600 text-white font-medium hover:bg-primary-700"
          onClick={onEditForms}
        >
          <i className="fas fa-edit mr-2"></i>
          <span>Edit Forms</span>
        </Button>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form builder preview */}
          <div className="lg:col-span-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium text-lg text-gray-900">Customer Feedback Form</h4>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                    <i className="fas fa-cog"></i>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              
              {/* Form fields mockup */}
              <div className="space-y-6">
                {/* Rating field */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    How would you rate your experience?
                  </Label>
                  <div className="flex space-x-4 text-2xl text-amber-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
                
                {/* Short text field */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Label 
                    htmlFor="feedback-like"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    What did you like most about our service?
                  </Label>
                  <Input
                    id="feedback-like"
                    type="text"
                    className="mt-1 block w-full"
                    placeholder="Your answer"
                  />
                </div>
                
                {/* Text area field */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Label
                    htmlFor="feedback-suggestions"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Any suggestions for improvement?
                  </Label>
                  <Textarea
                    id="feedback-suggestions"
                    rows={3}
                    className="mt-1 block w-full"
                    placeholder="Your feedback helps us improve"
                  />
                </div>
                
                {/* Media upload field */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Share photos or videos (optional)
                  </Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                    <div className="space-y-1 text-center">
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                {/* Contact info field */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Information (optional)
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      className="block w-full"
                      placeholder="Name"
                    />
                    <Input
                      type="email"
                      className="block w-full"
                      placeholder="Email"
                    />
                  </div>
                </div>
                
                {/* Submit button */}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move">
                  <Button 
                    type="button" 
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form components palette */}
          <div className="lg:col-span-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-4">Form Components</h4>
            
            <div className="space-y-3">
              {formComponents.map((component, index) => (
                <div 
                  key={index} 
                  className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow cursor-grab"
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 flex items-center justify-center ${component.color} rounded-md`}>
                      <i className={`fas ${component.icon}`}></i>
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-700">{component.label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <i className="fas fa-save mr-2"></i>
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
