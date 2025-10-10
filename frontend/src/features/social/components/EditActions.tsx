"use client";

import { Button } from "@frontend/components/ui/button";
import { EditActionsProps } from "../types/social.types";

const EditActions: React.FC<EditActionsProps> = ({
  onSave,
  onCancel,
  isUpdating,
}) => {
  return (
    <div className="flex gap-2 justify-end pt-2 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isUpdating}
      >
        Cancel
      </Button>
      <Button
        size="sm"
        onClick={onSave}
        disabled={isUpdating}
        className="min-w-[100px]"
      >
        {isUpdating ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
};

export default EditActions;
