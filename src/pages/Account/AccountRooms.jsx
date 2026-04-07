import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { uploadRoomMedia } from "../../lib/roomImages";
import { acquireModalLock, releaseModalLock } from "../../lib/modalLock";
import "./AccountPages.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const ROOM_TYPES = [
  "Standard Double Room",
  "Standard Triple Room",
  "Standard Twin Room",
  "Family Room",
  "Deluxe Double Room",
];

const CURRENCIES = ["USD", "UZS", "EUR", "RUB"];

const emptyForm = () => ({
  name: "",
  room_number: "",
  type: "Standard Double Room",
  description: "",
  capacity: "",
  beds: "",
  bathrooms: "",
  size_sqm: "",
  base_price_per_night: "",
  currency: "USD",
  images: [],
  videos: [],
  is_active: true,
});

const toText = (v) => (v == null ? "" : String(v));

const roomToForm = (room) => {
  if (!room) return emptyForm();
  return {
    name: toText(room.name),
    room_number: toText(room.room_number),
    type: toText(room.type) || "Standard Double Room",
    description: toText(room.description),
    capacity: room.capacity == null ? "" : String(room.capacity),
    beds: room.beds == null ? "" : String(room.beds),
    bathrooms: room.bathrooms == null ? "" : String(room.bathrooms),
    size_sqm: room.size_sqm == null ? "" : String(room.size_sqm),
    base_price_per_night: room.base_price_per_night == null ? "" : String(room.base_price_per_night),
    currency: toText(room.currency) || "USD",
    images: parseImages(room.images),
    videos: parseImages(room.videos),
    is_active: room.is_active !== false,
    id: room.id,
  };
};

const parseImages = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try { return JSON.parse(field); } catch { return []; }
  }
  return [];
};

const RoomModal = ({ room, onSave, onClose }) => {
  const [form, setForm] = useState(() => roomToForm(room));
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploads, setUploads] = useState([]);
  const [videoUploads, setVideoUploads] = useState([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    acquireModalLock();
    return () => releaseModalLock();
  }, []);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    set("images", [...(form.images || []), url]);
    setImageUrl("");
  };

  const removeImage = (idx) => {
    set("images", (form.images || []).filter((_, i) => i !== idx));
  };

  const makeCover = (idx) => {
    const imgs = Array.isArray(form.images) ? form.images : [];
    const picked = imgs[idx];
    if (!picked) return;
    const next = [picked, ...imgs.filter((_, i) => i !== idx)];
    set("images", next);
  };

  const save = async () => {
    if (!toText(form.name).trim()) return toast.error("Name is required.");
    if (!form.type) return toast.error("Type is required.");
    if (!form.capacity || Number(form.capacity) < 1) return toast.error("Capacity must be at least 1.");
    if (!form.base_price_per_night || Number(form.base_price_per_night) < 0)
      return toast.error("Price per night is required.");

    setSaving(true);
    try {
      const basePayload = {
        name: toText(form.name).trim(),
        room_number: toText(form.room_number).trim() || null,
        type: form.type,
        description: toText(form.description).trim() || null,
        capacity: Number(form.capacity),
        beds: form.beds ? Number(form.beds) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        size_sqm: form.size_sqm ? Number(form.size_sqm) : null,
        base_price_per_night: Number(form.base_price_per_night),
        currency: form.currency,
        images: Array.isArray(form.images) ? form.images : parseImages(form.images),
        videos: Array.isArray(form.videos) ? form.videos : parseImages(form.videos),
        is_active: form.is_active !== false,
      };

      let roomId = room?.id;

      if (room) {
        const { error } = await supabase.from("Rooms").update(basePayload).eq("id", room.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("Rooms").insert(basePayload).select("id").single();
        if (error) throw error;
        roomId = data?.id;
      }

      // Upload FilePond files (admin-only UI) to Storage and append public URLs
      const nextImages = [...(Array.isArray(basePayload.images) ? basePayload.images : [])];
      const filesToUpload = uploads
        .map((p) => p?.file)
        .filter(Boolean);

      const nextVideos = [...(Array.isArray(basePayload.videos) ? basePayload.videos : [])];
      const videosToUpload = videoUploads
        .map((p) => p?.file)
        .filter(Boolean);

      if (roomId && filesToUpload.length) {
        // Upload in parallel (bounded) for better UX
        const concurrency = 3;
        const results = [];

        for (let i = 0; i < filesToUpload.length; i += concurrency) {
          const chunk = filesToUpload.slice(i, i + concurrency);
          const uploaded = await Promise.all(chunk.map((file) => uploadRoomMedia({ roomId, kind: "image", file })));
          results.push(...uploaded);
        }

        const uploadedUrls = results.map((r) => r?.url).filter(Boolean);
        // New uploads become the cover (first image)
        nextImages.unshift(...uploadedUrls);

        const { error: upErr } = await supabase.from("Rooms").update({ images: nextImages }).eq("id", roomId);
        if (upErr) throw upErr;
      }

      if (roomId && videosToUpload.length) {
        const concurrency = 2;
        const results = [];

        for (let i = 0; i < videosToUpload.length; i += concurrency) {
          const chunk = videosToUpload.slice(i, i + concurrency);
          const uploaded = await Promise.all(chunk.map((file) => uploadRoomMedia({ roomId, kind: "video", file })));
          results.push(...uploaded);
        }

        const uploadedUrls = results.map((r) => r?.url).filter(Boolean);
        nextVideos.push(...uploadedUrls);

        const { error: upErr } = await supabase.from("Rooms").update({ videos: nextVideos }).eq("id", roomId);
        if (upErr) throw upErr;
      }

      toast.success(room ? "Room updated." : "Room created.");
      onSave();
    } catch (e) {
      toast.error(e?.message || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="modal">
        <div className="modal__header">
          <h2>{room ? "Edit room" : "Add room"}</h2>
          <button type="button" className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="modal__grid">
            <label className="form-field">
              <span>Name *</span>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Standard Double Room" />
            </label>

            <label className="form-field">
              <span>Room number</span>
              <input value={form.room_number} onChange={(e) => set("room_number", e.target.value)} placeholder="e.g. 101" />
            </label>

            <label className="form-field">
              <span>Type *</span>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}>
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label className="form-field">
              <span>Capacity *</span>
              <input type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
            </label>

            <label className="form-field">
              <span>Beds</span>
              <input type="number" min="0" value={form.beds} onChange={(e) => set("beds", e.target.value)} />
            </label>

            <label className="form-field">
              <span>Bathrooms</span>
              <input type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
            </label>

            <label className="form-field">
              <span>Size (sqm)</span>
              <input type="number" min="0" value={form.size_sqm} onChange={(e) => set("size_sqm", e.target.value)} />
            </label>

            <label className="form-field">
              <span>Price / night *</span>
              <input type="number" min="0" step="0.01" value={form.base_price_per_night} onChange={(e) => set("base_price_per_night", e.target.value)} />
            </label>

            <label className="form-field">
              <span>Currency</span>
              <select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <label className="form-field form-field--full">
            <span>Description</span>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Room description..."
            />
          </label>

          <div className="form-field form-field--full">
            <span>Upload images (admin)</span>
            <FilePond
              files={uploads}
              onupdatefiles={setUploads}
              allowMultiple={true}
              maxFiles={12}
              credits={false}
              acceptedFileTypes={["image/*"]}
              labelIdle='Drag & Drop images or <span class="filepond--label-action">Browse</span>'
            />
            <div style={{ marginTop: 8, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              Files upload when you click “Create room / Save changes”.
            </div>
          </div>

          <div className="form-field form-field--full">
            <span>Upload videos (admin)</span>
            <FilePond
              files={videoUploads}
              onupdatefiles={setVideoUploads}
              allowMultiple={true}
              maxFiles={4}
              credits={false}
              acceptedFileTypes={["video/*"]}
              labelIdle='Drag & Drop videos or <span class="filepond--label-action">Browse</span>'
            />
            <div style={{ marginTop: 8, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              Videos upload when you click “Create room / Save changes”.
            </div>
          </div>

          <div className="form-field form-field--full">
            <span>Gallery images</span>
            <div className="image-add">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL..."
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
              />
              <button type="button" onClick={addImage}>Add</button>
            </div>
            {Array.isArray(form.images) && form.images.length > 0 && (
              <div className="image-list">
                {form.images.map((url, i) => (
                  <div key={i} className="image-list__item">
                    <span>{url}</span>
                    <button type="button" onClick={() => removeImage(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(form.images) && form.images.length > 0 ? (
              <div className="room-images-order" aria-label="Room images order">
                {form.images.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    className={`room-images-order__item${i === 0 ? " room-images-order__item--cover" : ""}`}
                    onClick={() => makeCover(i)}
                    title={i === 0 ? "Cover image" : "Set as cover"}
                  >
                    <img src={url} alt="" loading="lazy" />
                    {i === 0 ? <span className="room-images-order__badge">Cover</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <label className="form-field form-field--full form-field--toggle">
            <span>Active</span>
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => set("is_active", e.target.checked)} />
          </label>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : room ? "Save changes" : "Create room"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountRooms = () => {
  const { user } = useAuth();
  const isAdmin = String(user?.profile?.role || "").toLowerCase() === "admin";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Rooms")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        if (alive) {
          const parsed = (data || []).map((r) => ({
            ...r,
            images: parseImages(r.images),
          }));
          setRows(parsed);
        }
      } catch (e) {
        if (alive) toast.error(e?.message || "Failed to load rooms");
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, [isAdmin]);

    const reload = () => {
    let alive = true;
    supabase
      .from("Rooms")
      .select("*")
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (!alive || error) return;
        setRows((data || []).map((r) => ({ ...r, images: parseImages(r.images) })));
      });
    return () => { alive = false; };
  };

  const openAdd = () => { setEditRoom(null); setShowModal(true); };
  const openEdit = (room) => { setEditRoom(room); setShowModal(true); };

  const toggleActive = async (room) => {
    try {
      const { error } = await supabase
        .from("Rooms")
        .update({ is_active: !room.is_active })
        .eq("id", room.id);
      if (error) throw error;
      toast.success(room.is_active === false ? "Room activated." : "Room deactivated.");
      setRows((prev) =>
        prev.map((r) => (r.id === room.id ? { ...r, is_active: !r.is_active } : r))
      );
    } catch (e) {
      toast.error(e?.message || "Failed to update room.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="account-page">
        <h1>Rooms</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-page__header">
        <div className="account-page__header-row">
          <div>
            <h1>Rooms</h1>
            <p>Manage hotel rooms.</p>
          </div>
          <button type="button" className="btn-primary" onClick={openAdd}>
            + Add room
          </button>
        </div>
      </header>

      {loading ? (
        <p className="account-page__muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="account-empty">
          <h2>No rooms yet</h2>
          <p>Add your first room to get started.</p>
        </div>
      ) : (
        <div className="rooms-admin-grid">
          {rows.map((r) => (
            <article
              key={r.id}
              className={`room-admin-card${r.is_active === false ? " room-admin-card--inactive" : ""}`}
            >
              <div className="room-admin-card__img">
                {Array.isArray(r.images) && r.images[0] ? (
                  <img
                    src={r.images[0]}
                    alt={r.name}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="room-admin-card__placeholder">No image</div>
                )}
                {r.is_active === false && (
                  <div className="room-admin-card__badge">Inactive</div>
                )}
              </div>
              <div className="room-admin-card__body">
                <div className="room-admin-card__name">{r.name}</div>
                <div className="room-admin-card__meta">
                  {r.room_number ? `#${r.room_number} · ` : ""}{r.type}
                </div>
                <div className="room-admin-card__price">
                  {r.base_price_per_night} {r.currency} <span>/ night</span>
                </div>
                <div className="room-admin-card__meta">
                  Capacity: {r.capacity}
                  {r.size_sqm ? ` · ${r.size_sqm} sqm` : ""}
                </div>
              </div>
              <div className="room-admin-card__actions">
                <button type="button" className="room-admin-card__btn" onClick={() => openEdit(r)}>
                  Edit
                </button>
                <button type="button" className="room-admin-card__btn" onClick={() => toggleActive(r)}>
                  {r.is_active === false ? "Activate" : "Deactivate"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <RoomModal
          room={editRoom}
          onSave={() => { setShowModal(false); setEditRoom(null); reload(); }}
          onClose={() => { setShowModal(false); setEditRoom(null); }}
        />
      )}
    </div>
  );
};

export default AccountRooms;
