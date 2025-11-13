import { useEffect, useState } from "react";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

export default function NoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
    try {
      await instance.post("/admin/notice", { title, content });
      toast.success("Notice posted successfully");
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (err) {
      toast.error("Failed to post notice");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* নতুন নোটিশ ফর্ম */}
      <div className="md:col-span-1">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Post New Notice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice Title"
              className="w-full rounded border p-2"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Notice Content..."
              className="w-full rounded border p-2"
              rows="6"
              required
            ></textarea>
            <button
              type="submit"
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-theme-green px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              <Plus size={20} />
              <span>Post Notice</span>
            </button>
          </form>
        </div>
      </div>

      {/* বিদ্যমান নোটিশ তালিকা */}
      <div className="md:col-span-2">
        <h2 className="mb-4 text-2xl font-bold">Posted Notices</h2>
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="rounded-lg bg-white p-4 shadow">
              <h3 className="font-bold">{notice.title}</h3>
              <p className="text-gray-600">{notice.content}</p>
              <small className="text-gray-400">
                {new Date(notice.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}