import IntegrationCard from "./IntegrationCard";

const IntegrationSection = ({ section, onOpen }) => (
  <section>
    <div className="mb-4">
      <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
        {section.name}
      </h2>
      {section.description && (
        <p className="mt-0.5 text-xs text-slate-400">{section.description}</p>
      )}
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {section.integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          onOpen={onOpen}
        />
      ))}
    </div>
  </section>
);

export default IntegrationSection;
