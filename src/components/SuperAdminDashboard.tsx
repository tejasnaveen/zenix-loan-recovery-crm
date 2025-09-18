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
  Filter,
  User,
  Mail,
  X
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminFormModal, setShowAdminFormModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyAdmins, setCompanyAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [companyForm, setCompanyForm] = useState({
    id: 0,
    companyName: '',
    proprietorName: '',
    contact: '',
    email: '',
    gstNo: '',
    isActive: true
  });
  const [adminForm, setAdminForm] = useState({
    id: 0,
    companyId: 0,
    name: '',
    employeeId: '',
    username: '',
    password: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
  // Company Management Functions
  const openCompanyModal = (company = null) => {
    setEditingCompany(company);
    if (company) {
      setCompanyForm({
        id: company.id,
        companyName: company.companyName || company.name,
        proprietorName: company.proprietorName || company.admin,
        contact: company.contact || '',
        email: company.email || '',
        gstNo: company.gstNo || '',
        isActive: company.isActive !== undefined ? company.isActive : company.status === 'Active'
      });
    } else {
      setCompanyForm({
        id: 0,
        companyName: '',
        proprietorName: '',
        contact: '',
        email: '',
        gstNo: '',
        isActive: true
      });
    }
    setFormErrors({});
    setShowCompanyModal(true);
  };

  const validateCompanyForm = () => {
    const errors = {};
    
    if (!companyForm.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }
    
    if (!companyForm.proprietorName.trim()) {
      errors.proprietorName = 'Proprietor name is required';
    }
    
    if (!companyForm.contact.trim()) {
      errors.contact = 'Contact is required';
    } else if (!/^\d{10}$/.test(companyForm.contact.replace(/\D/g, ''))) {
      errors.contact = 'Contact must be a valid 10-digit number';
    }
    
    if (!companyForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyForm.email)) {
      errors.email = 'Email must be valid';
    }
    
    if (!companyForm.gstNo.trim()) {
      errors.gstNo = 'GST number is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(companyForm.gstNo)) {
      errors.gstNo = 'GST number format is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCompanyForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCompany) {
        // Update existing company
        const updatedCompanies = companies.map(company => 
          company.id === editingCompany.id 
            ? { 
                ...company, 
                companyName: companyForm.companyName,
                name: companyForm.companyName,
                proprietorName: companyForm.proprietorName,
                admin: companyForm.proprietorName,
                contact: companyForm.contact,
                email: companyForm.email,
                gstNo: companyForm.gstNo,
                isActive: companyForm.isActive,
                status: companyForm.isActive ? 'Active' : 'Inactive'
              }
            : company
        );
        setCompanies(updatedCompanies);
        alert('Company updated successfully!');
      } else {
        // Add new company
        const newCompany = {
          id: companies.length + 1,
          companyName: companyForm.companyName,
          name: companyForm.companyName,
          proprietorName: companyForm.proprietorName,
          admin: companyForm.proprietorName,
          contact: companyForm.contact,
          email: companyForm.email,
          gstNo: companyForm.gstNo,
          isActive: companyForm.isActive,
          status: companyForm.isActive ? 'Active' : 'Inactive',
          users: 0,
          plan: 'Basic',
          connections: 0,
          collections: 0,
          adminCount: 0
        };
        setCompanies([...companies, newCompany]);
        alert('Company added successfully!');
      }
      
      setShowCompanyModal(false);
      setEditingCompany(null);
    } catch (error) {
      alert('Error saving company: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleDeleteCompany = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCompanies = companies.filter(company => company.id !== selectedCompany.id);
      setCompanies(updatedCompanies);
      setShowDeleteModal(false);
      setSelectedCompany(null);
      alert('Company deleted successfully!');
    } catch (error) {
      alert('Error deleting company: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompanyStatus = async (company) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedCompanies = companies.map(c => 
        c.id === company.id 
          ? { 
              ...c, 
              isActive: !c.isActive,
              status: !c.isActive ? 'Active' : 'Inactive'
            }
          : c
      );
      setCompanies(updatedCompanies);
      alert(`Company ${!company.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Error updating company status: ' + error.message);
    }
  };

  // Admin Management Functions
  const openAdminManagement = (company) => {
    setSelectedCompany(company);
    // Simulate loading admins for this company
    const mockAdmins = [
      { id: 1, name: 'John Admin', employeeId: 'EMP001', username: 'john.admin', isActive: true },
      { id: 2, name: 'Jane Manager', employeeId: 'EMP002', username: 'jane.manager', isActive: false }
    ];
    setCompanyAdmins(mockAdmins);
    setShowAdminModal(true);
  };

  const openAdminForm = (admin = null) => {
    setEditingAdmin(admin);
    if (admin) {
      setAdminForm({
        id: admin.id,
        companyId: selectedCompany.id,
        name: admin.name,
        employeeId: admin.employeeId,
        username: admin.username,
        password: '',
        isActive: admin.isActive
      });
    } else {
      setAdminForm({
        id: 0,
        companyId: selectedCompany.id,
        name: '',
        employeeId: '',
        username: '',
        password: '',
        isActive: true
      });
    }
    setShowAdminFormModal(true);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAdmin) {
        // Update existing admin
        const updatedAdmins = companyAdmins.map(admin => 
          admin.id === editingAdmin.id 
            ? { 
                ...admin, 
                name: adminForm.name,
                employeeId: adminForm.employeeId,
                username: adminForm.username,
                isActive: adminForm.isActive
              }
            : admin
        );
        setCompanyAdmins(updatedAdmins);
        alert('Administrator updated successfully!');
      } else {
        // Add new admin
        const newAdmin = {
          id: companyAdmins.length + 1,
          name: adminForm.name,
          employeeId: adminForm.employeeId,
          username: adminForm.username,
          isActive: adminForm.isActive
        };
        setCompanyAdmins([...companyAdmins, newAdmin]);
        
        // Update company admin count
        const updatedCompanies = companies.map(company => 
          company.id === selectedCompany.id 
            ? { ...company, adminCount: (company.adminCount || 0) + 1 }
            : company
        );
        setCompanies(updatedCompanies);
        
        alert('Administrator added successfully!');
      }
      
      setShowAdminFormModal(false);
      setEditingAdmin(null);
    } catch (error) {
      alert('Error saving administrator: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminStatus = async (admin) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAdmins = companyAdmins.map(a => 
        a.id === admin.id 
          ? { ...a, isActive: !a.isActive }
          : a
      );
      setCompanyAdmins(updatedAdmins);
      alert(`Administrator ${!admin.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Error updating administrator status: ' + error.message);
    }
  };

  const resetAdminPassword = async (admin) => {
    const newPassword = prompt('Enter new password for ' + admin.name + ':');
    if (newPassword && newPassword.length >= 6) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Password reset successfully for ' + admin.name);
      } catch (error) {
        alert('Error resetting password: ' + error.message);
      }
    } else if (newPassword !== null) {
      alert('Password must be at least 6 characters long');
    }
  };

  const deleteAdmin = async (admin) => {
    if (confirm('Are you sure you want to delete administrator ' + admin.name + '?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedAdmins = companyAdmins.filter(a => a.id !== admin.id);
        setCompanyAdmins(updatedAdmins);
        
        // Update company admin count
        const updatedCompanies = companies.map(company => 
          company.id === selectedCompany.id 
            ? { ...company, adminCount: Math.max((company.adminCount || 0) - 1, 0) }
            : company
        );
        setCompanies(updatedCompanies);
        
        alert('Administrator deleted successfully!');
      } catch (error) {
        alert('Error deleting administrator: ' + error.message);
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
          <p className="text-gray-600">Manage companies, proprietors, and administrators</p>
        </div>
        <button 
          onClick={() => openCompanyModal()}
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
                  <h4 className="font-bold text-lg truncate">{company.companyName || company.name}</h4>
                  <p className="text-blue-100 text-sm">ID: {company.id}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  company.isActive || company.status === 'Active'
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {company.isActive || company.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-sm">
                <User className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Proprietor:</span>
                <span className="ml-1 font-medium">{company.proprietorName || company.admin}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-600">Contact:</span>
                <a href={`tel:${company.contact}`} className="ml-1 font-medium text-blue-600 hover:underline">
                  {company.contact || 'N/A'}
                </a>
              </div>
              
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-gray-600">Email:</span>
                <a href={`mailto:${company.email}`} className="ml-1 font-medium text-blue-600 hover:underline truncate">
                  {company.email || 'N/A'}
                </a>
              </div>
              
              <div className="flex items-center text-sm">
                <FileText className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-gray-600">GST No:</span>
                <code className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">{company.gstNo || 'N/A'}</code>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-600">Admins:</span>
                <span className="ml-1 font-medium">{company.adminCount || 0}</span>
                <button 
                  onClick={() => openAdminManagement(company)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Manage
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      openCompanyModal(company);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title="Edit Company"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => confirmDelete(company)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => toggleCompanyStatus(company)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  title="Toggle Status"
                >
                  {company.isActive || company.status === 'Active' ? (
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
            onClick={() => openCompanyModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Company
          </button>
        </div>
      )}

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={companyForm.companyName}
                      onChange={(e) => setCompanyForm({...companyForm, companyName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter company name"
                    />
                    {formErrors.companyName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.companyName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proprietor Name *
                    </label>
                    <input
                      type="text"
                      value={companyForm.proprietorName}
                      onChange={(e) => setCompanyForm({...companyForm, proprietorName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.proprietorName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter proprietor name"
                    />
                    {formErrors.proprietorName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.proprietorName}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact *
                    </label>
                    <input
                      type="tel"
                      value={companyForm.contact}
                      onChange={(e) => setCompanyForm({...companyForm, contact: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact number"
                    />
                    {formErrors.contact && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      value={companyForm.gstNo}
                      onChange={(e) => setCompanyForm({...companyForm, gstNo: e.target.value.toUpperCase()})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.gstNo ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="27ABCDE1234F1Z5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 27ABCDE1234F1Z5</p>
                    {formErrors.gstNo && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.gstNo}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center mt-3">
                      <button
                        type="button"
                        onClick={() => setCompanyForm({...companyForm, isActive: !companyForm.isActive})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          companyForm.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            companyForm.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="ml-3 text-sm text-gray-700">
                        {companyForm.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCompanyModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    {editingCompany ? 'Update Company' : 'Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="bg-red-500 text-white p-4 rounded-t-xl">
              <h3 className="text-lg font-bold flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{selectedCompany?.companyName || selectedCompany?.name}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCompany}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center"
                >
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Management Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {selectedCompany?.companyName || selectedCompany?.name} - Administrators
                </h3>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Company Administrators</h4>
                <button
                  onClick={() => openAdminForm()}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Admin
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openAdminForm(admin)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Admin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleAdminStatus(admin)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Toggle Status"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => resetAdminPassword(admin)}
                              className="text-green-600 hover:text-green-900"
                              title="Reset Password"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteAdmin(admin)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {companyAdmins.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No administrators found for this company</p>
                    <button
                      onClick={() => openAdminForm()}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Add First Admin
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      {showAdminFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-xl">
              <h3 className="text-lg font-bold">
                {editingAdmin ? 'Edit Administrator' : 'Add Administrator'}
              </h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter admin name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={adminForm.employeeId}
                    onChange={(e) => setAdminForm({...adminForm, employeeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter employee ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setAdminForm({...adminForm, isActive: !adminForm.isActive})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        adminForm.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          adminForm.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-gray-700">
                      {adminForm.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdminFormModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center"
                  >
                    {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    {editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
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