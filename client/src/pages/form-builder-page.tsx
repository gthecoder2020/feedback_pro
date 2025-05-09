import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { v4 as uuidv4 } from "uuid";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Type definitions for form fields and forms
type FieldType = 
  | "shortText" 
  | "longText" 
  | "starRating" 
  | "scaleRating" 
  | "multipleChoice" 
  | "imageUpload" 
  | "videoUpload" 
  | "contactInfo" 
  | "submitButton";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// Component to render a sortable form field
function SortableFormField({ 
  field, 
  onDelete, 
  onEdit 
}: { 
  field: FormField; 
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: field.id 
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case "shortText": return "fa-font";
      case "longText": return "fa-align-left";
      case "starRating": return "fa-star";
      case "scaleRating": return "fa-sliders-h";
      case "multipleChoice": return "fa-check-square";
      case "imageUpload": return "fa-image";
      case "videoUpload": return "fa-video";
      case "contactInfo": return "fa-user";
      case "submitButton": return "fa-paper-plane";
      default: return "fa-square";
    }
  };
  
  const renderFieldPreview = () => {
    switch (field.type) {
      case "shortText":
        return (
          <Input 
            className="mt-1 block w-full" 
            placeholder={field.placeholder || "Short text input"} 
          />
        );
      case "longText":
        return (
          <Textarea 
            className="mt-1 block w-full" 
            placeholder={field.placeholder || "Long text input"} 
            rows={3} 
          />
        );
      case "starRating":
        return (
          <div className="flex space-x-4 text-2xl text-amber-400">
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
          </div>
        );
      case "scaleRating":
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">1</span>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div className="absolute top-0 left-0 h-2 w-3/4 bg-primary-500 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-500">10</span>
          </div>
        );
      case "multipleChoice":
        return (
          <div className="space-y-2">
            {(field.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
              <div key={index} className="flex items-center">
                <input type="radio" id={`option-${index}`} name="option" className="mr-2" />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "imageUpload":
        return (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-1 text-center">
              <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Upload an image</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        );
      case "videoUpload":
        return (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-1 text-center">
              <i className="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="video-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                  <span>Upload a video</span>
                  <input id="video-upload" name="video-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
            </div>
          </div>
        );
      case "contactInfo":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input type="text" placeholder="Name" className="block w-full" />
            <Input type="email" placeholder="Email" className="block w-full" />
          </div>
        );
      case "submitButton":
        return (
          <Button className="w-full bg-primary-600 hover:bg-primary-700">
            Submit Feedback
          </Button>
        );
      default:
        return <div>Unknown field type</div>;
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="border border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 cursor-move mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center" {...attributes} {...listeners}>
          <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-md mr-2">
            <i className={`fas ${getFieldIcon(field.type)}`}></i>
          </span>
          <Label className="text-sm font-medium text-gray-700 cursor-move">
            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(field.id)}
          >
            <i className="fas fa-pencil-alt text-gray-500"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onDelete(field.id)}
          >
            <i className="fas fa-trash-alt text-gray-500"></i>
          </Button>
        </div>
      </div>
      
      {renderFieldPreview()}
    </div>
  );
}

// Form component palette item
function FormComponentPaletteItem({ 
  type, 
  label, 
  icon, 
  onAdd 
}: { 
  type: FieldType; 
  label: string; 
  icon: string;
  onAdd: (type: FieldType) => void;
}) {
  return (
    <div 
      className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow cursor-grab"
      onClick={() => onAdd(type)}
    >
      <div className="flex items-center">
        <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-md">
          <i className={`fas ${icon}`}></i>
        </span>
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
}

export default function FormBuilderPage() {
  const { toast } = useToast();
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("Customer Feedback Form");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [currentField, setCurrentField] = useState<FormField | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Form components palette
  const formComponents = [
    { type: "shortText", label: "Short Text", icon: "fa-font" },
    { type: "longText", label: "Long Text", icon: "fa-align-left" },
    { type: "starRating", label: "Star Rating", icon: "fa-star" },
    { type: "scaleRating", label: "Scale Rating", icon: "fa-sliders-h" },
    { type: "multipleChoice", label: "Multiple Choice", icon: "fa-check-square" },
    { type: "imageUpload", label: "Image Upload", icon: "fa-image" },
    { type: "videoUpload", label: "Video Upload", icon: "fa-video" },
    { type: "contactInfo", label: "Contact Info", icon: "fa-user" },
    { type: "submitButton", label: "Submit Button", icon: "fa-paper-plane" }
  ] as const;
  
  // Fetch forms from the API
  const { data: forms, isLoading } = useQuery<FormTemplate[]>({
    queryKey: ['/api/forms'],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Create new form mutation
  const createFormMutation = useMutation({
    mutationFn: async (formData: { name: string; description?: string; fields: FormField[] }) => {
      const res = await apiRequest("POST", "/api/forms", formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Form created",
        description: "Your form has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
      setIsCreatingForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create form",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update form mutation
  const updateFormMutation = useMutation({
    mutationFn: async (formData: { id: string; name: string; description?: string; fields: FormField[] }) => {
      const res = await apiRequest("PUT", `/api/forms/${formData.id}`, formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Form updated",
        description: "Your form has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update form",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Load form data when a form is selected
  const loadForm = (formId: string) => {
    if (!forms) return;
    
    const form = forms.find(f => f.id === formId);
    if (!form) return;
    
    setCurrentFormId(form.id);
    setFormName(form.name);
    setFormDescription(form.description || "");
    setFields(form.fields);
  };
  
  // Create a new empty form
  const createNewForm = () => {
    setCurrentFormId(null);
    setFormName("New Feedback Form");
    setFormDescription("");
    setFields([]);
  };
  
  // Add a new field to the form
  const addField = (type: FieldType) => {
    let newField: FormField = {
      id: uuidv4(),
      type,
      label: getDefaultLabelForType(type),
      required: false
    };
    
    // Add default options for multiple choice
    if (type === "multipleChoice") {
      newField.options = ["Option 1", "Option 2", "Option 3"];
    }
    
    // Add min/max for scale rating
    if (type === "scaleRating") {
      newField.min = 1;
      newField.max = 10;
    }
    
    setFields([...fields, newField]);
  };
  
  // Get default label for field type
  const getDefaultLabelForType = (type: FieldType): string => {
    switch (type) {
      case "shortText": return "Short Text Question";
      case "longText": return "Long Text Question";
      case "starRating": return "Rate Your Experience";
      case "scaleRating": return "Rate on a Scale";
      case "multipleChoice": return "Multiple Choice Question";
      case "imageUpload": return "Upload an Image";
      case "videoUpload": return "Upload a Video";
      case "contactInfo": return "Your Contact Information";
      case "submitButton": return "Submit";
      default: return "New Field";
    }
  };
  
  // Delete a field from the form
  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };
  
  // Edit a field
  const editField = (id: string) => {
    const field = fields.find(field => field.id === id);
    if (field) {
      setCurrentField(field);
      setIsEditingField(true);
    }
  };
  
  // Save form
  const saveForm = () => {
    if (!formName.trim()) {
      toast({
        title: "Form name required",
        description: "Please provide a name for your form.",
        variant: "destructive",
      });
      return;
    }
    
    if (fields.length === 0) {
      toast({
        title: "Form cannot be empty",
        description: "Please add at least one field to your form.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = {
      id: currentFormId || uuidv4(),
      name: formName,
      description: formDescription,
      fields
    };
    
    if (currentFormId) {
      updateFormMutation.mutate(formData);
    } else {
      createFormMutation.mutate(formData);
    }
  };
  
  // Update field data
  const updateField = (updatedField: FormField) => {
    setFields(fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    ));
    setIsEditingField(false);
    setCurrentField(null);
  };
  
  // DnD event handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // Create a new array with the item moved to the new position
        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        
        return newItems;
      });
    }
    
    setActiveId(null);
  };
  
  // Mock forms data
  const mockForms: FormTemplate[] = [
    {
      id: "1",
      name: "Customer Satisfaction",
      description: "General feedback form for customer satisfaction",
      fields: [
        {
          id: "field1",
          type: "starRating",
          label: "How would you rate your experience?",
          required: true
        },
        {
          id: "field2",
          type: "shortText",
          label: "What did you like most about our service?",
          required: false,
          placeholder: "Your answer"
        },
        {
          id: "field3",
          type: "longText",
          label: "Any suggestions for improvement?",
          required: false,
          placeholder: "Your feedback helps us improve"
        },
        {
          id: "field4",
          type: "contactInfo",
          label: "Contact Information (optional)",
          required: false
        },
        {
          id: "field5",
          type: "submitButton",
          label: "Submit Feedback",
          required: false
        }
      ],
      createdAt: "2023-11-01T10:00:00Z",
      updatedAt: "2023-11-01T10:00:00Z"
    },
    {
      id: "2",
      name: "Product Feedback",
      description: "Collect feedback about specific products",
      fields: [
        {
          id: "field1",
          type: "starRating",
          label: "Rate this product",
          required: true
        },
        {
          id: "field2",
          type: "multipleChoice",
          label: "What did you purchase?",
          required: true,
          options: ["Product A", "Product B", "Product C", "Other"]
        },
        {
          id: "field3",
          type: "longText",
          label: "Tell us about your experience with the product",
          required: false,
          placeholder: "Your detailed feedback"
        },
        {
          id: "field4",
          type: "imageUpload",
          label: "Share a photo (optional)",
          required: false
        },
        {
          id: "field5",
          type: "submitButton",
          label: "Submit Review",
          required: false
        }
      ],
      createdAt: "2023-11-02T14:30:00Z",
      updatedAt: "2023-11-02T14:30:00Z"
    }
  ];
  
  // Use either real data or mock data
  const displayForms = forms || mockForms;
  
  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Create and customize feedback forms for your business
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline"
                  onClick={createNewForm}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create New Form
                </Button>
                
                <Button 
                  className="bg-primary-600 hover:bg-primary-700"
                  onClick={saveForm}
                  disabled={createFormMutation.isPending || updateFormMutation.isPending}
                >
                  {(createFormMutation.isPending || updateFormMutation.isPending) ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Form
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Form Builder Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left sidebar - Forms list */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Your Forms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <i className="fas fa-spinner fa-spin text-primary-600"></i>
                      </div>
                    ) : displayForms.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No forms created yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displayForms.map(form => (
                          <div 
                            key={form.id}
                            className={`p-3 rounded-md border cursor-pointer hover:bg-gray-50 ${
                              currentFormId === form.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                            }`}
                            onClick={() => loadForm(form.id)}
                          >
                            <div className="font-medium text-gray-900">{form.name}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <i className="fas fa-th-list mr-1"></i>
                              {form.fields.length} fields
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Form components palette */}
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Form Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formComponents.map((component) => (
                        <FormComponentPaletteItem
                          key={component.type}
                          type={component.type}
                          label={component.label}
                          icon={component.icon}
                          onAdd={addField}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content - Form editor */}
              <div className="lg:col-span-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-grow">
                        <Input
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="font-bold text-xl bg-transparent border-transparent hover:border-gray-300 focus:border-primary-500 focus:bg-white"
                          placeholder="Form Name"
                        />
                      </div>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <Button variant="ghost" size="sm">
                          <i className="fas fa-eye mr-2"></i>
                          Preview
                        </Button>
                        <Button variant="ghost" size="sm">
                          <i className="fas fa-cog mr-2"></i>
                          Settings
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Form description (optional)"
                      className="text-sm border-transparent hover:border-gray-300 focus:border-primary-500 resize-none"
                    />
                  </CardHeader>
                  
                  <CardContent>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[400px]">
                      {fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-primary-500 text-4xl mb-2">
                            <i className="fas fa-edit"></i>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">Your form is empty</h3>
                          <p className="text-gray-500 text-center max-w-md mb-4">
                            Drag and drop components from the sidebar to build your form
                          </p>
                          <Button 
                            className="bg-primary-600 hover:bg-primary-700"
                            onClick={() => addField("starRating")}
                          >
                            <i className="fas fa-plus mr-2"></i>
                            Add First Field
                          </Button>
                        </div>
                      ) : (
                        <DndContext 
                          sensors={sensors}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={fields.map(field => field.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {fields.map(field => (
                              <SortableFormField
                                key={field.id}
                                field={field}
                                onDelete={deleteField}
                                onEdit={editField}
                              />
                            ))}
                          </SortableContext>
                          
                          <DragOverlay>
                            {activeId ? (
                              <div className="border border-dashed border-primary-500 rounded-lg p-4 bg-white shadow-md opacity-90">
                                <div className="flex items-center mb-2">
                                  <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-md mr-2">
                                    <i className={`fas ${fields.find(f => f.id === activeId)?.type === "shortText" ? "fa-font" : "fa-square"}`}></i>
                                  </span>
                                  <Label className="text-sm font-medium text-gray-700">
                                    {fields.find(f => f.id === activeId)?.label}
                                  </Label>
                                </div>
                              </div>
                            ) : null}
                          </DragOverlay>
                        </DndContext>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Form settings and tips */}
                <Tabs defaultValue="tips" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="tips">
                      <i className="fas fa-lightbulb mr-2"></i>
                      Tips & Best Practices
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <i className="fas fa-cog mr-2"></i>
                      Form Settings
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tips" className="mt-2">
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <i className="fas fa-question-circle text-blue-600"></i>
                              </div>
                              <h3 className="font-medium">Keep Forms Brief</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Short forms (5-7 questions) get more responses. Focus on what matters most.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                                <i className="fas fa-check-circle text-green-600"></i>
                              </div>
                              <h3 className="font-medium">Clear Instructions</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Include clear instructions and placeholder text to guide respondents.
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                                <i className="fas fa-mobile-alt text-purple-600"></i>
                              </div>
                              <h3 className="font-medium">Mobile-Friendly</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Most users will respond on mobile devices, so keep your form mobile-friendly.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-2">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">Anonymous Submissions</h3>
                              <p className="text-sm text-gray-500">Allow customers to submit feedback anonymously</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">Confirmation Message</h3>
                              <p className="text-sm text-gray-500">Show a thank you message after submission</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">Notifications</h3>
                              <p className="text-sm text-gray-500">Receive email notifications for new submissions</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
      
      {/* Field Edit Dialog */}
      <Dialog open={isEditingField} onOpenChange={setIsEditingField}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Customize the properties of this form field
            </DialogDescription>
          </DialogHeader>
          
          {currentField && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="field-label">Field Label</Label>
                <Input 
                  id="field-label" 
                  value={currentField.label}
                  onChange={(e) => setCurrentField({
                    ...currentField,
                    label: e.target.value
                  })}
                />
              </div>
              
              {(currentField.type === "shortText" || currentField.type === "longText") && (
                <div className="grid gap-2">
                  <Label htmlFor="field-placeholder">Placeholder Text</Label>
                  <Input 
                    id="field-placeholder" 
                    value={currentField.placeholder || ""}
                    onChange={(e) => setCurrentField({
                      ...currentField,
                      placeholder: e.target.value
                    })}
                  />
                </div>
              )}
              
              {currentField.type === "multipleChoice" && (
                <div className="grid gap-2">
                  <Label>Options</Label>
                  {currentField.options?.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(currentField.options || [])];
                          newOptions[index] = e.target.value;
                          setCurrentField({
                            ...currentField,
                            options: newOptions
                          });
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newOptions = [...(currentField.options || [])];
                          newOptions.splice(index, 1);
                          setCurrentField({
                            ...currentField,
                            options: newOptions
                          });
                        }}
                        disabled={(currentField.options || []).length <= 1}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentField({
                        ...currentField,
                        options: [...(currentField.options || []), `Option ${(currentField.options || []).length + 1}`]
                      });
                    }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Option
                  </Button>
                </div>
              )}
              
              {currentField.type === "scaleRating" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="field-min">Minimum Value</Label>
                    <Input 
                      id="field-min" 
                      type="number"
                      value={currentField.min || 1}
                      onChange={(e) => setCurrentField({
                        ...currentField,
                        min: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="field-max">Maximum Value</Label>
                    <Input 
                      id="field-max" 
                      type="number"
                      value={currentField.max || 10}
                      onChange={(e) => setCurrentField({
                        ...currentField,
                        max: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="field-required" 
                  checked={currentField.required}
                  onCheckedChange={(checked) => setCurrentField({
                    ...currentField,
                    required: checked
                  })}
                />
                <Label htmlFor="field-required">Required Field</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditingField(false);
                setCurrentField(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => currentField && updateField(currentField)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
