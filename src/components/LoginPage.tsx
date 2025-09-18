import React, { useState } from 'react';
import { Building2, Users, Phone, Shield, User, ChevronRight, Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activePanel, setActivePanel] = useState<'user' | 'superadmin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string}>({});
  const [rememberMe, setRememberMe] = useState(false);

  const userRoles = [
    {
      id: 'companyadmin',
      name: 'Company Admin',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      description: 'Manage company operations and team oversight',
      credentials: { username: 'admin', password: 'admin123' }
    },
    {
      id: 'teamincharge',
      name: 'Team In-charge',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      description: 'Supervise teams and manage case assignments',
      credentials: { username: 'team', password: 'team123' }
    },
    {
      id: 'telecaller',
      name: 'Telecaller',
      icon: Phone,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      description: 'Handle customer interactions and call logging',
      credentials: { username: 'caller', password: 'caller123' }
    }
  ];

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleLogin = (roleId: string) => {
    const role = userRoles.find(r => r.id === roleId);
    if (role) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          name: `Demo ${role.name}`,
          role: roleId
        });
        setIsLoading(false);
      }, 800);
    }
  };

  const handleSuperAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'superadmin-001',
        name: 'Super Administrator',
        role: 'superadmin'
      });
      setIsLoading(false);
    }, 800);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (activePanel === 'superadmin') {
        if (username === 'superadmin' && password === 'super123') {
          handleSuperAdminLogin();
        } else {
          setErrors({ username: 'Invalid Super Admin credentials' });
          setIsLoading(false);
        }
      } else {
        const role = userRoles.find(r => 
          r.credentials.username === username && r.credentials.password === password
        );
        if (role) {
          handleRoleLogin(role.id);
        } else {
          setErrors({ username: 'Invalid username or password' });
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            ZENIX
          </h1>
          <p className="text-xl text-slate-600 mb-2 font-medium">Loan Recovery CRM</p>
          <p className="text-lg text-slate-500">Secure access to your recovery management system</p>
        </div>

        {/* Panel Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="grid grid-cols-2 gap-2">
              {/* User Login Selector */}
              <button
                onClick={() => setActivePanel('user')}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activePanel === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <User className="w-5 h-5" />
                  <span>User Login</span>
                </div>
                {activePanel === 'user' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>

              {/* Super Admin Selector */}
              <button
                onClick={() => setActivePanel('superadmin')}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activePanel === 'superadmin'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>Super Admin</span>
                </div>
                {activePanel === 'superadmin' && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Login Form Panel */}
          <div className="order-2 xl:order-1">
            <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden ${
              activePanel === 'superadmin' ? 'ring-2 ring-red-200' : 'ring-2 ring-blue-200'
            }`}>
              {/* Form Header */}
              <div className={`px-8 py-6 ${
                activePanel === 'superadmin' 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {activePanel === 'superadmin' ? (
                      <Shield className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {activePanel === 'superadmin' ? 'Super Administrator' : 'User Access'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {activePanel === 'superadmin' 
                        ? 'System-wide management and control' 
                        : 'Company operations and customer management'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form onSubmit={handleFormLogin} className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errors.username) setErrors({...errors, username: undefined});
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.username 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-4`}
                        placeholder="Enter your username"
                      />
                      {errors.username && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({...errors, password: undefined});
                        }}
                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                          errors.password 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-4`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-slate-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                      activePanel === 'superadmin'
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:ring-red-200'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-200'
                    } ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'} focus:ring-4 focus:outline-none`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Demo Credentials
                  </h4>
                  {activePanel === 'superadmin' ? (
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><span className="font-medium">Username:</span> superadmin</p>
                      <p><span className="font-medium">Password:</span> super123</p>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-600 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded border">
                          <p className="font-medium text-blue-700">Company Admin</p>
                          <p>admin / admin123</p>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <p className="font-medium text-emerald-700">Team In-charge</p>
                          <p>team / team123</p>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <p className="font-medium text-purple-700">Telecaller</p>
                          <p>caller / caller123</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Panel */}
          <div className="order-1 xl:order-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Quick Access</h3>
                <p className="text-slate-600">Click any option below for instant demo access</p>
              </div>

              {activePanel === 'superadmin' ? (
                <div className="space-y-6">
                  {/* Super Admin Quick Access */}
                  <button
                    onClick={handleSuperAdminLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                        <Shield className="w-8 h-8" />
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="font-bold text-lg">Super Administrator</h4>
                        <p className="text-red-100 text-sm">Complete system control and oversight</p>
                      </div>
                      <ChevronRight className="w-6 h-6 ml-4" />
                    </div>
                  </button>

                  {/* Super Admin Features */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                    <h4 className="font-semibold text-red-800 mb-4">Super Admin Capabilities</h4>
                    <div className="space-y-3">
                      {[
                        'Manage all companies and users',
                        'System-wide analytics and reports',
                        'VOIP/GSM gateway configuration',
                        'Global settings and permissions',
                        'Performance monitoring and alerts'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-red-700">
                          <CheckCircle className="w-4 h-4 mr-3 text-red-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* User Role Quick Access */}
                  {userRoles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleRoleLogin(role.id)}
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r ${role.color} ${role.hoverColor} text-white rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-75 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-bold">{role.name}</h4>
                            <p className="text-white/80 text-sm">{role.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 ml-4" />
                        </div>
                      </button>
                    );
                  })}

                  {/* User Hierarchy Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mt-6">
                    <h4 className="font-semibold text-blue-800 mb-4">Access Hierarchy</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-blue-700">
                        <Building2 className="w-4 h-4 mr-3 text-blue-500" />
                        <span><strong>Company Admin</strong> → Full company oversight</span>
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <Users className="w-4 h-4 mr-3 text-emerald-500" />
                        <span><strong>Team In-charge</strong> → Team management</span>
                      </div>
                      <div className="flex items-center text-sm text-blue-700">
                        <Phone className="w-4 h-4 mr-3 text-purple-500" />
                        <span><strong>Telecaller</strong> → Customer interactions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Secure demo environment • All data is simulated for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;