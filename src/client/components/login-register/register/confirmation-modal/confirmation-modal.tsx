"use client";

import { Dialog, DialogContent } from "@/client/components/ui/dialog";
import { ButtonCustom } from "@/client/components/ui/button-custom";
import { UnderlinedLink } from "@/client/components/login-register/underlined-link";
import { InfoRow } from "@/client/components/login-register/register/confirmation-modal/info-row";

//---------------- HARDCODED VALUES ----------------
const MODAL_TITLE = "Kindly Confirm Your Organisation Details";
const MODAL_DESCRIPTION =
  "An organisation can only create ONE account on the portal, clicking confirm will tie this organisation to your account.<br><br>Your details here will also help us obtain relevant information about your company from ACRA to ease your process in answering the questions for the survey.";
const ORGANIZATION_NAME_LABEL = "Name of organisation";
const ORGANIZATION_UEN_LABEL = "Organisation UEN";
const EDIT_BUTTON_TEXT = "Edit details";
const CONFIRM_LINK_TEXT = "Confirm";
const CONFIRM_LINK_HREF = "#";
//---------------- END HARDCODED VALUES ----------------

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationName: string;
  uen: string;
  onConfirm: () => void;
  onEdit: () => void;
};

export default function ConfirmationModal({
  open,
  onOpenChange,
  organizationName,
  uen,
  onConfirm,
  onEdit,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3/5 xl:max-w-1/2 p-6 lg:p-8 3xl:p-10 4xl:max-w-[50rem]">
        <h2>{MODAL_TITLE}</h2>

        <p dangerouslySetInnerHTML={{ __html: MODAL_DESCRIPTION }} />

        <div className="mt-2 2.5xl:mt-4 space-y-5">
          <InfoRow label={ORGANIZATION_NAME_LABEL} value={organizationName} />
          <InfoRow label={ORGANIZATION_UEN_LABEL} value={uen} />
        </div>

        <div className="mt-4 2.5xl:mt-6 flex justify-between items-center">
          <ButtonCustom bordered onClick={onEdit} className="px-6">
            {EDIT_BUTTON_TEXT}
          </ButtonCustom>
          <UnderlinedLink href={CONFIRM_LINK_HREF} onClick={onConfirm} className="">
            {CONFIRM_LINK_TEXT}
          </UnderlinedLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
