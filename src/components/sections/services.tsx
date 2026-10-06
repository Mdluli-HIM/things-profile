import "./services.css";

const services = [
  {
    number: "01",
    title: "Strategy",
    capabilities: [
      "Brand positioning",
      "SEO strategy",
      "Digital marketing",
      "Content direction"
    ],
    description:
      "We start by understanding your business, your audience and what you want to achieve. That gives us a clear direction for your brand and website, so every decision supports the bigger picture."
  },
  {
    number: "02",
    title: "Design",
    capabilities: [
      "Web design",
      "Graphic design",
      "Brand identity",
      "UI/UX design",
      "Creative direction",
      "Interaction design"
    ],
    description:
      "We shape how your business looks and feels, online and in print. From brand identities and graphic design to websites and digital experiences, we create a clear visual language that connects everything you put into the world."
  },
  {
    number: "03",
    title: "Development",
    capabilities: [
      "Custom websites",
      "E-commerce",
      "WordPress & Next.js",
      "Headless CMS"
    ],
    description:
      "We turn the design into a fast, responsive website that works across devices. The technology fits your project, with a clear structure that makes the site easier to manage, maintain and develop as your business grows."
  }
];

export function Services() {
  return (
    <section
      id="services"
      className="things-services"
      aria-labelledby="services-heading"
    >
      <div className="things-services-inner">
        <div className="things-services-intro">
          <h2 id="services-heading">02 / Things we do</h2>
          <p>From thinking to making.</p>
        </div>

        <div className="things-services-list">
          {services.map(service => (
            <article
              key={service.number}
              className="things-service"
              aria-labelledby={"service-title-" + service.number}
            >
              <div className="things-service-heading">
                <span
                  className="things-service-number"
                  aria-hidden="true"
                >
                  {service.number}.
                </span>

                <h3 id={"service-title-" + service.number}>
                  {service.title}
                </h3>
              </div>

              <div className="things-service-content">
                <ul className="things-service-capabilities">
                  {service.capabilities.map(capability => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>

                <p className="things-service-description">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
