import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/PocketBaseAuthContext';
import { dbHelpers } from '../../pocketbase/config';
import pb from '../../pocketbase/config';
import { Upload as UploadIcon, Clock, MessageCircle, LogOut, User } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentWeek] = useState(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  });
  const [weeklyUploads, setWeeklyUploads] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch user uploads
  useEffect(() => {
    const fetchUploads = async () => {
      if (!currentUser) return;
      
      try {
        const uploadsData = await dbHelpers.getUserUploads(currentUser.id);
        setUploads(uploadsData);
        
        // Count current week uploads
        const currentWeekUploads = uploadsData.filter(
          upload => upload.week === currentWeek
        ).length;
        setWeeklyUploads(currentWeekUploads);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [currentUser, currentWeek]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!currentUser || selectedFiles.length === 0) return;
    
    // Check weekly limit
    if (weeklyUploads + selectedFiles.length > 2) {
      alert('You can only upload 2 images per week');
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Create form data
        const formData = new FormData();
        formData.append('image', file);
        formData.append('student_id', currentUser.id);
        formData.append('week', currentWeek.toString());
        formData.append('domain', currentUser.domain || '');
        
        // Upload to PocketBase
        const record = await pb.collection('uploads').create(formData);
        console.log('Upload successful:', record);
      }
      
      // Refresh uploads
      window.location.reload();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

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
              <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                Student Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {currentUser?.name} - {currentUser?.domain}
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
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Images - Week {currentWeek}
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              Weekly Progress: {weeklyUploads}/2 images uploaded
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(weeklyUploads / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={weeklyUploads >= 2}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${weeklyUploads >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {weeklyUploads >= 2 
                  ? 'Weekly upload limit reached' 
                  : 'Click to upload images (max 2 per week)'
                }
              </p>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Selected files: {selectedFiles.map(f => f.name).join(', ')}
              </p>
              <button
                onClick={handleUpload}
                disabled={uploading || weeklyUploads + selectedFiles.length > 2}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          )}
        </div>

        {/* Upload History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload History
          </h2>
          
          {uploads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No uploads yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div key={upload.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={pb.files.getUrl(upload, upload.image)}
                      alt={`Week ${upload.week} upload`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Week {upload.week} - {new Date(upload.created).toLocaleDateString()}
                    </div>
                    
                    {upload.admin_reply && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Admin Reply:</p>
                            <p className="text-sm text-blue-800 mt-1">{upload.admin_reply}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!upload.admin_reply && (
                      <p className="text-sm text-gray-500 italic">No admin reply yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
