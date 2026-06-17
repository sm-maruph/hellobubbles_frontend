export default function DrinkGallery({ drinks }) {
  return (
    <div className="drink-gallery">
      {drinks.map((d) => (
        <div key={d.id} className="drink-tile">
          <img src={d.image_url} alt={d.name} loading="lazy" />
        </div>
      ))}
    </div>
  );
}