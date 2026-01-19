import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Bot, 
  FileText, 
  Zap, 
  BarChart3, 
  Globe, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Upload,
  Settings,
  Check,
  X
} from 'lucide-react';

export default function LandingPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">BotCraft AI</span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-blue-600 transition-colors hidden md:block"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-blue-600 transition-colors hidden md:block"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-blue-600 transition-colors hidden md:block"
              >
                Pricing
              </button>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 px-4 py-1">
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Powered by AI & NLP
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl max-w-4xl mx-auto bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-[1.1] pb-2">
              Transform Your Documents into Intelligent Chatbots
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your documents and create AI-powered chatbots in minutes. 
              No coding required. Deploy anywhere.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Demo
                  <MessageSquare className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Deploy in 5 Minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-8 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm border flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">User Question</p>
                      <p className="mt-1">How do I request a refund?</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-sm text-white flex items-start gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-100">AI Response</p>
                      <p className="mt-1">Refund requests are processed within 5 working days...</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Documents Loaded</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">Analytics</span>
                    </div>
                    <div className="text-2xl">342</div>
                    <div className="text-xs text-green-600">+12% this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to launch your AI chatbot</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle>1. Upload Documents</CardTitle>
                <CardDescription className="text-base">
                  Upload PDFs, DOCX, TXT, CSV, or Markdown files. Your documents become the knowledge base.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <CardTitle>2. Configure & Train</CardTitle>
                <CardDescription className="text-base">
                  Customize personality, tone, and response style. AI processes your documents using NLP.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-300 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>3. Deploy Anywhere</CardTitle>
                <CardDescription className="text-base">
                  Embed on your website with a single line of code. Start chatting instantly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create intelligent chatbots</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: 'AI-Powered Responses',
                description: 'Advanced NLP understands context and provides accurate answers from your documents.',
                color: 'blue'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Lightning Fast',
                description: 'Sub-second response times ensure smooth conversations with your users.',
                color: 'yellow'
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: 'Multi-Format Support',
                description: 'Supports PDF, DOCX, TXT, CSV, Markdown and more document formats.',
                color: 'purple'
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Advanced Analytics',
                description: 'Track conversations, popular questions, and user engagement metrics.',
                color: 'green'
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Easy Integration',
                description: 'Embed anywhere with simple JavaScript or iFrame code snippets.',
                color: 'indigo'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Secure & Private',
                description: 'Your data is encrypted and stored securely. Full GDPR compliance.',
                color: 'red'
              },
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-gray-300">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 text-${feature.color}-600`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for trying out</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>1 chatbot</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Up to 10 documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>100 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">Priority support</span>
                  </li>
                </ul>
                <Link to="/signup" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 hover:shadow-xl transition-all relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>5 chatbots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Up to 100 documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>5,000 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link to="/signup" className="block">
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited chatbots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Unlimited messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics & reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>White-label solution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>24/7 Priority support</span>
                  </li>
                </ul>
                <Link to="/signup" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-4">
            Ready to Build Your AI Chatbot?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses automating customer support with AI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">BotCraft AI</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/about">
                <Button variant="ghost">About Us</Button>
              </Link>
              <Link to="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
              <Link to="/terms">
                <Button variant="ghost">Terms of Service</Button>
              </Link>
              <Link to="/privacy">
                <Button variant="ghost">Privacy Policy</Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}