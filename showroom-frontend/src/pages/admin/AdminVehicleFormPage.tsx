import { useEffect, useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import vehicleService from "../../services/vehicleService";
import { brandService } from "../../services/brandService";
import type { VehicleImage, VehicleRequest } from "../../types/vehicle";
import type { Brand } from "../../types/brand";
import { getErrorMessage } from "../../utils/errorUtils";
import { getImageUrl } from "../../utils/imageUtils";

interface SelectedFileItem {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  displayOrder: number;
}

const initialForm: VehicleRequest = {
  brandId: 0,
  name: "",
  model: "",
  variant: "",
  vehicleType: "NEW",
  category: "",
  price: 0,
  engineCc: undefined,
  mileage: undefined,
  fuelType: "",
  transmission: "",
  color: "",
  description: "",
  featured: false,
  available: true,
  registrationYear: undefined,
  ownerCount: undefined,
  kilometersDriven: undefined,
  condition: "",
  registrationNumber: "",
  insuranceValidUntil: "",
};

const AdminVehicleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vehicleId = id ? Number(id) : null;
  const isEditMode = Boolean(vehicleId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<VehicleRequest>(initialForm);
  const [featuresList, setFeaturesList] = useState<Array<{ id: string; title: string; description: string }>>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageError, setImageError] = useState("");

  /* ================= CLEANUP OBJECT URLS ================= */
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [selectedFiles]);

  /* ================= LOAD BRANDS & VEHICLE ================= */
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        setError("");

        let loadedBrands: Brand[] = [];
        try {
          loadedBrands = await brandService.getAll();
          setBrands(loadedBrands);
        } catch (bErr) {
          console.error("Failed to load brands:", bErr);
        }

        if (vehicleId) {
          const vehicle = await vehicleService.getById(vehicleId);
          if (vehicle.featuresJson) {
            try {
              const parsed = JSON.parse(vehicle.featuresJson);
              if (Array.isArray(parsed)) {
                setFeaturesList(parsed.map((item, idx) => ({
                  id: String(idx + 1),
                  title: item.title || "",
                  description: item.description || "",
                })));
              }
            } catch (e) {
              console.error("Failed to parse featuresJson:", e);
            }
          }
          setForm({
            brandId: vehicle.brandId,
            name: vehicle.name,
            model: vehicle.model,
            variant: vehicle.variant ?? "",
            vehicleType: vehicle.vehicleType,
            category: vehicle.category ?? "",
            price: Number(vehicle.price),
            engineCc: vehicle.engineCc ?? undefined,
            mileage: vehicle.mileage ?? undefined,
            fuelType: vehicle.fuelType ?? "",
            transmission: vehicle.transmission ?? "",
            color: vehicle.color ?? "",
            description: vehicle.description ?? "",
            featured: vehicle.featured,
            available: vehicle.available,
            featuresJson: vehicle.featuresJson ?? "",
            specificationsJson: vehicle.specificationsJson ?? "",
            registrationYear: vehicle.registrationYear ?? undefined,
            ownerCount: vehicle.ownerCount ?? undefined,
            kilometersDriven: vehicle.kilometersDriven ?? undefined,
            condition: vehicle.condition ?? "",
            registrationNumber: vehicle.registrationNumber ?? "",
            insuranceValidUntil: vehicle.insuranceValidUntil ?? "",
          });

          if (vehicle.images) {
            setExistingImages(vehicle.images);
          } else {
            const imgList = await vehicleService.getImages(vehicleId);
            setExistingImages(imgList);
          }
        } else {
          // Auto-select first brand if creating
          if (loadedBrands.length > 0) {
            setForm((prev) => ({ ...prev, brandId: loadedBrands[0].id }));
          }
        }
      } catch (err) {
        console.error("Load Vehicle Error:", err);
        setError(getErrorMessage(err, "Unable to load vehicle details."));
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [vehicleId]);

  /* ================= REFRESH EXISTING IMAGES ================= */
  const reloadExistingImages = async () => {
    if (!vehicleId) return;
    try {
      const imgList = await vehicleService.getImages(vehicleId);
      setExistingImages(imgList);
    } catch (err) {
      console.error("Reload Images Error:", err);
    }
  };

  /* ================= FILE PICKER SELECTION ================= */
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const newItems: SelectedFileItem[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file, index) => {
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        invalidFiles.push(file.name);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `file_${Date.now()}_${index}_${Math.random()}`,
        file,
        previewUrl,
        altText: "",
        displayOrder: existingImages.length + selectedFiles.length + index,
      });
    });

    if (invalidFiles.length > 0) {
      setImageError(
        `Unsupported file type for: ${invalidFiles.join(", ")}. Please select JPG, PNG, or WEBP images.`
      );
    }

    if (newItems.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newItems]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedFile = (id: string) => {
    setSelectedFiles((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleUpdateSelectedFileAlt = (id: string, altText: string) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, altText } : item))
    );
  };

  const handleUpdateSelectedFileOrder = (id: string, displayOrder: number) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, displayOrder } : item))
    );
  };

  /* ================= DELETE EXISTING SERVER IMAGE ================= */
  const handleDeleteExistingImage = async (imageId: number) => {
    if (!vehicleId) return;
    try {
      await vehicleService.deleteImage(vehicleId, imageId);
      setExistingImages((curr) => curr.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Delete Image Error:", err);
      alert(getErrorMessage(err, "Unable to delete image."));
    }
  };

  /* ================= FORM INPUT HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "brandId",
              "price",
              "engineCc",
              "mileage",
              "registrationYear",
              "ownerCount",
              "kilometersDriven",
            ].includes(name)
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  /* ================= FORM SUBMISSION ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setImageError("");

    if (!form.brandId || form.brandId <= 0) {
      setError("Please select a valid Brand.");
      return;
    }

    if (!form.name.trim()) {
      setError("Vehicle name is required.");
      return;
    }

    if (!form.model.trim()) {
      setError("Vehicle model is required.");
      return;
    }

    if (!form.price || form.price <= 0) {
      setError("Vehicle price must be greater than 0.");
      return;
    }

    const payload: VehicleRequest = {
      ...form,
      name: form.name.trim(),
      model: form.model.trim(),
      variant: form.variant?.trim() || undefined,
      fuelType: form.fuelType?.trim() || undefined,
      category: form.category?.trim() || undefined,
      transmission: form.transmission?.trim() || undefined,
      color: form.color?.trim() || undefined,
      description: form.description?.trim() || undefined,
      engineCc: form.engineCc && form.engineCc > 0 ? form.engineCc : undefined,
      mileage: form.mileage && form.mileage > 0 ? form.mileage : undefined,
      registrationYear:
        form.registrationYear && form.registrationYear > 1900
          ? form.registrationYear
          : undefined,
      ownerCount:
        form.ownerCount && form.ownerCount > 0 ? form.ownerCount : undefined,
      kilometersDriven:
        form.kilometersDriven !== undefined && form.kilometersDriven >= 0
          ? form.kilometersDriven
          : undefined,
      condition: form.condition?.trim() || undefined,
      registrationNumber: form.registrationNumber?.trim() || undefined,
      insuranceValidUntil: form.insuranceValidUntil?.trim() || undefined,
    };

    try {
      setSaving(true);
      let targetVehicleId = vehicleId;

      if (isEditMode && vehicleId) {
        await vehicleService.update(vehicleId, payload);
      } else {
        const created = await vehicleService.create(payload);
        targetVehicleId = created.id;
      }

      // Upload selected images if any
      if (targetVehicleId && selectedFiles.length > 0) {
        setUploadingImages(true);
        let failedUploads = 0;
        let lastErrorMsg = "";

        for (const item of selectedFiles) {
          try {
            await vehicleService.uploadImage(
              targetVehicleId,
              item.file,
              item.altText || undefined,
              item.displayOrder
            );
          } catch (imgErr) {
            console.error("Failed to upload image:", item.file.name, imgErr);
            lastErrorMsg = getErrorMessage(imgErr, "Upload failed");
            failedUploads++;
          }
        }

        // Clean up object URLs
        selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setSelectedFiles([]);

        if (failedUploads > 0) {
          setError(
            `Vehicle saved, but ${failedUploads} image(s) failed to upload: ${lastErrorMsg}`
          );
          setSaving(false);
          setUploadingImages(false);
          if (isEditMode) {
            await reloadExistingImages();
          } else {
            navigate(`/admin/vehicles/${targetVehicleId}/edit`);
          }
          return;
        }
      }

      setSuccess(
        isEditMode
          ? "Vehicle and images updated successfully."
          : "Vehicle and images created successfully."
      );

      setTimeout(() => {
        navigate("/admin/vehicles");
      }, 800);
    } catch (err) {
      console.error("Save Vehicle Error:", err);
      setError(
        getErrorMessage(
          err,
          isEditMode
            ? "Unable to update vehicle. Please check fields."
            : "Unable to create vehicle. Please check fields."
        )
      );
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-state-card">
          <Loader2 size={40} className="spin" />
          <h2>Loading Vehicle</h2>
          <p>Fetching vehicle details and brand configuration...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page admin-form-page">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <Link to="/admin/vehicles" className="admin-back-link">
            <ArrowLeft size={16} />
            Back to Vehicles
          </Link>
          <span className="admin-page-eyebrow">INVENTORY MANAGEMENT</span>
          <h1>{isEditMode ? "Edit Vehicle" : "Add Vehicle"}</h1>
          <p>
            {isEditMode
              ? "Update vehicle specs, pricing, and images in your showroom inventory."
              : "Add a new vehicle and upload photos to your showroom inventory."}
          </p>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {success && (
        <div className="admin-form-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="admin-form-error">
          <AlertCircle size={18} style={{ marginRight: "8px", flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}



      {/* MAIN VEHICLE FORM */}
      <form className="admin-vehicle-form" onSubmit={handleSubmit}>
        {/* BASIC INFORMATION */}
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Bike size={20} />
            </div>
            <div>
              <h2>Basic Information</h2>
              <p>Enter the core details of the vehicle.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            {/* BRAND SELECTION DROPDOWN */}
            <div className="admin-form-group">
              <label htmlFor="brandId">Brand *</label>
              {brands.length > 0 ? (
                <select
                  id="brandId"
                  name="brandId"
                  value={form.brandId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="brandId"
                  name="brandId"
                  type="number"
                  min="1"
                  value={form.brandId || ""}
                  onChange={handleChange}
                  placeholder="Enter brand ID"
                  required
                />
              )}
            </div>

            {/* VEHICLE NAME */}
            <div className="admin-form-group">
              <label htmlFor="name">Vehicle Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Access 125"
                required
              />
            </div>

            {/* MODEL */}
            <div className="admin-form-group">
              <label htmlFor="model">Model *</label>
              <input
                id="model"
                name="model"
                type="text"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Access"
                required
              />
            </div>

            {/* VARIANT */}
            <div className="admin-form-group">
              <label htmlFor="variant">Variant</label>
              <input
                id="variant"
                name="variant"
                type="text"
                value={form.variant ?? ""}
                onChange={handleChange}
                placeholder="e.g. Special Edition / Bluetooth"
              />
            </div>

            {/* VEHICLE TYPE */}
            <div className="admin-form-group">
              <label htmlFor="vehicleType">Vehicle Type *</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="NEW">New Vehicle</option>
                <option value="USED">Pre-Owned Vehicle</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div className="admin-form-group">
              <label htmlFor="category">Category (Scooty / Bike / EV)</label>
              <select
                id="category"
                name="category"
                value={form.category ?? ""}
                onChange={handleChange}
              >
                <option value="">Auto-Detect (Scooty/Bike/EV)</option>
                <option value="SCOOTER">🛵 Scooty / Scooter</option>
                <option value="BIKE">🏍️ Bike / Motorcycle</option>
                <option value="ELECTRIC">⚡ EV / Electric Vehicle</option>
              </select>
            </div>

            {/* PRICE */}
            <div className="admin-form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={form.price || ""}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
          </div>
        </section>

        {/* CUSTOM VEHICLE FEATURES (DYNAMIC FOR OFFICIAL SUZUKI LAYOUT) */}
        <section className="admin-form-card">
          <div className="admin-form-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="admin-form-card-icon" style={{ background: '#fee2e2', color: '#E60012' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2>Custom Vehicle Features</h2>
                <p>Add specific features (Title & Description) to display on public vehicle details page.</p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.88rem', padding: '8px 14px' }}
              onClick={() => {
                setFeaturesList([
                  ...featuresList,
                  { id: Date.now().toString(), title: "", description: "" },
                ]);
              }}
            >
              <Plus size={16} /> Add Feature
            </button>
          </div>

          <div className="admin-features-builder-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {featuresList.length === 0 && (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No custom features added yet. Click "+ Add Feature" to add specific features for this vehicle.
              </p>
            )}

            {featuresList.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Feature #{index + 1}</strong>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    onClick={() => {
                      setFeaturesList(featuresList.filter((f) => f.id !== item.id));
                    }}
                    title="Remove feature"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Feature Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Twin Muffler Exhaust"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...featuresList];
                        updated[index].title = e.target.value;
                        setFeaturesList(updated);
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Short Description</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Sporty twin-pipe exhaust system for deep rumble"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...featuresList];
                        updated[index].description = e.target.value;
                        setFeaturesList(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SPECIFICATIONS */}
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Bike size={20} />
            </div>
            <div>
              <h2>Vehicle Specifications</h2>
              <p>Add technical specification details.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="engineCc">Engine Capacity (CC)</label>
              <input
                id="engineCc"
                name="engineCc"
                type="number"
                min="1"
                value={form.engineCc ?? ""}
                onChange={handleChange}
                placeholder="e.g. 125"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="mileage">Mileage (kmpl / km/charge)</label>
              <input
                id="mileage"
                name="mileage"
                type="number"
                min="0.1"
                step="0.1"
                value={form.mileage ?? ""}
                onChange={handleChange}
                placeholder="e.g. 45"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                value={form.fuelType ?? ""}
                onChange={handleChange}
              >
                <option value="">Select fuel type</option>
                <option value="PETROL">Petrol</option>
                <option value="ELECTRIC">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="transmission">Transmission</label>
              <select
                id="transmission"
                name="transmission"
                value={form.transmission ?? ""}
                onChange={handleChange}
              >
                <option value="">Select transmission</option>
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                name="color"
                type="text"
                value={form.color ?? ""}
                onChange={handleChange}
                placeholder="e.g. Metallic Black"
              />
            </div>
          </div>
        </section>

        {/* PRE-OWNED DETAILS */}
        {form.vehicleType === "USED" && (
          <section className="admin-form-card">
            <div className="admin-form-card-header">
              <div className="admin-form-card-icon">
                <Bike size={20} />
              </div>
              <div>
                <h2>Pre-Owned Vehicle Details</h2>
                <p>Registration and ownership history.</p>
              </div>
            </div>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="registrationYear">Registration Year</label>
                <input
                  id="registrationYear"
                  name="registrationYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={form.registrationYear ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 2023"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="ownerCount">Owner Count</label>
                <input
                  id="ownerCount"
                  name="ownerCount"
                  type="number"
                  min="1"
                  value={form.ownerCount ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="kilometersDriven">Kilometers Driven</label>
                <input
                  id="kilometersDriven"
                  name="kilometersDriven"
                  type="number"
                  min="0"
                  value={form.kilometersDriven ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 15000"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={form.condition ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="AVERAGE">Average</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={form.registrationNumber ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. MP09 XX1234"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="insuranceValidUntil">Insurance Valid Until</label>
                <input
                  id="insuranceValidUntil"
                  name="insuranceValidUntil"
                  type="date"
                  value={form.insuranceValidUntil ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        )}

        {/* DESCRIPTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <Save size={20} />
            </div>
            <div>
              <h2>Description</h2>
              <p>Showroom features and detailed summary.</p>
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="description">Vehicle Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Enter detailed description..."
            />
          </div>
        </section>

        {/* INVENTORY VISIBILITY */}
        <section className="admin-form-card">
          <div className="admin-form-card-header">
            <div className="admin-form-card-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2>Inventory Visibility</h2>
              <p>Control stock availability and home page featuring.</p>
            </div>
          </div>

          <div className="admin-form-checkboxes">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="available"
                checked={form.available ?? false}
                onChange={handleChange}
              />
              <span>Available in Stock</span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured ?? false}
                onChange={handleChange}
              />
              <span>Featured Vehicle (Home Page Showcase)</span>
            </label>
          </div>
        </section>

        {/* VEHICLE IMAGE MANAGEMENT CARD (MULTIPART FILE UPLOAD) */}
        <section className="admin-form-card" style={{ marginTop: "1rem" }}>
          <div className="admin-form-card-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="admin-form-card-icon">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2>Vehicle Images</h2>
                <p>
                  Upload JPG, PNG or WEBP photos for this vehicle. You can select multiple images from your computer.
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="admin-primary-btn"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px" }}
            >
              <Upload size={18} />
              Add Images
            </button>
          </div>

          {imageError && (
            <div style={{ color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: "6px", margin: "1rem 0", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} />
              <span>{imageError}</span>
            </div>
          )}

          {/* EXISTING SERVER IMAGES (EDIT MODE) */}
          {isEditMode && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Current Saved Images ({existingImages.length})
              </h4>

              {existingImages.length === 0 ? (
                <p style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "0.9rem" }}>
                  No saved images attached to this vehicle yet.
                </p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                  {existingImages.map((img) => (
                    <div key={img.id} style={{ position: "relative", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden", background: "#f8fafc" }}>
                      <img
                        src={getImageUrl(img.imageUrl)}
                        alt={img.altText || "Saved Vehicle Image"}
                        style={{ width: "100%", height: "130px", objectFit: "cover" }}
                      />
                      <div style={{ padding: "8px", fontSize: "0.8rem", color: "#475569" }}>
                        <span style={{ fontWeight: 600 }}>Order: {img.displayOrder ?? 0}</span>
                        {img.altText && <p style={{ margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.altText}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        title="Delete saved image"
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          background: "rgba(225, 29, 72, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOCAL NEWLY SELECTED FILES (READY FOR UPLOAD) */}
          <div>
            <h4 style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {isEditMode ? "New Images To Upload" : "Selected Images To Save"} ({selectedFiles.length})
            </h4>

            {selectedFiles.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "8px",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Upload size={32} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
                <p style={{ margin: 0, fontWeight: 600, color: "#334155", fontSize: "0.95rem" }}>
                  Click to select vehicle photos from File Manager
                </p>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Supports JPG, JPEG, PNG, WEBP (Max 10MB per file)
                </span>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {selectedFiles.map((item, idx) => (
                  <div key={item.id} style={{ border: "1px solid #2563eb", borderRadius: "8px", overflow: "hidden", background: "#ffffff", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)" }}>
                    <div style={{ position: "relative", height: "130px", background: "#0f172a" }}>
                      <img
                        src={item.previewUrl}
                        alt={`Preview ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "6px",
                          background: "rgba(15, 23, 42, 0.85)",
                          color: "#ffffff",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Image #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedFile(item.id)}
                        title="Remove selected photo"
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          background: "rgba(225, 29, 72, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div style={{ padding: "10px" }}>
                      <p style={{ margin: "0 0 6px", fontSize: "0.8rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.file.name} ({(item.file.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>

                      <div style={{ display: "grid", gap: "6px" }}>
                        <input
                          type="text"
                          placeholder="Alt text (e.g. Front Angle)"
                          value={item.altText}
                          onChange={(e) => handleUpdateSelectedFileAlt(item.id, e.target.value)}
                          style={{ padding: "4px 8px", fontSize: "0.8rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Order:</span>
                          <input
                            type="number"
                            min="0"
                            value={item.displayOrder}
                            onChange={(e) => handleUpdateSelectedFileOrder(item.id, Number(e.target.value))}
                            style={{ width: "60px", padding: "2px 6px", fontSize: "0.8rem", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FORM ACTIONS */}
        <div className="admin-form-actions">
          <Link to="/admin/vehicles" className="admin-secondary-btn">
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-btn"
            disabled={saving || uploadingImages}
          >
            {saving || uploadingImages ? (
              <>
                <Loader2 size={18} className="spin" />
                {uploadingImages ? "Uploading Images..." : "Saving Vehicle..."}
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? "Update Vehicle" : "Create Vehicle"}
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default AdminVehicleFormPage;
