export const DisconnectedWarning = ({
  emails,
  areDisconnectedVisible,
  setAreDisconnectedVisible,
}: {
  emails: string[];
  areDisconnectedVisible: boolean;
  setAreDisconnectedVisible: (value: boolean) => void;
}) => {
  return (
    <>
      <div className="flex flex-col gap-2 border border-red-600 bg-red-50 p-2">
        <strong>⚠️ Some users have no connected google agendas</strong>
        <ul>
          {emails.map((e) => (
            <li key={e}>- {e}</li>
          ))}
        </ul>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            id="connected"
            name="connected"
            value={areDisconnectedVisible.toString()}
            onChange={() => setAreDisconnectedVisible(!areDisconnectedVisible)}
          />
          <span>Show members without google agenda</span>
        </label>
      </div>
    </>
  );
};
