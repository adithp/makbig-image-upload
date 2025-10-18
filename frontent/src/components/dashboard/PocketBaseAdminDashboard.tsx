import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/PocketBaseAuthContext';
import { dbHelpers } from '../../pocketbase/config';
import pb from '../../pocketbase/config';
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  Plus, 
  Trash2, 
  LogOut, 
  User as UserIcon,
  Filter
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'uploads' | 'students' | 'domains'>('uploads');
  const [students, setStudents] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsData = await dbHelpers.getStudents();
        setStudents(studentsData);

        // Fetch domains
        const domainsData = await dbHelpers.getDomains();
        setDomains(domainsData);

        // Fetch uploads
        const uploadsData = await dbHelpers.getAllUploads();
        setUploads(uploadsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddDomain = async (domainName: string) => {
    try {
      await dbHelpers.addDomain(domainName);
      // Refresh domains
      const domainsData = await dbHelpers.getDomains();
      setDomains(domainsData);
    } catch (error) {
      console.error('Error adding domain:', error);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      await dbHelpers.deleteDomain(domainId);
      // Refresh domains
      const domainsData = await dbHelpers.getDomains();
      setDomains(domainsData);
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  const handleReply = async (uploadId: string, reply: string) => {
    try {
      await dbHelpers.updateUploadReply(uploadId, reply);
      
      // Update local state
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, admin_reply: reply }
          : upload
      ));
      
      setReplyText(prev => ({ ...prev, [uploadId]: '' }));
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Filter uploads
  const filteredUploads = uploads.filter(upload => {
    const weekMatch = selectedWeek === 'all' || upload.week === selectedWeek;
    const domainMatch = selectedDomain === 'all' || upload.domain === selectedDomain;
    return weekMatch && domainMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Makbig Academy</h1>
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-1" />
                {currentUser?.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'uploads'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Student Uploads
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('domains')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'domains'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-5 w-5 inline mr-2" />
                Domains ({domains.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'uploads' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Filter className="h-5 w-5 inline mr-2" />
                Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Week
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Weeks</option>
                    {Array.from({ length: 52 }, (_, i) => i + 1).map(week => (
                      <option key={week} value={week}>Week {week}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain.id} value={domain.name}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Uploads Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Student Uploads ({filteredUploads.length})
              </h3>
              
              {filteredUploads.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No uploads found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUploads.map((upload) => {
                    const student = students.find(s => s.id === upload.student_id);
                    return (
                      <div key={upload.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                          <img
                            src={pb.files.getUrl(upload, upload.image)}
                            alt={`Upload by ${student?.name}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900">{student?.name}</p>
                            <p className="text-sm text-gray-600">{upload.domain} - Week {upload.week}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(upload.created).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <textarea
                              placeholder="Add admin reply..."
                              value={replyText[upload.id] || ''}
                              onChange={(e) => setReplyText(prev => ({ 
                                ...prev, 
                                [upload.id]: e.target.value 
                              }))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              rows={2}
                            />
                            
                            <button
                              onClick={() => handleReply(upload.id, replyText[upload.id] || '')}
                              disabled={!replyText[upload.id]?.trim()}
                              className="w-full bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <MessageCircle className="h-4 w-4 inline mr-1" />
                              Reply
                            </button>
                          </div>
                          
                          {upload.admin_reply && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-blue-900">Admin Reply:</p>
                              <p className="text-sm text-blue-800 mt-1">{upload.admin_reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Students ({students.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.created).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'domains' && (
          <div className="space-y-6">
            {/* Add Domain */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Domain
              </h3>
              <AddDomainForm onAdd={handleAddDomain} />
            </div>

            {/* Domains List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Domains ({domains.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{domain.name}</h4>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(domain.created).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Domain Form Component
const AddDomainForm: React.FC<{ onAdd: (name: string) => void }> = ({ onAdd }) => {
  const [domainName, setDomainName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    setLoading(true);
    try {
      await onAdd(domainName.trim());
      setDomainName('');
    } catch (error) {
      console.error('Error adding domain:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4">
      <input
        type="text"
        value={domainName}
        onChange={(e) => setDomainName(e.target.value)}
        placeholder="Domain name (e.g., Python, Full Stack)"
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        required
      />
      <button
        type="submit"
        disabled={loading || !domainName.trim()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        {loading ? 'Adding...' : 'Add Domain'}
      </button>
    </form>
  );
};

export default AdminDashboard;


