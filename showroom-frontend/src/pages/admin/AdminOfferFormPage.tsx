import {
  ArrowLeft,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Save,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type { FormEvent } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import offerService from "../../services/offerService";

import type {
  OfferRequest,
} from "../../types/offer";

import vehicleService from "../../services/vehicleService";

import type {
  Vehicle,
} from "../../types/vehicle";

const AdminOfferFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  /* ================= STATE ================= */

  const [vehicles, setVehicles] = useState<
    Vehicle[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(isEditMode);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState<OfferRequest>({
      vehicleId: 0,
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      startDate: "",
      endDate: "",
      active: true,
    });

  /* ================= LOAD VEHICLES ================= */

  const loadVehicles = useCallback(
    async () => {
      try {
        const data =
          await vehicleService.getAll();

        setVehicles(data);
      } catch (err) {
        console.error(
          "Load Vehicles Error:",
          err
        );

        setError(
          "Unable to load vehicles."
        );
      }
    },
    []
  );

  /* ================= LOAD OFFER ================= */

  const loadOffer = useCallback(
    async () => {
      if (!id) {
        return;
      }

      try {
        setPageLoading(true);
        setError("");

        const offer =
          await offerService.getById(
            Number(id)
          );

        setForm({
          vehicleId: offer.vehicleId,
          title: offer.title || "",
          description:
            offer.description || "",
          discountType:
            offer.discountType ||
            "PERCENTAGE",
          discountValue:
            Number(offer.discountValue),
          startDate:
            offer.startDate || "",
          endDate:
            offer.endDate || "",
          active:
            offer.active ?? true,
        });
      } catch (err) {
        console.error(
          "Load Offer Error:",
          err
        );

        setError(
          "Unable to load offer details."
        );
      } finally {
        setPageLoading(false);
      }
    },
    [id]
  );

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadVehicles();
    loadOffer();
  }, [
    loadVehicles,
    loadOffer,
  ]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "vehicleId"
          ? Number(value)
          : name === "discountValue"
          ? Number(value)
          : value,
    }));

    setError("");
    setSuccess("");
  };

  /* ================= ACTIVE CHANGE ================= */

  const handleActiveChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((current) => ({
      ...current,
      active: e.target.checked,
    }));

    setError("");
    setSuccess("");
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!form.vehicleId) {
      return "Please select a vehicle.";
    }

    if (!form.title.trim()) {
      return "Offer title is required.";
    }

    if (!form.discountType) {
      return "Please select discount type.";
    }

    if (
      !form.discountValue ||
      Number(form.discountValue) <= 0
    ) {
      return "Discount value must be greater than 0.";
    }

    if (!form.startDate) {
      return "Start date is required.";
    }

    if (!form.endDate) {
      return "End date is required.";
    }

    if (
      new Date(form.endDate) <
      new Date(form.startDate)
    ) {
      return "End date cannot be before start date.";
    }

    if (
      form.discountType ===
        "PERCENTAGE" &&
      Number(form.discountValue) > 100
    ) {
      return "Percentage discount cannot be greater than 100.";
    }

    return "";
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload: OfferRequest = {
        vehicleId: Number(
          form.vehicleId
        ),
        title: form.title.trim(),
        description:
          form.description?.trim() || "",
        discountType:
          form.discountType,
        discountValue:
          Number(form.discountValue),
        startDate:
          form.startDate,
        endDate:
          form.endDate,
        active:
          form.active ?? true,
      };

      if (isEditMode) {
        await offerService.update(
          Number(id),
          payload
        );

        setSuccess(
          "Offer updated successfully."
        );
      } else {
        await offerService.create(
          payload
        );

        setSuccess(
          "Offer created successfully."
        );
      }

      setTimeout(() => {
        navigate("/admin/offers");
      }, 800);
    } catch (err) {
      console.error(
        "Save Offer Error:",
        err
      );

      setError(
        isEditMode
          ? "Unable to update offer. Please try again."
          : "Unable to create offer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGE LOADING ================= */

  if (pageLoading) {
    return (
      <main className="admin-page admin-offer-form-page">

        <section className="admin-state-card">

          <Loader2
            size={38}
            className="spin"
          />

          <h2>
            Loading Offer
          </h2>

          <p>
            Fetching offer details...
          </p>

        </section>

      </main>
    );
  }

  /* ================= RENDER ================= */

  return (
    <main className="admin-page admin-offer-form-page">

      {/* ================= HEADER ================= */}

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            OFFER MANAGEMENT
          </span>

          <h1>
            {isEditMode
              ? "Edit Offer"
              : "Create Offer"}
          </h1>

          <p>
            {isEditMode
              ? "Update the promotional offer details."
              : "Create a new promotional offer for your showroom."}
          </p>

        </div>

        <div className="admin-page-header-actions">

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={() =>
              navigate("/admin/offers")
            }
          >
            <ArrowLeft size={17} />
            Back to Offers
          </button>

        </div>

      </div>

      {/* ================= FORM ================= */}

      <form
        className="admin-form-card admin-offer-form"
        onSubmit={handleSubmit}
      >

        {/* ================= BASIC DETAILS ================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-icon">
              <BadgePercent size={19} />
            </div>

            <div>
              <h2>
                Offer Details
              </h2>

              <p>
                Configure the basic information
                for this promotion.
              </p>
            </div>

          </div>

          <div className="admin-form-grid">

            {/* VEHICLE */}

            <div className="admin-form-group">

              <label htmlFor="vehicleId">
                Vehicle
                <span>*</span>
              </label>

              <select
                id="vehicleId"
                name="vehicleId"
                value={
                  form.vehicleId || ""
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="">
                  Select Vehicle
                </option>

                {vehicles.map(
                  (vehicle) => (
                    <option
                      key={
                        vehicle.id
                      }
                      value={
                        vehicle.id
                      }
                    >
                      {vehicle.name ||
                        `Vehicle #${vehicle.id}`}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* TITLE */}

            <div className="admin-form-group">

              <label htmlFor="title">
                Offer Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Festive Season Offer"
                value={form.title}
                onChange={
                  handleChange
                }
                maxLength={150}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <div className="admin-form-group full">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Enter offer description..."
                value={
                  form.description ||
                  ""
                }
                onChange={
                  handleChange
                }
                rows={4}
                maxLength={500}
              />

              <small>
                {(
                  form.description ||
                  ""
                ).length}
                /500
              </small>

            </div>

          </div>

        </div>

        {/* ================= DISCOUNT ================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-icon">
              <BadgePercent size={19} />
            </div>

            <div>
              <h2>
                Discount
              </h2>

              <p>
                Set the discount offered to
                customers.
              </p>
            </div>

          </div>

          <div className="admin-form-grid">

            {/* DISCOUNT TYPE */}

            <div className="admin-form-group">

              <label htmlFor="discountType">
                Discount Type
                <span>*</span>
              </label>

              <select
                id="discountType"
                name="discountType"
                value={
                  form.discountType
                }
                onChange={
                  handleChange
                }
                required
              >

                <option value="PERCENTAGE">
                  Percentage (%)
                </option>

                <option value="FIXED">
                  Fixed Amount (₹)
                </option>

              </select>

            </div>

            {/* DISCOUNT VALUE */}

            <div className="admin-form-group">

              <label htmlFor="discountValue">
                Discount Value
                <span>*</span>
              </label>

              <div className="admin-input-with-suffix">

                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={
                    form.discountType ===
                    "PERCENTAGE"
                      ? "e.g. 10"
                      : "e.g. 5000"
                  }
                  value={
                    form.discountValue ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <span>
                  {form.discountType ===
                  "PERCENTAGE"
                    ? "%"
                    : "₹"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= VALIDITY ================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2>
                Offer Validity
              </h2>

              <p>
                Select the period during which
                this offer will be available.
              </p>
            </div>

          </div>

          <div className="admin-form-grid">

            {/* START DATE */}

            <div className="admin-form-group">

              <label htmlFor="startDate">
                Start Date
                <span>*</span>
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={
                  form.startDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            {/* END DATE */}

            <div className="admin-form-group">

              <label htmlFor="endDate">
                End Date
                <span>*</span>
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={
                  form.endDate
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

          </div>

        </div>

        {/* ================= STATUS ================= */}

        <div className="admin-form-section">

          <div className="admin-form-section-header">

            <div className="admin-form-section-icon">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <h2>
                Offer Status
              </h2>

              <p>
                Choose whether this offer should
                be visible and active.
              </p>
            </div>

          </div>

          <label className="admin-toggle-row">

            <div>

              <strong>
                Active Offer
              </strong>

              <span>
                Customers can see and use
                this offer.
              </span>

            </div>

            <input
              type="checkbox"
              checked={
                form.active ?? true
              }
              onChange={
                handleActiveChange
              }
            />

            <span className="admin-toggle-switch" />

          </label>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="admin-form-message error">

            <XCircle size={18} />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {success && (
          <div className="admin-form-message success">

            <CheckCircle2 size={18} />

            <span>
              {success}
            </span>

          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="admin-form-actions">

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={() =>
              navigate("/admin/offers")
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-btn"
            disabled={loading}
          >

            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                {isEditMode
                  ? "Updating..."
                  : "Creating..."}
              </>
            ) : (
              <>
                <Save size={17} />
                {isEditMode
                  ? "Update Offer"
                  : "Create Offer"}
              </>
            )}

          </button>

        </div>

      </form>

    </main>
  );
};

export default AdminOfferFormPage;
