const VehicleSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-text skeleton-brand"></div>
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-model"></div>
        <div className="skeleton-specs">
          <div className="skeleton-text skeleton-spec"></div>
          <div className="skeleton-text skeleton-spec"></div>
          <div className="skeleton-text skeleton-spec"></div>
        </div>
        <div className="skeleton-footer">
          <div className="skeleton-text skeleton-price"></div>
          <div className="skeleton-text skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSkeleton;
