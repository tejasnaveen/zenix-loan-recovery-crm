import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { 
  Home, 
  Building2, 
  Users, 
  BarChart3, 
  Settings,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Phone,
  UserCheck,
  Shield,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SuperAdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [companies, setCompanies] = useState([
    { id: 1, name: 'TechCorp Finance', admin: 'John Doe', users: 45, status: 'Active', plan: 'Premium', connections: 50, collections: 3200000 },
    { id: 2, name: 'Global Lending', admin: 'Jane Smith', users: 32, status: 'Active', plan: 'Standard', connections: 30, collections: 2800000 },
    { id: 3, name: 'QuickLoans Ltd', admin: 'Mike Johnson', users: 28, status: 'Active', plan: 'Basic', connections: 25, collections: 2200000 },
    { id: 4, name: 'SecureCredit', admin: 'Sarah Wilson', users: 15, status: 'Inactive', plan: 'Standard', connections: 20, collections: 1500000 }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'Company Admin', company: 'TechCorp Finance', status: 'Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Alice Brown', email: 'alice@techcorp.com', role: 'Team Incharge', company: 'TechCorp Finance', status: 'Active', lastLogin: '2024-01-15' },
    { id: 3, name: 'Bob Wilson', email: 'bob@techcorp.com', role: 'Telecaller', company: 'TechCorp Finance', status: 'Active', lastLogin: '2024-01-14' },
    { id: 4, name: 'Jane Smith', email: 'jane@global.com', role: 'Company Admin', company: 'Global Lending', status: 'Active', lastLogin: '2024-01-15' }
  ]);

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { name: 'Companies', icon: Building2, active: activeSection === 'companies', onClick: () => setActiveSection('companies') },
    { name: 'Users', icon: Users, active: activeSection === 'users', onClick: () => setActiveSection('users') },
    { name: 'Reports', icon: FileText, active: activeSection === 'reports', onClick: () => setActiveSection('reports') },
    { name: 'VOIP/GSM', icon: Phone, active: activeSection === 'voip', onClick: () => setActiveSection('voip') },
    { name: 'Settings', icon: Settings, active: activeSection === 'settings', onClick: () => setActiveSection('settings') },
  ];

  // Chart data
  const companyCollectionsData = {
    labels: companies.map(c => c.name),
    datasets: [
      {
        label: 'Collections (₹)',
        data: companies.map(c => c.collections),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collections Trend',
        data: [1200000, 1500000, 1900000, 2200000, 2800000, 3200000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Chart options for stability
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + (value / 100000).toFixed(0) + 'L';
          }
        }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + (value / 100000).toFixed(0) + 'L';
          }
        }
      }
    }
  };
  const renderDashboard = () => (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3 mr-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3 mr-4">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Company Admin').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3 mr-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Telecallers</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'Telecaller').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3 mr-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collections</p>
              <p className="text-2xl font-bold text-gray-900">₹{(companies.reduce((sum, c) => sum + c.collections, 0) / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company-wise Collections</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <Bar data={companyCollectionsData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collections Trend</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <Line data={trendData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Company Activities</h3>
          <div className="space-y-4">
            {[
              { company: 'TechCorp Finance', action: 'New registration', status: 'success' },
              { company: 'Global Lending', action: 'Updated settings', status: 'info' },
              { company: 'QuickLoans Ltd', action: 'Payment processed', status: 'success' },
              { company: 'SecureCredit', action: 'Warning: High default rate', status: 'warning' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.company}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Server Status</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">VOIP Gateway</span>
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-yellow-600 font-medium">Maintenance</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backup Status</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600 font-medium">Up to date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Company Management</h3>
          <p className="text-gray-600">Manage companies with beautiful card interface</p>
        </div>
        <button 
          onClick={() => setShowCompanyModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Company
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg truncate">{company.name}</h4>
                  <p className="text-blue-100 text-sm">ID: {company.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  company.status === 'Active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {company.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-sm">
                <Building2 className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Admin:</span>
                <span className="ml-1 font-medium">{company.admin}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-600">Users:</span>
                <span className="ml-1 font-medium">{company.users}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Plan:</span>
                <span className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${
                  company.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                  company.plan === 'Standard' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {company.plan}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-orange-500 mr-2" />
                <span className="text-gray-600">Connections:</span>
                <span className="ml-1 font-medium">{company.connections}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600">Collections:</span>
                <span className="ml-1 font-bold text-green-600">₹{(company.collections / 100000).toFixed(1)}L</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setEditingCompany(company);
                      setShowCompanyModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Edit Company"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  title="Toggle Status"
                >
                  {company.status === 'Active' ? (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center">
                                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      Inactive
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Companies Found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first company</p>
          <button 
            onClick={() => setShowCompanyModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Company
          </button>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-600">Manage all system users and their permissions</p>
        </div>
        <button 
          onClick={() => setShowUserModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'Company Admin' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'Team Incharge' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Reset Password">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Block/Unblock">
                        <Shield className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Force Logout">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Export PDF
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Export Excel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );

  const renderVOIPGSM = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">VOIP/GSM Gateway Integration</h3>
        
        {/* Gateway Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-2 mr-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">VOIP Gateway</p>
                <p className="text-lg font-bold text-green-900">Online</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-yellow-500 rounded-lg p-2 mr-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">GSM Gateway</p>
                <p className="text-lg font-bold text-yellow-900">Maintenance</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-lg p-2 mr-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Active Calls</p>
                <p className="text-lg font-bold text-blue-900">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Plan */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">🚀 VOIP/GSM Integration Roadmap</h4>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h5 className="font-semibold text-gray-900">Phase 1: VOIP Integration (Weeks 1-2)</h5>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Integrate with Asterisk/FreePBX server</li>
                <li>• Implement SIP protocol support</li>
                <li>• Add WebRTC for browser-based calling</li>
                <li>• Create call logging and recording system</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h5 className="font-semibold text-gray-900">Phase 2: GSM Gateway (Weeks 3-4)</h5>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Connect GSM gateways (Dinstar, Yeastar)</li>
                <li>• Implement SMS functionality</li>
                <li>• Add multi-SIM card support</li>
                <li>• Create failover mechanisms</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h5 className="font-semibold text-gray-900">Phase 3: Advanced Features (Weeks 5-6)</h5>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Auto-dialer with predictive dialing</li>
                <li>• Call queue management</li>
                <li>• Real-time analytics dashboard</li>
                <li>• Integration with CRM workflow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">🏗️ Technical Architecture</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">VOIP Stack</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Server:</strong> Asterisk/FreePBX</li>
                <li>• <strong>Protocol:</strong> SIP/RTP</li>
                <li>• <strong>Web Integration:</strong> WebRTC</li>
                <li>• <strong>API:</strong> Asterisk REST Interface (ARI)</li>
                <li>• <strong>Database:</strong> PostgreSQL for CDR</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">GSM Integration</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Hardware:</strong> Dinstar GSM Gateway</li>
                <li>• <strong>Protocol:</strong> SIP Trunk</li>
                <li>• <strong>SMS:</strong> SMPP/HTTP API</li>
                <li>• <strong>Management:</strong> SNMP monitoring</li>
                <li>• <strong>Redundancy:</strong> Multiple SIM slots</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cost Estimation */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-blue-900 mb-4">💰 Implementation Cost Estimate</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-blue-800 mb-2">Hardware Costs</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Asterisk Server: $2,000 - $5,000</li>
                <li>• GSM Gateway (8-port): $1,500 - $3,000</li>
                <li>• Network Equipment: $500 - $1,000</li>
                <li>• <strong>Total Hardware: $4,000 - $9,000</strong></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-blue-800 mb-2">Development Costs</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• VOIP Integration: 80-120 hours</li>
                <li>• GSM Integration: 60-80 hours</li>
                <li>• UI/UX Development: 40-60 hours</li>
                <li>• <strong>Total Development: 180-260 hours</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Roles & Permissions</h4>
          <p className="text-sm text-gray-600">Configure user roles and their permissions</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">System Configuration</h4>
          <p className="text-sm text-gray-600">Manage system-wide settings and preferences</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'companies': return renderCompanies();
      case 'users': return renderUsers();
      case 'reports': return renderReports();
      case 'voip': return renderVOIPGSM();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      title="Super Admin"
      roleColor="bg-red-500"
    >
      {renderContent()}
    </Layout>
  );
};

export default SuperAdminDashboard;