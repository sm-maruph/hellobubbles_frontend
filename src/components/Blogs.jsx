import BlogCard from "./BlogCard";
import "./Blogs.css";

/* Dummy data — swap for your backend API later. */
const DEFAULT_POSTS = [
  {
    id: 1,
    date: "Feb 10, 2024",
    title: "The History of Fine Dining: From Ancient Feasts to Modern Gastronomy",
    image: "https://picsum.photos/seed/eatery-blog1/600/400",
    href: "#",
  },
  {
    id: 2,
    date: "February 2024",
    title: "Exploring Culinary Delights: A Journey Through Mediterranean Cuisine",
    image: "https://picsum.photos/seed/eatery-blog2/600/400",
    href: "#",
  },
  {
    id: 3,
    date: "27 January 2024",
    title: "The Art of Pairing: Elevating Your Dining Experience with Wine & Cuisine",
    image: "https://picsum.photos/seed/eatery-blog3/600/400",
    href: "#",
  },
];

export default function Blogs({
  eyebrow = "Blogs",
  title = "Stories, Insights, And Updates About Our Mission",
  viewAllLabel = "View All",
  viewAllHref = "#blog",
  posts = DEFAULT_POSTS,
  id = "blog",
}) {
  return (
    <section className="blogs" id={id}>
      <div className="container">
        <div className="blogs__head">
          <div className="blogs__heading">
            {eyebrow && <p className="blogs__eyebrow">{eyebrow}</p>}
            <h2 className="blogs__title">{title}</h2>
          </div>

          {viewAllLabel && (
            <a className="blogs__viewall" href={viewAllHref}>
              {viewAllLabel}
            </a>
          )}
        </div>

        <div className="blogs__grid">
          {posts.map((p, i) => (
            <BlogCard key={p.id ?? i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
