import DriftLoader from "react-driftjs";

export const Drift = () => {
  return (
    !!process.env.NEXT_PUBLIC_DRIFT_ID && (
      <DriftLoader appId={process.env.NEXT_PUBLIC_DRIFT_ID} />
    )
  );
};
