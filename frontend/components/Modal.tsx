import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface ModalPropType {
  open: boolean;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateDetails?: React.Dispatch<
    React.SetStateAction<{ title: string; credit: number } | null>
  >;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  open,
  setOpen,
  setUpdateDetails,
  children,
}: ModalPropType) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (setUpdateDetails) {
      setUpdateDetails(null);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="rounded-lg" sx={style}>
          {children}
        </Box>
      </Modal>
    </div>
  );
}
