import React, { useState } from 'react';
import Layout from './Layout';
import { 
  Home, 
  Phone, 
  FileText, 
  Clock, 
  Settings,
  PhoneCall,
  User as UserIcon,
  Calendar,
  DollarSign,
  AlertCircle,
  Eye,
  Copy,
  X,
  MapPin,
  CalendarDays,
  IndianRupee
} from 'lucide-react';

interface TelecallerDashboardProps {
  user: any;
  onLogout: () => void;
}

const TelecallerDashboard: React.FC<TelecallerDashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCallStatusModal, setShowCallStatusModal] = useState(false);
  const [callStatus, setCallStatus] = useState('');
  const [ptpDate, setPtpDate] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Dynamic columns configuration (would come from Company Admin settings)
  const [activeColumns] = useState([
    { id: 1, columnName: 'customerName', displayName: 'Customer Name', isActive: true },
    { id: 2, columnName: 'loanId', displayName: 'Loan ID', isActive: true },
    { id: 3, columnName: 'loanAmount', displayName: 'Loan Amount', isActive: true },
    { id: 4, columnName: 'mobileNo', displayName: 'Mobile No', isActive: true },
    { id: 5, columnName: 'dpd', displayName: 'DPD', isActive: true },
    { id: 6, columnName: 'outstandingAmount', displayName: 'Outstanding', isActive: true },
    { id: 7, columnName: 'posAmount', displayName: 'POS Amount', isActive: true },
    { id: 8, columnName: 'emiAmount', displayName: 'EMI Amount', isActive: true },
    { id: 9, columnName: 'pendingDues', displayName: 'Pending Dues', isActive: true },
    { id: 10, columnName: 'paymentLink', displayName: 'Payment Link', isActive: true },
    { id: 11, columnName: 'branchName', displayName: 'Branch Name', isActive: true },
    { id: 12, columnName: 'loanType', displayName: 'Loan Type', isActive: true },
    { id: 13, columnName: 'remarks', displayName: 'Remarks', isActive: false },
    { id: 14, columnName: 'actions', displayName: 'Actions', isActive: true }
  ]);
  const [profileData, setProfileData] = useState({
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    phone: '+91 98765 43210',
    employeeId: 'EMP001',
    department: 'Recovery Team A',
    designation: 'Senior Telecaller',
    joiningDate: '2023-06-15',
    reportingManager: 'John Smith',
    address: '123, MG Road, Bangalore, Karnataka - 560001',
    emergencyContact: '+91 98765 43211',
    emergencyContactName: 'Priya Kumar',
    bankAccount: '1234567890',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    aadharNumber: '1234 5678 9012'
  });
  const [isEditing, setIsEditing] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: Home, active: activeSection === 'dashboard', onClick: () => setActiveSection('dashboard') },
    { name: 'My Profile', icon: UserIcon, active: activeSection === 'profile', onClick: () => setActiveSection('profile') },
    { name: 'Customer Cases', icon: FileText, active: activeSection === 'customer-cases', onClick: () => setActiveSection('customer-cases') },
    { name: 'Call Log', icon: Phone, active: activeSection === 'calllog', onClick: () => setActiveSection('calllog') },
    { name: 'Schedule', icon: Clock, active: activeSection === 'schedule', onClick: () => setActiveSection('schedule') },
    { name: 'Settings', icon: Settings, active: activeSection === 'settings', onClick: () => setActiveSection('settings') },
  ];

  const customerCases = [
    {
      id: 'LN001234567',
      customerName: 'Rajesh Kumar',
      loanId: 'LN001234567',
      loanAmount: '₹5,00,000',
      mobileNo: '+91 9876543210',
      dpd: 45,
      outstandingAmount: '₹4,50,000',
      posAmount: '₹50,000',
      emiAmount: '₹15,000',
      pendingDues: '₹75,000',
      paymentLink: 'https://pay.company.com/LN001234567',
      address: '123 MG Road, Sector 15, Gurgaon, Haryana',
      sanctionDate: '2023-01-15',
      lastPaidAmount: '₹15,000',
      lastPaidDate: '2024-11-15',
      alternateNumber: '+91 9876543211',
      email: 'rajesh.kumar@email.com',
      branchName: 'Gurgaon Branch',
      loanType: 'Personal Loan',
      remarks: 'Cooperative customer'
    },
    {
      id: 'LN002345678',
      customerName: 'Sunita Sharma',
      loanId: 'LN002345678',
      loanAmount: '₹3,50,000',
      mobileNo: '+91 9876543220',
      dpd: 30,
      outstandingAmount: '₹1,95,000',
      posAmount: '₹1,55,000',
      emiAmount: '₹12,000',
      pendingDues: '₹36,000',
      paymentLink: 'https://pay.company.com/LN002345678',
      address: '456, Park Street, Mumbai, Maharashtra - 400001',
      sanctionDate: '2023-09-20',
      lastPaidAmount: '₹12,000',
      lastPaidDate: '2024-02-10',
      alternateNumber: '+91 9876543221',
      email: 'sunita.sharma@email.com',
      branchName: 'Mumbai Branch',
      loanType: 'Home Loan',
      remarks: 'Needs follow-up'
    },
    {
      id: 'LN003456789',
      customerName: 'Vikram Singh',
      loanId: 'LN003456789',
      loanAmount: '₹7,50,000',
      mobileNo: '+91 9876543230',
      dpd: 60,
      outstandingAmount: '₹4,25,000',
      posAmount: '₹3,25,000',
      emiAmount: '₹22,500',
      pendingDues: '₹67,500',
      paymentLink: 'https://pay.company.com/LN003456789',
      address: '789, Civil Lines, Delhi - 110001',
      sanctionDate: '2023-07-10',
      lastPaidAmount: '₹22,500',
      lastPaidDate: '2023-12-20',
      alternateNumber: '+91 9876543231',
      email: 'vikram.singh@email.com',
      branchName: 'Delhi Branch',
      loanType: 'Business Loan',
      remarks: 'High priority'
    },
    {
      id: 'LN004567890',
      customerName: 'Priya Agarwal',
      loanId: 'LN004567890',
      loanAmount: '₹4,25,000',
      mobileNo: '+91 9876543240',
      dpd: 15,
      outstandingAmount: '₹2,15,000',
      posAmount: '₹2,10,000',
      emiAmount: '₹14,200',
      pendingDues: '₹28,400',
      paymentLink: 'https://pay.company.com/LN004567890',
      address: '321, Anna Nagar, Chennai, Tamil Nadu - 600040',
      sanctionDate: '2023-10-05',
      lastPaidAmount: '₹14,200',
      lastPaidDate: '2024-02-25',
      alternateNumber: '+91 9876543241',
      email: 'priya.agarwal@email.com',
      branchName: 'Chennai Branch',
      loanType: 'Car Loan',
      remarks: 'Regular payer'
    }
  ];

  const callStatusOptions = [
    { value: 'WN', label: 'WN (Wrong Number)' },
    { value: 'SW', label: 'SW (Switched Off)' },
    { value: 'RNR', label: 'RNR (Ringing No Response)' },
    { value: 'BUSY', label: 'BUSY' },
    { value: 'CALL_BACK', label: 'CALL BACK' },
    { value: 'PTP', label: 'PTP (Promise to Pay)' },
    { value: 'FPTP', label: 'FPTP (False Promise to Pay)' },
    { value: 'BPTP', label: 'BPTP (Broken Promise to Pay)' },
    { value: 'RTP', label: 'RTP (Refuse to Pay)' },
    { value: 'NC', label: 'NC (No Contact)' },
    { value: 'CD', label: 'CD (Call Disconnected)' },
    { value: 'INC', label: 'INC (Incoming Call)' }
  ];

  const ptpOptions = [
    { value: 'TODAY', label: 'Today' },
    { value: 'TOMORROW', label: 'Tomorrow' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'NEXT_WEEK', label: 'Next Week' },
    { value: 'PARTIAL', label: 'Partial Payment' },
    { value: 'FULL', label: 'Full Payment' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const openDetailsModal = (caseData: any) => {
    setSelectedCase(caseData);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCase(null);
  };

  const openCallStatusModal = (caseData: any) => {
    setSelectedCase(caseData);
    setShowCallStatusModal(true);
    setCallStatus('');
    setPtpDate('');
    setCallNotes('');
  };

  const closeCallStatusModal = () => {
    setShowCallStatusModal(false);
    setSelectedCase(null);
    setCallStatus('');
    setPtpDate('');
    setCallNotes('');
  };

  const handleCallStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the call status update to your backend
    console.log('Call status updated:', {
      caseId: selectedCase?.id,
      status: callStatus,
      ptpDate: ptpDate,
      notes: callNotes
    });
    closeCallStatusModal();
  };

  const getDPDColor = (dpd: number) => {
    if (dpd <= 30) return 'text-green-600 bg-green-100';
    if (dpd <= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
    console.log('Profile updated:', profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter and pagination logic
  const filteredCases = customerCases.filter(case_ =>
    case_.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.mobileNo.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = () => {
    const activeColumnNames = activeColumns.filter(col => col.isActive && col.columnName !== 'actions');
    const headers = activeColumnNames.map(col => col.displayName).join(',');
    const rows = filteredCases.map(case_ => 
      activeColumnNames.map(col => {
        const value = case_[col.columnName as keyof typeof case_] || '';
        return `"${value}"`;
      }).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-cases.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderColumnValue = (case_: any, column: any) => {
    switch (column.columnName) {
      case 'dpd':
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDPDColor(case_.dpd)}`}>
            {case_.dpd} days
          </span>
        );
      case 'paymentLink':
        return (
          <button
            onClick={() => copyToClipboard(case_.paymentLink)}
            className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy Link
          </button>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => openDetailsModal(case_)}
              className="text-purple-600 hover:text-purple-900 inline-flex items-center text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </button>
            <button className="text-green-600 hover:text-green-900 inline-flex items-center text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Call
            </button>
            <button
              onClick={() => openCallStatusModal(case_)}
              className="text-blue-600 hover:text-blue-900 text-xs"
            >
              Update
            </button>
          </div>
        );
      default:
        const value = case_[column.columnName as keyof typeof case_];
        return (
          <span className={
            column.columnName.includes('Amount') || column.columnName.includes('Dues') 
              ? column.columnName === 'outstandingAmount' || column.columnName === 'pendingDues'
                ? 'font-medium text-red-600'
                : 'font-medium text-gray-900'
              : 'text-gray-900'
          }>
            {value || '-'}
          </span>
        );
    }
  };
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3 mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assigned Cases</p>
                    <p className="text-2xl font-bold text-gray-900">47</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-lg p-3 mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calls Today</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-3 mr-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recovery Today</p>
                    <p className="text-2xl font-bold text-gray-900">₹45K</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-lg p-3 mr-4">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Follow-ups</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Tasks and Recent Calls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Priority Cases</h3>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'CR-2024-001', 
                      customer: 'Rajesh Kumar', 
                      amount: '₹25,000', 
                      phone: '+91 98765 43210',
                      priority: 'High',
                      lastContact: '2 days ago'
                    },
                    { 
                      id: 'CR-2024-002', 
                      customer: 'Sunita Sharma', 
                      amount: '₹15,000', 
                      phone: '+91 98765 43211',
                      priority: 'Medium',
                      lastContact: '1 day ago'
                    },
                    { 
                      id: 'CR-2024-003', 
                      customer: 'Vikram Singh', 
                      amount: '₹35,000', 
                      phone: '+91 98765 43212',
                      priority: 'High',
                      lastContact: '3 days ago'
                    }
                  ].map((case_, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{case_.customer}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          case_.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {case_.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Case ID:</span> {case_.id}</p>
                        <p><span className="font-medium">Amount:</span> {case_.amount}</p>
                        <p><span className="font-medium">Phone:</span> {case_.phone}</p>
                        <p><span className="font-medium">Last Contact:</span> {case_.lastContact}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                          Call Now
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Call Activity</h3>
                <div className="space-y-4">
                  {[
                    { time: '2:30 PM', customer: 'Amit Patel', duration: '8 min', result: 'Promise to Pay', status: 'success' },
                    { time: '1:45 PM', customer: 'Meera Reddy', duration: '3 min', result: 'No Answer', status: 'failed' },
                    { time: '12:15 PM', customer: 'Rohit Gupta', duration: '12 min', result: 'Partial Payment', status: 'success' },
                    { time: '11:30 AM', customer: 'Kavita Singh', duration: '5 min', result: 'Callback Requested', status: 'pending' },
                    { time: '10:45 AM', customer: 'Deepak Kumar', duration: '15 min', result: 'Full Settlement', status: 'success' }
                  ].map((call, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        call.status === 'success' ? 'bg-green-500' :
                        call.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{call.customer}</p>
                          <span className="text-xs text-gray-500">{call.time}</span>
                        </div>
                        <p className="text-xs text-gray-600">Duration: {call.duration} • {call.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage your personal information and account settings</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isEditing 
                        ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="w-32 h-32 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <UserIcon className="w-16 h-16 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{profileData.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{profileData.designation}</p>
                      <p className="text-sm text-gray-600 mb-4">{profileData.department}</p>
                      {isEditing && (
                        <button
                          type="button"
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Change Photo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.phone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                          <p className="text-gray-900 font-medium">{profileData.employeeId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Work Information */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                          <p className="text-gray-900 font-medium">{profileData.department}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                          <p className="text-gray-900 font-medium">{profileData.designation}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                          <p className="text-gray-900 font-medium">{profileData.joiningDate}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Manager</label>
                          <p className="text-gray-900 font-medium">{profileData.reportingManager}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          {isEditing ? (
                            <textarea
                              value={profileData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.address}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={profileData.emergencyContactName}
                                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{profileData.emergencyContactName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Number</label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={profileData.emergencyContact}
                                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            ) : (
                              <p className="text-gray-900 font-medium">{profileData.emergencyContact}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.bankAccount}
                              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">****{profileData.bankAccount.slice(-4)}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.ifscCode}
                              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.ifscCode}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.panNumber}
                              onChange={(e) => handleInputChange('panNumber', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">{profileData.panNumber}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={profileData.aadharNumber}
                              onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">****{profileData.aadharNumber.slice(-4)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      
      case 'customer-cases':
        return (
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Customer Cases</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage and track your assigned loan recovery cases</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={exportToCSV}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Export CSV
                    </button>
                  </div>
                </div>
                
                {/* Search and Filter Bar */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Search by name, loan ID, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-80"
                    />
                    <span className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {activeColumns.filter(col => col.isActive).map((column) => (
                          <th key={column.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {column.displayName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCases.map((case_, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {activeColumns.filter(col => col.isActive).map((column) => (
                            <td key={column.id} className="px-4 py-4 whitespace-nowrap text-sm">
                              {renderColumnValue(case_, column)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 rounded-md text-sm font-medium"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 rounded-md text-sm font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <>
    <Layout
      user={user}
      onLogout={onLogout}
      menuItems={menuItems}
      title="Telecaller"
      roleColor="bg-purple-500"
    >
      {renderContent()}
    </Layout>

    {/* Details Modal */}
    {showDetailsModal && selectedCase && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
            <button
              onClick={closeDetailsModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loan ID</p>
                  <p className="font-medium text-gray-900">{selectedCase.loanId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium text-gray-900">{selectedCase.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="font-medium text-gray-900">{selectedCase.mobileNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alternate Number</p>
                  <p className="font-medium text-gray-900">{selectedCase.alternateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedCase.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">DPD</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDPDColor(selectedCase.dpd)}`}>
                    {selectedCase.dpd} days
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                Address
              </h4>
              <p className="text-gray-700">{selectedCase.address}</p>
            </div>

            {/* Loan Details */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <IndianRupee className="w-4 h-4 mr-2 text-green-600" />
                Loan Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="font-medium text-gray-900">{selectedCase.loanAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding Amount</p>
                  <p className="font-medium text-red-600">{selectedCase.outstandingAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">POS Amount</p>
                  <p className="font-medium text-gray-900">{selectedCase.posAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMI Amount</p>
                  <p className="font-medium text-gray-900">{selectedCase.emiAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Dues</p>
                  <p className="font-medium text-orange-600">{selectedCase.pendingDues}</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-yellow-600" />
                Payment History
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Sanction Date</p>
                  <p className="font-medium text-gray-900">{selectedCase.sanctionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Paid Amount</p>
                  <p className="font-medium text-green-600">{selectedCase.lastPaidAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Paid Date</p>
                  <p className="font-medium text-gray-900">{selectedCase.lastPaidDate}</p>
                </div>
              </div>
            </div>

            {/* Payment Link */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Payment Link</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={selectedCase.paymentLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                />
                <button
                  onClick={() => copyToClipboard(selectedCase.paymentLink)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium inline-flex items-center"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeDetailsModal}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium inline-flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Call Customer
            </button>
            <button
              onClick={() => {
                closeDetailsModal();
                openCallStatusModal(selectedCase);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
            >
              Update Call Status
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Call Status Update Modal */}
    {showCallStatusModal && selectedCase && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Update Call Status</h3>
            <button
              onClick={closeCallStatusModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleCallStatusSubmit} className="space-y-4">
            {/* Customer Info Header */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Customer: {selectedCase.customerName}</h4>
              <p className="text-sm text-gray-600">Loan ID: {selectedCase.loanId}</p>
              <p className="text-sm text-gray-600">Mobile: {selectedCase.mobileNo}</p>
              <p className="text-sm text-gray-600">Outstanding: {selectedCase.outstandingAmount}</p>
            </div>

            {/* Call Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Status <span className="text-red-500">*</span>
              </label>
              <select
                value={callStatus}
                onChange={(e) => setCallStatus(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Status</option>
                {callStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* PTP Date Selection - only show when PTP is selected */}
            {callStatus === 'PTP' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promise to Pay Date
                </label>
                <input
                  type="date"
                  value={ptpDate}
                  onChange={(e) => setPtpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            {/* Call Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Notes / Remarks
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={4}
                placeholder="Enter call details, customer response, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeCallStatusModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default TelecallerDashboard;