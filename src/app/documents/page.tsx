"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  FileTextIcon,
  UploadIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon,
  AlertCircleIcon,
  FileIcon,
} from "lucide-react";

interface Document {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  category: string;
  description: string | null;
  status: "pending" | "approved" | "rejected";
  upload_date: string;
  file_url: string;
  notes: string | null;
}

const documentCategories = [
  {
    id: "academic",
    name: "Academic Documents",
    description: "Transcripts, certificates, diplomas",
    icon: FileTextIcon,
    types: [".pdf", ".doc", ".docx", ".jpg", ".png"],
  },
  {
    id: "personal",
    name: "Personal Documents",
    description: "Personal statements, essays, cover letters",
    icon: FileIcon,
    types: [".pdf", ".doc", ".docx"],
  },
  {
    id: "recommendation",
    name: "Recommendation Letters",
    description: "Letters of recommendation from professors, employers",
    icon: FileTextIcon,
    types: [".pdf", ".doc", ".docx"],
  },
  {
    id: "identification",
    name: "Identification",
    description: "Passport, national ID, birth certificate",
    icon: FileIcon,
    types: [".pdf", ".jpg", ".png"],
  },
  {
    id: "financial",
    name: "Financial Documents",
    description: "Bank statements, income certificates",
    icon: FileTextIcon,
    types: [".pdf", ".doc", ".docx", ".jpg", ".png"],
  },
  {
    id: "other",
    name: "Other Documents",
    description: "Portfolio, publications, certificates",
    icon: FolderIcon,
    types: [".pdf", ".doc", ".docx", ".jpg", ".png", ".zip"],
  },
];

export default function DocumentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    files: [] as File[],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, mounted, router]);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("upload_date", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, fetchDocuments]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user || !formData.category) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      const fileKey = `${file.name}-${Date.now()}`;
      setUploadingFiles((prev) => ({ ...prev, [fileKey]: true }));

      try {
        // Upload file to Supabase Storage
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("documents").getPublicUrl(fileName);

        // Save document metadata to database
        const documentData = {
          user_id: user.id,
          filename: fileName,
          original_filename: file.name,
          file_type: file.type,
          file_size: file.size,
          category: formData.category,
          description: formData.description || null,
          status: "pending" as const,
          file_url: publicUrl,
        };

        const { error: dbError } = await supabase
          .from("documents")
          .insert([documentData]);

        if (dbError) throw dbError;

        return true;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        alert(`Failed to upload ${file.name}. Please try again.`);
        return false;
      } finally {
        setUploadingFiles((prev) => {
          const newState = { ...prev };
          delete newState[fileKey];
          return newState;
        });
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;

    if (successCount > 0) {
      alert(`${successCount} document(s) uploaded successfully!`);
      setShowUploadForm(false);
      setFormData({ category: "", description: "", files: [] });
      fetchDocuments();
    }
  };

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([fileName]);

      if (storageError) {
        console.warn("Storage deletion error:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (dbError) throw dbError;

      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "rejected":
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredDocuments = selectedCategory
    ? documents.filter((doc) => doc.category === selectedCategory)
    : documents;

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Document Management
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Upload and manage your scholarship application documents
                </p>
              </div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Upload Documents
              </button>
            </div>
          </div>

          {/* Upload Form Modal */}
          {showUploadForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Upload Documents
                    </h2>
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a category</option>
                        {documentCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe the document or add any notes..."
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Files
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-sm text-gray-600 mb-4">
                          <label className="cursor-pointer text-primary-600 hover:text-primary-500">
                            <span>Upload files</span>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.jpg,.png,.zip"
                              onChange={(e) => {
                                if (e.target.files) {
                                  setFormData({
                                    ...formData,
                                    files: Array.from(e.target.files),
                                  });
                                }
                              }}
                              className="sr-only"
                            />
                          </label>
                          <span className="text-gray-500">
                            {" "}
                            or drag and drop
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG, ZIP up to 10MB each
                        </p>
                      </div>

                      {/* Selected Files */}
                      {formData.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Selected Files:
                          </h4>
                          <div className="space-y-2">
                            {formData.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <FileIcon className="w-4 h-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({formatFileSize(file.size)})
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const newFiles = formData.files.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData({
                                      ...formData,
                                      files: newFiles,
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowUploadForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const fileList = new DataTransfer();
                          formData.files.forEach((file) =>
                            fileList.items.add(file)
                          );
                          handleFileUpload(fileList.files);
                        }}
                        disabled={
                          !formData.category ||
                          formData.files.length === 0 ||
                          Object.keys(uploadingFiles).length > 0
                        }
                        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {Object.keys(uploadingFiles).length > 0 ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Upload Files
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Categories Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Document Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedCategory("")}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedCategory === ""
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-primary-300"
                }`}
              >
                <div className="flex items-center">
                  <FolderIcon className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">All Documents</h3>
                    <p className="text-sm text-gray-600">
                      {documents.length} documents
                    </p>
                  </div>
                </div>
              </button>

              {documentCategories.map((category) => {
                const categoryCount = documents.filter(
                  (doc) => doc.category === category.id
                ).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <category.icon className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {categoryCount} documents
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Documents List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCategory
                  ? documentCategories.find((c) => c.id === selectedCategory)
                      ?.name
                  : "All Documents"}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredDocuments.length} documents
              </p>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No documents found
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory
                    ? `No documents in this category yet.`
                    : `You haven't uploaded any documents yet.`}
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white p-6 rounded-lg shadow border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                          <FileTextIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {document.original_filename}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>
                              {
                                documentCategories.find(
                                  (c) => c.id === document.category
                                )?.name
                              }
                            </span>
                            <span>{formatFileSize(document.file_size)}</span>
                            <span>
                              {new Date(
                                document.upload_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {document.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {document.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            document.status
                          )}`}
                        >
                          {getStatusIcon(document.status)}
                          <span className="ml-1 capitalize">
                            {document.status}
                          </span>
                        </span>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <a
                            href={document.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                            title="View document"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </a>
                          <a
                            href={document.file_url}
                            download={document.original_filename}
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                            title="Download document"
                          >
                            <DownloadIcon className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() =>
                              handleDeleteDocument(
                                document.id,
                                document.filename
                              )
                            }
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete document"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {document.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircleIcon className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800">
                            Review Notes:
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          {document.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
