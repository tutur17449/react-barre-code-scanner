import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Scanner from "./Scanner";
import BarreCodeDetails from "./BarreCodeDetails";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    borderRadius: "10px",
    height: "80vh",
    width: "90vh",
    margin: "auto",
    overflowY: "scroll",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4, 2, 4, 3),
  },
}));

export default function ScannerWrapper() {
  const classes = useStyles();
  const [barreCode, setBarreCode] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setBarreCode(null);
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="default"
        startIcon={<PhotoCameraIcon />}
        onClick={handleOpen}
      >
        Scan barre code
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Scan code barre</h2>
            <Scanner barreCode={barreCode} setBarreCode={setBarreCode} />
            {barreCode && <BarreCodeDetails barreCode={barreCode} />}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
