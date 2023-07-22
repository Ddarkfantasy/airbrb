import { SnackbarProvider } from "notistack";
// import SnackbarCloseButton from "./SnackbarCloseButton";

const MAX_SNACK = 3;
const AUTO_HIDE_DURATION = 2000;
const POSITION = {
  vertical: "top",
  horizontal: "center",
};

export default function NotistackWrapper({ children }) {
  return (
    <SnackbarProvider
			preventDuplicate={true}
      maxSnack={MAX_SNACK}
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={POSITION}
			// action={(key) => <SnackbarCloseButton id={key} />}
    >
      {children}
    </SnackbarProvider>
  );
}