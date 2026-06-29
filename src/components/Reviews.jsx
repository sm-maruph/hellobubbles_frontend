import ReviewCard from "./ReviewCard";
import "./Reviews.css";

/* Dummy data — swap for your backend API later.
   Avatars use pravatar.cc (reliable face placeholders). */
const DEFAULT_REVIEWS = [
  {
    id: 1,
    quote:
      "Eatery offers a perfect blend of delicious cuisine and warm hospitality; it's my favorite spot for any occasion!",
    name: "Jessica",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: 2,
    quote:
      "Whether it's a date night or a family gathering, Eatery provides an unforgettable experience every time.",
    name: "David Lee",
    role: "Teacher",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    id: 3,
    quote:
      "Eatery is my go-to for gourmet meals; it's a place where passion for food truly shines through.",
    name: "Sarah Taylor",
    role: "Chef",
    avatar: "https://i.pravatar.cc/120?img=32",
  },
];

export default function Reviews({
  title = "Client Reviews",
  reviews = DEFAULT_REVIEWS,
  id = "reviews",
}) {
  return (
    <section className="reviews" id={id}>
      <div className="container">
        <h2 className="reviews__title">{title}</h2>

        <div className="reviews__grid">
          {reviews.map((r, i) => (
            <ReviewCard key={r.id ?? i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
