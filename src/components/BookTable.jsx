import { useState } from "react";
import Button from "./Button";
import "./BookTable.css";

const TIMES = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];
const SEATS = [1, 2, 3, 4, 5, 6, 7, 8];

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  seats: "",
  message: "",
};

/**
 * Booking form. By default it just logs the submitted values.
 * Pass `onSubmit(formData)` to send them to your backend API.
 */
export default function BookTable({
  title = "Book your Table",
  subtitle = "Alternatively, dial +1 (212) 555-1212 or complete the form.",
  onSubmit,
  id = "contact",
}) {
  const [form, setForm] = useState(EMPTY);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    else console.log("Booking request:", form);
  };

  return (
    <section className="book" id={id}>
      <div className="container book__inner">
        <h2 className="book__title">{title}</h2>
        {subtitle && <p className="book__subtitle">{subtitle}</p>}

        <form className="book__form" onSubmit={handleSubmit}>
          <input
            className="book__field"
            placeholder="Name*"
            aria-label="Name"
            value={form.name}
            onChange={update("name")}
            required
          />
          <input
            className="book__field"
            placeholder="Phone Number"
            aria-label="Phone number"
            value={form.phone}
            onChange={update("phone")}
          />

          <input
            className="book__field"
            type="email"
            placeholder="Email*"
            aria-label="Email"
            value={form.email}
            onChange={update("email")}
            required
          />
          <input
            className="book__field"
            type="date"
            aria-label="Date"
            value={form.date}
            onChange={update("date")}
          />

          <select
            className="book__field"
            aria-label="Time"
            value={form.time}
            onChange={update("time")}
          >
            <option value="">– select Time –*</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className="book__field"
            aria-label="Number of seats"
            value={form.seats}
            onChange={update("seats")}
          >
            <option value="">Number of seats*</option>
            {SEATS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <textarea
            className="book__field book__field--full"
            placeholder="message..."
            aria-label="Message"
            rows={4}
            value={form.message}
            onChange={update("message")}
          />

          <div className="book__actions">
            <Button type="submit" variant="outline">
              Book Table
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
