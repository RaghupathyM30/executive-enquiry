import { useEffect, useState } from "react";
import "./App.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  programme: "",
  message: ""
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [success]);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    const digits = form.phone.replace(/\D/g, "");

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your mobile number";
    } else if (
      !/^\+?[0-9\s()-]{7,20}$/.test(form.phone) ||
      digits.length < 7 ||
      digits.length > 15
    ) {
      newErrors.phone = "Please enter a valid mobile number";
    }

    if (!form.programme) {
      newErrors.programme = "Please select a programme";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/enquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        if (data.message) setSuccess(data.message);
        return;
      }

      setForm(initialForm);
      setErrors({});
      setSuccess(data.message);

    } catch (error) {
      setSuccess("Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="form-container">

        <div className="header">
          <p className="eyebrow">EXECUTIVE PROGRAME</p>
          <h1>Programme Enquiry</h1>
          <p>
            Share your details and our team will connect with you.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="field">
            <label>Full Name <span>*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <small className="error">{errors.name}</small>
            )}
          </div>

          <div className="field">
            <label>Email Address <span>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="error">{errors.email}</small>
            )}
          </div>

          <div className="field">
            <label>Mobile Number <span>*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your mobile number"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <small className="error">{errors.phone}</small>
            )}
          </div>

          <div className="field">
            <label>Programme of Interest <span>*</span></label>
            <select
              name="programme"
              value={form.programme}
              onChange={handleChange}
            >
              <option value="">Select a programme</option>
              <option value="Executive Leadership">
                Executive Leadership
              </option>
              <option value="Senior Management Programme">
                Senior Management Programme
              </option>
              <option value="Business Management">
                Business Management
              </option>
              <option value="Other">Other</option>
            </select>
            {errors.programme && (
              <small className="error">{errors.programme}</small>
            )}
          </div>

          <div className="field">
            <label>Message <small>(Optional)</small></label>
            <textarea
              name="message"
              placeholder="Tell us about your interests..."
              rows="4"
              value={form.message}
              onChange={handleChange}
            />
          </div>

          {success && (
            <div className="success">{success}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "SUBMITTING..." : "SUBMIT ENQUIRY"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;