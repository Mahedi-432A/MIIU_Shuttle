import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus, FileText, Bell, Clock } from "lucide-react";

export default function NoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await instance.get("/admin/notices");
      setNotices(res.data);
    } catch (err) {
      toast.error("Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post("/admin/notice", { title, content });
      toast.success("Notice posted successfully");
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err) {
      toast.error("Failed to post notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="mt-1 text-sm text-gray-500">Post updates and announcements for students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create Notice Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900">Create New Notice</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Bus Schedule Change"
                      className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Content</label>
                  <div className="mt-2">
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your announcement details here..."
                      rows={6}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
                  >
                    {loading ? "Posting..." : "Post Notice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Notices List */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
             <div className="border-b border-gray-100 bg-gray-50/50 p-6">
              <h2 className="text-base font-semibold text-gray-900">Recent Notices</h2>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {notices.length === 0 ? (
                <li className="p-8 text-center text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No notices found.</p>
                </li>
              ) : (
                notices.map((notice) => (
                  <li key={notice._id} className="p-6 transition-colors hover:bg-gray-50">
                    <div className="flex items-start gap-x-4">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-50">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-x-4">
                          <h3 className="text-sm font-semibold leading-6 text-gray-900">{notice.title}</h3>
                          <div className="flex items-center gap-x-1 text-xs text-gray-500">
                            <Clock size={14} />
                            <time dateTime={notice.createdAt}>{new Date(notice.createdAt).toLocaleString()}</time>
                          </div>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-3">{notice.content}</p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}