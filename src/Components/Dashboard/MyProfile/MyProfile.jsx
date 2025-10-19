/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetAllStudentQuery,
  useStudentUpdateProfileMutation,
} from "../../../../redux/Features/Api/Student/StudentApi";
import { useUploadImgMutation } from "../../../../redux/Features/Api/Image/ImageApi";

/* small Field helper */
const Field = ({ label, children, help }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {help && <p className="text-xs text-gray-400 mt-1">{help}</p>}
  </div>
);

const StudentProfile = () => {
  const { userInfo } = useSelector((s) => s.auth || {});
  const userIdFromAuth = userInfo?._id ?? userInfo?.id ?? userInfo?.userId;
  // mutations
  const [updateProfile, { isLoading: isUpdating }] = useStudentUpdateProfileMutation();
  const [uploadImg, { isLoading: isUploading }] = useUploadImgMutation();
  // fetch ALL students, skip if no user logged in
  const {
    data: allStudentsRes,
    isLoading: studentsLoading,
    isError: studentsError,
    refetch: refetchStudents,
  } = useGetAllStudentQuery(undefined, { skip: !userInfo });

  // unbox array safely
  const allStudents = allStudentsRes?.data ?? allStudentsRes ?? [];

  // find logged-in student's profile from the list
  const profile = useMemo(() => {
    if (!allStudents || !userIdFromAuth) return null;

    const uId = String(userIdFromAuth).trim().toLowerCase();

    const extractUserId = (s) => {
      if (!s && s !== 0) return null;
      if (typeof s === "string") return s;
      if (typeof s === "object") {
        if (s.$oid) return String(s.$oid);
        if (s._id) return String(s._id);
        if (s.id) return String(s.id);
      }
      return null;
    };

    return (
      allStudents.find((st) => {
        if (!st) return false;
        const cand1 = extractUserId(st.userId);
        const cand2 = extractUserId(st.user_id);
        const cand3 = st._id ? String(st._id) : null;
        const cand4 = st.userId?._id ? String(st.userId._id) : null;

        const set = [cand1, cand2, cand3, cand4].filter(Boolean).map((x) => String(x).trim().toLowerCase());
        return set.includes(uId);
      }) ?? null
    );
  }, [allStudents, userIdFromAuth]);



  // form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    gurdianName: "",
    gurdianPhone: "",
    address: "",
    profile_picture: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // derive studentId for update endpoint
  const studentId = useMemo(() => {
    if (!profile) return null;
    if (profile._id) return profile._id;
    if (profile.userId && (profile.userId._id || profile.userId.$oid)) {
      return profile._id ?? profile.userId._id ?? profile.userId.$oid;
    }
    return null;
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        email: profile.email ?? "",
        gurdianName: profile.gurdianName ?? "",
        gurdianPhone: profile.gurdianPhone ?? "",
        address: profile.address ?? "",
        profile_picture: profile.profile_picture ?? "",
      });
      setPreview(profile.profile_picture ?? null);
    }
  }, [profile]);

  // handlers
  const handleChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

 const handleSubmit = async (ev) => {
  ev.preventDefault();
  if (!form.name || !form.phone) {
    toast.error("অনুগ্রহ করে নাম ও মোবাইল নম্বর দিন।");
    return;
  }
  if (!studentId) {
    toast.error("আপনার প্রোফাইল আপডেট করা যাচ্ছেনা — student id পাওয়া যায়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।");
    return;
  }

  try {
    let profilePictureUrl = form.profile_picture ?? null;
    if (file) {
      const imgForm = new FormData();
      imgForm.append("image", file);
      const uploadRes = await uploadImg(imgForm).unwrap();
      profilePictureUrl = uploadRes?.data?.secure_url ?? uploadRes?.data?.secureUrl ?? uploadRes?.data?.url ?? null;

      if (!profilePictureUrl) {
        throw new Error("Image upload failed — no URL returned");
      }
    }

    const payload = {
      _id: studentId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      gurdianName: form.gurdianName,
      gurdianPhone: form.gurdianPhone,
      address: form.address,
      ...(profilePictureUrl ? { profile_picture: profilePictureUrl } : {}),
    };

    await updateProfile(payload).unwrap();
    toast.success("প্রোফাইল আপডেট সফল হয়েছে।");
    refetchStudents();
    setFile(null);
  } catch (err) {
    console.error("profile update error:", err);
    toast.error("আপডেটে সমস্যা হয়েছে — আবার চেষ্টা করুন।");
  }
};


  // UI states
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">লগইন করা নেই</h3>
          <p className="text-sm text-gray-600">প্রোফাইল দেখতে লগইন করুন।</p>
        </div>
      </div>
    );
  }

  if (studentsLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">লোড হচ্ছে...</div>;
  }

  if (studentsError) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">স্টুডেন্ট লিস্ট লোড করতে সমস্যা হয়েছে।</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">প্রোফাইল পাওয়া যায়নি</h3>
          <p className="text-sm text-gray-600 mb-4">তোমার অ্যাকাউন্টের সাথে মেলে এমন কোনো স্টুডেন্ট রেকর্ড পাওয়া যায়নি।</p>
          <button onClick={() => refetchStudents()} className="px-4 py-2 bg-[#c21010] text-white rounded-md">আবার চেক করো</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-10 pb-12">
        <div className=" mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 md:col-span-1 flex flex-col items-center border-r md:border-r-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-3xl font-semibold text-gray-600">{(form.name || "U").charAt(0).toUpperCase()}</div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">{form.name || "Not set"}</h3>
              <p className="text-sm text-gray-500 mt-1">{form.phone || "—"}</p>

              <div className="mt-6 w-full">
                <div className="text-xs text-gray-400 mb-2">Status</div>
                <div className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">{profile.status ?? "Active"}</div>
              </div>

              <div className="mt-6 w-full text-center">
                <p className="text-xs text-gray-500">Account created</p>
                <p className="text-sm text-gray-700">{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : "—"}</p>
              </div>
            </div>

            <div className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Student Profile</h2>
                <div className="text-sm text-gray-500">Edit your profile information</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Name">
                    <input type="text" value={form.name} onChange={handleChange("name")} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>

                  <Field label="Phone">
                    <input type="tel" readOnly value={form.phone} onChange={handleChange("phone")} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>

                  <Field label="Email (optional)">
                    <input type="email" value={form.email} onChange={handleChange("email")} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>

                  <Field label="Guardian Name">
                    <input type="text" value={form.gurdianName} onChange={handleChange("gurdianName")} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>

                  <Field label="Guardian Phone">
                    <input type="tel" value={form.gurdianPhone} onChange={handleChange("gurdianPhone")} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>

                  <Field label="Address" className="md:col-span-2">
                    <textarea value={form.address} onChange={handleChange("address")} rows={3} className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none" />
                  </Field>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={handleFile} />
                    <div className="text-sm text-gray-500">PNG / JPG, max 2MB</div>
                  </div>
                  {preview && (
                    <div className="mt-3 w-28 h-28 rounded-md overflow-hidden">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button type="submit" disabled={isUpdating || isUploading} className={`px-6 py-2 rounded-md text-white font-medium ${(isUpdating || isUploading) ? "bg-gray-400 cursor-not-allowed" : "bg-[#c21010] hover:bg-[#a50e0e]"}`}>
                    {isUploading ? "Uploading image..." : isUpdating ? "Saving..." : "Save Changes"}
                  </button>

                  <button type="button" onClick={() => { refetchStudents(); toast.info("Fresh profile loaded"); }} className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Note:</strong> ইমেজ আপলোড হলে প্রথমে Cloud এ আপলোড হবে এবং রেসপন্স থেকে `secure_url` নেওয়া হবে। সার্ভারে যদি multipart দরকার হয় তবে update endpoint multipart সমর্থন করলে কোড সামঞ্জস্য করবেন।</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
