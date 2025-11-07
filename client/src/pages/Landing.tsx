import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Clock, Target, TrendingUp, CheckCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';

interface LandingProps {
  onGetStarted: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function Landing({ onGetStarted, isDark, toggleDark }: LandingProps) {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Grading",
      description: "Advanced AI evaluates papers with precision and provides detailed feedback instantly."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description: "Reduce grading time by 80% while maintaining high-quality feedback for students."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Consistent Evaluation",
      description: "Ensure fair and consistent grading across all papers with customizable rubrics."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor student progress with detailed analytics and performance insights."
    }
  ];

  const benefits = [
    "Instant automated grading",
    "Detailed performance analytics",
    "Customizable rubrics",
    "Multi-class management",
    "Secure cloud storage",
    "24/7 availability"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Header */}
      <header className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <span className="font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">Eval AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">AI-Powered Paper Evaluator</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-purple-600" />}
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700">
              <span className="text-purple-700 dark:text-purple-300">✨ The Future of Paper Evaluation</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Grade Papers
              <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Transform your grading workflow with AI-powered evaluation. Save time, ensure consistency, and provide better feedback to your students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
              >
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Papers Graded</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-500 rounded-full blur-3xl opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Essay Evaluation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Advanced AI Analysis</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Grammar & Style</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: '95%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">95%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Content Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: '88%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">88%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Structure</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">92%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Overall Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">A-</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Teachers Love Eval AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make your grading experience seamless and efficient
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveFeature(index)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-300 dark:border-purple-600 shadow-lg scale-105'
                    : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to
                <span className="block bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  Grade Smarter
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join hundreds of teachers who have transformed their grading workflow with our comprehensive suite of tools.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-3xl p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <h3 className="text-3xl font-bold mb-4">Start Free Today</h3>
                  <p className="text-purple-100 mb-6">
                    No credit card required. Get started in minutes and see the difference AI-powered grading can make.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Grade up to 50 papers/month free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Full access to all features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate('/auth')}
                    size="lg"
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 Eval AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
