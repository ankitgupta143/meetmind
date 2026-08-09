import IntegrationCard from "./IntegrationCard";

const IntegrationSection = ({ section, onOpen }) => (
  <section>
    <div className="mb-4">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
        {section.name}
      </h2>
      {section.description && (
        <p className="mt-1 text-sm text-zinc-500">{section.description}</p>
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
