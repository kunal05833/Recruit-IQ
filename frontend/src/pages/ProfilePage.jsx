// src/pages/ProfilePage.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector }    from "react-redux";
import {
  Mail, Shield, Calendar, Upload, X, Check,
  Loader2, Plus, LogOut, FileText, MapPin, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  fetchUserProfile, selectUserProfile,
  selectUserLoading, setProfile,
} from "../redux/slices/userSlice";
import { selectUserRole, selectAuth } from "../features/auth/authSlice";
import { formatRole }                 from "../utils/formatters";
import resumeService                  from "../services/resumeService";
import useAuth    from "../hooks/useAuth";
import PageHeader from "../components/shared/PageHeader";
import Avatar     from "../components/ui/Avatar";
import Badge      from "../components/ui/Badge";
import Button     from "../components/ui/Button";
import Skeleton   from "../components/ui/Skeleton";
import toast      from "react-hot-toast";

const getSkillName = (skill) =>
  typeof skill === "string" ? skill : (skill?.skillName || skill?.name || "");

// ─── Expandable Text Block ────────────────────────────────────
const ExpandableText = ({ label, icon, text }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const isLong = text.length > 180;
  return (
    <div className="rounded-xl border border-surface-100 bg-surface-50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <span className="text-surface-400">{icon}</span>
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">{label}</p>
      </div>
      <div className="px-4 pb-3">
        <p className={`text-sm text-surface-700 leading-relaxed whitespace-pre-line ${!expanded && isLong ? "line-clamp-2" : ""}`}>
          {text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {expanded ? <><ChevronUp size={12} /> View less</> : <><ChevronDown size={12} /> View more</>}
          </button>
        )}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch   = useDispatch();
  const profile    = useSelector(selectUserProfile);
  const role       = useSelector(selectUserRole);
  const auth       = useSelector(selectAuth);
  const isLoading  = useSelector(selectUserLoading);
  const { logout } = useAuth();

  const fileRef          = useRef(null);
  const [uploading,      setUploading]      = useState(false);
  const [showModal,      setShowModal]      = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editableData,   setEditableData]   = useState(null);
  const [showAllSkills,  setShowAllSkills]  = useState(false);

  useEffect(() => { dispatch(fetchUserProfile()); }, [dispatch]);

  const displayName =
    profile?.name || auth?.user?.name ||
    auth?.user?.email?.split("@")[0] || "User";

  const ROLE_CONFIG = {
    ADMIN:     { variant: "primary", label: "Administrator", description: "Full system access" },
    RECRUITER: { variant: "success", label: "Recruiter",     description: "Hiring & job management" },
    CANDIDATE: { variant: "warning", label: "Candidate",     description: "Job seeker" },
  };
  const roleConfig = ROLE_CONFIG[role] || { variant: "default", label: role, description: "" };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (file.type !== "application/pdf") { toast.error("Only PDF files are allowed."); return; }
    if (file.size > 10 * 1024 * 1024)   { toast.error("File should not exceed 10 MB."); return; }
    setUploading(true);
    try {
      const parsed = await resumeService.upload(file);
      setEditableData({
        name:       parsed.name       || displayName || "",
        email:      parsed.email      || auth?.user?.email || "",
        headline:   parsed.headline   || "",
        skills:     (parsed.skills || []).map(getSkillName).filter(Boolean),
        experience: parsed.experience || "",
        education:  parsed.education  || "",
        location:   parsed.location   || "",
      });
      setShowModal(true);
      toast.success("Resume parsed! Please review your details.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resume could not be parsed.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      const saved = await resumeService.confirmProfile(editableData);
      if (saved) dispatch(setProfile(saved));
      const freshResult = await dispatch(fetchUserProfile()).unwrap();
      if (!freshResult) dispatch(setProfile({ ...editableData, hasResume: true }));
      toast.success("Profile saved successfully!");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile could not be saved.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const addSkill    = (s) => { const t = s.trim(); if (t && !editableData.skills.includes(t)) setEditableData(p => ({ ...p, skills: [...p.skills, t] })); };
  const removeSkill = (s) => setEditableData(p => ({ ...p, skills: p.skills.filter(sk => sk !== s) }));

  const profileSkills = (profile?.skills || []).map(getSkillName).filter(Boolean);
  const visibleSkills = showAllSkills ? profileSkills : profileSkills.slice(0, 10);

  const hasResume = !!(profile && (
    profile.hasResume || profile.resumeUrl ||
    profileSkills.length > 0 || profile.headline || profile.experience
  ));

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-up">
      <PageHeader title="My Profile" subtitle="Manage your account information" />

      {/* ── Profile Card ─────────────────────────────────── */}
      <div className="card p-6">
        {isLoading ? <ProfileSkeleton /> : (
          <div className="space-y-5">

            {/* Avatar + Name row */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar name={displayName} size="2xl" className="ring-4 ring-white shadow-soft-md" />
                {role === "CANDIDATE" && (
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-surface-900 truncate">{displayName}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                  <span className="text-xs text-surface-400">{roleConfig.description}</span>
                </div>
                {profile?.headline && (
                  <p className="text-sm text-surface-500 mt-1 italic truncate">{profile.headline}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-surface-100" />

            {/* Info fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProfileField icon={<Mail size={14} />}   label="Email"    value={profile?.email || auth?.user?.email} />
              <ProfileField icon={<Shield size={14} />} label="Role"     value={formatRole(role)} />
              {profile?.location && (
                <ProfileField icon={<MapPin size={14} />} label="Location" value={profile.location} />
              )}
            </div>

            {/* Experience */}
            <ExpandableText
              label="Experience"
              icon={<Calendar size={13} />}
              text={profile?.experience}
            />

            {/* Education */}
            <ExpandableText
              label="Education"
              icon={<FileText size={13} />}
              text={profile?.education}
            />

            {/* Skills */}
            {profileSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                  Skills ({profileSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
                      {skill}
                    </span>
                  ))}
                  {profileSkills.length > 10 && (
                    <button
                      onClick={() => setShowAllSkills(!showAllSkills)}
                      className="px-2.5 py-1 bg-surface-100 text-surface-600 text-xs font-medium rounded-full border border-surface-200 hover:bg-surface-200 transition-colors flex items-center gap-1"
                    >
                      {showAllSkills
                        ? <><ChevronUp size={11} /> Show less</>
                        : <><ChevronDown size={11} /> +{profileSkills.length - 10} more</>
                      }
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Upload / Modify */}
            {role === "CANDIDATE" && (
              !hasResume ? (
                <div className="flex items-center gap-3 p-3 bg-warning-50 border border-warning-200 rounded-xl">
                  <FileText size={16} className="text-warning-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warning-800">Upload your resume</p>
                    <p className="text-xs text-warning-600">PDF — name and skills auto-fill honge.</p>
                  </div>
                  <Button size="sm" variant="warning" leftIcon={<Upload size={13} />} loading={uploading} onClick={() => fileRef.current?.click()}>
                    Upload
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm"
                  leftIcon={uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  loading={uploading} onClick={() => fileRef.current?.click()}>
                  Modify Resume
                </Button>
              )
            )}
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">Account Actions</h3>
        <Button variant="danger" size="sm" leftIcon={<LogOut size={14} />} onClick={logout}>
          Sign Out
        </Button>
      </div>

      {/* Resume Preview Modal */}
      {showModal && editableData && (
        <ResumePreviewModal
          data={editableData} onChange={setEditableData}
          onConfirm={handleConfirm} onClose={() => setShowModal(false)}
          loading={confirmLoading} onAddSkill={addSkill} onRemoveSkill={removeSkill}
        />
      )}
    </div>
  );
};

// ─── Resume Preview Modal ─────────────────────────────────────
const ResumePreviewModal = ({ data, onChange, onConfirm, onClose, loading, onAddSkill, onRemoveSkill }) => {
  const [newSkill, setNewSkill] = useState("");

  const Field = ({ label, fieldKey, type = "text" }) => (
    <div>
      <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea value={data[fieldKey] || ""} onChange={(e) => onChange(p => ({ ...p, [fieldKey]: e.target.value }))}
          rows={3} className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none" />
      ) : (
        <input type={type} value={data[fieldKey] || ""} onChange={(e) => onChange(p => ({ ...p, [fieldKey]: e.target.value }))}
          className="w-full text-sm border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-soft-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
          <div>
            <h2 className="text-base font-bold text-surface-900">Resume Parsed ✅</h2>
            <p className="text-xs text-surface-500 mt-0.5">Review your details — this will become your profile</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-100 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" fieldKey="name" />
            <Field label="Email" fieldKey="email" type="email" />
          </div>
          <Field label="Headline" fieldKey="headline" />
          <Field label="Experience" fieldKey="experience" type="textarea" />
          <Field label="Education" fieldKey="education" type="textarea" />
          <Field label="Location" fieldKey="location" />
          <div>
            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1">Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
              {data.skills.length === 0 && <span className="text-xs text-surface-400 italic">No skills yet</span>}
              {data.skills.map(skill => (
                <span key={skill} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
                  {skill}
                  <button onClick={() => onRemoveSkill(skill)} className="hover:text-danger-600 transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Add skill (press Enter)" value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAddSkill(newSkill); setNewSkill(""); } }}
                className="flex-1 text-sm border border-surface-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <button onClick={() => { onAddSkill(newSkill); setNewSkill(""); }}
                className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-100">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" leftIcon={loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} loading={loading} onClick={onConfirm}>
            Confirm & Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Profile Field ────────────────────────────────────────────
const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5 p-3 bg-surface-50 rounded-xl">
    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-surface-400 shrink-0 shadow-sm">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-surface-400">{label}</p>
      <p className="text-sm font-semibold text-surface-800 truncate">{value || "—"}</p>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4 items-center">
      <Skeleton className="w-16 h-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[1,2].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
    </div>
    <Skeleton className="h-20 rounded-xl" />
    <Skeleton className="h-20 rounded-xl" />
    <div className="flex flex-wrap gap-1.5">
      {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-7 w-16 rounded-full" />)}
    </div>
  </div>
);

export default ProfilePage;