const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tabs">
      <button
        className={activeTab === "original" ? "active" : ""}
        onClick={() => setActiveTab("original")}
      >
        Original Articles
      </button>

      <button
        className={activeTab === "updated" ? "active" : ""}
        onClick={() => setActiveTab("updated")}
      >
        Updated Articles
      </button>
    </div>
  );
};

export default Tabs;
