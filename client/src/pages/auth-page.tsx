import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { insertBusinessSchema, loginSchema } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Create the validation schema for registration
  const registerValidationSchema = insertBusinessSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerValidationSchema>>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      businessName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      subscriptionPlan: "Free",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  // Handle register form submission
  const onRegisterSubmit = (values: z.infer<typeof registerValidationSchema>) => {
    // Remove confirmPassword as it's not part of the actual schema
    const { confirmPassword, ...businessData } = values;
    registerMutation.mutate(businessData);
  };

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left column - Forms */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-primary-600 text-4xl mb-2">
              <i className="fas fa-comments"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">All-in-One Business Feedback System</h1>
            <p className="text-gray-600 mt-2">
              Collect, manage, and analyze customer feedback in one place
            </p>
          </div>

          <Tabs 
            defaultValue="login" 
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-primary-600 hover:bg-primary-700" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <span className="flex items-center">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Logging in...
                          </span>
                        ) : "Login"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Button 
                        variant="link" 
                        className="p-0 text-primary-600" 
                        onClick={() => setActiveTab("register")}
                      >
                        Sign up here
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>
                    Enter your business details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Business Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-primary-600 hover:bg-primary-700"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <span className="flex items-center">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Creating account...
                          </span>
                        ) : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Button 
                        variant="link" 
                        className="p-0 text-primary-600" 
                        onClick={() => setActiveTab("login")}
                      >
                        Login here
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right column - Hero */}
      <div className="w-full md:w-1/2 bg-primary-600 text-white hidden md:flex flex-col justify-center p-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6">Transform Your Customer Feedback Experience</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <i className="fas fa-qrcode text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">QR Code Feedback</h3>
                <p className="mt-1 text-primary-100">Generate custom QR codes for different service areas to collect targeted feedback.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <i className="fas fa-edit text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Drag-and-Drop Builder</h3>
                <p className="mt-1 text-primary-100">Create custom feedback forms with our intuitive form builder.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Powerful Analytics</h3>
                <p className="mt-1 text-primary-100">Gain insights with AI-powered sentiment analysis and visualized feedback data.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <i className="fas fa-globe text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">Multiple Locations</h3>
                <p className="mt-1 text-primary-100">Manage feedback across all your business locations from one dashboard.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-sm text-primary-100">
            <p>Join thousands of businesses collecting feedback with our platform.</p>
            <div className="flex mt-4 items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-xs">SK</div>
                <div className="w-8 h-8 rounded-full bg-primary-300 flex items-center justify-center text-xs">JT</div>
                <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-xs">MP</div>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs">+</div>
              </div>
              <div className="ml-4 text-primary-100">
                <strong className="font-medium text-white">4.8/5</strong> from over 2,000 reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
