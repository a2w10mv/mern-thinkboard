import { AlertTriangleIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="mx-auto max-w-[1400px] p-4 mt-2 mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="alert alert-error shadow-lg border border-error/20 bg-error/10 text-error-content">
        <AlertTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-error" />
        <div>
          <h3 className="font-bold text-error">Rate Limit Exceeded</h3>
          <div className="text-xs text-error/80 mt-1">
            You are making requests too quickly. Please wait a moment before trying again.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
