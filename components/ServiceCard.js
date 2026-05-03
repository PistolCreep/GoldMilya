import { useState } from 'react';

export default function ServiceCard({ service, index = 0 }){
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="service-card rich-service-card" style={{ '--delay': `${index * 70}ms` }}>
      <div className="service-image-wrap">
        {!imageFailed && (
          <img
            className="service-image"
            src={service.image}
            alt={service.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {imageFailed && (
          <div className="service-image-placeholder">
            <span>{service.badge}</span>
          </div>
        )}
        <span className="service-badge">{service.badge}</span>
      </div>
      <div className="service-body">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    </article>
  );
}
